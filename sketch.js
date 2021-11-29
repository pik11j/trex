var PLAY = 3;
var END = 10;
var gameState = PLAY;


var perdiste, loser, flecha, flecha_verde;
var trex, trex_running,trex_ojito2;
var suelo, suelo_real;
var suelo_falso;
var nubep;
var captus1,captus2,captus3,captus4,captus5,captus6;
var nubegroup,captusgroup;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_ojito2 = loadAnimation("trex_collided.png");
  suelo_real = loadImage("ground2.png");
  captus1 = loadImage("obstacle1.png");
  captus2 = loadImage("obstacle2.png");
  captus3 = loadImage("obstacle3.png");
  captus4 = loadImage("obstacle4.png");
  captus5 = loadImage("obstacle5.png");
  captus6 = loadImage("obstacle6.png");
  nubep = loadImage("cloud.png");

  
  flecha_verde = loadImage("restart.png");
  loser = loadImage("gameOver.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3") 
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-380);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.5;     
  trex.addAnimation("trex_ojitos_bonitos",trex_ojito2);
  
  suelo = createSprite(200,380,400,20);
  suelo.addImage("suelo",suelo_real);
  suelo.x = suelo.width/2;
  
  suelo_falso = createSprite(width/2,height-10,width,125); 
  suelo_falso.visible = false;
  
  perdiste = createSprite(300,200);
  perdiste.addImage("hola",loser);
 
  flecha = createSprite(270,300);
  flecha.addImage("hlo",flecha_verde);
  
  captusgroup = createGroup();
  nubegroup = createGroup();
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  score = 0;  
}
function draw(){
  background(180)
  
  text("putuasion:" + score,500,50);
  
  if(gameState === PLAY){
    suelo.velocityX = -2;
    
    if(suelo.x<0){
      suelo.x = suelo.width/2; 
    }
    
    suelo.velocityX = -(4 + 3* score/100);
    
    score = score + Math.round(getFrameRate()/60);
  
  if(score>0 && score%100 ===0){
    checkPointSound.play();
  }
  
  if(touches.length > 0 || keyDown("space") && trex.y > 349){
    trex.velocityY = -10;
    jumpSound.play();
    touches = [];
  }

  trex.velocityY = trex.velocityY +   0.6; 
    
  nubes();
  
  famili_captus();
  
  if(captusgroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  }
   
  perdiste.visible = false;
  flecha.visible = false;
    
  }
  
  else if (gameState === END){
    suelo.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("trex_ojitos_bonitos",trex_ojito2);
    
    captusgroup.setVelocityXEach(0);
    nubegroup.setVelocityXEach(0);
    captusgroup.setLifetimeEach(-1)
    nubegroup.setLifetimeEach(-1)
    
    perdiste.visible = true;
    flecha.visible = true;
    
    if(mousePressedOver(flecha)){
      ciclo();
    }
    
  }
  trex.collide(suelo_falso);

  drawSprites();
}

function ciclo(){
  gameState = PLAY
  perdiste.visible = false;
  flecha.visible = false;
  captusgroup.destroyEach();
  nubegroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
  score = 0;
}

function famili_captus(){
  if(frameCount % 150 === 0){
    var captus = createSprite(600,370,10,20);
    captus.velocityX = -2;
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: captus.addImage(captus1);
                break;
      case 2: captus.addImage(captus2); 
                break;
      case 3: captus.addImage(captus3);
              break;
      case 4: captus.addImage(captus4);
              break;
      case 5: captus.addImage(captus5);
              break;
      case 6: captus.addImage(captus6);
              break;
      default: break;
    }
    captus.scale = 0.5;
    captus.lifetime = 400;
    
    captus.velocityX = -(4 + 3* score/100);
    captusgroup.add(captus);
   }
}

function nubes(){
  
  if(frameCount % 60 === 0){
    var nube = createSprite(600,300); 
    nube.addImage(nubep);
    nube.y = Math.round(random(280,320));
    nube.velocityX = -3;
    nube.scale = 0.5;
    
    nube.lifetime = 600;
    
    nube.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    nubegroup.add(nube);
  }
}

