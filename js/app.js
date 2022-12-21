import { imgData, jellyFishData, musicData } from "../data/data.js";

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
    tailStr: "",
    tailIdx: [],
}

const moveDirections = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
/*---------------------------- Variables (state) ----------------------------*/
let gameRunning, pause = false, lost = false, newMoveIdx, moveIdx = 0, snakeMoved = false, sqrIdx, oldHeadSqrIdx, jellyFishIdx;
let headPosition1 = 11, headPosition2 = 11, newHeadPosition1, newHeadPosition2, lastTailPosition1, lastTailPosition2, lastTailIdx;
let movePosition1, movePosition2, eatFruit = false, dropFruit = true, jellyTailIdx = 0, jellyDisplayIdx, obstacleNo = 0;

/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector("#message");
const boardEl = document.querySelector(".board");
const startEl = document.querySelector("#start-bt");
const pauseEl = document.querySelector("#pause-bt");
const resetEl = document.querySelector("#reset");
const scoreEl = document.querySelector("#score");
const gamePlaySoundEl = new Audio();
const specialEventSoundEl = new Audio();

gamePlaySoundEl.setAttribute("src", "./audio/touch.mp3");
/*----------------------------- Event Listeners -----------------------------*/
boardEl.addEventListener('mouseover', changeDirection);
startEl.addEventListener('click', game);
pauseEl.addEventListener('click', pauseF);
resetEl.addEventListener('click', reset);

/*-------------------------------- Functions --------------------------------*/
function pauseF () {
    if(!lost){
        pause = ! pause;
        if(pause) {
            clearInterval(gameRunning);
            pauseEl.innerHTML = "Continue";
            gamePlaySoundEl.setAttribute("src", musicData[randomIdx(musicData)]);
            gamePlaySoundEl.play();
        }
        else {
            gameRunning = setInterval(gamePlay, 400);
        }
    }
}

function reset() {
    clearInterval(gameRunning);
    messageEl.innerHTML = "";
    gamePlaySoundEl.setAttribute("src", "./audio/touch.mp3")
    setUpWalls();
    snake.tailLength = 0;
    snake.tailStr = "";
    snake.tailIdx = [];
    lost = false, headPosition1 = 11, headPosition2 = 11, dropFruit = true , eatFruit = false;
    scoreEl.innerHTML = `Score:  0`;
    gameRunning = setInterval(gamePlay, 400);
}

function game() {
    gameStart();
    gameRunning = setInterval(gamePlay, 400);
}

function gameStart() {
    messageEl.innerHTML = "";
    pauseEl.style.display = "";
    scoreEl.style.display = "";
    resetEl.style.display = "";
    boardEl.style.display = "grid";
    startEl.style.display = "none";
    setUpWalls();
}

function setUpWalls () {
    let wallSqrIdx;
    board.forEach((x, idx1) => {
        x.forEach((y, idx2) => {
            wallSqrIdx = board.length*idx1 + idx2;
            if(idx1 === 0 || idx1 === board.length -1 || idx2 === 0 || idx2 === x.length-1){
                board[idx1][idx2] = 1;
                document.getElementById(`sqr${wallSqrIdx}`).innerHTML = 
                `<img src="./data/image/patrick's-house.png" alt="" style="height: 4vmin;">`;
            }
            else {
                board[idx1][idx2] = 0;
                document.getElementById(`sqr${wallSqrIdx}`).innerHTML = "";
            }
        })
    })
}

function gamePlay() {
   if(!lost) {
        pauseEl.innerHTML = "Pause";
        gamePlaySoundEl.setAttribute("src", "./audio/touch.mp3");
        snakeMove();
        render();
    }
}

//return a random index from a obj or arr.
function randomIdx(obj) {
    return Math.floor(Math.random()*obj.length);
}

function snakeMove() { 
    oldHeadSqrIdx = board.length*(headPosition1) + headPosition2;
    newHeadPosition1 = moveDirections[moveIdx][0] + headPosition1;
    newHeadPosition2 = moveDirections[moveIdx][1] + headPosition2;
    sqrIdx = board.length*(newHeadPosition1) + newHeadPosition2;
    
    if(!pause && board[newHeadPosition1][newHeadPosition2] === -1) {
        eatFruit = true;
        snake.tailLength++;
        snake.tailIdx.push(jellyFishIdx);
        scoreEl.innerHTML = `Score: ${snake.tailLength}`;
        
    }
    if(snake.tailLength){
        snake.tailStr =`a${headPosition1}b${headPosition2}` + snake.tailStr;
        
        let tailStr = snake.tailStr; //make a copy.
        //get the positions from the string.
        for(let i = tailStr.length -1; i >= 0; i--){
            if(tailStr[i] === 'b') {
                lastTailPosition2 = +(tailStr.slice(i).replace('b',''));
                tailStr = tailStr.slice(0, i);
                if(!eatFruit)
                snake.tailStr = snake.tailStr.slice(0, i);
            }
            else if (tailStr[i] === 'a'){
                lastTailPosition1 = +(tailStr.slice(i).replace("a",''));
                //we don't need to update the tailStr(since we done with it) here.
                if(!eatFruit)
                snake.tailStr = snake.tailStr.slice(0, i);
                break;
            }
        }
        lastTailIdx = board.length*lastTailPosition1 + lastTailPosition2;
    }
    
}

