<template>
  <div class="Notice-content-main">
    <input type="textarea" class="textarea" placeholder="请输入公告内容" v-model="textareaData" />
    <mt-button type="primary" @click.native="submit">发布</mt-button>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button } from "mint-ui";
export default {
  name: "",

  data() {
    return {
      textareaData: ""
    };
  },

  methods: {
    submit() {
      if (!this.textareaData) {
        Toast("请输入公告");
        rturn;
      }
      this.$http
        .post("api/banke/updateinfo", { info: this.textareaData })
        .then(res => {
          if (res.data.code == "0") {
            Toast("发布成功");
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='less'>
.Notice-content-main {
  padding: 10px;
  background: #fff;
  .textarea {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
    padding: 10px;
  }
  button {
    width: 100%;
    margin: 0 auto;
    border-radius: 20px;
  }
}
</style>
