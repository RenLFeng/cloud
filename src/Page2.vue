<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <el-button v-on:click="tealogin">教师账户登录</el-button>

      <el-button v-on:click="usertest">测试用户信息</el-button>
    </div>


    <hr/>

    <div style="margin-top:50px;">操作结果： {{ tipmsg }}</div>
  </div>
</template>

<script>



export default {
  name: 'app',
    props:{
        showmsg:false,
        msg:{},
        textindex:0,
        tipmsg:'',
    },
 mounted() {

    },
    methods:{
      tealogin:function(){
        this.tipmsg = 'tea 登录中';
        var othis = this;
        this.$http({
            method:'post',
            url: "/index/index/apilogin",
            data:{
                account:'teacher',
                password:'teacher'
            },
            headers: {'X-Requested-With': 'XMLHttpRequest'},
        }).then(function(res){
                console.log(res);
                othis.tipmsg = res.data.msg;

        })
      },
        usertest:function(){
          this.tipmsg = 'usertest...';
          var othis = this;
          this.$http({
              method:'post',
              url:'/index/index/usertest',
          }).then(function(res){
              console.log(res);
              othis.tipmsg = JSON.stringify(res.data);
            }).catch(function(err){

          })
        }
    },
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
