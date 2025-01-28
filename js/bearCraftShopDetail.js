function addCart() {
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
  });
}

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
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
    });
  })
  .catch((error) => console.error("Error loading nav.html:", error));

// 제품 정보
window.onload = function () {
  const productUrl = new URLSearchParams(window.location.search);
  const productId = productUrl.get("id");

  const product = saveData.find((item) => item.id === productId);

  console.log(product);

  if (product) {
    console.log(product.detail);
    // 해당 제품 정보 출력
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productPrice").innerText = `₩ ${Number(
      product.price
    ).toLocaleString()}`;
    document.getElementById("detail").innerText = product.detail;
    document.getElementById(
      "imgBox"
    ).style.backgroundImage = `url(../img/${product.img})`;
  } else {
    console.log("제품을 찾을 수 없습니다.");
  }
};

// footer
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
