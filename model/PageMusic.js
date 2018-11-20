// 歌曲播放 页面代理

import PageModule from "../lib/Page.js";
import AudioManager from "../lib/AudioManager.js";

const audio = AudioManager.audio;

const $page = new PageModule({
  data : {
    posongshow : false
  },

  //显示 隐藏歌单
  showPsong(){
    this.setData({
      posongshow: !this.data.posongshow
    })
  },

  //删除歌单里的某个歌曲
  delThatpsong(e){
    
    const song = e.currentTarget.dataset.song,
          index = this.data.thatSongs.findIndex(item => item.song_name === song.song_name);

    this.data.thatSongs.splice(index,1);

    this.setData({
      thatSongs: this.data.thatSongs
    })
  },

  //播放和切换按钮
  musicTap(e){

    const method = e.target.dataset.method;

    //判断audio 事件类型是否存在
    Reflect.has(AudioManager, method) && Reflect.apply(AudioManager[method], this, [e]);
  },

  //播放音乐事件
  onPlayer(e) {

    const thatSong = e.target.dataset.song;//当前播放的歌曲
    const thatSongs = e.currentTarget.dataset.songs;//当前播放的歌单

    if (thatSong) {
      //设置当前的歌单/歌曲
      AudioManager.setSong(thatSong, thatSongs);
      
    }
  },

  //更新歌曲播放信息
  onTimeUpdate(){
    //更新数据
    const updata = {
      startTime : audio.startTime,
      duration: audio.duration,
      currentTime: audio.currentTime,
      paused: audio.paused,
      buffered : audio.buffered,
    }
    //数据合并
    Object.assign(this.data.thatSong,updata);

    this.setData({
      thatSong: this.data.thatSong
    })
  },

  //歌曲播放结束后切换下一首
  onEnded() {

    AudioManager.songTab.call(this, true);
  },

  onShow() {

    //audio事件
    const audioEvents = ["onCanplay", "onWaiting", "onError", "onPlay", "onPause", "onSeeking", "onSeeked", "onEnded", "onStop", "onTimeUpdate", "onNext", "onPrev"];

    //监听所有事件
    const trigger = e => {

      Reflect.apply(audio[e], this, [(...arg) => {

        Reflect.has(this, e) && Reflect.apply(this[e], this, arg)
      }])
    }

    //遍历audio事件
    audioEvents.forEach(trigger)

    //获取歌曲状态信息
    const data = AudioManager.getSong();
    //保存页面当前的播放歌曲状态信息
    this.setData(data);
  }
})

export default $page;