import PageModule from "../../lib/Page.js";
import $pagemusic from "../../model/PageMusic.js";
import AudioManager from "../../lib/AudioManager.js";
import {request} from "../../commen/const.js";
import LikeSong from "../../model/LikeSong.js";

//全局的北京音频
const audio = AudioManager.audio;

const $db_like = new LikeSong();

const $page = new PageModule({


  onLoad(o){
    //初始数据
    this.setData({
      multiple: 8,
      duration: 150,
      current: 0,
      currentIndex: 0
    })
    //设置页面标题
    wx.setNavigationBarTitle({
      title: o.name || "",
    })

    
    //添加收藏歌曲状态
    this.setData({
      like: $db_like.has(o.id)
    })

    this.getLyric(o.id)
  },

  //请求歌词数据
  getLyric(mid){

    const url = request.lyrics + mid;
    new Promise((reslove,reject) => {
      //请求歌词
      wx.request({
        url,
        success : reslove,
        fail : reject
      })
    }).then(res => {
      
      const lyrics = res.data.lyric;

      if (lyrics.length === 1){

        this.setData({ multiple:1})
      }else{
        this.setData({ multiple: 8 })
      }
      
      this.setData({lyrics})

    }).catch(err => {
      console.log(err);
    })
  },

  //进度条事件
  setSeek(e){

    const time = e.detail.value;

    AudioManager.tirgger("seek",this,time);
  },

  //进度条更新事件
  onTimeUpdate(){
    
    //判断歌词是否存在
    if (!this.data.lyrics || !this.data.lyrics.length){

      return false;
    }
    //当前音频播放的位置
    const currentTime = ~~(audio.currentTime * 1000);
    let currentIndex = this.data.lyrics.findIndex(item => item.millisecond > currentTime);

    //判断当前音频播放事件是否 >= 最后一句歌词的时间
    if (currentTime >= this.data.lyrics[this.data.lyrics.length - 1].millisecond){

      currentIndex = this.data.lyrics.length - 1;
    }else{
      --currentIndex;
    }

    //判断是否小于零
    currentIndex = Math.max(0, currentIndex);
    //让当前播放的的歌词处于屏幕中间
    let current = Math.max(0, currentIndex - ~~(this.data.multiple/2))
    //当歌词到底是不在滚动
    current = Math.min(current, (this.data.lyrics.length - this.data.multiple))

    this.setData({current,currentIndex})
  },

  //歌曲链接错误
  onError(){

    wx.showToast({
      title: '该歌曲暂时无法不放，请切换下一首',
      icon : "none"
    })
  },

  //切换歌时重新获取歌词
  onCanplay(){

    wx.setNavigationBarTitle({
      title: this.data.thatSong.album_name,
    })

    //切换歌曲时不改变歌曲收藏状态
    this.setData({
      like: $db_like.has(this.data.thatSong.song_mid)
    })

    this.getLyric(this.data.thatSong.song_mid);
  }
});

$page.extend($pagemusic);
$page.start();