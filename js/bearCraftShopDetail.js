// 제품 정보
const product = document.getElementById("product");
const imgBox = document.createElement("div");
imgBox.id = "imgBox";
const textBox = document.createElement("div");
textBox.id = "textBox";
const name = document.createElement("div");
name.id = "productName";
const price = document.createElement("div");
price.id = "productPrice";
const detail = document.createElement("div");
detail.id = "detail";
const button = document.createElement("button");
button.onclick = addCart;
button.innerText = "장바구니 추가";

product.appendChild(imgBox);
textBox.appendChild(name);
textBox.appendChild(price);
textBox.appendChild(detail);
textBox.appendChild(button);
product.appendChild(textBox);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

fetch("nav.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("nav").innerHTML = data;

    // 동적으로 삽입된 <script> 실행
    const scripts = document.querySelectorAll("#nav script");
    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      newScript.src = script.src || "";
      newScript.textContent = script.textContent || "";
      document.body.appendChild(newScript);
    });
  })
  .catch((error) => console.error("Error loading nav.html:", error));

// 장바구니 추가
function addCart() {
  let shoppingCart =
    JSON.parse(window.localStorage.getItem("shoppingCart")) || [];
  const productUrl = new URLSearchParams(window.location.search);
  const productId = productUrl.get("id");
  const product = saveData.find((item) => item.id === productId);

  if (product) {
    let userInfo = {
      img: product.img,
      id: product.id,
      name: product.name,
      price: product.price,
      detail: product.detail,
    };

    const shoppingId = shoppingCart.filter(
      (item) => item.id === product.id
    ).length;

    // 중복일 시
    if (shoppingId >= 1) {
      Swal.fire({
        title: "장바구니에 이미 이 상품이 있습니다.",
        text: "추가하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "장바구니 추가",
      }).then((result) => {
        // 중복으로 추가
        if (result.isConfirmed) {
          shoppingCart.push(userInfo);
          window.localStorage.setItem(
            "shoppingCart",
            JSON.stringify(shoppingCart)
          );

          Swal.fire({
            title: "장바구니에 추가되었습니다.",
            icon: "success",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "장바구니로 이동",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "../html/bearCraftShopCart.html";
            }

            // 취소 시 새로고침
            if (result.isDismissed) {
              window.location.href = window.location.href;
              window.scrollTo(0, 0);
            }
          });
        }
      });
    } else {
      // 중복 아닐 시
      shoppingCart.push(userInfo);
      window.localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

      Swal.fire({
        title: "장바구니에 추가되었습니다.",
        icon: "success",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "장바구니로 이동",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../html/bearCraftShopCart.html";
        }
        // 취소 시 새로고침
        if (result.isDismissed) {
          window.location.href = window.location.href;
          window.scrollTo(0, 0);
        }
      });
    }
  }
}

// 제품 정보 표시
window.onload = function () {
  const productUrl = new URLSearchParams(window.location.search);
  const productId = productUrl.get("id");
  const product = saveData.find((item) => item.id === productId);

  if (product) {
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productPrice").innerText = `₩ ${Number(
      product.price
    ).toLocaleString()}`;
    document.getElementById("detail").innerText = product.detail;
    document.getElementById(
      "imgBox"
    ).style.backgroundImage = `url(../image/${product.img})`;
  } else {
    console.log("제품을 찾을 수 없습니다.");
  }

  window.scrollTo(0, 0);
};

// footer
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
