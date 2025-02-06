const mainContainer = document.getElementById("mainContainer");
const footer = document.getElementById("footer");

const headDiv = document.createElement("div");
const contentDiv = document.createElement("div");
contentDiv.id = "content";

headDiv.innerHTML =
  "<div class='hTag'><h2> FAVORITE </h2></div><div class='lineTag'><hr/></div>";

mainContainer.appendChild(headDiv);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// 네비게이션 로드
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
  })
  .catch((error) => console.error("Error loading nav.html:", error));

// 즐겨찾기
function heart() {
  const iconImg = event.target;
  const Icon = iconImg.parentElement;
  const att = Icon.getAttribute("data-fav");
  const productId = Icon.closest(".box").getAttribute("data-id");

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
    window.scrollTo(0, 0);
    location.reload();
  }
  window.localStorage.setItem("saveData", JSON.stringify(saveData));
}
// 즐겨찾기 제품 출력
function addTr() {
  const filteredData = saveData.filter((item) => item.favorite === true);

  // 즐겨찾기가 없을 시
  if (filteredData.length === 0) {
    const prepareImgDiv = document.createElement("div");
    prepareImgDiv.id = "prepareImgBox";
    prepareImgDiv.innerHTML = `
      <img src="../image/favoriteEmpty.png" alt="Prepare Image" />
    `;
    contentDiv.appendChild(prepareImgDiv);
    mainContainer.appendChild(contentDiv);
    return;
  }

  const rows = filteredData.map((data) => {
    const priceFin = Number(data.price).toLocaleString();
    const div = document.createElement("div");
    div.id = "productBox";

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
          }.png"/>
        </div>
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
  window.scrollTo(0, 0);
  addTr();
};
