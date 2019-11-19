<template>
    <div>





        <ul>
            <li><div class="list">考试</div></li>
            <li>
                <div class="list" @click="goto('/exampaperhome')">试卷</div>
            </li>
            <li>

                <div class="list" @click="goto('/examitemhome')">题库</div>

            </li>
            <li><div class="list">批阅</div></li>

            <!-- 设置项： 包括题型管理等  -->
            <li><div class="list">设置</div></li>
        </ul>




    </div>
    
</template>

<script>

    import Header from '../common/header.vue'

    export default {
        name: "ExamHome",
        component:{
            Header,
        }
        ,methods:{
            goto:function(url){
                this.$store.commit('setRouterForward', true);
               // this.$router.push({path:url, params:{newtab:true}});
                this.$router.push(url);

            }
        }
    }
</script>

<style scoped>

    .list {
        height: 3rem;
        background: white;
        float: left;
        width: 50%;
        border-right: 1px solid #f4f4f4;
        border-top: 1px solid #f4f4f4;

        margin:auto;
        text-align:center;

        height:100px;
        padding-top:30px;
    }


    ul{
        font-size:36px;
    }


    ul li {
        list-style: none;


    }

</style>