<template>
    <div class="listbodycontainer">
        <i class="iconfont icon-bianji eicotrigger" @click="icoclick"></i>
        <div class="fontnormal listbody">


            <div class="eheader"> <span class="scoredesc fontsmall">{{scoredesc}}</span> <span class="timedesc fontsmall">{{timedesc}}</span>
                <span class="itemnumdesc fontsmall">{{itemnumdesc}}</span>
            </div>
            <div class="fontnormal ellipse titlebody">{{itemtext}}</div>
            <div class="fonttiny"><span class="lockstate">{{itemlockstate}}</span></div>


        </div>

    </div>
</template>

<script>

    import commontools from '../../../commontools'

    export default {
        name: "exampaperlistitem",
        props:{
            exampaper:Object,
        }
        ,computed:{
            timedesc:function(){
                var sz = '考试时间:'
                if (this.exampaper.timelimit){
                    sz += this.exampaper.timelimit;
                    sz += '分钟';
                }
                else{
                    sz += '不限制';
                }
                return sz;
            }
            ,itemnumdesc:function(){
                var fmt = '共%1$s题';
                var inum = 0;
                if (this.exampaper.itemids){
                    inum = this.exampaper.itemids.length;
                }
                var sz = commontools.sprintf(fmt, inum);
                return sz;
            }
            ,scoredesc:function(){
                if (this.exampaper.totalscore){
                    var str = this.exampaper.totalscore;
                    str += '分';
                    return str;
                }
                return '0分';
            }
            ,itemtext:function(){
                if (this.exampaper.title){
                    return this.exampaper.title;
                }
                return '';
            }
            ,itemlockstate:function(){
                if (this.exampaper.lockstate){
                    return '已锁定';
                }
                return '未锁定';
            }
        }
        ,methods:{
            icoclick:function(){
                this.$emit('icontrigger', this.exampaper);
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

        margin-right:20px;
    }
    .timedesc{
        margin-right:20px;
    }
    .itemnumdesc{
        margin-right:20px;

    }

    .titlebody{
        height:24px;
    }


    .lockstate{
        color:darkgray;
    }
</style>