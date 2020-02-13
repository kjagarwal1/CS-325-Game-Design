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
        game.load.image('click', 'assets/click.png');
    }

    var button;
    var text;
    var playing;
    var hit;
    var score;
    
    function create() {
        button = game.add.sprite( game.world.centerX, game.world.centerY + 100, 'click');
        button.scale.setTo(.3,.3);
        button.anchor.setTo(0.5,0.5);
        button.events.onInputDown.add(listener, this);


        playing = false;
        hit = false;
        score = 3600;

        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Click me as many time as you can in 1 minute!\nScore: " + score, style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function update() {
        if(playing){

        }else{

            if(hit){
                score++;
                hit = false;
            }

        }

        text.setText("Click me as many time as you can in 1 minute!\nScore: " + score);

    }

    function listener() {
        hit = true;
    }

};
