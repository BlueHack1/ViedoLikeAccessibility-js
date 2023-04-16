'ui'; // "ui" 需要在首行且前面没有任何字符
let appName = "13"
let agreement = storages.create(appName + "_Agreement");
if (true) {
    if (!agreement.get(appName, false)) {
        let diacontent = "欢迎使用" + appName + "软件，使用之前请认真阅读以下协议，旦使用本软件默认遵守以下协议。\n"
            + "1.使用本软件涉及到互联网服务，可能会受到各个环节不稳定因素的影响，存在因不可抗力、计算机病毒、黑客攻击、系统不稳定、非法内容信息、骚扰信息屏蔽以及其他任何网络、技术、通信线路、信息安全管理措施等原因造成的用户的经济损失，本人及合作单位不承担任何责任。\n"
            + "2.使用本软件由用户自己承担风险，本人及合作单位对本软件不作任何类型的担保，不论是明示的、默示的或法令的保证和条件，包括但不限于本软件的适销性、适用性、无疏忽或无技术瑕疵问题、所有权和无侵权的明示或默示担保和条件，对在任何情况下因使用或不能使用本“软件”所产生的直接、间接、偶然、特殊及后续的损害及风险，本人及合作单位不承担任何责任。3.不得利用本软件及服务制作、复制、发布、传播侵犯其他用户或第三方合法权益的内容，包括但不限于: 发布、传送、传播、储存违反国家法律法规禁止的内容。\n"
            + "您已经同意不在本产品从事下列行为：\n"
            + "1.未授权的情况下，收集其他用户的信息或数据，例如电子邮箱地址等；\n"
            + "2.用自动化的方式恶意使用本产品，给服务器造成过度的负担或以其他方式干扰或损害网站服务器和网络链接；\n"
            + "3.在未授权的情况下，尝试访问本产品的服务器数据或通信数据；\n"
            + "4.干扰、破坏本产品其他用户的使用。\n"
            + "5.利用本软件漏洞从事非法商业用途，并广泛传播该非法途径。\n"
            + "修改：\n"
            + "本协议容许变更。如果本协议有任何实质性变更，我们将通过电子邮件来通知您。变更通知之后，继续使用本产品则为您已知晓此类变更并同意条款约束；\n"
            + "我们保留在任何时候无需通知而修改、保留或关闭本产品任何服务之权利；\n"
            + "您已同意我们无需因修改、保留或关闭本产品任何服务之权利；\n"
            + "您已同意我们无需因修改、保留或关闭本产品任何服务的行为对您或第三方承担责任。\n"
            + "终止：\n"
            + "本协议自您接受之日起生效，在您使用本产品的过程中持续有效，直至依据本协议终止。【确定则同意望知悉】"

        dialogs.build({
            title: "用户协议",
            content: diacontent,
            positive: "同意",
            negative: "不同意",
        }).on("positive", () => {
            agreement.put(appName, "true");
            toastLog("你已同意用户协议：请遵守");
        }).on("negative", () => {
            threads.shutDownAll();
            exit();
        }).show();
    } else {
        toastLog("你已同意用户协议：请遵守");
    }
}

