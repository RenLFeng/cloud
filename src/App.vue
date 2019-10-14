<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>

      <el-button v-on:click="textdec">pre</el-button> <el-button v-on:click="textinc">next </el-button>
    </div>
    <ExamItem :msg="msg"></ExamItem>
  </div>
</template>

<script>


import ExamItem from './components/ExamItem.vue'


var textarray1 = [
    {text:'11'
    },
    {text:'22'
    ,sel:['a.第一个选择', 'b.第二个选择', 'c.第三个选择']
    },
    {text:'{{__}}原上草,一岁一{{__}},{{__}}烧不尽,春风{{__}}',
     type:'fill'
    },
    {text:'44'}
    ];
var gindex = 0;

function count(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }else if(t == 'object'){
        var n = 0;
        for(var i in o){
            n++;
        }
        return n;
    }
    return false;
};

export default {
  name: 'app',
    props:{
        showmsg:false,
        msg:{},
        textindex:0
    },
created(){

},
    methods:{
      textinc:function(){

        var len = 0;
        len = textarray1.length;
       // console.log(len);
        gindex++;
        if ( gindex >= len){
            gindex = len-1;
        }
        if (gindex < 0){
            gindex = 0;
        }

        this.msg = textarray1[gindex];
      //  console.log(this.msg);

       //   console.log(textarray1);
          console.log('textinc');


          // this.$http({
          //     method:'post',
          //     url:'/index/index/usertest',
          // }).then(function(res){
          //     console.log(res);
          // }).catch(function(err){
          //
          // })
      },
        textdec:function(){
          gindex--;
          if (gindex <0){
              gindex = 0;
          }
          this.msg = textarray1[gindex];

          console.log(textarray1);
        }
    },
  components: {
      ExamItem
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
