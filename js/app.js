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
}

const moveDirections = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
/*---------------------------- Variables (state) ----------------------------*/
let start = false, pause = false, win = false, lost = false, newMoveIdx, moveIdx = 0, sqrIdx, oldHeadSqrIdx;
let headPosition1 = 11, headPosition2 = 11, newHeadPosition1, newHeadPosition2, lastTailPosition1, lastTailPosition2, lastTailIdx;
let movePosition1, movePosition2, eatFruit = false;

/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector("#message");
const boardEl = document.querySelector(".board");

/*----------------------------- Event Listeners -----------------------------*/
boardEl.addEventListener('click', changeDirection);
document.querySelector('#start-bt').addEventListener('click', game);
document.querySelector('#pause-bt').addEventListener('click', () => pause = true);
document.querySelector('#eat-bt').addEventListener('click', () => eatFruit = true);


/*-------------------------------- Functions --------------------------------*/
function changeDirection(e) {
    if(!pause){
        let directionId = +e.target.id.replace('sqr', '');
        movePosition1 = Math.floor(directionId/board.length);
        movePosition2 = directionId%board.length;
        if(movePosition1 === headPosition1){
            if(movePosition2 === headPosition2) ;//moving direction not change
            else if(movePosition2 > headPosition2) newMoveIdx = 0;
            else if(movePosition2 < headPosition2) newMoveIdx = 1;
        }
        else if(movePosition1 > headPosition1){
            if(movePosition2 === headPosition2) newMoveIdx = 2;
            else if(movePosition2 > headPosition2) newMoveIdx = 3;
            else if(movePosition2 < headPosition2) newMoveIdx = 4;
        }
        else if(movePosition1 < headPosition1){
            if(movePosition2 === headPosition2) newMoveIdx = 5;
            else if(movePosition2 > headPosition2) newMoveIdx = 6;
            else if(movePosition2 < headPosition2) newMoveIdx = 7;
        }
        
        //snake should not be able to go reverse direction
        if(!( moveDirections[moveIdx][0] === -moveDirections[newMoveIdx][0] &&
             moveDirections[moveIdx][1] === -moveDirections[newMoveIdx][1])){
            moveIdx = newMoveIdx;
        }
    }
}

function game() {
    messageEl.innerHTML = "";
    boardEl.style.display = "grid";
    let running = setInterval(gamePlay, 400);
    
}

function gamePlay() {
    if(!pause){
    snakeMove();
    render();
    }
    if(win || lost)
        clearInterval(running);
}

function snakeMove() { 
    oldHeadSqrIdx = 22*(headPosition1) + headPosition2;
    if(eatFruit)
        snake.tailLength++;

    if(snake.tailLength){
        snake.tailNo =`a${headPosition1}b${headPosition2}` + snake.tailNo;

        let tailStr = snake.tailNo; //make a copy.
        //get the positions from the string.
        for(let i = tailStr.length -1; i >= 0; i--){
            if(tailStr[i] === 'b') {
                lastTailPosition2 = +(tailStr.slice(i).replace('b',''));
                tailStr = tailStr.slice(0, i);
                if(!eatFruit)
                    snake.tailNo = snake.tailNo.slice(0, i);
            }
            else if (tailStr[i] === 'a'){
                lastTailPosition1 = +(tailStr.slice(i).replace("a",''));
                //we don't need to update the tailStr(since we done with it) here.
                if(!eatFruit)
                    snake.tailNo = snake.tailNo.slice(0, i);
                break;
            }
        }
        lastTailIdx = 22*lastTailPosition1 + lastTailPosition2;
    }
    
    newHeadPosition1 = moveDirections[moveIdx][0] + headPosition1;
    newHeadPosition2 = moveDirections[moveIdx][1] + headPosition2;
    sqrIdx = 22*(newHeadPosition1) + newHeadPosition2;
}

function render() {
    if(!pause && board[newHeadPosition1][newHeadPosition2] === 1){
        lost = true;
        messageEl.innerHTML = "You loose!"
    }
    
    if(!lost){
        if(eatFruit){
            document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
            board[headPosition1][headPosition2] = 1;

            eatFruit = false;
        }
        else if(snake.tailLength) {
            document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "🍟";
            board[headPosition1][headPosition2] = 1;
            document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
            board[lastTailPosition1][lastTailPosition2] = 0;
        }
        else{
            document.getElementById(`sqr${sqrIdx}`).innerHTML = "🍔";
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "";
            board[headPosition1][headPosition2] = 0;
        }
    }
    headPosition1 = newHeadPosition1, headPosition2 = newHeadPosition2;
}

// game();