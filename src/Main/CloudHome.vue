<template>
    <div>

        <mt-header title="云平台">

            <mt-button icon="back"  slot="left">返回</mt-button>

            <mt-button slot="right" class="btnadd" v-if="showadd" @click="onadd">+</mt-button>
        </mt-header>


        <div class="noheadercontainer page-wrap">
            <mt-tab-container class="page-tabbar-container" v-model="selected">
                <mt-tab-container-item id="banke">
                    <div class="bankecontainer">

                        <div v-for="(item,selindex) in curbankes" v-bind:key="selindex">
                            <BankeSimple :classitem="curbankes[selindex]" @click.native="bankeclick(item)"></BankeSimple>
                            <div class="bankedevide"></div>
                        </div>
                        <div v-if="bankeempty" class="tc">
                            {{bankestatedesc}}
                        </div>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="exam">
                    <examhome></examhome>
                </mt-tab-container-item>

                <mt-tab-container-item id="mine">
                    <MineAbout></MineAbout>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>

        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="banke">
                <img slot="icon" src="../assets/100x100.png">
                <span class="fontnormal">班课</span>
            </mt-tab-item>
            <mt-tab-item id="exam">
                <img slot="icon" src="../assets/100x100.png">
                <span class="fontnormal">考试</span>
            </mt-tab-item>
            <mt-tab-item id="mine">
                <img slot="icon" src="../assets/100x100.png">
                <span class="fontnormal">我的</span>
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>

    import examhome from '../Exam/ExamHome'

    import BankeSimple from './components/BankeSimple'

    import MineAbout from './MineAbout'

    import {Indicator, Toast,MessageBox } from 'mint-ui';

    export default {
        name: "CloudHome"
        ,data(){
            return {
                selected:'banke',
                classitem:{
                    name:'11',
                    avatar:''
                }
                ,bankestatedesc:''

            }
        }
        ,computed:{
            showadd(){
                if (this.selected == 'banke'){
                    return true;
                }
                return false;
            }
            ,curbankes(){
                return this.$store.state.banke.curbankes;
            }
            ,bankeempty(){
             //   console.log(this.curbankes);
                if (this.curbankes.length ){
                    return false;
                }
                return true;
            }
        }
        ,watch:{
            selected(){
               // console.log(this.selected);
                if (this.selected == 'banke'){
                    this.initbanke();
                }
            }
        }
        ,methods:{
            onadd(){
                var isteacher = this.$store.getters.isteacher;
                if (isteacher){
                    //! 跳转新增课堂
                    this.$store.commit('setRouterForward', true);
                    this.$router.push('/bankenew');
                }
                else{
                    //! 跳转搜索课堂
                    Toast('加入课堂， 暂未实现');
                }
            }
            ,bankeclick(bankeitem){
                console.log(bankeitem);
                if (bankeitem.id){
                    this.$store.commit('setRouterForward', true);
                    this.$router.push('/bankehome/'+bankeitem.id);
                }
            }
            ,initbanke(){
                if (this.bankeempty){
                    var url = '/api/api/bankequery';
                    this.bankestatedesc = '加载中';
                    this.$http.post(url)
                        .then((res)=>{
                            if (res.data.code == 0){
                                this.$store.commit('banke/appendBankes', res.data.data);
                            }
                            if (this.bankeempty){
                                this.bankestatedesc = '当前无班课';
                            }
                        })
                        .catch((res)=>{
                            console.log(res);
                            this.bankestatedesc = '发生异常';
                        });
                }
            }
        }
        ,created:function(){
            var osel = this.$store.state.homeselected;
            if (osel){
                this.selected = osel;
            }
            if (this.selected == 'banke'){
                this.initbanke();
            }

        }
        ,destroyed:function(){
            //! 记忆当前的选择
            this.$store.commit('setHomeSelected', this.selected);
        }
        ,components:{
            MineAbout,
            examhome,
            BankeSimple
        }
    }
</script>

<style scoped>

    .btnadd{
        font-size:30px;
    }

    .bankecontainer{
        margin:10px;
        height:100%;
    }

    .bankedevide{
        height:10px;
    }

    .my-cell-allow-right::after {
        border: solid 2px #c8c8cd;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top: 50%;
        right: 20px;
        position: absolute;
        width: 5px;
        height: 5px;
        -webkit-transform: translateY(-50%) rotate(45deg);
        transform: translateY(-50%) rotate(45deg);
    }







</style>