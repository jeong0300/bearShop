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

    if (typeof window.shoppingCart === "undefined") {
      window.shoppingCart =
        JSON.parse(window.localStorage.getItem("shoppingCart")) || [];
    }

    // num 업데이트
    const num = document.getElementById("num");
    if (num) {
      num.innerText = window.shoppingCart.length;
    }
  })
  .catch((error) => console.error("Error loading nav.html:", error));

const container = document.getElementById("container");
const mainContainer = document.createElement("div");
mainContainer.id = "mainContainer";
const divStr = document.createElement("div");
const count = document.createElement("div");
count.id = "count";
const innerCount = document.createElement("div");
const proContainer = document.createElement("div");
proContainer.id = "proContainer";

// 'product' 요소는 이미 동적으로 추가되어 있으므로 다시 추가할 필요 없음.
divStr.innerHTML =
  "<div class='hTag'><h2> SHOPPING CART </h2></div><div class='lineTag'><hr/></div>";

let shoppingCart =
  JSON.parse(window.localStorage.getItem("shoppingCart")) || [];

let number = shoppingCart.length;

innerCount.innerHTML = `<p> 총 ${number}개</p>`;

count.appendChild(innerCount);
mainContainer.appendChild(divStr);
mainContainer.appendChild(count);
mainContainer.appendChild(proContainer);
container.appendChild(mainContainer);

// 장바구니 출력
function addCart() {
  const shoppingCart =
    JSON.parse(window.localStorage.getItem("shoppingCart")) || [];

  // 장바구니가 비어있을 시
  if (shoppingCart.length === 0) {
    const emptyImgDiv = document.createElement("div");
    emptyImgDiv.id = "emptyImgBox";
    emptyImgDiv.innerHTML = ` 
      <img src="../image/empty.png" alt="Empty Cart" />
    `;
    proContainer.appendChild(emptyImgDiv);
    return;
  }

  // 장바구니에 상품이 있을 시
  shoppingCart.forEach((item) => {
    const divPro = document.createElement("div");
    divPro.id = "product";

    const imgPro = document.createElement("div");
    imgPro.classList.add("imgPro");
    imgPro.innerHTML = `<img src="../image/${item.img}" alt="${item.name}" />`;

    const strPro = document.createElement("div");
    strPro.classList.add("strPro");
    strPro.innerHTML = `
      <div class="productName">${item.name}</div>
      <div class="productPrice">₩ ${Number(item.price).toLocaleString()}</div>
    `;

    // 삭제 버튼
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.classList.add("deleteButton");

    // 즐겨찾기에서 제품 제거
    deleteButton.onclick = function () {
      // 제품 중복일 경우를 대비해 인덱스로 구분해 삭제
      const index = shoppingCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (index !== -1) {
        shoppingCart.splice(index, 1);
        window.localStorage.setItem(
          "shoppingCart",
          JSON.stringify(shoppingCart)
        );
        location.reload();
      }
    };

    divPro.appendChild(imgPro);
    divPro.appendChild(strPro);
    divPro.appendChild(deleteButton);

    // 상품을 proContainer에 추가
    proContainer.appendChild(divPro);
  });
}

// 페이지 로드 시 장바구니 표시
window.onload = function () {
  window.scrollTo(0, 0);
  addCart(); // 장바구니 내용 출력
};

// footer
const footer = document.getElementById("footer");
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
