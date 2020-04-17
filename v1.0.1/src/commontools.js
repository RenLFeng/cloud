var commontools = {};


commontools.clone = function (obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(commontools.clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = commontools.clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

//! cjy: 此函数用于对象传递； vue的prop不改变obj对象
commontools.objMemberAssign = function (objto, objfrom) {
    if (typeof objfrom == 'object') {
        for (var j in objfrom) {
            objto[j] = objfrom[j];
        }
    }
    return;
}


commontools.timeGetHourDesc = function (timems) {
    timems = parseInt(timems);
    var timesec = timems / 1000;
    var timehour = timesec / 3600;
    timesec = timesec % 3600;
    var timemin = timesec / 60;
    timesec = timesec % 60;
    if (timehour > 99) {
        timehour = 99;
    }

    var szfmt = '%02i:%02i:%02i';
    var result = commontools.sprintf(szfmt, timehour, timemin, timesec);
    return result;

}

commontools.timeToHummanRead = function (timedate) {
    if (!commontools.timeIsValidTimedate(timedate)) {
        return '';
    }
    var t = commontools.timeTimedateToJsDate(timedate);
    var wdaydesc = commontools.timeWeekHummanread(t.getDay());
    var yearstrc = '';
    var curt = new Date();
    if (t.getFullYear() != curt.getFullYear()) {
        yearstrc = t.getFullYear() + '年';
    }
    var szfmt = '%s%i月%i日 %s %02i:%02i';
    return commontools.sprintf(szfmt, yearstrc, t.getMonth() + 1,
        t.getDate(), wdaydesc, t.getHours(), t.getMinutes());

}

//! return yyyy/mm/dd HH:ii:ss
commontools.timeJsDateToTimedate = function (datestr) {
    var date = new Date(datestr);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
}
commontools.timeIsValidTimedate = function (datestr) {
    if (!datestr) {
        return false;
    }
    var tindex = datestr.indexOf('0000-00', 0);
    if (tindex >= 0) {
        return false;
    }
    return true;
}

commontools.timeWeekHummanread = function (wday) {
    //return '周' + wday;
    var wobj = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        0: '周日'
    };
    if (wobj[wday]) {
        return wobj[wday];
    }
    return '';
}



commontools.timeTimedateToJsDate = function (timestr) {
    if (!timestr) {
        return new Date();
    }
    var t = Date.parse(timestr);
    if (!isNaN(t)) {
        return new Date(Date.parse(timestr.replace(/-/g, "/")));
    } else {
        return new Date();
    }

}





commontools.arrayAppend = function (curarray, mergearray, startpos, mergelength = -1) {
    if (mergelength < 0) {
        mergelength = mergearray.length;
    }
    for (var i = 0; i < mergelength && i < mergearray.length; i++) {
        curarray.splice(startpos + i, 0, mergearray[i]);
    }
}

//! 设定id从 大到小 排列， merge时也按此顺序
commontools.arrayMergeAsIds = function (curarray, mergearray) {
    // var skipindex = {};
    // var hasmix = false;
    // for(var i=0; i<curarray.length; i++){
    //     for(var j=mergearray.length-1; j>=0; j--){
    //         if (mergearray[j].id == curarray[i].id){
    //             curarray[i] = mergearray[j];
    //             skipindex[j] = 1;
    //             hasmix = true;
    //             break;
    //         }
    //     }
    // }
    // if (hasmix){
    //     //! clone.
    //     mergearray = commontools.clone(mergearray);
    //     for(var j=mergearray.length-1; j>=0; j--){
    //         if (skipindex[j]){
    //             mergearray.splice(j, 1);
    //         }
    //     }
    // }

    // console.log('arraymerge');

    if (!mergearray.length) {
        console.log('merge object');
        if (mergearray.id) {
            var tmpa = new Array();
            tmpa.push(mergearray);
            mergearray = tmpa;
        } else {
            console.log('drop merge');
            return;
        }

    }

    if (mergearray.length > 0) {
        if (curarray.length > 0) {
            var mergeindex = mergearray.length - 1;
            for (var i = curarray.length - 1; i >= 0; i--) {
                for (var j = mergeindex; j >= 0; j--) {
                    if (mergearray[j].id < curarray[i].id) {
                        curarray.splice(i, 0, mergearray[j]);
                        mergeindex = j - 1;
                    } else if (mergearray[j].id == curarray[i].id) {
                        //  curarray[i] = mergearray[j];
                        //! 保证vue相关update机制能触发
                        commontools.objMemberAssign(curarray[i], mergearray[i]);
                        //! 简单处理，删除?
                        mergeindex = j - 1;
                        break;
                    } else {
                        break;
                    }
                }
            }
            if (mergeindex >= 0) {
                commontools.arrayAppend(curarray, mergearray, 0, mergeindex + 1);
            }
        } else {
            commontools.arrayAppend(curarray, mergearray, 0);
        }
    }

    // console.log(curarray);
}


commontools.renderFileSizeDesc = function (value) {
    if (!value) {
        return "0 B";
    }
    var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2); //保留的小数位数
    size += ' ';
    return size + unitArr[index];
}

