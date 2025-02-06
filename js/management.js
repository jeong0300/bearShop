// table 추가 (+thead)
const table = document.createElement("table");

const headTr = document.createElement("tr");

document.querySelector(".mainContainer").appendChild(table);

const headData = ["사진", "상품명", "가격", "상세", "관리"];

headData.map((head) => {
  const th = document.createElement("th");
  th.innerText = head;
  headTr.appendChild(th);
});

table.appendChild(headTr);

// input 값
const id = document.getElementById("id");
const name = document.getElementById("name");
const price = document.getElementById("price");
const detail = document.getElementById("detail");
// radio 값 (추적)
let selectedValue = "color";
document.querySelectorAll('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    selectedValue = this.value;
  });
});
// div
const idAlert = document.getElementById("idAlert");
const nameAlert = document.getElementById("nameAlert");
const priceAlert = document.getElementById("priceAlert");
const detailAlert = document.getElementById("detailAlert");
// button
const btn = document.getElementById("btnSelect");
// 버튼 활성화
let idComplete = false;
let nameComplete = false;
let priceComplete = false;
let detailComplete = false;
// 수정 버튼 활성화
let nameCom = true;
let priceCom = true;
let detailCom = true;
// 로컬 스토리지
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

// 저장 버튼 활성화
function complete() {
  if (idComplete && nameComplete && priceComplete && detailComplete) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// 수정 버튼 활성화
function com(userId) {
  const row = document.querySelector(`tr[data-id="${userId}"]`);

  const modiBtn = row.querySelector("#modiBtn");

  if (nameCom && priceCom && detailCom) {
    modiBtn.disabled = false;
  } else {
    modiBtn.disabled = true;
  }
}

// input 실시간 감지
id.addEventListener("input", function () {
  let userInfo = {
    id: id.value,
    name: name.value,
    price: price.value,
    detail: detail.value,
  };

  const idRepeat = saveData.filter((user) => user.id === userInfo.id);

  if (idRepeat.length === 1) {
    idAlert.innerText = "중복된 아이디입니다.";
    idComplete = false;
    complete();
  } else if (id.value.length === 0) {
    idAlert.innerText = "아이디를 작성하여주세요.";
    idComplete = false;
    complete();
  } else {
    idAlert.innerText = "";
    idComplete = true;
    complete();
  }
});

name.addEventListener("input", function () {
  if (name.value.length === 0) {
    nameAlert.innerText = "상품명을 작성하여주세요.";
    nameComplete = false;
    complete();
  } else {
    nameAlert.innerText = "";
    nameComplete = true;
    complete();
  }
});

price.addEventListener("input", function () {
  if (price.value.length === 0) {
    priceAlert.innerText = "가격을 작성하여주세요.";
    priceComplete = false;
    complete();
  } else if (Number(price.value) < 10) {
    priceAlert.innerText = "10원 이상부터 등록이 가능합니다.";
    priceComplete = false;
    complete();
  } else {
    priceAlert.innerText = "";
    priceComplete = true;
    complete();
  }
});

detail.addEventListener("input", function () {
  if (detail.value.length < 10) {
    detailAlert.innerText = "상세 정보는 10자 이상 작성하여주세요.";
    detailComplete = false;
    complete();
  } else {
    detailAlert.innerText = "";
    detailComplete = true;
    complete();
  }
});

//삭제 버튼
function deleteList() {
  const id = event.target.getAttribute("data-id");

  saveData = saveData.filter((user) => user.id !== id);

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const targetRow = event.target.closest("tr");
  targetRow.remove();
}

// 수정 버튼의 input 실시간 감지
function modifyInput(userId) {
  const inputTarget = event.target;
  const alertDiv = inputTarget.nextElementSibling;

  if (inputTarget.id === "name" && inputTarget.value.length === 0) {
    alertDiv.innerText = "상품명을 작성하여주세요.";
    nameCom = false;
    com(userId);
  } else if (inputTarget.id === "price") {
    if (inputTarget.value.length === 0) {
      alertDiv.innerText = "가격을 작성하여주세요.";
      priceCom = false;
      com(userId);
    } else if (Number(inputTarget.value) < 5) {
      alertDiv.innerText = "10원 이상부터 등록이 가능합니다.";
      priceCom = false;
      com(userId);
    } else {
      alertDiv.innerText = "";
      priceCom = true;
      com(userId);
    }
  } else if (inputTarget.id === "detail") {
    if (inputTarget.value.length < 10) {
      alertDiv.innerText = "상세 정보는 10자 이상 작성하여주세요.";
      detailCom = false;
      com(userId);
    } else {
      alertDiv.innerText = "";
      detailCom = true;
      com(userId);
    }
  } else {
    alertDiv.innerText = "";
    nameCom = true;
    com(userId);
  }
}

//수정 버튼
// 수정 버튼
function modifyList(id) {
  const modiBtn = event.target;
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  const cells = tr.querySelectorAll("td div");
  const user = saveData.find((user) => user.id === String(id));

  const userId = user.id;
  const name = user.name.replaceAll(" ", "-");
  const price = user.price;
  const detail = user.detail.replaceAll(" ", "-");

  cells[0].innerHTML = `<input id='name' value=${name} /><div id='alret'></div>`;
  cells[1].innerHTML = `<input id='price' type='number' value=${price} /><div id='alret'></div>`;
  cells[2].innerHTML = `<textarea id='detail'>${detail}</textarea><div id='alret'></div>`;

  modiBtn.innerText = "수정완료";
  modiBtn.setAttribute("onclick", `modifyCom(${id})`);
  modiBtn.disabled = false;

  const nameInput = cells[0].querySelector("input");
  const priceInput = cells[1].querySelector("input");
  const detailInput = cells[2].querySelector("textarea");

  nameInput.addEventListener("input", () => modifyInput(userId));
  priceInput.addEventListener("input", () => modifyInput(userId));
  detailInput.addEventListener("input", () => modifyInput(userId));
}

// 수정 완료 버튼
function modifyCom() {
  const modiBtn = event.target;
  const row = modiBtn.closest("tr");
  const id = row.getAttribute("data-id");
  const tdAll = row.querySelectorAll("td");
  const inputs = row.querySelectorAll("td input, td textarea"); // 텍스트 영역도 추가
  const user = saveData.find((user) => user.id === id);

  const name = inputs[0].value.replaceAll("-", " ");
  const price = inputs[1].value;
  const detail = inputs[2].value.replaceAll("-", " "); // 줄바꿈을 포함한 값 처리

  const nameInp = tdAll[1];
  const priceInp = tdAll[2];
  const detailInp = tdAll[3];

  const priceFin = Number(price).toLocaleString();

  nameInp.innerHTML = `<div> ${name} </div>`;
  priceInp.innerHTML = `<div> ${priceFin} </div>`;
  detailInp.innerHTML = `<div> ${detail} </div>`; // 수정된 내용 반영

  saveData = saveData.map((user) => {
    if (user.id === id) {
      return { ...user, name, price, detail };
    }
    return user;
  });

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  modiBtn.innerText = "수정";
  modiBtn.setAttribute("onclick", `modifyList(${user.id})`);
}

// 클릭 시 데이터 테이블에 추가
function data() {
  const colorImages = [
    "akb48.png",
    "babyPink.png",
    "gogh.png",
    "lango.png",
    "pinkGold.png",
    "pushead.png",
    "stash.png",
    "xGirl.png",
  ];
  const conceptImages = [
    "fdmtl.png",
    "jellyfish.png",
    "reachOut.png",
    "kae.png",
    "munch.png",
    "snow.png",
    "ufo.png",
    "waves.png",
  ];

  // 카테고리 별 이미지 랜덤
  function getRandomImage() {
    let selectedImages;

    if (selectedValue === "color") {
      selectedImages = colorImages;
    } else if (selectedValue === "concept") {
      selectedImages = conceptImages;
    }

    const chosenImg =
      selectedImages[Math.floor(Math.random() * selectedImages.length)];
    return `../image/${chosenImg}`;
  }

  let userInfo = {
    img: getRandomImage(),
    id: id.value,
    name: name.value,
    price: price.value,
    detail: detail.value,
    category: selectedValue,
  };

  // 테이블 추가 후 저장
  saveData.push(userInfo);
  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const tbody = document.createElement("tbody");

  const priceFin = Number(userInfo.price).toLocaleString();

  // 테이블 데이터에 값 넣기
  tbody.innerHTML = `
  <tr id="${userInfo.id}" data-id="${userInfo.id}">
    <td><img src="${userInfo.img}"></td> 
    <td><div> ${userInfo.name} </div></td> 
    <td><div> ${priceFin} </div></td>
    <td><div> ${userInfo.detail} </div></td> 
    <td>
      <button onclick="modifyList('${userInfo.id}')" id="modiBtn">수정</button>
      <button onclick="deleteList()" data-id="${userInfo.id}">삭제</button>
    </td>
  </tr>`;

  table.appendChild(tbody);

  // 초기화
  id.value = "";
  name.value = "";
  price.value = "";
  detail.value = "";

  idAlert.innerText = "";
  nameAlert.innerText = "";
  priceAlert.innerText = "";
  detailAlert.innerText = "";

  idComplete = false;
  nameComplete = false;
  priceComplete = false;
  detailComplete = false;
  complete();
}

const download = document.getElementById("excelDownload");

download.addEventListener("click", function () {
  console.log("눌림");
  let filename = "testFile.csv";
  getCSV(filename);
});

function getCSV(filename) {
  console.log("실행");

  var csv = [];
  var row = [];

  row.push("상품명", "가격", "상세");

  csv.push(row.join(","));

  let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

  let chartDataList = saveData.map((data) => {});

  chartDataList.forEach((data, index) => {
    let row = [];
    row.push(data.d1, data.d2, data.d3);
  });

  downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  //한글 처리를 해주기 위해 BOM 추가하기
  const BOM = "\uFEFF";
  csv = BOM + csv;

  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

// 새로고침에도 테이블 유지
window.onload = function () {
  const rows = saveData.map((data) => {
    const tr = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const priceFin = Number(data.price).toLocaleString();

    tbody.innerHTML = `
    <tr id="${data.id}" data-id="${data.id}">
      <td><img src="${data.img}" /></td>
      <td><div> ${data.name} </div></td> 
      <td><div> ${priceFin} </div></td>
      <td><div> ${data.detail} </div></td> 
      <td><button onclick="modifyList(${data.id})" id="modiBtn"> 수정 </button> <button onclick="deleteList()" data-id="${data.id}"> 삭제 </button></td>
    </tr>`;

    table.appendChild(tbody);

    return tr;
  });

  rows.map((tr) => table.appendChild(tr));
};
