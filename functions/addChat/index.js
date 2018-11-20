// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'demo-11b75e'})

const db = cloud.database();//云端数据库
const song_chat = db.collection("song_chat");//云端集合


// 云函数入口函数
exports.main = async (event, context) => {

  const data = {
    song_mid: event.song_mid,
    chat: event.chat,
    userInfo: {
      openId: event.userInfo.openId,
      avatarUrl: event.userData.avatarUrl,
      gender: event.userData.gender,
      nickName: event.userData.nickName
    },
    time: new Date().getTime()
  }

  try {
    return await song_chat.add({
      // data 字段表示需新增的 JSON 数据
      data
    })
  } catch (e) {
    console.error(e)
  }
}