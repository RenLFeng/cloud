import Vue from 'vue'
import "@vant/touch-emulator/index";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
Vue.use(ImagePreview);
var nativecode = {};


//! https://www.npmjs.com/package/weixin-js-sdk

nativecode.detectplatform = function () {
    var ua = navigator.userAgent;
    console.log(ua);
    //alert(ua);
    if (ua.indexOf('ExsoftIosWeb') > -1) {
        return 'exsoftios';
    }
    if (ua.indexOf('miniProgram') > -1 ||
        ua.indexOf('wechatdevtools') > -1
    ) {
        return 'miniprogram';
    }
    if (window.ExsoftAndroid) {
        return 'exsoftandroid';
    }
    if (window.ExsoftWindows) {

        //! 检测是否是大屏端
        if (ua.indexOf('WebDaPing') > -1) {
            return 'exsoftdaping';
        }

        return 'exsoftwindows';
    }

    //! 测试
    // return 'exsoftdaping';

    return '';
}

nativecode.platform = nativecode.detectplatform()
nativecode.os = ''; //! os 类型




nativecode.hassign = function () {
    //! cjy: 简单起见，目前仅微信开启签到功能
    if (nativecode.platform == 'miniprogram') {
        return true;
    }
    return false;
}

nativecode.parseurlparam = function (paraName) {
    var url = document.location.toString();

    var arrObj = url.split("?");



    if (arrObj.length > 1) {

        var arrPara = arrObj[1].split("&");

        var arr;



        for (var i = 0; i < arrPara.length; i++) {

            arr = arrPara[i].split("=");



            if (arr != null && arr[0] == paraName) {

                return arr[1];

            }

        }

        return "";

    } else {

        return "";

    }
}

