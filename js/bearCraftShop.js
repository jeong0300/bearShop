const mainContainer = document.getElementById("mainContainer");

const div = document.createElement("div");

// 새로고침에도 테이블 유지
function addTr() {
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
}

window.onload = function () {
  addTr();
};
