const mainContainer = document.getElementById("mainContainer");
const footer = document.getElementById("footer");

const headDiv = document.createElement("div");

const contentDiv = document.createElement("div");
contentDiv.id = "content";

headDiv.innerHTML =
  "<div class='hTag'><h2> PRODUCT </h2></div><div class='lineTag'><hr/></div>";
mainContainer.appendChild(headDiv);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

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

function moveDetail(id) {
  window.location.href = `../html/bearCraftShopDetail.html?id=${id}`;
}

// 즐겨찾기
function heart() {
  const iconImg = event.target;
  const Icon = iconImg.parentElement;
  const att = Icon.getAttribute("data-fav");
  const productId = Icon.closest(".box").getAttribute("data-id");

  console.log(att);
  if (att === "0") {
    iconImg.src = "../image/favoriteFillIcon.png";
    iconImg.alt = "favorite icon";
    Icon.setAttribute("data-fav", "1");

    const product = saveData.find((item) => item.id === productId);
    if (product) {
      product.favorite = true;
    }
  } else {
    iconImg.src = "../image/favoriteIcon.png";
    Icon.setAttribute("data-fav", "0");

    const product = saveData.find((item) => item.id === productId);
    if (product) {
      product.favorite = false;
    }
  }
  window.localStorage.setItem("saveData", JSON.stringify(saveData));
}

// 제품 출력
function addTr() {
  const rows = saveData.map((data) => {
    const priceFin = Number(data.price).toLocaleString();
    const div = document.createElement("div");
    div.id = "productBox";

    console.log("addTr()");

    div.innerHTML = `
    <div class="box" id="${data.id}" data-id="${data.id}">
      <div class="imgBox" onclick="moveDetail(${data.id})"><img src="${
      data.img
    }" alt="product image" /></div>
      <div class="innerBox">
        <div class="font"> ${data.name}</div>
        <div class="favoriteIcon" onclick="heart()" data-fav="${
          data.favorite ? "1" : "0"
        }">
        <img src="../image/${
          data.favorite ? "favoriteFillIcon" : "favoriteIcon"
        }.png"/></div>
      </div>
      <div class="line"></div>
      <div class="font mar"> ₩ &nbsp${priceFin} </div>
    </div>`;

    contentDiv.appendChild(div);
  });
  mainContainer.appendChild(contentDiv);
}

// footer
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";

window.onload = function () {
  addTr();
};
