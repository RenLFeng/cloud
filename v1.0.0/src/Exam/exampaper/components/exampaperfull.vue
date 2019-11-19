<template>
    <div>
        <div v-if="examstate.state == 'ready'">
            <div class="tc">
                <exampaperbasicinfo :exampaper="exampaper"></exampaperbasicinfo>
                <mt-button type="primary" size="large" class="startbtn" @click="onStart">开始考试</mt-button>
            </div>

        </div>
        <div v-else-if="examstate.state == 'do'">
            <div>
                <div class="doheader">
                    <div class="headernav">
                        <span class="timedesc fontsmall">{{examtimestr}}</span>
                        <mt-button  size="small" :class="btnsubmitclass" style="margin-left:10px;" @click="doSubmit">交卷</mt-button>
                    </div>

                    <mt-button size="small" :class="markbtnclass" @click="domark">{{markbtntext}}</mt-button>
                </div>

                <div class="examitembody">
                    <examitemfull :examitem="curitem"></examitemfull>
                </div>

                <div class="dofooter">
                    <div class="footernav">
                        <mt-button size="small" @click="onpreitem">上一题</mt-button>
                        <mt-button size="small" class="btnnav" style="margin-left:10px;" @click="onPopupItemList">题目列表</mt-button>

                        <mt-button size="small" type="primary" style="margin-left:10px;" @click="onnextitem">下一题</mt-button>
                    </div>
                    <div class="indexcontainer">
                        <span class="indexdesc fontsmall">{{indexdesc}}</span>
                    </div>

                </div>

            </div>
        </div>
        <div v-else>
            <div>

            </div>
        </div>


        <mt-popup v-model="popupVisibleItemList" position="bottom" class="mint-popup-4">
            <div class="popupitemlist fontnormal">
                <div class="itemlistdarkbk itemlistheader">
                    <div class="listpartindex">题序</div>
                    <div class="listpartdostate">状态</div>
                    <div class="listpartmark">标记</div>
                </div>
                <ul class="itemlistul">
                    <li v-for="(item,sindex) in itemlistdostate"  v-bind:key='sindex' class="itemlistli">
                        <div class="listpartindex" @click="doJumpItem(sindex)">{{getItemIndexDesc(sindex)}}</div>
                        <div class="listpartdostate"><span :class="item.doclass" @click="doJumpItem(sindex)">{{item.dostr}}</span></div>
                        <div class="listpartmark"><span :class="item.markclass" @click="doJumpItem(sindex)">{{item.markstr}}</span></div>
                    </li>
                </ul>
            </div>

        </mt-popup>
    </div>
</template>

