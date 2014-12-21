/**
 * Created by Daniel on 22.12.2014.
 * MyGame.renderer.pushScene(scene)
 * MyGame.renderer.replaceScene(scene)
 * MyGame.renderer.popScene()
 *
 * scene: onEnter(), onExit(), render(tFrame, context), update(tDelta)
 *
 */

MyGame.renderer = {
};

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
    var sceneStack = [];
    var currentScene = undefined;

    MyGame.renderer.render = function(tFrame, context) {
        if (currentScene && currentScene.render) {
            currentScene.render(tFrame, context);
        } else {
            context.fillStyle = "rgb(0,120,0)";
            context.fillRect(0, 0, MyGame.dimensions.width, MyGame.dimensions.height);
        }
    };

    MyGame.renderer.update = function(tDelta) {
        if (currentScene && currentScene.update) {
            currentScene.update(tDelta);
        }
    };

    MyGame.renderer.pushScene = function(scene) {
        var oldScene = undefined;
        if (sceneStack.length > 0) {
            oldScene = sceneStack.get(sceneStack.length - 1);
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

    MyGame.renderer.popScene = function() {
        var oldScene = sceneStack.get(sceneStack.length - 1);
        sceneStack.pop();
        if (sceneStack.length > 0) {
            currentScene = sceneStack.get(sceneStack.length - 1);
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

    MyGame.renderer.replaceScene = function(scene) {
        var oldScene = sceneStack.get(sceneStack.length - 1);
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
})();