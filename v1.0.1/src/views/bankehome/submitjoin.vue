<template>
  <div class="submit-join-wrap">
    <div class="main">
      <div class="info">
        <img :src="bankeItem.avatar" alt :onerror="$defaultImg('banke')"/>
        <p class="colorf">{{bankeItem.name}}</p>
      </div>
      <p class="name">教师&nbsp;{{bankeItem.username}}</p>
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" @click="submitJoin">加入</mt-button>
    </div>
  </div>
</template>

<script>

    import { Indicator, Toast, MessageBox, Popup, Button, Field } from "mint-ui";

export default {
  props: {
    bankeItem: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    submitJoin() {

        Indicator.open('处理中...');
        this.$http
            .post("/api/banke/reqmemberadd", {
                "bankeid":this.bankeItem.id
            })
            .then(res => {
                Indicator.close();
                if (res.data.code == "0") {
                    this.bankeItem=res.data.data.bankes[0];
                    this.popupSubmitJoin=true;

                    let tourl = "/bankehome/" + this.bankeItem.id;
                    this.$store.commit("setRouterForward", true);
                    this.$router.replace(tourl);
                } else {
                    MessageBox.alert("加入失败:"+res.data.msg);
                }
            })
            .catch(err => {
                Indicator.close();
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
      p {
        padding: 15px 0;
      }
    }
    .name {
      padding: 10px;
    }
  }
  .button-worp {
    width: 100%;
    position: absolute;
    bottom: 80px;
    button {
      background: #0089ff;
      color: #fff;
    }
  }
}
</style>
