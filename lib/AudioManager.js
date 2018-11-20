import AppModule from "../lib/App.js";
import Storage from "../lib/storage.js";
import LikeSong from "../model/LikeSong.js";
import uitls from "../uitls/uitls.js";
import {request} from "../commen/const.js";

const $db_audio = new Storage("db_audio")

const $db_like = new LikeSong();

//背景音频
const audio = wx.getBackgroundAudioManager();

//管理全局唯一的背景音频
export default class AudioManager{
  //用静态变量保存全局的变量

  static audio = audio;
  //当前播放的歌曲
  static thatSong = null;
  //当前播放的歌单
  static thatSongs = null;
  //设置当前的歌单/歌曲

  static setSong(thatSong,thatSongs){
    //保存歌曲的播放状态
    AudioManager.saveSong(thatSong, thatSongs);

    //歌曲信息
    const audioAttr = {
      // src: thatSong.song_url,//播放路径
      title: thatSong.song_name,//歌名
      epname: thatSong.album_name,//专辑名
      singer : thatSong.song_orig,//歌手
      coverImgUrl : thatSong.album_min//专辑图
    }

    //获取真是的歌曲url路径
    wx.request({
      url: request.song_url + thatSong.song_mid,
      success : (res) => {

        const songUrl = res.data;
        if (songUrl) {
          //歌曲的临时url
          audioAttr.src = res.data;
        }else{
          
          wx.showToast({
            title: '抱歉，该歌曲的url找不到了',
            icon : "none"
          })
        }
        
        //添加个小程序歌曲播放所需的数据
        Object.assign(audio, audioAttr)
      }
    })
  }

  //保存歌曲的播放状态
  static saveSong(thatSong, thatSongs){

    //歌曲信息数据
    const data = { thatSong, thatSongs }

    //更新歌曲数据到页面
    AppModule.assign(data);

    //将歌曲信息添加到AppModule里面
    Object.assign(AudioManager,data);

    //遍历歌曲信息数据
    Object.keys(data).forEach(key => {

      const where = { "type": key };//查询条件
      //数据
      const upData = Object.assign({},where,{
        data : data[key],
        time : new Date().getTime()
      })

      //判断缓存是否存在
      if ($db_audio.where(where).find()){

        //修改数据
        $db_audio.where(where).updata(upData);
      }else{

        //添加数据
        $db_audio.add(upData);
      }

      //保存数据
      $db_audio.save();
    })
  }

  //audio 事件代理
  static tirgger(eType,that,...arg){

    //判断audio 事件类型是否存在
    Reflect.has(audio, eType) && Reflect.apply(audio[eType],that,arg);
  }

  //歌曲播放
  static play() {
    //播放状态
    if (audio.paused === undefined){

      AudioManager.setSong(this.data.thatSong,this.data.thatSongs);
    }else if(audio.paused === true){
      
      audio.play()
    }else{

      audio.pause();
    }
  }

  //切换歌曲共同的代码
  static songTab(statu){
    //当前播放的索引值
    let index = this.data.thatSongs.findIndex(song => song.song_mid === this.data.thatSong.song_mid);
    
    //判断切换是上一首还是下一首
    (statu) ? ++index : --index;

    //小于length
    (index < 0) && (index = this.data.thatSongs.length - 1);

    //大于length
    index %= this.data.thatSongs.length;
    
    //设置歌曲切换功能
    AudioManager.setSong(this.data.thatSongs[index],this.data.thatSongs);
  }
  //上一首
  static prev() {

    AudioManager.songTab.call(this,false);
  }
  //下一首
  static next() {

    AudioManager.songTab.call(this, true);
  }

  //歌曲收藏
  static like() {
    const likeSong = this.data.thatSong;

    if ($db_like.has(likeSong.song_mid)) {

      $db_like.del(likeSong);
    }else{

      $db_like.add(likeSong);
    }

    //保存收藏状态
    this.setData({
      like: $db_like.has(likeSong.song_mid)
    })
  }

  //获取歌曲信息
  static getSong(){

    //数据容器
    const data = {
      thatSong : {},
      thatSongs : []
    }
    //便利容器，获取歌曲信息数据
    Object.keys(data).forEach(key => {
      
      const where = { "type": key };//查询条件
      // 判断AudioManager里面的歌曲数据是否存在
      if (AudioManager[key]){

        data[key] = AudioManager[key];
      }else{

        //获取缓存数据
        const dbData = $db_audio.where(where).find();
        if (dbData){

          data[key] = dbData.data;
        }
      }
    })
    //返回数据到页面
    return data;
  }

  //歌曲评论
  static chat(){
    // const song = this.data.thatSong
    // const obj = Object.keys(song).map(item => {

    //   return item + "=" + encodeURIComponent(song[item]);
    // }).join("&");

    // console.log(obj);



    wx.navigateTo({
      url: '/pages/player/chat?' + uitls.queryData(this.data.thatSong)
    })
  }



  constructor(){}
}