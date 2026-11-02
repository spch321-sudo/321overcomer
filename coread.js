/* 321得勝者・無己覺醒 · 一起共讀
   帶領者開房間 → 6 位數共讀碼／連結／QR；加入者的畫面跟著翻到同一頁、同一捲動位置。
   連線：peerjs.min.js（相容 PeerJS 介面，底層是 Cloudflare 中繼站）。
   只同步「適合一起讀」的畫面（任務地圖、課程選單、課程的資訊／實踐／修正三步）。
   個人進度、無己值、積分、答題、禱告／習慣／戰隊等個人資料與遊戲互動頁一律不同步、不傳送。
   ES5。 */
(function () {
  var G = window, D = document;
  var PFX = 'oc321-', COOL = 8000;
  var PEER_JS = ['peerjs.min.js?v=' + (typeof APPVER !== 'undefined' ? APPVER : '1')];
  var QR_JS = ['https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js', 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.js', 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];
  /* 課程八步中，哪幾步可以「一起讀」：0 資訊、3 實踐（任務說明）、5 修正。其餘（啟示翻卡／信服選擇／檢討書寫／打卡／邀請）是個人互動，不同步。 */
  var SYNC_STEPS = [0, 3, 5];

  var TX = {
    zh: { title: '一起共讀', desc: '開一個共讀房間，把共讀碼或連結傳給弟兄姊妹。他們打開後，畫面會跟著你翻到同一課、同一個捲動位置。只同步課文與說明頁；你的進度、積分與答題都不會分享。', host: '開共讀房間（我來帶領）', join: '加入', codePH: '輸入 6 位數共讀碼', orJoin: '或加入別人的共讀', scrChk: '作為投影螢幕（大字、無按鈕，自動跟著帶領者）', code: '共讀碼', people: '已有 {0} 人加入', waiting: '等待弟兄姊妹加入…', invite: '傳送邀請', copyLink: '複製連結', scrT: '🖥 投影螢幕', scrD: '在連接投影機或電視的電腦／平板打開投影連結，畫面會變成大字、沒有按鈕、自動跟著你翻頁。', scrB: '複製投影連結', copied: '已複製', end: '結束共讀', leave: '離開共讀', close: '關閉', inviteMsg: '📡 一起來共讀《321得勝者・無己覺醒》！\n點連結加入：{0}\n或打開 App 按右上角「📡」輸入共讀碼：{1}', following: '跟著帶領共讀', paused: '你自己瀏覽中 · 點這裡回到帶領者', connecting: '連線中…', hostChip: '共讀 {0} · {1} 人', hostOff: '此頁不同步', leaderOff: '帶領者在其他頁面（個人或遊戲頁不同步）', ended: '共讀已結束', joined: '已加入共讀，畫面會跟著帶領者', loadErr: '共讀功能載入失敗，請確認網路後再試', badCode: '請輸入 6 位數共讀碼', notFound: '找不到這個共讀房間，請確認共讀碼，或請帶領者重新開房間', followOnly: '你正在跟著共讀', back2: '回到帶領者', tip: '提示：帶領者的手機請保持 App 開著、螢幕不要關，大家才會一直同步。', qrTip: '用手機相機掃描加入', joinedOne: '有一位弟兄姊妹加入共讀', hostLeft: '帶領者暫時離線，正在重新連線…' },
    zs: { title: '一起共读', desc: '开一个共读房间，把共读码或链接传给弟兄姊妹。他们打开后，画面会跟着你翻到同一课、同一个滚动位置。只同步课文与说明页；你的进度、积分与答题都不会分享。', host: '开共读房间（我来带领）', join: '加入', codePH: '输入 6 位数共读码', orJoin: '或加入别人的共读', scrChk: '作为投影荧幕（大字、无按钮，自动跟着带领者）', code: '共读码', people: '已有 {0} 人加入', waiting: '等待弟兄姊妹加入…', invite: '发送邀请', copyLink: '复制链接', scrT: '🖥 投影荧幕', scrD: '在连接投影机或电视的电脑／平板打开投影链接，画面会变成大字、没有按钮、自动跟着你翻页。', scrB: '复制投影链接', copied: '已复制', end: '结束共读', leave: '离开共读', close: '关闭', inviteMsg: '📡 一起来共读《321得胜者・无己觉醒》！\n点链接加入：{0}\n或打开 App 按右上角「📡」输入共读码：{1}', following: '跟着带领共读', paused: '你自己浏览中 · 点这里回到带领者', connecting: '连线中…', hostChip: '共读 {0} · {1} 人', hostOff: '此页不同步', leaderOff: '带领者在其他页面（个人或游戏页不同步）', ended: '共读已结束', joined: '已加入共读，画面会跟着带领者', loadErr: '共读功能载入失败，请确认网络后再试', badCode: '请输入 6 位数共读码', notFound: '找不到这个共读房间，请确认共读码，或请带领者重新开房间', followOnly: '你正在跟着共读', back2: '回到带领者', tip: '提示：带领者的手机请保持 App 开着、屏幕不要关，大家才会一直同步。', qrTip: '用手机相机扫描加入', joinedOne: '有一位弟兄姊妹加入共读', hostLeft: '带领者暂时离线，正在重新连线…' },
    en: { title: 'Read together', desc: 'Open a room and send the code or link to others. Their screens follow yours to the same lesson and scroll position. Only reading pages are synced; your progress, points and answers are never shared.', host: 'Open a room (I’ll lead)', join: 'Join', codePH: 'Enter the 6-digit room code', orJoin: 'Or join someone else’s room', scrChk: 'Join as a projector screen (large text, no buttons, auto-follows)', code: 'Room code', people: '{0} joined', waiting: 'Waiting for others to join…', invite: 'Send invite', copyLink: 'Copy link', scrT: '🖥 Projector screen', scrD: 'Open the projector link on the computer or tablet connected to a projector or TV: it shows large text, no buttons, and follows you page by page.', scrB: 'Copy projector link', copied: 'Copied', end: 'End session', leave: 'Leave', close: 'Close', inviteMsg: '📡 Come read “321 Overcomer” together!\nTap to join: {0}\nOr open the app, tap the 📡 at the top right and enter code {1}', following: 'Following the leader', paused: 'Browsing on your own · tap to return to the leader', connecting: 'Connecting…', hostChip: 'Room {0} · {1}', hostOff: 'not synced', leaderOff: 'The leader is on another page (personal and game pages are not synced)', ended: 'Reading session ended', joined: 'Joined — your screen will follow the leader', loadErr: 'Could not load reading-together. Check your connection and try again.', badCode: 'Please enter the 6-digit room code', notFound: 'Room not found. Check the code, or ask the leader to open a new room.', followOnly: 'You are following', back2: 'Back to leader', tip: 'Tip: the leader should keep the app open with the screen on so everyone stays in sync.', qrTip: 'Scan with a phone camera to join', joinedOne: 'Someone joined the room', hostLeft: 'The leader is offline for a moment — reconnecting…' }
  };
  function LG() { var l = String((G.navigator && navigator.language) || 'zh').toLowerCase(); if (l.indexOf('en') === 0) return 'en'; if (l.indexOf('zh') === 0 && /(cn|sg|hans)/.test(l)) return 'zs'; return 'zh'; }
  function X(k) { var s = (TX[LG()] || TX.zh)[k] || TX.zh[k] || k; for (var i = 1; i < arguments.length; i++) s = s.replace('{' + (i - 1) + '}', arguments[i]); return s; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ss(k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || 'null'); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function say(m) { try { if (typeof G.toast === 'function') { G.toast(m); return; } } catch (e) { } }

  /* ---------- 樣式 ---------- */
  var css = '#crTop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:10px;z-index:220;width:38px;height:38px;border-radius:50%;border:1.5px solid rgba(245,195,59,.55);background:rgba(7,4,20,.72);color:#FFE08A;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
    '#crTop i{position:absolute;right:2px;top:2px;width:10px;height:10px;border-radius:50%;background:#5BD38A;border:1.5px solid #0B0821;display:none}#crTop.on i{display:block}#crTop.wait i{display:block;background:#F2C14E}' +
    '#hud{padding-right:58px!important}' +
    'body.crOn .screen{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}' +
    'body.crFol #screen-level #stepFoot{display:none}' +
    '#crchip{position:absolute;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:220;max-width:calc(100% - 24px);border:0;border-radius:999px;padding:8px 16px 8px 12px;font:inherit;font-size:14px;font-weight:700;background:linear-gradient(90deg,#2A1F5C,#43307F);color:#fff;border:1.5px solid rgba(245,195,59,.5);box-shadow:0 6px 18px rgba(0,0,0,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}' +
    '#crchip .dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#5BD38A;margin-right:7px;vertical-align:1px;animation:crp 1.6s infinite}#crchip.wait .dot{background:#F2C14E}#crchip.off{background:#8E5E12}#crchip.off .dot{background:#fff;animation:none}' +
    '@keyframes crp{0%,100%{opacity:1}50%{opacity:.35}}' +
    '#crsheet{position:absolute;inset:0;z-index:230;display:none;align-items:flex-end;justify-content:center;background:rgba(5,3,15,.7)}#crsheet.on{display:flex}' +
    '.crbox{width:100%;max-height:92%;overflow-y:auto;overflow-x:hidden;background:linear-gradient(180deg,#2A1F5C,#150E33);border-top:1.5px solid rgba(245,195,59,.5);border-radius:20px 20px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));color:#ECE3CC;text-align:center}' +
    '.crbox .crh{font-size:20px;font-weight:800;color:#FFE08A;margin-bottom:8px}.crbox .crd{font-size:15px;line-height:1.7;color:#cfc8e8;margin-bottom:14px;text-align:left}' +
    '.crk{font-size:14px;color:#9A93C4;margin-top:6px}.crcode{font-size:40px;font-weight:800;letter-spacing:.12em;color:#F5C33B;margin:2px 0 8px;font-variant-numeric:tabular-nums}' +
    '.crqr{display:flex;justify-content:center;margin:4px 0}.crqr img{width:170px;height:170px;image-rendering:pixelated;background:#fff;border-radius:10px;padding:4px}' +
    '.crxs{font-size:13px;color:#9A93C4;margin:4px 0}.crcount{font-size:16px;color:#59E3D6;margin:8px 0 12px;font-weight:700}' +
    '.crbtn{display:block;width:100%;font:inherit;font-weight:700;font-size:17px;border:0;border-radius:12px;padding:13px 14px;margin-top:10px;cursor:pointer;color:#2a1400;background:linear-gradient(180deg,#FFE08A,#F5C33B 55%,#B8862B)}' +
    '.crbtn.ghost{background:rgba(255,255,255,.07);color:#ECE3CC;box-shadow:inset 0 0 0 1.5px rgba(245,195,59,.5)}' +
    '.crjoin{display:flex;gap:8px;margin-top:8px}.crjoin input[type=tel]{flex:1;min-width:0;font:inherit;font-size:18px;text-align:center;letter-spacing:.1em;padding:11px 10px;border-radius:12px;border:1.5px solid rgba(245,195,59,.45);background:rgba(0,0,0,.35);color:#fff}.crjoin .crbtn{width:auto;margin:0;padding:11px 18px}' +
    '.crchk{display:flex;align-items:flex-start;gap:8px;text-align:left;font-size:14px;color:#cfc8e8;margin-top:10px;line-height:1.5}.crchk input{margin-top:3px;flex:0 0 auto}' +
    '.crscrbox{text-align:left;margin:14px 0 4px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)}.crscrbox .crk{text-align:left;margin:0 0 4px;color:#FFE08A;font-weight:700}' +
    'body.crScreen #crTop,body.crScreen #crchip,body.crScreen #hud,body.crScreen .back-link,body.crScreen #stepFoot{display:none!important}body.crScreen #app{pointer-events:none}' +
    '#crscr{position:fixed;right:10px;bottom:10px;z-index:2147483000;display:flex;align-items:center;gap:6px;background:rgba(20,16,50,.88);color:#fff;border-radius:999px;padding:6px 10px;font:13px/1.4 sans-serif;opacity:.55;pointer-events:auto}#crscr:hover,#crscr:active{opacity:1}#crscr button{border:0;border-radius:999px;background:rgba(255,255,255,.22);color:#fff;padding:3px 9px;font:inherit;font-weight:700;cursor:pointer}#crscr i{width:9px;height:9px;border-radius:50%;background:#e0a030;display:inline-block}#crscr i.on{background:#4cc26b}';
  var st = D.createElement('style'); st.id = 'crcss'; st.textContent = css; D.head.appendChild(st);

  var loaded = {};
  function loadJs(urls, test, cb) {
    if (test()) { cb(true); return; } var i = 0;
    (function nx() {
      if (i >= urls.length) { cb(false); return; } var u = urls[i++];
      if (loaded[u]) { setTimeout(function () { cb(test()); }, 0); return; }
      var s = D.createElement('script'); s.src = u; s.async = true;
      s.onload = function () { loaded[u] = 1; if (test()) cb(true); else nx(); }; s.onerror = function () { nx(); };
      D.head.appendChild(s);
    })();
  }

  /* ---------- 狀態 ---------- */
  var C = { role: '', code: '', scr: false, peer: null, conns: [], host: null, last: null, lastPos: null, lastKey: '', retry: 0, rt: null, manualAt: 0, away: false, want: null, status: '', busyUntil: 0, first: false, misses: 0, lastRx: 0, fresh: false };
  var appEl = null, root = null;
  function inApp() { return appEl || (appEl = D.getElementById('app')); }
  function baseUrl() { return location.origin + location.pathname; }
  function joinUrl(code, scr) { return baseUrl() + '?join=' + code + (scr ? '&screen=1' : ''); }
  function newCode() { var c = ''; for (var i = 0; i < 6; i++) c += Math.floor(Math.random() * 10); return c.charAt(0) === '0' ? '1' + c.slice(1) : c; }
  function live() { var o = []; for (var i = 0; i < C.conns.length; i++) if (C.conns[i].open) o.push(C.conns[i]); return o; }

  /* ---------- 這個 App 的「頁面」---------- */
  function scrEl() { return D.querySelector('#app .screen.on'); }
  function modalOpen() { return !!D.querySelector('#app .rc-modal.on, #verPick.on'); }
  /* 回傳 {k,p,li?,ix?,st?}；個人／遊戲／互動頁回 null＝不同步。只含識別，不含任何進度或文字。 */
  function pageNow() {
    var el = scrEl(); if (!el || modalOpen()) return null; var id = el.id;
    if (typeof G.state === 'undefined' || typeof G.WORLD === 'undefined') return null;
    if (id === 'screen-map') return { k: 'map', p: 'map' };
    if (id === 'screen-course') return { k: 'c' + G.state.landIdx, p: 'course', li: G.state.landIdx };
    if (id === 'screen-level') {
      var si = G.stepIdx; if (SYNC_STEPS.indexOf(si) < 0) return null;
      var Ls = G.WORLD[G.state.landIdx] && G.WORLD[G.state.landIdx].lessons[G.state.cur]; if (!Ls || Ls.type === 'boss') return null;
      return { k: 'l' + G.state.landIdx + '.' + G.state.cur + '.' + si, p: 'lesson', li: G.state.landIdx, ix: G.state.cur, st: si };
    }
    return null;
  }
  function curKey() { var p = pageNow(); return p ? p.k : null; }
  function frac() { var el = scrEl(); if (!el) return 0; var mx = el.scrollHeight - el.clientHeight; return mx > 4 ? Math.round(el.scrollTop / mx * 1000) / 1000 : 0; }
  function stopRead() { try { if (typeof G.stopTTS === 'function') G.stopTTS(); } catch (e) { } try { if (G.speechSynthesis) G.speechSynthesis.cancel(); } catch (e) { } }

  /* ---------- 帶領者 ---------- */
  function host(code, quiet) {
    loadJs(PEER_JS, function () { return !!G.Peer; }, function (ok) {
      if (!ok) { say(X('loadErr')); return; }
      teardown(); C.role = 'host'; C.fresh = !code; C.code = code || newCode(); C.status = 'connecting'; C.lastKey = ''; ss('cr321oc', { r: 'host', c: C.code }); chip();
      var p = C.peer = new G.Peer(PFX + C.code, { debug: 0 });
      p.on('open', function () { C.retry = 0; C.fresh = false; C.status = 'ok'; chip(); if (!quiet) sheet(); snap(true); });
      p.on('connection', function (c) {
        C.conns.push(c);
        c.on('open', function () { chip(); say(X('joinedOne')); paintCount(); try { if (C.last) c.send(C.last); if (C.lastPos) c.send(C.lastPos); } catch (e) { } });
        c.on('close', function () { drop(c); }); c.on('error', function () { drop(c); });
      });
      p.on('disconnected', function () { if (C.role === 'host' && !p.destroyed) setTimeout(function () { try { p.reconnect(); } catch (e) { } }, 1500); });
      p.on('error', function (e) {
        if (C.role !== 'host') return;
        if (e && e.type === 'unavailable-id') {
          if (C.fresh && C.retry++ < 6) { clearTimeout(C.rt); C.rt = setTimeout(function () { host(null, quiet); }, 200); return; }
          if (C.retry++ < 25) { C.status = 'connecting'; chip(); clearTimeout(C.rt); C.rt = setTimeout(function () { host(C.code, true); }, 3000); } else { say(X('loadErr')); end(); } return;
        }
        if (e && (e.type === 'network' || e.type === 'server-error' || e.type === 'socket-error' || e.type === 'socket-closed')) { clearTimeout(C.rt); C.rt = setTimeout(function () { if (C.role === 'host') host(C.code, true); }, 4000); }
      });
    });
  }
  function drop(c) { var o = []; for (var i = 0; i < C.conns.length; i++) if (C.conns[i] !== c) o.push(C.conns[i]); C.conns = o; chip(); paintCount(); }
  function bcast(m) {
    if (C.role !== 'host') return; m.ts = Date.now();
    if (m.t === 'st') C.last = m; else if (m.t === 'pos') C.lastPos = m;
    var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send(m); } catch (e) { }
  }
  /* 換頁（或強制）時送出完整頁面狀態；不同步頁送 off */
  function snap(force) {
    if (C.role !== 'host' || sheetOpen()) return;
    var p = pageNow();
    if (!p) { if (C.lastKey !== 'off' || force) { C.lastKey = 'off'; C.lastPos = null; bcast({ t: 'st', k: 'off', off: 1 }); } chip(); return; }
    if (p.k === C.lastKey && !force) return;
    C.lastKey = p.k; p.t = 'st'; p.f = frac(); C.lastPos = null; bcast(p); chip();
  }
  var posT = null, posAt = 0;
  function sendPos() {
    if (C.role !== 'host' || sheetOpen()) return; var p = pageNow(); if (!p) return;
    if (p.k !== C.lastKey) { snap(); return; }
    bcast({ t: 'pos', k: p.k, f: frac() });
  }
  D.addEventListener('scroll', function (e) {
    if (C.role !== 'host') return; var t = e.target; if (!t || !t.className || String(t.className).indexOf('screen') < 0) return;
    var now = Date.now(), wait = Math.max(0, 220 - (now - posAt)); clearTimeout(posT); posT = setTimeout(function () { posAt = Date.now(); sendPos(); }, wait);
  }, true);

  /* ---------- 加入者 ---------- */
  function join(code, scr) {
    code = String(code || '').replace(/\D/g, ''); if (code.length !== 6) { say(X('badCode')); return; }
    if (scr) { G.CR_SCREEN = true; G.CR_SCREEN_APP = true; }
    loadJs(PEER_JS, function () { return !!G.Peer; }, function (ok) {
      if (!ok) { say(X('loadErr')); return; }
      teardown(); C.role = 'follow'; C.code = code; C.scr = !!scr; C.status = 'connecting'; C.first = true; C.misses = 0; C.away = false; C.manualAt = 0; ss('cr321oc', { r: 'follow', c: code, s: scr ? 1 : 0 }); closeSheet();
      if (scr) screenOn(); chip();
      var p = C.peer = new G.Peer({ debug: 0 });
      p.on('open', function () { dial(); });
      p.on('disconnected', function () { if (C.role === 'follow' && !p.destroyed) setTimeout(function () { try { p.reconnect(); } catch (e) { } }, 1500); });
      p.on('error', function (e) {
        if (C.role !== 'follow') return;
        if (e && e.type === 'peer-unavailable') { C.misses++; if (C.first && C.misses >= 3) { say(X('notFound')); leave(true); return; } C.status = 'connecting'; chip(); redial(4000); return; }
        redial(4000);
      });
    });
  }
  function redial(ms) { clearTimeout(C.rt); C.rt = setTimeout(function () { if (C.role === 'follow') dial(); }, ms || 3000); }
  function dial() {
    var p = C.peer; if (!p || p.destroyed || C.role !== 'follow') return;
    if (p.disconnected) { try { p.reconnect(); } catch (e) { } redial(3000); return; }
    try { if (C.host) C.host.close(); } catch (e) { }
    var c = C.host = p.connect(PFX + C.code, { reliable: true });
    var to = setTimeout(function () { if (!c.open && C.role === 'follow' && C.host === c) { try { c.close(); } catch (e) { } redial(1000); } }, 12000);
    c.on('open', function () { clearTimeout(to); C.misses = 0; C.lastRx = Date.now(); C.status = 'ok'; if (C.first) { C.first = false; say(X('joined')); } chip(); scrState(true); });
    c.on('data', function (m) { C.lastRx = Date.now(); if (C.status !== 'ok') { C.status = 'ok'; chip(); } if (!m) return; if (m.t === 'st' || m.t === 'pos') apply(m); else if (m.t === 'end') leave(); });
    c.on('close', function () { clearTimeout(to); if (C.role === 'follow' && C.host === c) { C.status = 'lost'; chip(); scrState(false); redial(2500); } });
    c.on('error', function () { });
  }
  function canFollow() { return C.role === 'follow' && C.want && !C.want.off && !C.away && (C.scr || Date.now() - C.manualAt > COOL); }
  function apply(m) {
    if (m.t === 'pos') { if (!C.want || C.want.off || m.k !== C.want.k) return; C.want.f = m.f; if (canFollow() && curKey() === m.k) scrollTo(m.f, true); return; }
    var nk = !C.want || C.want.k !== m.k;
    C.want = m;
    if (m.off) { chip(); return; }
    if (nk) { C.manualAt = 0; C.away = false; }
    if (canFollow()) goPage(m, false); else chip();
  }
  function scrollTo(f, smooth) {
    var el = scrEl(); if (!el) return; var mx = Math.max(0, el.scrollHeight - el.clientHeight), top = Math.round(mx * (f || 0));
    try { el.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' }); } catch (e) { el.scrollTop = top; }
  }
  /* 用 App 自己的導覽函式跟過去（先停朗讀）。只換畫面，不改任何進度。 */
  function goPage(m, force) {
    if (!m || m.off) return;
    if (typeof G.curVerObj !== 'undefined' && !G.curVerObj) { chip(); return; }   /* 還沒選版本：不打斷 */
    if (D.getElementById('verPick') && D.getElementById('verPick').className.indexOf('on') >= 0) { chip(); return; }
    var same = curKey() === m.k;
    if (!same) {
      if (m.p === 'lesson') { var W = G.WORLD[m.li], Ls = W && W.lessons[m.ix]; if (!Ls || Ls.type === 'boss') return; }
      else if (m.p === 'course') { if (!G.WORLD[m.li]) return; }
      stopRead(); C.busyUntil = Date.now() + 700;
      var ms = D.querySelectorAll('#app .rc-modal.on'); for (var i = 0; i < ms.length; i++) ms[i].className = ms[i].className.replace(/\s*\bon\b/g, '');
      try {
        if (m.p === 'map') { G.show('screen-map'); G.syncMap(); }
        else if (m.p === 'course') { G.openCourse(m.li); }
        else if (m.p === 'lesson') { G.state.landIdx = m.li; G.state.cur = m.ix; G.stepIdx = m.st; G.show('screen-level'); G.renderStep(); }
      } catch (e) { }
      setTimeout(function () { if (C.role === 'follow') { scrollTo(m.f, false); chip(); } }, 120);
    } else if (force || canFollow()) { scrollTo(m.f, true); }
    chip();
  }
  function userMove() { if (C.role === 'follow' && !C.scr) { C.manualAt = Date.now(); chip(); } }
  D.addEventListener('touchmove', userMove, { passive: true }); D.addEventListener('wheel', userMove, { passive: true });
  function backToLeader() { C.manualAt = 0; C.away = false; if (C.want && !C.want.off) { goPage(C.want, true); } chip(); }

  /* 心跳：帶領者每 5 秒報平安；加入者 15 秒沒收到就重連 */
  setInterval(function () {
    if (C.role === 'host') { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'hb' }); } catch (e) { } }
    else if (C.role === 'follow' && C.host && C.lastRx && Date.now() - C.lastRx > 15000) { C.lastRx = 0; C.status = 'lost'; chip(); dial(); }
  }, 5000);
  G.addEventListener('pagehide', function () { if (C.role === 'host') { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'hb' }); } catch (e) { } } });
  D.addEventListener('visibilitychange', function () {
    if (D.hidden) return;
    if (C.role === 'follow' && C.status !== 'ok') dial();
    if (C.role === 'host' && C.peer && C.peer.disconnected) try { C.peer.reconnect(); } catch (e) { }
  });

  /* ---------- 結束 ---------- */
  function teardown() { clearTimeout(C.rt); try { if (C.peer) C.peer.destroy(); } catch (e) { } C.peer = null; C.conns = []; C.host = null; C.want = null; C.away = false; }
  function reset() { C.role = ''; C.code = ''; C.last = null; C.lastPos = null; C.lastKey = ''; C.scr = false; ss('cr321oc', null); chip(); closeSheet(); }
  function end() { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'end' }); } catch (e) { } setTimeout(function () { teardown(); reset(); say(X('ended')); }, cs.length ? 300 : 0); }
  function leave(quiet) { teardown(); reset(); if (!quiet) say(X('ended')); }

  /* ---------- 畫面元件 ---------- */
  function mount() {
    var a = inApp(); if (!a || root) return;
    root = D.createElement('div'); root.id = 'crRoot';
    root.innerHTML = '<button id="crTop" type="button" aria-label="co-read"><span aria-hidden="true">📡</span><i></i></button><div id="crsheet"><div class="crbox" id="crbox"></div></div>';
    a.appendChild(root);
    var b = D.getElementById('crTop'); b.title = X('title'); b.onclick = function () { sheet(); };
    D.getElementById('crsheet').onclick = function (e) { if (e.target === this) closeSheet(); };
  }
  function sheetOpen() { var s = D.getElementById('crsheet'); return !!(s && s.className.indexOf('on') >= 0); }
  function closeSheet() { var s = D.getElementById('crsheet'); if (s) s.className = ''; }
  function chip() {
    mount();
    var top = D.getElementById('crTop'); if (top) top.className = C.role ? (C.status === 'ok' ? 'on' : 'wait') : '';
    var fol = C.role === 'follow' && C.want && !C.want.off && !C.away && !C.scr;
    D.body.className = D.body.className.replace(/\s*\bcr(On|Fol)\b/g, '') + (C.role ? ' crOn' : '') + (fol ? ' crFol' : '');
    var el = D.getElementById('crchip');
    if (!C.role) { if (el) el.parentNode.removeChild(el); return; }
    if (!el) { el = D.createElement('button'); el.id = 'crchip'; el.type = 'button'; el.onclick = function () { if (C.role === 'follow' && (C.away || C.manualAt)) { backToLeader(); return; } sheet(); }; inApp().appendChild(el); }
    var t, cls = '';
    if (C.role === 'host') { t = C.status === 'ok' ? X('hostChip', C.code, live().length) + (C.lastKey === 'off' ? ' · ' + X('hostOff') : '') : X('connecting'); if (C.status !== 'ok') cls = 'wait'; }
    else if (C.status !== 'ok') { t = C.status === 'lost' ? X('hostLeft') : X('connecting'); cls = 'wait'; }
    else if (C.want && C.want.off) { t = X('leaderOff'); cls = 'off'; }
    else if (C.away || (C.manualAt && Date.now() - C.manualAt < COOL)) { t = X('paused'); cls = 'off'; }
    else t = X('following');
    el.className = cls; el.innerHTML = '<span class="dot"></span>📡 ' + E(t);
  }
  setInterval(function () { if (C.role === 'follow' && C.manualAt) chip(); }, 2000);
  function qrInto(id, text) {
    loadJs(QR_JS, function () { return typeof G.qrcode === 'function'; }, function (ok) {
      var box = D.getElementById(id); if (!box || !ok) { if (box) box.style.display = 'none'; return; }
      try { var q = G.qrcode(0, 'M'); q.addData(text); q.make(); box.innerHTML = q.createImgTag(5, 10); } catch (e) { box.style.display = 'none'; }
    });
  }
  function paintCount() { var e = D.getElementById('crcount'); if (e) { var n = live().length; e.textContent = n ? X('people', n) : X('waiting'); } }
  function copy(text, btn) {
    function done() { if (btn) { var o = btn.getAttribute('data-o') || btn.textContent; btn.setAttribute('data-o', o); btn.textContent = '✓ ' + X('copied'); setTimeout(function () { btn.textContent = o; }, 1600); } else say(X('copied')); }
    function fb() { try { var a = D.createElement('textarea'); a.value = text; a.style.cssText = 'position:fixed;opacity:0'; D.body.appendChild(a); a.select(); D.execCommand('copy'); D.body.removeChild(a); done(); } catch (e) { } }
    try { navigator.clipboard.writeText(text).then(done, fb); } catch (e) { fb(); }
  }
  function share(text) { try { if (navigator.share) { navigator.share({ text: text })['catch'](function () { }); return; } } catch (e) { } copy(text); }
  function sheet() {
    mount(); var box = D.getElementById('crbox'), s = D.getElementById('crsheet'); if (!box) return;
    var h = '<div class="crh">📡 ' + E(X('title')) + '</div>', c3 = '';
    if (C.code) c3 = C.code.slice(0, 3) + ' ' + C.code.slice(3);
    if (C.role === 'host') {
      h += '<div class="crk">' + E(X('code')) + '</div><div class="crcode">' + E(c3) + '</div>' +
        '<div class="crqr" id="crqr"></div><div class="crxs">' + E(X('qrTip')) + '</div><div class="crcount" id="crcount"></div>' +
        '<button class="crbtn" data-a="inv" type="button">↗ ' + E(X('invite')) + '</button><button class="crbtn ghost" data-a="cp" type="button">⧉ ' + E(X('copyLink')) + '</button>' +
        '<div class="crscrbox"><div class="crk">' + E(X('scrT')) + '</div><div class="crxs">' + E(X('scrD')) + '</div><button class="crbtn ghost" data-a="cps" type="button">' + E(X('scrB')) + '</button></div>' +
        '<div class="crxs" style="margin-top:10px">' + E(X('tip')) + '</div>' +
        '<button class="crbtn ghost" data-a="end" type="button">■ ' + E(X('end')) + '</button><button class="crbtn ghost" data-a="x" type="button">' + E(X('close')) + '</button>';
      box.innerHTML = h; s.className = 'on'; paintCount(); qrInto('crqr', joinUrl(C.code)); return;
    }
    if (C.role === 'follow') {
      h += '<div class="crk">' + E(X('followOnly')) + '</div><div class="crcode">' + E(c3) + '</div>' +
        '<button class="crbtn" data-a="back" type="button">' + E(X('back2')) + '</button><button class="crbtn ghost" data-a="lv" type="button">' + E(X('leave')) + '</button><button class="crbtn ghost" data-a="x" type="button">' + E(X('close')) + '</button>';
      box.innerHTML = h; s.className = 'on'; return;
    }
    h += '<div class="crd">' + E(X('desc')) + '</div><button class="crbtn" data-a="host" type="button">📡 ' + E(X('host')) + '</button>' +
      '<div class="crk" style="margin-top:16px">' + E(X('orJoin')) + '</div>' +
      '<div class="crjoin"><input id="crin" type="tel" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="' + E(X('codePH')) + '"><button class="crbtn" data-a="join" type="button">' + E(X('join')) + '</button></div>' +
      '<label class="crchk"><input id="crscrchk" type="checkbox"><span>' + E(X('scrChk')) + '</span></label>' +
      '<button class="crbtn ghost" data-a="x" type="button">' + E(X('close')) + '</button>';
    box.innerHTML = h; s.className = 'on';
    var inp = D.getElementById('crin'); if (inp) inp.onkeydown = function (e) { if (e.keyCode === 13) doJoin(); };
  }
  function doJoin() { var i = D.getElementById('crin'), k = D.getElementById('crscrchk'); join(i ? i.value : '', !!(k && k.checked)); }
  D.addEventListener('click', function (e) {
    var n = e.target; while (n && n !== D && !(n.getAttribute && n.getAttribute('data-a') && n.className.indexOf('crbtn') >= 0)) n = n.parentNode; if (!n || n === D) return;
    var a = n.getAttribute('data-a');
    if (a === 'host') { closeSheet(); host(); }
    else if (a === 'join') doJoin();
    else if (a === 'inv') share(X('inviteMsg', joinUrl(C.code), C.code));
    else if (a === 'cp') copy(joinUrl(C.code), n);
    else if (a === 'cps') copy(joinUrl(C.code, true), n);
    else if (a === 'end') end();
    else if (a === 'lv') leave();
    else if (a === 'back') { closeSheet(); backToLeader(); }
    else if (a === 'x') { closeSheet(); if (C.role === 'host') snap(true); }
  }, false);

  /* ---------- 投影螢幕 ---------- */
  var scrZ = 0, scrOnce = false;
  function screenOn() {
    D.body.className += ' crScreen';
    function zoom() {
      var app = inApp(); if (!app) return; var base = Math.max(1.2, Math.min(3, (G.innerHeight || 700) / 640));
      var z = base * (scrZ || 1); app.style.zoom = z; app.style.height = ((G.innerHeight || 700) / z) + 'px';
    }
    if (!scrOnce) {
      scrOnce = true; try { scrZ = parseFloat(localStorage.getItem('cr_scrz_oc') || '1') || 1; } catch (e) { scrZ = 1; }
      G.addEventListener('resize', function () { if (C.scr) zoom(); });
      var b = D.createElement('div'); b.id = 'crscr';
      b.innerHTML = '<i id="crscrd"></i><span id="crscrt"></span><button data-a="m" type="button">A−</button><button data-a="p" type="button">A＋</button><button data-a="x" type="button">✕</button>';
      D.documentElement.appendChild(b);
      b.onclick = function (e) {
        var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
        if (a === 'x') { leave(true); D.body.className = D.body.className.replace(/\s*\bcrScreen\b/g, ''); var app = inApp(); if (app) { app.style.zoom = ''; app.style.height = ''; } if (b.parentNode) b.parentNode.removeChild(b); scrOnce = false; return; }
        scrZ = Math.min(2.2, Math.max(.6, (scrZ || 1) + (a === 'p' ? .15 : -.15))); try { localStorage.setItem('cr_scrz_oc', String(scrZ)); } catch (e2) { } zoom();
      };
      function wake() { try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(null, function () { }); } catch (e) { } }
      wake(); D.addEventListener('visibilitychange', function () { if (!D.hidden && C.scr) wake(); });
    }
    zoom(); var t = D.getElementById('crscrt'); if (t) t.textContent = C.code;
  }
  function scrState(ok) { var d = D.getElementById('crscrd'); if (d) d.className = ok ? 'on' : ''; var t = D.getElementById('crscrt'); if (t) t.textContent = C.code; }

  /* ---------- 重畫鉤子：畫面（class）或內容容器（childList）變了 ---------- */
  var obsT = null;
  function rendered() {
    if (C.role === 'host') { snap(); }
    else if (C.role === 'follow') {
      if (!C.scr && Date.now() > C.busyUntil && C.want && !C.want.off && C.status === 'ok' && curKey() !== C.want.k) C.away = true;
      if (C.scr && C.want && !C.want.off && Date.now() > C.busyUntil && curKey() !== C.want.k) goPage(C.want, true);
    }
    chip();
  }
  function inMine(n) { while (n) { if (n.id === 'crRoot' || n.id === 'crchip') return true; n = n.parentNode; } return false; }
  function observe() {
    var a = inApp(); if (!a || !G.MutationObserver) return;
    var mo = new MutationObserver(function (recs) {
      var rel = false; for (var i = 0; i < recs.length; i++) { var r = recs[i]; if (r.type === 'attributes') { if (inMine(r.target)) continue; rel = true; break; } if (!inMine(r.target)) { rel = true; break; } }
      if (!rel) return; clearTimeout(obsT); obsT = setTimeout(rendered, 150);
    });
    mo.observe(a, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- 給外部（自動更新等）查詢 ---------- */
  G.CR = { on: function () { return !!C.role; }, role: function () { return C.role; }, sheet: sheet, host: host, join: join, end: end, leave: leave, busy: function () { return !!C.role; } };

  /* ---------- 啟動 ---------- */
  function boot() {
    mount(); observe(); chip();
    var m = /[?&]join=(\d{6})/.exec(location.search), scr = /[?&]screen=1/.test(location.search), keep = ss('cr321oc');
    if (m) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { } setTimeout(function () { join(m[1], scr); }, 600); }
    else if (keep && keep.c) setTimeout(function () { if (keep.r === 'host') host(keep.c, true); else join(keep.c, !!keep.s); }, 600);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
})();
