package com.kitticai.meno;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Self-update. Reads latest.json from the newest GitHub release on launch and resume
 * (at most every 10 minutes). If its versionCode is higher, offers to download the APK
 * and hands it to the system installer. Every build must be signed with the same key.
 */
final class Updater {

    private static final String FEED = "https://github.com/MichaelKitticai/meno/releases/latest/download/latest.json";
    private static final String APK_NAME = "meno-update.apk";
    private static final String APK_MIME = "application/vnd.android.package-archive";
    private static final long AUTO_CHECK_MS = 10 * 60 * 1000L;

    private static final ExecutorService IO = Executors.newSingleThreadExecutor();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    private static long lastAutoCheck;
    private static boolean dialogShowing;
    private static Info pendingAfterPermission;

    private static final class Info {
        int versionCode;
        String versionName;
        String apkUrl;
        String notes;
    }

    private Updater() { }

    static void check(Activity activity, boolean userAsked) {
        if (!userAsked) {
            if (dialogShowing || System.currentTimeMillis() - lastAutoCheck < AUTO_CHECK_MS) return;
            lastAutoCheck = System.currentTimeMillis();
        }
        IO.execute(() -> {
            Info info;
            try {
                info = fetch();
            } catch (Exception e) {
                if (userAsked) toast(activity, "Could not check for updates. Try again when you have signal.");
                else lastAutoCheck = 0; // Offline: try again on the next resume.
                return;
            }
            if (info.versionCode <= BuildConfig.VERSION_CODE) {
                if (userAsked) toast(activity, "Meno is up to date (" + BuildConfig.VERSION_NAME + ").");
                return;
            }
            MAIN.post(() -> {
                if (activity.isFinishing() || activity.isDestroyed() || dialogShowing) return;
                showDialog(activity, info);
            });
        });
    }

    /** Continues an update after the person comes back from "Allow from this source". */
    static void resumeIfPending(Activity activity) {
        Info info = pendingAfterPermission;
        if (info != null && activity.getPackageManager().canRequestPackageInstalls()) {
            pendingAfterPermission = null;
            download(activity, info);
        }
    }

    private static Info fetch() throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(FEED).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(15000);
        c.setUseCaches(false);
        c.setRequestProperty("Cache-Control", "no-cache");
        try {
            if (c.getResponseCode() != 200) throw new IllegalStateException("HTTP " + c.getResponseCode());
            StringBuilder sb = new StringBuilder();
            try (BufferedReader r = new BufferedReader(new InputStreamReader(c.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = r.readLine()) != null) sb.append(line);
            }
            JSONObject o = new JSONObject(sb.toString());
            Info i = new Info();
            i.versionCode = o.getInt("versionCode");
            i.versionName = o.getString("versionName");
            i.apkUrl = o.getString("apkUrl");
            i.notes = o.optString("notes", "");
            return i;
        } finally {
            c.disconnect();
        }
    }

    private static void showDialog(Activity activity, Info info) {
        String msg = "Version " + info.versionName + " is ready to install.";
        if (!info.notes.isEmpty()) msg += "\n\nWhat's new:\n" + info.notes;
        dialogShowing = true;
        new AlertDialog.Builder(activity)
                .setTitle("Update available")
                .setMessage(msg)
                .setOnDismissListener(d -> dialogShowing = false)
                .setPositiveButton("Update now", (d, w) -> accepted(activity, info))
                .setNegativeButton("Later", null)
                .show();
    }

    private static void accepted(Activity activity, Info info) {
        if (activity.getPackageManager().canRequestPackageInstalls()) {
            download(activity, info);
            return;
        }
        pendingAfterPermission = info;
        new AlertDialog.Builder(activity)
                .setTitle("Allow updates")
                .setMessage("Android asks once. On the next screen turn on \"Allow from this source\", then come back and the update starts.")
                .setPositiveButton("Open settings", (d, w) -> activity.startActivity(new Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + activity.getPackageName()))))
                .setNegativeButton("Cancel", (d, w) -> pendingAfterPermission = null)
                .show();
    }

    private static void download(Activity activity, Info info) {
        Context app = activity.getApplicationContext();
        File apk = apkFile(app);
        if (apk.exists()) apk.delete();
        DownloadManager dm = (DownloadManager) app.getSystemService(Context.DOWNLOAD_SERVICE);
        long id;
        try {
            DownloadManager.Request r = new DownloadManager.Request(Uri.parse(info.apkUrl))
                    .setTitle("Meno " + info.versionName)
                    .setDescription("Downloading update")
                    .setMimeType(APK_MIME)
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                    .setDestinationInExternalFilesDir(app, Environment.DIRECTORY_DOWNLOADS, APK_NAME);
            id = dm.enqueue(r);
        } catch (Exception e) {
            toast(activity, "Could not start the download. Try again.");
            return;
        }
        AlertDialog progress = new AlertDialog.Builder(activity)
                .setTitle("Downloading update")
                .setMessage("Starting")
                .setCancelable(false)
                .show();
        poll(activity, dm, id, progress);
    }

    private static void poll(Activity activity, DownloadManager dm, long id, AlertDialog progress) {
        MAIN.postDelayed(() -> {
            int status = -1;
            long done = 0, total = 0;
            try (Cursor c = dm.query(new DownloadManager.Query().setFilterById(id))) {
                if (c != null && c.moveToFirst()) {
                    status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                    done = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                    total = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                }
            } catch (Exception ignored) { }

            if (activity.isDestroyed()) return;
            if (status == DownloadManager.STATUS_SUCCESSFUL) {
                progress.dismiss();
                install(activity);
            } else if (status == DownloadManager.STATUS_FAILED || status == -1) {
                progress.dismiss();
                toast(activity, "The update did not download. Check your connection and try again.");
            } else {
                if (total > 0) progress.setMessage((done * 100 / total) + "%");
                poll(activity, dm, id, progress);
            }
        }, 700);
    }

    private static void install(Activity activity) {
        File apk = apkFile(activity.getApplicationContext());
        if (!apk.exists() || apk.length() == 0) {
            toast(activity, "The update file was empty. Try again.");
            return;
        }
        Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".fileprovider", apk);
        Intent i = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, APK_MIME)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            activity.startActivity(i);
        } catch (Exception e) {
            toast(activity, "Could not open the installer.");
        }
    }

    private static File apkFile(Context c) {
        return new File(c.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), APK_NAME);
    }

    private static void toast(Activity activity, String text) {
        MAIN.post(() -> {
            if (!activity.isFinishing()) Toast.makeText(activity, text, Toast.LENGTH_LONG).show();
        });
    }
}
