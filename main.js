let alreadyPick = [];
let results = [];
let inputList = [];
let found = [];
let historyTime = [];

function UserInput(num) {
    // 1. 從輸入框「撈出」資料
    inputList = document.getElementById("foodListInput").value;
    
    // 2. 呼叫你的機器
    getnum(inputList,num);
}

function getnum(foodList,num) {
  const lines = foodList.trim().split('\n');
  found = [];
  let Numbers = [];
    
    // 3. 用 forEach 迴圈開始檢查每一行
   lines.forEach(function(line) {
        // 嘗試在這一行搜尋「忠」後面跟著兩個數字
      const regex = /忠(\d{2})/g;
      let match;
     
      while ((match = regex.exec(line)) !== null) {
        // match[0] 是 "忠22"，match[1] 是 "22"
         const seat = match[1];  
         
         if (!found.includes(seat)) {
           found.push(seat);
         }
            // found[0] 就是抓到的內容，例如 "忠22"
         if (found && !Numbers.includes(seat)) {
           if(!alreadyPick.includes(seat) && !results.includes(seat)){  
              Numbers.push(seat);
           }
         }
      }
   });
  
  draw(Numbers, num);
  alert("今日取餐：" + results.join("、"));
  
  const now = new Date();
  const date = (now.getMonth() + 1) + "/" + now.getDate();

  // 更新邏輯用的名單
  alreadyPick.push(...results); 

  // 更新顯示用的名單
  results.forEach(seat => {
    historyTime.push({ id: seat, date: date });
  });
  
  updateList();
  
  localStorage.setItem('alreadyPick', JSON.stringify(alreadyPick));
  localStorage.setItem('historyLog', JSON.stringify(historyTime));

  results = [];
  inputList = [];
  console.log(alreadyPick);
}

function draw(Numbers, count) {
    // 1. 複製一份清單，避免原始清單被改變
    let Seatnum = [...Numbers];
    
    // 2. 隨機打亂順序
   Seatnum.sort(function(a, b) {
    return Math.random() - 0.5;
   });
    // 3. 取出前 count 個
    let picked = Seatnum.slice(0, count);
    
    if(picked.length >= count){
      results.push(...picked);
    }else if(picked.length < count){
      let PickedList = [];
      let foundnum = [];
      for (let name of alreadyPick) {
         if (!found.includes(name)) {
            PickedList.push(name);
         }
      }
      for (let name of found) {
         if (!picked.includes(name)) {
            foundnum.push(name);
         }
      }
      alreadyPick = [];
      alreadyPick = PickedList;
      
      historyTime = historyTime.filter(item => !found.includes(item.id));

      results.push(...picked);
      foundnum.sort(function(a, b) {
        return Math.random() - 0.5;
      });
      picked = foundnum.slice(0, count-picked.length);
      results.push(...picked);
    }
}

function updateList() {
    const displayArea = document.getElementById("pickedList");
   // 1. 先用 slice() 複製一份，再用 reverse() 把它反轉
    const alreadyList = historyTime.slice().reverse();
  
    const htmlContent = alreadyList.map(function(item) {
        return "<div>" + item.id + " - " + item.date + "</div>";
    }).join('');
    
    displayArea.innerHTML = htmlContent;
}
