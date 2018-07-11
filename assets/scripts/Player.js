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

        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        xSpeed: 0,
        accelLeft: false,
        accelRight: false,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }

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


    playJumpAudio: function () {
        cc.audioEngine.play(this.jumpAudio, false,1);
    },
    /**
     * 设置跳跃的行为
     *
     * @returns {cc.ActionInterval}
     */
    setJumpAction: function () {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionInOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callFunc = cc.callFunc(this.playJumpAudio, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callFunc));
    },

    /**
     * 监听按键获得加速度的方向
     */
    setAccelDirection: function () {
        var self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.accelLeft = true;
                    break;
                case cc.KEY.d:
                    self.accelRight = true;
                    break;
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            switch (event.keyCode) {
                case cc.KEY.a:
                    self.accelLeft = false;
                    break;
                case cc.KEY.d:
                    self.accelRight = false;
                    break;
            }
        })

    },

    onLoad() {
        const jumpAction = this.setJumpAction();
        this.node.runAction(jumpAction);
        this.setAccelDirection();
    },

    start() {

    },

    update(dt) {
        //时间*加速度，获得速度，速度*时间，获得移动的距离->设定node的位置
        if (this.accelLeft) {
            this.xSpeed -= this.accel * dt
        } else if (this.accelRight) {
            this.xSpeed += this.accel * dt;
        }

        //速度不能大于设定好的最大速度
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
        }

        this.node.x += this.xSpeed * dt;
    },
});
