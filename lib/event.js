import myArray from "./ArrrayEx.js";


//事件的类
export default class Event{
  constructor(){
    //保存监听事件的类型和方法
    Object.defineProperty(this,"events",{
      value : {},
      enumerable: false//events对象不可枚举
    });
  }
  //事件队列触发器
  static createEventHandle(eType,that){//事件类型，当前实例对象
    //生成事件队列的包装函数
    Reflect.set(that,eType,function(...arg){
      
      //保存this
      const page = this,
            data = [];
            
      //判断事件类型是否为onLoad
      if (eType === "onLoad"){
        const argData = arg[0];
        Object.keys(argData).forEach(key => {

          argData[key] = decodeURIComponent(argData[key])
        })
      }
      
      const eTypeFn = Array.from(Reflect.get(that.events,eType));

      //让事件队列里面的函数依次执行
      ;(function recur(){
        //让第一个时间函数出列
        let f = eTypeFn.shift();
        f && data.pustnameSpace(f.apply(page,arg));

        //事件队列不为空
        eTypeFn.length && recur();
      }());
      return data;
   }) 
  }

  //获取事件队列
  getEvent(eType){
    let eTypeFn = Reflect.get(this.events, eType)//获取对象的属性
    //当它不是数组的时候
    if (!Array.isArray(eTypeFn)){

      eTypeFn = [];//设置一个空对象用于存储事件函数
      Reflect.set(this.events, eType, eTypeFn);//设置对象的属性
      //this.events[eType] = eTypeFn

      //添加触发器
      Event.createEventHandle(eType, this);
    }
    return eTypeFn;
  }

  //添加事件监听方法
  addEvent(eType,callback){

    const eTypeFn = this.getEvent(eType);
    eTypeFn.push(callback)
  }

  //删除事件
  removeEvent(eType,callback){
    
    if (callback){
      
      const eTypeFn = this.getEvent(eType);
      const index = eTypeFn.findIndex(item => item === callback);
      //异步删除
      index !== -1 && setTimeout([].splice.bind(eTypeFn),0,index,1);
    }else{
      
      Reflect.set(this.events,eType,[])
    }
  }

  //一次性事件
  oneEvent(eType,callback){
    const that = this;

    //删除指定的事件函数
    const handle = function(...arg){

      callback.apply(this, arg);

      that.removeEvent(eType, handle);
    }

    this.addEvent(eType, handle);
  }
}