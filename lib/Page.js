//用于设置当前页面所需的数据
import Event from "./event.js";

//全局属性
const app = getApp();

//方法的共用 方法的导出
export default class PageModule extends Event{
  constructor(data){
    super()

    const pageExample = this;
    //用于监听app的加载事件
    this.addEvent("onShow", function () {

      //将数据添加到app全局数据当中
      Reflect.set(app, "page", {
        example: pageExample,
        page: this,
        route: this.route
      });
    });

    //导出事件或data数据
    data && this.extend(data);
  }

  //筛选方法
  static select(obj){

    let events = {},
        data = {};
    Object.keys(obj).forEach(key => {

      if(/function/i.test(typeof obj[key])){
        events[key] = obj[key];
      }else{
        data[key] = obj[key];
      }
    })

    return {events,data};
  }

  //导入事件
  exports(...arg){

    arg = arg.length ? arg : Object.keys(this.events);
    
    const events = {};
    arg.forEach(eType => {

      if (/function/i.test(typeof this[eType])){
        events[eType] = this[eType];
      }else{
        throw new Error(`不存在${eType}事件`);
      }
    })

    return events;
  }

  //导出
  extend(obj){
    const {events,data} = PageModule.select(obj)

    for(let eType in obj){

      this.addEvent(eType,obj[eType]);
    }

    //添加属性
    Object.assign(this, data);
  }

  //初始化方法
  start(data){
    //导出事件或data数据
    data && this.extend(data);

    Page(this);
  }
} 