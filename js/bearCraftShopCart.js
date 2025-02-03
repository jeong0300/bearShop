fetch("nav.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("nav").innerHTML = data;

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

  shoppingCart.sort((a, b) => a.id - b.id);

  // 장바구니에 상품이 있을 시
  shoppingCart.map((item) => {
    const divPro = document.createElement("div");
    divPro.id = "product";

    const imgPro = document.createElement("div");
    imgPro.classList.add("imgPro");
    imgPro.innerHTML = `<img src="../image/${item.img}" alt="${item.name}" onclick="moveDetail(${item.id})">`;

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

    deleteButton.onclick = function () {
      Swal.fire({
        title: "장바구니에서 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "삭제",
      }).then((result) => {
        if (result.isConfirmed) {
          // 인덱스를 찾아 제거
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
        }
      });
    };

    divPro.appendChild(imgPro);
    divPro.appendChild(strPro);
    divPro.appendChild(deleteButton);

    // 상품 추가
    proContainer.appendChild(divPro);
  });

  const clearBtn = document.createElement("button");
  clearBtn.id = "clearBtn";
  clearBtn.innerText = "모두 지우기";
  clearBtn.classList.add("clearButton");

  // 스토리지 삭제 버튼
  clearBtn.onclick = function () {
    Swal.fire({
      title: "장바구니를 비우겠습니까?",
      text: "장바구니의 상품이 모두 사라집니다.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          window.localStorage.removeItem("shoppingCart");
          location.reload();
          scrollTo(0, 0);
        }
      }
    });
  };

  if (shoppingCart.length > 0) {
    proContainer.appendChild(clearBtn);
  }

  const receiptDiv = document.createElement("div");
  receiptDiv.classList.add("receipt");

  let totalPrice = 0;
  const productCount = {};

  shoppingCart.map((item) => {
    // 상품 아이디 별 개수
    if (productCount[item.id]) {
      productCount[item.id].quantity += 1;
    } else {
      productCount[item.id] = {
        name: item.name,
        price: item.price,
        quantity: 1,
      };
    }
  });

  // 영수증 추가
  for (let id in productCount) {
    const receiptItem = document.createElement("div");
    receiptItem.classList.add("receiptItem");

    const name = document.createElement("div");
    name.classList.add("receiptName");
    name.innerText = productCount[id].name;

    const quantity = document.createElement("div");
    quantity.classList.add("receiptQuantity");
    quantity.innerText = `${productCount[id].quantity}개`;

    const price = document.createElement("div");
    price.classList.add("receiptPrice");
    price.innerText = `₩ ${Number(productCount[id].price).toLocaleString()}`;

    receiptItem.appendChild(name);
    receiptItem.appendChild(quantity);
    receiptItem.appendChild(price);

    totalPrice += productCount[id].price * productCount[id].quantity; // 총 가격 계산
    receiptDiv.appendChild(receiptItem);
  }

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("receiptTotal");
  totalDiv.innerHTML = `<div class="totalText">총 가격: ₩ ${Number(
    totalPrice
  ).toLocaleString()}</div>`;
  // 구매하기 버튼 추가
  const purchaseBtn = document.createElement("button");
  purchaseBtn.id = "purchaseBtn";
  purchaseBtn.innerText = "구매하기";
  purchaseBtn.classList.add("purchaseButton");

  // 버튼 클릭 시 경고창 표시
  purchaseBtn.onclick = function () {
    Swal.fire({
      title: "구매하시겠습니까?",
      text: "구매 후에는 취소가 불가능합니다.",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "구매",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "구매 완료!",
          text: "구매가 성공적으로 완료되었습니다.",
          icon: "success",
        });
      }
    });
  };

  // 총 가격 및 구매 버튼 추가
  totalDiv.appendChild(purchaseBtn);
  receiptDiv.appendChild(totalDiv);

  proContainer.appendChild(receiptDiv);
}

window.onload = function () {
  window.scrollTo(0, 0);
  addCart();
};

// footer
const footer = document.getElementById("footer");
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