//! 初始化； 调一次， 设置cookie等
nativecode.initfirst = function () {
    console.log('nativecode.initfirst');
    if (nativecode.platform == 'miniprogram') {
        try {
            let szcookie = nativecode.parseurlparam('cookie');
            //   console.log(szcookie);
            let nindex = szcookie.indexOf('#');
            if (nindex > 0) {
                szcookie = szcookie.substr(0, nindex);
            }
            if ((szcookie.length) > 0) {
                let cookie = require('js-cookie');
                cookie.set('EXSOFTSSID', szcookie, {
                    expires: 36,
                    path: '/'
                });
                // console.log(szcookie);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

//! 是否有登陆页
nativecode.hasloginpage = function () {
    //return false;
    if (nativecode.platform == 'miniprogram') {
        return false;
    }
    return true;
}

//！ 是否能够绑定用户
nativecode.canbindaccount = function () {
    //return true;
    if (nativecode.platform == 'miniprogram') {
        return true;
    }
    return false;
}

//! 是否有导航栏
nativecode.hasnavbar = function () {
    return true;
    if (nativecode.platform == 'miniprogram') {
        return false;
    }
    return true;
}

//! 是否有主页返回键
nativecode.hasmainback = function () {
    if (nativecode.platform.length > 0) {
        if (nativecode.platform == 'miniprogram') {
            return false;
        }
        return true;
    }
    return false;
}


//import wx from 'weixin-js-sdk';

nativecode.getwx = function () {
    let wx = require('weixin-js-sdk');
    return wx;
}

nativecode.hassharebanke = function () {
    if (nativecode.platform == 'miniprogram') {
        return true;
    }
    return false;
}
nativecode.dosharebanke = function (bankeitem) {
    if (nativecode.platform == 'miniprogram') {
        let shareobj = {
            id: bankeitem.id,
            name: bankeitem.name,
            avatar: bankeitem.avatar
        };
        let tourl = '/pages/share/banke';
        tourl += '?args=';
        tourl += encodeURIComponent(JSON.stringify(shareobj));

        let wx = nativecode.getwx();

        wx.miniProgram.navigateTo({
            url: tourl
        });
    }
}

nativecode.navigateTo = function (path) {

    //! 方便调试， 有navbar不navigate
    if (nativecode.hasnavbar()) {
        return false;
    }


    if (nativecode.platform == 'miniprogram') {

        let tourl = '/pages/web/page';
        tourl += '?url=';
        tourl += encodeURIComponent('/#' + path);

        let wx = nativecode.getwx();

        wx.miniProgram.navigateTo({
            url: tourl
        });


        return true;
    }
    return false;
}

nativecode.navigateToSign = function (bankeid, isteacher, curbanke) {
    let wx = nativecode.getwx();
    let argobj = {
        bankeid: bankeid,
        role: isteacher ? 10 : 5,
        //  bankename:''
    };
    // if (curbanke){
    //     argobj.bankename = curbanke.name;
    // }
    let tourl = '/pages/location/sign';
    tourl += '?args=' + encodeURIComponent(JSON.stringify(argobj));
    wx.miniProgram.navigateTo({
        url: tourl
    });
}

nativecode.wxcall = function (funname, argobj) {
    console.log("wxcall");
    let wx = require('weixin-js-sdk');
    console.log(wx);

    // let Base64 = require('js-base64').Base64;

    let tourl = "";

    if (funname == "jsFileLink" ||
        funname == 'jsUrlLink'
    ) {
        tourl = "/pages/files/view";

        //alert(JSON.stringify(wx.getLocation()));
    }
    if (tourl == '') {
        return null;
    }

    let wxoargs = {
        funname: funname,
        argobj: argobj
    }
    let szargs = JSON.stringify(wxoargs);

    let szuri = encodeURIComponent(szargs);

    tourl += "?args=" + szuri;

    console.log("wx navigateto:" + tourl);

    wx.miniProgram.navigateTo({
        url: tourl
    });
    return {};
}


nativecode.issupportfun = function (funname) {
    if (nativecode.platform == 'miniprogram') {
        //  if (funname == 'jsFileLink'){
        //     return false;
        // }
        //  //！ 微信端， 大部分的原生函数均不支持
        //  return false;
    }

    return true;
}



nativecode.ncall = function (funname, argobj) {
    //console.log("nativecode, ncall:"+funname);

    if (process.env.NODE_ENV == "development"
        //&& nativecode.platform == ''
    ) {
        console.log('nativecode.platform:' + nativecode.platform + 'ncall:' + funname + " argobj:" + JSON.stringify(argobj));
    }

    try {

        if (!nativecode.issupportfun(funname)) {
            return null;
        }

        if (nativecode.platform == 'miniprogram') {
            return nativecode.wxcall(funname, argobj);
        }


        let szret = "";
        if (!argobj) {
            argobj = {};
        }
        if (window.ExsoftAndroid) {
            //! android 平台

            szret = window.ExsoftAndroid.ncall(funname, JSON.stringify(argobj));
            // console.log("nativecode, android ret:"+szret);
        } else if (window.ExsoftWindows) {
            //! windows 平台
            let fullobj = {
                funname: funname,
                argobj: argobj,
            };
            szret = window.ExsoftWindows(JSON.stringify(fullobj));
        } else {
            //! 判断ios
            if (nativecode.platform == 'exsoftios') {
                //! ios平台; 使用prompt 用来hack
                let fullobj = {
                    funname: funname,
                    argobj: argobj,
                };
                szret = prompt(JSON.stringify(fullobj));
            }
        }

        if (szret == "") {
            if (nativecode.platform.length > 0) {
                return {};
            }
            return null;
        }

        try {
            let res = JSON.parse(szret);
            return res;
        } catch (e) {
            return {
                ret: szret
            };
        }

    } catch (e) {
        console.log(e);
    }

    return null;
}

nativecode.jsLogin = function (login, user) {
    let loginobj = {
        login: login,
        user: user
    };
    if (login) {
        // loginobj.cookie = document.cookie;
    } else {
        // loginobj.cookie = {};
    }
    nativecode.ncall("jsLogin", loginobj);
}


nativecode.getDownUrl = function (suburl) {
    let url = "http://192.168.0.2:81";
    //  url = "http://192.168.40.116";
    url = "http://192.168.40.104:9982";
    if (process.env.NODE_ENV !== "development") {
        url = document.location.origin;
    }
    return url + suburl;
}
nativecode.getDownUrl2 = function (suburl) {
    let url = "http://192.168.0.2:9982";
    //  url = "http://192.168.40.116";
    if (process.env.NODE_ENV !== "development") {
        url = document.location.origin;
    }
    if (!suburl.includes('downloads') && suburl.includes('svg')) {
        return `${url}/${suburl}`
    } else {
        return `${url}${suburl}`
    }
}
nativecode.getUsedUrl = function (suburl) {
    if (suburl.length > 0) {
        if (suburl[0] != '/') {
            return suburl;
        }
    }
    return nativecode.getDownUrl(suburl);
}
nativecode.previewImage = function (vuethis, objargs) {
    if (typeof objargs == 'string') {
        let useurl = objargs;
        //if (useurl.indexOf(''))
        useurl = nativecode.getUsedUrl(useurl);
        console.log('useurl',useurl);
        let robj = {
            current: useurl
        }
        objargs = robj;
    }
    if (!objargs.current) {
        objargs.current = objargs.urls[objargs.index];
    } else if (!objargs.urls) {
        objargs.urls = [];
        objargs.urls.push(objargs.current);
        objargs.index = 0;
    }
    if (nativecode.platform == 'miniprogram') {
        let wx = nativecode.getwx();
        wx.previewImage({
            current: objargs.current,
            urls: objargs.urls
        })
    } else {
        // let obj = {
        //     isPreview: false,
        //     //        previewLoadFile:item,
        //     images: objargs.urls,
        //     show: true,
        //     index: objargs.index
        // };
        ImagePreview({
            images: objargs.urls,
            startPosition: objargs.index,
        });
        // vuethis.$store.commit("SET_PREVIEW", obj, "");
    }
}

nativecode.isimageobj = function (fitem) {
    if (typeof fitem.filetype != 'undefined') {
        if (fitem.filetype == 1) {
            return true;
        }
        return false;
    }
    if (typeof fitem.filepath == 'string') {
        let fpath = fitem.filepath;
        if (fpath.indexOf('.jpg') > 0 || fpath.indexOf('.png') > 0 || fpath.indexOf('.jpeg') > 0) {
            return true;
        }
    }
    return false;
}


nativecode.fileviewSingle = function (vuethis, fitem) {
    if (!fitem.filepath && fitem.url) {
        fitem.filepath = fitem.url;
    }

    fitem.downurl = nativecode.getUsedUrl(fitem.filepath);
    if (nativecode.isimageobj(fitem)) {
        nativecode.previewImage(vuethis, fitem.downurl);
        return;
    }
    // nativecode.ncall('jsFileLink', fitem);
    nativecode.ncallFileLink(fitem);
    return;
}

import {
    Toast,
} from "mint-ui";

nativecode.ncallFileLink = function (fitem) {
    //onsole.log('';
    let oret = nativecode.ncall('jsFileLink', fitem);
    //  console.log(oret);
    if (!oret) {
        //console.log('toast');
        //Toast('请在应用程序中查看');
        //！ 创建下载链接
        let url = fitem.downurl;
        let down = document.createElement("a");
        down.href = url;
        //! cjy: 不用处理下载文件名； 服务器自动设置
        document.body.appendChild(down);
        down.click();
        down.remove();
    }
}

nativecode.fileview = function (vuethis, fitem) {
    if (typeof fitem.ftype == 'string') {
        if (fitem.ftype == 'file') {
            return nativecode.fileviewSingle(vuethis, fitem);
        } else if (fitem.ftype == 'link') {
            return nativecode.fileviewUrl(vuethis, fitem);
        }
    }
    return nativecode.fileviewSingle(vuethis, fitem);
}

nativecode.fileviewUrl = function (vuethis, fitem) {
    let oret = nativecode.ncall('jsUrlLink', fitem);
    if (!oret){
       // console.log(fitem);
        let url = fitem.url;
        if (!(url.indexOf('http://') == 0 || url.indexOf('https://') == 0)){
            url = 'http://' + url;
        }
        window.open(url);
    }
    return;
}


/*
  objargs: items:
  index: current
 */
nativecode.fileviewZuoye = function (vuethis, objargs) {
    let items = [];
    let cindex = objargs.index;
    let isimage = false;
    for (let i = 0; i < objargs.items.length; i++) {
        if (objargs.items[i].serverData) {
            items.push(objargs.items[i].serverData);
        } else {
            items.push(objargs.items[i]);
        }
    }
    if (
        //items[cindex].filetype == 1
        nativecode.isimageobj(items[cindex])
    ) {
        isimage = 1;
    }
    //console.log(items);
    //console.log('fileviewzuoye:' + isimage);
    if (isimage) {
        let imgs = [];
        let jindex = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].filetype == 1) {
                imgs.push(nativecode.getUsedUrl(items[i].filepath));
                if (i == cindex) {
                    jindex = imgs.length - 1;
                }
            }
        }
        nativecode.previewImage(vuethis, {
            current: imgs[jindex],
            urls: imgs,
            index: jindex
        })
        return;
    }
    let citem = items[cindex];
    citem.downurl = nativecode.getUsedUrl(citem.filepath);
    //  nativecode.ncall('jsFileLink', citem);
    nativecode.ncallFileLink(citem);
}


export default nativecode;