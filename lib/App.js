import Event from "./event.js";

let app;

//公共数据和方法的保存和使用
export default class AppModule extends Event{
  constructor(){
    super();
    //全局数据存放的地方
    this.globalData = {};
  }

  //给当前页面设置数据
  static assign(key,val){
    //app和page执行完毕之后执行
    if(!app || !app.page){

      return setTimeout(AppModule.assign.bind(null,key,val),0);
    }
    
    //当前页面的实例
    let page = app.page.page;
    if(/string/i.test(typeof key) && val !== undefined){

      page.setData({
        [key] : val
      })
    } else if (/object/i.test(typeof key)){

      page.setData(key)
    }
  }

  //用于获取全局数据，属性值，设置属性的方法
  data(...arg){
      //获取全部全局数据
      if(arg.length === 0){
        
        return this.globalData;
      } else if (arg.length === 1){
        //获取全局数据的属性值
        if(/string/i.test(typeof arg[0])){
          
          return this.globalData[arg[0]];
        }
        //如果是对象，递归接受该对象的属性和属性值
        if (/object/i.test(typeof arg[0])){
          
          const data = arg[0]
          for(let key in arg[0]){
            
            this.data(key, data[key])
          }
        }
      }else if(arg.length === 2){
        
        //设置全局属性
        Reflect.set(this.globalData, arg[0],arg[1]);
      }
  }

  //初始化方法
  start(){
    
    const appExample = this;
    //通过事件将需要的数据添加到App的实例中
    this.addEvent("onLaunch",function(){
     
      Reflect.set(this, "expample", appExample);
      app = this;
    })
    
    App(this);//等同于App({})
  }
}