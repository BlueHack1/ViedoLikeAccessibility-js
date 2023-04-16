/**
 * 执行具体任务模块
 */
let executeTask = {};
const task = require("./TaskStyle");

/**
 * 
 * @param {string} type :任务类型
 * @param {int} isAuto 自动
 */

//" 6:/ 复制打开抖音，看看【爆胎草莓粥的作品】家人们谁懂啊！@锅盖wer ￠￠6w8mrYF2sfxsB8ξ ";
executeTask.main = function (type, isAuto) {
    threads.start(() => {
        // 悬浮窗判定，是否继续执行
        while (true) {
            // 悬浮窗暂停
            if(!isPause) {
                if(executeDetailTask(type, isAuto) == -1) {
                    // 获取null
                    // 如果运行过程中，已经有暂停了，此时按钮显示继续。恢复暂停按钮显示。
                    if(isPause) {
                        win.console1.click();
                    }
                    break;
                }
                sleep(3000);
            } else {
                log("当前状态：已暂停");
                sleep(1000);
            }
        }
    });
}

threads.start(() => {

    while(true) {
        if(className("android.widget.Button").text("我知道了").exists()) {
            className("android.widget.Button").text("我知道了").findOne().click();
        }
    }
});

// let data = {
//     "name": " ",
//     "address": "1:/ 复制打开抖音，看看【麻衣学姐的作品】# ai绘画 # 海外短视频 # tiktok #... ΨΨet44lbpcuB8ÄÄ ",
//     "id": "1",
//     "content": "你好呀;你好2",
//     "second": "2",
//     "type": "type"
// }

function executeDetailTask(type, isAuto) {
    let data = null;
    // 获取task
    if ((data = getDetailTask(type, isAuto)) != -1) {
        let newType = null;
        let result = null;
        if(isAuto == 1) {
            // 开启全自动，但是 type 要传回来的type ，不是当前方法传递的type
            log("托管：" + data.type)
            newType = data.type;
            result = task[data.type](data);
        } else {
            newType = type;
            log("正常：" + type)
            result = task[type](data);
        }

        if(result != -1) {
            log("执行成功：等待3秒");
            // finish
            if (finshTask(newType, data.id, result, data.bname) == 1) {
                log("任务完成:等待3秒");
            } else {
                log("任务失败:等待3秒");
            }
            sleep(3000);
            return 1;
        } else {
            // -1：失败
            log("执行失败");
            return -1;
        }
    }
}
/**
 * 
 * @param {*} type 任务类型
 * @param {int} isAuto 自动
 * @returns data | -1 : 失败
 */
function getDetailTask(type, isAuto) {
    let params = {}
    if(isAuto == 1) {
        params.isAuto = 1;
        toastLog("获取任务中：托管中");
    } else {
        params.type = type;
        toastLog("获取任务中：" + type);
    }

    let result = http.post("http://huzhu.vxwl.net/api/admin/task", params, {
        "headers" :{
            "token": token
        }
    }).body.json();
    // log(result);
    if (result.code == 1 && result.data != null) {
        toastLog("获取成功");
        return result.data;
    } else {
        toastLog("错误:[data为空]或" + result.msg);
        return -1;
    }
}

/**
 * 任务状态
 * @param {*} type 
 * @param {*} taskId 
 * @param {*} isAttention 是否关注
 * @param {*} bname 
 * returns 1 成功 -1 失败
 */
function finshTask(type, taskId, isAttention, bname) {
    if(isAttention == null) {
        isAttention = 0;
    }
    let result = http.post("http://huzhu.vxwl.net/api/admin/completeTask", {
        "type": type,
        "taskid": taskId,
        "isAttention": isAttention,
        "bname": bname
    }, {
        "headers" :{
            "token": token
        }
    }).body.json();
    if (result.code == 1 && result.data != null) {
        return result.code;
    } else {
        toastLog("错误:[data为空]或" + result.msg);
        return -1;
    }
}

module.exports = executeTask;