

var tools = {};



tools.userroledesc = function(userrole)
{
    if (!userrole){
        return '游客';
    }
    if (userrole >= 10){
        return '教师';
    }
    return '学员';
}

//! cjy: 对应控件 FileAttachList  本地文本转换为server文本
tools.filelistFromLocalfiles = function(localfiles)
{
    var ret = [];
    console.log(localfiles);
    if (!localfiles || !localfiles.length){
        return ret;
    }
    for(var i=0; i<localfiles.length; i++){
        {
            if (localfiles[i].serverData){
                ret.push(localfiles[i].serverData);
            }
        }
    }
    return ret;
}
tools.localfilesFromFilelist = function(filelist)
{
    var ret = [];
    if (!filelist || !filelist.length){
        return ret;
    }
    for(var i=0; i<filelist.length; i++){
        var fobj = {};
        var fitem = filelist[i];

        if (!fitem.filepath){
            continue;
        }

        fobj.serverData = filelist[i];
        if (fobj.serverData.metainfo){
            //! 有缩略图
            if (typeof fitem.metainfo == "string"){
                fitem.metainfo = JSON.parse(fitem.metainfo);
            }
            if (fitem.filepath && fitem.metainfo &&  fitem.metainfo.snapsuffix){
                fobj.imgsrc = fitem.filepath + fitem.metainfo.snapsuffix;
                fobj.w = fitem.metainfo.w;
                fobj.h = fitem.metainfo.h;
            }
        }
        //! 其他信息
        fobj.mimetype = fitem.contenttype;
        fobj.filename = fitem.filename;
        fobj.filesize = fitem.filesize;
        fobj.filepath = fitem.filepath;
        ret.push(fobj);
    }
    return ret;
}






export default tools;