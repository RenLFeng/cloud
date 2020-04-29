<template>
    <div>
        <mt-header title="编辑试卷">
            <mt-button icon="back" @click="$back" slot="left">返回</mt-button>
            <mt-button slot="right" @click="onsave">保存</mt-button>
        </mt-header>

        <div>

            <mt-field label="试卷名" placeholder="请输入试卷名" v-model="exampaper.title"></mt-field>
            <mt-field label="考试时间" placeholder="0表示不限制时间" v-model="exampaper.timelimit" type="number">分钟

            </mt-field>
            <mt-cell title="试卷总分" >
               <span>{{totalscorestr}}</span> <mt-button size="small" type="primary" @click="onPreview" style="margin-left:20px;">预览</mt-button>
            </mt-cell>


            <div class="devide"></div>

            <mt-cell title="组卷方式">
                <mt-button size="small" @click="onautopaper" style="margin-right:10px;"
                >智能组卷</mt-button>
                <mt-button size="small" type="primary" @click="onmanulpaper">手动添加</mt-button>

            </mt-cell>

            <div class="devide"></div>

            <div>
                <div v-if="hasitem">
                    <div v-for="(selitem,selindex) in builditemlist" v-bind:key="selindex">
                        <examitemlistitem :examitem="builditemlist[selindex]"></examitemlistitem>
                    </div>
                </div>
                <div v-else >
                    <div class="tc" style="margin-top:50px;">
                        没有题目。<br/> 使用“组卷方式”添加题目
                    </div>
                </div>
            </div>


        </div>

        <mt-actionsheet
                :actions="addmenudata"
                v-model="addmenuvisible"
        >
        </mt-actionsheet>

        <mt-popup v-model="popupVisible3" position="right" class="mint-popup-3" :modal="false">
            <mt-header title="试卷预览">

                <mt-button slot="right" @click="popupVisible3 = false">关闭</mt-button>

            </mt-header>
            <exampaperfull :exampaper="exampaperpreview" :examstate="exampaperpreviewstate" @examstatechanged="onPreviewState"></exampaperfull>
        </mt-popup>

    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox,Actionsheet } from 'mint-ui';
    import commontools from '../../commontools'
    import examtools from '../examtools'
    import examitemlistitem from '../examitem/components/examitemlistitem'
    import exampaperfull from './components/exampaperfull'

    export default {
        name: "exampaperadd"
        ,props:{
            exampaperid:{
                type:Number,
                default(){
                    return 0;
                }
            }
        }
        ,data(){
            return {
                popupVisible3:false,
                exampaper:{
                    title:'',
                    timelimit:'',
                    itemdetaillist:[]
                },
                localpaperpreview:{
                }   //! cjy: 本地preview的数据， 避免paper变化时一直clone
                ,localpaperpreviewstate:null  //! preview 的考试状态
                ,addmenuvisible:false
            }
        }
        ,components:{
            exampaperfull,
            examitemlistitem,
            [Actionsheet.name]: Actionsheet
        }
        ,created:function(){
          //  console.log('exampaperadd created');
            var cacheep = this.$store.state.exam.editingExamPaper;
           // console.log(cacheep);
            var doqueryitem = false;
            if (cacheep){

                var localep = commontools.clone(cacheep);;
                var othis = this;

                //! cjy:  see https://v1-cn.vuejs.org/guide/reactivity.html
                //! es5 不能监听属性的 添加或删除，因此这里需要先添加
                if (!localep.itemdetaillist){
                    localep.itemdetaillist = [];
                }

                this.exampaper = localep;

                //! 试卷首次加载，需要载入试题详细
                if (localep.itemids && localep.itemdetaillist.length==0 && localep.itemids.length > 0){
                    doqueryitem = true;
                    Indicator.open(this.$t('Indicator.Loading'));
                    //var othis = this;
                    this.$http.post('/index/index/apiExamItemQuery',
                        {
                            itemids:localep.itemids
                        }
                    ).then(function(res){
                        Indicator.close();
                        if (res.data.code == 0){
                            //! 重新排序； 网络拉取可能无序
                            othis.exampaper.itemdetaillist = examtools.reorderPaperItemList(localep.itemids, res.data.data);

                            //! 保存一次， 避免再次拉取. todo.
                            othis.$store.commit('exam/saveExamPaper', othis.exampaper);

                        }
                        else{
                            Toast('加载异常');
                        }
                    }).catch(function(){
                        Indicator.close();
                        Toast('网络异常');
                    });
                }
            }




            //! 检测最近完成编辑的试题
            var lastei = this.$store.state.exam.lastFinishExamItem;
            if (lastei && !doqueryitem){
                this.appendExamItem(commontools.clone(lastei));
                //! clear it
                this.$store.commit('exam/setLastFinishExamItem', null);
            }
        }
        ,computed:{
            builditemlist:function(){
                if (!this.exampaper.itemdetaillist){
                    return [];
                }
                return this.exampaper.itemdetaillist;
            },
            exampaperpreview:function(){
                return this.localpaperpreview;
            },
            exampaperpreviewstate:function(){
                if (!this.localpaperpreviewstate){
                    this.localpaperpreviewstate = examtools.getDefaultExamState();
                }
                return this.localpaperpreviewstate;
            },
            addmenudata:function(){
                var tarray = [];
                tarray.push({
                    name:'从题库选择',
                    method:this.toSelExamItem
                });
                examtools.fillMenuAddExamItem(tarray, this);
                return tarray;
            },
            hasitem:function(){
                if (!this.exampaper || !this.exampaper.itemdetaillist){
                    return false;
                }
                if (this.exampaper.itemdetaillist.length > 0){
                    return true;
                }
                return false;
            }
            ,totalscore:function(){

                if (!this.exampaper.itemdetaillist){
                    return 0;
                }
                var rets = 0;
                for(var i=0; i<this.exampaper.itemdetaillist.length; i++){
                    if (this.exampaper.itemdetaillist[i].score){
                        rets += parseInt(this.exampaper.itemdetaillist[i].score);
                    }

                }
                return rets;
            }
            ,totalscorestr:function(){
                var ts = this.totalscore;
                ts += ' 分';
                return ts;
            }
        }
        ,methods:{
            onPreview:function(){
                //Toast('暂未实现')
                var obj = commontools.clone(this.exampaper);
                obj.totalscore = this.totalscore;
                //! 清除所有的题目answer
                if (obj.itemdetaillist){
                    var ilist = obj.itemdetaillist;
                    for(var i=0; i<ilist.length; i++){
                        ilist[i].answer = '';
                    }
                }
                this.localpaperpreview = obj;
                //! 重置预览的考试状态
                this.localpaperpreviewstate = examtools.getDefaultExamState();

                this.popupVisible3 = true;
            },
            onPreviewState:function(examstate){
                if (examstate.state == 'finish'){
                    //! 关闭预览
                    this.popupVisible3 = false;
                }
            },
            saveToTmp:function(){
                this.$store.commit('exam/setEditingExamPaper', this.exampaper);
            },
            appendExamItem:function(ei){
                var ep = this.exampaper;
                if (!ep.itemdetaillist){
                    ep.itemdetaillist = [];
                }
                ep.itemdetaillist.push(ei);
            },
            onnextitem:function(){
                if (this.examstate.curitemindex < this.exampaper.itemdetaillist.length-1){
                    this.examstate.curitemindex++;
                    if (this.examstate.curitemindex < this.examstate.maxitemindex){
                        this.examstate.maxitemindex = this.examstate.curitemindex;
                    }
                }
            },
            onpreitem:function(){
                if (this.examstate.curitemindex > 0){
                    this.examstate.curitemindex--;
                }
            },
            saveToCache:function(){
                //! 重新生成题目序号; 用于其他页面处理，例如 exampaperhome
                var ep = this.exampaper;
                ep.itemids = [];
                var i = 0;
                for(i=0; i<ep.itemdetaillist.length; i++){
                    ep.itemids.push(ep.itemdetaillist[i].id);
                }
                ep.totalscore = this.totalscore;
                this.$store.commit('exam/saveExamPaper', ep);
            },
            dosave:function(silent){
                if (!this.checkallvalid(silent)){
                    return;
                }
                var postobj = this.buildSaveItem();
                if (!silent){
                    Indicator.open({
                        text: this.$t('Indicator.Saving'),
                        spinnerType: 'fading-circle'
                    });
                }
                var othis = this;
                othis.$http.post('/index/index/apiExamPaperAdd',
                    postobj)
                    .then(function(res){
                        if (!silent){
                            Indicator.close();
                            Toast(res.data.msg);
                        }
                        if (res.data.code == 0){
                           // Toast(res.data.msg);
                            othis.exampaper.id = res.data.data['id'];
                            othis.saveToCache();
                        }
                        else{
                           // Toast(res.data.msg);
                        }
                    })
                    .catch(function(){
                        if (!silent){
                            Indicator.close();
                            Toast('保存异常');
                        }
                    })
            },
            onsave:function(){
                this.dosave(false);
            }
            ,buildSaveItem:function(){
                var saveobj = {};
                var epaper = this.exampaper;
                saveobj['title'] = epaper.title;
                saveobj['timelimit'] = epaper.timelimit;
                saveobj['totalscore'] = this.totalscore;
                saveobj['itemids'] = [];
                if (epaper.id){
                    saveobj['id'] = epaper.id;
                }
                for(var i=0; i<epaper.itemdetaillist.length; i++){
                    if (epaper.itemdetaillist[i].id){
                        saveobj['itemids'].push(epaper.itemdetaillist[i].id);
                    }
                }
                return saveobj;
            }
            ,toSelExamItem:function(){

            }
            ,checkallvalid:function(silent){
                var ep = this.exampaper;
                var tips = '';
                if (!ep.title){
                    tips = '试卷名为空';
                }
                else if (ep.itemdetaillist.length == 0){
                    tips = '未添加题目';
                }
                if (tips.length == 0){
                    return true;
                }
                if (!silent){
                    MessageBox('提示', tips);
                }

                return false;
            }
            ,onautopaper:function(){
                Toast('暂未实现');
            }
            ,onmanulpaper:function(){
                this.addmenuvisible = true;
                this.saveToTmp();  //! 保存当前值
            }
        }
    }
</script>

<style scoped>
    .mint-popup-3 {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }


</style>