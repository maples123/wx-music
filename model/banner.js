//banner图事件
import AudioManager from "../lib/AudioManager.js";

export default class Banner{
  constructor(page){
    Reflect.set(page, "actionBanner", Banner.actionBanner)

  }
  static actionBanner(event){
    
    const action = event.currentTarget.dataset.action;

    //歌曲播放
    if (action.aType === 0) {

      AudioManager.setSong(action.data,[])
    }
    //华语歌单
    if (action.aType === 1){

      wx.navigateTo({
        url: '/pages/sheet/list?id=' + action.data.id + "&name=" + action.data.name,
      })
    }
    //韩语歌单
    if (action.aType === 2) {

      wx.navigateTo({
        url: '/pages/sheet/list?id=' + action.data.id + "&name=" + action.data.name,
      })
    }
  
  }

  //获取banner图信息
  getBanner(){

    const data = [];

    data.push({
      img: "http://p1.music.126.net/eutlOcSlh-dtpWq328R6bQ==/109951163615791721.jpg",
      aType : 0,
      data: {
        song_url:"http://ws.stream.qqmusic.qq.com/C100004DXFlC0nsTCZ.m4a?fromtag=0&guid=0",
        song_mid:"004DXFlC0nsTCZ",
        song_name:"年少有为",
        song_orig:"李荣浩",
        album_min:"https://y.gtimg.cn/music/photo_new/T002R90x90M000004QnEHc3zjC7J.jpg",
        album_big:"https://y.gtimg.cn/music/photo_new/T002R300x300M000004QnEHc3zjC7J.jpg",
        album_mid: "004QnEHc3zjC7J",
        album_name:"耳朵"
      }
    })

    data.push({
      img: "http://p2.music.126.net/_8MlO2wcjPHhPRZnT-Ixxw==/109951163663208880.jpg?param=140y140",
      aType: 1,
      data : {
        id: 5,
        name : "华语爆款新歌"
      }
    })

    data.push({
      img: "http://p1.music.126.net/RskCHTsAbWnwPUNYBpqysg==/109951163663185330.jpg",
      aType: 2,
      data: {
        id: 16,
        name: "韩国精选"
      }
    })

    return new Promise((reslove)=>{
      
      reslove(data);
    })
  }
}