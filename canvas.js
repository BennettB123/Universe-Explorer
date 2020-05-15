var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');


// capture keyboard requests for player movements
var keys = [];
window.addEventListener('keydown',
    function(event){
        if (event.key == "ArrowLeft"){
            keys[event.key] = true;
        }
        if (event.key == "ArrowRight"){
            keys[event.key] = true;
        }
        if (event.key == " "){
            keys[event.key] = true;
        }
    });
    window.addEventListener('keyup',
    function(event){
        if (event.key == "ArrowLeft"){
            keys[event.key] = false;
        }
        if (event.key == "ArrowRight"){
            keys[event.key] = false;
        }
        if (event.key == " "){
            keys[event.key] = false;
        }
    });
    // capture mouse scroll for zooming
    window.addEventListener('wheel',
    function(event){
        if(event.deltaY != 0){
            screen.changeZoom(event.deltaY);
        }
    })

window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });


////////// GLOBAL CONSTANTS \\\\\\\\\\

var MaxX = canvas.width;
var MaxY = canvas.height;

////////// HELPER FUNCTIONS \\\\\\\\\\

function clampNumber(num, min, max){
    return Math.min(Math.max(num, min), max);
}

function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function map(value, min1, max1, min2, max2){
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

// *Disclaimer*
// This function, mulberry32, was found on github on user 'bryc's page and can be found here
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
// This function is used rather than the Math.random() function because a seedable
// PRNG is needed. This happens to be the fastest and most evenly distributed PRNG I tested.
function mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function seedFromXY(x, y){
    var hash = (String(x) + String(y)).hashCode();
    return hash;
}

function degreesToRadians(deg){
    return deg * Math.PI / 180;
}

//////////////////////////////////////

function checkKeys(){
    if (keys["ArrowLeft"]){
        player.rotateLeft();
    }
    if (keys["ArrowRight"]){
        player.rotateRight();
    }
    if (keys[" "]){
        player.thrust();
    }
}

var player = new Player(0, 0, "./src/rocket-ship.png");
var screen;

function init(){
    screen = new Screen(player, 256);
    animate();
}

function drawFrame(){
    //draw entities on the screen
    screen.draw();
}

function animate() {
    requestAnimationFrame(animate);
    
    // check for keyboard input
    checkKeys();

    // update entities
    player.update();

    // draw screen;
    drawFrame();
}

// start of execution
init();