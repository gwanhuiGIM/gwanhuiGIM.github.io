// 진행 과정 사례 접기(details.case): 주소 끝이 #case-… 이면 그 사례를, #process 같은 절 앵커면 그 절의 사례를 모두 펼친다.
// index 핵심역량 근거 링크로 들어온 독자가 닫힌 토글이 아니라 근거 문장을 바로 보게 하려는 것(2026-11-03 Phase 4, 사용자 q1o).
function openHash() {
  var id = decodeURIComponent(location.hash.slice(1));
  var t = id && document.getElementById(id);
  if (!t) return;
  var d = t.closest('details');
  if (d) d.open = true;
  else t.parentElement.querySelectorAll('details.case').forEach(function (x) { x.open = true; });
}
addEventListener('DOMContentLoaded', openHash);
addEventListener('hashchange', openHash);
