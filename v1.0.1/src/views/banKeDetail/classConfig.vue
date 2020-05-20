<template>
  <div class="class-config-wrap">
    <div class="main">
      <mt-cell title="允许学生加入">
        <mt-switch v-model="disablejoin"></mt-switch>
      </mt-cell>
      <mt-cell title="允许学生退课">
        <mt-switch v-model="disablequit"></mt-switch>
      </mt-cell>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Switch, DatetimePicker } from "mint-ui";
export default {
  props: {
    bankeInfo: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      disablejoin: "",
      disablequit: ""
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    disablejoin: function(n, v) {
      if (!n) {
        this.$emit("setdisablejoin", "disablejoin");
      }
    },
    disablequit: function(n, v) {
      if (!n) {
        this.$emit("setdisablequit", "disablequit");
      }
    }
  },
  methods: {
    // submit() {
    //   if (!this.bankeInfo.info) {
    //     Toast("请输入公告");
    //     return;
    //   }
    //   this.$http
    //     .post("api/banke/updateinfo", {
    //       id: this.bankeInfo.id,
    //       info: this.bankeInfo.info
    //     })
    //     .then(res => {
    //       if (res.data.code == "0") {
    //         Toast("发布成功");
    //         // this.$emit('submitSuccess',false)
    //       }
    //     })
    //     .catch(err => {});
    // }
  },
  components: { [Switch.name]: Switch }
};
</script>

<style scoped lang="less">
.class-config-wrap {
  .main {
  }
}
</style>
