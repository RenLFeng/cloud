<template>
    <div>
        <mt-header title="选择题">

            <mt-button icon="back" @click="$router.go(-1)" slot="left">返回</mt-button>


            <mt-button slot="right" @click="dopublish">确定</mt-button>


        </mt-header>


        <div>
            <mt-field label="题目" type="textarea" placeholder="请输入题目内容" v-model="examitem.text"></mt-field>

            <div class="devide"></div>


            <div v-for="(selitem,selindex) in buildsels" v-bind:key="selindex">
                <mt-field label="选项" :placeholder="getselopt(selindex)" v-model="buildsels[selindex]"></mt-field>

            </div>



            <mt-cell title="参考答案" >
                <span class="rightanswer">{{rightanswerstr}}</span>
                <mt-button type="primary" @click="doshowseta" size="small" style="margin-right:10px;margin-left:10px;">设置答案</mt-button>
                <mt-button size="small" @click="doshowchangeopt">变更选项</mt-button>
            </mt-cell>

            <div class="devide"></div>

            <mt-field label="分值" placeholder="输入题目分值" type="number" v-model="examitem.score">
                <mt-button size="small" type="primary" @click="onPreview" style="margin-left:20px;">预览</mt-button>
            </mt-field>

            <div class="devide"></div>

            <mt-field label="答案解析" type="textarea" placeholder="输入答案解析" v-model="examitem.tanalyze"></mt-field>



        </div>


        <mt-popup
                v-model="setanswervisible" position="bottom" class="mypopup"
        >
            <div class="fontnormal">设置参考答案：</div>
            <examitemsellist
                    :examitem="examitem"
            ></examitemsellist>

        </mt-popup>

        <mt-popup v-model="changeoptvisible" positio="bottom" class="mypopup">

        </mt-popup>

        <mt-actionsheet
                :actions="changeoptmenudata"
                v-model="changeoptvisible"
        ></mt-actionsheet>


        <mt-popup v-model="popupVisible3" position="right" class="mint-popup-3" :modal="false">
            <mt-header title="题目预览">

                <mt-button slot="right" @click="popupVisible3 = false">关闭</mt-button>

            </mt-header>
            <examitemfull :examitem="examitempreview"></examitemfull>
        </mt-popup>


    </div>
</template>

<script>

    import examitemsellist from './components/examitemsellist'
    import examtools from '../examtools.js'
    import examitemfull from './components/examitemfull'
    import commontools from '../../commontools'

    import { MessageBox,Indicator, Toast } from 'mint-ui';


    export default {
        name: "examitemaddsel",
        data(){
            return {
                popupVisible3:false,
                setanswervisible:false,
                changeoptvisible:false,
                examitem:{
                    text:'',
                    sels:[
                    ],
                    score:2.0,
                    tanalyze:''
                },
                buildsels:[
                    '','','',''
                ]
                ,changeoptmenudata:[
                    {
                        name:'增加选项',
                        method:this.changeoptadd
                    },
                    {
                        name:'删除选项',
                        method:this.changeoptdel
                    }
                ]
            }
        },
        created:function(){
            this.$store.commit('exam/setLastFinishExamItem', null);

            var cachepreview = this.$store.state.exam.previewExamItem;
            if (cachepreview){
                this.examitem = commontools.clone(cachepreview);
                this.$store.commit('exam/setPreviewExamItem', null);
            }
        },
        components:{
            examitemsellist,
            examitemfull
        },
        computed:{
            rightanswerstr:function(){
                if (!this.examitem.answer){
                    return '未设置答案';
                }
                //! todo. 检测answer是否在选项内
                return examtools.selitemGetTitle(this.examitem.answer);
            }
            ,examitempreview:function(){
                if (!this.popupVisible3){
                    return {};
                }
                this.dobuildsels();
                var obj = commontools.clone(this.examitem);
                obj.answer = '';
                return obj;
            }
        },
        methods:{
            goback:function(){
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/');
            },
            dopublish:function(){
                this.dobuildsels();
                if (!this.checkallvalid()){
                    return ;
                }
                var othis = this;
                this.preparePost();
                Indicator.open({
                    text: this.$t('Indicator.Saving'),
                    spinnerType: 'fading-circle'
                });
                this.$http.post('/index/index/apiExamItemAdd',
                    othis.examitem
                ).then(function(res){
                    Indicator.close();
                    if (res.data.code == 0){
                        Toast(res.data.msg);

                        othis.examitem['id'] = res.data.data['id'];
                        othis.$store.commit('exam/setLastFinishExamItem', othis.examitem);

                        othis.goback();
                    }
                    else{
                        Toast(res.data.msg);
                    }
                }).catch(function(){
                    Indicator.close();
                });
            }
            ,dobuildsels:function(){
                var newsel = [];
                for (var i=0; i<this.buildsels.length; i++){
                    //! todo. trim, convert html,
                    if ((this.buildsels[i].length) > 0){
                        newsel.push(this.buildsels[i]);
                    }

                }
                this.examitem.sels = newsel;
            }
            ,getselopt:function(index){
                var tips = '输入选项内容，例如 ';
                var b = String.fromCharCode(65 + parseInt(index));
                tips += b;
                tips += '.内容';

                return tips;
            }
            ,doshowseta:function(){
                this.dobuildsels();
                //console.log(this.examitem);
                this.setanswervisible = true;
            }
            ,doshowchangeopt:function(){
                this.changeoptvisible = true;
            }
            ,changeoptadd:function(){
                this.buildsels.push('');
            }
            ,changeoptdel:function(){
                if (this.buildsels.length > 2){
                    var slen = this.buildsels.length;
                    this.buildsels.splice(slen-1, 1);
                   //console.log(slen);
                 //   console.log(this.buildsels);
                }
            }
            ,preparePost:function(){
                var exi = this.examitem;
                exi.rightanswer = 0;
                for(var i=0; i<exi.sels.length; i++){
                    if (exi.sels[i] == exi.answer){
                        exi.rightanswer = i;
                        break;
                    }
                }
            }
            ,onPreview:function(){
               this.popupVisible3 = true;
              //  this.$store.commit('exam/setPreviewExamItem', this.examitem);
              //  this.$router.push('/examitempreview');
            }
            ,checkallvalid:function(){
                var exi = this.examitem;

                var tips = '';
                if (!exi.text
                   // && (exi.text.length==0)
                ){
                    tips = '未输入题目内容';
                    //console.log('tip11');
                }
                else if (exi.sels && exi.sels.length < 2){
                  //  console.log(exi.text.length);
                    tips = '未输入题目选项';
                }
                else if (!exi.answer
                  //  && exi.answer.length==0
                ){
                    tips= '未设置答案';
                }
                //console.log(tips);
                if (tips.length == 0){
                    return true;
                }

                MessageBox('提示', tips);

                return false;
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


    .mypopup{
        width:100%;
        padding:10px;
    }

    .rightanswer{
        color:orangered;
    }

</style>