// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 60,
        maxStarCreateDuration: 5,
        minStarCreateDuration: 3
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.timer = 0;
        this.duration = this.minStarCreateDuration + cc.random0To1() * this.maxStarCreateDuration;
    },

    start() {

    },

    getPlayerDistance: function () {
        var position = this.game.player.getPosition();
        var mPosition = this.node.getPosition();

        return cc.pDistance(mPosition, position);

    },
    onPicked: function () {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    },
    update(dt) {
        //1. 每帧判断player和星星的距离,如果达到设定的距离，将现在的星星销毁，生成新的星星；并给主角加积分
        let distance = this.getPlayerDistance();
        if (distance < this.pickRadius) {
            this.onPicked();
        }

        if (this.timer > this.duration) {
            //如果超时了，让小星星消失，游戏结束
            this.game.gameOver();
            return;
        }

        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.timer / this.duration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));

        this.timer += dt;
    },
});
