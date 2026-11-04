// index·프로젝트·전공 페이지 사진 확대: 본문 사진을 누르면 화면 가득 크게 보여 주고, 다시 누르거나 Esc로 닫는다(사용자 2026-11-04).
// 사진을 감싼 이미지 링크(<a href="images/...">)도 새 탭 대신 같은 확대 창으로 연다.
addEventListener('DOMContentLoaded', function () {
  var dlg = document.createElement('dialog');
  dlg.className = 'zoom';
  var big = document.createElement('img');
  dlg.appendChild(big);
  document.body.appendChild(dlg);
  dlg.addEventListener('click', function () { dlg.close(); });
  document.querySelectorAll('main img').forEach(function (img) {
    var a = img.closest('a');
    if (a && !/\.(jpe?g|png|gif|webp)$/i.test(a.getAttribute('href') || '')) return; // 다른 곳으로 가는 링크는 그대로
    img.classList.add('zoomable');
    (a || img).addEventListener('click', function (e) {
      e.preventDefault();
      big.src = a ? a.href : img.currentSrc || img.src;
      big.alt = img.alt;
      dlg.showModal();
    });
  });
});
