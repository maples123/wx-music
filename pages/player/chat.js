import PageModule from "../../lib/Page.js";
import uitls from "../../uitls/uitls.js";

const db = wx.cloud.database();//云端数据库
const song_chat = db.collection("song_chat");//集合

const $page = new PageModule({

  data : {
    chat : "",
    page : 1,
    row : 20,
    chatList : [],
    thumbNum : 0,
    thumb: false, 
    chatIndex : ""
  },

  onLoad(options){
    
    
    //设置标题
    wx.setNavigationBarTitle({
      title: options.song_name,
    })

    //用户信息
    uitls.getUserInfo()
          .then(userData => {
            
            this.setData({ userData})
          })

    //歌曲信息
    this.setData({
      chatSong: options
    })

    //获取云端歌曲评论信息
    this.getChat();
  },
  //获取歌曲评论列表
  getChat(){
    wx.showLoading({
      title: '正在加载',
    })
    
    const page = this.data.page;
    const row = this.data.row;

    return song_chat
              .where({"song_mid" : this.data.chatSong.song_mid})
              .skip(page * row - row)
              .limit(row)
              .orderBy("time","desc")
              .get()
              .then(this.setCaht.bind(this))
  },

  //设置评论列表
  setCaht(data){
    wx.hideLoading();

    const datas = data.data;

    //设置时间
    datas.forEach(item => {

      item["time"] = (data => {

        return data.getFullYear() + "年" + (data.getMonth() + 1) + "月" + data.getDate() + "日";
      })(new Date(item["time"]));
    })
    const chatList = this.data.chatList;
    chatList.push(...datas)
    this.setData({chatList});
  },
  
  //添加品论
  addChat(e){

    const chat = e.detail.value.chat.trim();

    this.setData({chat : ""})
    if (chat){
      //云函数
      wx.cloud.callFunction({
        name: "addChat",
        data: {
          song_mid: this.data.chatSong.song_mid,
          chat,
          userData: this.data.userData
        },
        success(res) {

          if (res.result) {
            wx.showToast({
              title: '已添加评论~',
              icon: "none"
            })
          }
        },
        fail(err) {

          wx.showToast({
            title: '服务器错误',
            icon: "none"
          })
        }
      })
    }else{

      wx.showToast({
        title: '评论内容不能为空',
        icon : "none"
      })
    }
  },

  thumbClick(e){

    const chatIndex = e.target.dataset.index;
    this.setData({ chatIndex})
    this.setData({ thumb: !this.data.thumb })


    song_chat
      .where({ "song_mid": this.data.chatSong.song_mid })
      .get()
      .then(this.getChatIndex.bind(this))



    if (this.data.thumb === true) {

      this.setData({
        thumbNum: this.data.thumbNum + 1
      })
    } else {

      this.setData({
        thumbNum: this.data.thumbNum - 1
      })
    }
      
  },
  
  getChatIndex(data){

    const datas = data.data;
    const chatList = this.data.chatList;
    
    const index = datas.findIndex(item => {
      
      return item.song_mid === (function(data){
        
        let songMid;
        data.forEach(item => {
          
          songMid = item.song_mid;
        })
        return songMid;
      })(chatList);
    })

    console.log(index);
  }, 

  //滚动加载更多
  chatScroll(e){
    this.getChat();
    this.data.page++;
  }
});


$page.start();