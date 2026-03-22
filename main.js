let historyTime = [];
let results = [];
let inputList = [];
let found = [];

async function fetchOrderedUsers() {
    const url = "https://asia-east1-float-smooth-ordering.cloudfunctions.net/getOrderedUsers";
    found = [];   

    try {
        const response = await fetch(url); 
        const data = await response.json(); 
        
        found = data.people.map(name => name.replace("忠", ""));
        
    } catch (error) {
        alert("連線失敗，請重新嘗試");
    }
}

async function UserInput(num) {
    await fetchOrderedUsers()
    if (found.length === 0) {
        alert("無點餐資訊");
        return;
    }
    getnum(found,num);
}

function getnum(foodList,num) {
  
  let Numbers = [];
  
    historyTime.forEach(item => {
      if (found.includes(item.id)) {
         item.protect -= 1;
      }
    });
        
    let alreadyPick = historyTime.map(item => item.id);

    const blacklist = ["22", "29"];
    found = found.filter(num => !blacklist.includes(num))
    
    found.forEach(seat => {
      if (!alreadyPick.includes(seat)) {
        Numbers.push(seat);
      }
    });

  draw(Numbers, num);
  
  alert("今日取餐：" + results.join("、"));
    
  const now = new Date();
  const date = (now.getMonth() + 1) + "/" + now.getDate();

  const displayArea = document.getElementById("today-pick");
  
  displayArea.innerHTML = results.map(id => `<span class="todayNum">${id}</span>`).join('');
    
  results.forEach(seat => {
    historyTime = historyTime.filter(num => !seat.includes(num.id));
    historyTime.push({ id: seat, date: date, protect:0});
  });
  
  saveCloud()

  results = [];
  inputList = [];
}

function draw(Numbers, count) {
    let Seatnum = [...Numbers];
    
    Seatnum.sort(function(a, b) {
    return Math.random() - 0.5;
   });
  
    let picked = Seatnum.slice(0, count);
    
    if(picked.length >= count){
      results.push(...picked);
    }else if(picked.length < count){
      results.push(...picked);
      
      let protected = historyTime.filter(num => found.includes(num.id));
      protected.sort((a, b) => a.protect - b.protect);
      
      let protectMin = protected.slice(0, count-picked.length);
      results.push(...protectMin.map(data => data.id));
    }
}

window.updateList = function() {
    if (window.historyTime) {
        historyTime = window.historyTime;
    }
    
    const displayArea = document.getElementById("pickedList");
    const alreadyList = [...historyTime].reverse();
    
    const htmlContent = alreadyList.map(function(item) {
        return `
            <div class="list-item">
                ${item.id} - ${item.date} 危險指數: ${-item.protect}
                <button onclick="deleteHistory('${item.id}')" class = "delete-button">刪除</button>
            </div>`;
    }).join('');
    
    displayArea.innerHTML = htmlContent;
}

function saveCloud() {
    if (typeof window.Update === "function" && Array.isArray(historyTime)) {
        window.Update(historyTime); 
    }
}

function deleteHistory(id) {
    historyTime = historyTime.filter(num => num.id !== id);
    saveCloud();
}

function numAdd(){
  const inputNum = document.getElementById("numInput");
  let id = inputNum.value.trim();
  
  id = id.padStart(2, '0');
  if (isNaN(id) || id.length > 2 || id === "00" || id > "31") {
    alert("請輸入正確的兩位數座號");
    return;
  }
  
  const now = new Date();
  const date = (now.getMonth() + 1) + "/" + now.getDate();

  if (historyTime.some(item => item.id == id)) {
    
    historyTime = historyTime.filter(num => num.id !== id);
    historyTime.push({ id: id, date: date, protect:0});

    saveCloud();
    numInput.value = "";
    return;
  }
  
  historyTime.push({ id: id, date: date, protect:0});
  
  saveCloud();
  numInput.value = "";
}

window.UserInput = UserInput;
window.numAdd = numAdd;
window.deleteHistory = deleteHistory;
