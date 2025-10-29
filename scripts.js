//todo::
//got bug on the save after select ans



let lives = 3;
const rows = 6; 
const columns = 6; 

let randAnsSlot = new Array(rows);

let gameState = {};
let board = Array.from({ length: rows }, () => Array(columns).fill(-1));
let ansPositions = Array.from({ length: rows }, () => Array(columns).fill(0));
let ansColumn = new Array(rows).fill(0);
let ansRow = new Array(columns).fill(0);
let ansSelected = Array.from({ length: rows }, () => Array(columns).fill(0));
let ansErased = Array.from({ length: rows }, () => Array(columns).fill(0));

let numAnsSelected = 0;
let numAnsErased =0;
let clearFlag = false;



const saveBtn = document.getElementById("saveBtn");
const newBtn = document.getElementById("newBtn"); // new game
const resetBtn = document.getElementById("resetBtn");
const livebutton = document.getElementById("livebutton");
const livesContainer = document.getElementById("lives");
const boardContainer = document.getElementById("board");
const pencilBtn = document.getElementById("pencilBtn");
const eraserBtn = document.getElementById("eraserBtn");
const results = document.getElementById("results");


insertNum();
defAns();

document.addEventListener("DOMContentLoaded", function() {

    loadGameState();

    lucide.createIcons();
    
    eraserBtn.addEventListener("click", () => {
        setActiveTool(eraserBtn);
    });

    pencilBtn.addEventListener("click", () => {
        setActiveTool(pencilBtn);
    });

    saveBtn.addEventListener("click", () => {
        saveGame();
    });

    newBtn.addEventListener("click", () =>{
        NewGame();
    });

    resetBtn.addEventListener("click", () =>{
        resetGame();
         location.reload();
        loadGameState();
        
    });
    
    

    liveCounter();
    loadBoard();
    printing();

});


function setGameState(){
    if(clearFlag){
        gameState = {
            lives: 3,
            board: board,
            ansSelected: Array.from({ length: rows }, () => Array(columns).fill(0)),
            ansErased: Array.from({ length: rows }, () => Array(columns).fill(0)),
            ansPositions: ansPositions,
            ansColumn: ansColumn,
            ansRow: ansRow,
        };
    }else{
        gameState = {
            lives: lives,
            board: board,
            ansSelected: ansSelected,
            ansErased: ansErased,
            ansPositions: ansPositions,
            ansColumn: ansColumn,
            ansRow: ansRow,
        };
    }
    console.log("gameState set!");
}

function saveGame() {
  setGameState();
  localStorage.setItem("gameState", JSON.stringify(gameState));
  console.log("Game saved!");
}


function loadGameState() {
  const savedState = localStorage.getItem("gameState");

  if (savedState) {
    const gameState = JSON.parse(savedState);

    lives = gameState.lives;
    board = gameState.board;
    ansSelected = gameState.ansSelected;
    ansErased = gameState.ansErased;
    ansPositions = gameState.ansPositions;
    ansColumn = gameState.ansColumn;
    ansRow = gameState.ansRow;


    console.log("Game state loaded:", gameState);
  } else {
    console.log("No saved game found.");
  }
}

function NewGame() {
  localStorage.removeItem("gameState");
  console.log("Game data cleared!");
  location.reload();
}

function resetGame(){
    clearFlag = true;
    saveGame();
}

function flashRedBorder() {
     const flash = document.createElement("div");
    flash.classList.add("flash-red");
    document.body.appendChild(flash);

    setTimeout(() => flash.remove(), 700);
}

function killLive(){
    if(lives > 0) {
        lives--;
        livesContainer.removeChild(livesContainer.lastChild);
        flashRedBorder();
    }
}


function setActiveTool(activeBtn) {
    [eraserBtn, pencilBtn].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}



async function liveCounter() {
    for(let i=0; i<lives; i++) {
        const heartIcon = document.createElement("i");

        heartIcon.setAttribute("data-lucide", "heart");
        heartIcon.classList.add("heartIcon");

        livesContainer.appendChild(heartIcon);

        lucide.createIcons();
    }
}




