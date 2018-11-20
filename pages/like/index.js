import PageModule from "../../lib/Page.js";
import $pagemusic from "../../model/PageMusic.js";
import LikeSong from "../../model/LikeSong.js";
import uitls from "../../uitls/uitls.js";

const $like_song = new LikeSong();
const $page = new PageModule({

  onLoad(){
    
    //获取用户信息
    uitls.getUserInfo()
      .then(userInfo => {
            
            this.setData({userInfo})
          })


    //歌单的第一个图片的url
    const url = "https://y.gtimg.cn/music/photo_new/T002R90x90M000001ZaCQY2OxVMg.jpg";

    const linkSong = $like_song.order("time","desc").all();
    const cover = linkSong[0] ? linkSong[0].album_big : url;

    this.setData({ linkSong, cover})
  },
  //在歌单页面收藏歌曲后回来显示
  onShow() {
    //歌单的第一个图片的url
    const url = "/images/default_album.jpg";

    const linkSong = $like_song.order("time", "desc").all();
    const cover = linkSong[0] ? linkSong[0].album_big : url;

    this.setData({ linkSong, cover })
  }
});

$page.extend($pagemusic)

$page.start();