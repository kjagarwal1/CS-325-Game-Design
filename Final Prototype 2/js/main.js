"use strict";

window.onload = function() {
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        game.load.image( 'background', 'assets/background.png' );
        game.load.image( 'spaceship', 'assets/spaceship.png' );
        game.load.image( 'asteroid', 'assets/asteroid.png' )
        game.load.image( 'explosion', 'assets/explosion.png' )
        game.load.audio( 'music', 'audio/music.wav');
    }

    var spaceship;
    var background;
    var explosion;
    var music;

    var size = 50;
    var count;
    var asteroid = new Array(size);
    var asteroidX = new Array(size);
    var asteroidY = new Array(size);
    var i, j;

    var text;
    var style;
    var score;
    var highScore;
    var timer;

    //new code
    var keyb;
    var map;
    var player;

    var arrowKey, leftKey, rightKey, upKey, downKey, shiftKey;
    
    function create() {
        spaceship = game.add.sprite(game.world.centerX, game.world.centerY, 'spaceship');
        spaceship.anchor.setTo(0.5, 0.5);
        spaceship.scale.setTo(.15,.15);

        timer = 0;
        score = 0;
        count = 20;
        highScore = 0;

        explosion = game.add.sprite(-500, -500, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        game.physics.enable(spaceship, Phaser.Physics.REAL);

        game.world.resize(10000, 10000);

        for(i = 0; i < 10000; i += 960){
          for(j = 0; j < 10000; j += 768){
            game.add.sprite(i, j, 'background');
          }
        }
        
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY;
        
        spaceship.fixedToCamera = true;
        
        style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text(game.world.centerX+400, game.world.centerY+60, "Use the arrow keys to move around!\nHolding shift will allow you to move faster!", style );
        text.anchor.setTo(0.5, 0.5);

        spaceship.bringToTop();

        arrowKey = game.input.keyboard.createCursorKeys();
        leftKey  = game.input.keyboard.addKey(Phaser.KeyCode.A);
        rightKey = game.input.keyboard.addKey(Phaser.KeyCode.D);
        upKey = game.input.keyboard.addKey(Phaser.KeyCode.W);
        downKey = game.input.keyboard.addKey(Phaser.KeyCode.S);
        shiftKey = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

        music = game.add.audio('music');
        music.loop = true;
        //music.play();
    }

    function update() {
      if (arrowKey.right.isDown && shiftKey.isDown){
        game.camera.x += 6;
      }
      else if (arrowKey.left.isDown && shiftKey.isDown ){
        game.camera.x -= 6;
      }
      else if (arrowKey.right.isDown) {
        game.camera.x += 3;
      }
      else if (arrowKey.left.isDown) {
        game.camera.x -= 3;
      }

      if (arrowKey.up.isDown && shiftKey.isDown) {
        game.camera.y -= 6;
      }
      else if (arrowKey.down.isDown && shiftKey.isDown) {
        game.camera.y += 6;
      }
      else if (arrowKey.up.isDown) {
        game.camera.y -= 3;
      }
      else if (arrowKey.down.isDown) {
        game.camera.y += 3;
      }

    }

    function ran(){
      moveSpaceship();
      moveAsteroids();

      if(alive){
        moveBackground();
        checkCollision();

        if( timer%30 == 0){
          score++;
          if( score > highScore ){
            highScore = score;
          }
          text.setText("Current Score: " + score + "            High Score: " + highScore);
        }

        timer++;

        if( timer%100 == 0 && count < size){
          count++
        }
      }

      else{
        text.y = 300;
        text.setText("You were killed\n Final Score: " + score + "\nLeft click to restart");
        text.bringToTop();
        if(game.input.activePointer.leftButton.isDown){
          text.y = 30;
          reset();
        }
      }
    }

    function setUpAsteroids(){
      for(i = 0; i < count; i++){
        if( i%2 == 0 ){
          asteroid[i] = game.add.sprite(Math.floor(Math.random()*250), Math.floor(Math.random()*550), 'asteroid');
        }
        else{
          asteroid[i] = game.add.sprite(Math.floor(Math.random()*350), Math.floor(Math.random()*250), 'asteroid');
        }
        asteroid[i].anchor.setTo(0.5, 0.5);
        asteroid[i].scale.setTo(.05,.05);


        if( i%4 == 0 ){
          asteroid[i].x += (-200);
          asteroid[i].y += 25;
          asteroidX[i] = Math.floor(Math.random()*6)+3;
          asteroidY[i] = Math.floor(Math.random()*5)-2;
        }
        else if( i%4 == 1 ){
          asteroid[i].x += 25;
          asteroid[i].y += (-200);
          asteroidX[i] = Math.floor(Math.random()*5)-2;
          asteroidY[i] = Math.floor(Math.random()*6)+3;
        }
        else if( i%4 == 2 ){
          asteroid[i].x += 750;
          asteroid[i].y += 25;
          asteroidX[i] = Math.floor(Math.random()*-6)-3;
          asteroidY[i] = Math.floor(Math.random()*5)-2;
        }
        else{
          asteroid[i].x += 25;
          asteroid[i].y += 550;
          asteroidX[i] = Math.floor(Math.random()*5)-2;
          asteroidY[i] = Math.floor(Math.random()*-6)-3;
        }
        game.physics.enable(asteroid[i], Phaser.Physics.ARCADE );
      }

      for(i = count; i < size; i++){
        if(Math.random() < 0.5){
          asteroid[i] = game.add.sprite(-50, -50, 'asteroid');
          asteroidX[i] = -1;
          asteroidY[i] = -1;
        }
        else{
          asteroid[i] = game.add.sprite(850, 850, 'asteroid');
          asteroidX[i] = 1;
          asteroidY[i] = 1;
        }
        asteroid[i].anchor.setTo(0.5, 0.5);
        asteroid[i].scale.setTo(.05,.05);
      }
    }

    function moveBackground(){
      back0.y += 30;
      back1.y += 30 ;

      if(back0.y > 600){
        back0.y = -(768+168);
      }
      if(back1.y > 600){
        back1.y = -(768+168);
      }
    }

    function moveSpaceship(){
      if(game.input.mousePointer.x < 750 && game.input.mousePointer.x > 50 && alive){
        spaceship.x = game.input.mousePointer.x;
      }

      if(game.input.mousePointer.y < 550 && game.input.mousePointer.y > 50 && alive){
        spaceship.y = game.input.mousePointer.y;
      }
    }

    function moveAsteroids(){
      for(i = 0; i < count; i++){
        asteroid[i].x += asteroidX[i];
        asteroid[i].y += asteroidY[i];
        asteroid[i].angle += 3;
      }
    }

    function checkCollision(){
      for(i = 0; i < count; i++){
        game.physics.arcade.collide(asteroid[i], spaceship, collisionDetected);
        if( asteroid[i].x < -75 && asteroidX[i] < 0){
          rethrowLeft();
        }
        else if( asteroid[i].x > 825 && asteroidX[i] > 0){
          rethrowRight();
        }
        else if( asteroid[i].y < -75 && asteroidY[i] < 0){
          rethrowTop();
        }
        else if( asteroid[i].y > 825 && asteroidY[i] > 0){
          rethrowBottom();
        }
      }
    }

    function collisionDetected(){
      explosion.x = spaceship.x;
      explosion.y = spaceship.y;
      //sound.play();
      spaceship.x = -500;
      asteroid[i].x = -400;
      alive = false;
      for(i = 0; i < count; i++){
        asteroidX[i] = 0;
        asteroidY[i] = 0;
      }
    }

    function rethrowLeft(){
      asteroid[i].x = Math.floor(Math.random()*100) - 150;
      asteroid[i].y = Math.floor(Math.random()*550) + 50;
      asteroidX[i] = Math.floor(Math.random()*6)+3;
      asteroidY[i] = Math.floor(Math.random()*5)-2;
    }

    function rethrowRight(){
      asteroid[i].x = Math.floor(Math.random()*100) + 850;
      asteroid[i].y = Math.floor(Math.random()*550) + 50;
      asteroidX[i] = Math.floor(Math.random()*-6)-3;
      asteroidY[i] = Math.floor(Math.random()*5)-2;
    }

    function rethrowTop(){
      asteroid[i].x = Math.floor(Math.random()*750) + 50;
      asteroid[i].y = Math.floor(Math.random()*100) - 150;
      asteroidX[i] = Math.floor(Math.random()*5)-2;
      asteroidY[i] = Math.floor(Math.random()*6)+3;
    }

    function rethrowBottom(){
      asteroid[i].x = Math.floor(Math.random()*750) + 50;
      asteroid[i].y = Math.floor(Math.random()*100) + 650;
      asteroidX[i] = Math.floor(Math.random()*5)-2;
      asteroidY[i] = Math.floor(Math.random()*-6)-3;
    }

    function reset(){
      for(i = 0; i < count; i++){
        asteroid[i].kill();
      }
      timer = 0;
      score = 0;
      count = 20;
      alive = true;
      explosion.y = - 500;
      setUpAsteroids();
    }
};
