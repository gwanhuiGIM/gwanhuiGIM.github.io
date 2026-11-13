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
addEventListener('DOMContentLoaded', openHash);
addEventListener('hashchange', openHash);