<script>

    import examitemfull from '../../examitem/components/examitemfull'
    import exampaperbasicinfo from './exampaperbasicinfo'
    import commontools from '../../../commontools'
    import examtools from '../../examtools'

    import { Toast,MessageBox } from 'mint-ui';

    //!
    export default {
        name: "exampaperfull",
        props:{
            exampaper:{
                type:Object,
                default(){
                    return {
                        title:'',
                        timelimit:'',
                        totalscore:0,
                        itemdetaillist:[]
                    }
                }
            },
            examstate:{   //! 状态类做为props， 方便考试断线重连等异常场景
                type:Object,
                default(){
                    return examtools.getDefaultExamState();
                }
            }
        }
        ,destroyed:function(){
            if (this.examtimer){
                clearInterval(this.examtimer);
                this.examtimer = null;
            }
        }
        ,data(){
            return {
                popupVisibleItemList:false
                ,curtime:null
                ,examtimer:null   //! 定时器
            }
        }
        ,computed:{
            examtimestr:function(){
                if (!this.examstate.starttime){
                    return '';
                }
                if (!this.curtime){
                    return '';
                }
                var szfmt = '考试时间  %1$s';
                if (this.exampaper.timelimit > 0){
                    szfmt = '剩余时间  %1$s';
                }
                var timedif = this.curtime.getTime() - this.examstate.starttime.getTime();
                if (timedif < 0){
                    timedif = 0;
                }
                if (this.exampaper.timelimit > 0){
                    var limitmsec = this.exampaper.timelimit * 60 * 1000;
                    timedif = limitmsec - timedif;
                    if (timedif < 0){
                        timedif = 0;
                    }
                }

                //console.log(timedif);

                var timestr = commontools.timeGetHourDesc(timedif);
                return commontools.sprintf(szfmt, timestr);
            },
            btnsubmitclass:function(){
                if (this.showsubmit){
                    return 'btnsubmit';
                }
                return '';
            },
            itemlistdostate:function(){
                var objs = [];
                var ea = this.examstate.answersheet;
                if (!ea || !this.exampaper.itemdetaillist){
                    return objs;
                }
                for(var i=0; i<this.exampaper.itemdetaillist.length; i++){
                    var obj = {
                        dostr:'未做',
                        doclass:'itemliststateunfinish',
                        markstr:'',
                        markclass:'',
                    };
                    if (i == this.examstate.curitemindex){
                        obj.dostr = '做题中';
                        obj.doclass = 'itemliststatefinish';
                    }
                    else if (ea[i] && ea[i].dostate){
                        if (ea[i].dostate == 'finish'){
                            obj.dostr = '已完成';
                            obj.doclass = 'itemliststatefinish';
                        }
                        else if (ea[i].dostate == 'unfinish'){
                            obj.dostr = '未完成';  //！ cjy: 只做了部分，例如： 填空题
                        }
                    }
                    if (ea[i]){
                        if (ea[i].marked){
                            obj.markstr = '已标记';
                            obj.markclass='itemliststatemark';
                        }


                    }
                    objs.push(obj);
                }
                return objs;
            }
            ,curitem:function(){
                var es = this.examstate;
                if (es.curitemindex <0 || es.curitemindex >= this.exampaper.itemdetaillist.length){
                    return {};
                }
                return this.exampaper.itemdetaillist[es.curitemindex];
            }
            ,indexdesc:function(){
                var szfmt = '%1$s / %2$s';
                var szret = commontools.sprintf(szfmt, this.examstate.curitemindex+1, this.exampaper.itemdetaillist.length);
                return szret;
            }
            ,showsubmit:function(){
                if (this.examstate.maxitemindex >= this.exampaper.itemdetaillist.length-1){
                    return true;
                }
                return false;
            }
            ,curmarked:function(){
                var bmarked = false;
                var ea = this.examstate;
                var as = this.getAnswerSheet(ea.curitemindex);
            //    console.log(as);
                if (as.marked){
                    bmarked = true;
                }
                return bmarked;
            }
            ,markbtntext:function(){
                var bmarked = this.curmarked;
                if (bmarked){
                    return '取消题目标记';
                }
                return '标记当前题目'
            }
            ,markbtnclass:function(){
                var bmk = this.curmarked;
                if (bmk){
                    return 'markactive';
                }
                return '';
            }
        }
        ,methods:{
            onStart:function(){
                this.examstate.state = 'do';
                this.curtime = new Date();
                this.examstate.starttime = this.curtime;
                if (!this.examtimer){
                    //! 启动定时器
                    var othis = this;
                    this.examtimer = setInterval(function(){
                        othis.onTimer();
                    }, 1000);
                }
            }
            ,onTimer:function(){
                //! 更新当前时间，触发刷新
                this.curtime = new Date();
            }
            ,onStop:function(){

            }
            ,onPopupItemList:function(){
                this.popupVisibleItemList = true;
            }
            ,getItemIndexDesc:function(nindex){
                return nindex+1;
            }
            ,doJumpItem:function(nindex){
                this.popupVisibleItemList = false;
                this.setCurItemIndex(nindex);
            }
            ,setCurItemIndex(nindex){
                var oldindex = this.examstate.curitemindex;
                if (nindex != oldindex){
                    if (nindex >= 0 && nindex<this.exampaper.itemdetaillist.length){
                        this.examstate.curitemindex = nindex;

                        if (this.examstate.maxitemindex < this.examstate.curitemindex){
                            this.examstate.maxitemindex = this.examstate.curitemindex;
                        }

                        this.onitemchanged(oldindex);
                    }
                }
            }
            ,onitemchanged:function(oldindex){
                var examitem = this.exampaper.itemdetaillist[oldindex];
                //! 检测题目的做题状态
               // console.log(examitem);
                if (examitem.answer){
                    var as = this.getAnswerSheet(oldindex);
                    this.$set(as, 'dostate', 'finish');
                }
            }
            ,onpreitem:function(){
                this.setCurItemIndex(this.examstate.curitemindex-1);
            }
            ,onnextitem:function(){
                this.setCurItemIndex(this.examstate.curitemindex+1);
            }
            ,onSubmit:function(){
                var es = this.examstate;
                es.state = 'finish';
                es.stoptime = new Date();

                //! 父子通信
                this.$emit('examstatechanged', this.examstate);
            }
            ,doSubmit:function(){
               // Toast('暂未实现');
               // MessageBox('暂未实现');

                if (this.examstate.state != 'do'){
                    MessageBox('未在做题状态');
                }
                else{
                    //! 刷新最后的题目做题状态：
                    this.onitemchanged(this.examstate.curitemindex);

                    //! 统计未做题数；
                    var iundonum = 0;
                    var ilist = this.exampaper.itemdetaillist;
                    var as = this.examstate.answersheet;
                    for(var i=0; i<ilist.length; i++){
                        if (as[i] && as[i].dostate && as[i].dostate == 'finish'){
                            continue;
                        }
                        else{
                            iundonum++;
                        }
                    }
                    var tips = '';
                    if (iundonum > 0){
                        var fmt = '还有<span class="twarning">%i题</span>未完成，是否现在交卷？';
                        tips = commontools.sprintf(fmt, iundonum);
                    }
                    else{
                        tips = '现在交卷？';
                    }
                    var othis = this;
                    MessageBox.confirm(tips).then(function(){
                        othis.onSubmit();
                    });
                }


            }
            ,domark:function(){
                var ea = this.getAnswerSheet(this.examstate.curitemindex);
                var bmark = ea.marked;

               // console.log(bmark);
              //  console.log(this.examstate);
              //  console.log(this.examstate.answersheet[0].marked);

                if (bmark){
                    bmark = false;
                }
                else{
                    bmark = true;
                }


                //console.log(this.examstate);

                this.$set(ea, 'marked', bmark);
                //this.getAnswerSheet(this.examstate.curitemindex).marked = bmark;
            }
            ,getAnswerSheet:function(index){
                if (!this.examstate.answersheet[index]){
                    //this.examstate.answersheet[index] = {};
                    var szfmt = '';
                    szfmt = '' + index;
                    this.$set(this.examstate.answersheet, szfmt,  {});  //!
                }
                return this.examstate.answersheet[index];
            }
        }
        ,components:{
            examitemfull,
            exampaperbasicinfo,
        }

    }
