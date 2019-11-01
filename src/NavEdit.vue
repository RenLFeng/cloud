<template>

    <div >
        <div>
            <el-input v-model="msg.text"></el-input>
        </div>
        <div>
            <el-button v-on:click="back">取消</el-button> <el-button v-on:click="save">确定</el-button>
        </div>
    </div>
    
</template>

<script>

    import { mapState, mapActions } from 'vuex'

    function clone(obj){
        var o, obj;
        if (obj.constructor == Object){
            o = new obj.constructor();
        }else{
            o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
            if ( o[key] != obj[key] ){
                if ( typeof(obj[key]) == 'object' ){
                    o[key] = clone(obj[key]);
                }else{
                    o[key] = obj[key];
                }
            }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
    }

    var globalmsg = {
        text:''
    };

    export default {
        name: "NavOther",
        props:{
            //msg:Object,

        },
        computed:{

        },
        data(){  //! 生成局部变量， 避免全局污染
            return {
                msg:{
                    text:'',
                }
            }
        },
        created(){
            this.msg = clone(this.oldmsg);
        },
        methods:{
            back:function(){
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/')
            },
            save:function(){
                var localmsg = this.msg;
                console.log(localmsg);
                this.$store.commit('test/setMsg',  localmsg);
                this.back();
            },
        }
    }
</script>

<style scoped>

</style>