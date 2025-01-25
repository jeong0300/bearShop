const mainContainer = document.getElementById("mainContainer");

const headDiv = document.createElement("div");

const contentDiv = document.createElement("div");
contentDiv.id = "content";

headDiv.innerHTML = "<h2> PRODUCT </h2><hr/>";
mainContainer.appendChild(headDiv);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// 새로고침에도 테이블 유지
function addTr() {
  const rows = saveData.map((data) => {
    const priceFin = Number(data.price).toLocaleString();
    const div = document.createElement("div");
    div.id = "productBox";

    console.log("addTr()");

    div.innerHTML = `
    <div class="box" id="${data.id}" data-id="${data.id}">
      <div class="imgBox"><img src="${data.img}" /></div>
      <div class="innerBox">
        <div class="font"> ${data.name}</div>
        <div class="heartIcon" onclick="heart()"><img src="../image/favoriteIcon.png"></div>
      </div>
      <div class="font mar"> ${priceFin} </div>
    </div>`;

    contentDiv.appendChild(div);
  });
  mainContainer.appendChild(contentDiv);
}

window.onload = function () {
  addTr();
};
