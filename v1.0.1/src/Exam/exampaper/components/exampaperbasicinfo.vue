<template>
    <div>
        <div class="tc fontnormal infopanel">
            <p class="papertitle fontlarge">{{exampaper.title}}</p>
            <p>{{scoredesc}}</p>
            <p>{{timedesc}}</p>
            <p>{{itemnumdesc}}</p>
        </div>
    </div>
</template>

<script>
    import commontools from '../../../commontools'
    export default {
        name: "exampaperbasicinfo",
        props:{
            exampaper:Object
        },
        computed:{
            timedesc:function(){
                var szret = '考试时间：';
                if (this.exampaper.timelimit){
                    var szfmt = this.exampaper.timelimit;
                    szfmt += ' 分钟';
                    szret += szfmt;
                }
                else{
                    szret += '不限制';
                }
                return szret;
            }
            ,itemnumdesc:function(){
                var inum = 0;
                if (this.exampaper.itemdetaillist){
                    inum = this.exampaper.itemdetaillist.length;
                }
                var fmt = '共  %1$s  题';
                var szret = commontools.sprintf(fmt, inum);
                return szret;
            }
            ,scoredesc:function(){
                var fmt = '总分：%1$s分';
                var szret = commontools.sprintf(fmt, this.exampaper.totalscore);
                return szret;
            }
        }
    }
</script>

<style scoped>

    .infopanel{
        background-color:#fff;
        width:300px;
        padding:30px 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

        border-radius:3px;

        margin:30px auto;

        line-height:30px;
    }

    .papertitle{
        font-weight:bold;
    }

</style>