const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const header = require('./header');

var scratchID = 0;
var isCommunicatable = true;
var sensorData = header.sensorData;
var orderData = header.orderData;
const DATA_NAME = header.DATA_NAME;
const REQUEST = header.REQUEST;

// 拡張機能が呼び出されたときにwebsocketでの通信を開始する
const con = new WebSocket('ws://localhost:8081/');
try {
    con.onopen = function() {
        console.log('coを開始しました');
        sendData(1);
        setInterval(connectSmartphone, 1000);
    };
} catch (error) {
    console.log(error);
}

var connectSmartphone = function() {
    if (scratchID != 0 && orderData.smartphone_ID != 0) sendData(2);
}

con.onmessage = function(ms) {
    console.log("受け取ったデータ = " + ms.data);
    isCommunicatable = true;
    orderData.flag = 0;

    var receivedData = JSON.parse(ms.data);
    var requestNum = receivedData[DATA_NAME.request_num];

    switch(requestNum) {
        case REQUEST.none:
            break;
        case REQUEST.getID:
            scratchID = receivedData[DATA_NAME.scratch_ID];
            orderData.scratch_ID = scratchID;
            console.log("scratchID = " + orderData.scratch_ID);
            break;
        case REQUEST.connect:
            setSensorData(receivedData);
            break;
    }  
};

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
    con.close();
}

function sendData(request_num) {
    if (isCommunicatable == false) return;

    orderData.request_num = request_num;
    console.log('送るデータ:' + JSON.stringify(orderData));
    try {
        con.send(JSON.stringify(orderData));
        isCommunicatable = false;
    } catch (error) {
        console.log(error);
    }
}

function setSensorData(data) {
    sensorData.alpha            = data[DATA_NAME.alpha];
    sensorData.beta             = data[DATA_NAME.beta];
    sensorData.gamma            = data[DATA_NAME.gamma];
    sensorData.angle            = data[DATA_NAME.angle];
    sensorData.size             = data[DATA_NAME.size];
    sensorData.position_x       = data[DATA_NAME.position_x];
    sensorData.position_y       = data[DATA_NAME.position_y];
    sensorData.acceleration_x   = data[DATA_NAME.acceleration_x];
    sensorData.acceleration_y   = data[DATA_NAME.acceleration_y];
    sensorData.acceleration_z   = data[DATA_NAME.acceleration_z];
    sensorData.image_num        = data[DATA_NAME.image_num];
    sensorData.input_text       = data[DATA_NAME.input_text];
    sensorData.voice_message    = data[DATA_NAME.voice_message];
    sensorData.tap_position_x   = data[DATA_NAME.tap_position_x];
    sensorData.tap_position_y   = data[DATA_NAME.tap_position_y];
    sensorData.button_click     = data[DATA_NAME.button_click];
    sensorData.image_touch      = data[DATA_NAME.image_touch];
    sensorData.swipe_vertical   = data[DATA_NAME.swipe_vertical];
    sensorData.swipe_horizontal = data[DATA_NAME.swipe_horizontal];

    console.log("sensorData.alpha = " + sensorData.alpha);
}


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';


