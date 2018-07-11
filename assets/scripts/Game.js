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

        score: 0,
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        ground: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    /**
     *设置新生成星星的位置
     */
    getNewStarPosition: function () {
        let randY = this.groundY + cc.random0To1() * this.player.getComponent("Player").jumpHeight + 50;
        let maxWidth = this.node.width / 2;
        const randX = cc.randomMinus1To1() * maxWidth;
        return cc.p(randX, randY);
    },

    /**
     * 生产星星
     */
    spawnNewStar: function () {
        //1. 从prefab中实例化
        const newStar = cc.instantiate(this.starPrefab);
        //2. 添加到当前的node中
        this.node.addChild(newStar);
        //3. 设定newStar的位置
        var newStarPosition = this.getNewStarPosition();
        newStar.setPosition(newStarPosition);
        //4. 将game引用传入star中
        newStar.getComponent('Star').game = this
    },
    /**
     * 获取积分
     */
    gainScore: function () {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score.toString();
        cc.audioEngine.play(this.scoreAudio, false, 1);
    },
    /**
     * 游戏结束
     */
    gameOver: function () {aaa
        this.player.stopAllActions();
        cc.director.loadScene("game")
    },
    onLoad() {
        this.groundY = this.ground.y + this.ground.height / 2;
        this.spawnNewStar();
    }

// update (dt) {},
})
;
