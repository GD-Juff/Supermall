/**
 * 防抖函数 , 防抖函数只执行一次，后面执行的都是其返回的函数
 */
export function debounce(func, delay=50) {
  let timer = null; //该timer只会执行一次

  return function(...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      //console.log("执行一次");
      func.apply(this, args);
    }, delay);
  };
}


export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

