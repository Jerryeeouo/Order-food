let alreadyPick = JSON.parse(localStorage.getItem('alreadyPick')) || [];
let historyTime = JSON.parse(localStorage.getItem('historyLog')) || [];
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
    
   lines.forEach(function(line) {
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
  
  updateList();
  
  localStorage.setItem('alreadyPick', JSON.stringify(alreadyPick));
  localStorage.setItem('historyTime', JSON.stringify(historyTime));

  results = [];
  inputList = [];
  console.log(alreadyPick);
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

function updateList() {
    const displayArea = document.getElementById("pickedList");
    const alreadyList = historyTime.slice().reverse();
  
    const htmlContent = alreadyList.map(function(item) {
        return "<div>" + item.id + " - " + item.date + "剩餘免疫次數" + item.protect + "</div>";
    }).join('');
    
    displayArea.innerHTML = htmlContent;
}
