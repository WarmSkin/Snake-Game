/* 
Author: Pin Chen
Date: 12/22/2022
Discription: *Jellyfish Hunting* is a Snake-Game re-creation game. 
            Spongebob (snake head) move in eight directions, collects different types jellyfish he captures.
            
The code:   Use a two dimensional array as game board data.
            Use a mouseover event for direction guide.
            Use a string to store tails position.
            Update the head and tails position dynamiclly.
            Keep the function name as a snake-game for a easy understanding.
*/
import { imgData, jellyFishData, musicData, animationData } from "../data/data.js";

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
let gameRunning, pause = false, lost = false, snakeMoved = false, musicOn = true, newMoveIdx, moveIdx = 0,  sqrIdx, oldHeadSqrIdx, jellyFishIdx;
let headPosition1 = 11, headPosition2 = 11, newHeadPosition1, newHeadPosition2, lastTailPosition1, lastTailPosition2, lastTailIdx;
let movePosition1, movePosition2, eatFruit = false, dropFruit = true, jellyTailIdx = 0, jellyDisplayIdx, obstacleNo = 0;

/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector("#message");
const boardEl = document.querySelector(".board");
const startEl = document.querySelector("#start-bt");
const pauseEl = document.querySelector("#pause-bt");
const resetEl = document.querySelector("#reset");
const scoreEl = document.querySelector("#score");
const musicEl = document.querySelector("#music");
const bottomBtEl = document.querySelector(".bottom");
const gamePlaySoundEl = new Audio();
const specialEventSoundEl = new Audio();

gamePlaySoundEl.setAttribute("src", "./audio/touch.mp3");
/*----------------------------- Event Listeners -----------------------------*/
startEl.addEventListener('click', game);
pauseEl.addEventListener('click', pauseF);
resetEl.addEventListener('click', reset);
musicEl.addEventListener('click', musicControl);
boardEl.addEventListener('mouseover', changeDirection);
startEl.addEventListener('mouseover', (e) => animateCSS(`${e.target.id}`, "bounce"));
bottomBtEl.addEventListener('mouseover', (e)=> {if(e.target.className === 'but') e.target.style.backgroundColor = "rgb(255, 96, 170)";});
bottomBtEl.addEventListener('mouseout', (e)=> {if(e.target.className === 'but') e.target.style.backgroundColor = "rgb(251, 233, 49)";});


/*-------------------------------- Functions --------------------------------*/

//Prepare for the game
//##########################################################################
function game() {
    gameStart();
    gameRunning = setInterval(gamePlay, 400);
}

//hide elements and show elements
function gameStart() {
    messageEl.innerHTML = "";
    pauseEl.style.display = "";
    scoreEl.style.display = "";
    resetEl.style.display = "";
    musicEl.style.display = "";
    boardEl.style.display = "grid";
    startEl.style.display = "none";
    specialEventSoundEl.setAttribute("src", "./audio/gameStart.mp3")
    specialEventSoundEl.play();
    document.querySelector("ul").style.display = "none";
    document.querySelector("body").style.backgroundImage = `url("../data/image/gamePlayBackground.jpg")`;
    document.querySelector("body").style.backgroundSize = "cover";
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
                `<img src="./data/image/patrick's-house.png" id="sqr${wallSqrIdx}" alt="" style="height: 6vmin;">`;
            }
            else {
                board[idx1][idx2] = 0;
                document.getElementById(`sqr${wallSqrIdx}`).innerHTML = "";
            }
        })
    })
}

//Main game function
//##########################################################################
function gamePlay() {
   if(!lost) {
        pauseEl.innerHTML = "Pause";
        snakeMove();
        render();
    }
}

