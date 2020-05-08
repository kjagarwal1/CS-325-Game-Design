"use strict";

window.onload = function () {
  var game = new Phaser.Game(600, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

  function preload() {
    game.load.image('grass', 'assets/grass.jpg');
    game.load.image('goal', 'assets/goal.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('player1', 'assets/player1.png');
    game.load.image('player2', 'assets/player2.png');
    game.load.image('goalie', 'assets/gloves.png');
    game.load.image('box', 'assets/box.jpg');
    game.load.image('arrow', 'assets/arrow.png')
    game.load.audio('cheer', 'sounds/cheer.wav');
    game.load.audio('boo', 'sounds/boo.wav');
  }1

  var grass;
  var goal;
  var goalBox;
  var ball;
  var cheer;
  var boo;
  var hit = false;
  var scoreCount = 0;
  var highScore = 0;
  var defMoveRight = true;
  var gMoveRight = true;
  var text;
  var arrow;

  var wall1, wall2, wall3;
  var defender;
  var goalie;
  var pSize;
  var p1, p2;
  var wallX, defX, p1X, p2X;


  function create() {
    boo = game.add.audio('boo');
    boo.volume = 0.3;
    cheer = game.add.audio('cheer');
    cheer.volume = 0.3;

    grass = game.add.sprite(0, 650, 'grass');
    grass.scale.setTo(4, 3);
    grass = game.add.sprite(0, 0, 'grass');
    grass.scale.setTo(4, 3);

    goal = game.add.sprite(game.world.centerX, 100, 'goal');
    goal.anchor.setTo(0.5, 0.5);
    goal.scale.setTo(0.4, 0.2);
    game.physics.enable(goal, Phaser.Physics.REAL);
    goal.body.immovable = true;
    goal.body.setSize(150, 150, 40, 40);

    goalBox = game.add.sprite(225,75, 'box');
    goalBox.scale.setTo(.075,.0125);
    goalBox.sendToBack();


    pSize = 0.1;
    wallX = 200;
    wall1 = game.add.sprite(wallX, 175, 'player2');
    wall1.scale.setTo(0.1, 0.1);
    wall2 = game.add.sprite(wallX + 25, 175, 'player2');
    wall2.scale.setTo(0.1, 0.1);
    wall3 = game.add.sprite(wallX + 50, 175, 'player2');
    wall3.scale.setTo(0.1, 0.1);

    defX = 500;
    defender = game.add.sprite(defX, 500, 'player2');
    defender.scale.setTo(0.1, 0.1);

    goalie = game.add.sprite(200, 80, 'goalie');
    goalie.scale.setTo(0.1, 0.1);

    p1X = 250;
    p2X = 250;
    p1 = game.add.sprite(p1X, 700, 'player1');
    p1.scale.setTo(0.1, 0.1);
    p2 = game.add.sprite(p2X, 350, 'player1');
    p2.scale.setTo(0.1, 0.1);

    ball = game.add.sprite(p1X+9, 675, 'ball');
    ball.scale.setTo(0.25, 0.25);
    ball.anchor.setTo(.5);
    game.physics.enable(ball, Phaser.Physics.REAL);

    arrow = game.add.sprite(ball.x, ball.y, 'arrow');
    arrow.anchor.setTo(0.5, 1);
    arrow.scale.setTo(0.2,0.1);

    var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    text = game.add.text(game.world.centerX - 250, 15, "Current Score: " + scoreCount + "        High Score: " + highScore, style);
  }

  function update() {
    game.physics.arcade.collide(goalBox, ball, collisionDetected);

    moveDefender();
    moveGoalie();
    
    handleInput();
    //followTheBall();

    text.setText("Current Score: " + scoreCount + "        High Score: " + highScore);
  }

  function followTheBall() {
    if (!hit)
      ball.x = game.input.mousePointer.x;

    /*
    if(ball.x > 0 && ball.x < 700)
    {
      game.physics.arcade.moveToXY(ball, game.input.mousePointer.x, 600, 300);
    }
    else if(ball.x >= 0)
    {
      game.physics.arcade.moveToXY(ball, 0, 600, 300);
    }
    else if(ball.x <= 700)
    {
      game.physics.arcade.moveToXY(ball, 700, 600, 300);
    }*/
  }

  function handleInput() {
    if (game.input.activePointer.leftButton.isDown) {
      hit = true;
    }
    if (hit) {
      ball.y -= 6;
    }
  }

  function spawnTheBall() {
    ball.destroy();
    ball = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.scale.setTo(0.5, 0.5);
    game.physics.enable(ball, Phaser.Physics.REAL);
  }

  function collisionDetected() {
    ball.destroy();
    console.log("KJ is cool");
    scoreCount++;
    if (scoreCount > highScore) {
      highScore = scoreCount;
    }
    cheer.play();

    spawnTheBall();

    hit = false;
  }

  function moveGoalie() {
    if(gMoveRight){
      goalie.x += 2;
      if( goalie.x > 350 ){
        gMoveRight = false;
      }
    }
    else{
      goalie.x -= 2;
      if(goalie.x < 200){
        gMoveRight = true;
      }
    }
  }

  function moveDefender() {
    if (defMoveRight) {
      if (defender.x > 500)
        defMoveRight = false;
      defender.x += 3;
    }
    else {
      if (defender.x < 100)
        defMoveRight = true;
      defender.x -= 3;
    }
    if (ball.y < 0) {
      ball.destroy();
      spawnTheBall();
      hit = false;
      scoreCount = 0;
      boo.play();
    }
  }
};
