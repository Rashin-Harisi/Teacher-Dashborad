
document.addEventListener("DOMContentLoaded", async () => {
  const response = await window.api.getData();
  

  let studentName = document.getElementById("name");
  let score = document.getElementById("score");
  let status = document.getElementById("status");
  let submitBTN = document.getElementById("submit");
  let table = document.getElementById("table");
  let idUpdate


  submitBTN.addEventListener("click", async() => {
    if (studentName.value === "" || score.value === "" || status.value === "") {
      console.log("Please fill all inputs.");
      return;
    }
    if (score.value > 100) {
      console.log("Score should be between 0 to 100");
      return;
    }
    if(submitBTN.textContent === "Submit"){
      const response =await  window.api.sendData({
        name: studentName.value,
        score: score.value,
        status: status.value,
      });
      if(response.success){
          const res = await window.api.getData();
          const newRecord = res.filter(item=> item.name === response.newData.name)
          const newStudent = {
            id: newRecord[0].id,
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
    }else{
      const res = await window.api.editData({
        id : idUpdate,
        name : studentName.value,
        score: score.value,
        status : status.value
      })
      if(res.success){
        const updateStudent = res.newData
        updateTable(updateStudent)
        studentName.value = ""; 
        score.value = "";
        status.value = "";
        submitBTN.textContent = "Submit";
      }else{
        alert(response.message)
      }
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
      studentName.value = item.name;
      score.value = item.score; 
      status.value = item.status;
      idUpdate = item.id
      submitBTN.textContent = "Edit";
    });
    btnCell.appendChild(editBTN);
    newRow.appendChild(btnCell);

    let btnCell2 = document.createElement("td");
    let removeBTN = document.createElement("button");
    removeBTN.textContent = "Remove";
    removeBTN.addEventListener("click", async() => {
      const res = await window.api.deleteData(item.id)
      console.log(res);
      if(res.success){
        deleteRecord(item.id)
      }
    });
    btnCell2.appendChild(removeBTN);
    newRow.appendChild(btnCell2);

    table.appendChild(newRow);
}

})

function updateTable (data){
  const rows = Array.from(table.rows);
  try {
    rows.forEach((row)=>{
      if(row.cells[0].textContent === String(data.id)){
        row.cells[1].textContent = data.name
        row.cells[2].textContent = data.score
        row.cells[3].textContent = data.status
        

        console.log( Number(data.score));
        if(Number(data.score) < 50){
          row.cells[0].style.color = "red"
          row.cells[1].style.color = "red"
          row.cells[2].style.color = "red"
          row.cells[3].style.color = "red"
        }else {
          row.cells[0].style.color = "green"
          row.cells[1].style.color = "green"
          row.cells[2].style.color = "green"
          row.cells[3].style.color = "green"
        }
      } 
    })
    
  } catch (error) {
    console.log(error);
  }
      
}
function deleteRecord(id){
  const rows = Array.from(table.rows);
  try {
    rows.forEach((row)=>{
      if(row.cells[0].textContent === String(id)){
        row.remove()
      }
    })
  }catch(error){
    console.log(error);
  }
}