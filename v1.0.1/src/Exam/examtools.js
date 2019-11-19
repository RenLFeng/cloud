

var tools = {};


tools.selitemGetTitle = function(itemstr){
    var retstr = itemstr || '';
    var slen = retstr.length;

    for (var i=1; i<slen && i<3; i++){
        if (retstr[i] == '.' || retstr[i] == ' '){
            return retstr.substring(0, i);
        }
    }
    var sublen = 3;
    if (sublen > slen){
        sublen = slen;
    }
    return retstr.substring(0, sublen);
}

tools.getDefaultExamState = function(){
    return {
        state:'ready',  //! 当前考试状态: ready:准备考试  do:正在考试   finish:已完成考试
        starttime:'',  //！ 考试开始时间
        answersheet:{},  //! 答题卡； 一般包括每题答案， 题目标记等
        curitemindex:0,
        maxitemindex:0,
    }
}


tools.getItemType=function(examitem)
{
    if (typeof examitem.sels != 'undefined'){
        return 'sel';
    }
    return 'unkown';
}

tools.getItemTypeDesc = function(examitem){
    if (typeof examitem.sels != 'undefined'){
        //! 选择题系列
        return '选择题';
    }
    return '未知题目';
}

tools.reorderPaperItemList=function(itemids, itemlist){
    var i ,j;
    var tmplist = [];
    var downlist = itemlist;
    for(i=0; i<itemids.length; i++){
        for(j=0; j<downlist.length; j++){
            if (downlist[j].id == itemids[i]){
                tmplist.push(downlist[j]);
                break;
            }
        }
    }
    return tmplist;
}


tools.getScoreDesc=function(examitem){
    if (typeof examitem.score != 'undefined'){
        var retstr = examitem.score;
        retstr += ' 分';
        return retstr;
    }
    return '0 分';
}

tools.fillMenuAddExamItem=function(menuarray, vueobj)
{
    menuarray.push({
        name:'新增选择题',
        method:function(){
            vueobj.$router.push('/examitemaddsel');
        }
    })
}




export default tools;