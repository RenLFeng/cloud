<template>
    <div class="tc loginbg">
        <div class="fontmaintitle maintitle">
            云平台Cloud
        </div>
        <div class="fontlarge loginpart">
            <div class="loginline">
                <input v-model="account" placeholder="输入账户名" autocomplete="off" class="logininput fontnormal"></input>
            </div>
            <div class="loginline">
                <input v-model="password" placeholder="输入密码" type="password" autocomplete="off" class="logininput fontnormal"></input>
            </div>
            <button class="loginbtn fontnormal" @click="dologin">登录</button>
        </div>
    </div>
    
</template>

<script>
    import {Indicator, Toast,MessageBox } from 'mint-ui';

    export default {
        name: "Login"
        ,data(){
            return {
                password:'',
                account:''
            }
        }
        ,methods:{
            dologin:function(){
                Indicator.open('登录中');
                var url = '/api/api/login';
                var othis = this;
                this.$http.post(url,
                    {
                        account:this.account,
                        password:this.password
                })
                    .then((res)=>{
                        Indicator.close();
                        if (res.data.code == 0){
                            //console.log('login ok');
                            this.$store.commit('setLoginUser', res.data.data);
                            this.$store.commit('setRouterForward', true);
                            this.$router.push('/');
                        }
                        else{
                            Toast(res.data.msg);
                        }
                    })
                    .catch((res)=>{
                       // console.log(res);
                       Indicator.close();
                       Toast('异常');
                    });

            }
        }
    }
</script>

<style scoped>

    .loginbg{
        background: linear-gradient(to bottom right, #74bfff , #0089FF); /* 标准的语法 */

    }
    .maintitle{

        color:white;
        top:15%;
        left:0;
        width:100%;

        position:absolute;

    }
    .loginpart{
        position:absolute;
        top:35%;
        height:65%;
        left:0;
        width:100%;
        background-color:white;
        border-top-left-radius: 20px;
        border-top-right-radius:20px;

        padding-top:100px;
    }
    .logininput{
        border:none;
        border-bottom:1px solid #d3d3d3;
        width:80%;

        margin:20px auto;
    }
    .loginline{
        line-height:50px;
    }
    .loginbtn{
        background-color:#0089ff;
        border:none;
        border-radius:13px;
        padding:20px 0;
        margin:0;
        color:white;

        width:80%;

        margin:30px auto;
    }

</style>