function randNumAnsSlot(){
    const maxSlot = 5;

    for(let i=0; i<randAnsSlot.length; i++){
        let numSlot = Math.floor(Math.random() * maxSlot)+1;
        randAnsSlot[i] = numSlot
    }
}

function selectAnsSlot(){
    randNumAnsSlot();
    const max= columns;

    for(let i=0; i<rows; i++){
         let j=0;

        while(j<randAnsSlot[i]){
            let randSlot =  Math.floor(Math.random() * max);

            if( ansPositions[i][randSlot] == 1){
                continue;
            }
            
            ansPositions[i][randSlot] = 1;
            j++;
        }
    }
    checker();
}


function randNum(){
    const maxNum= 9;
    let num = Math.floor(Math.random() * maxNum)+1;

    return num;
}

function insertNum(){
    for(let i=0; i< rows;i++){
        for(let j=0; j<columns; j++){
            let num = randNum();
            board[i][j] = num;
        }
    }
}

function defAns(){
    selectAnsSlot();
    for(let i=0; i< rows; i++){
        for(let j=0; j<columns; j++){
            if(ansPositions[i][j] == 1 ){
                ansColumn[j] += board[i][j];
                ansRow[i] += board[i][j];
            }
        }
    }
    console.log("ansCols: ", ansRow[0]);

}

function checker(){
    const max= rows;
    for(let j=0; j<columns; j++){
        for(let i=0; i<rows; i++){
            if(ansPositions[i][j] == 1){
                break;
           }
        }   

        let randSlot =  Math.floor(Math.random() * max);
        ansPositions[randSlot][j] = 1;
        
    }
}

function getTotalAns(){
    let totalAns =0;
    for(let i=0; i<rows;i++){
        for(let j=0; j< columns; j++){
            if(ansPositions[i][j]==1){
                totalAns++;
            }
        }
    }

    return totalAns;
}


async function printing(){
    for(let i=0; i<rows; i++){
        console.log(`r${i+1}:`);

        console.log(`Positions: ${ansPositions[i].join(", ")}`);


        
    }
}


function checkIfCorrect(row, col, boardbox){
    let wrongflag = false;

    if(pencilBtn.classList.contains("active") && ansPositions[row][col] == 0){
        wrongflag = true;
    }else if(eraserBtn.classList.contains("active") && ansPositions[row][col] == 1){
        wrongflag = true;
    }

    if(wrongflag){
        let isDrawn = checkIfDrawn(boardbox);
        if(!isDrawn){
            killLive();
        }
    }

    return wrongflag;
}


function printResult(result){
    const resultContent = document.createElement("div");
    resultContent.classList.add("resultsContent");

    // Add message
    if(result == "WIN"){
        resultContent.textContent = "🎉 YOU WIN!" ;
    }else{
        resultContent.textContent = "💀 YOU LOSE!";
    }

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.classList.add("closeBtn");
    closeBtn.addEventListener("click", () => {
        resultContent.remove();
        NewGame();

    });

    resultContent.appendChild(closeBtn);
    results.appendChild(resultContent);
}


function checkIfLose(){
    if(lives == 0){
        console.log("Loseee");
        let result = "LOSE";
        printResult(result);

    }
}

function checkIfWin(){
    let totalAns = getTotalAns();
    let totalErase = (rows*columns)-totalAns;

    if(numAnsSelected == totalAns && numAnsErased == totalErase){
        let result = "WIN";
        printResult(result);
    }
}

function checkIfDrawn(boardbox){
    let isDrawn = false;
    const wasClear = boardbox.classList.contains("clear");
    const icon = boardbox.querySelector(".circleIcon");

    if(wasClear || icon){
        isDrawn = true;
    }

    return isDrawn;
}

function checkAnsSelected(i,j){ 
    if(ansSelected[i][j] == 1 || ansErased[i][j] == 1){
        console.log("ans Selected / Erased !");
    }else{
        console.log("error selecting/ erasing");
    }
}

function drawAns(boardbox, i , j){
    const wasClear = boardbox.classList.contains("clear");
    const icon = boardbox.querySelector(".circleIcon");
    if(!wasClear && !icon){
        const circleIcon = document.createElement("i");
        circleIcon.setAttribute("data-lucide", "circle");
        circleIcon.classList.add("circleIcon");
        boardbox.appendChild(circleIcon);
               
        // re-render Lucide icons
        lucide.createIcons();
        numAnsSelected++;

        //save the drawn ans

        if(i==0 || j==0){
            ansSelected[i][j] = 1;
        }

        ansSelected[i][j] = 1;
        //checkAnsSelected(i,j);
        
     }
}

