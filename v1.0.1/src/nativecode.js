

var nativecode = {};


//! https://www.npmjs.com/package/weixin-js-sdk

nativecode.detectplatform = function()
{
    var ua = navigator.userAgent;
    console.log(ua);
    if (ua.indexOf('ExsoftIosWeb') > -1){
        return 'exsoftios';
    }
    if (ua.indexOf('miniProgram') > -1){
        return 'miniprogram';
    }
    if (window.ExsoftAndroid){
        return 'exsoftandroid';
    }
    if (window.ExsoftWindows){

        //! 检测是否是大屏端
        if (ua.indexOf('WebDaPing') > -1){
            return 'exsoftdaping';
        }

        return 'exsoftwindows';
    }
    return '';
}

nativecode.platform = nativecode.detectplatform()
nativecode.os = ''; //! os 类型




nativecode.parseurlparam = function(paraName)
{
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

    }

    else {

        return "";

    }
}

//! 初始化； 调一次， 设置cookie等
nativecode.initfirst = function()
{
    console.log('nativecode.initfirst');
    if (nativecode.platform == 'miniprogram')
    {
        try{
            let szcookie = nativecode.parseurlparam('cookie');
            //   console.log(szcookie);
            let nindex = szcookie.indexOf('#');
            if (nindex > 0){
                szcookie = szcookie.substr(0, nindex);
            }
            if ((szcookie.length) > 0){
                let cookie = require('js-cookie');
                cookie.set('EXSOFTSSID', szcookie, {expires:36, path:'/'});
                // console.log(szcookie);
            }
        }catch(e){
            console.log(e);
        }
    }
}

//! 是否有登陆页
nativecode.hasloginpage = function(){
    //return false;
    if (nativecode.platform == 'miniprogram'){
        return false;
    }
    return true;
}

//！ 是否能够绑定用户
nativecode.canbindaccount = function()
{
    //return true;
    if (nativecode.platform == 'miniprogram'){
        return true;
    }
    return false;
}

//! 是否有导航栏
nativecode.hasnavbar = function()
{
    return true;
    if (nativecode.platform == 'miniprogram'){
        return false;
    }
    return true;
}

//! 是否有主页返回键
nativecode.hasmainback = function()
{
    if (nativecode.platform.length > 0){
        if (nativecode.platform == 'miniprogram'){
            return false;
        }
        return true;
    }
    return false;
}


//import wx from 'weixin-js-sdk';

nativecode.getwx = function(){
    let wx = require('weixin-js-sdk');
    return wx;
}

nativecode.navigateTo = function(path)
{

    //! 方便调试， 有navbar不navigate
    if (nativecode.hasnavbar()){
        return false;
    }


    if (nativecode.platform == 'miniprogram'){

        let tourl = '/pages/web/page';
        tourl += '?url=';
        tourl += encodeURIComponent('/#' + path);

        let wx = nativecode.getwx();

        wx.miniProgram.navigateTo({url:tourl});


        return true;
    }
    return false;
}

nativecode.navigateToSign = function(bankeid)
{
    let wx = nativecode.getwx();
    let argobj = {
        bankeid:bankeid
    };
    let tourl = '/pages/location/sign';
    tourl += '?args=' + encodeURIComponent(JSON.stringify(argobj));
    wx.miniProgram.navigateTo({url:tourl});
}

nativecode.wxcall = function(funname, argobj)
{
    console.log("wxcall");
    let wx = require('weixin-js-sdk');
    console.log(wx);

    // let Base64 = require('js-base64').Base64;

    let tourl = "";

    if (funname == "jsFileLink"){
        tourl = "/pages/files/view";

       //alert(JSON.stringify(wx.getLocation()));
    }
    if (tourl == ''){
        return null;
    }

    let wxoargs = {
        funname:funname,
        argobj:argobj
    }
    let szargs = JSON.stringify(wxoargs);

    let szuri = encodeURIComponent(szargs);

    tourl += "?args=" + szuri;

    console.log("wx navigateto:"+tourl);

    wx.miniProgram.navigateTo({url:tourl});
    return {};
}


nativecode.issupportfun = function(funname)
{
    if (nativecode.platform == 'miniprogram'){
        //  if (funname == 'jsFileLink'){
        //     return false;
        // }
        //  //！ 微信端， 大部分的原生函数均不支持
        //  return false;
    }

    return true;
}



nativecode.ncall = function(funname, argobj){
    //console.log("nativecode, ncall:"+funname);
    try{

        if (!nativecode.issupportfun(funname)){
            return null;
        }

        if (nativecode.platform == 'miniprogram'){
            return nativecode.wxcall(funname, argobj);
        }


        let szret = "";
        if (!argobj){
            argobj = {};
        }
        if (window.ExsoftAndroid){
            //! android 平台

            szret = window.ExsoftAndroid.ncall(funname, JSON.stringify(argobj));
            // console.log("nativecode, android ret:"+szret);
        }
        else if (window.ExsoftWindows){
            //! windows 平台
            let fullobj = {
                funname:funname,
                argobj:argobj,
            };
            szret = window.ExsoftWindows( JSON.stringify(fullobj));
        }
        else {
            //! 判断ios
            if (nativecode.platform == 'exsoftios'){
                //! ios平台; 使用prompt 用来hack
                let fullobj = {
                    funname:funname,
                    argobj:argobj,
                };
                szret = prompt(JSON.stringify(fullobj));
            }
        }

        if (szret == ""){
            return null;
        }

        try{
            let res = JSON.parse(szret);
            return res;
        }catch(e){
            return {
                ret:szret
            };
        }

    }catch(e){
          console.log(e);
    }
    if (process.env.NODE_ENV == "development"){
        console.log('nativecode.platform:'+ nativecode.platform +'ncall:' + funname + " argobj:"+JSON.stringify(argobj));
    }
    return null;
}

nativecode.jsLogin = function(login, user)
{
    let loginobj = {
        login:login,
        user:user
    };
    if (login){
       // loginobj.cookie = document.cookie;
    }
    else{
       // loginobj.cookie = {};
    }
    nativecode.ncall("jsLogin", loginobj);
}


nativecode.getDownUrl=function(suburl)
{
    let url = "http://192.168.0.2:81";
    //  url = "http://192.168.40.116";
    url = "http://192.168.40.104:9982";
    if (process.env.NODE_ENV !== "development")
    {
        url = document.location.origin;
    }
    return url + suburl;
}
nativecode.getDownUrl2=function(suburl)
{
    let url = "http://192.168.0.2:9982";
  //  url = "http://192.168.40.116";
    if (process.env.NODE_ENV !== "development")
    {
        url = document.location.origin;
    }
    if(!suburl.includes('downloads') && suburl.includes('svg')){
        return `${url}/${suburl}`
    }else{
        return  `${url}${suburl}`
    }
    
}


export default nativecode;