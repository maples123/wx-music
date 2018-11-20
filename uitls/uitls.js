import Storage from "../lib/storage.js";

//处理URL传参
function queryData(obj){

  return Object.keys(obj).map(item => {
   
    return item + "=" + encodeURIComponent(obj[item])
  }).join("&");

}

//处理url
function httpGet(url){
  const db = new Storage("http")

  const httpUrl = url + "?" + queryData(data);
  const dbData = db.where("url", httpUrl).find();

  if (dbData && new Date(dbData.time).getDate() >= new Date().getDate()){

    new Promise(reslove => {
      reslove(dbData.data);
    })
  }else{

    new Promise((reslove,reject) => {
      wx.request({
        url: httpUrl,
        success: (res) => {
          db.add({
            url: httpUrl,
            data : res,
            time : new Date().getTime()
          }).save();

          reslove(res);
        },
        fail : reject
      })
    })
    
  }
}

//获取用户信息
function getUserInfo(){
  //获取app实例
  const $app = getApp().expample;

  return new Promise((resolve,reject) => {
    //全局App实例保存的用户信息
    let userInfo = $app.data("userInfo")

    if (userInfo){

      return resolve(userInfo);
    }
    //获取本地储存的用户信息
    const $db_user = new Storage("db_user");
    userInfo = $db_user.where("time","!=","").find();

    if (userInfo){

      $app.data({ userInfo})
      return resolve(userInfo);
    }

    wx.getUserInfo({
      success(res){

        resolve(res.userInfo);
      },
      fail(){

        wx.redirectTo({
          url: '/pages/start/index',
        })
      }
    })
 })
}

export default { httpGet, queryData, getUserInfo};