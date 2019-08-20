<template>
    <div>
        <mt-header title="试卷">
            <mt-button icon="back" @click="$router.go(-1)" slot="left">返回</mt-button>
            <mt-button slot="right" @click="onaddpaper">新增试卷</mt-button>
        </mt-header>

        <div>
            <div class="listContainer">
                <div v-for="(selitem,selindex) in exampapers" v-bind:key="selindex">
                    <exampaperlistitem :exampaper="exampapers[selindex]" @icontrigger="onitemclick"></exampaperlistitem>
                </div>
                <div v-if="localexamsempty">
                    <div class="tc" style="margin-top:50px;">
                        {{liststatedesc}}
                    </div>

                </div>
            </div>
        </div>


        <mt-actionsheet
            :actions="itemmenudata"
            v-model="itemmenuvisible"
        >

        </mt-actionsheet>
    </div>
</template>

<script>

    import exampaperlistitem from './components/exampaperlistitem'
    import { MessageBox,Indicator, Toast } from 'mint-ui';

    export default {
        name: "exampaperhome"
        ,methods:{
            onaddpaper:function(){
                this.$store.commit('setRouterForward', true);
                this.$router.push('/exampaperadd');
            }
            ,buildliststatedesc:function(){
                var ep = this.exampapers;
                if (ep.length == 0){
                    this.liststatedesc = '当前无试卷';
                }
            }
            ,onitemclick:function(epaper){
                this.curselpaper = epaper;
                this.itemmenuvisible = true;
            }
            ,dopreview:function(){
                Toast('暂未实现');
            }
            ,doedit:function(){
                //Toast('暂未实现');
                if (this.curselpaper){
                    //! save to store
                    this.$store.commit('exam/setEditingExamPaper', this.curselpaper);
                    this.$store.commit('setRouterForward', true);
                    this.$router.push('/exampaperadd');

                }
            }
            ,saveToCache(){
                this.$store.commit('exam/saveCacheExamPapers', this.exampapers);
            }
            ,dodel:function(){
                Toast('暂未实现');
            }
        }
        ,components:{
            exampaperlistitem,
        }
        ,data(){
            return {
                exampapers:[],
                liststatedesc:'加载中',
                curselpaper:null,
                itemmenuvisible:false,
                itemmenudata:[
                    {
                        name:'预览',
                        method:this.dopreview
                    },
                    {
                        name:'编辑',
                        method:this.doedit
                    },
                    {
                        name:'删除',
                        method:this.dodel
                    }
                ],
            }
        }
        ,computed:{
            localexamsempty:function(){
                if (this.exampapers.length == 0){
                    return true;
                }
                return false;
            }
        }
        ,created:function(){
            //!

            var cachepapers = this.$store.state.exam.cachedExamPapers;
            if (cachepapers && cachepapers.length > 0){
                this.exampapers = cachepapers;

                return ;
            }

            var othis = this;
            othis.liststatedesc = '加载中';
            othis.$http.post('/index/index/apiExamPaperQuery')
                .then(function(res){
                    if (res.data.code == 0){
                        othis.exampapers = res.data.data;
                        othis.saveToCache();
                    }
                    othis.buildliststatedesc();
            })
            .catch(function(){
                othis.laststatedesc = '加载异常';
            });
        }

    }
</script>

<style scoped>

</style>