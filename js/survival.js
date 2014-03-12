Game.Survival = function(game) {
    var count = 0;
    var ENEMYNUMBERS = 5;

    this.create = function() {
        this.enemies = null;
        stateChange = false;
        time = 0;
        mult = 1;
        this.createStage(3000, 399, 'backgroundMetal', 'groundMetal');
        this.createRandomPlatforms(3000, 300, 'platformMetal');
        this.createPlayer(15, 300);
        this.createControls();
        this.createTrophy(2950, 50);
        this.createCamera(this.player);
        this.survive = game.add.sprite(game.camera.x + 260, game.camera.y + 75, 'survive');
        this.survive.alpha = 0;
        game.add.tween(this.survive)
                .to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, 0, 0, true)
                .onComplete.add(this.startSurvive, this);
        this.texts = game.add.group();
        this.location = 1;
    };

    this.update = function() {
        this.ledges.setAll("body.velocity.y", 0);
        this.createCollision(this.player, this.platforms, null);
        this.createCollision(this.player, this.ledges, this.platformPoints);
        this.createCollision(this.enemies, this.platforms, null);
        this.createCollision(this.player, this.enemies, this.killPlayer);
        this.createCollision(this.enemies, this.ledges, null);
        this.createCollision(this.trophy, this.ledges);
        this.createCollision(this.trophy, this.platforms);
        this.createCollision(this.player, this.trophy, this.implying);
        this.playerMovement();
        this.collideLeftRight();


        if (this.player.alive === false) {
            var gameover = game.add.sprite(game.camera.x + 260, game.camera.y + 75, 'gameOver');
            gameover.alpha = 0;
            game.add.tween(gameover)
                    .to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true)
                    .onComplete.add(function() {
                        stateChange = true;
                    });
        }else{
            this.player.alive = true;
        };

        if ((count >= 50) && this.enemies) {
            count = 0;
            game.add.tween(this.enemies.getRandom())
                    .to({x: this.player.x, y: this.player.y}, 1600, Phaser.Easing.Linear.None)
                    .start();
        }

        count++;

        if (stateChange)
        {
            game.state.start('End');
        }


    };



    this.render = function() {
        if (this.player.alive && this.moving){
            this.createScore("Score: " + (time += 1 * mult) + " " + mult + "x", 20, 40);
        }
        else
            this.createScore("Score: " + (time) + " " + mult + "x", 20, 40);
    };

    this.startSurvive = function() {
        this.survive.kill();
        this.player.alive = true;
        this.createEnemies(ENEMYNUMBERS, 2990, 'enemy');
    };
};

Game.Survival.prototype = new Game.Play();