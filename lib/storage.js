//比较符号
const  hereCompare = {
  "=" : function(that,value){

    return that == value
  },
  "!=": function (that, value) {

    return that != value
  },
  ">": function (that, value){
    return that > value
  },
  ">=": function (that, value) {
    return that >= value
  },
  "<" : function(that,value){
    return that < value
  },
  "<=": function (that, value) {
    return that <= value
  },
  "like" : function(that,value){

    return new RegExp(value,"i").test(that);
  }
}

export default class Storage{

  constructor(dbname){
    //设置类的缓存
    Object.assign(this,{
      dbname,//类的库名
      cache : {//类的缓存
        add : {
          data : []//类的缓存数据的储存地方
        }
      }
    })
  }

  //实时获取类的缓存数据
  static getDb(dbname){
    //查询本地数据
    return wx.getStorageSync(dbname) || [];
  }
  //获取where方法
  static getWhere(action){
    if(this.whereFn){
      
      const whereFn = this.whereFn;
      this.whereFn = null;
      
      return whereFn;
    }else{
      throw new Error('调用'+action+'方法时，请先调用where方法')
    }
  }
  
  //将数据添加到类的缓存中
  add(data){

    if(Array.isArray(data)){

      if(!data.length){
        throw new Error("该数组不能为空")
      }

      //递归添加数据
      data.forEach((item,index) => {
        this.add(item);
     })

    }else if(/object/.test(typeof data)){

      //添加数据
      this.cache.add.data.push(data)
    }else{

      throw new Error("add 方法不支持字符串传参")
    }
    return this;
  }

  //删除数据
  del(){
    //记录数据
    this.cache.del = {
      where : Storage.getWhere.call(this,"del")
    }
    return this;
  }

  //修改数据
  updata(data){
    
    if(/object/i.test(typeof data)){
      
      //记录到实例的缓存里面
      this.cache.updata = {
        data,
        where : Storage.getWhere.call(this,"updata")
      }
    }else{
      throw new Error("updata 方法只接受对象作为参数")
    }
    return this;
  }

  //构件查询语句
  where(...args) {
    let [key, compare, value] = args;

    if(/object/i.test(typeof key)){
      
      for(let k in key){
        
        if (Array.isArray(key[k])){
          this.where(k, ...key[k]);
        }else{
          this.where(k, key[k]);
        }
      }
    }

    if (value === undefined) {
      value = compare;
      compare = "=";
    }
    //比较函数
    let compareFn = hereCompare[compare];
    if (compareFn) {
      
      if(!this.whereFn){
        //定义where查询函数
        const whereFn = (item) => {
          //比较计数初始值
          let compareNum = 0;
          //便利用来储存比较方式的数组
          whereFn.compare.forEach(compare => {

            compareNum += ~~compare.compareFn(item[compare.key], compare.value)
          })

          return compareNum === whereFn.compare.length;
        }
        //用数组来储存对比方式
        whereFn.compare = [];

        this.whereFn = whereFn;
      }
      //记录当前的对比条件
      this.whereFn.compare.push({
        key, value, compareFn
      })

      // //构建查询函数
      // this.whereFn = (item) => {
      //   //相应的对比符号的函数
      //   return compareFn(item[key], value);
      // }
    } else {

      throw new Error("where 方法不支持" + compare + "比较符号")
    }
    return this;
  }

  //查询多条数据
  select() {
    //获取缓存数据 本地储存的数据
    const db = Storage.getDb(this.dbname);
    //过滤查询
    const data = db.filter(Storage.getWhere.call(this, "select"));
    //数据排顺
    this.sortFn && data.sort(this.sortFn);

    return this.slicing ? data.slice(...this.slicing) : data;
  }
  
  //排序方法
  order(key,sort="asc"){
    //排序函数
    this.sortFn = (a,b) => {
      return /desc/.test(sort) ? 
              b[key] - a[key] : 
              a[key] - b[key];
    }
    return this;
  }

  //截取数据
  limit(start,end){
    
    if(end === undefined){
      end = start;
      start = 0;
    } else {
      --start;
    }

    this.slicing = [start,end];
    return this;
  }

  //查询数据
  find() {
    //获取缓存数据 本地储存的数据
    const db = Storage.getDb(this.dbname);

    //数据排顺
    this.sortFn && db.sort(this.sortFn);

    return db.find(Storage.getWhere.call(this, "find"))
  }
  //查询所有数据
  all(){

    //获取缓存数据 本地储存的数据
    const data = Storage.getDb(this.dbname);

    //数据排顺
    this.sortFn && data.sort(this.sortFn);

    return this.slicing ? data.slice(...this.slicing) : data;
  }

  //将数据更新保存到类的缓存中
  save(){
    let db = Storage.getDb(this.dbname);

    //删除数据
    if(this.cache.del){
      db = db.filter(item => {
        return !this.cache.del.where(item);
      })
    }

    //更新修改后的数据
    if (this.cache.updata) {
      db.forEach(item => {

        if (this.cache.updata.where(item)){
           Object.assign(item,this.cache.updata.data) 
        }
      })
    }
    //添加数据
    if (this.cache.add){
      db.push(...this.cache.add.data)
    }
    //更新本地缓存
    wx.setStorageSync(this.dbname,db)
  
    //更新类的缓存
    this.cache = {
      add : {
        data : []
      } 
    }
    return this;
  }
}