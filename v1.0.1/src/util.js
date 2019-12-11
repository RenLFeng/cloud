export const formateTime = (v, type) => {
  let date = new Date();
  if (v) {
    date = new Date(v);
  }
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var day = date.getDay();
  if (type == '2') {
    return m + '月' + d + '日';
  } else if (type == '/') {
    return y + '/' + m + '/' + d;
  } else {
    return y + '年' + m + '月' + d + '日';
  }
}
export const Whatweek = (time) => {
  let date = new Date();
  if (time) {
    date = new Date(time);
  }

  var day = date.getDay();
  return timeWeekHummanread(day);
}
export const timeWeekHummanread = v => {
  let wobj = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日'
  };
  if (wobj[v]) {
    return wobj[v];
  }
  return '';
}
export const getDate = (date, n) => {
  var base = new Date(date).getTime()
  var oneDay = 24 * 3600 * 1000;
  var date = [];
  var data = [Math.random() * 300];
  var time = new Date(base);

  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = time.getDate();
  d = d < 10 ? ('0' + d) : d;

  date.push([y, m, d].join('/'));
  for (var i = 1; i < n; i++) {
    var now = new Date(base -= oneDay);

    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = now.getDate();
    d = d < 10 ? ('0' + d) : d;

    date.push([y, m,d].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }
  var newdate = date.reverse()
  // console.log(newdate)
  return newdate;
}
//指定多少天以后的时间
export const getNextDate = (n) => {
  var date = new Date();
  date.setDate(date.getDate() - n);
  return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
}

export const pingceType = (v) => {
  switch (v) {
    case 1:
      return "判断题";
      break;
    case 2:
      return "多项选择题";
      break;
    case 3:
      return "单项选择题";
      break;
    case 4:
      return "主观题";
      break;
    case 5:
      return "写作题";
      break;
    case 6:
      return "抢答题";
      break;
  }
}
export const parseURL = (url) =>{
  var query = url && url.split('?')[1]
  var queryArr = query && query.split('&')
  var params = {}
  queryArr &&
    queryArr.forEach(function (item) {
      var key = item.split('=')[0]
      var value = item.split('=')[1]
      params[key] = value
    })
  return params
}