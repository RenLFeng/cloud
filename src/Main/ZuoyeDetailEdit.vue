<template>
    <div class="container">

        <!--
        <mt-header title="作业详情">

            <mt-button icon="back"  slot="left" @click="$router.go(-1)">返回</mt-button>

            <mt-button slot="right" :disabled="savedisable">确定</mt-button>

        </mt-header>
        -->

        <div v-if="readonly">
            <p class="zdetailrl">{{zdetail.ztext}}</p>
            <div v-if="hasattach">
                <div class="attachdesc">
                    附件
                </div>
                <div class="listc">
                    <FileAttachList :localfiles="zdetail.localfiles" :isupload="!readonly"></FileAttachList>
                </div>
            </div>
        </div>

        <div v-else style="height:100%;">
            <textarea
                    v-model="zdetail.ztext"
                    placeholder="输入详细内容"
                    class="zdetail"
            ></textarea>

            <div class="attachdesc">
                添加附件r5645
            </div>
            <div class="listc">
                <FileAttachList :urlinfo="urlinfo" :localfiles="zdetail.localfiles"></FileAttachList>
            </div>
            <div class="bottommargin">

            </div>
        </div>



    </div>
</template>

<script>

    import FileAttachList from './components/FileAttachList'

    export default {
        name: "ZuoyeDetailEdit",
        data(){
            return {
                urlinfo:{
                    urlupload:'/api/api/zuoyefileupload',
                    urldel:'/api/api/zuoyefiledelete',
                }
            }
        }
        ,props:{
            zdetail:{
                default(){
                    return {
                        ztext:'',
                        localfiles:[]
                    }
                }
            },
            readonly:{
                default(){
                    return false;
                },
                required:false
            }
        }
        ,computed:{
            savedisable(){
                if (this.zdetail.ztext.length){
                    return false;
                }
                return true;
            }
            ,hasattach(){
                if (this.zdetail.localfiles.length){
                    return true;
                }
                return false;
            }
        }
        ,components:{
            FileAttachList
        }
    }
</script>

<style scoped>

    .container{
        overflow:scroll;
        height:100%;
    }

    .zdetail{
        /* old:300px */
        max-height:300px;
        height:40%;
        padding:10px;
        font-size:18px;
        width:100%;
    }
    .zdetailrl{
        padding:10px;
        font-size:18px;
        width:100%;
    }
    .attachdesc{
        padding:5px 10px;
        font-size:16px;
        border-bottom:1px solid #eaeaea;
        border-top:1px solid #eaeaea;
    }
    .listc{
        margin:10px;
        overflow:visible;
    }

    .bottommargin{
        height:100px;
    }



</style>