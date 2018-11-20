//全局数据配置接口
import AppModule from "./lib/App.js";
import { envStr} from "./commen/const.js";

const $app = new AppModule();

//初始化云函数
wx.cloud.init({ env:'demo-11b75e'})

const audio = wx.getBackgroundAudioManager();

$app.addEvent("onLaunch",function(){
 
})

// App({})
$app.start();