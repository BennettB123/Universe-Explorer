class Screen {

    constructor(player, zoomFactor){
        // this.player is a Player object
        this.player = player;
        this.zoomFactor = zoomFactor;
        this.minZoomFactor = 4;
        this.maxZoomFactor = 1024;
        this.planets = [];
    }

    // adjust the zoomFactor of the screen, making sure to keep it a whole number between min/maxZoomFactor
    changeZoom(amount){

        this.zoomFactor += amount;
        this.zoomFactor = clampNumber(this.zoomFactor, this.minZoomFactor, this.maxZoomFactor);
    }

    draw(){ 
        // black background
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw planets
        // planetTilesX/Y is the total number of "planet tiles" that fit across the screen.
        //   (increases when zoomFactor decreases)
        this.planetTilesX = canvas.width / this.zoomFactor;
        this.planetTilesY = canvas.height / this.zoomFactor;

        // playerX/Y is the x and y coordinate of the player rounded down to nearest integer
        var playerX = Math.floor(this.player.position.x);
        var playerY = Math.floor(this.player.position.y);

        // go through every "planet tile" that should be visible on the screen
        // (the -2 and +2 is so that planets smoothly appear on screen instead of popping up when they come into frame)
        for (var tileX = -2; tileX < this.planetTilesX + 2; tileX++){
            for (var tileY = -2; tileY < this.planetTilesY + 2; tileY++){
                // find coordinates of current planet tile based on player coordinates
                var currTileX = playerX + (tileX - Math.floor(this.planetTilesX / 2));
                var currTileY = playerY + (tileY - Math.floor(this.planetTilesY / 2));

                // check if planet exists at this planet tile. If so, draw it.
                var planet = new Planet(currTileX, currTileY, this.zoomFactor / 2);
                if (planet.planetExists){
                    // instead of drawing it based on (0, 0) screen coordinate,
                    //    draw it based on where the player is on the screen: the exact middle
                    var middleWidth = canvas.width / 2;
                    var middleHeight = canvas.height / 2;
                    var drawingLocX = middleWidth + (tileX - Math.floor(this.planetTilesX / 2)) * this.zoomFactor;
                    var drawingLocY = middleHeight + (tileY - Math.floor(this.planetTilesY / 2)) * this.zoomFactor;

                    
                    // offset for when player is not exactly on a coordinate line
                    var offsetFromPlayerX = (playerX - this.player.position.x) * this.zoomFactor;
                    var offsetFromPlayerY = (playerY - this.player.position.y) * this.zoomFactor;

                    planet.draw(drawingLocX + offsetFromPlayerX,
                                drawingLocY + offsetFromPlayerY,
                                this.zoomFactor / 2);
                }
            }
        }

        // draw player on middle of screen
        player.draw(canvas.width / 2, canvas.height / 2, this.zoomFactor / 2);

        // draw player coordinates
        ctx.font = "30px Arial";
        ctx.fillStyle = "cyan";
        ctx.textBaseline = 'hanging';
        ctx.fillText("X: " + playerX + "  Y: " + playerY, 0, 0);
    }

    update(){
        this.draw();
    }
}