/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3NewBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'setID',
                    blockType: BlockType.COMMAND,
                    text: 'IDを [smartphoneID] にする',
                    arguments: {
                        smartphoneID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: 'setImage',
                    blockType: BlockType.COMMAND,
                    text: 'スキンを [imageNum] 番にする',
                    arguments: {
                        imageNum: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setBackImage',
                    blockType: BlockType.COMMAND,
                    text: '背景を [backImageNum] 番にする',
                    arguments: {
                        backImageNum: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setSize',
                    blockType: BlockType.COMMAND,
                    text: '大きさを [size] %ずつ変える',
                    arguments: {
                        size: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setSize2',
                    blockType: BlockType.COMMAND,
                    text: '大きさを [size] %にする',
                    arguments: {
                        size: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'rotateRight',
                    blockType: BlockType.COMMAND,
                    text: '右に [angle] 度回す',
                    arguments: {
                        angle: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'rotateLeft',
                    blockType: BlockType.COMMAND,
                    text: '左に [angle] 度回す',
                    arguments: {
                        angle: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setPosition',
                    blockType: BlockType.COMMAND,
                    text: 'x座標を [x]、y座標を[y]にする',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                //TODO これの実装方法考える
                {
                    opcode: 'setPosition2',
                    blockType: BlockType.COMMAND,
                    text: '[x]歩動かす',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setPositionX',
                    blockType: BlockType.COMMAND,
                    text: 'x座標を[x]ずつ変える',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setPositionX2',
                    blockType: BlockType.COMMAND,
                    text: 'x座標を[x]にする',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setPositionY',
                    blockType: BlockType.COMMAND,
                    text: 'y座標を[y]ずつ変える',
                    arguments: {
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setPositionY2',
                    blockType: BlockType.COMMAND,
                    text: 'y座標を[y]にする',
                    arguments: {
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setMessage',
                    blockType: BlockType.COMMAND,
                    text: ' [message] と表示する',
                    arguments: {
                        message: {
                            type: ArgumentType.STRING,
                            defaultValue: "こんにちは"
                        }
                    }
                },
                {
                    opcode: 'setAlert',
                    blockType: BlockType.COMMAND,
                    text: ' [alertMessage] とアラートを表示する',
                    arguments: {
                        alertMessage: {
                            type: ArgumentType.STRING,
                            defaultValue: "こんにちは"
                        }
                    }
                },
                {
                    opcode: 'setButtonText',
                    blockType: BlockType.COMMAND,
                    text: ' ボタンの文字を[text] にする',
                    arguments: {
                        text: {
                            type: ArgumentType.STRING,
                            defaultValue: "ボタン"
                        }
                    }
                },
                {
                    opcode: 'setAudio',
                    blockType: BlockType.COMMAND,
                    text: '音 [audioNum] を流す',
                    arguments: {
                        audioNum: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'isImageClicked',
                    text: 'オブジェクトが押された',
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'isButtonClicked',
                    text: 'ボタンが押された',
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'view',
                    blockType: BlockType.COMMAND,
                    text: '見せる'
                },
                {
                    opcode: 'hide',
                    blockType: BlockType.COMMAND,
                    text: 'かくす'
                },
                {
                    opcode: 'reset',
                    blockType: BlockType.COMMAND,
                    text: '全ての設定を元に戻す',
                },
                {
                    opcode: 'getInputText',
                    text: '入力された文字',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getX',
                    text: 'X座標',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getY',
                    text: 'Y座標',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAngle',
                    text: '向き',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getSize',
                    text: '大きさ',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAlpha',
                    text: '横方向の回転角度',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getBeta',
                    text: '縦方向の回転角度',
                    blockType: BlockType.REPORTER
                },
                /*
                {
                    opcode: 'getGamma',
                    text: 'z方向の回転角度',
                    blockType: BlockType.REPORTER
                },
                */
                {
                    opcode: 'getAccelerationX',
                    text: 'x方向の加速度',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAccelerationY',
                    text: 'y方向の加速度',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAccelerationZ',
                    text: 'z方向の加速度',
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
            }
        };
    }

    setID (args) {
        var smartphoneID = Cast.toNumber(args.smartphoneID);
        console.log("num = " + smartphoneID);
        //IDが0~50の範囲の場合IDを上書きする
        if (0 < smartphoneID && smartphoneID <= 50) {
            orderData.smartphone_ID = smartphoneID;
        }
        console.log('ID = ' + orderData.smartphone_ID);
    }

    setImage (args) {
        var num = Cast.toNumber(args.imageNum);
        console.log("image_num = " + num);
        orderData.image_num = num;
        orderData.flag = orderData.flag | 4;
    }

    setBackImage (args) {
        var num = Cast.toNumber(args.backImageNum);
        orderData.back_image_num = num;
        orderData.flag = orderData.flag | 2;
    }

    setSize (args) {
        var num = Cast.toNumber(args.size);
        orderData.size = sensorData.size + num;
        orderData.flag = orderData.flag | 128;
    }

    setSize2 (args) {
        var num = Cast.toNumber(args.size);
        orderData.size = num;
        orderData.flag = orderData.flag | 128;
    }

    rotateRight (args) {
        var num = Cast.toNumber(args.angle);
        orderData.angle = sensorData.angle + num;
        orderData.flag = orderData.flag | 256;
    }

    rotateLeft (args) {
        var num = Cast.toNumber(args.angle);
        orderData.angle = sensorData.angle + -1 * num;
        orderData.flag = orderData.flag | 256;
    }

    setPosition (args) {
        var x = Cast.toNumber(args.x);
        var y = Cast.toNumber(args.y);
        orderData.pos_x = x;
        orderData.pos_y = y;
        orderData.flag = orderData.flag | 64;
    }

    setPosition2 (args) {
        var x = Cast.toNumber(args.x);
        orderData.pos_x = x;
        orderData.flag = orderData.flag | 64;
    }

    setPositionX (args) {
        var x = Cast.toNumber(args.x);
        orderData.pos_x = sensorData.position_x + x;
        orderData.flag = orderData.flag | 64;
    }

    setPositionX2 (args) {
        var x = Cast.toNumber(args.x);
        orderData.pos_x = x;
        orderData.flag = orderData.flag | 64;
    }

    setPositionY (args) {
        var y = Cast.toNumber(args.y);
        orderData.pos_y = sensorData.position_y + y;
        orderData.flag = orderData.flag | 64;
    }

    setPositionY2 (args) {
        var y = Cast.toNumber(args.x);
        orderData.pos_y = y;
        orderData.flag = orderData.flag | 64;
    }

    setMessage (args) {
        var message = Cast.toString(args.message);
        console.log('message = ' + message);
        orderData.message = message;
        orderData.flag = orderData.flag | 8;
    }

    setAlert (args) {
        var message = Cast.toString(args.alertMessage);
        console.log('alertMessage = ' + message);
        orderData.alert_message = message;
        orderData.flag = orderData.flag | 16;
    }

    setButtonText (args) {
        var text = Cast.toString(args.text);
        console.log('alertMessage = ' + text);
        orderData.button_text = text;
        orderData.flag = orderData.flag | 512;
    }

    setAudio (args) {
        var num = Cast.toNumber(args.audioNum);
        orderData.bgm_num = num;
        orderData.flag = orderData.flag | 32;
    }

    isImageClicked () {
        return sensorData.image_touch;
    }

    isButtonClicked () {
        return sensorData.button_click;
    }

    view () {
        orderData.view = true;
        orderData.flag = orderData.flag | 1024;
    }

    hide () {
        orderData.view = false;
        orderData.flag = orderData.flag | 1024;
    }

    reset () {
        orderData.flag = orderData.flag | 1;
    }

    /**
     * Get the browser.
     * @return {number} - the user agent.
     */

    
    getInputText() {
        return sensorData.input_text;
    }

    getX () {
        return sensorData.position_x;
    }

    getY () {
        return sensorData.position_y;
    }

    getAngle () {
        return sensorData.angle;
    }

    getSize () {
        return sensorData.size;
    }

    getAlpha () {
        return sensorData.alpha;
    }
    getBeta () {
        return sensorData.beta;
    }
    /*
    getGamma () {
        return sensorData.gamma;
    }
    */

    getAccelerationX () {
        return sensorData.acceleration_x;
    }
    getAccelerationY () {
        return sensorData.acceleration_y;
    }
    getAccelerationZ () {
        return sensorData.acceleration_z;
    }
}

module.exports = Scratch3NewBlocks;