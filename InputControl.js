window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
});

function detectMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

var mobileDevice = detectMobile();

// capture keyboard requests for player movements
if (!mobileDevice){
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
    });

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
}

// capture touch inputs for mobile devices
else{
    var touches = [];

    window.addEventListener("touchstart",
    function (event){
        event.preventDefault();
        event.stopImmediatePropagation();

        // add the new touches to the touches array
        touches.push(event.changedTouches[0]);

    }, { passive: false });

    window.addEventListener("touchend",
    function (event){
        event.preventDefault();
        event.stopImmediatePropagation();

        // check each touch that ended and remove them from the touches array
        for (var i = 0; i < event.changedTouches.length; i++){
            for (var j = touches.length - 1; j >= 0; j--){
                if (touches[j].identifier == event.changedTouches[i].identifier){
                    touches.splice(j, 1);
                }
            }
        }
        
    }, { passive: false });

    window.addEventListener("touchmove",
    function (event){
        event.preventDefault();
        event.stopImmediatePropagation();
        
    }, { passive: false });

    function checkTouches(){
        var thrusting = false;
        var rotatingLeft = false;
        var rotatingRight = false;

        // return if there are no touches to check

        for (var i = 0; i < touches.length; i++){        
            var xLoc = touches[i].clientX;
            // if touch is in middle of screen, move player forward
            if (xLoc > canvas.width/3 && xLoc < canvas.width/3*2){
                thrusting = true;
            }
            // if touch is on left side of screen, move player left
            if (xLoc < canvas.width/3 && xLoc > 0){
                rotatingLeft = true;
            }
            // if touch is on right side of screen, move player right
            if (xLoc > canvas.width/3*2 && xLoc < canvas.width){
                rotatingRight = true;
            }
        }
        
        // call player movement methods based on touches
        if (rotatingLeft){
            player.rotateLeft();
        }
        if (rotatingRight){
            player.rotateRight();
        }
        if (thrusting){
            player.thrust();
        }
    }
}