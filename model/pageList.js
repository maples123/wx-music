//歌曲列表加载数据的方法


import PageModule from "../lib/Page.js";
import { request } from "../commen/const.js";

const $page = new PageModule({
  //加载数据，用来初始化事件
  onLoad(){
    //当页面加载数据的时候，都必须通过onLoad事件获取data数据，
    //避免跳转多个页面的时候，url被覆盖
    Object.assign(this.data, {
      url: "",
      page: 1,
      row: 20,
      songs: [],
      stork : false
    })
    
  },
  
  //页面数据加载
  loadPage() {
    //数据到底后给用户提示
    if (this.data.stork) {
      return wx.showToast({
        title: '数据到底了',
        icon: "none"
      })
    }
    const url = this.data.url + "/p/" + this.data.page + "/r/" + this.data.row;

    //像是加载图标
    wx.showLoading();

    //请求数据
    const res_data = new Promise((reslove, reject) => {

      wx.request({
        url: url,
        success: reslove,
        fail: reject
      })
    })

    res_data.then(this.codePage.bind(this)).catch(err => {
      console.log(err)
    })
  },
  //处理数据
  codePage(res) {
    //隐藏加载图标
    wx.hideLoading();

    const data = res.data;
    this.data.songs.push(...data.songs);

    this.data.stork = this.data.page >= res.data.count_page;


    this.setData({
      songs: this.data.songs
    })
  },
  //滚动加载更多
  morePage() {

    this.data.page++;
    this.loadPage();
  },

  //图片找不到的时候
  imgError(e) {

    const imgUrl = "/images/default_album.jpg";
    const song = e.target.dataset.song;
    //获取错误图片的下标
    const index = this.data.songs.findIndex(item => item.song_mid === song.song_mid);

    if(index > -1){
      this.data.songs[index].album_min = imgUrl
      this.data.songs[index].album_big = imgUrl;
      
      this.setData({ songs: this.data.songs });
    }

  },
});

export default $page;