// const moveDirections = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
function changeDirection(e) {
    
    if(!pause){
        let directionId = +e.target.id.replace('sqr', '');
        if(directionId && snakeMoved){ 
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
            if(!(moveDirections[moveIdx][0] + moveDirections[newMoveIdx][0] === 0
                && moveDirections[moveIdx][1] + moveDirections[newMoveIdx][1] === 0)){
                    moveIdx = newMoveIdx;
                }
            }
            snakeMoved = false;
    }
}

function render() {
    if(!pause && board[newHeadPosition1][newHeadPosition2] > 0){
        lost = true;
        messageEl.innerHTML = `You lose! Your score is ${snake.tailLength}.`;
        gamePlaySoundEl.setAttribute("src", "./audio/endingSong.mp3");
        gamePlaySoundEl.play();
        clearInterval(gameRunning);
    }
    
    if(!lost){
        if(dropFruit) dropAFruit();
        if(snake.tailLength && snake.tailLength % 10 === 3){
            dropObstacle(1);
        }
        else {
            if(obstacleNo)
                cleanUpObstacle();
        }
        
        jellyDisplayIdx = snake.tailIdx[(jellyTailIdx++ % snake.tailLength)];
        if(eatFruit){
            document.getElementById(`sqr${sqrIdx}`).innerHTML = `<img src="./data/image/spongebobJump.png" alt="">`;
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = jellyFishData[jellyDisplayIdx];
            board[headPosition1][headPosition2] = 1;
            
            gamePlaySoundEl.setAttribute("src", "./audio/touch.mp3");
            gamePlaySoundEl.play();
            eatFruit = false;
            dropFruit = true;
        }
        else if(snake.tailLength) {
            document.getElementById(`sqr${sqrIdx}`).innerHTML = imgData[moveIdx];
                // `<img src="./data/spongebobRuningLeft.png" alt="" style="height: 4vmin;">`
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = jellyFishData[jellyDisplayIdx];
            board[headPosition1][headPosition2] = 1;
            document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
            board[lastTailPosition1][lastTailPosition2] = 0;
        }
        else{
            document.getElementById(`sqr${sqrIdx}`).innerHTML = imgData[moveIdx];
                // `<img src="./data/spongebobRuningLeft.png" alt="" style="height: 4vmin;">`
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "";
            board[headPosition1][headPosition2] = 0;
        }

        headPosition1 = newHeadPosition1, headPosition2 = newHeadPosition2;
        snakeMoved = true;
    }
}

function dropAFruit () {
    dropFruit = false;
    let fruitPosition1, fruitPosition2, fruitSqrIdx;
    while(!dropFruit){
        fruitPosition1 = randomIdx(board);
        fruitPosition2 = randomIdx(board[0]);
        if(board[fruitPosition1][fruitPosition2] === 0)
            dropFruit = true;
    }
    board[fruitPosition1][fruitPosition2] = -1;
    fruitSqrIdx = board.length*fruitPosition1 + fruitPosition2;
    jellyFishIdx = randomIdx(jellyFishData);
    document.getElementById(`sqr${fruitSqrIdx}`).innerHTML = jellyFishData[jellyFishIdx];
    dropFruit = false;
}

//when cleanUpObstacle, there would be n obstacles stay on the board.
function dropObstacle(n) {
    let objectPosition1, objectPosition2, objectSqrIdx;
    while(1){
        objectPosition1 = randomIdx(board);
        objectPosition2 = randomIdx(board[0]);
        if(board[objectPosition1][objectPosition2] !== 1 && board[objectPosition1][objectPosition2] !== -1)
            break;
    }
    board[objectPosition1][objectPosition2] = obstacleNo++ >= n ? 2 : 3;
    if(obstacleNo === 2) {
        console.log("changeMusic");
        specialEventSoundEl.setAttribute("src", "./audio/dramaticImpact.mp3");
        specialEventSoundEl.play();
    }
    objectSqrIdx = board.length*objectPosition1 + objectPosition2;
    document.getElementById(`sqr${objectSqrIdx}`).innerHTML = 
    `<img src="./data/image/mrCrabs.png" alt="" style="height: 4vmin;">`
}

function cleanUpObstacle() {
    obstacleNo = 0;
    let cleanIdx;

    specialEventSoundEl.setAttribute("src", "./audio/ohTryAgain.mp3");
    specialEventSoundEl.play();
    console.dir(gamePlaySoundEl);

    board.forEach((x, idx1) => {
        x.forEach((y, idx2) => {
            if(board[idx1][idx2] === 2){
                board[idx1][idx2] = 0;
                cleanIdx = idx1*board.length + idx2;
                document.getElementById(`sqr${cleanIdx}`).innerHTML = ``;
            }
        })
    })
}