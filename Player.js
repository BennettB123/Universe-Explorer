class Player {
    constructor(x, y, imgSrc){
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0.0, 0.0);
        this.gravity = new Vector(0, 0);

        this.angle = 0; // in degrees
        this.rotateSpeed = 5; // 1 degree of rotation

        this.thrustSpeed = 0.0001;
        this.maxSpeed = .2;
        this.resistance = 0.95; // closer to 1 means less resistance

        this.loadImage(imgSrc);
    }

    rotateLeft(){
        this.angle -= this.rotateSpeed;
        this.angle = this.angle % 360;
    }

    rotateRight(){
        this.angle += this.rotateSpeed;
        this.angle = this.angle % 360;
    }

    thrust(){
        var tempVec = new Vector();
        tempVec.setMagnitude(this.thrustSpeed);
        tempVec.setDirection(degreesToRadians(this.angle - 90));

        //this.acceleration.setMagnitude(this.thrustSpeed);
        // subtracted 90 degrees to account for the player image pointing upward when its angle is 0
        //this.acceleration.setDirection(degreesToRadians(this.angle - 90));
        this.acceleration.addTo(tempVec);
        this.acceleration.limit(-this.maxSpeed, this.maxSpeed);
    }

    loadImage(src){
        this.playerImg = new Image();
        this.playerImg.src = src;
        this.playerImg.onload = function() {
        };
        
    }

    draw(x, y, zoomFactor){
        // fancy math to make the player about 1/10 the maximum planet size
        var min = Math.min(this.playerImg.width, this.playerImg.height);
        var sizeX = (this.playerImg.width / min * zoomFactor) * .15;
        var sizeY = (this.playerImg.height / min * zoomFactor) * .15;

        // rotate the player by this.angle (converted to radians)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.translate(-0.5 * sizeX, -0.5 * sizeY);

        ctx.drawImage(this.playerImg, 0, 0, sizeX, sizeY);
        ctx.restore();
    }

    // Search for planets within certain radius around the player and calculate the
    //   net gravity that these planets have.
    calculateGravity(){
        this.gravity = new Vector(0, 0);
        var range = 1;
        for(var tileX = -range; tileX <= range; tileX++){
            for(var tileY = -range; tileY <= range; tileY++){
                var currTileX = Math.floor(this.position.x) + tileX;
                var currTileY = Math.floor(this.position.y) + tileY;

                // check if planet exists at this planet tile. If so, add it to the gravity vector.
                var planet = new Planet(currTileX, currTileY, screen.zoomFactor / 2);
                if (planet.planetExists){
                    var distFromPlanet = Math.hypot(currTileX - this.position.x, currTileY - this.position.y);
                    var gravityStrength = ((range*3 - distFromPlanet) * planet.gravity) * 0.00001;
                    var tempGravVec = new Vector();
                    tempGravVec.setMagnitude(gravityStrength);
                    tempGravVec.setDirection(Math.atan2(currTileY - this.position.y, currTileX - this.position.x));

                    this.gravity.addTo(tempGravVec);
                }
            }
        }
    }

    update(){
        this.velocity.addTo(this.acceleration);
        this.velocity.limit(-this.maxSpeed, this.maxSpeed);
        
        // apply gravity
        this.calculateGravity();
        this.acceleration.addTo(this.gravity);

        // apply resistance
        this.acceleration.multiplyBy(this.resistance);
        this.velocity.multiplyBy(this.resistance);

        this.position.addTo(this.velocity);
    }
    
}