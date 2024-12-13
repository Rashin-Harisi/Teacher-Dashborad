document.addEventListener("DOMContentLoaded", async () => {
  const response = await window.api.getData();

  let studentName = document.getElementById("name");
  let score = document.getElementById("score");
  let status = document.getElementById("status");
  let submitBTN = document.getElementById("submit");
  let form = document.getElementById("form");
  let table = document.getElementById("table");


  submitBTN.addEventListener("click", async() => {
    if (studentName.value === "" || score.value === "" || status.value === "") {
      console.log("Please fill all inputs.");
      return;
    }
    if (score.value > 100) {
      console.log("Score should be between 0 to 100");
      return;
    }
    const response =await  window.api.sendData({
      name: studentName.value,
      score: score.value,
      status: status.value,
    });
    if(response.success){
        const res = await window.api.getData();
        const newStudent = {
          id: res.length ++,
          name: response.newData.name,
          score: response.newData.score,
          status: response.newData.status,
        }
        addDataToTable(newStudent)
        studentName.value = "";
        score.value = "";
        status.value = "";
    }else{
        alert(response.message)
    }
    
  });

  response.forEach((element) => {
    addDataToTable(element)
});


function addDataToTable (item){
    let newRow = document.createElement("tr");
    for (let key in item) {
      const newCell = document.createElement("td");
      newCell.textContent = item[key];
      if(item.score < 50){
        newCell.style.color = "red"
      }else {
        newCell.style.color = "green"
      }
      newRow.appendChild(newCell);
    }

    let btnCell = document.createElement("td");
    let editBTN = document.createElement("button");
    editBTN.textContent = "Edit";
    editBTN.addEventListener("click", () => {
      studentName.value = element.name;
      score.value = element.score;
      status.value = element.status;
      submitBTN.textContent = "Edit";
    });
    btnCell.appendChild(editBTN);
    newRow.appendChild(btnCell);

    let btnCell2 = document.createElement("td");
    let removeBTN = document.createElement("button");
    removeBTN.textContent = "Remove";
    removeBTN.addEventListener("click", () => {
      console.log("Remove clicked");
    });
    btnCell2.appendChild(removeBTN);
    newRow.appendChild(btnCell2);

    table.appendChild(newRow);
}

})