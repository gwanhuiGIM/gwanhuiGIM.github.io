// 진행 과정 사례 접기(details.case): 주소 끝이 #case-… 이면 그 사례를, #process 같은 절 앵커면 그 절의 사례를 모두 펼친다.
// index 핵심역량 근거 링크로 들어온 독자가 닫힌 토글이 아니라 근거 문장을 바로 보게 하려는 것(2026-11-03 Phase 4, 사용자 q1o).
// 닫힌 사례 안의 그림·단계 id(index 키워드 링크, 11-12)는 펼친 뒤 다시 스크롤한다 — 닫힌 상태에선 브라우저가 위치를 못 잡는다.
// 접힌 블록이 겹쳐 있으면(팀 블록 안의 사례·절, 11-14) 바깥 블록까지 모두 펼친다.
// 들어온 사례는 제목을 화면 세로 중앙에 두고(아래로 읽어 내려가게), 사례 영역에 .landing(좌우 막대 + 옅은 배경)을
// 다른 링크로 옮길 때까지 남긴다(사용자 2026-11-17 "중앙에서 시작해 시작점을 먼저 보게하고" · q2b).
var landAnchor = null;
function land(t) {
  document.querySelectorAll('.landing').forEach(function (x) { x.classList.remove('landing'); });
  var b = t.closest('details.case') || (t.matches('details, section') ? t : t.closest('details')) || t;
  b.classList.add('landing');
  landAnchor = t.matches('details') ? (t.querySelector('summary') || t)
    : t.matches('section') ? (t.querySelector('h2, h3') || t) : t;
  landAnchor.scrollIntoView({ block: 'center' });
  landUntil = Date.now() + 3000; userMoved = false;
}
// 위쪽 사진이 늦게 로드되면 글이 밀려 제목이 화면 밖으로 나간다 — 착지 뒤 3초 동안은 높이가 바뀔 때 다시 가운데로
// (사용자가 그 사이 스크롤·키 입력·클릭을 하면 멈춤)
var landUntil = 0, userMoved = false;
['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (e) { addEventListener(e, function () { userMoved = true; }, { passive: true }); });
// 사용자 입력이 아닌 스크롤(늦게 뜬 영상 iframe 등)로 제목이 가운데에서 벗어나도 같은 3초 안에서는 되돌린다
function keepCenter() {
  if (!landAnchor || userMoved || Date.now() > landUntil) return;
  var r = landAnchor.getBoundingClientRect();
  if (Math.abs(r.top + r.height / 2 - innerHeight / 2) > 40) landAnchor.scrollIntoView({ block: 'center' });
}
if (window.ResizeObserver) new ResizeObserver(keepCenter).observe(document.documentElement);
addEventListener('scroll', keepCenter, { passive: true });
function openHash() {
  var id = decodeURIComponent(location.hash.slice(1));
  var t = id && document.getElementById(id);
  if (!t) return;
  var d = t.closest('details');
  if (d) {
    for (var a = d; a; a = a.parentElement && a.parentElement.closest('details')) {
      if (!a.open) a.open = true;
    }
  }
  else t.parentElement.querySelectorAll('details.case').forEach(function (x) { x.open = true; });
  land(t);
}
// 브라우저가 load 때 주소의 #로 다시 스크롤하면 맨 위로 붙으니 한 번 더 가운데로(load는 3초 제한과 별개 — 늦게 끝나도 사용자 입력이 없으면 맞춘다)
addEventListener('load', function () { if (landAnchor && !userMoved) landAnchor.scrollIntoView({ block: 'center' }); });
// index 키워드 각주(?from=fn)로 들어오면 사례 대신 첫머리 흐름도(#role-map)로 가서 해당 진행 과정 번호를 강조한다
// — 링크 → 흐름 확인 → 세부 순서(사용자 2026-11-16 "a"). 목표가 사례 안 그림·단계면 그 사례 번호를 강조하고,
// 번호를 누르면 원래 목표로 간다. 흐름도에 대응 칸이 없으면(#team 등) false를 돌려 기존 openHash로 바로 이동.
// ?from=fn 표시는 index.html 끝의 스크립트가 기술 키워드 트리의 기록 링크(li.rec)에 자동으로 붙인다(손으로 안 붙여도 됨).
function flowFirst() {
  if (new URLSearchParams(location.search).get('from') !== 'fn') return false;
  var id = decodeURIComponent(location.hash.slice(1));
  var t = id && document.getElementById(id), map = document.getElementById('role-map');
  if (!t || !map) return false;
  function find(k) { return map.querySelectorAll('a[href="#' + k + '"]'); }
  var hits = find(id);
  if (!hits.length) {
    var c = t.closest('details.case'), h = c && c.querySelector('summary h3[id]');
    if (h) hits = find(h.id);
  }
  if (!hits.length) return false;
  history.replaceState(null, '', location.pathname); // 해시를 지워 번호를 눌렀을 때 hashchange로 openHash가 돌게
  hits.forEach(function (a) {
    a.classList.add('flow-hl');
    var b = a.closest('.pipe-box'); if (b) b.classList.add('flow-hl-box');
    a.setAttribute('href', '#' + id);
  });
  var tip = document.createElement('p'); tip.className = 'flow-tip';
  tip.textContent = '강조된 항목을 누르면 이동합니다';
  var title = map.querySelector('.role-map-title');
  if (title) title.after(tip); else map.prepend(tip);
  // 로딩이 끝나기 전에 강조 번호를 눌러 사례로 착지했으면(landAnchor) load 때 흐름도로 되돌리지 않는다(Codex 지적 11-17)
  function go() { if (!landAnchor) map.scrollIntoView({ block: 'start' }); }
  go(); addEventListener('load', go);
  return true;
}
addEventListener('DOMContentLoaded', function () { if (!flowFirst()) openHash(); });
addEventListener('hashchange', openHash);
