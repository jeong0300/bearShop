const mainContainer = document.getElementById("mainContainer");
const footer = document.getElementById("footer");

const headDiv = document.createElement("div");
const categoryDiv = document.createElement("div");

const contentDiv = document.createElement("div");
contentDiv.id = "content";

headDiv.innerHTML =
  "<div class='hTag'><h2> PRODUCT </h2></div><div class='lineTag'><hr/></div>";

categoryDiv.innerHTML =
  "<div class='category'><ul id='categoryList'><li><a id='categoryItem' data-contents='all'>ALL</a></li><li><a id='categoryItem' data-contents='color'>COLOR BEAR</a></li><li><a id='categoryItem' data-contents='concept'>CONCEPT BEAR</a></li></ul></div>";
mainContainer.appendChild(headDiv);
mainContainer.appendChild(categoryDiv);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// 네비게이션 로드

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

// 카테고리 (css)
document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll("#categoryList li a");

  // ALL을 기본 선택 상태로 설정
  const defaultItem = document.querySelector(
    "#categoryItem[data-contents='all']"
  );
  if (defaultItem) {
    defaultItem.classList.add("active");
  }

  categoryItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      // 활성 클래스 추가
      categoryItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      // 필터링 함수 실행
      const selectedCategory = event.target.dataset.contents;
      filterMenu(selectedCategory);
    });
  });
});

// 카테고리 별 내용 출력
const filterMenu = (selectedCategory) => {
  const contentDiv = document.getElementById("content");

  contentDiv.style.transition = "opacity 1s ease";
  contentDiv.style.opacity = 0;

  setTimeout(() => {
    contentDiv.innerHTML = "";

    if (selectedCategory === "all") {
      addTr();
    } else {
      let filteredData = saveData.filter(
        (item) => item.category === selectedCategory
      );

      if (filteredData.length === 0) {
        contentDiv.innerHTML = `
          <div id="prepareImgBox">
            <img src="../image/prepare.png" alt="Prepare Image" />
          </div>`;
      } else {
        filteredData.forEach((data) => {
          const priceFin = Number(data.price).toLocaleString();
          const div = document.createElement("div");
          div.id = "productBox";

          div.innerHTML = `
            <div class="box" id="${data.id}" data-id="${data.id}">
              <div class="imgBox" onclick="moveDetail(${data.id})">
                <img src="${data.img}" alt="product image" />
              </div>
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
      }
    }

    contentDiv.style.opacity = 1;
  }, 300);
};

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
  }
  window.localStorage.setItem("saveData", JSON.stringify(saveData));
}

// 제품 출력
function addTr() {
  // 만약 saveData가 비어있을 씨
  if (saveData.length === 0) {
    const prepareImgDiv = document.createElement("div");
    prepareImgDiv.id = "prepareImgBox";
    prepareImgDiv.innerHTML = `
      <img src="../image/prepare.png" alt="Prepare Image" />
    `;
    contentDiv.appendChild(prepareImgDiv);
    mainContainer.appendChild(contentDiv);
    return;
  }

  // saveData가 비어있지 않을 시
  const rows = saveData.map((data) => {
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