let color = "#4169E1";
let cardColor = "#67b2ca";
let inputTextBg = "#B0C4DE";
let inputTextColor = "#493753";
let cardBackgroundColor = "#F5FFFA";
let inputBackgroundColor = "#F5FFFA";
let textSize = "15dp";
// 状态栏
ui.statusBarColor("#4169E1");
ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar bg="{{color}}">
                <toolbar id="toolbar" title="你已同意软件使用协议，请遵守" />
                <tabs id="tabs" backgroundColor="{{this.color}}" textStyle="bold" textColor="#493753" tabBackground="{{inputTextColor}}" tabIndicatorColor="{{inputTextColor}}" />
            </appbar>
            <linear>

            </linear>
            <viewpager id="viewpager" >
                <frame>
                    <vertical id="instruction">
                        <card margin="20 5" h='auto' w='*' cardBackgroundColor="{{this.cardBackgroundColor}}" >
                            <vertical>
                                <text text="登陆设置" padding="5dp" textSize="16sp" gravity="center" bg="{{color}}" textColor="white" />

                                <horizontal>
                                    <!--<text margin="2dp" gravity="center" textColor="#FFA500" textStyle="bold" text="【给脚本ROOT权限以及截图权限！！】" />-->
                                    <text text="账号：" textStyle="bold" marginLeft="5dp" typeface="monospace" textSize="{{this.textSize}}" textColor="{{inputTextColor}}" />
                                    <input id="username" hint="" text="" textStyle="bold" gravity='center' marginRight="5dp" textSize="{{this.textSize}}" layout_height="wrap_content" typeface="monospace" h='auto' w='*' />
                                </horizontal>


                                <horizontal>
                                    <text text="密码：" textStyle="bold" marginLeft="5dp" typeface="monospace" textSize="{{this.textSize}}" textColor="{{inputTextColor}}" />
                                    <input id="password" password="true" hint="" text="" textStyle="bold" gravity='center' marginRight="5dp" textSize="{{this.textSize}}" splayout_height="wrap_content" typeface="monospace" h='auto' w='*' />
                                </horizontal>

                                <horizontal>
                                    <text text="设备：" textStyle="bold" marginLeft="5dp" typeface="monospace" textSize="{{this.textSize}}" textColor="{{inputTextColor}}" />
                                    <input id="deviceId" hint="" text="" textStyle="bold" gravity='center' marginRight="5dp" textSize="{{this.textSize}}" splayout_height="wrap_content" typeface="monospace" h='auto' w='*' />
                                </horizontal>
                                <button textStyle="bold" radius="100" layout_gravity='center' padding="5dp" id="loginButton" w="*" style="Widget.AppCompat.Button.Colored" text="登陆" />
                                {/* <button textStyle="bold" radius="100" layout_gravity='center' padding="5dp" id="registButton" w="*" style="Widget.AppCompat.Button.Colored" text="注册" /> */}
                            </vertical>
                        </card>
                    </vertical>
                </frame>
                <frame>
                <ScrollView>
                    <vertical id="main1">
                        <!--页面2-->
                        <card h='auto' w='*' margin="15dp 5dp" cardBackgroundColor="{{cardBackgroundColor}}" padding="5dp" >
                            <vertical>
                                <frame id="menu">

                                </frame>
                                <text marginTop = "5" gravity = "center" text="只可点击一次！！点击多次会乱。"/>
                                <horizontal gravity="center">
                                    <card h='auto' margin="10sp" cardBackgroundColor="{{cardBackgroundColor}}" cardCornerRadius="15dp" cardElevation="15dp" padding="5dp">
                                        <button textStyle="bold" radius="100" layout_gravity='left' padding="5dp" id="re" w="auto" style="Widget.AppCompat.Button.Borderless" text="启动脚本" />
                                    </card>
                                    <card h='auto' margin="10dp" cardBackgroundColor="{{cardBackgroundColor}}" cardCornerRadius="15dp" cardElevation="15dp" padding="5dp">
                                        <button textStyle="bold" layout_gravity='center' id="data" w="auto" style="Widget.AppCompat.Button.Borderless" text="脚本日志" />
                                    </card>
                                    <card h='auto' margin="10dp" cardBackgroundColor="{{cardBackgroundColor}}" cardCornerRadius="15dp" cardElevation="15dp" padding="5dp">
                                        <button textStyle="bold" layout_gravity='right' id="exitApp" w="auto" style="Widget.AppCompat.Button.Borderless" text="退出脚本" />
                                    </card>
                                </horizontal>
                            </vertical>
                        </card>
                        {/* <card h='auto' w='*' margin="15dp 5dp" cardBackgroundColor="{{cardBackgroundColor}}" padding="5dp">
                            <vertical>
                                <text padding="5dp" textSize="16sp" gravity="center" bg="{{color}}" textColor="white" text="运行日志" />
                                <console id="console" w="*" h="*" />
                            </vertical >

                        </card> */}
                    </vertical>
                    </ScrollView>
                </frame>

                <frame>
                    <vertical>
                        <!--页面3-->
                        <ScrollView>
                            <frame>
                                <vertical id="main1">
                                    <card margin="20 5" h='auto' w='*' cardBackgroundColor="{{this.cardBackgroundColor}}" >
                                        <vertical>
                                            <text text="基础设置" padding="5dp" textSize="16sp" gravity="center" bg="{{color}}" textColor="white" />
                                            <horizontal gravity="center">
                                                <Switch textStyle="bold" textColor="{{color}}" id="autoPermission" text="无障碍权限"></Switch>
                                                <Switch textStyle="bold" textColor="{{color}}" id="floatPermission" text="悬浮窗权限"></Switch>
                                            </horizontal>
                                            <text marginTop="20dp" marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="软件功能：" />
                                            <text marginLeft="5dp" text="模拟人工操作，解放双手，提高生产力" />
                                            <text marginTop="20dp" marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="运行环境" />
                                            <text marginLeft="5dp" text="无需root权限，仅支持安卓7.0版本以上" />
                                            <text marginTop="20dp" marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="特殊权限" />
                                            <text marginLeft="5dp" text="悬浮窗、无障碍、显示其他应用上层【安卓高版本】、读取IEMI权限" />
                                            <text marginTop="20dp" marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="当前版本：{{app.versionName}}" />
                                            <text marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="APP版本：{{getAppVersion()}}" />
                                            <text marginBottom="20dp" marginLeft="5dp" textStyle="bold" textColor="{{color}}" textSize="16dp" text="适配版本：22.1.0" />
                                            <button textStyle="bold" radius="100" layout_gravity='center' padding="5dp" id="getCompatible" w="*" style="Widget.AppCompat.Button.Colored" text="获取适配版本【自行搜索】" />
                                            <button textStyle="bold" radius="100" layout_gravity='center' padding="5dp" id="checkVersion" w="*" style="Widget.AppCompat.Button.Colored" text="更新最新版本" />
                                        </vertical>

                                    </card>
                                    <text margin="5dp" gravity="center" textStyle="bold" text="声明：请勿将本脚本用于非法用途与商业用途，并进行传播。仅用于学习交流与测试。" />
                                </vertical>
                            </frame>
                        </ScrollView>

                    </vertical>
                </frame>
            </viewpager>
        </vertical>
    

    </drawer>
);

