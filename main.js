let historyTime = [];
let found = [];

window.loadToday = function() {
    const now = new Date();
    const today = (now.getMonth() + 1) + "/" + now.getDate();
    const displayArea = document.getElementById("today-pick");
    
    if(results.length > 0 && results[0].date !== today){
        historyTime = historyTime.filter(num => !results.map(item => item.id).includes(num.id));
        
        historyTime.push(...results);

        window.UpdateToday([]); 
        saveCloud(); 
        return;
    };
    
    displayArea.innerHTML = results.map(function(item) {
        return `
            <div class="list-item">
                ${item.id} - ${item.date} 危險值: ${-item.protect}
                <button onclick="deleteHistory('${item.id}')" class = "delete-button">重抽</button>
            </div>`;
    }).join('');
};

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
    const btn = event.target; 
    btn.disabled = true;
    
    await fetchOrderedUsers()
    if (found.length === 0) {
        alert("無點餐資訊");
        return;
    }

    setTimeout(() => { btn.disabled = false; }, 1000);
    
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
    
  const now = new Date();
  const date = (now.getMonth() + 1) + "/" + now.getDate();

  const Picked = draw(Numbers, num);
  window.results = Picked.map(id => ({
        id: id,
        date: date,
        protect: 0
  }));
  saveCloud();
}

function draw(Numbers, count) {
    let Seatnum = [...Numbers];
    
    Seatnum.sort(function(a, b) {
    return Math.random() - 0.5;
   });
  
    let picked = Seatnum.slice(0, count);
    
    if(picked.length < count){  
      let protected = historyTime.filter(num => found.includes(num.id));
      protected.sort((a, b) => a.protect - b.protect);
      
      let protectMin = protected.slice(0, count-picked.length);
      picked.push(...protectMin.map(data => data.id));
    }
    return picked;
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
                ${item.id} - ${item.date} 危險值: ${-item.protect}
                <button onclick="deleteHistory('${item.id}')" class = "delete-button">刪除</button>
            </div>`;
    }).join('');
    
    displayArea.innerHTML = htmlContent;
}

function saveCloud() {
    if (typeof window.Update == "function" && Array.isArray(historyTime)) {
        window.Update(historyTime); 
        window.UpdateToday(results)
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
