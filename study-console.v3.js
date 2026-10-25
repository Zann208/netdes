/* Study Console v3: this console's manifest. The frame (header, menu, sections, search,
   theme, EN/MY, reading size, progress) is drawn by shared/v3/shell.js from this object. */
(function () {
  function text(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function topics() { return TORDER.map(function (k) { return { id: 't' + k, title: text(document.querySelector('#t' + k + ' h3')) || k, badge: k }; }); }
  function labs() {
    var out = [{ id: 'sim', title: 'STP Simulator', badge: 'SIM' }];
    Object.keys(LABS).forEach(function (k) { out.push({ id: k, title: text(document.querySelector('#' + k + ' h3')) || k, badge: k.replace('L', 'LAB ') }); });
    return out;
  }
  function terms() {
    var out = [];
    CARDS.forEach(function (c) { out.push({ title: c.q, meta: 'Flashcard', view: 'drills' }); });
    document.querySelectorAll('#notes .item').forEach(function (art) {
      art.querySelectorAll('h4').forEach(function (h) { var t = text(h); if (t.length > 2 && t.length < 70) out.push({ title: t, meta: 'Topic ' + art.id.replace('t', ''), view: 'notes', anchor: art.id }); });
    });
    document.querySelectorAll('#acroT tr').forEach(function (r, i) {
      if (!i || r.children.length < 3) return;
      out.push({ title: text(r.children[0]) + ' · ' + text(r.children[1]), meta: 'Term', view: 'terms' });
    });
    document.querySelectorAll('#final .panel h2').forEach(function (h) { var p = h.closest('.panel'); out.push({ title: text(h), meta: 'Final', view: 'final', anchor: p && p.id || null }); });
    document.querySelectorAll('#cheat .panel h2').forEach(function (h) { out.push({ title: text(h), meta: 'Cheatsheet', view: 'cheat' }); });
    return out;
  }
  (window.StudyConsole = window.StudyConsole || []).push({
    id: 'netdes',
    title: 'Network Design & Troubleshooting',
    subtitle: '24 topics, 13 labs, practice · EN / MY',
    content: '#main',
    defaultView: 'home',
    restore: function () { return store.get('lastTab', 'home'); },
    router: { show: function (view, anchor) { showTab(view, !!anchor); store.set('lastTab', view); } },
    viewElement: function (id) { return document.getElementById(id); },
    terms: terms,
    i18n: {
      langs: [{ code: 'en', label: 'EN', name: 'English' }, { code: 'my', label: 'MY', name: 'Burmese' }],
      get: function () { return store.get('lang', 'en') === 'my' ? 'my' : 'en'; },
      set: function (code) { if (window.ndSetLang) window.ndSetLang(code); }
    },
    progress: {
      read: function () {
        var done = store.get('done', []), out = {};
        var t = done.filter(function (x) { return /^t/.test(x); }).length, l = done.filter(function (x) { return /^L/.test(x); }).length;
        if (t) out.notes = t >= TORDER.length ? 'done' : 'visited';
        if (l) out.labs = l >= Object.keys(LABS).length ? 'done' : 'visited';
        if (store.get('quizBest', -1) >= 0) out.drills = 'visited';
        return out;
      }
    },
    groups: [
      { label: 'Start', views: [{ id: 'home', title: 'Home', titles: { my: 'ပင်မ' } }, { id: 'final', title: 'Final', titles: { my: 'ဖိုင်နယ်' } }] },
      { label: 'Understand', views: [{ id: 'blueprint', title: 'Blueprint', titles: { my: 'ခြုံငုံ' } }, { id: 'flow', title: 'Flow', titles: { my: 'အစဉ်' } }] },
      { label: 'Study', views: [
        { id: 'notes', title: 'Topics', badge: '24', titles: { my: 'ခေါင်းစဉ်များ' }, children: topics },
        { id: 'labs', title: 'Labs', badge: '13', titles: { my: 'Lab များ' }, children: labs },
        { id: 'terms', title: 'Terms', titles: { my: 'ဝေါဟာရ' } }
      ] },
      { label: 'Practice', views: [{ id: 'drills', title: 'Drills', titles: { my: 'လေ့ကျင့်ခန်း' } }, { id: 'intensive', title: 'Practice', titles: { my: 'အလေ့အကျင့်' } }] },
      { label: 'Reference', views: [{ id: 'cheat', title: 'Cheatsheet', titles: { my: 'အနှစ်ချုပ်' } }, { id: 'author', title: 'About', titles: { my: 'အကြောင်း' } }] }
    ]
  });
})();
