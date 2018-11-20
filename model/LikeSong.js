import Storage from "../lib/storage.js";

const db_name = "like_song";

export default class LikeSong extends Storage{

  constructor(){
    super(db_name)
  }

  //检验是否收藏歌曲
  has(mid){

    return this.where("song_mid",mid).find() ? true : false; 
  }

  //添加收藏
  add(song){

    const dataKey = ["song_url", "song_mid", "song_name", "song_orig", "album_min", "album_big", "album_mid","album_name"],
          data = {};

    dataKey.forEach(key => data[key] = song[key])

    super.add(Object.assign({
      time : new Date().getTime()
    },data)).save();
  }
  //取消收藏
  del(song){

    this.where("song_mid", song.song_mid);

    super.del().save();
  }
}