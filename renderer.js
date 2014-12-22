/**
 * Created by Daniel on 22.12.2014.
 * MyGame.renderer.pushScene(scene)
 * MyGame.renderer.replaceScene(scene)
 * MyGame.renderer.popScene()
 *
 * scene: onEnter(), onExit(), render(tFrame, context), update(tDelta)
 *
 */

var GameScene = function() {
};
/** called when the scene becomes active */
GameScene.prototype.onEnter = function() {
};
/** called when the scene disappears */
GameScene.prototype.onExit = function() {
};
/** called each 'tick' */
GameScene.prototype.update = function(tDelta) {
};
/** called when the scene should be drawn */
GameScene.prototype.render = function(tFrame, context) {
};

(function() {
    // the renderer
    var that = {};
    var sceneStack = [];
    var currentScene = undefined;

    that.render = function(tFrame, context) {
        if (currentScene && currentScene.render) {
            currentScene.render(tFrame, context);
        } else {
            context.fillStyle = "rgb(0,120,0)";
            context.fillRect(0, 0, MyGame.dimensions.width, MyGame.dimensions.height);
        }
    };

    that.update = function(tDelta) {
        if (currentScene && currentScene.update) {
            currentScene.update(tDelta);
        }
    };

    that.pushScene = function(scene) {
        var oldScene = undefined;
        if (sceneStack.length > 0) {
            oldScene = sceneStack[sceneStack.length - 1];
        }
        sceneStack.push(scene);
        currentScene = scene;
        // make the calls RIGHT after leaving this stack
        setTimeout(function() {
            if (oldScene && oldScene.onExit) {
                oldScene.onExit();
            }
            if (scene === currentScene && scene.onEnter) {
                scene.onEnter();
            }
        }, 0);
    };

    that.popScene = function() {
        var oldScene = sceneStack[sceneStack.length - 1];
        sceneStack.pop();
        if (sceneStack.length > 0) {
            currentScene = sceneStack[sceneStack.length - 1];
        } else {
            currentScene = undefined;
        }
        // make the change RIGHT after leaving this stack
        setTimeout(function() {
            if (oldScene.onExit) {
                oldScene.onExit();
            }
            if (currentScene) {
                if (currentScene.onEnter) {
                    currentScene.onEnter();
                }
            } else {
                MyGame.bGameEnded = true;
            }
        }, 0);
    };

    that.replaceScene = function(scene) {
        var oldScene = sceneStack[sceneStack.length - 1];
        sceneStack.pop();
        sceneStack.push(scene);
        currentScene = scene;
        // make the change RIGHT after leaving this stack
        setTimeout(function() {
            if (oldScene.onExit) {
                oldScene.onExit();
            }
            if (scene === currentScene && scene.onEnter) {
                scene.onEnter();
            }
        }, 0);
    };


    // -- IMAGE LOADING AND DRAWING ----------------------------
    var imageList = {};

    that.loadImage = function(name, callback) {
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

    that.isImageReady = function(name) {
        if (!imageList.hasOwnProperty(name)) {
            return false;
        }
        return imageList[name].complete;
    };

    that.unloadImage = function(name) {
        if (imageList.hasOwnProperty(name)) {
            delete imageList[name];
        }
    };

    that.drawImage = function(context, imagename, x, y) {
        x = x || 0;
        y = y || 0;
        if (MyGame.isImageReady(imagename)) {
            context.drawImage(imageList[imagename], x, y);
            return true;
        } else {
            return false;
        }
    };

    // -- TEXT DRAWING --------------------------------------
    // text box consists of lines
    that.makeTextBox = function(context, text, width, lineHeight) {
        lineHeight = lineHeight || 0;
        var box = {
            lines: [],
            lineHeight: lineHeight,
            widthLimit: width
        };
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; ++n) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            if (metrics.height > box.lineHeight) {
                box.lineHeight = metrics.height;
            }
            var testWidth = metrics.width;
            if (testWidth > width && n > 0) {
                box.lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        box.lines.push(line);
        return box;
    };

    that.drawTextBox = function(context, box, x, y) {
        if (box.lines === undefined) {
            return;
        }
        for(var i = 0; i < box.lines.length; ++i) {
            context.fillText(box.lines[i], x, y, box.widthLimit);
            y += box.lineHeight;
        }
    };

    /** draw text, even adjusted to appear center, or right */
    that.drawText = function(context, text, x, y, layout) {
        if (layout === undefined || layout === 'left') {
            context.fillText(text, x, y);
        } else {
            var metrics = context.measureText(text);
            if (layout === 'right') {
                context.fillText(text, x - metrics.width, y);
            } else if (layout === 'center') {
                context.fillText(text, x - metrics.width / 2, y);
            }
        }
    };

    MyGame.renderer = that;
})();