<template>
  <div class="addbanke-wrap">
    <div class="main">
      <mt-header title="加入班课">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <mt-field placeholder="请输入班课名" v-model="bankeNumber"></mt-field>
      <div class="button-worp">
        <mt-button class="button-auto-96" @click="join">下一步</mt-button>
      </div>
    </div>
    <mt-popup
      v-model="popupSubmitJoin"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header style="background:#0089FF!important;">
        <mt-button
          style="color:#fff!important;"
          icon="back"
          slot="left"
          @click="goback"
        >{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Submitjoin :bankeItem="bankeItem"/>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Actionsheet, Field } from "mint-ui";
import Submitjoin from "./submitjoin";
export default {
  name: "Join",
  props: {},
  data() {
    return {
      bankeNumber: "",
      popupSubmitJoin: false,
      bankeItem:{}
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    join() {
      if (!this.bankeNumber) {
        Toast("请输入班号");
        return;
      }
      this.$http
        .post("/api/banke/reqmemberadd", {
          	"bankeid":this.bankeNumber
        })
        .then(res => {
          if (res.data.code == "0") {
            this.bankeItem=res.data.data.bankes[0];
            this.popupSubmitJoin=true;
          } else {
            MessageBox.alert("你已加入或班课号不存在");
          }
        })
        .catch(err => {
          Toast("服务异常");
        });
    },
    goback() {
      if (this.popupSubmitJoin) {
        this.popupSubmitJoin = false;
      }
    }
  },
  components: {
    Submitjoin
  }
};
</script>

<style scoped lang="less">
.addbanke-wrap {
  .main {
    .mint-field {
      margin: 10px 0;
      padding: 0 10px;
    }
  }
  .button-worp {
    margin-top: 50px;
  }
}
</style>
