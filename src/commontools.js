

var commontools = {};


commontools.clone = function(obj) {
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
commontools.objMemberAssign = function(objto, objfrom)
{
    if (typeof objfrom == 'object'){
        for( var j in objfrom){
            objto[j] = objfrom[j];
        }
    }
    return;
}


commontools.timeGetHourDesc=function(timems)
{
    timems = parseInt(timems);
    var timesec = timems / 1000;
    var timehour = timesec / 3600;
    timesec = timesec %3600;
    var timemin = timesec / 60;
    timesec = timesec %60;
    if (timehour > 99){
        timehour = 99;
    }

    var szfmt = '%02i:%02i:%02i';
    var result = commontools.sprintf(szfmt, timehour, timemin, timesec);
    return result;

}

commontools.timeToHummanRead = function(timedate)
{
    if (!commontools.timeIsValidTimedate(timedate)){
        return '';
    }
    var t = commontools.timeTimedateToJsDate(timedate);
    var wdaydesc = commontools.timeWeekHummanread(t.getDay());
    var yearstrc= '';
    var curt = new Date();
    if (t.getFullYear() != curt.getFullYear()){
        yearstrc = t.getFullYear() + '年';
    }
    var szfmt = '%s%i月%i日 %s %02i:%02i';
    return commontools.sprintf(szfmt, yearstrc, t.getMonth()+1,
        t.getDate(), wdaydesc, t.getHours(), t.getMinutes());

}

//! return yyyy-mm-dd HH:ii:ss
commontools.timeJsDateToTimedate=function(datestr)
{
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
    var second= date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;
}

commontools.timeIsValidTimedate = function(datestr)
{
    if (!datestr){
        return false;
    }
    var tindex = datestr.indexOf('0000-00', 0);
    if (tindex >= 0){
        return false;
    }
    return true;
}

commontools.timeWeekHummanread=function(wday)
{
    //return '周' + wday;
    var wobj = {
        1:'周一',
        2:'周二',
        3:'周三',
        4:'周四',
        5:'周五',
        6:'周六',
        0:'周日'
    };
    if (wobj[wday]){
        return wobj[wday];
    }
    return '';
}



commontools.timeTimedateToJsDate=function(timestr)
{
    if (!timestr){
        return new Date();
    }
    var t = Date.parse(timestr);
    if (!isNaN(t)) {
        return new Date(Date.parse(timestr.replace(/-/g, "/")));
    } else {
        return new Date();
    }

}





commontools.arrayAppend = function(curarray, mergearray, startpos, mergelength=-1)
{
    if (mergelength < 0){
        mergelength = mergearray.length;
    }
    for(var i=0; i<mergelength && i<mergearray.length; i++){
        curarray.splice(startpos+i, 0, mergearray[i]);
    }
}

//! 设定id从 大到小 排列， merge时也按此顺序
commontools.arrayMergeAsIds = function(curarray, mergearray){
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

    if (!mergearray.length){
        console.log('merge object');
        if (mergearray.id){
            var tmpa = new Array();
            tmpa.push(mergearray);
            mergearray = tmpa;
        }
        else{
            console.log('drop merge');
            return;
        }

    }

    if (mergearray.length > 0){
        if (curarray.length > 0){
            var mergeindex = mergearray.length-1;
            for(var i=curarray.length-1; i>=0; i--){
                for(var j=mergeindex; j>=0; j--){
                    if (mergearray[j].id < curarray[i].id){
                        curarray.splice(i, 0,mergearray[j] );
                        mergeindex = j-1;
                    }
                    else if (mergearray[j].id == curarray[i].id){
                      //  curarray[i] = mergearray[j];
                        //! 保证vue相关update机制能触发
                        commontools.objMemberAssign(curarray[i], mergearray[i]);
                        //! 简单处理，删除?
                        mergeindex = j-1;
                        break;
                    }
                    else{
                        break;
                    }
                }
            }
            if (mergeindex >= 0){
                commontools.arrayAppend(curarray, mergearray, 0, mergeindex+1);
            }
        }
        else{
            commontools.arrayAppend(curarray, mergearray, 0);
        }
    }

   // console.log(curarray);
}


commontools.renderFileSizeDesc = function(value){
    if(!value){
        return "0 B";
    }
    var unitArr = new Array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
    var index=0;
    var srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1024));
    var size =srcsize/Math.pow(1024,index);
    size=size.toFixed(2);//保留的小数位数
    size += ' ';
    return size+unitArr[index];
}

commontools.fileGetType = function(mimetype)
{
    if (!mimetype){
        return '';
    }
    if (mimetype.indexOf('image/') == 0){
        return 'img';
    }
}

commontools.sprintf  = require('sprintf-js').sprintf;






export default commontools;