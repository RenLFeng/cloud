<template>
    <div class="listbodycontainer">
        <i class="iconfont icon-bianji eicotrigger" @click="icoclick"></i>
        <div class="fontnormal listbody">



            <div class="eheader"><span class="typedesc">{{typedesc}}</span> <span class="scoredesc fontsmall">{{scoredesc}}</span></div>
            <div class="fontsmall ellipse titlebody">{{itemtext}}</div>
            <div class="fonttiny"><span class="lockstate">{{itemlockstate}}</span></div>


        </div>

    </div>
</template>

<script>

    import examtools from '../../examtools.js'

    export default {
        name: "examitemlistitem",
        props:{
            examitem:Object,
        }
        ,computed:{
            typedesc:function(){
                return examtools.getItemTypeDesc(this.examitem);
            }
            ,scoredesc:function(){
                return examtools.getScoreDesc(this.examitem);
            }
            ,itemtext:function(){
                if (this.examitem.text){
                    return this.examitem.text;
                }
                return '';
            }
            ,itemlockstate:function(){
                if (this.examitem.lockstate){
                    return '已锁定';
                }
                return '未锁定';
            }
        }
        ,methods:{
            icoclick:function(){
                //console.log('icoclick');
                this.$emit('icontrigger', this.examitem);
            }
        }
    }
</script>

<style scoped>

    .listbody{
        margin:5px 20px;
        margin-right:40px;
    }

    .eicotrigger{
        font-size:30px;
        float:right;
        margin-right:20px;
        margin-top:20px;
    }

    .eheader{
        margin-bottom:5px;
        margin-top:5px;
    }

    .listbodycontainer{
        border-bottom:1px solid lightgray;
    }

    .scoredesc{
        background-color:lightgray;
        border:1px solid gray;
        padding:0px 2px;
        border-radius:5px;
    }

    .titlebody{
        height:22px;
    }
    .typedesc{
        margin-right:10px;

    }
    .lockstate{
        color:darkgray;
    }

</style>