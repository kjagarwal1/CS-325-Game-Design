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
        game.load.image( 'bucket', 'assets/bucket.jpg' );
        game.load.image('ball', 'assets/ball.png')
        game.load.image('asteroid', 'assets/asteroid.png');
    }

    var bucket;
    var ball;
    var moveRight;
    var xSpeed;
    var moveDown;
    var ySpeed;
    var score;
    var time;
    var text;
    var started;

    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        //background = game.add.image( game.world.centerX, game.world.centerY, 'back' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //background.anchor.setTo( 0.5, 0.5 );
        
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        moveRight = true;
        xSpeed = Math.floor(Math.random() * 3) + 1;
        moveDown = true;
        ySpeed = Math.floor(Math.random() * 3) + 1;
        time = 0;
        score = 0;
        started = false;

        bucket = game.add.sprite( game.world.centerX, game.world.centerY-100, 'bucket' );
        bucket.anchor.setTo(0.5, 0.5);
        bucket.scale.setTo(0.4, 0.4);
        game.physics.enable( bucket, Phaser.Physics.REAL );
        bucket.body.immovable = true;

        ball = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        ball.scale.setTo(0.05,0.05);
        game.physics.enable( ball, Phaser.Physics.REAL );

        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text(game.world.centerX, 15, "Get the ball in the bucket as many times as you can in 30 seconds!\nClick anywhere to start", style);
        text.anchor.setTo( 0.5, 0.0 );
    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        if( time > 0 ){
            game.physics.arcade.collide(bucket, ball, collisionDetected);            
            
            moveBucket();
            ball.rotation = game.physics.arcade.accelerateToPointer( ball, game.input.activePointer, 500, 500, 500 );
            
            text.setText("Score: " + score + "\nTime Remaining: " + Math.floor(time / 30));
            time -= 1;
        }
        else{
            if(started){
                text.setText("You made " + score + " buckets!!\nClick anywhere to play again");
            }
            if(game.input.activePointer.leftButton.isDown) {
                spawnTheBall();
                time = 900;
                score = 0;
                started = true;
            }
        }
    }

    function moveBucket(){
        if (moveRight) {
            bucket.x += xSpeed;
            if (bucket.x > 600) {
                moveRight = false;
                xSpeed = Math.floor(Math.random() * 3) + 1;
            }
        }
        else {
            bucket.x -= xSpeed;
            if (bucket.x < 200) {
                moveRight = true;
                xSpeed = Math.floor(Math.random() * 3) + 1;
            }
        }

        if (moveDown) {
            bucket.y += ySpeed;
            if (bucket.y > 400) {
                moveDown = false;
                ySpeed = Math.floor(Math.random() * 3) + 1;
            }
        }
        else {
            bucket.y -= ySpeed;
            if (bucket.y < 100) {
                moveDown = true;
                ySpeed = Math.floor(Math.random() * 3) + 1;
            }
        }
    }

    function collisionDetected()
    {
        score += 1;
        reset();
    }

    function reset()
    {
        ball.x = Math.floor(Math.random() * 600) + 100;
        ball.y = game.world.centerY + 200;
    }

    function spawnTheBall() {
        ball.destroy();
        ball = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        ball.scale.setTo(0.05, 0.05);
        game.physics.enable(ball, Phaser.Physics.REAL);
    }
};
