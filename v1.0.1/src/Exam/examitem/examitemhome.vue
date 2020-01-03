<template>
    <div>
        <mt-header title="题库">

            <mt-button icon="back" @click="$back" slot="left">返回</mt-button>


            <mt-button slot="right" @click="showaddmenu">新增题目</mt-button>


        </mt-header>

        <div class="listContainer">
            <div v-for="(selitem,selindex) in localexams" v-bind:key="selindex">
                <examitemlistitem :examitem="localexams[selindex]" @icontrigger="onitemclick"></examitemlistitem>
            </div>
            <div v-if="localexamsempty" class="tc" style="margin-top:50px;">{{liststatedesc}}</div>
        </div>


        <mt-actionsheet
                :actions="addmenudata"
                v-model="addmenuvisible"
        ></mt-actionsheet>

        <mt-actionsheet
            :actions="editmenudata"
            v-model="editmenuvisible"
        >

        </mt-actionsheet>
    </div>
</template>

<script>
    import examitemlistitem from './components/examitemlistitem'


    export default {
        name: "examitemhome",
        data(){
            return {
                addmenudata:[
                    {
                        name:'新增 选择题',
                        method:this.onaddsel
                    }
                ],
                addmenuvisible:false,
                editmenudata:[
                    {
                        name:'编辑(未实现)',
                        method:this.dooneedit
                    },
                    {
                        name:'删除(未实现)',
                        method:this.doonedelete
                    }
                ],
                editmenuvisible:false,
                localexams:[],
                liststatedesc:'加载中',
                lastselitem:{}
            }
        },
        computed:{
            localexamsempty:function(){
                if (this.localexams.length == 0){
                    return true;
                }
                return false;
            }
        },
        components:{
            examitemlistitem
        },
        created:function(){
            var othis = this;
            othis.liststatedesc = '加载中';
            this.$http.post('/index/index/apiExamItemQuery',{})
                .then(function(res){
                    if (res.data.code == 0){
                        //! success
                        //console.log(res.data);
                        othis.localexams = res.data.data;
                    }
                    othis.onloadfinish();
                })
                .catch(function(){
                    othis.onloadfinish();
                })
        },
        methods:{
            onloadfinish:function(){
                if (this.localexams.length == 0){
                    this.liststatedesc = '没有题目';
                }
            }
            ,onadd:function(){

            }
            ,onaddsel:function(){
                this.$router.push({
                    path:'/examitemaddsel'
                })
            }
            ,showaddmenu:function(){
                this.addmenuvisible = true;
            }
            ,onitemclick:function(res){
             //   console.log(res);
                this.lastselitem = res;
                this.editmenuvisible = true;
            }
            ,dooneedit:function(){
                //! todo

            }
            ,doonedelete:function(){
                //! todo
            }
        }
    }
</script>

<style scoped>

</style>