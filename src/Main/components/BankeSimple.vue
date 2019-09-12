<template>
    <div class="item">

        <img class="itemavatar" :src="classitem.avatar" :onerror="defaultimg">
        <div class="itemright">
            <i class="item-arrow-right"></i>
        </div>

        <div class="itempart">
            <div class="itemtitle ellipse">{{classitem.name}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BankeSimple"
        ,props:{
            classitem:{
                type:Object,
                default(){
                    return {
                        name:'',
                            avatar:''
                    }
                }

            }
        },
        data(){
            return {
            }
        }
        ,computed:{
            defaultimg() {
                var srcstr = 'this.src="';
                srcstr += require('../../assets/banke-default.png');
                srcstr += '"';
                return srcstr;

            }
        }
    }
</script>

<style scoped>

    .item{
        background: linear-gradient(to  right, #74bfff , #0089FF);
        color:white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

        border-radius:8px;
        height:87px;

    }

    .itemtitle{
        font-size:16px;
    }


    .itemavatar{
        width:55px;
        height:55px;
        border-radius:3px;

        margin-top:16px;
        margin-left:16px;
        float:left;

        background-color:white;
    }


    .itempart{
        margin-left:87px;
        margin-right:40px;

        padding-top:30px;
    }

    .itemright{
        float:right;
        margin-top:28px;
    }


    .item-arrow-right::after {
        border: solid 2px white;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top:auto;
        right: 20px;
        position: absolute;
        width: 10px;
        height: 10px;

        margin-right:10px;

        transform: translateY(50%) rotate(45deg);

    }






</style>