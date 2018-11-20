import PageModule from "../../lib/Page.js";
import Banner from "../../model/banner.js";
import { region, sheet, request } from "../../commen/const.js";
import $pagemusic from "../../model/PageMusic.js";

const $app = getApp().expample;

const $nameSpace = "home/index";

const $page = new PageModule({
  onLoad(){
    
    const banner = new Banner(this);
    banner.getBanner()
          .then((data) => {
            
            this.setData({banner:data})
          })

    this.setData({ region})

    const p=this.getSheet()
        .findNameSapce($nameSpace)
        .then(this.setSheet.bind(this))
   
  },
  //获取歌单信息
  getSheet(){

    const sheepPromise = [];
    sheet.forEach(item => {

      const p = new Promise((reslove) => {
        const url = request.topid + item.id;

        wx.request({
          url : url,
          success : reslove
        })
      })
      sheepPromise.push(p)
    })

    return {
      nameSpace: $nameSpace,
      data: Promise.all(sheepPromise)
    }
  },
  //设置歌单信息
  setSheet(arg){
    const dataSheet = [];

    arg.forEach((res,key) => {
      
      dataSheet.push(Object.assign({
        songs : res.data.songs
      },sheet[key]))
    })

    this.setData({ sheets : dataSheet})
  }
});
$page.extend($pagemusic)

$page.start();