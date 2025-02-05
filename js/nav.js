// 장바구니 상품 수
if (typeof window.shoppingCart === "undefined") {
  window.shoppingCart =
    JSON.parse(window.localStorage.getItem("shoppingCart")) || []; // 전역으로
}

const num = document.getElementById("num");

if (window.shoppingCart.length === 0) {
  num.innerText = 0;
} else {
  num.innerText = window.shoppingCart.length;
}

// 네비게이션 경고창
function showAlert() {
  Swal.fire({
    icon: "error",
    title: "준비 중..",
    text: "아직 준비되지 않았습니다.",
  });
}

// 페이지 이동
function move(url) {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = `../html/${url}`;
  }, 500);
}

function moveDetail(id) {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = `../html/bearCraftShopDetail.html?id=${id}`;
  }, 500);
}
