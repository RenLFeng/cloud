<template>
    <div>
        <div v-if="showcontrol" class="uploadpart">
            <mt-tabbar class="uploadtabbar">
                <mt-tab-item id="1" @click.native="onMemberSign">
                    <div>
                        <!-- <img slot="icon" src="../assets/100x100.png" class="uploadimgsize"> -->
                          <i class="iconfont iconfont-big iconqiandao0101"></i>
                        <div>签到</div>
                    </div>

                </mt-tab-item>
                <mt-tab-item id="2" @click.native="onMemberGroup">
                    <div>
                    <!-- <img slot="icon" src="../assets/100x100.png" class="uploadimgsize"> -->
                      <i class="iconfont iconfont-big iconfanganzhizuo_huaban"></i>
                    <div>小组方案</div>
                    </div>
                </mt-tab-item>

            </mt-tabbar>
        </div>

        <div class="memberdesc">
            <div class="membertitledesc">成员总数</div>
            <div class="membernumdesc">{{membernumdesc}}</div>
        </div>


        <div class="listcontainer">



            <div v-infinite-scroll="loadMoreMember"
                 infinite-scroll-disabled="loadingState"
                 infinite-scroll-distance="10"
            >
                <div v-for="(mitem,selindex) in members" v-bind:key="selindex">
                    <BankeMemberSimple :memberuser="members[selindex]"></BankeMemberSimple>
                </div>
            </div>
            <div v-if="membersempty" class="tc emptydesc">
                {{liststatedesc}}
            </div>
        </div>


    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox } from 'mint-ui';

    import BankeMemberSimple from './components/BankeMemberSimple'


    import commontools from '../commontools'

    export default {
        name: "BankeZiyuan"
        ,props:{
            bankeid:{
                default(){
                    return 0;
                }
            }
        }
        ,data(){
            return {
                members:[],
                liststatedesc:'加载中',
                loadingState:false,
                isloading:false
            }
        }
        ,computed:{
            showcontrol(){
                if (this.$store.getters.isteacher){
                    return true;
                }
                return false;
            }
            ,membersempty(){
                if (this.members.length ){
                    return false;
                }
                return true;
            }
            ,membernumdesc(){
                if (this.isloading){
                    return '加载中';
                }
                var nnum = 0;
                if (this.members.length){
                    nnum = this.members.length;
                }
                nnum += ' 人';
                return nnum;

            }

        }
        ,created(){

        }
        ,components:{
            BankeMemberSimple,
        }
        ,methods:{
            onMemberSign(){
                Toast('签到：暂未实现');
            },
            onMemberGroup(){
                Toast('分组，暂未实现');
            },
            loadMoreMember(){

                console.log('loadMemberMember');

                this.loadingState = true;
                this.isloading = true;
                var url = '/api/api/bankememberquery?bankeid='+this.bankeid;
                this.$http.post(url)
                    .then((res)=>{
                        this.isloading = false;
                        if (res.data.code == 0 ){
                            this.members = res.data.data['members'];
                        }
                        this.liststatedesc = '';
                    })
                    .catch(()=>{
                        this.isloading = false;
                        this.loadingState = false;
                    })
            },

        }

    }
</script>

<style scoped>


    .memberdesc{
        font-size:18px;
        height:35px;
        border-bottom:1px solid #eaeaea;
        border-top:1px solid #eaeaea;
        padding:10px 10px 0px;
    }
    .membertitledesc{
        float:left;
    }

    .membernumdesc{
        float:right;
    }

    .loadmore{
        min-height:200px;
    }

    .uploadtabbar{
        position:static;
    }

    .emptydesc{
        margin-top:50px;
    }

     .uploadimgsize{
        width:35px;
        heigth:35px;

         margin-bottom:2px;
    }

    .uploadtabbar img{
        border-radius:50%;

    }

    .uploadpart{

    }
    .listcontainer{

    }

</style>