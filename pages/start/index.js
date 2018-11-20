import PageModule from "../../lib/Page.js";
import Storage from "../../lib/storage.js";

const $app = getApp().expample;
const $db_user = new Storage("db_user");

const $page = new PageModule({

  onLoad(){
  },

  //获取用户信息
  getUserInfo(e){

    const userInfo = e.detail.userInfo;

    //将用户信息保存到全局
    $app.data({userInfo});

    //将用户信息保存到本地
    const where = $db_user.where("time", "!=", "")
    if (where.find()){
      
      where.updata(userInfo);
    }else{

      $db_user.add(Object.assign({
        time : new Date().getTime()
      }, userInfo));
    }

    wx.redirectTo({
      url: '/pages/home/index',
    })

  }
});

$page.start();