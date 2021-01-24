// const { true, true } = require('tap');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const header = require('./header');

var scratchID = 0;
var isConnectSuccess = false;
var isCommunicateOK = true;
var isAccessRetry = true;
var sensorData = header.sensorData;
var orderData = header.orderData;
const DATA_NAME = header.DATA_NAME;
const REQUEST = header.REQUEST;

// 拡張機能が呼び出されたときにwebsocketでの通信を開始する
const con = new WebSocket('ws://172.20.10.4:8081');
try {
    con.onopen = function() {
        console.log('coを開始しました');
        sendData(1);
        setInterval(connectSmartphone, 500);
    };
} catch (error) {
    console.log(error);
}

var connectSmartphone = function() {
    if (isCommunicateOK == false) {
        isCommunicateOK = true;
        isConnectSuccess = false;
    }
    if (scratchID != 0 && orderData.smartphone_ID != 0) sendData(2);
}

con.onmessage = function(ms) {
    console.log("受け取ったデータ = " + ms.data);
    isCommunicateOK = true;
    orderData.flag = 0;

    var receivedData = JSON.parse(ms.data);
    var requestNum = receivedData[DATA_NAME.request_num];

    switch(requestNum) {
        case REQUEST.none:
            break;
        case REQUEST.getID:
            var status = receivedData["status"];

            if (status == 500) {
                alert(receivedData["message"]);
            } else {
                scratchID = receivedData[DATA_NAME.scratch_ID];
                orderData.scratch_ID = scratchID;
                console.log("scratchID = " + orderData.scratch_ID);    
            }
            break;
        case REQUEST.connect:
            if (scratchID == receivedData[DATA_NAME.scratch_ID]) {
                setSensorData(receivedData);
                isConnectSuccess = true;
            } else {
                isConnectSuccess = false;
                isAccessRetry = false;
            }
            break;
    }  
};

window.addEventListener("beforeunload", function(e) {
    sendData(REQUEST.close);
    con.close();
    //e.returnValue = "ページを移動します";
}, false);

function sendData(request_num) {
    if (isCommunicateOK == false) return;
    if (request_num == REQUEST.connect && isConnectSuccess == false && isAccessRetry == false) return;

    orderData.request_num = request_num;
    console.log('送るデータ:' + JSON.stringify(orderData));
    try {
        con.send(JSON.stringify(orderData));
        isCommunicateOK = false;
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
    sensorData.screen_height    = data[DATA_NAME.screen_height];
    sensorData.screen_width     = data[DATA_NAME.screen_width];
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
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNDAuMDAwMDAwcHQiIGhlaWdodD0iNDAuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA0MC4wMDAwMDAgNDAuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw0MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik0xMDcgMzY0IGMtNCAtNCAtNyAtNzggLTcgLTE2NSAwIC0xOTMgLTEgLTE5MSAxMDcgLTE4NiA1MSAyIDc3IDgKODQgMTcgNSA4IDggODcgNiAxNzUgbC0yIDE2MCAtOTAgMyBjLTUwIDEgLTk0IDAgLTk4IC00eiBtMTczIC0xNjkgbDAgLTE1NQotODAgMCAtODAgMCAwIDE1NSAwIDE1NSA4MCAwIDgwIDAgMCAtMTU1eiIvPgo8L2c+Cjwvc3ZnPgo=';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNDAuMDAwMDAwcHQiIGhlaWdodD0iNDAuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA0MC4wMDAwMDAgNDAuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw0MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik0xMDcgMzY0IGMtNCAtNCAtNyAtNzggLTcgLTE2NSAwIC0xOTMgLTEgLTE5MSAxMDcgLTE4NiA1MSAyIDc3IDgKODQgMTcgNSA4IDggODcgNiAxNzUgbC0yIDE2MCAtOTAgMyBjLTUwIDEgLTk0IDAgLTk4IC00eiBtMTczIC0xNjkgbDAgLTE1NQotODAgMCAtODAgMCAwIDE1NSAwIDE1NSA4MCAwIDgwIDAgMCAtMTU1eiIvPgo8L2c+Cjwvc3ZnPgo=';


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
                    opcode: 'isConnect',
                    text: '接続に成功した',
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'setID',
                    blockType: BlockType.COMMAND,
                    text: 'IDを [smartphoneID] にする',
                    arguments: {
                        smartphoneID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
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
                    text: 'x座標を [y]、y座標を[x]にする',
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
                /*
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
                */
                {
                    opcode: 'setPositionX',
                    blockType: BlockType.COMMAND,
                    text: 'y座標を[x]ずつ変える',
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
                    text: 'y座標を[x]にする',
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
                    text: 'x座標を[y]ずつ変える',
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
                    text: 'x座標を[y]にする',
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
                /*
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
                */
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
                    opcode: 'isSwipeVertical',
                    text: '縦にスワイプした',
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'isSwipeHorizontal',
                    text: '横にスワイプした',
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
                {
                    opcode: 'getScreenHeight',
                    text: '画面の高さ',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getScreenWidth',
                    text: '画面の幅',
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
            }
        };
    }

    isConnect () {
        return isConnectSuccess;
    }

    setID (args) {
        var smartphoneID = Cast.toNumber(args.smartphoneID);
        console.log("num = " + smartphoneID);
            orderData.smartphone_ID = smartphoneID;
        console.log('ID = ' + orderData.smartphone_ID);
        isAccessRetry = true;
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
        orderData.position_x = x;
        orderData.position_y = y;
        orderData.flag = orderData.flag | 64;
    }

    setPosition2 (args) {
        var x = Cast.toNumber(args.x);
        orderData.position_x = x;
        orderData.position_y = -1;
        orderData.flag = orderData.flag | 64;
    }

    setPositionX (args) {
        var x = Cast.toNumber(args.x);
        orderData.position_x = sensorData.position_x + x;
        orderData.position_y = -1;
        orderData.flag = orderData.flag | 64;
    }

    setPositionX2 (args) {
        var x = Cast.toNumber(args.x);
        orderData.position_x = x;
        orderData.position_y = -1;
        orderData.flag = orderData.flag | 64;
    }

    setPositionY (args) {
        var y = Cast.toNumber(args.y);
        orderData.position_y = sensorData.position_y + y;
        orderData.position_x = -1;
        orderData.flag = orderData.flag | 64;
    }

    setPositionY2 (args) {
        var y = Cast.toNumber(args.x);
        orderData.position_y = y;
        orderData.position_x = -1;
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

    isSwipeVertical () {
        return sensorData.swipe_vertical;
    }

    isSwipeHorizontal () {
        return sensorData.swipe_horizontal;
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
        return sensorData.position_y;
    }

    getY () {
        return sensorData.position_x;
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
    
    getScreenHeight() {
        return sensorData.screen_height;
    }
    getScreenWidth() {
        return sensorData.screen_width;
    }
}

module.exports = Scratch3NewBlocks;