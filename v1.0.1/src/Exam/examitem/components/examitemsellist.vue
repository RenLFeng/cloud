<template>
    <div>
        <div v-if="showsel">
            <mt-radio v-model="examitem.answer"  :options="examitem.sels">
            </mt-radio>

        </div>
    </div>
</template>

<script>


    export default {
        name: "examitemsellist",
        props:{
            examitem:Object
        },
        computed:{
            showsel:function(){
                console.log(this.examitem);
                if (this.examitem && this.examitem.sels){
                    return true;
                }
                return false;
            }
        }
    }
</script>

<style scoped>
    .mint-cell-wrapper{
        background-size:120% 0px;
    }

    .selradio,.selradio span{
        font-size:20px!important;
        line-height:32px!important;

    }
    .selradio{

    }


</style>