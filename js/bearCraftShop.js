const mainContainer = document.getElementById("mainContainer");

const headDiv = document.createElement("div");

const div = document.createElement("div");

headDiv.innerHTML = "<h2> PRODUCT </h2><hr/>";
mainContainer.appendChild(headDiv);

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// 새로고침에도 테이블 유지
function addTr() {
  const rows = saveData.map((data) => {
    const priceFin = Number(data.price).toLocaleString();

    console.log(data);
    div.innerHTML = `
    <div class="box" id="${data.id}" data-id="${data.id}">
      <div><img src="${data.img}" /></div>
      <div> ${data.name}</div>
      <div> ${priceFin} </div>
    </div>`;
  });
}

window.onload = function () {
  addTr();
};
