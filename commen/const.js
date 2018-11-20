//地区
export const region = [
  { name: "欧美", id: 3 },
  { name: "内地", id: 5 },
  { name: "港台", id: 6 },
  { name: "韩国", id: 16 },
  { name: "日本", id: 17 }
]
//歌曲类型
export const sheet = [
  { name: "热门歌曲", id: 26 },
  { name: "新歌专辑", id: 27 },
  { name: "网络歌曲", id: 28 },
  { name: "流行音乐", id: 4 }
]
//请求url
export const request = {
  host: "http://agent.atoz.ink/"
};

request.topid = request.host + "topid/";//歌单
request.query = request.host + "query/";//歌曲搜索
request.lyrics = request.host + "lyrics/";//歌词
request.song_url = request.host + "song_url/";//获取临时的url路径，有时效性


export const envStr = "abc-11b75e";