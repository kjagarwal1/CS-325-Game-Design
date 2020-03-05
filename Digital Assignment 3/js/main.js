"use strict";

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('click', 'assets/click.png');
    }

    var button;
    var text;
    var playing;
    var hit;
    var score;
    var time;

    function create() {
        button = game.add.sprite(game.world.centerX, game.world.centerY + 100, 'click');
        button.scale.setTo(.3, .3);
        button.anchor.setTo(0.5, 0.5);
        button.inputEnabled = true;
        button.events.onInputDown.add(listener, this);


        playing = false;
        hit = false;
        score = 0;
        time = 0;

        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text(game.world.centerX, 15, "Click me as many time as you can in 30 seconds!\nScore: " + score, style);
        text.anchor.setTo(0.5, 0.0);
    }

    function update() {
        if (playing) {
            if (hit) {
                score++;
                hit = false;
                button.x = (Math.random() * 600) + 100;
                button.y = (Math.random() * 400) + 150;
            }

            text.setText("Time Left: " + (Math.floor(time / 30)) + " seconds\nScore: " + score);
            time--;

            if (time == 0) {
                playing = false;
                hit = false;
                text.setText("GAME OVER\nScore: " + score + "\nClick to Play again");
                button.x = game.world.centerX;
                button.y = game.world.centerY + 100;
            }
        }
        else if (hit) {
            hit = false;
            playing = true;
            time = 900;
            score = 0;
            button.x = (Math.random() * 600) + 100;
            button.y = (Math.random() * 400) + 150;
        }
    }

    function listener() {
        hit = true;
    }

};
