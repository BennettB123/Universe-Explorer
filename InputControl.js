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

window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
});

// capture keyboard requests for player movements
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

// capture touch inputs for mobile devices
window.addEventListener("touchstart",
    function(event){
        event.preventDefault();
});