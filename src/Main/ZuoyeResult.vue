<template>
    <div>
        <mt-header :title="titledesc">

            <mt-button icon="back" slot="left" @click="goback">返回</mt-button>

            <mt-button slot="right" v-if="pagemode=='submit'" @click="popupSubmit=true">提交作业</mt-button>
        </mt-header>

        <div class="noheadercontainer noheaderscroll">
            <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore" class="zyloadmore"
                         :auto-fill="autofill"
            >
                <div class="titlecontainer">
                    <div class="zuoyetitle">{{zuoyeitem.name}}</div>
                    <div class="zuoyesubtitle"><span class="zuoyescore">作业分值 100分</span>&nbsp;|&nbsp;<span>{{statedesc}}</span></div>
                    <div class="zuoyesubtitle">{{zuoyetimedesc}}</div>
                </div>



                <mt-cell title="作业详情" is-link @click.native="popupZDetail=true">
                    {{zuoyeitem.detaildesc}}
                </mt-cell>



                <mt-cell title="本次作业所有人得分" is-link v-if="pagemode=='result'">

                </mt-cell>
                <mt-cell title="信息" is-link v-if="pagemode=='result'">
                    {{submitnumdesc}}
                </mt-cell>

                <div class="devide zashowbtnpart">
                    <div v-if="pagemode=='submit'">
                        <div class="zashowbtn zashowbtnactive">我的提交</div>
                    </div>
                    <div v-if="pagemode=='result'">
                        <div class="zashowbtn zashowbtnactive">全部({{submitnum}})</div>
                        <div class="zashowbtn">未评分({{uncommentnum}})</div>
                    </div>

                </div>

                <div v-for="(ritem,selindex) in results" v-bind:key="selindex">

                    <div v-if="showitem(ritem)">
                        <ZuoyeAnswerItem  :resultitem="results[selindex]" @commentClicked="onCommentClick" @scoreClicked="onScoreClick"></ZuoyeAnswerItem>
                        <div class="devide"></div>
                    </div>

                </div>
                <div v-if="showemptydesc" class="tc" style="margin-top:50px;">
                    <div v-if="pagemode=='submit'">
                        <div style="margin-bottom:10px;">尚未提交</div>
                        <div>点击<span class="link" @click="popupSubmit=true">提交作业</span>来提交</div>
                    </div>
                    <div v-else>
                        {{emptydesc}}
                    </div>

                </div>



            </mt-loadmore>

        </div>





        <mt-popup v-model="popupSubmit" position="right" class="mint-popup-3 " :modal="false">
            <mt-header title="" class="作业提交">

                <mt-button slot="right" @click="onbtnsubmit" :disabled="submitdisabled">提交</mt-button>

                <mt-button slot="left" @click="popupSubmit = false">关闭</mt-button>

            </mt-header>

            <zuoyedetailedit
                    :zdetail="zdetailsubmit"
            ></zuoyedetailedit>

        </mt-popup>

        <mt-popup v-model="popupZDetail" position="right" class="mint-popup-3" :modal="false">
            <mt-header title="">

                <mt-button slot="left" icon="back" @click="popupZDetail = false">返回</mt-button>

            </mt-header>

            <zuoyedetailedit
                    :zdetail="zdetail" :readonly="zreadonly"
            ></zuoyedetailedit>

        </mt-popup>


    </div>
</template>

