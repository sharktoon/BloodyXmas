/**
 * Created by Daniel on 22.12.2014.
 */
IntroScene = new GameScene();
IntroScene.constructor = IntroScene;
IntroScene = function () {
    var greetBox = {};
    var greetText = 'Gute Neuigkeiten! Es gibt wieder einen Job fur uns! '
        + 'So ein alter Mann ist in einen Schornstein geklettert und hat sich '
        + 'das Genick gebrochen.';
    var boxWidth = 600;

    var font = '30px serif';


    this.onEnter = function () {
        var context = MyGame.getDrawingContext();
        context.save();
        context.font = font;
        greetBox = MyGame.renderer.makeTextBox(context, greetText, boxWidth, 30);
        context.restore();
    };

    this.render = function (tFrame, context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, MyGame.dimensions.width, MyGame.dimensions.height);

        context.fillStyle = "rgb(200, 0, 0)";
        context.font = font;
        MyGame.renderer.drawTextBox(context, greetBox, 100, 30);
    };

    this.update = function (tDelta) {

    };
};