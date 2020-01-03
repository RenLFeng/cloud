<template>
    <div>
        <mt-header title="题目预览">

            <mt-button slot="right" @click="$back">关闭</mt-button>

        </mt-header>
        <div>
            <examitemfull :examitem="examitem"></examitemfull>
        </div>
    </div>
</template>

<script>
    import examitemfull from './components/examitemfull'
    import commontools from '../../commontools'
    export default {
        name: "examitempreview"
        ,components:{
            examitemfull
        }
        ,data(){
            return {
                examitem:{}
            }
        }
        ,created:function(){
            var ei = this.$store.state.exam.previewExamItem;
            if (ei){
                this.examitem = commontools.clone(ei);
                //! 清空当前答案
                this.answer = '';
            }
        }
    }
</script>

<style scoped>

</style>