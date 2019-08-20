<template>
    <div class="mainpart" @click="onclick">
        <img :src="userimg" :onerror='defaultimg' class="mainimg mainleft">
        <div class="mainright" >
            <div class="rightcontrol" @click="icoclick"><img src="../../assets/zuoye_edit.png" class="rightcontrolimg" v-if="hasedit" ></div>
            <div class="rightstate" :class="{'rightstatemid':!hasedit}">
                <div v-if="zuoyeitem.state == 100"><img src="../../assets/zuoye_st_play.png" class="rightstateimg"><div class="rightsttext rightstplay">进行中</div></div>
                <div v-else-if="zuoyeitem.state == 10" class="rightsttext">
                    <div class="rightststopico"> </div><span class="rightststop">已结束</span>
                </div>
                <div v-else class="rightsttext">
                    <div class="rightstnormalico"></div><span class="rightstnormal">未开始</span>
                </div>
            </div>
        </div>
        <div class="maincontent">
            <div class="mainctitle ellipse">{{zuoyeitem.name}}</div>
            <div class="maincsubtitle" v-html="memberdesc"></div>


        </div>
    </div>
</template>

<script>

    import commontools from '../../commontools'

    import maintools from '../maintools'

    export default {
        name: "BankeZuoyeSimple",
        computed:{
            defaultimg(){
                var srcstr = 'this.src="';
                srcstr += require('../../assets/zuoye_icon.png');
                srcstr += '"';
                return srcstr;
            },
            userimg(){
               var url=  require('../../assets/zuoye_icon.png')
               return url;
            }
            ,memberdesc(){

                if (!this.zuoyeitem.state){
                    return '未开始';
                }

                if (!this.hasedit){
                    //! . html
                    if (this.zuoyeitem.submitnum){
                        return '<span class="clrok">已参与</span>';
                    }
                    else{
                        //！ 未参与
                        if (this.zuoyeitem.state == 10){
                            return '未参与';
                        }
                        return '<span class="clrdanger">未参与</span>';
                    }
                }


                var szfmt = '%i人参与';
                var nnum = 0;
                if (this.zuoyeitem.membernum){
                    nnum = this.zuoyeitem.membernum;
                }
                var ostr = commontools.sprintf(szfmt,  nnum);
                return ostr;
            }

        }
        ,data(){
            return {
                pendclick:false,
            }
        }
        ,methods:{
            icoclick(){
               // console.log('bankefilesimple icoclick');
                this.pendclick = true;
                this.$emit('editclick', this.zuoyeitem);

            }
            ,onclick(){
              //  console.log('bankefilesimple');
                if (this.pendclick){
                    this.pendclick = false;
                    return;
                }
                this.$emit('normalclick', this.zuoyeitem);
            }
        }
        ,props:{
            zuoyeitem:{
                type:Object,
                default(){
                    return {
                        id:0,
                        name:'',
                        state:0,
                        membernum:0
                    }
                }
                ,required:false
            }
            ,hasedit:{
                default(){
                    return true;
                }
                ,required:false
            }
        }
    }
</script>

<style scoped>

    .mainpart{
        height:83px;
        border-bottom:1px solid #eaeaea;
        padding:10px;
    }

    .mainimg{
        width:62px;
        height:62px;


    }

    .mainleft{
        float:left;
    }


    .maincontent{
        margin-left:72px;
        margin-right:40px;
    }

    .mainctitle{
        font-size:20px;
        color:#313131;

        height:24px;
        margin-bottom:6px;
        margin-top:6px;
    }
    .maincsubtitle{

        margin-top:10px;
        height:16px;

        font-size:12px;
        color:#a5a5a5;
    }

    .mainright{
        float:right;
        padding-top:5px;

    }
    .rightcontrol{
        text-align:right;
    }
    .rightcontrolimg{
        width:36px;
        height:36px;

        margin-bottom:5px;


    }
    .rightstate{
        font-size:12px;
        height:18px;
    }
    .rightstatemid{
        margin-top:20px;
    }

    .rightstateimg{

    }
    .rightsttext{
        top:2px;
        display:inline-block;
        height:12px;
        position:relative;
    }
    .rightstplay{
        color:#ff8900;
    }
    .rightststop{
        color:#a5a5a5;
    }
    .rightststopico{
        width:12px;
        height:12px;
        border-radius:50%;
        background-color:#b9b9b9;
        display:inline-block;

        position:relative;
        top:1px;
    }
    .rightstnormal{
        color:#a5a5a5;
    }
    .rightstnormalico{
        width:12px;
        height:12px;
        border-radius:2px;
        background-color:#00c626;
        display:inline-block;

        position:relative;
        top:2px;
    }





    .eicotrigger{
        font-size:22px;

        margin-right: 5px;
    }


</style>