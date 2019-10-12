

var nativecode = {};


nativecode.ncall = function(funname, argobj){
    //console.log("nativecode, ncall:"+funname);
    try{
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
            var ua = navigator.userAgent;
            if (ua.indexOf('ExsoftIosWeb') > -1){
                //! ios平台; 使用prompt 用来hack
                let fullobj = {
                    funname:funname,
                    argobj:argobj,
                };
                szret = prompt(JSON.stringify(fullobj));
            }
        }

        let res = JSON.parse(szret);
        return res;

    }catch(e){
     //   console.log(e);
    }
    return null;
}

nativecode.getDownUrl=function(suburl)
{
    let url = "http://192.168.0.2:81";
  //  url = "http://192.168.40.116";
    if (process.env.NODE_ENV !== "development")
    {
        url = document.location.origin;
    }
    return url + suburl;
}



export default nativecode;