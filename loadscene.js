/**
 * Created by Daniel on 22.12.2014.
 */

LoadScene.prototype = new GameScene();
LoadScene.constructor = LoadScene;
function LoadScene() {
    var step = 0;

    this.onEnter = function() {

    };

    this.update = function(tDelta) {
        ++step;
        if (step > 100) {
            MyGame.renderer.popScene();
        }
    };

    this.render = function(tFrame, context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, MyGame.dimensions.width, MyGame.dimensions.height);

        var offset = 50;
        var width = MyGame.dimensions.width - 2 * offset;
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillRect(offset, MyGame.dimensions.height - 2 * offset, width, offset);
        context.fillStyle = "rgb(180, 10, 10)";
        var percentage = step < 100?step / 100:1;
        context.fillRect(offset, MyGame.dimensions.height - 2 * offset, width * percentage, offset);

        context.fillStyle = "rgb(0, 0, 0)";
        context.font = '30px serif';
        MyGame.renderer.drawText(context, 'Loading...', MyGame.dimensions.width/2, MyGame.dimensions.height - offset - 10, 'center');
    };
}

// start with a load scene
MyGame.onStart = function() {
    MyGame.renderer.pushScene(new LoadScene());
};