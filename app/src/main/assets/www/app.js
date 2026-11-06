(function () {
  var SB_URL = 'https://zvrkbixpzrbesuwsuqvk.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cmtiaXhwenJiZXN1d3N1cXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MjQ3NTcsImV4cCI6MjEwOTQwMDc1N30.3P7wBkxQkKFi2X1yjUuzXliVXgG73x5Ml-_hU1YoWq8';

  var PEOPLE = [
    { id: 'wanjiku', name: 'Wanjiku K.', first: 'Wanjiku', role: 'Reception', chair: 0 },
    { id: 'mwangi', name: 'Dr. N. Mwangi', first: 'Dr. Mwangi', role: 'Dentist', chair: 1 },
    { id: 'ochieng', name: 'Dr. A. Ochieng', first: 'Dr. Ochieng', role: 'Dentist', chair: 2 },
    { id: 'chebet', name: 'L. Chebet', first: 'Chebet', role: 'Hygienist', chair: 3 },
    { id: 'mary', name: 'Mary W.', first: 'Mary', role: 'Nurse', chair: 1 },
    { id: 'joyce', name: 'Joyce A.', first: 'Joyce', role: 'Nurse', chair: 2 }
  ];
  var CHAIRS = { 1: 'Dr. N. Mwangi · Nurse Mary', 2: 'Dr. A. Ochieng · Nurse Joyce', 3: 'L. Chebet · Hygiene' };
  var DESIGNS = { a: 'A. Chair Board', b: 'B. Patient Flow', c: 'C. Today at a Glance' };
  var NEXT = { Booked: 'Confirmed', Confirmed: 'Arrived', Arrived: 'In chair', 'In chair': 'To pay', 'To pay': 'Done' };
  var VERB = { Booked: 'Confirm', Confirmed: 'Check in', Arrived: 'Send to chair', 'In chair': 'Finish, send to pay', 'To pay': 'Mark paid' };
  var SAID = { Confirmed: 'is confirmed', Arrived: 'has arrived', 'In chair': 'is in the chair', 'To pay': 'finished, now paying', Done: 'is done', 'No-show': 'did not come', Cancelled: 'was cancelled', Booked: 'is booked' };
  var ACTIVE = ['Booked', 'Confirmed', 'Arrived'];
  var DAY_START = 480, DAY_END = 780, PX30 = 64;

  function ap(id, t, dur, chair, patient, proc, status, extra) {
    var e = extra || {}, n = t.split(':');
    return { id: id, start_min: +n[0] * 60 + +n[1], dur: dur, chair: chair, patient: patient, phone: e.phone || '', proc: proc, status: status, alert: e.alert || '', payer: e.payer || 'Cash / M-Pesa', note: e.note || '', prep: e.prep || '', fee: e.fee || 0, late: false, arrived_at: e.arrived || null, seated_at: e.seated || null, doc_note: '', follow_up: '' };
  }
  function seedAppts() {
    var now = Date.now(), m = 60000;
    return [
      ap('a1', '8:00', 30, 1, 'Grace Wanjiru', 'Check-up', 'Done', { payer: 'SHA', phone: '+254 722 000 101', fee: 2500 }),
      ap('a2', '8:30', 60, 1, 'Brian Otieno', 'Root canal, tooth 36', 'To pay', { payer: 'AAR, pre-auth OK', phone: '+254 733 000 102', fee: 18000 }),
      ap('a3', '10:00', 30, 1, 'Faith Achieng', 'Filling, tooth 14', 'In chair', { alert: 'Penicillin allergy', phone: '+254 711 000 103', fee: 4500, arrived: now - 20 * m, seated: now - 12 * m }),
      ap('a4', '10:30', 60, 1, 'Dennis Mutua', 'Crown fit, tooth 46', 'Arrived', { payer: 'AAR', phone: '+254 720 000 104', prep: 'crown from lab, cement tray', note: 'Crown due back from lab today', fee: 25000, arrived: now - 2 * m }),
      ap('a5', '12:00', 30, 1, 'Amina Hassan', 'Consultation, new patient', 'Confirmed', { payer: 'SHA', phone: '+254 701 000 105', prep: 'intake form, X-ray room', note: 'Nervous patient, allow extra time', fee: 2000 }),
      ap('b0', '8:00', 30, 2, 'Alice Muthoni', 'Check-up', 'Done', { phone: '+254 722 000 200', note: 'Routine six-month check and clean', fee: 2500 }),
      ap('b1', '8:30', 30, 2, 'Kevin Kiprotich', 'Extraction, tooth 48', 'Done', { phone: '+254 712 000 201', payer: 'CIC', note: 'Wisdom tooth pain for two weeks', fee: 3000 }),
      ap('b5', '9:00', 30, 2, 'Tom Wekesa', 'Filling, tooth 36', 'Done', { phone: '+254 733 000 205', payer: 'Jubilee', note: 'Decay found at last check-up', fee: 4500 }),
      ap('b2', '9:30', 60, 2, 'Mercy Njeri', 'Braces adjustment', 'In chair', { payer: 'CIC', phone: '+254 723 000 202', note: 'Monthly wire tightening', fee: 6000, arrived: now - 50 * m, seated: now - 41 * m }),
      ap('b6', '10:30', 30, 2, 'Daniel Mwaura', 'Filling, tooth 26', 'Arrived', { phone: '+254 711 000 206', note: 'Upper left molar hurts with cold drinks', fee: 4500, arrived: now - 6 * m }),
      ap('b3', '11:00', 30, 2, 'Peter Kamau', 'Emergency, toothache', 'Booked', { phone: '+254 714 000 203', prep: 'X-ray ready', note: 'Severe pain lower right since last night, swollen cheek', fee: 2500 }),
      ap('b7', '11:30', 30, 2, 'Sharon Atieno', 'Braces adjustment', 'Confirmed', { phone: '+254 701 000 207', note: 'Monthly wire tightening', fee: 6000 }),
      ap('b4', '12:00', 60, 2, 'Lucy Wambui', 'Implant review', 'Confirmed', { alert: 'On warfarin', payer: 'AAR', phone: '+254 708 000 204', prep: 'latest INR result', note: 'Checking how the implant has healed, 6 weeks on', fee: 5000 }),
      ap('c1', '8:00', 60, 3, 'Samuel Kibet', 'Scaling and polish', 'Done', { payer: 'Britam', phone: '+254 722 000 301', fee: 4000 }),
      ap('c2', '9:30', 30, 3, 'Esther Moraa', 'Perio maintenance', 'No-show', { payer: 'Jubilee', phone: '+254 733 000 302', note: 'Call to rebook' }),
      ap('c3', '10:00', 60, 3, 'Joseph Njoroge', 'Scaling', 'Arrived', { alert: 'Diabetic', payer: 'SHA', phone: '+254 711 000 303', prep: 'ultrasonic scaler', fee: 4000, arrived: now - 14 * m }),
      ap('c4', '11:30', 30, 3, 'Ann Wairimu', 'Child check-up', 'Confirmed', { payer: 'Jubilee', phone: '+254 720 000 304', prep: 'child bib, parent consent form', fee: 2000 })
    ];
  }
  function seedTasks() {
    return [
      { id: 't1', text: 'Log morning autoclave cycle', who: 'joyce', done: true },
      { id: 't2', text: 'Call Esther Moraa to rebook', who: 'wanjiku', done: false },
      { id: 't3', text: 'Confirm Peter Kamau, 11:00', who: 'wanjiku', done: false },
      { id: 't4', text: 'Check crown delivery from lab', who: 'mary', done: false },
      { id: 't5', text: 'Review X-ray', who: 'ochieng', done: false, appt: 'b3' },
      { id: 't6', text: 'Sign treatment plan', who: 'ochieng', done: false, appt: 'b4' },
      { id: 't9', text: 'Check INR result', who: 'ochieng', done: false, appt: 'b4' },
      { id: 't10', text: 'Write up braces notes', who: 'ochieng', done: false, appt: 'b2' },
      { id: 't11', text: 'Call back Brian Otieno about pain after root canal', who: 'ochieng', done: false },
      { id: 't12', text: 'Update KMPDC practising licence details', who: 'ochieng', done: false },
      { id: 't13', text: 'Sign off this week\'s autoclave log', who: 'ochieng', done: false },
      { id: 't7', text: 'Sign Dennis Mutua crown record', who: 'mwangi', done: false },
      { id: 't8', text: 'Restock prophy paste', who: 'chebet', done: false }
    ];
  }

  /* ---------- Local state ---------- */
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var S = {
    me: load('me', null), design: load('design', 'a'), tab: 'today', appts: load('appts', null) || seedAppts(), tasks: load('tasks', null) || seedTasks(),
    outbox: load('outbox', { appts: {}, tasks: {} }), online: false, filter: 0, cTab: 'patients', q: '', flash: null,
    prefs: load('prefs', { arrivals: true, alerts: true, tasks: false }), day: null, sheetAppt: null
  };
  function person() { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].id === S.me) return PEOPLE[i]; return null; }
  function byId(id) { for (var i = 0; i < S.appts.length; i++) if (S.appts[i].id === id) return S.appts[i]; return null; }
  function live() { return S.appts.filter(function (a) { return a.status !== 'Cancelled'; }).sort(function (x, y) { return x.start_min - y.start_min; }); }
  function mine(p) { return live().filter(function (a) { return p.chair === 0 || a.chair === p.chair; }); }
  function persist() { save('appts', S.appts); save('tasks', S.tasks); save('outbox', S.outbox); }

  /* ---------- Sync: local first, then Supabase; anything unsent waits in the outbox ---------- */
  var sb = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false } }); } catch (e) {}
  function setOnline(v) { if (S.online !== v) { S.online = v; var el = document.querySelector('.sync'); if (el) syncEl(el); } }
  function syncEl(el) { el.className = 'sync' + (S.online ? '' : ' off'); el.innerHTML = '<i></i>' + (S.online ? 'Live' : 'Offline, saved here'); }
  function flush() {
    if (!sb) return;
    var a = Object.keys(S.outbox.appts).map(function (k) { return S.outbox.appts[k]; });
    var t = Object.keys(S.outbox.tasks).map(function (k) { return S.outbox.tasks[k]; });
    if (a.length) sb.from('appointments').upsert(a).then(function (r) { if (!r.error) { a.forEach(function (x) { if (S.outbox.appts[x.id] === x) delete S.outbox.appts[x.id]; }); persist(); } });
    if (t.length) sb.from('tasks').upsert(t).then(function (r) { if (!r.error) { t.forEach(function (x) { if (S.outbox.tasks[x.id] === x) delete S.outbox.tasks[x.id]; }); persist(); } });
  }
  var BLANK = { doc_note: '', follow_up: '', appt: '' };
  function clean(row, keys) { var o = {}; keys.forEach(function (k) { o[k] = row[k] === undefined ? (k in BLANK ? BLANK[k] : null) : row[k]; }); return o; }
  var AK = ['id', 'start_min', 'dur', 'chair', 'patient', 'phone', 'proc', 'status', 'alert', 'payer', 'note', 'prep', 'fee', 'late', 'arrived_at', 'seated_at', 'doc_note', 'follow_up'];
  var TK = ['id', 'text', 'who', 'done', 'appt'];
  function pull() {
    if (!sb) return;
    Promise.all([sb.from('appointments').select('*'), sb.from('tasks').select('*')]).then(function (rs) {
      if (rs[0].error || rs[1].error) { setOnline(false); return; }
      setOnline(true);
      if (!rs[0].data.length) { resetDemo(true); return; }
      var changed = false;
      rs[0].data.forEach(function (r) { if (applyAppt(r)) changed = true; });
      var ids = {}; rs[0].data.forEach(function (r) { ids[r.id] = 1; });
      var kept = S.appts.filter(function (a) { return ids[a.id] || S.outbox.appts[a.id]; });
      if (kept.length !== S.appts.length) { S.appts = kept; changed = true; }
      rs[1].data.forEach(function (r) { if (applyTask(r)) changed = true; });
      if (changed) { persist(); render(); }
      flush();
    }).catch(function () { setOnline(false); });
  }
  function same(a, b, keys) { for (var i = 0; i < keys.length; i++) if (a[keys[i]] !== b[keys[i]]) return false; return true; }
  function applyAppt(r) {
    if (S.outbox.appts[r.id]) return false;
    var row = clean(r, AK), cur = byId(r.id);
    if (cur && same(cur, row, AK)) return false;
    var p = person();
    if (p && (p.chair === 0 || row.chair === p.chair || (cur && cur.chair === p.chair))) announce(row, cur);
    if (cur) Object.assign(cur, row); else S.appts.push(row);
    S.flash = row.id;
    return true;
  }
  function applyTask(r) {
    if (S.outbox.tasks[r.id]) return false;
    var row = clean(r, TK), i, cur = null;
    for (i = 0; i < S.tasks.length; i++) if (S.tasks[i].id === r.id) cur = S.tasks[i];
    if (cur && same(cur, row, TK)) return false;
    if (cur) Object.assign(cur, row); else { S.tasks.push(row); if (row.who === S.me && S.prefs.tasks) banner('New task', row.text); }
    return true;
  }
  function announce(row, cur) {
    if (!cur) { banner('New booking', row.patient + ' at ' + hhmm(row.start_min) + ', Chair ' + row.chair); return; }
    if (cur.status !== row.status) { if (row.status === 'Arrived' && !S.prefs.arrivals) return; banner(row.patient + ' ' + (SAID[row.status] || 'was updated'), row.proc + ' · Chair ' + row.chair); }
    else if (cur.late !== row.late) banner(row.patient + (row.late ? ' is running late' : ' is on time again'), hhmm(row.start_min) + ' · Chair ' + row.chair);
    else if (cur.start_min !== row.start_min || cur.chair !== row.chair) banner(row.patient + ' moved', hhmm(row.start_min) + ', Chair ' + row.chair);
    else banner(row.patient + ' was updated', row.proc);
  }
  function startRealtime() {
    if (!sb) return;
    sb.channel('meno')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, function (p) {
        if (p.eventType === 'DELETE') { pull(); return; }
        if (applyAppt(p.new)) { persist(); render(); }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, function (p) {
        if (p.eventType === 'DELETE') { pull(); return; }
        if (applyTask(p.new)) { persist(); render(); }
      })
      .subscribe();
    pull();
    setInterval(function () { flush(); pull(); }, 4000);
  }
  function commitAppt(a) { S.outbox.appts[a.id] = clean(a, AK); persist(); S.flash = a.id; render(); flush(); }
  function commitTask(t) { S.outbox.tasks[t.id] = clean(t, TK); persist(); render(); flush(); }
  function resetDemo(quiet) {
    S.appts = seedAppts(); S.tasks = seedTasks(); S.outbox = { appts: {}, tasks: {} }; persist(); render();
    if (!sb) { if (!quiet) banner('Demo reset', 'Back to the morning list on this phone.'); return; }
    sb.from('appointments').delete().neq('id', '').then(function () {
      return sb.from('tasks').delete().neq('id', '');
    }).then(function () {
      return Promise.all([sb.from('appointments').upsert(S.appts.map(function (a) { return clean(a, AK); })), sb.from('tasks').upsert(S.tasks.map(function (t) { return clean(t, TK); }))]);
    }).then(function () { if (!quiet) banner('Demo reset', 'All phones are back to the morning list.'); }).catch(function () {});
  }

  /* ---------- Small helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hhmm(m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); }
  function sCls(s) { return 's-' + s.replace(/[ -]/g, ''); }
  function pill(s) { return '<span class="pill ' + sCls(s) + '">' + esc(s) + '</span>'; }
  function lateTag(a) { return a.late && ACTIVE.indexOf(a.status) !== -1 ? '<span class="late">Late</span>' : ''; }
  function mins(ts) { return ts ? Math.max(0, Math.round((Date.now() - ts) / 60000)) : 0; }
  function dateStr() { return new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function flashCls(a) { return S.flash === a.id ? ' flash' : ''; }
  function alertBox(a) { return a.alert ? '<div class="alert">Alert: ' + esc(a.alert) + '</div>' : ''; }
  function syncHtml() { return '<span class="sync' + (S.online ? '' : ' off') + '"><i></i>' + (S.online ? 'Live' : 'Offline, saved here') + '</span>'; }
  function kes(n) { return 'KES ' + Number(n || 0).toLocaleString('en-US'); }
  function act(a, cls) { return NEXT[a.status] ? '<button class="btn ' + (cls || 'sm') + '" data-do="next" data-id="' + a.id + '">' + VERB[a.status] + '</button>' : ''; }

  var bannerT;
  function banner(title, text) {
    var b = document.getElementById('banner');
    b.innerHTML = '<b>' + esc(title) + '</b><span>' + esc(text || '') + '</span>';
    b.hidden = false;
    try { if (window.MenoApp) window.MenoApp.buzz(); } catch (e) {}
    clearTimeout(bannerT); bannerT = setTimeout(function () { b.hidden = true; }, 4500);
  }

  /* ---------- Shared lists ---------- */
  function tasksFor(p) { return S.tasks.filter(function (t) { return p.chair === 0 || t.who === p.id; }); }
  function taskRow(t, showWho) {
    var w = PEOPLE.filter(function (x) { return x.id === t.who; })[0], pa = t.appt ? byId(t.appt) : null;
    return '<button class="task' + (t.done ? ' done' : '') + '" data-do="task" data-id="' + t.id + '"><i>' + (t.done ? '✓' : '') + '</i><span class="grow">' + esc(t.text) + (pa ? ', ' + esc(pa.patient) : '') + (showWho && w ? '<br><span class="sub">' + esc(w.name) + '</span>' : '') + '</span></button>';
  }
  function tasksView(p) {
    var list = tasksFor(p);
    return (p.chair === 0 ? '<button class="btn primary" data-do="addtask">Add a task</button>' : '') +
      '<div class="between"><span class="h2">' + (p.chair === 0 ? 'All tasks' : 'My tasks') + '</span><span class="sub">' + list.filter(function (t) { return !t.done; }).length + ' to do</span></div>' +
      (list.length ? list.map(function (t) { return taskRow(t, p.chair === 0); }).join('') : '<p class="empty">No tasks right now.</p>');
  }
  function patientsView() {
    var q = S.q.toLowerCase();
    var list = live().filter(function (a) { return !q || a.patient.toLowerCase().indexOf(q) !== -1 || a.phone.replace(/\s/g, '').indexOf(q.replace(/\s/g, '')) !== -1; });
    return '<div class="field"><label for="q">Search name or phone</label><input id="q" type="search" value="' + esc(S.q) + '" placeholder="e.g. Faith or 0711"></div>' +
      (list.length ? list.map(function (a) {
        return '<button class="card tap" data-do="open" data-id="' + a.id + '"><span class="between"><span class="name">' + esc(a.patient) + '</span>' + pill(a.status) + '</span><span class="sub">' + hhmm(a.start_min) + ' · ' + esc(a.proc) + ' · Chair ' + a.chair + '</span><span class="sub">' + esc(a.phone) + ' · ' + esc(a.payer) + '</span>' + (a.alert ? '<span class="alert">Alert: ' + esc(a.alert) + '</span>' : '') + '</button>';
      }).join('') : '<p class="empty">No patient matches that search.</p>');
  }
  function meView(p) {
    var v = (window.MenoApp && window.MenoApp.versionName) ? window.MenoApp.versionName() : 'browser';
    return '<div class="card"><span class="h2">Signed in as</span>' + PEOPLE.map(function (x) {
      return '<button class="opt' + (x.id === S.me ? ' on' : '') + '" data-do="me" data-id="' + x.id + '"><span class="grow"><span class="name">' + esc(x.name) + '</span><br><span class="sub">' + x.role + (x.chair ? ' · Chair ' + x.chair : '') + '</span></span></button>';
    }).join('') + '</div>' +
      '<div class="card"><span class="h2">Design</span>' + Object.keys(DESIGNS).map(function (k) {
        return '<button class="opt' + (k === S.design ? ' on' : '') + '" data-do="design" data-id="' + k + '"><span class="name">' + DESIGNS[k] + '</span></button>';
      }).join('') + '</div>' +
      '<div class="card"><span class="h2">App</span><span class="sub">Version ' + esc(v) + ' · ' + (S.online ? 'Connected, changes sync live' : 'Offline, changes are saved here and sync later') + '</span>' +
      '<div class="btns"><button class="btn" data-do="update">Check for updates</button><button class="btn danger" data-do="askreset">Reset demo data</button></div>' +
      '<span class="sub">Sample patients only. Do not enter real patient details.</span></div>';
  }
  function tabsHtml(labels) {
    var ids = ['today', 'patients', 'tasks', 'me'];
    return '<nav class="tabs" aria-label="App">' + ids.map(function (id, i) { return '<button class="' + (S.tab === id ? 'on' : '') + '" data-do="tab" data-id="' + id + '">' + labels[i] + '</button>'; }).join('') + '</nav>';
  }

  /* ---------- Design A: Chair Board ---------- */
  function aReception() {
    var times = '', t;
    for (t = 0; t < 10; t++) times += '<div style="top:' + (t * PX30 + 4) + 'px">' + hhmm(DAY_START + t * 30) + '</div>';
    var cols = [1, 2, 3].map(function (c) {
      var slots = '', i;
      for (i = 0; i < 10; i++) slots += '<button class="slot" aria-label="Book Chair ' + c + ' at ' + hhmm(DAY_START + i * 30) + '" data-do="book" data-chair="' + c + '" data-start="' + (DAY_START + i * 30) + '" style="top:' + (i * PX30) + 'px"></button>';
      var blocks = live().filter(function (a) { return a.chair === c; }).map(function (a) {
        var top = (a.start_min - DAY_START) / 30 * PX30, h = a.dur / 30 * PX30, faded = a.status === 'Done' || a.status === 'No-show';
        return '<button class="ap c' + (c - 1) + (faded ? ' faded' : '') + flashCls(a) + '" data-do="open" data-id="' + a.id + '" style="top:' + (top + 2) + 'px;height:' + (h - 4) + 'px"><span class="l1"><b>' + esc(a.patient) + '</b>' + (a.late && ACTIVE.indexOf(a.status) !== -1 ? '<span class="late" style="font-size:10px;padding:1px 6px">Late</span>' : pill(a.status)) + '</span><span class="t">' + hhmm(a.start_min) + ' · ' + esc(a.proc) + '</span>' + (a.alert ? '<span class="a">! ' + esc(a.alert) + '</span>' : '') + '</button>';
      }).join('');
      return '<div class="col">' + slots + blocks + '</div>';
    }).join('');
    var heads = [1, 2, 3].map(function (c) { return '<div class="board-h"><b>Chair ' + c + '</b><span>' + esc(CHAIRS[c]) + '</span></div>'; }).join('');
    var waiting = live().filter(function (a) { return a.status === 'Arrived'; });
    var attention = live().filter(function (a) { return a.status === 'No-show' || a.status === 'Booked' || a.late; });
    return '<div class="between"><span class="h2">Today by chair</span><button class="btn primary sm" data-do="book">New appointment</button></div>' +
      '<div class="split"><div class="wide board-wrap"><div class="board"><div style="height:50px;border-bottom:1px solid var(--line)"></div>' + heads + '<div class="times">' + times + '</div>' + cols + '</div></div>' +
      '<div class="side"><div class="card"><span class="h2">Waiting room</span>' + (waiting.length ? waiting.map(function (a) {
        return '<button class="tap row' + flashCls(a) + '" style="border:0;background:#F9FAFB;border-radius:8px;padding:10px 12px" data-do="open" data-id="' + a.id + '"><span class="grow"><span class="name">' + esc(a.patient) + '</span><br><span class="sub">' + hhmm(a.start_min) + ' · Chair ' + a.chair + ' · ' + esc(a.payer) + '</span></span><span class="sub" style="font-weight:700;color:#92400E">' + mins(a.arrived_at) + ' min</span></button>';
      }).join('') : '<span class="sub">Nobody waiting.</span>') + '</div>' +
      '<div class="card"><span class="h2">Needs attention</span>' + (attention.length ? attention.map(function (a) {
        var msg = a.status === 'No-show' ? 'missed ' + hhmm(a.start_min) + '. Call to rebook.' : a.late ? 'running late for ' + hhmm(a.start_min) + '.' : hhmm(a.start_min) + ' not confirmed yet.';
        return '<button class="tap row" style="border:0;background:none;padding:4px 0" data-do="open" data-id="' + a.id + '"><span class="dot" style="background:' + (a.status === 'No-show' ? '#DC2626' : '#F59E0B') + '"></span><span class="sub grow"><b style="color:#111827">' + esc(a.patient) + '</b> ' + msg + '</span></button>';
      }).join('') : '<span class="sub">All clear.</span>') + '</div></div></div>';
  }
  function aStaff(p) {
    var list = mine(p), now = list.filter(function (a) { return a.status === 'In chair'; })[0];
    var next = list.filter(function (a) { return ACTIVE.indexOf(a.status) !== -1; });
    var done = list.filter(function (a) { return a.status === 'Done' || a.status === 'To pay'; }).length;
    return '<span class="label">Now</span>' + (now ? '<div class="card a-now' + flashCls(now) + '"><div class="between"><span class="big">' + esc(now.patient) + '</span>' + pill(now.status) + '</div><span class="sub" style="font-size:14px;color:#374151">' + hhmm(now.start_min) + ' to ' + hhmm(now.start_min + now.dur) + ' · ' + esc(now.proc) + '</span>' + alertBox(now) + '<div class="btns"><button class="btn" data-do="open" data-id="' + now.id + '">Notes</button><button class="btn primary" data-do="next" data-id="' + now.id + '">Mark done</button></div></div>' : '<div class="card"><span class="sub">Nobody in the chair.</span></div>') +
      '<span class="label">Next</span>' + (next.length ? next.map(function (a) {
        return '<div class="card' + flashCls(a) + '" style="padding:12px 14px"><button class="tap row" style="border:0;background:none;padding:0" data-do="open" data-id="' + a.id + '"><span class="time">' + hhmm(a.start_min) + '</span><span class="grow"><span class="name">' + esc(a.patient) + '</span><br><span class="sub">' + esc(a.proc) + '</span></span>' + lateTag(a) + pill(a.status) + '</button>' + alertBox(a) + (a.status === 'Arrived' ? '<button class="btn primary sm" data-do="next" data-id="' + a.id + '">Call in</button>' : '') + '</div>';
      }).join('') : '<p class="empty">No more patients today.</p>') +
      (done ? '<p class="sub" style="text-align:center">' + done + ' earlier patient' + (done === 1 ? '' : 's') + ' done</p>' : '');
  }

  /* ---------- Design B: Patient Flow ---------- */
  function progress(a) {
    var n = { Arrived: 0, 'In chair': 2, 'To pay': 3 }[a.status];
    if (n === undefined) return '';
    return '<span class="steps" role="img" aria-label="' + ['Waiting to be called in', '', 'Being treated', 'Finished'][n] + '"><i' + (n > 0 ? ' class="on"' : '') + '></i><i' + (n > 1 ? ' class="on"' : '') + '></i><i' + (n > 2 ? ' class="on"' : '') + '></i></span><span class="between sub" style="font-size:11px;font-weight:700" aria-hidden="true"><span>Called in</span><span>Treating</span><span>Finished</span></span>';
  }
  function bReception() {
    var F = [['Everyone', 0], ['Dr. Mwangi', 1], ['Dr. Ochieng', 2], ['Hygiene', 3]];
    var list = live().filter(function (a) { return !S.filter || a.chair === S.filter; });
    var COL = [['Booked', ['Booked', 'Confirmed'], '#94A3B8'], ['Arrived', ['Arrived'], '#2563EB'], ['In chair', ['In chair'], '#D97706'], ['To pay', ['To pay'], '#7C3AED'], ['Done', ['Done', 'No-show'], '#16A34A']];
    return '<div class="btns"><button class="btn" data-do="walkin">Check in walk-in</button><button class="btn primary" data-do="book">New appointment</button></div>' +
      '<div class="chips">' + F.map(function (f) { return '<button class="chip' + (S.filter === f[1] ? ' on' : '') + '" data-do="filter" data-id="' + f[1] + '">' + f[0] + '</button>'; }).join('') + '</div>' +
      '<div class="flow">' + COL.map(function (c) {
        var cards = list.filter(function (a) { return c[1].indexOf(a.status) !== -1; });
        return '<section class="flow-col"><div class="between"><span class="h2" style="font-size:14px;display:flex;align-items:center;gap:8px"><span class="dot" style="background:' + c[2] + ';width:10px;height:10px"></span>' + c[0] + '</span><b class="sub">' + cards.length + '</b></div>' + cards.map(function (a) {
          var timer = a.status === 'Arrived' ? 'Waiting ' + mins(a.arrived_at) + ' min' : a.status === 'In chair' ? mins(a.seated_at) + ' min' : '';
          return '<article class="card' + flashCls(a) + '" style="padding:12px;gap:6px;flex:none' + (a.status === 'Done' || a.status === 'No-show' ? ';opacity:.7' : '') + '"><button class="tap" style="border:0;background:none;padding:0;display:flex;flex-direction:column;gap:4px" data-do="open" data-id="' + a.id + '"><span class="between"><span class="name">' + esc(a.patient) + '</span><b class="sub">' + hhmm(a.start_min) + '</b></span><span class="sub">' + esc(a.proc) + '</span><span class="sub">Chair ' + a.chair + ' · ' + (a.status === 'No-show' ? 'No-show' : esc(a.payer)) + '</span>' + (a.alert ? '<span class="tag" style="align-self:flex-start;background:#FEE2E2;color:#991B1B">' + esc(a.alert) + '</span>' : '') + lateTag(a) + (timer ? '<b style="font-size:12px;color:#92400E">' + timer + '</b>' : '') + progress(a) + '</button>' + act(a) + '</article>';
        }).join('') + '</section>';
      }).join('') + '</div>';
  }
  /* B dentist and nurse phone: Now, Tasks, Schedule, Me (from the canvas review) */
  var ICONS = {
    today: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    tasks: '<rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M8 12l3 3 5-6"></path>',
    schedule: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path>',
    me: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path>'
  };
  function svg(path, size) { return '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>'; }
  function initials(name) { var w = name.replace(/^Dr\.\s*/, '').split(/\s+/); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function apptTasks(a) { return S.tasks.filter(function (t) { return t.appt === a.id; }); }
  function bDone(a) { return a.status === 'To pay' || a.status === 'Done' || a.status === 'No-show'; }
  function bOpenTasks(p) { return tasksFor(p).filter(function (t) { return !t.done; }).length; }
  function bTabs() {
    return '<nav class="tabs b-tabs" aria-label="App">' + [['today', 'Now'], ['tasks', 'Tasks'], ['schedule', 'Schedule'], ['me', 'Me']].map(function (x) {
      return '<button class="' + (S.tab === x[0] ? 'on' : '') + '" aria-current="' + (S.tab === x[0] ? 'page' : 'false') + '" data-do="tab" data-id="' + x[0] + '">' + svg(ICONS[x[0]]) + '<span>' + x[1] + '</span></button>';
    }).join('') + '</nav>';
  }
  function bTop(p) {
    var left = mine(p).filter(function (a) { return !bDone(a); }).length;
    var title = S.tab === 'tasks' ? plural(bOpenTasks(p), 'task open', 'tasks open') : S.tab === 'schedule' ? 'Schedule' : S.tab === 'me' ? 'Me' : plural(left, 'patient left today', 'patients left today');
    return '<div class="top b-top"><div class="top-row"><h1>' + title + '</h1><span class="avatar" role="img" aria-label="' + esc(p.name) + '">' + esc(initials(p.name)) + '</span></div><div class="top-row"><small>' + esc(p.name) + ' · Chair ' + p.chair + '</small>' + syncHtml() + '</div></div>';
  }
  function bNowCard(p) {
    var now = mine(p).filter(function (a) { return a.status === 'In chair'; })[0];
    if (!now) return '<div class="b-incard free"><span class="label">Chair ' + p.chair + ' is free</span><span>Tap a waiting patient to call them in.</span></div>';
    var nurse = (CHAIRS[now.chair] || '').split(' · ')[1];
    return '<div class="b-incard' + flashCls(now) + '"><span class="label">In chair now · ' + mins(now.seated_at) + ' min</span><span class="big">' + esc(now.patient) + '</span><span>' + hhmm(now.start_min) + ' · ' + esc(now.proc) + (nurse ? ' · ' + esc(nurse) : '') + '</span>' + (now.alert ? '<span class="apill light">' + esc(now.alert) + '</span>' : '') + '<button class="b-finish" data-do="next" data-id="' + now.id + '">Finish and send to pay</button></div>';
  }
  function bCard(a) {
    var open = apptTasks(a).filter(function (t) { return !t.done; }).length, right = [];
    if (a.status === 'Arrived') right.push('Here ' + mins(a.arrived_at) + ' min');
    if (open) right.push(plural(open, 'task', 'tasks'));
    return '<button class="card tap b-card' + flashCls(a) + '" data-do="bopen" data-id="' + a.id + '"><span class="between"><span class="name">' + hhmm(a.start_min) + ' · ' + esc(a.patient) + '</span>' + (a.alert ? '<span class="apill">' + esc(a.alert) + '</span>' : '') + '</span><span class="between sub"><span class="grow">' + esc(a.proc) + '</span>' + (right.length ? '<b class="b-right">' + right.join(' · ') + '</b>' : '') + '</span></button>';
  }
  function bDoneCard(a) {
    var mark = a.status === 'Done' ? svg('<path d="M5 12.5l4.5 4.5L19 7.5"></path>', 20) : '<b class="b-right">' + (a.status === 'To pay' ? 'Paying' : 'No-show') + '</b>';
    return '<button class="card tap b-card b-past' + flashCls(a) + '" data-do="bopen" data-id="' + a.id + '"><span class="between"><span class="grow" style="display:flex;flex-direction:column;gap:6px"><span class="name">' + hhmm(a.start_min) + ' · ' + esc(a.patient) + '</span><span class="sub">' + esc(a.proc) + '</span></span>' + mark + '</span></button>';
  }
  function bTaskCard(t, showWho) {
    var a = t.appt ? byId(t.appt) : null;
    return '<div class="card b-task' + (t.done ? ' b-past' : '') + '"><span class="grow"><span class="name">' + esc(t.text) + '</span>' + (showWho && a ? '<br><span class="sub">' + esc(a.patient) + ' · ' + hhmm(a.start_min) + '</span>' : '') + '</span>' + doneBtn(t) + '</div>';
  }
  function doneBtn(t) { return '<button class="b-tbtn' + (t.done ? ' undo' : '') + '" aria-pressed="' + t.done + '" data-do="task" data-id="' + t.id + '">' + (t.done ? 'Undo' : 'Done') + '</button>'; }
  function bNow(p) {
    var list = mine(p), waiting = list.filter(function (a) { return ACTIVE.indexOf(a.status) !== -1; }), past = list.filter(bDone);
    var other = tasksFor(p).filter(function (t) { return !t.appt; });
    return '<div class="between"><span class="h2">Waiting · ' + waiting.length + '</span><span class="sub">' + plural(bOpenTasks(p), 'task open', 'tasks open') + '</span></div>' +
      (waiting.length ? waiting.map(bCard).join('') : '<p class="empty">Nobody else waiting today.</p>') +
      (other.length ? '<span class="h2 gap">Other tasks · ' + other.length + '</span>' + other.map(function (t) { return bTaskCard(t); }).join('') : '') +
      '<span class="h2 gap">Completed · ' + past.length + '</span>' + (past.length ? past.map(bDoneCard).join('') : '<p class="sub">Nobody finished yet.</p>');
  }
  function bTasks(p) {
    var list = tasksFor(p), todo = list.filter(function (t) { return !t.done; }), done = list.filter(function (t) { return t.done; });
    return '<span class="h2">To do · ' + todo.length + '</span>' + (todo.length ? todo.map(function (t) { return bTaskCard(t, true); }).join('') : '<p class="empty">All done.</p>') +
      '<span class="h2 gap">Done · ' + done.length + '</span>' + done.map(function (t) { return bTaskCard(t, true); }).join('');
  }
  function weekDays() {
    var d = new Date(), day = d.getDay(), monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - (day === 0 ? 6 : day - 1)), out = [], i;
    for (i = 0; i < 6; i++) out.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    return out;
  }
  function bSchedule(p) {
    var days = weekDays(), today = new Date().toDateString(), pick = S.day || today;
    if (!days.some(function (d) { return d.toDateString() === pick; })) pick = days[0].toDateString();
    var chosen = days.filter(function (d) { return d.toDateString() === pick; })[0];
    var strip = '<div class="b-days">' + days.map(function (d) {
      var on = d.toDateString() === pick;
      return '<button class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '" data-do="day" data-id="' + d.toDateString() + '"><span>' + d.toLocaleDateString('en-GB', { weekday: 'short' }) + '</span><b>' + d.getDate() + '</b></button>';
    }).join('') + '</div>';
    var head = chosen.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    if (pick !== today) return strip + '<span class="h2">' + head + '</span><p class="empty">Only today\'s list is in this prototype.</p>';
    var list = mine(p), STAT = { 'In chair': 'In chair', Arrived: 'Here', 'To pay': 'Paying', Done: 'Completed', 'No-show': 'No-show' };
    return strip + '<span class="h2">' + head + ' · ' + plural(list.length, 'patient', 'patients') + '</span>' + list.map(function (a) {
      var tint = a.status === 'In chair' ? ' b-chair' : bDone(a) ? ' b-past' : '';
      return '<button class="card tap b-card' + tint + flashCls(a) + '" data-do="bopen" data-id="' + a.id + '"><span class="between"><span class="name">' + hhmm(a.start_min) + ' · ' + esc(a.patient) + '</span>' + (a.alert ? '<span class="apill">' + esc(a.alert) + '</span>' : '') + '</span><span class="between sub"><span class="grow">' + esc(a.proc) + '</span>' + (STAT[a.status] ? '<b class="b-right">' + STAT[a.status] + '</b>' : '') + '</span></button>';
    }).join('');
  }
  function bMe(p) {
    var v = (window.MenoApp && window.MenoApp.versionName) ? window.MenoApp.versionName() : 'browser';
    var prefs = [['arrivals', 'Patient has arrived'], ['alerts', 'Medical alert reminders'], ['tasks', 'Task reminders']];
    return '<div class="card row"><span class="avatar big-av" aria-hidden="true">' + esc(initials(p.name)) + '</span><span class="grow"><span class="name">' + esc(p.name) + '</span><br><span class="sub">' + p.role + ' · Chair ' + p.chair + '</span></span></div>' +
      '<span class="h2 gap">Notifications</span><div class="card b-rows">' + prefs.map(function (x) {
        var on = !!S.prefs[x[0]];
        return '<div class="between b-pref"><span class="name">' + x[1] + '</span><button class="switch' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" aria-label="' + x[1] + '" data-do="pref" data-id="' + x[0] + '"><i></i></button></div>';
      }).join('') + '</div>' +
      '<span class="h2 gap">Working hours</span><div class="card"><div class="between"><b>Mon to Fri</b><span class="sub">8:00 to 18:00</span></div><div class="between"><b>Sat</b><span class="sub">9:00 to 13:00</span></div></div>' +
      '<span class="h2 gap">App</span><div class="card between"><span class="grow"><span class="name">Meno version ' + esc(v) + '</span><br><span class="sub">' + (S.online ? 'Connected, changes sync live' : 'Offline, changes are saved here') + '</span></span><button class="b-tbtn" data-do="update">Check</button></div>' +
      '<span class="h2 gap">Prototype</span><div class="card"><span class="sub">Switch person</span>' + PEOPLE.map(function (x) {
        return '<button class="opt' + (x.id === S.me ? ' on' : '') + '" data-do="me" data-id="' + x.id + '"><span class="grow"><span class="name">' + esc(x.name) + '</span><br><span class="sub">' + x.role + (x.chair ? ' · Chair ' + x.chair : '') + '</span></span></button>';
      }).join('') + '<span class="sub">Design</span>' + Object.keys(DESIGNS).map(function (k) {
        return '<button class="opt' + (k === S.design ? ' on' : '') + '" data-do="design" data-id="' + k + '"><span class="name">' + DESIGNS[k] + '</span></button>';
      }).join('') + '<button class="btn danger" data-do="askreset">Reset demo data</button><span class="sub">Sample patients only. Do not enter real patient details.</span></div>';
  }
  function bSheet(a) {
    var tasks = apptTasks(a), acts = '';
    if (a.status === 'Arrived') acts += '<button class="btn primary" data-do="next" data-id="' + a.id + '">Call in</button>';
    if (a.status === 'In chair') acts += '<button class="btn primary" data-do="next" data-id="' + a.id + '">Finish and send to pay</button>';
    if (ACTIVE.indexOf(a.status) !== -1) acts += '<button class="btn' + (a.status === 'Arrived' ? '' : ' primary') + '" data-do="bdone" data-id="' + a.id + '">Mark as completed</button>';
    if (a.status === 'To pay') acts += '<button class="btn" data-do="bback" data-id="' + a.id + '">Move back to waiting</button>';
    openSheet('<div class="handle" aria-hidden="true"></div><div class="between" style="align-items:flex-start"><span class="grow"><span class="big">' + esc(a.patient) + '</span><br><span class="sub" style="font-size:14px">' + hhmm(a.start_min) + ' · ' + esc(a.proc) + ' · Chair ' + a.chair + '</span></span><button class="xbtn" aria-label="Close" data-do="close">' + svg('<path d="M6 6l12 12M18 6L6 18"></path>', 20) + '</button></div>' +
      (a.alert ? '<span class="apill" style="align-self:flex-start;font-size:13px;padding:6px 12px">' + esc(a.alert) + '</span>' : '') +
      (a.note ? '<div class="b-field"><span class="sub b-lab">Came in with</span><span class="name">' + esc(a.note) + '</span></div>' : '') +
      (a.prep ? '<div class="b-field"><span class="sub b-lab">Prep</span><span>' + esc(a.prep) + '</span></div>' : '') +
      tasks.map(function (t) { return '<div class="between b-trow' + (t.done ? ' b-tdone' : '') + '"><span class="grow name">' + esc(t.text) + '</span>' + doneBtn(t) + '</div>'; }).join('') +
      '<label class="b-field"><span class="sub b-lab">Notes</span><textarea id="nN" data-id="' + a.id + '" rows="2" placeholder="Add a note">' + esc(a.doc_note || '') + '</textarea></label>' +
      '<label class="b-field"><span class="sub b-lab">Follow-up</span><textarea id="nF" data-id="' + a.id + '" rows="2" placeholder="What to follow up">' + esc(a.follow_up || '') + '</textarea></label>' +
      (acts ? '<div class="btns">' + acts + '</div>' : ''));
    S.sheetAppt = a.id;
  }

  /* ---------- Design C: Today at a Glance ---------- */
  function cReception(p) {
    var l = live(), count = function (s) { return l.filter(function (a) { return a.status === s; }).length; };
    var wait = l.filter(function (a) { return a.status === 'Arrived'; }), longest = wait.reduce(function (m, a) { return Math.max(m, mins(a.arrived_at)); }, 0);
    var noshow = l.filter(function (a) { return a.status === 'No-show'; })[0];
    var seated = l.filter(function (a) { return a.status === 'In chair'; }).map(function (a) { return a.chair; });
    var up = l.filter(function (a) { return ACTIVE.indexOf(a.status) !== -1; });
    var toPay = l.filter(function (a) { return a.status === 'To pay'; });
    var tiles = [['Appointments today', l.length, count('Done') + ' done, ' + up.length + ' still to come'], ['Waiting room', wait.length, wait.length ? 'Longest wait ' + longest + ' min' : 'Nobody waiting'], ['In chair', seated.length, seated.length ? 'Chair ' + seated.join(' and ') : 'All chairs free'], ['No-shows', count('No-show'), noshow ? esc(noshow.patient) : 'None today']];
    return '<div class="tiles">' + tiles.map(function (t) { return '<div class="card tile" style="gap:2px"><span class="sub" style="font-weight:600">' + t[0] + '</span><b>' + t[1] + '</b><span class="sub">' + t[2] + '</span></div>'; }).join('') + '</div>' +
      '<div class="between"><span class="h2">Up next</span><button class="btn primary sm" data-do="book">Book patient</button></div>' +
      '<div class="card" style="gap:0;padding:4px 14px">' + (up.length ? up.map(function (a, i) {
        return '<div class="' + flashCls(a).trim() + '" style="padding:12px 0;display:flex;flex-direction:column;gap:6px' + (i ? ';border-top:1px solid #EEF2EF' : '') + '"><button class="tap row" style="border:0;background:none;padding:0" data-do="open" data-id="' + a.id + '"><span class="time">' + hhmm(a.start_min) + '</span><span class="grow"><span class="name">' + esc(a.patient) + '</span><br><span class="sub">' + esc(a.proc) + ' · Chair ' + a.chair + (a.alert ? ' · ' + esc(a.alert) : '') + '</span></span>' + lateTag(a) + '<span class="pill ' + sCls(a.status) + '">' + (a.status === 'Arrived' ? 'Waiting' : a.status === 'Booked' ? 'Not confirmed' : a.status) + '</span></button>' + act(a) + '</div>';
      }).join('') : '<p class="empty">Nobody else booked today.</p>') + '</div>' +
      '<span class="h2">Team today</span><div class="card" style="gap:10px">' + PEOPLE.map(function (x) {
        var busy = x.chair && seated.indexOf(x.chair) !== -1;
        return '<div class="row"><span class="grow"><span class="name" style="font-size:14px">' + esc(x.name) + '</span><br><span class="sub">' + x.role + (x.chair ? ' · Chair ' + x.chair : '') + '</span></span><span class="pill" style="background:' + (busy ? '#FFF4E5;color:#92400E' : '#E3F1E9;color:#0F4D35') + '">' + (x.chair ? (busy ? 'With patient' : 'Free') : 'On desk') + '</span></div>';
      }).join('') + '</div>' +
      '<span class="h2">Payments</span><div class="card" style="gap:10px">' + (toPay.length ? toPay.map(function (a) {
        return '<div class="row"><span class="grow"><span class="name" style="font-size:14px">' + esc(a.patient) + '</span><br><span class="sub">' + esc(a.payer) + ' · ' + kes(a.fee) + '</span></span><button class="btn sm" data-do="next" data-id="' + a.id + '">Mark paid</button></div>';
      }).join('') : '<span class="sub">Nothing waiting for payment.</span>') + '</div>';
  }
  function cStaff(p) {
    var list = mine(p), now = list.filter(function (a) { return a.status === 'In chair'; })[0];
    var next = list.filter(function (a) { return ACTIVE.indexOf(a.status) !== -1; });
    var todo = tasksFor(p).filter(function (t) { return !t.done; });
    var seg = '<div class="seg"><button class="' + (S.cTab === 'patients' ? 'on' : '') + '" data-do="seg" data-id="patients">My patients</button><button class="' + (S.cTab === 'tasks' ? 'on' : '') + '" data-do="seg" data-id="tasks">My tasks · ' + todo.length + '</button></div>';
    if (S.cTab === 'tasks') return seg + (tasksFor(p).map(function (t) { return taskRow(t); }).join('') || '<p class="empty">No tasks right now.</p>');
    return seg + (now ? '<button class="c-now' + flashCls(now) + '" data-do="open" data-id="' + now.id + '"><span class="label">Now in Chair ' + now.chair + '</span><span class="big" style="font-size:22px">' + esc(now.patient) + '</span><span style="font-size:14px;color:#E6F3EC">' + esc(now.proc) + ' · ' + mins(now.seated_at) + ' min so far</span>' + (now.alert ? '<span class="alertp">' + esc(now.alert) + '</span>' : '') + '</button>' : '<div class="card"><span class="sub">Chair ' + p.chair + ' is free.</span></div>') +
      '<div class="between"><span class="h2">Coming up</span><span class="sub">' + next.length + ' more today</span></div>' + (next.map(function (a) {
        return '<div class="card' + flashCls(a) + '"><button class="tap" style="border:0;background:none;padding:0;display:flex;flex-direction:column;gap:6px" data-do="open" data-id="' + a.id + '"><span class="between"><span class="name" style="font-size:16px;font-weight:800">' + hhmm(a.start_min) + ' · ' + esc(a.patient) + '</span>' + lateTag(a) + '<span class="pill ' + sCls(a.status) + '">' + (a.status === 'Arrived' ? 'Waiting' : a.status) + '</span></span><span class="sub">' + esc(a.proc) + '</span>' + (a.prep ? '<span style="font-size:13px;font-weight:600">Prep: ' + esc(a.prep) + '</span>' : '') + (a.alert ? '<span class="alert">Alert: ' + esc(a.alert) + '</span>' : '') + '</button>' + (a.status === 'Arrived' ? '<button class="btn primary sm" data-do="next" data-id="' + a.id + '">Call in</button>' : '') + '</div>';
      }).join('') || '<p class="empty">No more patients today.</p>');
  }

  /* ---------- Screens ---------- */
  function welcome() {
    return '<div class="main" style="padding-top:28px"><div class="row"><span class="logo">M</span><div><h1 style="font-size:24px;font-weight:800">Meno</h1><span class="sub">Who is using this phone?</span></div></div>' + PEOPLE.map(function (x) {
      return '<button class="opt" data-do="me" data-id="' + x.id + '"><span class="grow"><span class="name">' + esc(x.name) + '</span><br><span class="sub">' + x.role + (x.chair ? ' · Chair ' + x.chair : '') + '</span></span></button>';
    }).join('') + '<span class="sub">Sample clinic with sample patients. You can change this later under Me.</span></div>';
  }
  function render() {
    document.documentElement.setAttribute('data-d', S.design);
    var app = document.getElementById('app'), p = person();
    var keepScroll = app.querySelector('.main'), st = keepScroll ? keepScroll.scrollTop : 0;
    var flowEl = app.querySelector('.flow'), fx = flowEl ? flowEl.scrollLeft : 0;
    var boardEl = app.querySelector('.board-wrap'), bx = boardEl ? boardEl.scrollLeft : 0;
    var q = document.activeElement && document.activeElement.id === 'q';
    if (!p) { app.innerHTML = welcome(); return; }
    if (S.design === 'b' && p.chair !== 0) {
      var bt = S.tab === 'patients' ? 'today' : S.tab; S.tab = bt;
      var bb = bt === 'tasks' ? bTasks(p) : bt === 'schedule' ? bSchedule(p) : bt === 'me' ? bMe(p) : bNow(p);
      app.innerHTML = bTop(p) + (bt === 'today' ? bNowCard(p) : '') + '<div class="main">' + bb + '</div>' + bTabs();
      var bm = app.querySelector('.main'); if (bm) bm.scrollTop = st;
      if (S.flash) { clearTimeout(render.ft); render.ft = setTimeout(function () { S.flash = null; }, 1700); }
      return;
    }
    var rec = p.chair === 0, d = S.design, body, top, labels = d === 'b' ? [rec ? 'Flow' : 'Now', 'Patients', 'Tasks', 'Me'] : ['Today', 'Patients', 'Tasks', 'Me'];
    var today = S.tab === 'today', title = S.tab === 'patients' ? 'Patients' : S.tab === 'tasks' ? 'Tasks' : S.tab === 'me' ? 'Me' : null;
    if (d === 'a') top = '<div class="top"><div class="top-row"><small>' + dateStr() + (rec ? ' · Reception' : ' · Chair ' + p.chair) + '</small>' + syncHtml() + '</div><h1>' + (title || (rec ? 'Clinic today' : 'My day, ' + esc(p.first))) + '</h1></div>';
    else if (d === 'b') top = '<div class="top"><div class="top-row"><small>' + dateStr() + ' · ' + esc(p.name) + '</small>' + syncHtml() + '</div><h1>' + (title || 'Patient flow') + '</h1></div>';
    else top = '<div class="top"><div class="top-row"><h1 style="font-size:26px">' + (title || 'Habari, ' + esc(p.first)) + '</h1>' + syncHtml() + '</div><small>' + (rec ? dateStr() + ' · Here is the clinic right now.' : 'Chair ' + p.chair + ' · ' + dateStr()) + '</small></div>';
    if (today) body = rec ? (d === 'a' ? aReception() : d === 'b' ? bReception() : cReception(p)) : (d === 'a' ? aStaff(p) : cStaff(p));
    else body = S.tab === 'patients' ? patientsView() : S.tab === 'tasks' ? tasksView(p) : meView(p);
    app.innerHTML = top + '<div class="main">' + body + '</div>' + tabsHtml(labels);
    var m = app.querySelector('.main'); if (m) m.scrollTop = st;
    var f2 = app.querySelector('.flow'); if (f2) f2.scrollLeft = fx;
    var b2 = app.querySelector('.board-wrap'); if (b2) b2.scrollLeft = bx;
    if (q) { var i = document.getElementById('q'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
    if (S.flash) { clearTimeout(render.ft); render.ft = setTimeout(function () { S.flash = null; }, 1700); }
  }

  /* ---------- Sheets ---------- */
  function openSheet(html) { var s = document.getElementById('sheet'); s.innerHTML = '<div class="panel">' + html + '</div>'; s.hidden = false; }
  function closeSheet() { document.getElementById('sheet').hidden = true; S.sheetAppt = null; }
  window.menoBack = function () {
    var s = document.getElementById('sheet');
    if (!s.hidden) { closeSheet(); return true; }
    if (person() && S.tab !== 'today') { S.tab = 'today'; render(); return true; }
    return false;
  };
  function detailSheet(a) {
    var rec = person().chair === 0;
    openSheet('<div class="between"><span class="big">' + esc(a.patient) + '</span>' + pill(a.status) + '</div>' +
      '<span class="sub" style="font-size:14px">' + hhmm(a.start_min) + ' to ' + hhmm(a.start_min + a.dur) + ' · Chair ' + a.chair + ' · ' + esc(CHAIRS[a.chair]) + '</span>' + alertBox(a) + lateTag(a) +
      '<div class="card" style="gap:4px"><span><b>Treatment:</b> ' + esc(a.proc) + '</span><span><b>Phone:</b> ' + esc(a.phone || 'Not given') + '</span><span><b>Payer:</b> ' + esc(a.payer) + (a.fee ? ' · ' + kes(a.fee) : '') + '</span>' + (a.prep ? '<span><b>Prep:</b> ' + esc(a.prep) + '</span>' : '') + (a.note ? '<span><b>Note:</b> ' + esc(a.note) + '</span>' : '') + '</div>' +
      '<div class="btns">' + (NEXT[a.status] ? '<button class="btn primary" data-do="next" data-id="' + a.id + '">' + VERB[a.status] + '</button>' : '') +
      (ACTIVE.indexOf(a.status) !== -1 ? '<button class="btn" data-do="late" data-id="' + a.id + '">' + (a.late ? 'Not late any more' : 'Running late') + '</button><button class="btn danger" data-do="noshow" data-id="' + a.id + '">No-show</button>' : '') + '</div>' +
      '<div class="btns">' + (rec ? '<button class="btn" data-do="edit" data-id="' + a.id + '">Edit or move</button>' + (a.status !== 'Done' ? '<button class="btn danger" data-do="askcancel" data-id="' + a.id + '">Cancel appointment</button>' : '') : '') + '<button class="btn" data-do="close">Close</button></div>');
  }
  function timeOpts(sel) { var o = '', m; for (m = DAY_START; m < DAY_END; m += 30) o += '<option value="' + m + '"' + (m === sel ? ' selected' : '') + '>' + hhmm(m) + '</option>'; return o; }
  function formSheet(a, preset, walkin) {
    var v = a || { patient: '', phone: '+254 7', proc: 'Check-up', start_min: preset.start, dur: 30, chair: preset.chair, alert: '', note: '', payer: 'Cash / M-Pesa' };
    function opt(list, sel) { return list.map(function (x) { return '<option' + (x === sel ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join(''); }
    var payers = ['Cash / M-Pesa', 'SHA', 'AAR', 'Jubilee', 'CIC', 'Britam']; if (payers.indexOf(v.payer) === -1) payers.push(v.payer);
    openSheet('<span class="big">' + (a ? 'Edit appointment' : walkin ? 'Check in walk-in' : 'New appointment') + '</span><div class="fields">' +
      '<div class="field full"><label for="fP">Patient</label><input id="fP" value="' + esc(v.patient) + '" placeholder="Full name" autocomplete="off"></div>' +
      '<div class="field full"><label for="fT">Phone</label><input id="fT" type="tel" value="' + esc(v.phone) + '"></div>' +
      '<div class="field"><label for="fS">Time</label><select id="fS">' + timeOpts(v.start_min) + '</select></div>' +
      '<div class="field"><label for="fD">Length</label><select id="fD">' + [30, 60, 90].map(function (d) { return '<option value="' + d + '"' + (d === v.dur ? ' selected' : '') + '>' + d + ' min</option>'; }).join('') + '</select></div>' +
      '<div class="field full"><label for="fC">Chair</label><select id="fC">' + [1, 2, 3].map(function (c) { return '<option value="' + c + '"' + (c === v.chair ? ' selected' : '') + '>Chair ' + c + ', ' + esc(CHAIRS[c]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field full"><label for="fR">Treatment (FDI tooth number)</label><input id="fR" value="' + esc(v.proc) + '" placeholder="e.g. Filling, tooth 36"></div>' +
      '<div class="field"><label for="fY">Payer</label><select id="fY">' + opt(payers, v.payer) + '</select></div>' +
      '<div class="field"><label for="fA">Medical alert</label><input id="fA" value="' + esc(v.alert) + '" placeholder="e.g. Penicillin allergy"></div>' +
      '<div class="field full"><label for="fN">Note for staff</label><input id="fN" value="' + esc(v.note) + '"></div></div>' +
      '<div class="err" id="fE" hidden></div><div class="btns"><button class="btn primary" data-do="savebook" data-id="' + (a ? a.id : '') + '" data-walkin="' + (walkin ? 1 : 0) + '">' + (a ? 'Save and send to phones' : 'Book and send to phones') + '</button><button class="btn" data-do="close">Close</button></div>');
  }
  function saveBooking(el) {
    var id = el.dataset.id, $ = function (x) { return document.getElementById(x); };
    var patient = $('fP').value.trim(), start = +$('fS').value, dur = +$('fD').value, chair = +$('fC').value, err = '';
    var clash = live().some(function (a) { return a.id !== id && a.chair === chair && a.status !== 'No-show' && a.start_min < start + dur && start < a.start_min + a.dur; });
    if (!patient) err = 'Add the patient\'s name.';
    else if (start + dur > DAY_END) err = 'That runs past 13:00. Pick an earlier time or a shorter length.';
    else if (clash) err = 'Chair ' + chair + ' is already booked at ' + hhmm(start) + '. Pick another time or chair.';
    if (err) { $('fE').textContent = err; $('fE').hidden = false; return; }
    var a = id ? byId(id) : { id: 'n' + Date.now(), status: el.dataset.walkin === '1' ? 'Arrived' : 'Booked', prep: '', fee: 0, late: false, arrived_at: el.dataset.walkin === '1' ? Date.now() : null, seated_at: null };
    Object.assign(a, { patient: patient, phone: $('fT').value.trim(), start_min: start, dur: dur, chair: chair, proc: $('fR').value.trim() || 'Check-up', payer: $('fY').value, alert: $('fA').value.trim(), note: $('fN').value.trim() });
    if (!id) S.appts.push(a);
    closeSheet(); commitAppt(a);
  }

  /* ---------- Actions ---------- */
  function toTop() { var m = document.querySelector('.main'); if (m) m.scrollTop = 0; }
  var noteT;
  document.addEventListener('input', function (e) {
    if (e.target.id === 'q') { S.q = e.target.value; render(); return; }
    if (e.target.id === 'nN' || e.target.id === 'nF') {
      var na = byId(e.target.dataset.id); if (!na) return;
      na[e.target.id === 'nN' ? 'doc_note' : 'follow_up'] = e.target.value;
      clearTimeout(noteT); noteT = setTimeout(function () { S.outbox.appts[na.id] = clean(na, AK); persist(); flush(); }, 700);
    }
  });
  document.addEventListener('click', function (e) {
    if (e.target.id === 'sheet') { closeSheet(); return; }
    var el = e.target.closest('[data-do]'); if (!el) return;
    var d = el.dataset.do, id = el.dataset.id, a = id ? byId(id) : null;
    if (d === 'tab') { S.tab = id; toTop(); render(); }
    else if (d === 'me') { S.me = id; save('me', id); S.tab = 'today'; toTop(); render(); }
    else if (d === 'design') { S.design = id; save('design', id); render(); }
    else if (d === 'filter') { S.filter = +id; render(); }
    else if (d === 'seg') { S.cTab = id; render(); }
    else if (d === 'open' && a) detailSheet(a);
    else if (d === 'bopen' && a) bSheet(a);
    else if (d === 'bdone' && a) { a.status = 'To pay'; closeSheet(); commitAppt(a); }
    else if (d === 'bback' && a) { a.status = 'Arrived'; if (!a.arrived_at) a.arrived_at = Date.now(); closeSheet(); commitAppt(a); }
    else if (d === 'day') { S.day = id; render(); }
    else if (d === 'pref') { S.prefs[id] = !S.prefs[id]; save('prefs', S.prefs); render(); }
    else if (d === 'close') closeSheet();
    else if (d === 'next' && a) {
      if (NEXT[a.status] === 'In chair') {
        var busy = live().filter(function (x) { return x.chair === a.chair && x.status === 'In chair'; })[0];
        if (busy) { closeSheet(); banner('Chair ' + a.chair + ' is busy', 'Finish ' + busy.patient + ' first, then call in ' + a.patient + '.'); return; }
      }
      a.status = NEXT[a.status];
      if (a.status === 'Arrived') a.arrived_at = Date.now();
      if (a.status === 'In chair') { a.seated_at = Date.now(); a.late = false; if (a.alert && S.prefs.alerts) banner('Medical alert: ' + a.alert, a.patient + ' is coming in now.'); }
      closeSheet(); commitAppt(a);
    }
    else if (d === 'late' && a) { a.late = !a.late; closeSheet(); commitAppt(a); }
    else if (d === 'noshow' && a) { a.status = 'No-show'; closeSheet(); commitAppt(a); }
    else if (d === 'book') formSheet(null, { chair: +(el.dataset.chair || 1), start: +(el.dataset.start || 660) });
    else if (d === 'walkin') formSheet(null, { chair: 1, start: 660 }, true);
    else if (d === 'edit' && a) formSheet(a);
    else if (d === 'savebook') saveBooking(el);
    else if (d === 'askcancel' && a) openSheet('<span class="big">Cancel ' + esc(a.patient) + '?</span><span class="sub" style="font-size:14px">The ' + hhmm(a.start_min) + ' slot in Chair ' + a.chair + ' opens up on every phone.</span><div class="btns"><button class="btn danger" data-do="cancel" data-id="' + a.id + '">Yes, cancel it</button><button class="btn" data-do="close">Keep it</button></div>');
    else if (d === 'cancel' && a) { a.status = 'Cancelled'; closeSheet(); commitAppt(a); }
    else if (d === 'task') { var t = S.tasks.filter(function (x) { return x.id === id; })[0]; if (t) { t.done = !t.done; commitTask(t); if (S.sheetAppt && byId(S.sheetAppt)) bSheet(byId(S.sheetAppt)); } }
    else if (d === 'addtask') openSheet('<span class="big">Add a task</span><div class="fields"><div class="field full"><label for="tT">Task</label><input id="tT" placeholder="e.g. Restock gloves"></div><div class="field full"><label for="tW">For</label><select id="tW">' + PEOPLE.map(function (x) { return '<option value="' + x.id + '">' + esc(x.name) + '</option>'; }).join('') + '</select></div></div><div class="btns"><button class="btn primary" data-do="savetask">Send task</button><button class="btn" data-do="close">Close</button></div>');
    else if (d === 'savetask') { var txt = document.getElementById('tT').value.trim(); if (!txt) return; var nt = { id: 't' + Date.now(), text: txt, who: document.getElementById('tW').value, done: false }; S.tasks.push(nt); closeSheet(); commitTask(nt); }
    else if (d === 'update') { if (window.MenoApp) window.MenoApp.checkForUpdate(); else banner('Updates', 'Only available in the app.'); }
    else if (d === 'askreset') openSheet('<span class="big">Reset demo data?</span><span class="sub" style="font-size:14px">Every phone goes back to the morning list. Anything you added is removed.</span><div class="btns"><button class="btn danger" data-do="reset">Yes, reset</button><button class="btn" data-do="close">Keep it</button></div>');
    else if (d === 'reset') { closeSheet(); resetDemo(false); }
  });

  render();
  if (load('seedv', 0) < 3) { save('seedv', 3); resetDemo(true); }
  startRealtime();
  setInterval(function () { var s = document.getElementById('sheet'); if (s.hidden && document.activeElement && document.activeElement.id !== 'q') render(); }, 60000);
})();
