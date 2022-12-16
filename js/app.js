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
    headPosition: 240,
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

let i = 0;
function game() {
    while(!win){
        setTimeout(gamePlay, i*500);
        i++;
        if(win || lost)
            break;
    }
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
    if(eatFruit) {
        snake.tailNo =`#a${headPosition1}b${headPosition2}` + snake.tailNo;
        console.log("🚀 ~ file: app.js:98 ~ snakeMove ~ tailNo", snake.tailNo)
    }
    else {
        for(let i = snake.tailNo.length -1; i >= 0; i--){
            if(snake.tailNo[i] === 'b')
                lastTailPosition2 = +snake.tailNo.slice(i).replace('b','');
            else if (snake.tailNo[i] === "#"){
                console.log(snake.tailNo[i]);
                lastTailPosition1 = +snake.tailNo.slice(i).replace("#a",'');
                break;
            }
        }
        lastTailIdx = 22*lastTailPosition1 + lastTailPosition2;
        console.log("🚀 ~ file: app.js:108 ~ snakeMove ~ lastTailPosition2", lastTailPosition2)
        console.log("🚀 ~ file: app.js:108 ~ snakeMove ~ lastTailPosition1", lastTailPosition1)
        console.log("🚀 ~ file: app.js:108 ~ snakeMove ~ lastTailIdx", lastTailIdx)
    }
    headPosition1 += moveDirections[moveIndex][0];
    headPosition2 += moveDirections[moveIndex][1];
}

function render() {
    sqrIdx = 22*(headPosition1) + headPosition2;
    console.log("🚀 ~ file: app.js:69 ~ render ~ sqrIdx", sqrIdx)
    if(eatFruit){
        document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
        eatFruit = false;
    }
    else {
        document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
        document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
    }
    document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
}

game();