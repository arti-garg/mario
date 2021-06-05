var mario, marioanim, jumpSound, invground, obGroup, brGroup, die, obstacle, chkpntSnd
var bgimage, bg, obstacleAnim, mariox, brimage, mvggroundImg, mvgGround
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY
var gameOverImg, restartImg, gmovr, rstrt;

function preload() {
  marioanim = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mariox = loadAnimation("collided.png");

  bgimage = loadImage("bg.png");
  mvggroundImg = loadImage("ground2.png");


  brimage = loadImage("brick.png");

  obstacleAnim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  chkpntSnd = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 400);

  // adding background
  bg = createSprite(300, 200, 10, 10);


  // adding mario
  mario = createSprite(50, 300, 10, 10);
  mario.addAnimation(" mar", marioanim);
  mario.addAnimation("marx", mariox);
  mario.scale = 1.5;

  gmovr = createSprite(280, 170, 10, 10);
  gmovr.addImage("g1", gameOverImg);
  gmovr.scale = 0.6;

  rstrt = createSprite(280, 200, 10, 10);
  rstrt.addImage("r1", restartImg);
  rstrt.scale = 0.6;

  //invisible ground
  invground = createSprite(300, 380, 600, 10);
  invground.addImage(mvggroundImg);
  invground.scale = 1.2;


  obGroup = new Group();
  brGroup = new Group();
}

function draw() {


  bg.addImage(bgimage);

  if (invground.x < 300) {
    invground.x = 600;
  }

  if (score > 0 && score % 10 === 0) {
    chkpntSnd.play();
  }


  if (gameState === PLAY) {
    gmovr.visible = false;
    rstrt.visible = false;
    invground.velocityX = -5;
    mario.changeAnimation(" mar", marioanim);
    // making mario jump
    if (keyDown("space") && mario.y > 150) {
      mario.velocityY = -10;
      jumpSound.play();

    }

    //adding gravity
    mario.velocityY = mario.velocityY + 1.0;

    mario.setCollider("rectangle", 3, 1);
    mario.debug = true;

    spawnObstacles();
    spawnBricks();

    // making bricks disappear
    for (var i = 0; i < brGroup.length; i++) {
      if (brGroup.get(i).isTouching(mario)) {
        brGroup.get(i).destroy();
        score = score + 1;

      }

    }


    if (mario.isTouching(obGroup)) {
      endgame();
    }
  }

  if (mousePressedOver(rstrt) && gameState === END) {
    restartGame();
    console.log("hi")
  }


  mario.collide(invground);
  drawSprites();

  textSize(25);
  stroke(20);
  fill("black");
  text("Score : " + score, 400, 100)
}

function spawnObstacles() {

  if (frameCount % 90 == 0) {
    obstacle = createSprite(600, 310, 10, 10);
    obstacle.addAnimation(" obstacles", obstacleAnim)
    obstacle.velocityX = -5;
    obstacle.lifetime = 200;
    obGroup.add(obstacle);
  }

}

function spawnBricks() {

  if (frameCount % 60 == 0) {
    var brick = createSprite(600, 150, 10, 10);
    brick.y = Math.round(random(170, 130));
    brick.addImage(brimage);
    brick.velocityX = -5;
    brick.lifetime = 200;
    brGroup.add(brick);

  }

}

function endgame() {

  gameState = END;
  die.play();
  mario.velocityY = 12;
  obGroup.setVelocityXEach(0);
  obGroup.setLifetimeEach(-1);
  brGroup.setLifetimeEach(-1);
  brGroup.setVelocityXEach(0);
  mario.changeAnimation("marx", mariox);
  invground.velocityX = 0;
  gmovr.visible = true;
  rstrt.visible = true;
}

function restartGame() {
  gameState = PLAY;

  gmovr.visible = false;
  rstrt.visible = false;

  obGroup.destroyEach();
  brGroup.destroyEach();

  score = 0;
}