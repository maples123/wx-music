import PageModule from "../../lib/Page.js";
import {request} from "../../commen/const.js";
import $pageList from "../../model/pageList.js";
import $pagemusic from "../../model/PageMusic.js";


const $page = new PageModule($pageList);

//继承PageMusic页面管理类
$page.extend($pagemusic)

$page.start({
  onLoad(sheet){
    //打包url
    this.data.url = request.topid + sheet.id;
    //数据请求
    this.loadPage();
    wx.setNavigationBarTitle({
      title: sheet.name
    })
  }
});