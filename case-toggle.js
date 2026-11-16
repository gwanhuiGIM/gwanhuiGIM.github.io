// 진행 과정 사례 접기(details.case): 주소 끝이 #case-… 이면 그 사례를, #process 같은 절 앵커면 그 절의 사례를 모두 펼친다.
// index 핵심역량 근거 링크로 들어온 독자가 닫힌 토글이 아니라 근거 문장을 바로 보게 하려는 것(2026-11-03 Phase 4, 사용자 q1o).
// 닫힌 사례 안의 그림·단계 id(index 키워드 각주 링크, 11-12)는 펼친 뒤 다시 스크롤한다 — 닫힌 상태에선 브라우저가 위치를 못 잡는다.
// 접힌 블록이 겹쳐 있으면(팀 블록 안의 사례·절, 11-14) 바깥 블록까지 모두 펼친다.
function openHash() {
  var id = decodeURIComponent(location.hash.slice(1));
  var t = id && document.getElementById(id);
  if (!t) return;
  var d = t.closest('details');
  if (d) {
    var opened = false;
    for (var a = d; a; a = a.parentElement && a.parentElement.closest('details')) {
      if (!a.open) { a.open = true; opened = true; }
    }
    if (opened) t.scrollIntoView();
  }
  else t.parentElement.querySelectorAll('details.case').forEach(function (x) { x.open = true; });
}
// index 키워드 각주(?from=fn)로 들어오면 사례 대신 첫머리 흐름도(#role-map)로 가서 해당 진행 과정 번호를 강조한다
// — 링크 → 흐름 확인 → 세부 순서(사용자 2026-11-16 "a"). 목표가 사례 안 그림·단계면 그 사례 번호를 강조하고,
// 번호를 누르면 원래 목표로 간다. 흐름도에 대응 칸이 없으면(#team 등) false를 돌려 기존 openHash로 바로 이동.
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
  function go() { map.scrollIntoView({ block: 'start' }); }
  go(); addEventListener('load', go);
  return true;
}
addEventListener('DOMContentLoaded', function () { if (!flowFirst()) openHash(); });
addEventListener('hashchange', openHash);
