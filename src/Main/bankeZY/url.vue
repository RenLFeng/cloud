<template>
  <div class="url-container">
    <div class="border-e5-bottom">
      <mt-field label="链接:" placeholder="请输入链接" v-model="url"></mt-field>
      <mt-field label="标题:" placeholder="请输入标题" v-model="urlTitle"></mt-field>
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" type="primary" @click="submit">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";
export default {
  name: "",
  props: {
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      url: "",
      urlTitle: ""
    };
  },
  computed: {},
  methods: {
    submit() {
      if (!this.urlTitle || !this.url) {
        MessageBox.alert("请填写详细信息");
      }
      this.$http
        .post("/api/bankefile/linkadd?bankeid=" + this.bankeid, {
          url: this.url,
          name: this.urlTitle
        })
        .then(res => {
          if(res.data.code==0){
            MessageBox.alert("添加成功");
          }else{
             MessageBox.alert(res.data.msg);
          }
          console.log(res);
        })
        .catch(() => {});
    },
  }
};
</script>

<style lang='less' scoped>
.url-container {
  .button-worp {
    margin-top: 10px;
  }
}
</style>