commontools.fileGetType = function (mimetype) {
    if (!mimetype) {
        return '';
    }
    if (mimetype.indexOf('image/') == 0) {
        return 'img';
    }
}

commontools.sprintf = require('sprintf-js').sprintf;


commontools.maxLength = function (v) {
    const temp = v;
    let maxlen = 6;
    if (temp && typeof temp == "string" && temp.length > maxlen) {
        let subV = temp.substr(0, maxlen);
        subV += '...';
        return subV;
    } else {
        return temp;
    }

}


// cjy： 统一使用 getZYFileType 和 defaultimg
// commontools.fileType = function (fitem) {
//         const fileType = ["txt", "rar", "xlsx", "docx", "ppt", "pdf"];
//         var r = require("../src/assets/file_icon/file.svg");
//         for (let v of fileType) {
//             if (fitem.filename.includes(v)) {
//                 r = require(`../src/assets/file_icon/${v}.svg`);
//             } else
//             if (fitem.filename.includes("doc") || fitem.filename.includes("rtf")) {
//                 r = require(`../src/assets/file_icon/docx.svg`);
//             } else
//             if (fitem.filename.includes("zip")) {
//                 r = require(`../src/assets/file_icon/rar.svg`);
//             } else
//             if (fitem.filename.includes("xls")) {
//                 r = require(`../src/assets/file_icon/xlsx.svg`);
//             }  else
//             if (fitem.filename.includes("mp4")) {
//                 r = require(`../src/assets/file_icon/MP4.png`);
//             }else
//             if (fitem.filename.includes("mp3")) {
//                 r = require(`../src/assets/file_icon/MP3.png`);
//             }
//             else {
//                 r = require(`../src/assets/file_default.png`);
//             }
//
//         }
//         return r;
//     },

    commontools.fileSnapPath = function (fitem) {
        if (fitem && fitem.metainfo && fitem.metainfo.snapsuffix) {
            if (fitem.filepath) {
                return fitem.filepath + fitem.metainfo.snapsuffix;
            }
        }
        return commontools.fileType;
    }

commontools.fmtDates = function (obj) {
    var date = new Date(obj);
    // console.log("格式化时间戳", date);

    var y = date.getFullYear();
    // console.log("y", y, date.getFullYear());

    var m = "0" + (date.getMonth() + 1);
    // console.log("m", m, date.getMonth());

    var d = "0" + date.getDate();
    // console.log("d", d, date.getDate());

    // 参数二可以省略
    // console.log(m.substring(1));

    // substring() 用于提取字符串中 介于 两个指定下标之间的字符。
    return y + "-" + m.substring(m.length - 2, m.length) + "-" +

        d.substring(d.length - 2, d.length);
}
commontools.longTime = function (time) {
    if (!time) return;
    // console.log('ndkld;lvds;lgm',time)
    var now = new Date().getTime();
    // 下面两种转换格式都可以。
    // var tmpTime = Date.parse(new Date(time.replace(/-/gi,"/")));
    var tmpTime = Date.parse(time.replace(/-/gi, "/"));
    // console.log(now, time, tmpTime);

    // 返回值
    var result;
    // 一分钟 1000 毫秒 乘以 60
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var year = day * 365;
    // 现在时间 减去 传入时间 得到差距时间
    var diffValue = now - tmpTime;
    // 小于 0 直接返回
    // if (diffValue < 0) {
    //     return;
    // }

    // console.log(diffValue);

    // 计算 差距时间除以 指定时间段的毫秒数 
    var yearC = diffValue / year;
    var monthC = diffValue / month;
    var weekC = diffValue / week;
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    switch (true) {
        case yearC >= 1:
            // console.log("switch 年",yearC);
            // 如果大于一年就显示具体日期
            result = commontools.fmtDates(tmpTime);
            break;
        case monthC >= 1:
            // console.log("switch 月",monthC);
            result = "" + parseInt(monthC) + "月前";
            break;
        case weekC >= 1:
            // console.log("switch 周",weekC);
            result = "" + parseInt(weekC) + "周前";
            break;
        case dayC >= 1:
            // console.log("switch 日",dayC);
            result = "" + parseInt(dayC) + "天前";
            break;
        case hourC >= 1:
            // console.log("switch 时",hourC);
            result = "" + parseInt(hourC) + "小时前";
            break;
        case minC >= 1:
            // console.log("switch 分",minC);
            result = "" + parseInt(minC) + "分前";
            break;
        default:
            result = '刚刚'
            break;

    }
    return result;
}
export default commontools;