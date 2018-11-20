//命名空间
Array.prototype.pustnameSpace = function (...arg){
  //包装事件函数return的数据
  arg = arg.map(item => {

    if(/object/i.test(typeof item)){

      if (item.nameSpace){

        return {
          nameSpace: item.nameSpace,
          data : item.data
        }
      }else{

        return {
          nameSpace: "default",
          data: item
        }
      }
    }else{
      
      return {
        nameSpace : "default",
        data : item
      }
    }
  })

  this.push(...arg);
}
//查询命名空间
Array.prototype.findNameSapce = function (nameSpace="fefault",subscript){

  const data = this.filter(item => {

    return new RegExp(nameSpace, "i").test(item.nameSpace);
  }).map(item => item.data);//返回data数据

  //当subscript为true的时候
  if (/boolean/.test(typeof subscript) && subscript){
    
    return data;
  }else{

    if (subscript === undefined) {
      subscript = data.length - 1;
    }

    return data[subscript];
  }
}


export default Array;