function getAppVersion() {
    let pkgs = context.getPackageManager().getInstalledPackages(0).toArray();
    for (let i in pkgs) {
        if (pkgs[i].packageName.toString().includes("ugc."))
            return pkgs[i].versionName;
    }
}




ui.exitApp.click(function () {
    confirm("彻底关闭脚本", "确定后会彻底关闭脚本。下次启动会出现无障碍识别问题").then(value => {
        if (value == true) {
            var nowPid = android.os.Process.myPid();
            var am = context.getSystemService(java.lang.Class.forName("android.app.ActivityManager"));
            var list = am.getRunningAppProcesses();
            for (var i = 0; i < list.size(); i++) {
                var info = list.get(i);
                if (info.pid != nowPid) {
                    kill(info.pid);
                }
            }
            kill(nowPid);
        }

        function kill(pid) {
            android.os.Process.killProcess(pid);
        }
    });
});

ui.data.click(function () {
    app.startActivity('console');
});



if (!auto.service) {
    confirm("检测到没有开启无障碍模式，是否前往").then(value => {
        //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
        if (value == true) auto();
    });
}



let isPause = false;
var win = null;
// 悬浮窗
function openFloaty() {
    let floatThread = threads.start(function () {
        win = floaty.window(
            <vertical>
                <card id="floatCard" margin="20 5" alpha="0.8" h='auto' w='auto' cardBackgroundColor="white" cardCornerRadius="15dp">
                    <frame gravity="center">
                        <vertical w="auto" h="auto" >
                            <horizontal>
                                {/* <button textSize = "10sp" layout_width = "45dp" layout_height = "40dp" id="console1" text="开" textStyle = "bold" style="Widget.AppCompat.Button.Borderless" visibility="visible" /> */}
                                <button textSize = "10dp" layout_width = "50dp" layout_height = "40dp" textColor = "{{color}}" id="console1" text="暂停" textStyle = "bold" style="Widget.AppCompat.Button.Borderless" visibility="visible" />
                                <button textSize = "10dp" layout_width = "50dp" layout_height = "40dp" textColor = "{{color}}" id="console2" text="停止" textStyle = "bold" style="Widget.AppCompat.Button.Borderless" visibility="visible" />
                            </horizontal>
                            <console id="console" marginLeft = "5dp" marginRight = "5" w="{{50 * 2}}dp" h="50dp" />
                        </vertical>
                    </frame>
                </card>
            </vertical>
        );

        win.console.setConsole(runtime.console);

            // 自定义日志颜色
        win.console.setColor("V", "#bdbdbd");
        win.console.setColor("D", "#673ab7");
        win.console.setColor("I", "#1de9b6");
        win.console.setColor("W", "#673ab7");
        win.console.setColor("E", "#b71c1c");
        // 自定义日志字体大小，单位sp
        win.console.setTextSize(10);
        // 前台服务
        $settings.setEnabled('foreground_service', true);
        console.info("前台服务已启动【保后台】")
        $settings.setEnabled('stop_all_on_volume_up', true);
        console.info("音量上键按下停止脚本");
        $settings.setEnabled('enable_accessibility_service_by_root', true);
        console.info("使用Root权限启用无障碍服务");
        // 隐藏输入框
        ui.run(()=> {
            win.console.setInputEnabled(false);
            win.setPosition(50,device.height / 2)
        })






        // win.setSize(150, 150)
        win.floatCard.longClick(() => {
                    
        log(win.isAdjustEnabled())
                win.setAdjustEnabled(!win.isAdjustEnabled());
            return true;
        });

        win.console1.click(function () {
                // 如果暂停，则执行完当前任务后，不在执行
                if (win.console1.getText() == "暂停") {
                    isPause = true;
                    console.info("功能已暂停：执行当前操作后，暂停运行");
                    win.console1.setText("继续");

                } else {
                    isPause = false;
                    console.info("功能继续运行");
                    win.console1.setText("暂停");
                }
        });

        win.console2.click(function () {
                if (win.console2.getText() == "停止") {
                    console.info("功能已停止");
                    if (win.console1.getText() == "继续") {
                        isPause = false;
                        // 恢复暂停按钮显示
                        win.console1.setText("暂停");
                    }    
                    threads.shutDownAll();
                }
        });
    });
}