function snakeMove() { 
    oldHeadSqrIdx = board.length*(headPosition1) + headPosition2;
    newHeadPosition1 = moveDirections[moveIdx][0] + headPosition1;
    newHeadPosition2 = moveDirections[moveIdx][1] + headPosition2;
    sqrIdx = board.length*(newHeadPosition1) + newHeadPosition2;
    
    //if snake run into a fruit
    if(!pause && board[newHeadPosition1][newHeadPosition2] === -1) {
        eatFruit = true;
        snake.tailLength++;
        snake.tailIdx.push(jellyFishIdx);
        scoreEl.innerHTML = `Score: ${snake.tailLength}`; 
    }
    //when snake has tails, need to set up tails to follow snake
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

//snake move on eight directions base on the mouse position vs the snake head position
function changeDirection(e) {
    //a fun animation functionality when the game pause.
    if(pause && e.target.className !== "sqr")
        animateCSS(`${e.target.id}`, "bounce");

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
    //if snake runs into objects, game lose
    if(!pause && board[newHeadPosition1][newHeadPosition2] > 0){
        lost = true;
        messageEl.innerHTML = `You lose! Your score is ${snake.tailLength}.`;
        specialEventSoundEl.setAttribute("src", "./audio/endingSong.mp3");
        specialEventSoundEl.play();
        clearInterval(gameRunning);
        animateCSS("board", "hinge");
        setTimeout(()=>{
        boardEl.style.display = "none";}, 1900);
    }
    
    if(!lost){
        //drop fruit or obstacles
        if(dropFruit) dropAFruit();
        if(snake.tailLength && snake.tailLength % 10 === 3) dropObstacle(1);
        else if(obstacleNo) cleanUpObstacle();
        
        jellyDisplayIdx = snake.tailIdx[(jellyTailIdx++ % snake.tailLength)];
        if(eatFruit){
            document.getElementById(`sqr${sqrIdx}`).innerHTML = `<img src="./data/image/spongebobJump.png" alt="">`;
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = `${jellyFishData[jellyDisplayIdx]} id="sqr${oldHeadSqrIdx}">`;
            board[headPosition1][headPosition2] = 1;
            
            gamePlaySoundEl.play();
            eatFruit = false;
            dropFruit = true;
        }//without eating the fruit, update the tails and snake head position
        else if(snake.tailLength) {
            document.getElementById(`sqr${sqrIdx}`).innerHTML = `${imgData[moveIdx]} id="sqr${sqrIdx}">`;
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = `${jellyFishData[jellyDisplayIdx]} id="sqr${oldHeadSqrIdx}">`;
            board[headPosition1][headPosition2] = 1;
            document.getElementById(`sqr${lastTailIdx}`).innerHTML = "";
            board[lastTailPosition1][lastTailPosition2] = 0;
        } //when game starts with no tails
        else{
            document.getElementById(`sqr${sqrIdx}`).innerHTML = `${imgData[moveIdx]} id="sqr${sqrIdx}">`;
            board[newHeadPosition1][newHeadPosition2] = 1;
            document.getElementById(`sqr${oldHeadSqrIdx}`).innerHTML = "";
            board[headPosition1][headPosition2] = 0;
        }
        //after moved, the new head postion becomes current position
        headPosition1 = newHeadPosition1, headPosition2 = newHeadPosition2;
        snakeMoved = true;
    }
}

//Drop fruint or obstacles
//##########################################################################
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
    document.getElementById(`sqr${fruitSqrIdx}`).innerHTML = `${jellyFishData[jellyFishIdx]} id="sqr${fruitSqrIdx}">`;
    animateCSS(`sqr${fruitSqrIdx}`, animationData[randomIdx(animationData)]);
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
    //value 3 obstacle will stay on the board
    board[objectPosition1][objectPosition2] = obstacleNo++ >= n ? 2 : 3;
    //start the music when 2 obstacles have been dropped
    if(obstacleNo === 2) {
        console.log("changeMusic");
        specialEventSoundEl.setAttribute("src", "./audio/dramaticImpact.mp3");
        specialEventSoundEl.play();
    }
    objectSqrIdx = board.length*objectPosition1 + objectPosition2;
    document.getElementById(`sqr${objectSqrIdx}`).innerHTML = 
    `<img src="./data/image/mrCrabs.png" id="sqr${objectSqrIdx}" alt="" style="height: 7vmin;">`
    animateCSS(`sqr${objectSqrIdx}`, "bounce");
}

function cleanUpObstacle() {
    obstacleNo = 0;
    let cleanIdx;
    //play spongebob's sarcasm sound
    specialEventSoundEl.setAttribute("src", "./audio/ohTryAgain.mp3");
    specialEventSoundEl.play();

    //clear up all value 2 obstacles
    board.forEach((x, idx1) => {
        x.forEach((y, idx2) => {
            if(board[idx1][idx2] === 2){
                board[idx1][idx2] = 0;
                cleanIdx = idx1*board.length + idx2;
                document.getElementById(`sqr${cleanIdx}`).innerHTML = "";
            }
        })
    })
}

//Button functions and a random help function
//##########################################################################
function pauseF () {
    if(!lost){
        pause = ! pause;
        if(pause) {
            clearInterval(gameRunning);
            pauseEl.innerHTML = "Continue";
            specialEventSoundEl.setAttribute("src", musicData[randomIdx(musicData)]);
            specialEventSoundEl.play();
        }
        else {
            specialEventSoundEl.setAttribute("src", "");
            gameRunning = setInterval(gamePlay, 400);
        }
    }
}

function reset() {
    snake.tailLength = 0;
    snake.tailStr = "";
    snake.tailIdx = [];
    // reset variables
    lost = false, pause = false, headPosition1 = 11;
    headPosition2 = 11, dropFruit = true , eatFruit = false;
    // reset board elements
    messageEl.innerHTML = "";
    boardEl.style.display = "grid";
    boardEl.className = "board";
    scoreEl.innerHTML = `Score:  0`;
    setUpWalls();
    //reset sound effect
    specialEventSoundEl.setAttribute("src", "./audio/gameStart.mp3")
    specialEventSoundEl.play();
    //reset game interval
    clearInterval(gameRunning);
    gameRunning = setInterval(gamePlay, 400);
}

function musicControl() {
    musicOn = !musicOn;
    gamePlaySoundEl.volume = musicOn? 0.7 : 0;
    specialEventSoundEl.volume = musicOn? 0.7 : 0;
    musicEl.innerHTML = musicOn? "Sound: On" : "Sound:Off";
}

//return a random index from a obj or arr.
function randomIdx(obj) {
    return Math.floor(Math.random()*obj.length);
}

//ANIMATION
//####################################################################################
//copied from animate.style
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.getElementById(element);

    node.classList.add(`${prefix}animated`, animationName);
    //add sound effect, but not with obstacle drops
    if(element === "start-bt"){
        specialEventSoundEl.setAttribute("src", "./audio/imReady.mp3");
        specialEventSoundEl.play();
    }
    else if(animation === "bounce" && !obstacleNo) gamePlaySoundEl.play(); 

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });