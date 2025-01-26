// 네비게이션 경고창
function alert() {
  Swal.fire({
    icon: "error",
    title: "준비 중..",
    text: "아직 준비되지 않았습니다.",
  });
}

// 페이지 이동
function move() {
  window.location.href = "../html/bearCraftShopCart.html";
}

// footer
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
