<template>
  <div class="Settedinfo-wrap">
    <mt-header title="欢迎使用" class="mint-header-f"></mt-header>
    <div class="main main-f">
      <div class="avatar-wrap">
        <img
          :src="user.avatar"
          :onerror="$defaultImg('account')"
          class="avatarimgpart avatar position-c"
        />
      </div>
      <div class="text-wrap">
        <mt-field label="真实姓名" placeholder="请输入您的姓名" v-model="username"></mt-field>
        <p class="toips">请输入姓名，方便大家认识你。</p>
        <div class="cell-wrap" @click="onbindNewSchool">
          <mt-cell title="绑定学校(可选)" is-link v-model="schoolInfo.name"></mt-cell>
        </div>
        <div class="button-wrap" @click="submit()">
          <mt-button :class="isSubmit?'isSubmit':''" type="default">开始使用</mt-button>
          <p class="toips">*你可以在“我的”页面中随时修改个人信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Field, Button, Toast, MessageBox } from "mint-ui";
export default {
  props: {
    curuser: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      username: ""
    };
  },
  computed: {
    schoolInfo() {
      return this.$store.state.schoolname;
    },
    user() {
      return this.$store.getters.curuser;
    },
    isSubmit() {
      if (this.username) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    submit() {
      if (!this.isSubmit) {
        Toast("请输入您的姓名");
        return;
      }
      this.$http
        .post("/api/api/userUpdateInfo", {
          name: this.username,
          hassettedinfo: true
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$emit("updateName", false);
            this.$store.commit("SET_SCHOOL_NAME", {});
          } else {
            MessageBox({
              title: "设置失败",
              message: "你可以在我的页面设置相关想项?",
              showCancelButton: false
            }).then(action => {
              this.$emit("updateName", false);
              this.$store.commit("SET_SCHOOL_NAME", {});
            });
          }
        })
        .catch(error => {
          Toast("服务异常");
          this.$emit("updateName", false);
          this.$store.commit("SET_SCHOOL_NAME", {});
        });
    },
    onbindNewSchool() {
      this.$store.commit("SET_TEDINFO", true);
      this.$store.commit("SET_BIND_SCHOLL", true);
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "BindSchool",
        params: { ShowType: true }
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.Settedinfo-wrap {
  //   overflow: hidden;
  .main {
    height: 94vh;
    min-height: 94vh;
    .avatar-wrap {
      width: 100%;
      height: 25vh;
      min-height: 25vh;
      position: relative;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .text-wrap {
      height: 69vh;
      min-height: 69vh;
      overflow: auto;
    }
    .button-wrap {
      width: 100%;
      height: 57px;
      padding: 0 10px;
      margin-top: 35px;
      text-align: center;
      button {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background: #aaaaaa;
        color: #5d5d5d;
        &.isSubmit {
          background: #0089ff;
          color: #fff;
        }
      }
    }
    .toips {
      padding: 5px 10px 13px;
      color: #999;
    }
  }
}
</style>
