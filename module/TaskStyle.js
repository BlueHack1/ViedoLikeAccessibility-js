module.exports = (function () {

    let ws = null;

    let reportTime = 60 * 5;  // 上传状态时间 秒

    let waitSocketTime = 50; // socket 指令超时时间
    let waitSocketTimeTemp = 0;
    let isWaitSocket = true; // 默认监听socket

    /**
     * 
     * @param {*} data 
     * @returns 1 成功且关注  0 成功但未关注 -1 失败 
     */
    this.douVideo = function (data) {
        if (data.bname != undefined && data.bname.trim() != "") {
            try {
                setClip(data.address)
            } catch (e) {
                consnole.error("复制失败");
                return -1;
            }
            home();
            sleep(2000);
            toastLog("打开APP");
            app.startActivity({
                "packageName": "com.ss.android.ugc.aweme",
                "className": "com.ss.android.ugc.aweme.main.MainActivity"
            })
            toastLog("进入APP");
            let time = 0;
            // 10s 无口令,则失败
            while (true) {
                // 等待弹窗的出现; 超过10秒 失败 
                if (className("android.widget.Button").desc("打开看看").exists()) {
                    time = 0;
                    className("android.widget.Button").desc("打开看看").findOne().click();
                    log("进入页面")
                    // 进入页面
                    id("title").textContains(data.bname).waitFor();

                    // like
                    let like = descContains("喜欢").id("dyw").findOne();
                    log("等待" + data.second + "s");
                    sleep(data.second.toString().trim() * 1000);
                    // 未选中
                    if (like.desc().includes("未")) {
                        log("喜欢成功");
                        like.click();
                    } else {
                        log("已喜欢");
                    }

                    sleep(2000);
                    // focuseOn 
                    let isAttention = 0;
                    let focus = className("android.widget.Button").id("fyh").findOne();
                    // 未关注
                    if (focus.childCount() > 0 && focus.child(0).id().toString().includes("fx")) {
                        focus.click();
                        isAttention = 1;
                        log("关注成功");
                    } else {
                        log("已经关注");
                    }

                    sleep(2000);
                    // comment
                    if (data.content != undefined && data.content.toString().trim() != "") {
                        className("android.widget.FrameLayout").clickable(true).id("cub").findOne().click();
                        className("android.widget.EditText").id("cur").findOne().setText(data.content);
                        className("android.widget.FrameLayout").clickable(true).id("cwp").visibleToUser(true).findOne().click();
                        log("发布成功")
                    }
                    className("android.widget.ImageView").desc("关闭").idContains("back_btn").findOne().click();
                    descContains("喜欢").id("dyw").waitFor();
                    sleep(2000);
                    className("android.widget.ImageView").idContains("back_btn").findOne().click();
                    sleep(1000);
                    return isAttention;
                } else {
                    if (time == 10) {
                        console.error("地址加载超时:结束");
                        return -1;
                    }
                    time++;
                    sleep(1000);
                }
            }

        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    this.douLive = function (data) {
        // 停留时间
        let waitTime = Number(data.second);
        if (waitTime == undefined || waitTime == 0) {
            waitTime = 10;
        }
        if (data.bname != undefined && data.bname.trim() != "") {
            try {
                setClip(data.address)
            } catch (e) {
                consnole.error("复制失败");
                return -1;
            }
            home();
            sleep(2000);
            toastLog("打开APP");
            app.startActivity({
                "packageName": "com.ss.android.ugc.aweme",
                "className": "com.ss.android.ugc.aweme.main.MainActivity"
            })
            waitForPackage2("com.ss.android.ugc.aweme");
            toastLog("进入APP");
            let time = 0;
            // 进入页面
            while (true) {
                // 等待弹窗的出现; 超过10秒 失败 
                if (className("android.widget.TextView").text("打开看看").exists()) {
                    time = 0;
                    className("android.widget.TextView").text("打开看看").findOne().click();
                    // 进入页面
                    id("user_name").textContains(data.bname).waitFor();
                    log("进入页面");

                    log("等待" + 1 + "分后接收指令");
                    sleep(1 * 1000);

                    // 关注
                    if (className("android.widget.TextView").clickable(true).id("fx0").text("关注").exists()) {
                        className("android.widget.TextView").clickable(true).id("fx0").text("关注").findOne().click();
                        log("关注成功");
                        sleep(2000);
                    }
                    break;
                } else {
                    if (time == 10) {
                        console.error("地址加载超时:结束");

                        return -1;
                    }
                    time++;
                    sleep(1000);
                }
            }

            // socket
            let socketThread = threads.start(() => {
                while (true) {
                    createWebSocket();
                    // 首次连接并发送消息
                    if (ws.send("{'type':'1','token':'ok'}")) {
                        // 监听socket
                        log(1)
                        receiveText(0);
                        break;
                    }
                }
                setInterval(() => {

                }, 1000);
            })

            // 指令超时
            let instructionThread = threads.start(function () {

                while (true) {
                    sleep(1000)
                    // 防止socket事件运行，时间也在计算
                    if (isWaitSocket) {
                        waitSocketTimeTemp++; // socket 超时设置
                    }


                    log("指定超时：当前：" + waitSocketTimeTemp + "秒")
                    if (waitSocketTimeTemp >= waitSocketTime && isWaitSocket) {
                        waitSocketTimeTemp = 0;
                        isWaitSocket = false;
                        let waitTime = random(30, 180);
                        log("暂无socket指令，" + waitTime + "s后自动执行")
                        sleep(waitTime * 1000);
                        className("android.widget.TextView").clickable(true).id("ep8").findOne().click();
                        // 输入内容
                        toastLog("等待5秒后开始重新获取指令");
                        sleep(5 * 1000);
                        isWaitSocket = true;
                    }
                }
            })

            // 上传状态
            let i = 0;
            // 必须在主线程运行
            while (true) {
                sleep(1000);
                i++

                log("当前：" + i + "秒\n总：" + waitTime + "秒")
                if (i >= waitTime) {
                    // 关闭两个线程
                    socketThread.interrupt();
                    instructionThread.interrupt();
                    // 关闭socket链接

                    ws.close(1000, null);
                    break;
                } else if (i % reportTime == 0) {
                    toastLog("上传状态中：必须保证在主界面！");
                    try {
                        // 防止受网络速度影响
                        threads.start(function () {
                            reportStatus(data.id, id("user_name").textContains(data.bname).findOne().text());
                        })
                    } catch (e) {
                        // 请求中关闭线程
                    }

                }

            }
        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    this.wechatVideo = function (data) {
        if (data.bname != undefined && data.bname.trim() != "") {
            toastLog("打开APP");
            app.startActivity({
                "packageName": "com.tencent.mm",
                "className": "com.tencent.mm.ui.LauncherUI"
            })
            waitForPackage2("com.tencent.mm");
            toastLog("进入APP");
            className("android.widget.LinearLayout").id("dtf").findOne().parent().click();
            className("android.view.View").id("fzg").text("视频号短视频互助群").findOne().parent().parent().parent().parent().click();
            className("android.widget.TextView").id("ipt").textContains("视频号短视频互助").waitFor();
            sleep(2000);
            let flag = false;  // 是否完成
            while (true) {
                // 名字
                let result = className("android.widget.TextView").id("aw9").visibleToUser(true).find();
                if (result.length > 0) {
                    try {
                        // 停留时间
                        let waitTime = Number(data.second);
                        for (let i = 0; i < result.length; i++) {
                            let name = result[i].text();
                            if (name.includes(data.bname)) {
                                let content = result[i].parent().parent().child(1).text();
                                result[i].parent().parent().parent().click();
                                log("进入视频");
                                log("等待" + waitTime + "s");
                                sleep(waitTime * 1000);
                                log("等待结束");
                                className("android.widget.ImageView").clickable(true).id("x1").visibleToUser(true).findOne().click();
                                let focus = className("android.widget.FrameLayout").clickable(true).id("d2c").findOne();
                                if (focus.childCount() > 0 && focus.child(0).className().toString().includes("ext")) {
                                    log("已关注");
                                    focus.click();
                                }
                                sleep(3000);
                                className("android.widget.LinearLayout").clickable(true).id("xq").visibleToUser(true).click();
                                className("android.widget.LinearLayout").idContains("xk").waitFor();
                                sleep(3000);
                                className("android.widget.LinearLayout").idContains("xk").findOne().click();
                                log("已点赞");
                                sleep(3000);
                                className("android.widget.LinearLayout").idContains("b8z").findOne().click();
                                className("android.widget.EditText").idContains("b8q").findOne().setText(data.content);
                                className("android.widget.TextView").clickable(true).text("回复").findOne().click();
                                log("完成");
                                className("android.widget.FrameLayout").id("b4c").visibleToUser(true).findOne().click();
                                sleep(5000);
                                className("android.widget.LinearLayout").idContains("xu").findOne().click();
                                flag = true;
                                break;
                            }
                        }
                    } catch (e) {
                        log(e)
                    }

                }
                if (!id("awv").findOne().scrollUp() || flag) {
                    className("android.widget.LinearLayout").clickable(true).id("eh").findOne().click();
                    className("android.widget.LinearLayout").id("dtf").waitFor();
                    break;
                }
                sleep(2000);
            }
            // 未找到：失败
            if (!flag) {
                return -1;
            } else {
                return 1;
            }
        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    this.wechatLive = function (data) {
        // 停留时间
        let waitTime = Number(data.second);
        if (waitTime == undefined || waitTime == 0) {
            waitTime = 10;
        }
        if (data.bname != undefined && data.bname.trim() != "") {
            try {
                setClip(data.address)
            } catch (e) {
                consnole.error("复制失败");
                return -1;
            }
            home();
            sleep(2000);

            app.startActivity({
                "packageName": "com.tencent.mm",
                "className": "com.tencent.mm.ui.LauncherUI"
            })
            waitForPackage2("com.tencent.mm");
            toastLog("进入APP");

            className("android.widget.LinearLayout").id("dtf").findOne().parent().click();
            className("android.view.View").id("fzg").text("视频号短视频互助群").findOne().parent().parent().parent().parent().click();
            className("android.widget.TextView").id("ipt").textContains("视频号短视频互助").waitFor();
            sleep(2000);
            let flag = false;  // 是否完成
            while (true) {
                // 名字
                let result = className("android.widget.TextView").idContains("aw9").visibleToUser(true).find();
                if (result.length > 0) {
                    try {
                        // 停留时间
                        let waitTime = Number(data.second);
                        for (let j = 0; j < result.length; j++) {
                            let name = result[j].text();
                            if (name.includes(data.bname)) {
                                log("准备进入");
                                result[j].parent().parent().parent().click();

                                // 保证进去 没结束
                                log("进入视频");

                                log("等待" + 1 + "分后接收指令");
                                sleep(1 * 1000);
                                log("时间到");


                                // socket
                                let socketThread = threads.start(() => {
                                    while (true) {
                                        createWebSocket();
                                        // 首次连接并发送消息
                                        if (ws.send("{'type':'1','token':'ok'}")) {
                                            // 监听socket
                                            log(2)
                                            // ks
                                            receiveText(2);
                                            break;
                                        }
                                    }
                                    setInterval(() => {

                                    }, 1000);
                                })

                                // 指令超时
                                let instructionThread = threads.start(function () {

                                    while (true) {
                                        sleep(1000)
                                        // 防止socket事件运行，时间也在计算
                                        if (isWaitSocket) {
                                            waitSocketTimeTemp++; // socket 超时设置
                                        }


                                        log("指定超时：当前：" + waitSocketTimeTemp + "秒")
                                        if (waitSocketTimeTemp >= waitSocketTime && isWaitSocket) {
                                            waitSocketTimeTemp = 0;
                                            isWaitSocket = false;
                                            let waitTime = random(30, 180);
                                            log("暂无socket指令，" + waitTime + "s后自动执行")
                                            sleep(waitTime * 1000);

                                            // 默认操作
                                            // 文本框
                                            className("android.widget.RelativeLayout").clickable(true).idContains("cz8").visibleToUser(true).findOne().click();
                                            sleep(2000);
                                            className("android.widget.EditText").clickable(true).idContains("ehn").visibleToUser(true).findOne().setText(data.content);
                                            textContains(data.content).waitFor();
                                            sleep(1000);
                                            className("android.widget.TextView").clickable(true).idContains("eli").textContains("评论").findOne().click();
                                            log("发布完成");
                                            log("socket【默认】指令执行成功");

                                            // 输入内容
                                            toastLog("等待5秒后开始重新获取指令");
                                            sleep(5 * 1000);
                                            isWaitSocket = true;
                                        }
                                    }
                                })


                                // 关注
                                className("android.widget.ImageView").clickable(true).idContains("emh").visibleToUser(true).findOne().click();
                                let focus = className("android.widget.FrameLayout").clickable(true).idContains("d2c").findOne();
                                if (focus.childCount() > 0 && focus.child(0).className().toString().includes("ext")) {
                                    log("关注成功");
                                    focus.click();
                                } else {
                                    log("已关注");
                                }
                                // 返回主界面
                                sleep(3000);
                                className("android.widget.LinearLayout").clickable(true).idContains("xq").visibleToUser(true).click();
                                className("android.widget.FrameLayout").clickable(true).idContains("d2c").waitFor();

                                // 上传状态
                                let i = 0;
                                // 必须在主线程运行
                                while (true) {
                                    sleep(1000);
                                    i++

                                    log("当前：" + i + "秒\n总：" + waitTime + "秒")
                                    if (i >= waitTime) {
                                        // 关闭两个线程
                                        socketThread.interrupt();
                                        instructionThread.interrupt();
                                        log("关闭线程");
                                        // 关闭socket链接
                                        ws.close(1000, null);
                                        break;
                                    } else if (idContains("ipm").textContains("已结束").exists()) {
                                        // 等待过程中结束了，直接返回  1 ：完成
                                        className("android.widget.ImageView").clickable(true).idContains("xx").findOne().click();
                                        log("已结束：默认任务完成");
                                        sleep(2000);
                                        return 1;
                                    } else if (i % reportTime == 0) {
                                        toastLog("上传状态中：必须保证在主界面！");
                                        try {
                                            // 防止受网络速度影响
                                            threads.start(function () {
                                                reportStatus(data.id, id("user_name").textContains(data.bname).findOne().text());
                                            })
                                        } catch (e) {
                                            // 请求中关闭线程
                                        }

                                    }

                                }
                                log("执行完毕");
                                // 返回主界面
                                while (true) {
                                    if (className("android.widget.RelativeLayout").idContains("end").visibleToUser(true).exists()) {
                                        className("android.widget.RelativeLayout").idContains("end").visibleToUser(true).findOne().click()
                                        break;
                                    } else if (className("android.widget.EditText").clickable(true).idContains("ehn").visibleToUser(true).exists()) {
                                        // 此时正在 无 后退界面
                                        back();
                                        sleep(1000);
                                        back();
                                        sleep(1000);
                                        continue;
                                    } else {
                                        log("未知界面，请返回主界面");
                                    }
                                    sleep(1000);
                                }
                                log("执行完毕");
                                sleep(2000);
                                flag = true;
                                break;
                            }
                        }
                    } catch (e) {
                        log(e)
                    }

                }
                // 寻找目标
                if (!idContains("awv").findOne(5000).scrollUp() || flag) {
                    className("android.widget.LinearLayout").clickable(true).idContains("eh").findOne().click();
                    className("android.widget.LinearLayout").idContains("dtf").waitFor();
                    break;
                }
                sleep(3000);
            }
            // 未找到：失败
            if (!flag) {
                return -1;
            } else {
                return 1;
            }

        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    this.kuaishouVideo = function (data) {
        if (data.bname != undefined && data.bname.trim() != "") {
            try {
                setClip(data.address)
            } catch (e) {
                consnole.error("复制失败");
                return -1;
            }

            home();
            sleep(2000);
            toastLog("打开APP");
            app.startActivity({
                "packageName": "com.smile.gifmaker",
                "className": "com.yxcorp.gifshow.HomeActivity"
            })
            // 等待进入界面 
            waitForPackage2("com.smile.gifmaker");

            toastLog("进入APP");
            let time = 0;
            // https://v.kuaishou.com/S1iKSh 和爸妈旅游主打的就是一个憋屈 "家庭搞笑 "内容过于真实 "迷惑行为大赏 该作品在快手被播放过212.9万次，点击链接，打开【快手极速版】直接观看！
            // 10s 无口令,则失败
            while (true) {
                // 等待弹窗的出现; 超过10秒 失败 
                if (className("android.widget.Button").idContains("action").exists()) {
                    time = 0;
                    className("android.widget.Button").idContains("action").findOne().click();
                    log("进入页面")
                    // 进入页面
                    id("user_name_text_view").textContains(data.bname).waitFor();

                    // like
                    let like = className("android.widget.FrameLayout").clickable(true).id("like_button").findOne();
                    log("等待" + data.second + "s");
                    sleep(data.second.toString().trim() * 1000);
                    // 未选中
                    if (!like.selected()) {
                        log("喜欢成功");
                        like.click();
                    } else {
                        log("已喜欢");
                    }

                    sleep(2000);
                    // focuseOn 
                    let isAttention = 0;
                    let focus = className("android.view.ViewGroup").id("follow_button").visibleToUser(true).findOne();
                    // 未关注
                    if (focus.childCount() > 0 && focus.child(0).id().toString().includes("slide_play_right")) {
                        focus.click();
                        isAttention = 1;
                        log("关注成功");
                    } else {
                        log("已经关注");
                    }

                    sleep(2000);
                    // comment
                    if (data.content != undefined && data.content.toString().trim() != "") {
                        className("android.widget.FrameLayout").clickable(true).id("comment_button").visibleToUser(true).findOne().click();
                        className("android.widget.TextView").clickable(true).id("editor_holder_text").findOne().click();
                        className("android.widget.EditText").id("editor").findOne().setText(data.content);
                        className("android.widget.Button").desc("发送").id("finish_button").visibleToUser(true).findOne().click();
                        log("发布成功")
                    }
                    return isAttention;
                } else {
                    if (time == 10) {
                        console.error("地址加载超时:结束");
                        return -1;
                    }
                    time++;
                    sleep(1000);
                }
            }
        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    this.kuaishouLive = function (data) {
        // 停留时间
        let waitTime = Number(data.second);
        if (waitTime == undefined || waitTime == 0) {
            waitTime = 10;
        }
        if (data.bname != undefined && data.bname.trim() != "") {
            try {
                setClip(data.address)
            } catch (e) {
                consnole.error("复制失败");
                return -1;
            }
            home();
            sleep(2000);

            app.startActivity({
                "packageName": "com.smile.gifmaker",
                "className": "com.yxcorp.gifshow.HomeActivity"
            })
            // 等待进入界面 
            waitForPackage2("com.smile.gifmaker");
            toastLog("进入APP");
            let time = 0;
            // 进入页面
            while (true) {
                // 等待弹窗的出现; 超过10秒 失败 
                if (idContains("action").textContains("进").exists()) {
                    time = 0;
                    idContains("action").textContains("进").findOne().click();
                    data.bname = data.bname.toString().substring(0, 2);
                    // 进入页面：名字显示不全
                    idContains("live_name").textContains(data.bname).waitFor();
                    log("进入页面");

                    log("等待" + 1 + "分后接收指令");
                    sleep(1 * 1000);
                    log("时间到")
                    // 关注
                    while (true) {
                        let focus = idContains("follow_text_container").findOnce();
                        if (focus != null && focus.childCount() > 0) {
                            if (focus.child(0).className().toString().includes("extView")) {
                                focus.child(0).click();
                                log("关注成功");
                                sleep(2000);
                            } else {
                                log("已关注");
                            }
                            break;
                        }
                    }
                    break;
                } else {
                    if (time == 10) {
                        console.error("地址加载超时:结束");

                        return -1;
                    }
                    time++;
                    sleep(1000);
                }
            }

            // socket
            let socketThread = threads.start(() => {
                while (true) {
                    createWebSocket();
                    // 首次连接并发送消息
                    if (ws.send("{'type':'1','token':'ok'}")) {
                        // 监听socket
                        log(1)
                        // ks
                        receiveText(1);
                        break;
                    }
                }
                setInterval(() => {

                }, 1000);
            })

            // 指令超时
            let instructionThread = threads.start(function () {

                while (true) {
                    sleep(1000)
                    // 防止socket事件运行，时间也在计算
                    if (isWaitSocket) {
                        waitSocketTimeTemp++; // socket 超时设置
                    }


                    log("指定超时：当前：" + waitSocketTimeTemp + "秒")
                    if (waitSocketTimeTemp >= waitSocketTime && isWaitSocket) {
                        waitSocketTimeTemp = 0;
                        isWaitSocket = false;
                        let waitTime = random(30, 180);
                        log("暂无socket指令，" + waitTime + "s后自动执行")
                        sleep(waitTime * 1000);

                        // 默认操作
                        clickable(true).idContains("comment_text").findOne().click();
                        sleep(2000);
                        className("android.widget.EditText").idContains("editor").findOne().setText("666");
                        textContains("666").waitFor();
                        sleep(500);
                        idContains("finish_button").clickable().findOne().click();
                        log("socket【默认】指令执行成功");

                        // 输入内容
                        toastLog("等待5秒后开始重新获取指令");
                        sleep(5 * 1000);
                        isWaitSocket = true;
                    }
                }
            })

            // 上传状态
            let i = 0;
            // 必须在主线程运行
            while (true) {
                sleep(1000);
                i++

                log("当前：" + i + "秒\n总：" + waitTime + "秒")
                if (i >= waitTime) {
                    // 关闭两个线程
                    socketThread.interrupt();
                    instructionThread.interrupt();
                    // 关闭socket链接

                    ws.close(1000, null);
                    break;
                } else if (i % reportTime == 0) {
                    toastLog("上传状态中：必须保证在主界面！");
                    try {
                        // 防止受网络速度影响
                        threads.start(function () {
                            reportStatus(data.id, id("user_name").textContains(data.bname).findOne().text());
                        })
                    } catch (e) {
                        // 请求中关闭线程
                    }

                }

            }
        } else {
            console.error(data.bname + "格式错误:结束");
            return -1;
        }
    };

    function createWebSocket() {
        ws = $web.newWebSocket("ws://8.134.65.179:2501", {
            eventThread: 'this'
        });
        ws.on("open", (res, ws) => {
            console.info("WebSocket已打开");
        }).on("failure", (err, res, ws) => {
            log("WebSocket连接失败或中断");
            console.error(err);
        }).on("closing", (code, reason, ws) => {
            log("WebSocket关闭中");
        }).on("closed", (code, reason, ws) => {
            log("WebSocket已关闭: code = %d, reason = %s", code, reason);
        });
        return true;
    }


    // 上传状态
    function reportStatus(taskId, name) {
        let result = http.post("http://huzhu.vxwl.net/api/admin/liveReport", {
            "taskid": taskId,
            "bname": "name"
        }, {
            "headers": {
                "token": token
            }
        }).body.json();
        // log(result);
        if (result.code) {
            log("上传成功");
            return 1;
        } else {
            toastLog(result.msg);
            return -1;
        }
    }


    /**
     * socekt 监听消息
     * @param {*} flag 0 : dy 1 : ks 2: WC
     * @returns 
     */
    function receiveText(flag) {
        ws.on("text", (text, ws) => {
            if (isWaitSocket) {
                // 收到指令，超时归0
                waitSocketTimeTemp = 0;
                // 等待时间 -1 禁止其他线程运行
                isWaitSocket = false;
                let result = JSON.parse(text);
                if (result.type.toString().includes("msg")) {
                    log("socket收到消息：" + result.msg);
                    if (flag == 0) {
                        // dy
                        // 打开文本框
                        className("android.widget.TextView").clickable(true).id("ep8").findOne().click();
                    } else if (flag == 1) {
                        //ks
                        // 打开文本框
                        clickable(true).idContains("comment_text").findOne().click();
                        sleep(2000);
                        className("android.widget.EditText").idContains("editor").findOne().setText(result.msg);
                        textContains(result.msg).waitFor();
                        sleep(500);
                        idContains("finish_button").clickable().findOne().click();
                    } else {
                        // wc
                        // 文本框
                        className("android.widget.RelativeLayout").clickable(true).idContains("cz8").visibleToUser(true).findOne().click();
                        sleep(2000);
                        className("android.widget.EditText").clickable(true).idContains("ehn").visibleToUser(true).findOne().setText(result.msg);
                        textContains(result.msg).waitFor();
                        sleep(1000);
                        className("android.widget.TextView").clickable(true).idContains("eli").textContains("评论").findOne().click();
                    }
                    log("socket指令执行成功");
                } else if (result.type.toString().includes("click")) {
                    log("点赞");
                    if (flag == 0) {
                        // dy
                        // like
                        let like = descContains("喜欢").id("dyw").findOne();
                        log("等待" + data.second + "s");
                        sleep(data.second.toString().trim() * 1000);
                        // 未选中
                        if (like.desc().includes("未")) {
                            log("喜欢成功");
                            like.click();
                        } else {
                            log("已喜欢");
                        }
                    } else {
                        //ks
                    }
                } else {
                    log(result)
                }
                // 等待时间 0 恢复其他线程运行
                isWaitSocket = true;
            } else {
                log("socket指令与当前状态冲突");
            }

        });
        return 1;
    }

    function waitForPackage2(packageName) {
        //　使用xp模块调试的 不用该方法 waitForPackage("com.smile.gifmaker");
        // 通用方法
        while (!classNameContains("").findOne().packageName().includes(packageName)) {
        }
    }

    return this;
})();