</script>

<style scoped>

    .itemlistul{

    }

    ul,li{
        list-style:none;
    }

    .itemlistheader{
        width:100%;
        text-aglin:center;
        padding:10px 0px;
    }

    .itemlistli{
        display: inline-block;
        width: 100%;
        text-align:center;
        line-height:40px;
        border-bottom:1px solid #F2F6FC;
    }
    .itemlistdarkbk{
        background-color:#F2F6FC;
    }
    .listpartindex{
        width:33%;
        display:inline-block;
        text-align:center;
    }
    .listpartdostate{
        width:33%;
        display:inline-block;
        text-align:center;
    }
    .listpartmark{
        width:33%;
        display:inline-block;
        text-align:center;
    }
    .itemliststatemark{
        color:#E6A23C;
    }
    .itemliststateunfinish{
        color:#F56C6C;
    }
    .itemliststatefinish{
        color:#409EFF;
    }




    .startbtn{
        width:auto;
        padding:5px 20px;
        margin:auto;
    }

    .timedesc{
        margin-top:10px;
        margin-right:10px;
    }

    .indexcontainer{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .indexdesc{


    }

    .markactive{
        color:white;
        background-color:#E6A23C;
    }

    .doheader{
        padding:5px 10px;
        border-bottom:1px solid lightgray;

    }
    .dofooter{
        padding:5px 10px;
        height:44px;

        border-top:1px solid lightgray;

        position:absolute;
        left:0;
        bottom:0;
        width:100%;

        bottom:0;
        z-index:999;
    }
    .examitembody{
        padding:10px;
        margin-bottom:44px;  /* 设为与dofooter 高度一致 */
    }



    .footernav{
        float:right;
    }
    .headernav{
        float:right;
    }


    .btnnav{
        background-color:#909399;
        color:white;
    }
    .btnsubmit{
        background-color:#67C23A;
        color:white;
    }



    .mint-popup-4 {
        width: 100%;
        max-height:70%;
    }

    .popupitemlist{
        padding:20px;

        overflow:auto;
    }

</style>