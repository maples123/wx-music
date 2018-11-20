import PageModule from "../../lib/Page.js"
import SearchSong from "../../lib/SearchSong.js";
import $pagemusic from "../../model/PageMusic.js";

const $search_song = new SearchSong();

const $page = new PageModule({
  data: {
    q:"",
    history : []
  },
  onShow(){
    this.updata();
  },
  query(e){
    const q = e.detail.value.q.trim();
    
    if(q){

      //将数据添加到本地储存
      $search_song.add(q);
      //更行数据
      this.updata();

      wx.navigateTo({
        url: '/pages/search/list?q=' + q,
      })
    }else{

      wx.showToast({
        title: '请输入歌曲名',
        icon : "none"
      })
    }
  },
  //数据更新
  updata(){
    const data = $search_song.all();
    
    this.setData({
      history: data,
      q : ""
    })
  },
  //删除缓存
  del(e){

    const songName = e.currentTarget.dataset.item

    //删除缓存数据
    $search_song.del(songName);
    //更行数据
    this.updata();
  }
});

$page.extend($pagemusic)

$page.start()