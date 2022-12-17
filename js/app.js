/*-------------------------------- Constants --------------------------------*/
const board = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

const snake = {
    tailLength: 0,
    tailNo: [],
    lastTailPosition: 0,
}

const moveDirections = [[0,0],[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
/*---------------------------- Variables (state) ----------------------------*/
let start = false, pause = false, win = false, lost = false, moveIndex = 1, sqrIdx, oldHeadSqrIdx;
let headPosition1 = 11, headPosition2 = 11, lastTailPosition1, lastTailPosition2, lastTailIdx;
let movePosition1, movePosition2, eatFruit = false;

//div*484.sqr#spr0000>img
/*------------------------ Cached Element References ------------------------*/
const boardEl = document.querySelector(".board");


/*----------------------------- Event Listeners -----------------------------*/
boardEl.addEventListener('click', changeDirection);
document.querySelector('#start-bt').addEventListener('click', game);
document.querySelector('#pause-bt').addEventListener('click', () => pause = !pause);
document.querySelector('#eat-bt').addEventListener('click', () => eatFruit = true);


/*-------------------------------- Functions --------------------------------*/
function changeDirection(e) {
    if(!pause){
        let directionId = +e.target.id.replace('sqr', '');
        console.log("🚀 ~ file: app.js:49 ~ changeDirection ~ directionId", directionId)
        movePosition1 = Math.floor(directionId/board.length);
        console.log("🚀 ~ file: app.js:50 ~ changeDirection ~ movePosition1", movePosition1)
        movePosition2 = directionId%board.length;
        console.log("🚀 ~ file: app.js:52 ~ changeDirection ~ movePosition2", movePosition2)
        if(movePosition1 === headPosition1){
            if(movePosition2 === headPosition2) ;//moving direction not change
            else if(movePosition2 > headPosition2) moveIndex = 1;
            else if(movePosition2 < headPosition2) moveIndex = 2;
        }
        else if(movePosition1 > headPosition1){
            if(movePosition2 === headPosition2) moveIndex = 3;
            else if(movePosition2 > headPosition2) moveIndex = 4;
            else if(movePosition2 < headPosition2) moveIndex = 5;
        }
        else if(movePosition1 < headPosition1){
            if(movePosition2 === headPosition2) moveIndex = 6;
            else if(movePosition2 > headPosition2) moveIndex = 7;
            else if(movePosition2 < headPosition2) moveIndex = 8;
        }
    }
    // gamePlay();
}


function game() {
    let running = setInterval(gamePlay, 400);
    if(win || lost)
        clearInterval(running);
}

function gamePlay() {
    if(pause) moveIndex = 0;
    snakeMove();
    render();
}

function snakeMove() {
    // lastTailPosition1 = 
    // lastTailPosition2 = 
    oldHeadSqrIdx = 22*(headPosition1) + headPosition2;
    if(eatFruit)
        snake.tailLength++;

    if(snake.tailLength){
        snake.tailNo =`#a${headPosition1}b${headPosition2}` + snake.tailNo;
        console.log("🚀 ~ file: app.js:98 ~ snakeMove ~ tailNo", snake.tailNo)
        console.log("tailLegnth", snake.tailLength)
        let tailStr = snake.tailNo;
        for(let i = tailStr.length -1; i >= 0; i--){
            if(tailStr[i] === 'b') {
                lastTailPosition2 = +(tailStr.slice(i).replace('b',''));
                tailStr = tailStr.slice(0, i);
                if(!eatFruit)
                    snake.tailNo = snake.tailNo.slice(0, i);
            }
            else if (tailStr[i] === '#'){
                lastTailPosition1 = +(tailStr.slice(i).replace("#a",''));
                //we don't need to update the tailStr(since we done with it) here.
                if(!eatFruit)
                    snake.tailNo = snake.tailNo.slice(0, i);
                console.log("the tailNo", snake.tailNo);
                break;
            }
        }
        lastTailIdx = 22*lastTailPosition1 + lastTailPosition2;
    }
    else{
        lastTailIdx = oldHeadSqrIdx;
    }
    
    headPosition1 += moveDirections[moveIndex][0];
    headPosition2 += moveDirections[moveIndex][1];
    sqrIdx = 22*(headPosition1) + headPosition2;
}

function render() {
    if(eatFruit){
        document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
        document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
        eatFruit = false;
    }
    else if(snake.tailLength) {
        console.log("not eating fruit");
        document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
        document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
        document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
    }
    else{
        document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
        document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
    }
}

game();