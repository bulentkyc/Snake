const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');

// create the unit
const box = 32;

let countDown = 10;

const foodImg = new Image();
foodImg.src = './img/food.png';

// load audio files
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = './audio/dead.mp3';
eat.src = './audio/eat.mp3';
up.src = './audio/up.mp3';
left.src = './audio/left.mp3';
right.src = './audio/right.mp3';
down.src = './audio/down.mp3';


// create the snake
let snake = [];
snake[0] = {
    x :  9 * box,
    y : 10 * box
}

// create food
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score
let score = 0;

// control the snake
let d;

document.addEventListener("keydown",direction);

function direction(event){
    if (event.keyCode == 37 && d != 'RIGHT'){
        d = 'LEFT';
        left.play();
    } else if (event.keyCode == 38 && d != 'DOWN'){
        d = 'UP';
        up.play();
    } else if (event.keyCode == 39 && d != 'LEFT'){
        d = 'RIGHT';
        right.play();
    } else if (event.keyCode == 40 && d != 'UP'){
        d = 'DOWN';
        down.play();
    }
    draw();
}

// draw everything to canvas
function draw() {
    // Draw ground to the canvas
    //context.drawImage(groundImg,0,0);

    for(let x = 0; x< 19; x++){
        for(let y = 0; y< 19; y++){
            if(y<2) {
                context.fillStyle = '#873600';
                context.fillRect(x*box, y*box,box,box);
            }else if(y<3){
                context.fillStyle = '#6E2C00';
                context.fillRect(x*box, y*box,box,box);
            }else if(x==0){
                context.fillStyle = '#6E2C00';
                context.fillRect(x*box, y*box,box,box);
            }else if(x==18){
                context.fillStyle = '#6E2C00';
                context.fillRect(x*box, y*box,box,box);
            }else if(y==18){
                context.fillStyle = '#6E2C00';
                context.fillRect(x*box, y*box,box,box);
            }else{
                context.fillStyle = ((x % 2 != 0 && y % 2 == 0) ||
                (x % 2 == 0 && y % 2 != 0))? '#E59866' : '#F0B27A';
                context.fillRect(x*box, y*box,box,box);
            }
        }
    }

    showCount();

    //fraw food for score
    context.drawImage(foodImg, box, 0.6*box);

    // Draw snake
    for(let i = 0; i< snake.length; i++){
        context.fillStyle = (i==0)? '#6E2C00' : '#873600';
        const half =box/2;
        context.beginPath();
        context.arc(snake[i].x+half, snake[i].y+half,half,0,2 * Math.PI);
        context.fill();
        context.closePath();
        
        
    }

    // Draw food randomly
    context.drawImage(foodImg, food.x, food.y);

    // Style score
    context.fillStyle = 'white';
    context.font = '45px Changa one'
    context.fillText(score, 2*box,1.6*box);

    

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    // direction
    if(d == 'LEFT') snakeX -= box;
    if(d == 'UP') snakeY -= box;
    if(d == 'RIGHT') snakeX += box;
    if(d == 'DOWN') snakeY += box;

    // Draw new head
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    snake.unshift(newHead);

    // If the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score+=10;
        speedUp();
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        
    } else {
        // remove the tail
        snake.pop();
    }

    // check to beat itself
    function collision(head, array) {
        for(let i = 1; i<array.length; i++){
            if(head.x == array[i].x && head.y == array[i].y){
                console.log(head, 'aa', array);
                return true;
            }
            
        }
        return false;
    }

    // game over
    if( snakeX < box || 
        snakeX > 17*box || 
        snakeY < 3*box || 
        snakeY > 17*box ||
        collision(newHead, snake)){
            clearInterval(game);
            dead.play();
    }

}

let refreshTime = 500;
// call draw function every 100 ms
let game = setInterval(draw,refreshTime);


speedUp = () => {
    clearInterval(game);
    setInterval(draw,refreshTime-score);
}
let counter = () => {
    countDown-=1;
    if (countDown ==0) {
        clearInterval(count);
    }

}

let showCount = () => {
    // Style countDown
    context.fillStyle = 'white';
    context.font = '45px Changa one'
    context.fillText(countDown, 17*box,1.6*box);
}
let count = setInterval(counter, 1000);