var threadTool = new java.util.HashMap();
let floatyFlag = 0;

// executeTask 内 获取菜单后，会写新的事件
// ui.re.click(function (e) {

//         operate();
// });

// 登陆按钮
let token = null;
ui.loginButton.click(() => {
    threads.start(() => {
        let username = ui.username.getText();
        let password = ui.password.getText();
        let deviceId = ui.deviceId.getText();
        // lianfeiqiang   654321  设备id:3
        http.post("http://huzhu.vxwl.net/api/admin/login", {
            "name": username,
            "passwd": password,
            "deviceID": deviceId
        }, {}, function (res, err) {
            if (err) {
                console.error(err);
                return;
            }
            saveValue();
            if(res.body.json().msg.toString().includes("suc")) { // success
                toastLog("登陆成功");
                // 防止运行中二次登陆，出现重复开启
                threads.shutDownAll();
                token = res.body.json().data.token;
                let task = require("./module/getTask.js");
                task.main();
                ui.run(() => {
                    ui.viewpager.setCurrentItem(1);
                    ui.re.setText("启动脚本");
                    ui.loginButton.setText("已登陆");
                    ui.re.enabled = true;
                })
            } else {
                token = null;
                ui.run(() => {
                    ui.viewpager.setCurrentItem(0);
                })
                toastLog(res.body.json().msg)
            }
              return false;
        });
    })

});

var storage = storages.create(appName + "_ConValue")

initUIConfig(1);
function initUIConfig(flag) {
   
    initValue();
    // 默认选项卡
    ui.viewpager.setCurrentItem(1);
    //设置滑动页面的标题
    ui.viewpager.setTitles(["登陆页", "功能页", "配置页"]);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);
    openFloaty()
}

function saveValue() {
    storage.put("username", ui.username.getText().toString());
    storage.put("password", ui.password.getText().toString());
    storage.put("deviceId", ui.deviceId.getText().toString());
    // storage.put("verifyID", ui.verifyID.getText().toString());
    // storage.put("password", ui.password.getText().toString());
    // storage.put("web", ui.web.getText().toString());
    // storage.put("verifyContinueFlag", ui.verifyContinueFlag.checked);
    // storage.put("first", ui.first.checked);
}

function initValue() {
    ui.re.setText("未登录");
    ui.re.enabled = false;
    ui.username.setText(storage.get("username", "").toString());
    ui.password.setText(storage.get("password", "").toString());
    ui.deviceId.setText(storage.get("deviceId", "").toString());

    // 自动登录
    if(storage.get("username", "") != null && storage.get("password", "")!= null && storage.get("deviceId", "").toString()) {
        toastLog("自动登陆中");
        ui.loginButton.click();
    }

    // ui.verifyID.setText(storage.get("verifyID", "").toString());
    // ui.password.setText(storage.get("password", "").toString());
    // ui.web.setText(storage.get("web", "https://wj.qq.com/s2/11472600/7b0f").toString());
    // if (storage.get("verifyContinueFlag", false)) {
    //     ui.verifyContinueFlag.setChecked(true);
    // } else {
    //     ui.verifyContinueFlag.setChecked(false);
    // }

    // if (storage.get("first", true)) {
    //     ui.first.setChecked(true);
    // } else {
    //     ui.second.setChecked(true);
    // }
    log("已加载配置");
}




// let timeId = setTimeout(() => {
//     threads.start(function () {
//         if (requestScreenCapture(false)) {
//             toastLog("截图权限已获取");
//             ui.run(() => {
//                 ui.re.setText("启动脚本");
//                 ui.re.enabled = true;
//             });
//         } else {
//             ui.run(() => {
//                 ui.re.setText("截图权限获取失败");
//             });
//             toastLog("截图权限未获取，重新打开脚本吧");
//         }
//         clearTimeout(timeId);
//     })
// }, 2000);

function operate() {
    saveValue();
    //   let text = ui.text.getText().toString().trim();
    let mainThread = threads.start(function () {
        toast("暂时没啥用")
        //     ui.run(() => {
        //       ui.re.click();
        //     });
    });
}