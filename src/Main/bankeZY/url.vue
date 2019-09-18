<template>
  <div class="url-container">
    <div class="border-e5-bottom">
          <mt-field label="链接:" placeholder="请输入链接" v-model="url"></mt-field>
      <mt-field label="标题:" placeholder="请输入标题" v-model="urlTitle"></mt-field>
    </div>
         <div class="submit-fixed">
      <mt-button class="botton-96" type="default" @click="submit">提交</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      url:'',
urlTitle:''
    }
  },
computed:{
  
},
  methods: {
submit(){

}
  }
}
</script>

<style lang='less' scoped>

</style>