<script>

    import ZuoyeAnswerItem from './components/ZuoyeAnswerItem'
    import {Indicator, Toast,MessageBox } from 'mint-ui';

    import zuoyedetailedit from './ZuoyeDetailEdit'

    import maintools from './maintools'
    import commontools from '../commontools'
    import TextEllipsis from './components/TextEllipsis'
    import FileAttachList from './components/FileAttachList'

    export default {
        name: "ZuoyeResult",
        props:{
            zuoyeid:{
                default(){
                    return 0;
                }
            }
        }
        ,data(){
            return {
                isLimitHeight:true,
                popupSubmit:false,
                popupZDetail:false,
                zreadonly:true,
                topStatus:'',
                bottomStatus:'',
                autofill:true,
                zuoyeitem:{
                    name:'',
                    state:10,
                    allowpasstime:0,
                    hassubmittime:0,
                    detaildesc:'',
                    submittime:''
                },
                zdetail:{
                    ztext:'',
                    localfiles:[]
                },
                zdetailsubmit:{
                    ztext:'',
                    localfiles:[]
                },
                results:[],
                showfilter:'all',
                pagemode:'result',  //! 页面模式； 复用多种页面模式：result:所有结果列表  submit:学生答题列表
                submitok:false,
            }
        }
        ,computed:{
            submitdisabled(){
                if (this.zdetailsubmit.ztext){
                    return false;
                }
                return true;
            },
            titledesc(){
                if (this.pagemode == 'submit'){
                    return '作业详细';
                }
                return '作业结果列表';
            },
            statedesc(){
                if (this.zuoyeitem.state == 100){
                    return '进行中';
                }
                return '已结束';
            },
            unsubmitnum(){
                var ni = 0;
                for(var i=0; i<this.results.length; i++){
                    if (!this.results[i].submitnum){
                        ni++;
                    }
                }
                return ni;
            },
            showemptydesc(){
                if (this.showfilter == 'score'){
                    if (this.uncommentnum == 0){
                        return true;
                    }
                }

                for(var i=0; i<this.results.length; i++){
                    if (this.results[i].submitnum){
                        return false;
                    }
                }
                return true;
            },
            emptydesc(){
                if (this.showfilter == 'score'){
                    return '尚无未评分';
                }

                return '尚无提交';
            },
            submitnum(){
                var ni = 0;
                for(var i=0; i<this.results.length; i++){
                    if (this.results[i].submitnum){
                        ni++;
                    }
                }
                return ni;
            },
            uncommentnum(){
                var ni = 0;
                for(var i=0; i<this.results.length; i++){
                    if (this.results[i].score < 0 && this.results[i].submitnum){
                        ni++;
                    }
                }
                return ni;
            },
            zuoyetimedesc(){
                if (!this.zuoyeitem.hassubmittime){
                    return '不限制提交时间';
                }
                var tdesc = commontools.timeToHummanRead(this.zuoyeitem.submittime);
                var tallowpass = '允许超时提交';
                if (!this.zuoyeitem.allowpasstime){
                    tallowpass = '不允许超时提交';
                }
                var tfmt = '%s 前提交 | %s';
                return commontools.sprintf(tfmt, tdesc, tallowpass);
            }
            ,submitnumdesc(){
                if (!this.results.length){
                    return '无学员参与';
                }
                var ni = this.unsubmitnum;
                if (ni == 0){
                    return '已全部提交';
                }
                var tfmt = '%i 人未提交';
                return commontools.sprintf(tfmt, ni);
            }
        }
        ,methods:{
            loadTop(){
                this.loadAll();
            }
            ,loadBottom(){

            }
            ,onCommentClick(ritem){
                Toast('评论点击');
            }
            ,onScoreClick(ritem){
                Toast('评分点击');
            }
            ,goback(){
                if (this.pagemode == 'submit' ){
                    var btip = false;
                    if (!this.zuoyeitem.submitnum){
                        btip = true;
                    }
                    else{
                        if (this.zdetailsubmit.ztext.length || this.zdetailsubmit.localfiles.length){
                            btip = true;
                        }
                    }
                    if (btip){
                        MessageBox.confirm('退出作业提交？').then(()=>{
                            this.$router.go(-1);
                        });
                        return;
                    }

                }
                this.$router.go(-1);
            }
            ,showitem(ritem){

                if (!ritem.submitnum){
                    return false;
                }

                if (this.showfilter == 'score'){
                    if (ritem.score < 0){
                        return false;
                    }
                }

                return true;
            }
            ,handleTopChange(status){
                this.topStatus = status;
            }
            ,handleBottomChange(status){
                this.bottomStatus = status;
            }
            ,loadAll(){
                var url = '/api/api/zuoyeresultquery?zuoyeid=' + this.zuoyeid;
                Indicator.open('加载中');
                this.$http.post(url)
                    .then((res)=>{
                        Indicator.close();
                        this.$refs.loadmore.onTopLoaded();
                        if (res.data.code == 0){
                            //! ok
                            this.onHttpData(res.data.data)
                          //  console.log(this.results);
                        }
                        else{
                            Toast(res.data.msg);
                        }
                    })
                    .catch(()=>{
                        Indicator.close();
                        this.$refs.loadmore.onTopLoaded();
                    });
            }
            ,onHttpData(data){
                this.zuoyeitem = data['zuoye'];

                if (this.zuoyeitem.state == 100 && !this.$store.getters.isteacher){
                    //! 提交模式
                    this.pagemode = 'submit';
                }

                this.zdetail.ztext = data['zdetail'].ztext;
                this.zdetail.localfiles = maintools.localfilesFromFilelist(data['zdetail'].files);
                var dresults = data['results'];
                for (var i=0; i<dresults.length; i++){
                    dresults[i].localfiles = maintools.localfilesFromFilelist(dresults[i].files);
                }
                this.results = dresults;
            }
            ,onbtnsubmit(){
                MessageBox.confirm('现在提交作业？')
                    .then(()=>{
                        this.dosubmit();
                });
            }
            ,dosubmit(){
                Indicator.open('提交中');
                var url = '/api/api/zuoyesubmit?zuoyeid=' + this.zuoyeid;
                this.$http.post(url,
                    {
                        zdetail:{
                            ztext:this.zdetailsubmit.ztext,
                            files:maintools.filelistFromLocalfiles(this.zdetailsubmit.localfiles)
                        }
                    })
                    .then((res)=>{
                        Indicator.close();
                        if (res.data.code == 0){
                            Toast('提交成功');
                            var oneitem = res.data.data;
                            oneitem.localfiles = maintools.localfilesFromFilelist(oneitem.files);
                            this.results.splice(0, 0,  oneitem);
                            //! 清空本地的提交信息
                            this.popupSubmit = false;
                            this.zdetailsubmit.ztext = '';
                            this.zdetailsubmit.localfiles.length = 0;

                        }
                        else{
                            //! Toast 不可见
                            MessageBox(res.data.msg);
                        }
                    })
                    .catch(()=>{
                        Indicator.close();
                        Toast('异常');
                    })
            }
        }
        ,created(){
            var dd = this.$store.getters.getBankeData('zuoyeresult', this.zuoyeid);
            if (dd && dd.resultdata){
                this.onHttpData(dd.resultdata);
            }
            else{
                this.loadAll();
            }

        }
        ,components:{
            ZuoyeAnswerItem,
            zuoyedetailedit,

        }

    }
</script>

<style scoped>

    .mint-popup-3{
        width:100%;
        height:100%;
        background-color:white;
    }
    .popuphalf{
        height:50%;
    }

    .zashowbtn{
        font-size:18px;
        color:#0089ff;

        display:inline-block;
        text-align:center;

        padding:5px;
        margin-top:6px;
        margin-right:10px;
    }
    .zashowbtnpart{
        height:44px;
        padding:0px 10px;
    }
    .zashowbtnactive{
        border:1px solid #0089ff;
        border-radius:10px;
    }


    .zuoyetitle{
        font-size:20px;
        color:black;
    }
    .zuoyesubtitle{
        margin-top:5px;
        font-size:16px;
        color:#A9A9A9;
    }

    .zuoyescore{
        color:#FF8800;
    }

    .titlecontainer{
        padding:10px 20px;

        background-color:#e7e7e7;
    }

    .detailcontainer{
        padding:10px;
        background-color:white;
        font-size:16px;
    }
    .detailheader{
        border-bottom:1px solid #A9A9A9;
    }

    .submitheader{
        background-color:green;
    }

</style>