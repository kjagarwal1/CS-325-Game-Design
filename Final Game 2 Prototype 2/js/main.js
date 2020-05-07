"use strict";

window.onload = function() {
    var game = new Phaser.Game( 600, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('grass','assets/grass.jpg');
        game.load.image('bucket', 'assets/bucket.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.audio('cheer', 'sounds/cheer.wav');
        game.load.audio('boo', 'sounds/boo.wav');
        }

    var grass;
    var bucket;
    var ball;
    var cheer;
    var boo;
    var hit=false;
    var scoreCount = 0;
    var highScore = 0;
    var moveRight = true;
    var coolText;
    var style;
    var speedOfBucket = 3;

    function create() {
        boo = game.add.audio('boo');
        boo.volume = 0.3;
        cheer = game.add.audio('cheer');
        cheer.volume = 0.3;
        
        grass = game.add.sprite(0,650,'grass');
        grass.scale.setTo(4, 3);
        grass = game.add.sprite(0, 0, 'grass');
        grass.scale.setTo(4, 3);

        bucket = game.add.sprite( game.world.centerX, 100, 'bucket' );
        bucket.anchor.setTo(0.5, 0.5);
        bucket.scale.setTo(0.4, 0.2);
        game.physics.enable( bucket, Phaser.Physics.REAL );
        bucket.body.immovable = true;
        bucket.body.setSize(150, 150, 40, 40);

        ball = game.add.sprite(game.world.centerX, 850, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        ball.scale.setTo(0.25,0.25);
        game.physics.enable( ball, Phaser.Physics.REAL );


        style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        coolText = game.add.text( game.world.centerX-250, 15, "Current Score: " + scoreCount + "        High Score: " + highScore, style );
    }

    function update() {
        game.physics.arcade.collide(bucket, ball, collisionDetected);

        //bucketMove();

        handleInput();
        followTheBall();

        coolText.setText("Current Score: " + scoreCount + "        High Score: " + highScore);
        speedOfBucket = 3 + (scoreCount / 5);
        //coolText2.setText("High Score: " + highScore);


        //ball.rotation = game.physics.arcade.accelerateToPointer( ball, game.input.activePointer, 500, 500, 500 );

        //bucketMove();
    }

    function followTheBall()
    {
      if(!hit)
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

    function handleInput()
    {
      if(game.input.activePointer.leftButton.isDown)
      {
        hit = true;
      }
      if(hit){
          ball.y -= 6;
      }
    }

    function spawnTheBall()
    {
      ball = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ball');
      ball.anchor.setTo(0.5, 0.5);
      ball.scale.setTo(0.5,0.5);
      game.physics.enable( ball, Phaser.Physics.REAL );
    }

    function collisionDetected()
    {
      ball.destroy();
      console.log("KJ is cool");
      scoreCount++;
      if(scoreCount > highScore){
        highScore = scoreCount;
      }
      cheer.play();

      spawnTheBall();

      hit = false;
    }

    function bucketMove()
    {
      if(moveRight){
        if(bucket.x > 700)
          moveRight = false;
        bucket.x += speedOfBucket;
      }
      else{
        if(bucket.x < 100)
         moveRight= true;
        bucket.x -= speedOfBucket;
      }
      if(ball.y < 0)
      {
        ball.destroy();
        spawnTheBall();
        hit = false;
        scoreCount = 0;
        boo.play();
      }
    }
};
