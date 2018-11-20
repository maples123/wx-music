import PageModule from "../../lib/Page.js";
import { request } from "../../commen/const.js";
import $pageList from "../../model/pageList.js";
import SearchSong from "../../lib/SearchSong.js";
import $pagemusic from "../../model/PageMusic.js";

const $search_song = new SearchSong();

const $page = new PageModule($pageList);


$page.extend($pagemusic)

$page.start({
  onLoad(query){
    //歌曲名
    const songName = query.q;
    
    //打包url
    this.data.url = request.query + songName;
    //数据请求
    this.loadPage();

    this.setData({
      q: songName
    })
    wx.setNavigationBarTitle({
      title: songName
    })
  },
  //表单请求数据
  query(e){
    
    const data = e.detail.value;

    const val = data.q.trim();
    if (val){

      //添加缓存数据
      $search_song.add(data.q);
      //重载
      this.onLoad(data);
    }else{

      wx.showToast({
        title: '请输入歌曲名',
        icon : "none"
      })
    }
  }
});