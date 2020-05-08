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
    game.load.image('arrow', 'assets/arrow.png');
    game.load.audio('cheer', 'sounds/cheer.wav');
    game.load.audio('boo', 'sounds/boo.wav');
  }

  var grass;
  var goal;
  var goalBox;
  var ball;
  var cheer;
  var boo;
  var scoreCount = 0;
  var highScore = 0;
  var defMoveRight = true;
  var gMoveRight = true;
  var text, text2;
  var arrow;

  var wall1;
  var wall2;
  var wall3;
  var defender;
  var goalie;
  var p1;
  var p2;
  var wallX;
  var p1X;
  var p2X;
  var arrowKey;
  var spaceBar;
  var shotX;
  var shotY;

  function create() {
    boo = game.add.audio('boo');
    boo.volume = 0.5;
    cheer = game.add.audio('cheer');
    cheer.volume = 0.5;

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

    goalBox = game.add.sprite(210, 75, 'box');
    goalBox.scale.setTo(.09, .0125);
    //goalBox.sendToBack();

    defender = game.add.sprite(500, 500, 'player2');
    defender.scale.setTo(0.1, 0.1);

    goalie = game.add.sprite(200, 80, 'goalie');
    goalie.scale.setTo(0.1, 0.1);

  
    wall1 = game.add.sprite(0, 175, 'player2');
    wall1.scale.setTo(0.1, 0.1);
    wall2 = game.add.sprite(0, 175, 'player2');
    wall2.scale.setTo(0.1, 0.1);
    wall3 = game.add.sprite(0, 175, 'player2');
    wall3.scale.setTo(0.1, 0.1);

    p1 = game.add.sprite(0, 700, 'player1');
    p1.scale.setTo(0.1, 0.1);
    p2 = game.add.sprite(0, 350, 'player1');
    p2.scale.setTo(0.1, 0.1);

    ball = game.add.sprite(0, 0, 'ball');
    ball.scale.setTo(0.25, 0.25);
    ball.anchor.setTo(.5);

    arrow = game.add.sprite(0, 0, 'arrow');
    arrow.anchor.setTo(0.5, 1);
    arrow.scale.setTo(0.2, 0.1);

    var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    text = game.add.text(game.world.centerX, 15, "Current Score: " + scoreCount + "        High Score: " + highScore, style);
    text.anchor.setTo(.5, 0);

    text2 = game.add.text(game.world.centerX, 450, "Use the Left and Right Arrow keys to aim.\nPress the Space Bar to shoot and pass", style);
    text2.anchor.setTo(0.5, 0);

    arrowKey = game.input.keyboard.createCursorKeys();
    spaceBar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    reset();
    game.physics.enable(ball, Phaser.Physics.REAL);
    game.physics.enable(p2, Phaser.Physics.REAL);
    game.physics.enable(wall1, Phaser.Physics.REAL);
    game.physics.enable(wall2, Phaser.Physics.REAL);
    game.physics.enable(wall3, Phaser.Physics.REAL);
    game.physics.enable(defender, Phaser.Physics.REAL);
    game.physics.enable(goalie, Phaser.Physics.REAL);
    game.physics.enable(goalBox, Phaser.Physics.REAL);
  }

  function update() {
    collisionDetection();
    
    moveDefender();
    moveGoalie();
    moveBall();

    handleInput();
    text.setText("Current Score: " + scoreCount + "        High Score: " + highScore);
  }

  function collisionDetection() {
    game.physics.arcade.collide(goalBox, ball, goalScored);
    game.physics.arcade.collide(p2, ball, ballPassed);
    game.physics.arcade.collide(wall1, ball, ballBlocked);
    game.physics.arcade.collide(wall2, ball, ballBlocked);
    game.physics.arcade.collide(wall3, ball, ballBlocked);
    game.physics.arcade.collide(defender, ball, ballGiveAway);
    game.physics.arcade.collide(goalie, ball, ballBlocked);
  }

  function moveBall() {
    ball.x += shotX;
    ball.y += shotY;

    if (ball.x < -20 || ball.x > 620 || ball.y < -20 || ball.y > 820) {
      reset();
      scoreCount = 0;
      boo.play();
    }
  }

  function handleInput() {
    var started = false;
    if(arrowKey.right.isDown){
      arrow.angle += 2;
      started = true;
    }
    if(arrowKey.left.isDown){
      arrow.angle -= 2;
      started = true;
    }
    if(spaceBar.isDown){
      shotX = Math.cos((arrow.angle + 90)* Math.PI / 180) * -4;
      shotY = Math.sin((arrow.angle + 90)* Math.PI / 180) * -4;
      started = true;
      arrow.visible = false;
    }
    if (started){
      text2.setText("");
    }
  }

  function moveGoalie() {
    if (gMoveRight) {
      goalie.x += 2;
      if (goalie.x > 350) {
        gMoveRight = false;
      }
    }
    else {
      goalie.x -= 2;
      if (goalie.x < 200) {
        gMoveRight = true;
      }
    }
  }

  function moveDefender() {
    if (defMoveRight) {
      if (defender.x > 500)
        defMoveRight = false;
      defender.x += 4;
    }
    else {
      if (defender.x < 100)
        defMoveRight = true;
      defender.x -= 4;
    }
  }

  function goalScored() {
    text2.setText("GOALL!!!!");

    reset();
    scoreCount++;
    if (scoreCount > highScore) {
      highScore = scoreCount;
    }
    cheer.play();
  }

  function ballPassed() {
    ball.x = p2X + 9;
    ball.y = 320;
    arrow.x = ball.x;
    arrow.y = ball.y;
    arrow.angle = 0;
    arrow.visible = true;
    shotX = 0;
    shotY = 0;
  }

  function ballGiveAway() {
    text2.setText("Ball Given Away");

    reset();
    scoreCount = 0;
    boo.play();
  }

  function ballBlocked() {
    text2.setText("Shot Blocked");

    reset();
    scoreCount = 0;
    boo.play();
  }

  function reset() {
    shotY = 0;
    shotX = 0;

    wallX = Math.floor(Math.random() * 300) + 125;
    p1X = Math.floor(Math.random() * 350) + 125;
    p2X = Math.floor(Math.random() * 350) + 125;

    wall1.x = wallX;
    wall2.x = wallX + 25;
    wall3.x = wallX + 50;

    p1.x = p1X;
    p2.x = p2X;

    ball.x = p1X + 9;
    ball.y = 675;

    arrow.x = ball.x;
    arrow.y = ball.y;
    arrow.angle = 0;
    arrow.visible = true;
  }
};
