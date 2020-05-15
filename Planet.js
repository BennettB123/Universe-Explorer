class Planet {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.seed = seedFromXY(this.x, this.y);
        this.rng = mulberry32(this.seed);
        this.planetExists = this.planetExists();
        // if planet does not exists, no need to calculate other properties
        if (!this.planetExists){
            return;
        }
        this.radius = this.setRadius();
        this.color = this.setColor();
    }

    // returns true or false to determine if the planet exists based on its seed
    planetExists(){
        return (this.rng() < Planet.chanceOfStar);
    }

    // generate a radius for the planet based on its seed
    setRadius(){
        return map(this.rng(), 0, 1, 0.1, 0.9);
    }

    // generate a color for the planet based on its seed
    setColor(){
        var colorIndex = Math.floor(this.rng() * Planet.planetColors.length);
        return Planet.planetColors[colorIndex];
    }

    // draw the planet, where x, y are the location to draw them on the canvas screen
    draw(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size * this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {

        this.draw();
    }
}

// Static Variables for Planets
Planet.chanceOfStar = .05;

Planet.planetColors = [
    "#504E51", // dark gray
    "#CECCD1", // light gray
    "#212354", // dark blue
    "#3E66F9", // medium blue
    "#89F3FF", // light blue
    "#99857A", // light brown
    "#E27B58", // orange
    "#663926", // dark brown
    "#3B5D38", // dark green
    "#3C4258", // charcoal
    "#FBFCFF", // ghosty white
]