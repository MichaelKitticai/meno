# Meno

Dental clinic scheduler prototype for a clinic in Nairobi. Android app with three switchable designs, live sync between phones and over-the-air self-update.

Sample patients only. The demo database is open to anyone with the app, so never enter real patient details.

Every push to `main` builds a signed APK and publishes it with `latest.json`. The app reads that feed on launch and on resume, at most every 10 minutes. All builds must use the same signing key.
