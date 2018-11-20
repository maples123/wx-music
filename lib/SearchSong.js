import Storage from "./storage.js";

const dbname = "search_song"

export default class SearchSong extends Storage{
  constructor(){
    super(dbname);
  }
  //添加歌曲缓存
  add(songName){
    //缓存歌曲不存在就添加
    if (!this.where("name",songName).find()){

      //将歌曲添加到本地缓存
      super.add({
        name: songName,
        time: new Date().getTime()
      }).save();
    }
  }
  //获取所有歌曲缓存
  all(){
    //缓存数据倒序
    this.order("time","desc");
    //获取所有的缓存数据
    const db = super.all();
    //截取缓存数据
    const data = db.splice(0,10);
    //删除多余的缓存数据
    db.forEach(dbItem => {
      
      this.del(dbItem.name)
    })

    return data;
  }
  //删除缓存数据
  del(songName){

    this.where("name",songName)

    super.del().save();
  }
}