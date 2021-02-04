export function debounce(func,delay){
  let time = null;
  return function(...args){
    if (time) clearTimeout(time)

    time = setTimeout(() => {
      func.apply(this,args)
    },delay)
  }
}

//正则表达式是干什么呢? 字符串匹配 利器(难,规则太多)
export function formatDate(date,fmt){

  //1.获取年份
  //y+ -> 1个或者多个
  //y* -> 0个或者多个
  //y? -> 0个或者1个

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
   //2.2获取
   let o ={
     'M+': date.getMonth() + 1,
     'd+': date.getDate(),
     'h+': date.getHours(),
     'm+': date.getMinutes(),
     's+': date.getSeconds()
   }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)){
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

//
function padLeftZero(str){
  return ('00' + str).substr(str.length);
};