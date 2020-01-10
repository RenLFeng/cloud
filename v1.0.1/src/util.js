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

// cjy: 纠正移动设备上的拍照旋转文件
export const fixCaptureImage = (file) => {
  return new Promise((resolve, reject) => {
    // 获取图片
    console.log('fixCaptureImage');
    const img = new Image();
    let curl = window.URL.createObjectURL(file)
    let oparam = curl;
    img.src = curl;
    img.onerror = () => reject(null);
    let EXIF = require('exif-js');
    img.onload = () => {
      // 获取图片元数据（EXIF 变量是引入的 exif-js 库暴露的全局变量）
      EXIF.getData(img, function () {
        // 获取图片旋转标志位
        var orientation = EXIF.getTag(this, "Orientation");
        // 根据旋转角度，在画布上对图片进行旋转
        //! test
        console.log('fixLocalImage, orientation:' + orientation);

        if (img.width == 0 || img.height == 0) {
          return reject(null);
        }

        //   orientation = 8;
        //! cjy: 因为手机端的拍照像素一般都很大， 这里限制最大值， 方便处理
        let maxwidth = 1920;
        let maxheight = 1080;
        //  maxwidth = maxheight = 200; //! test
        let cwidth = img.width;
        let cheight = img.height;
        if (cwidth > maxwidth) {
          cwidth = maxwidth;
          cheight = cwidth * img.height / img.width;
        }
        if (cheight > maxheight) {
          cheight = maxheight;
          cwidth = cheight * img.width / img.height;
        }

        // if (orientation === 3 || orientation === 6 || orientation === 8)
        {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          switch (orientation) {
            case 3: // 旋转180°
              canvas.width = cwidth;
              canvas.height = cheight;
              ctx.rotate((180 * Math.PI) / 180);
              // ctx.drawImage(img, -img.width, -img.height, img.width, img.height);
              ctx.drawImage(img, -cwidth, -cheight, cwidth, cheight);
              break;
            case 6: // 旋转90°
              canvas.width = cheight;
              canvas.height = cwidth;
              ctx.rotate((90 * Math.PI) / 180);
              //  ctx.drawImage(img, 0, -img.height, img.width, img.height);
              ctx.drawImage(img, 0, -canvas.width, canvas.height, canvas.width);
              break;
            case 8: // 旋转-90°
              canvas.width = cheight;
              canvas.height = cwidth;
              ctx.rotate((-90 * Math.PI) / 180);
              // ctx.drawImage(img, -img.width, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, -canvas.height, 0, canvas.height, canvas.width);
              break;
            default:
              canvas.width = cwidth;
              canvas.height = cheight;
              // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cwidth, cheight);
              ctx.drawImage(img, 0, 0, cwidth, cheight);
              break;
          }
          // 返回新图片
          let imgurl = canvas.toDataURL('image/jpeg', 0.8);
          return resolve(imgurl);
          //canvas.toBlob(file => resolve(file), 'image/jpeg', 0.8)
        }
        // else {
        //   //  return resolve(oparam);
        //     return reject(null);
        // }
      });
    };
  });
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
    case 2:
      return "多项选择题";
    case 3:
      return "单项选择题";
    case 4:
      return "主观题";
    case 5:
      return "写作题";
    case 6:
      return "抢答题";
    case 10:
      return "投票";
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

export const getFileTypeImg = (typein) => {
  if (typein.length > 6 && typein.lastIndexOf('.') > 0) {
    return typein; //! 已经是路径
  }
  var srcstr = '';
  let type = typein.toLocaleLowerCase();
  switch (type) {
    case 'account':
      srcstr += require("./assets/account_default.png");
      return srcstr;
    case 'banke':
      srcstr += require("./assets/banke_default.png");
      return srcstr;
    case 'zuoye':
      srcstr += require("./assets/zuoye_default.png");
      return srcstr;
    case 'file':
      srcstr += require("./assets/file_default.png");
      return srcstr;
    case 'txt':
      srcstr += require("./assets/file_icon/txt.svg");
      return srcstr;
    case 'rar':
      srcstr += require("./assets/file_icon/rar.svg");
      return srcstr;
    case 'xlsx':
      srcstr += require("./assets/file_icon/xlsx.svg");
      return srcstr;
    case 'docx':
      srcstr += require("./assets/file_icon/docx.svg");
      return srcstr;
    case 'ppt':
      srcstr += require("./assets/file_icon/ppt.svg");
      return srcstr;
    case 'pdf':
      srcstr += require("./assets/file_icon/pdf.svg");
      return srcstr;
    case 'it':
      srcstr += require("./assets/file_icon/IT.svg");
      return srcstr;
    case 'mp4':
      srcstr += require("./assets/file_icon/MP4.png");
      return srcstr;
    case 'mp3':
      srcstr += require("./assets/file_icon/MP3.png");
      return srcstr;
    default:
      srcstr += require("./assets/file_default.png");
      break;
  }
  return srcstr;
}

export const defaultImg = (typein) => {
  let ipath = getFileTypeImg(typein);
  var srcstr = 'this.src="';
  srcstr += ipath;
  srcstr += '"';
  return srcstr;

}
export const getCollectionType = (v) => {
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

export const getZYFileTypeIcon = (namein) => {
  return getFileTypeImg(getZYFileType(namein));
}

export const getZYFileType = (namein) => {
  //const fileType = [".txt", ".rar", ".xlsx", ".docx", ".ppt", ".pdf"];
  let r = '';
  let name = namein || '';
  if (name.length > 6) {
    name = name.substr(name.length - 7);
  }
  if (name.indexOf('.') < 0) {
    return name;
  }
  name = name.toLocaleLowerCase();
  // console.log(name);
  if (name.includes('.rar') || name.includes('.zip')) {
    r = 'rar';
  } else if (name.includes('.doc') || name.includes('.docx') || name.includes('.rtf')) {
    r = 'docx';
  } else if (name.includes('.xlsx') || name.includes('.xls')) {
    r = 'xlsx';
  } else if (name.includes('.ppt') || name.includes('.pptx')) {
    r = 'ppt';
  } else if (name.includes('.pdf')) {
    r = 'pdf';
  } else if (name.includes('.txt')) {
    r = 'txt';
  } else if (name.includes('.mp4')) {
    r = 'mp4';
  } else if (name.includes('.mp3')) {
    r = 'mp3';
  }
  // console.log(r);
  return r;
}
export const CollectionFn = (itemfile, type, imgIcon, id, bankeid, title = null) => {
  Indicator.open("加载中...");
  let info = {
    //  typeText: getFileType(type),
    type: type, //! 多语言考虑， 这里只存储int类型
    img: getFileTypeImg(imgIcon),
    time: formateTime('', '-'),
    itemfile: itemfile,
    bankeid: bankeid
  }
  // console.log(info)
  info = JSON.stringify(info);
  axios
    .post("/api/userfav/add", {
      title: title ? title : itemfile.name,
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
export const sortFn = (property, sort) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    if (sort) {
      return value2 - value1;
    } else {
      return value1 - value2;
    }
  }
}