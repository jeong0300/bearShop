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
let currentPage = 1;
let selectedCategory = "all";
let filteredData = saveData;

const filterMenu = (category, page = 1) => {
  const contentDiv = document.getElementById("content");
  contentDiv.style.transition = "opacity 1s ease";
  contentDiv.style.opacity = 0;

  selectedCategory = category;
  currentPage = page;

  setTimeout(() => {
    contentDiv.innerHTML = "";

    if (selectedCategory === "all") {
      filteredData = saveData;
    } else {
      filteredData = saveData.filter(
        (item) => item.category === selectedCategory
      );
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // 현재 페이지에 해당하는 데이터만 잘라서 가져오기
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const dataToDisplay = filteredData.slice(startIdx, endIdx);

    // 필터링된 데이터 출력
    if (dataToDisplay.length === 0) {
      contentDiv.innerHTML = `
        <div id="prepareImgBox">
          <img src="../image/prepare.png" alt="Prepare Image" />
        </div>`;
    } else {
      dataToDisplay.forEach((data) => {
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
              <div class="favoriteIcon" onclick="heart(event)" data-fav="${
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

      document.getElementById("js-pagination").style.display = "block";
      renderPagination(currentPage, totalPages);
    }

    contentDiv.style.opacity = 1;
  }, 300);
};

// 카테고리별 클릭 처리
document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll("#categoryList li a");

  categoryItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const selectedCategory = event.target.dataset.contents;
      // 카테고리 변경 시 필터링된 결과 업데이트
      filterMenu(selectedCategory);
    });
  });
});

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
  _totalCount = saveData.length;
  renderPagination(1);
}

// 페이지네이션
function renderPagination(currentPage) {
  console.log("kk", currentPage);
  if (filteredData.length <= 10) {
    document.getElementById("js-pagination").style.display = "none";
    return;
  } else {
    document.getElementById("js-pagination").style.display = "block";
  }

  var totalPage = Math.ceil(filteredData.length / 10);
  var pageGroup = Math.floor((currentPage - 1) / 5);

  var last = (pageGroup + 1) * 5;
  if (last > totalPage) last = totalPage;
  var first = last - 4;
  if (first <= 0) first = 1;

  var next = currentPage + 1;
  var prev = currentPage - 1;

  const fragmentPage = document.createDocumentFragment();
  const paginationElement = document.getElementById("js-pagination");
  paginationElement.innerHTML = "";

  // 이전 버튼 처리
  if (currentPage >= 2) {
    var allpreli = document.createElement("li");
    allpreli.insertAdjacentHTML(
      "beforeend",
      `<a href='#js-bottom' id='allprev'>&lt;&lt;</a>`
    );

    var preli = document.createElement("li");
    preli.insertAdjacentHTML(
      "beforeend",
      `<a href='#js-bottom' id='prev'>&lt;</a>`
    );

    fragmentPage.appendChild(allpreli);
    fragmentPage.appendChild(preli);
  }

  // 페이지 번호 출력
  for (var i = first; i <= last; i++) {
    const li = document.createElement("li");
    li.insertAdjacentHTML(
      "beforeend",
      `<a href='#js-bottom' id='page-${i}' data-num='${i}'>${i}</a>`
    );
    fragmentPage.appendChild(li);
  }

  // 다음 버튼 처리
  if (currentPage < last) {
    var allendli = document.createElement("li");
    allendli.insertAdjacentHTML(
      "beforeend",
      `<a href='#js-bottom' id='allnext'>&gt;&gt;</a>`
    );

    var endli = document.createElement("li");
    endli.insertAdjacentHTML(
      "beforeend",
      `<a href='#js-bottom' id='next'>&gt;</a>`
    );

    fragmentPage.appendChild(endli);
    fragmentPage.appendChild(allendli);
  }

  paginationElement.appendChild(fragmentPage);

  // 페이지네이션에 클릭 이벤트 리스너 추가
  const paginationLinks = document.querySelectorAll("#js-pagination a");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const $item = this;
      let selectedPage = currentPage;

      if ($item.id === "next") selectedPage = next;
      if ($item.id === "prev") selectedPage = prev;
      if ($item.id === "allprev") selectedPage = 1;
      if ($item.id === "allnext") selectedPage = totalPage;
      if ($item.id.startsWith("page-"))
        selectedPage = parseInt($item.textContent);

      // 페이지가 바뀌면 renderPagination을 호출
      currentPage = selectedPage; // currentPage 값 갱신
      renderPagination(currentPage);
      filterMenuByPage(currentPage);
    });
  });

  paginationLinks.forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`#js-pagination a#page-${currentPage}`)
    .classList.add("active");
}

// 해당 페이지의 제품을 필터링해서 출력
function filterMenuByPage(pageNumber) {
  console.log(pageNumber);
  const itemsPerPage = 10;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = pageNumber * itemsPerPage;

  const dataToShow = filteredData.slice(startIndex, endIndex);
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  if (dataToShow.length === 0) {
    contentDiv.innerHTML = `No products available for this page.`;
  } else {
    dataToShow.forEach((data) => {
      const priceFin = Number(data.price).toLocaleString();
      const div = document.createElement("div");
      div.id = "productBox";
      div.innerHTML = ` 
        <div class="box" id="${data.id}" data-id="${data.id}">
          <div class="imgBox" onclick="moveDetail(${data.id})">
            <img src="${data.img}" alt="product image" />
          </div>
          <div class="innerBox">
            <div class="font">${data.name}</div>
            <div class="favoriteIcon" onclick="heart()" data-fav="${
              data.favorite ? "1" : "0"
            }">
              <img src="../image/${
                data.favorite ? "favoriteFillIcon" : "favoriteIcon"
              }.png"/>
            </div>
          </div>
          <div class="line"></div>
          <div class="font mar"> ₩ ${priceFin} </div>
        </div>`;
      contentDiv.appendChild(div);
    });
  }
}

window.onload = function () {
  window.scrollTo(0, 0);
  addTr();
  filterMenuByPage(currentPage);
};

// footer
footer.innerHTML =
  "<div class='footImg'> <img src='../image/bearShopLogo.png' alt='bearShopLogo'/></div> <div class ='fontCenter'><h3> 대표 : 이수정 </h3> <h3> 연락처 : dltnwjd8898@naver.com </h3><p>Copyright © bearCraftShop all right reserved.</p></div>";
