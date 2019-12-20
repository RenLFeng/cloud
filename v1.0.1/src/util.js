import axios from 'axios'
import {
  Indicator,
  Toast,
} from "mint-ui";
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

  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var milliSeconds = date.getMilliseconds();

  // var day = date.getDay();
  if (type == '2') {
    return m + '月' + d + '日';
  } else if (type == '/') {
    return y + '/' + m + '/' + d;
  } else if (type == '-') {
    return `${y}-${m}-${d} ${hour}:${minute}:${second}`
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

    date.push([y, m, d].join('/'));
    // date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    //data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
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


//! cjy: 得到图表数据的日期; 需要占位符，不足0补0， 如 2019/12/01
export const getChartDate = (ndays, date) => {
  let enddate = date ? new Date(date) : new Date(); //!  new Date为本地时区 China Standard Time
  //console.log(enddate);
  let dates = [];
  let basetime = new Date(enddate).getTime();
  let oneday = 24 * 3600 * 1000;
  for (let i = 0; i <= ndays; i++) {
    let cur = new Date(basetime);
    //console.log(cur);
    basetime -= oneday;
    let m = cur.getMonth() + 1;
    let d = cur.getDate();
    let dayarray = [cur.getFullYear() + '', m < 10 ? '0' + m : '' + m,
      d < 10 ? '0' + d : '' + d
    ];
    dates.push(dayarray.join('/'));
  }
  return dates.reverse();
}

//! cjy: 分析得分情况
export const parseChartScoreData = (ed, wa, days, enddate) => {
  //! 清空原数据
  ed.xAxis.data = [];
  for (let v of ed.series) {
    v.data = [];
  }

  let datearray = getChartDate(days, enddate);
  ed.xAxis.data = datearray;
  //! 首先对原数据进行按日期归类整理
  let scoredatas = {};
  for (let i = 0; i < wa.length; i++) {
    let cdate = wa[i].countdate;
    if (typeof scoredatas[cdate] == 'undefined') {
      scoredatas[cdate] = [];
    }
    scoredatas[cdate].push(wa[i]);
  }
  //console.log(scoredatas);
  for (let i = 0; i < datearray.length; i++) {
    let scoredata = null; {
      if (scoredatas[datearray[i]]) {
        scoredata = scoredatas[datearray[i]];
      }
    }

    if (!scoredata) {
      scoredata = [];
    }
    for (let v of ed.series) {
      let curdata = 0;
      let usescore = null;
      //console.log(v.matchuserid);
      if (v.matchuserid) {
        //for(let us of scoredata)
        for (let j = 0; j < scoredata.length; j++) {
          let us = scoredata[j];
          //  console.log(us);
          if (us.userid == v.matchuserid) {
            usescore = us;
            break;
          }
        }
      } else {
        if (scoredata.length) {
          usescore = scoredata[0];
        }
      }
      //console.log(usescore);
      if (usescore) {
        if (v.matchcol) {
          if (typeof usescore[v.matchcol] != 'undefined') {
            curdata = Number(usescore[v.matchcol]);
          }
        }
      }
      v.data.push(curdata);
    }
  }
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
export const parseURL = (url) => {
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
export const defaultImg = (type) => {
  var srcstr = 'this.src="';
  switch (type) {
    case 'account':
      srcstr += require("./assets/account_default.png");
      srcstr += '"';
      return srcstr;
    case 'banke':
      srcstr += require("./assets/banke_default.png");
      srcstr += '"';
      return srcstr;
    case 'zuoye':
      srcstr += require("./assets/zuoye_default.png");
      srcstr += '"';
      return srcstr;
    case 'file':
      srcstr += require("./assets/file_default.png");
      srcstr += '"';
      return srcstr;
    case 'txt':
      srcstr += require("./assets/file_icon/txt.svg");
      srcstr += '"';
      return srcstr;
    case 'rar':
      srcstr += require("./assets/file_icon/rar.svg");
      srcstr += '"';
      return srcstr;
    case 'xlsx':
      srcstr += require("./assets/file_icon/xlsx.svg");
      srcstr += '"';
      return srcstr;
    case 'docx':
      srcstr += require("./assets/file_icon/docx.svg");
      srcstr += '"';
      return srcstr;
    case 'ppt':
      srcstr += require("./assets/file_icon/ppt.svg");
      srcstr += '"';
      return srcstr;
    case 'pdf':
      srcstr += require("./assets/file_icon/pdf.svg");
      srcstr += '"';
      return srcstr;
    case 'IT':
      srcstr += require("./assets/file_icon/IT.svg");
      srcstr += '"';
      return srcstr;
    case 'MP4':
      srcstr += require("./assets/file_icon/MP4.png");
      srcstr += '"';
      return srcstr;
    case 'MP3':
      srcstr += require("./assets/file_icon/MP3.png");
      srcstr += '"';
      return srcstr;
    default:
      srcstr += require("./assets/file_default.png");
      srcstr += '"';
      return srcstr;
  }
}
export const getFileType = (v) => {
  switch (v) {
    case 1:
      return "资源";
    case 2:
      return "签到";
    case 3:
      return "作业";
    case 4:
      return "评测";
    case 100:
      return "板书";
    default:
      return "未知类型";
  }
}
export const getZYFileTypeIcon = (name) => {
  const fileType = ["txt", "rar", "xlsx", "docx", "ppt", "pdf"];
  let r = '';
  for (let item of fileType) {
    if (name.includes(item)) {
      r = item;
    }
    if (
      name.includes("doc") ||
      name.includes("rtf")
    ) {
      r = 'docx';
    }
    if (name.includes("zip")) {
      r = 'rar';
    }
    if (name.includes("xls")) {
      r = 'xlsx';
    }
  }
  return r;
}
export const CollectionFn = (itemfile, type, imgIcon, id,bankeid) => {
  Indicator.open("加载中...");
  let info = {
    typeText: getFileType(type),
    img: itemfile.pic ? itemfile.pic : imgIcon,
    time: formateTime('', '-'),
    itemfile: itemfile,
    bankeid:bankeid
  }
  // console.log(info)
  info = JSON.stringify(info);
  axios
    .post("/api/userfav/add", {
      title: itemfile.name,
      info: info,
      eventtype: type,
      eventid: id
    })
    .then(res => {
      if (res.data.code == "0") {
        Toast("收藏成功");
      } else {
        Toast("收藏失败");
      }
      Indicator.close();
    })
    .catch(err => {
      Toast("服务异常");
      Indicator.close();
    });

}