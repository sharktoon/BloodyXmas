/**
 * Created by Daniel on 20.12.2014.
 */

var MyGame = {
    renderer: undefined,
    dimensions: { width: 800, height: 600 },
    bGameEnded: false,
    iTickLength: 33,
    iMaxTickLength: 60
};


$(document).ready(function () {
    var canvas = $("#TheCanvas");//window.document.getElementById("TheCanvas");

    // -- IMAGE LOADING AND DRAWING ----------------------------
    var imageList = {};

    MyGame.loadImage = function(name, callback) {
        if (imageList.hasOwnProperty(name)) {
            setTimeout(callback, 0);
        }
        var image = new Image();
        imageList[name] = image;
        if (callback) {
            image.onload = callback;
        }
        image.src = "img/" + name;
    };

    MyGame.isImageReady = function(name) {
        if (!imageList.hasOwnProperty(name)) {
            return false;
        }
        return imageList[name].complete;
    };

    MyGame.unloadImage = function(name) {
        if (imageList.hasOwnProperty(name)) {
            delete imageList[name];
        }
    };

    MyGame.drawImage = function(context, imagename, x, y) {
        x = x || 0;
        y = y || 0;
        if (MyGame.isImageReady(imagename)) {
            context.drawImage(imageList[imagename], x, y);
            return true;
        } else {
            return false;
        }
    };

    var scale = 1;

    function resizeCanvas() {
        var winWidth = $(window).get(0).innerWidth;
        var winHeight = $(window).get(0).innerHeight;
        var scaleX = winWidth / MyGame.dimensions.width;
        var scaleY = winHeight / MyGame.dimensions.height;
        scale = scaleX;
        var left = 0;
        if (scaleY < scale) {
            scale = scaleY;
            left = (winWidth - MyGame.dimensions.width * scale) / 2;
        }
        canvas.attr("width", MyGame.dimensions.width * scale);
        canvas.attr("height", MyGame.dimensions.height * scale);
        canvas.css({
            position: "absolute",
            left: (left) + "px"
        });

        // re-render stuff
        render(MyGame.lastRender);
    }

    window.onresize = resizeCanvas;
    resizeCanvas();


    // -- TOUCH POSITION STUFF -----------------------------
    function eventPos(e) {
        if(e.type.match(/^touch/)) {
            e = e.originalEvent.changedTouches[0];
        }
        return {
            pageX : e.pageX,
            pageY : e.pageY
        };
    }

    var touchListeners = [];
    MyGame.addTouchListener = function(listener) {
        var index = touchListeners.indexOf(listener);
        if (index >= 0) {
            return;
        }
        if (listener.hasOwnProperty("onTouchMove") && listener.hasOwnProperty("onTouchStart") && listener.hasOwnProperty("onTouchEnd")) {
            touchListeners.push(listener);
        }
    };
    MyGame.removeTouchListener = function(listener) {
        var index = touchListeners.indexOf(listener);
        if (index >= 0) {
            touchListeners.splice(index, 1);
        }
    };

    function onTouchDrag(eventData) {
        var pos = eventPos(eventData);

        var touch_x = pos.pageX - canvas[0].offsetLeft;
        var touch_y = pos.pageY - canvas[0].offsetTop;
        touch_x = touch_x / scale;
        touch_y = touch_y / scale;

        for( var i = 0; i < touchListeners.length; ++i) {
            touchListeners[i].onTouchMove(touch_x, touch_y, eventData);
        }
    }
    function onTouchStart(eventData) {
        var pos = eventPos(eventData);

        var canvas = $("#gamecanvas");
        var touch_x = pos.pageX - canvas[0].offsetLeft;
        var touch_y = pos.pageY - canvas[0].offsetTop;
        touch_x = touch_x / scale;
        touch_y = touch_y / scale;

        for( var i = 0; i < touchListeners.length; ++i) {
            touchListeners[i].onTouchStart(touch_x, touch_y, eventData);
        }
    }

    function onTouchEnd(eventData) {
        var pos = eventPos(eventData);
        var canvas = $("#gamecanvas");
        var touch_x = pos.pageX - canvas[0].offsetLeft;
        var touch_y = pos.pageY - canvas[0].offsetTop;
        touch_x = touch_x / scale;
        touch_y = touch_y / scale;

        for( var i = 0; i < touchListeners.length; ++i) {
            touchListeners[i].onTouchEnd(touch_x, touch_y, eventData);
        }
    }
    canvas.on('mousedown touchstart', function(e) {
        if(e.button && e.button >= 2) return;
        if(e.type == 'mousedown') {
            $(document).on('mousemove', onTouchDrag);
        } else if(e.type == 'touchstart') {
            $(document).on('touchmove', onTouchDrag);
        }
        onTouchStart(e);
        e.preventDefault();
    });
    $(document).on('mouseup touchend', function(e) {
        $(document).off('mousemove touchmove', onTouchDrag);
        onTouchEnd(e);
    });


    function main(tFrame) {
        if (MyGame.bGameEnded) {
            return;
        }
        window.requestAnimationFrame(main);

        var nextTick = MyGame.lastTick + MyGame.iTickLength;

        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - MyGame.lastTick;
            if (timeSinceTick > MyGame.iMaxTickLength) {
                timeSinceTick = MyGame.iMaxTickLength;
            }

            update(timeSinceTick);

            render(tFrame);
            MyGame.lastRender = tFrame;
        }
    }

    function update(tDelta) {
        // called each 'tick' with a precise time since last tick
        if (MyGame.renderer) {
            MyGame.renderer.update(tDelta);
        }
    }

    function setInitialState() {
        // called to setup everything
    }

    function render(tFrame) {
        // draw stuff!
        var context = canvas.get(0).getContext('2d');
        context.save();
        context.scale(scale, scale);
        if (MyGame.renderer) {
            MyGame.renderer.render(tFrame, context);
        } else {
            var text = "t = " + tFrame;
            context.fillStyle = "rgb(200,200,200)";
            context.fillRect(0, 0, MyGame.dimensions.width, MyGame.dimensions.height);
            context.font = "30px serif";
            context.fontcolor = "white";
            context.fillStyle = "black";
            context.fillText(text, 50, 50);
            context.fillText("No renderer configured!", 50, 100);
        }
        context.restore();
    }

    MyGame.lastTick = window.performance.now();
    MyGame.lastRender = MyGame.lastRender;

    setInitialState();
    main(window.performance.now());
});