function eraseAns(boardbox, i, j){
    const wasClear = boardbox.classList.contains("clear");
    const icon = boardbox.querySelector(".circleIcon");
    if(!icon && !wasClear){
        boardbox.innerHTML = "&nbsp;";
        boardbox.classList.add("clear");

        numAnsErased++;

        //save the drawn ans
        ansErased[i][j] = 1;
        //checkAnsSelected(i,j);
     }
}

function loadPreviousAns(){
    for(let i = 0; i<rows; i++){
        for(let j=0; j<columns; j++){
            const selector = `.boardBox[data-row='${i}'][data-col='${j}']`;
            const boardbox = document.querySelector(selector);
            if(ansSelected[i][j] == 1){
                if (boardbox) {
                    drawAns(boardbox, i, j);
                }
            }

            if(ansErased[i][j] ==1 ){
                if (boardbox) {
                    eraseAns(boardbox, i, j);
                }
            }

        }
    }
}

function checkIfLineComplete(row,col){
    let colComplete = false;
    let rowComplete = false;
    let i =0;
    let j =0;
    
    //check col
    while(j<=columns){
        if(j==columns){
            colComplete = true;
        }else{
            if((ansPositions[row][j] != ansSelected[row][j]) ||
               (ansPositions[row][j] ==  ansErased[row][j])){
                break;
            }
        }
        j++;
    }

    //check row
    while(i<=rows){
        if(i==rows){
            rowComplete = true;
        }else{
            
            if((ansPositions[i][col] != ansSelected[i][col]) ||
               (ansPositions[i][col] ==  ansErased[i][col])){
                break;
            }
        }
        i++;
    }

    if(colComplete){
        const selector = `.boardBox[data-row='${row}'][data-col='${-1}']`;
        const boardbox = document.querySelector(selector);
        boardbox.classList.add("emptyCorner");
    }

    if(rowComplete){
        const selector = `.boardBox[data-row='${-1}'][data-col='${col}']`;
        const boardbox = document.querySelector(selector);
        boardbox.classList.add("emptyCorner");
    }
}


async function loadBoard() {

    for(let j=0; j<rows+1; j++){
        const row = document.createElement("div"); // create a row container
        row.classList.add("boardRow");

        for(let i=0; i<columns+1; i++){

            const boardbox = document.createElement("button");
            boardbox.classList.add("boardBox");

            if(j==0 && i==0){
                boardbox.classList.add("emptyCorner") 

            }

            if(j==0 || i==0){
               boardbox.classList.add("answerSlot") 
              boardbox.dataset.row = j-1; // store row index
              boardbox.dataset.col = i-1;

               if(j==0){
                boardbox.classList.add("topRow")
                boardbox.textContent = `${ansColumn[i-1]}`;
               }else{
                boardbox.classList.add("leftColumn")
                boardbox.textContent = `${ansRow[j-1]}`;
               }
               

               row.appendChild(boardbox);
               continue;
            }
                
            boardbox.textContent = `${board[j-1][i-1]}`;
            boardbox.dataset.row = j - 1; // store row index
            boardbox.dataset.col = i - 1;
            row.appendChild(boardbox);

            
            

            boardbox.addEventListener("click", () => {
                let wrong = checkIfCorrect(j-1,i-1, boardbox);

                if(pencilBtn.classList.contains("active")){
                    if(wrong){
                        eraseAns(boardbox, j-1, i-1);
                    }

                    drawAns(boardbox, j-1, i-1);
                    

                }

                if(eraserBtn.classList.contains("active")){
                    if(wrong){
                        drawAns(boardbox, j-1, i-1);
                    }
                    eraseAns(boardbox, j-1, i-1);
                }

                checkIfLineComplete(j-1, i-1);
                checkIfWin();
                checkIfLose();   
                
            });
        }
        
        boardContainer.appendChild(row);
        
    }
    setGameState();
    loadPreviousAns();

}





