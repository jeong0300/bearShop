// 네비게이션 경고창
function showAlert() {
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

function moveDetail(id) {
  window.location.href = `../html/bearCraftShopDetail.html?id=${id}`;
}
