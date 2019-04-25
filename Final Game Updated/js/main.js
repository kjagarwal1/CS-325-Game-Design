"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

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
    var background;
    var asteroidSprite;
    var hit=false;
    var scoreCount = 0;
    var highScore = 0;
    var moveRight = true;
    var coolText;
    var style;
    var speedOfBucket = 3;
  //  var moveLeft = false;

    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        //background = game.add.image( game.world.centerX, game.world.centerY, 'back' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //background.anchor.setTo( 0.5, 0.5 );
        boo = game.add.audio('boo');
        cheer = game.add.audio('cheer');
        grass = game.add.sprite(0,0,'grass');
        grass.scale.setTo(4,3);

        bucket = game.add.sprite( game.world.centerX, game.world.centerY, 'bucket' );
        bucket.anchor.setTo(0.5, 0.5);
        bucket.scale.setTo(0.2, 0.2);
        bucket.y = 150;
        game.physics.enable( bucket, Phaser.Physics.REAL );
        bucket.body.immovable = true;
        bucket.body.setSize(150, 150, 40, 40);

        ball = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        ball.scale.setTo(0.5,0.5);
        game.physics.enable( ball, Phaser.Physics.REAL );


        style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        coolText = game.add.text( game.world.centerX-250, 15, "Current Score: " + scoreCount + "            High Score: " + highScore, style );
        //coolText2 = game.add.text( game.world.centerX+75, 15, "High Score: " + highScore, style );
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        //bouncy.body.collideWorldBounds = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

        game.physics.arcade.collide(bucket, ball, collisionDetected);

        //game.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);

        bucketMove();

        handleInput();
        followTheBall();

        coolText.setText("Current Score: " + scoreCount + "            High Score: " + highScore);
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
