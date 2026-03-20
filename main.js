let alreadyPick = [];
let historyTime = [];
let results = [];
let inputList = [];
let found = [];

function UserInput(num) {
    inputList = document.getElementById("foodListInput").value;
    
    getnum(inputList,num);
}

function getnum(foodList,num) {
  const lines = foodList.trim().split('\n');
  found = [];
  let Numbers = [];
    
    // 3. 用 forEach 迴圈開始檢查每一行
   lines.forEach(function(line) {
        // 嘗試在這一行搜尋「忠」後面跟著兩個數字
      const seat = /忠(\d{2})/g;
      let match;
     
      while ((match = seat.exec(line)) !== null) {
         const seat = match[1];  
         
         if (!found.includes(seat)) {
           found.push(seat);
         }
      }
    });
  
    historyTime.forEach(item => {
      if (found.includes(item.id)) {
         item.protect -= 1;
      }
    });
        
    historyTime = historyTime.filter(item => item.protect > 0);
    alreadyPick = historyTime.map(item => item.id);
        
    found.forEach(seat => {
      if (!alreadyPick.includes(seat)) {
        Numbers.push(seat);
      }
    });

  draw(Numbers, num);
  
  alert("今日取餐：" + results.join("、"));
  
  const now = new Date();
  const date = (now.getMonth() + 1) + "/" + now.getDate();

  results.forEach(seat => {
    historyTime.push({ id: seat, date: date, protect:4});
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
      
      historyTime = historyTime.filter(num => !protected.includes(num.id));
      
      let protectMin = protected.slice(0, count-picked.length);
      results.push(...protectMin.map(data => data.id));
    }
}

function window.updateList() {
    const displayArea = document.getElementById("pickedList");
    if (!Array.isArray(historyTime)) return;
    const alreadyList = [...historyTime].reverse();
    
    const htmlContent = alreadyList.map(function(item) {
        return `
            <div class="list-item">
                ${item.id} - ${item.date} (剩餘免疫: ${item.protect}次)
                <button onclick="deleteHistory('${item.id}')" class = "delete-button">刪除</button>
            </div>`;
    }).join('');
    
    displayArea.innerHTML = htmlContent;
}

function saveCloud() {
    if (typeof window.Update === "function") {
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
    historyTime.push({ id: id, date: date, protect:4});

    saveCloud();
    numInput.value = "";
    return;
  }
  
  historyTime.push({ id: id, date: date, protect:4});
  localStorage.setItem('historyTime', JSON.stringify(historyTime));
  
  saveCloud();
  numInput.value = "";
}
