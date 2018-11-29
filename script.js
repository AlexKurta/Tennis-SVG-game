'use strict';
var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
svg.setAttribute('width', 700);
svg.setAttribute('height', 500);
document.body.appendChild(svg);

var startButton = document.createElementNS("http://www.w3.org/2000/svg",'rect'),
    buttonText = document.createElementNS("http://www.w3.org/2000/svg",'text'),
    button = document.createElementNS("http://www.w3.org/2000/svg",'rect'),
    field = document.createElementNS("http://www.w3.org/2000/svg",'rect'),
    leftRacket = document.createElementNS("http://www.w3.org/2000/svg",'rect'),
    rightRacket = document.createElementNS("http://www.w3.org/2000/svg",'rect'),
    ball = document.createElementNS("http://www.w3.org/2000/svg",'circle'),
    score = document.createElementNS("http://www.w3.org/2000/svg",'text');

startButton.setAttribute('width', 120);
startButton.setAttribute('height', 30);
startButton.setAttribute('x', 10);
startButton.setAttribute('y', 10);
startButton.setAttribute('fill', '#d9d9d3');

button.setAttribute('width', 120);
button.setAttribute('height', 30);
button.setAttribute('x', 10);
button.setAttribute('y', 10);
button.setAttribute('opacity', 0);

buttonText.textContent = 'старт!';
buttonText.setAttribute('font-size', 30);
buttonText.setAttribute('x', 30);
buttonText.setAttribute('y', 32);

field.setAttribute('width', 600);
field.setAttribute('height', 300);
field.setAttribute('x', 10);
field.setAttribute('y', 50);
field.setAttribute('fill', '#f0ee7e');
field.setAttribute('stroke', '#84837d');

leftRacket.setAttribute('width', 10);
leftRacket.setAttribute('height', 90);
leftRacket.setAttribute('fill', '#09aa57');
leftRacket.setAttribute('x', 10);
leftRacket.setAttribute('y', 50);

rightRacket.setAttribute('width', 10);
rightRacket.setAttribute('height', 90);
rightRacket.setAttribute('fill', '#191497');
rightRacket.setAttribute('x', 600);
rightRacket.setAttribute('y', 50);

score.setAttribute('font-size', 40);
score.setAttribute('text-anchor', 'middle');
score.setAttribute('x', 300);
score.setAttribute('y', 40);

ball.setAttribute('cx', 0);
ball.setAttribute('cy', 0);
ball.setAttribute('r', 15);            
ball.setAttribute('fill', '#f02137'); 
           
svg.appendChild(startButton);
svg.appendChild(buttonText);
svg.appendChild(button);
svg.appendChild(field);
svg.appendChild(leftRacket);
svg.appendChild(rightRacket);
svg.appendChild(ball);
svg.appendChild(score);

var fieldCoord = field.getBoundingClientRect(),
    coef = 1,
    keys = [],
    scoreLeft = 0,
    scoreRight = 0,    
    ballData  = {
      posX : fieldCoord.right - fieldCoord.width/2,
      posY : fieldCoord.bottom - fieldCoord.height/2,                    
      width : 30,
      height : 30,
      update : function() {
        ball.setAttribute('transform', `translate(${this.posX} ${this.posY})`);                      
			}
    },
    leftRacketData = {                    
      top : fieldCoord.height/2 - 45,                  
      update : function() {
        leftRacket.setAttribute('transform', `translate(0 ${this.top})`);                        
      }
    },
    rightRacketData = {
      top : fieldCoord.height/2 - 45,                   
      update : function() {
        rightRacket.setAttribute('transform', `translate(0 ${this.top})`);                        
      }
    };

function newBall() {
  ballData.posX = fieldCoord.right - fieldCoord.width/2;
  ballData.posY = fieldCoord.bottom - fieldCoord.height/2;
  ballData.speedX = ((Math.random()*3) + 1) * coef;
  ballData.speedY = ((Math.random()*3) + 1) * coef;                                
  ballData.update();          
}

ballData.update();
leftRacketData.update();
rightRacketData.update();      
            
button.addEventListener('click', start);

function start() {    
  newBall();                
  go();                
}

function go() {                
  var timer = requestAnimationFrame(go);
  let leftRacketCoord = leftRacket.getBoundingClientRect(),
      rightRacketCoord = rightRacket.getBoundingClientRect();
	ballData.posX += ballData.speedX; 
  //правая сторона       
  if (ballData.posX > rightRacketCoord.left - 15) {
    if (ballData.posY > rightRacketCoord.top && 
     		ballData.posY < rightRacketCoord.bottom) {
      ballData.speedX = -ballData.speedX;
      ballData.posX = rightRacketCoord.left - 15;
    } else {                        
      ballData.posX = fieldCoord.right - 15;
      scoreLeft++; 
      score.textContent = `${scoreLeft} : ${scoreRight}`;                    
    	cancelAnimationFrame(timer);                       
    }
  }     
	//левая сторона   
  if (ballData.posX < leftRacketCoord.right + 15) { 
    if (ballData.posY > leftRacketCoord.top && 
        ballData.posY < leftRacketCoord.bottom) {                        
      ballData.speedX = -ballData.speedX;
    	ballData.posX = leftRacketCoord.right + 15;
    } else {                        
    	ballData.posX = fieldCoord.x + 15;
      scoreRight++; 
      score.textContent = `${scoreLeft} : ${scoreRight}`;                      
      cancelAnimationFrame(timer);                                            
    }
  }  
  ballData.posY += ballData.speedY; 
    //нижняя граница          
  if (ballData.posY > fieldCoord.bottom - 15) {
    ballData.speedY = -ballData.speedY;
    ballData.posY = fieldCoord.bottom - 15;
  }    
	//верхняя граница            
  if (ballData.posY < fieldCoord.top + 15) {
    ballData.speedY = -ballData.speedY;
    ballData.posY = fieldCoord.top + 15;
  }
  ballData.update();
  coef *= -1;                              
}

window.addEventListener('keydown', moveStart);
window.addEventListener('keyup', moveEnd);
var movement = 0,
    events = {};

function moveStart(e) {
  events[e.keyCode] = true;
  movement = setInterval(moveRacket,0);
}

function moveEnd(e) {
  if ( movement ) {
    clearInterval(movement);
    movement = 0;    
  }        
  events[e.keyCode] = false;
}

function moveRacket() {
  if (events[16]){
    moveUp(leftRacketData);
  }
  if (events[38]) {
    moveUp(rightRacketData); 
  }
  if (events[17]) {
    moveDown(leftRacketData); 
  }
  if (events[40]) {
    moveDown(rightRacketData); 
  }
}

function moveUp(a) {        
  if (a.top <= 0) {
    a.top = a.top
  } else {
    a.top = a.top - .03;
  }
  a.update();
}
    
function moveDown(a) {        
  if (a.top >= fieldCoord.height - 90) {
    a.top = fieldCoord.height - 90;
  } else {
    a.top = a.top + .03;
  }
  a.update();
}
