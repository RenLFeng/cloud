<template>
  <div class="Notice-content-main">
    <mt-field
      :placeholder="caneditbanke?'请输入公告内容':'暂无公告'"
      type="textarea"
      rows="8"
      v-model="bankeInfo.info"
      :disabled="!caneditbanke"
      @blur.native.capture="$setInputScroll"
    ></mt-field>
    <mt-button v-if="caneditbanke" type="primary" @click.native="submit">发布</mt-button>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button, Field } from "mint-ui";
export default {
  name: "",
  props: {
    bankeInfo: {
      default() {
        return {};
      }
    },
    caneditbanke: {
      default: true
    }
  },
  watch: {},
  computed: {},
  data() {
    return {};
  },
  methods: {
    submit() {
      if (!this.bankeInfo.info) {
        Toast("请输入公告");
        return;
      }
      this.$http
        .post("api/banke/updateinfo", {
          id: this.bankeInfo.id,
          info: this.bankeInfo.info
        })
        .then(res => {
          if (res.data.code == "0") {
            Toast("发布成功");

            // this.$emit('submitSuccess',false)
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
