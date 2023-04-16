let task = {};
const executeTask = require("./executeTask");
// token 为父模块全局变量

task.main = function () {
    threads.start(function () {
        // 获取任务类型;
        let taskType = getTaskType();
    });
}
// task.main();

// 获取任务类型;
function getTaskType() {
    log("[" + token + "]")
    http.post("http://huzhu.vxwl.net/api/admin/list", {
    }, {
        "headers": {
            "token":token.toString().trim()
        }
    }, (res, err) => {
        if (err) {
            console.error(err);
            return;
        }

        if (res.body.json().code == -99) {
            toastLog("账户登陆过期，请关闭APP后，重新登陆。");
            threads.shutDownAll();
        } else {
            toastLog(res.body.json().msg);
            if (res.body.json().data.length > 0) {
                ui.run(function () {
                    if (ui.findView("functionMenu")) {
                        $ui.menu.removeAllViews();
                    }

                    // 更新菜单
                    ui.inflate(
                        <relative id="functionMenu">
                        {/* <text marginTop="10" gravity="center" textSize="18sp" textColor="red" text="请在24小时之内删除！仅用于学习测试。" />
                        <text marginTop="10" gravity="center" textSize="18sp" textColor="red" text="若使用者触犯法律，后果其本人自负。" />
                        <button textStyle="bold" color="blue" style="Widget.AppCompat.Button.Borderless.Colored" layout_gravity='center' id="autoSev" w="auto" text="前往无障碍服务设置" /> */}
                    </relative>, ui.menu, true);
                    getMenuXml(res.body.json().data);
                })

                return 1;
            } else {
                toatLog("不存在");
            }
        }
    })
}


/**
 * 添加菜单:并增加监听事件.
 *  // code: 1,
        // msg: 'sucess',
        // time: '1681433510',
        // data: 
        //  [ { id: 2,
        //      type: 'douLive',
        //      name: '',
        //      image: 'http://huzhu.vxwl.net/uploads/20230413/5ad0b0835ed1c47227839717a87f25ab.png',
        //      min: 20 },
 * @param {*} data ：json 数据
 */
function getMenuXml(data) {
    ui.imageCache.clearDiskCache();
    ui.imageCache.clearMemory();
    let tempId = null;

        // data[3] = {}
        // data[3].type = "douLive" + 3;
        // data[3].name = "name3";
        // data[3].image = "http://huzhu.vxwl.net/uploads/20230413/5ad0b0835ed1c47227839717a87f25ab.png"

        // data[4] = {}
        // data[4].type = "douLive" + 4;
        // data[4].name = "name3";
        // data[4].image = "http://huzhu.vxwl.net/uploads/20230413/5ad0b0835ed1c47227839717a87f25ab.png"


    let textId = null
    for(let i = 0; i < data.length; i++) {
        if(i % 3 == 0 ) {
            ui.inflate(
                <horizontal id= {data[i].type} layout_below={data[i / 3].type}>
                    <vertical layout_gravity = "center" >
                    <text id = {data[i].type + "0"} textColor="red" textSize="13dp" textStyle="bold" text={data[i].name} />
                        <frame marginLeft="5dp" h="50dp" w="100dp">
                            <img src={data[i].image} borderWidth="1" borderColor="blue" scaleType="fitStart"></img>
                        </frame>
                    </vertical>
                </horizontal>
            ,ui.functionMenu, true);
        } else {
            ui.inflate(
                <horizontal id= {data[i].type} layout_toRightOf={tempId} layout_alignTop={tempId}>
                    <vertical gravity = "center" >
                    <text id = {data[i].type + "0"} textColor="red" textSize="13dp" textStyle="bold" text={data[i].name} />
                    <frame  marginLeft="5dp" h="50dp" w="100dp">
                        <img src={data[i].image} borderWidth="1" borderColor="blue" scaleType="fitStart"></img>
                    </frame>
                    </vertical>
                </horizontal>
            ,ui.functionMenu, true);
        }

        tempId = data[i].type;
        let name = data[i].name;
        ui[data[i].type].click(function (e) {
            let id = e.attr("id").toString();
            id = id.substring(5, id.length);
            let view = ui[id + "0"];

            // 全自动，单独写方法，再传个1
            executeTask.main(id);
            // 改变按钮状态
            // if (!view.getText().includes("停止运行")) {
            //     toastLog("开始运行：" +  view.getText());
            //     view.setText("停止运行");
            //     // ui.re.click("测试");
            //     // 执行任务

            // } else {
            //     toastLog("取消运行：" +  name);
            //     ui.re.setText("启动脚本");
            //     view.setText(name);
            //     threads.shutDownAll();
            //     device.cancelKeepingAwake();
            // }
        })
    }
    // 全自动
    ui.re.click(() => {
        toastLog("我是全自动");
        executeTask.main(id, 1);
    })
    return 1;
}

module.exports = task;