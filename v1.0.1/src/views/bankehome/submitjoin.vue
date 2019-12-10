<template>
  <div class="submit-join-wrap">
    <div class="main">
      <div class="info">
        <img
          src="http://192.168.0.237:8080/downloads/zuoye/2019-12-09/00e6bfd11d32aa565c73252f3548fa22.jpg"
          alt
        />
        <p class="colorf">测试课堂</p>
      </div>
      <p class="name">王老师</p>
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" @click="submitJoin">加入</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    submitJoin() {
      this.$http
        .post("", {})
        .then(res => {
          if (res.data.code == "0") {
            Toast("加入成功");
          } else {
            MessageBox.alert("加入失败");
          }
        })
        .catch(err => {
          Toast("服务异常");
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.submit-join-wrap {
    position: relative;
        height: 100vh;
        min-height: 100vh;
        width: 100%;
  .main {
    background: #fff;
    .info {
      background: #0089ff;
      text-align: center;
      padding: 20px;
      img {
        width: 100px;
        height: 100px;
      }
      p{
          padding: 15px 0;
          
      }
    }
    .name {
      padding: 10px;
    }
  }
  .button-worp{
      width: 100%;
      position: absolute;
      bottom: 80px;
      button{
          background: #0089FF;
          color: #fff;
      }
  }
}
</style>
