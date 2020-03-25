<template>
  <div class="big-main-login">
    <div class="container bg-d">
      <div class="top tc">
        <p class="icon">
          <i class="iconfont icondapingmu eicotrigger"></i>
        </p>
        <p>请输入大屏上的连接码进行登录</p>
        <p class="code clearfix">
          <span :class="v.isact?'act':''" v-for="(v,index) in codes" :key="index">{{v.i}}</span>
        </p>
        <p class="icon-wrap" @click="autoSign">
          <i class="iconfont iconok- position-l" :class="isAuto?'act':''"></i>
          连接大屏后自动开始签到
        </p>
      </div>
      <div class="key">
        <van-number-keyboard
          :show="show"
          :hide-on-click-outside="false"
          extra-key="."
          @blur="show = false"
          @input="onInput"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import Vue from "vue";
import NumberKeyboard from "vant/lib/number-keyboard";
import "vant/lib/number-keyboard/style";
Vue.use(NumberKeyboard);
export default {
  name: "daplogin",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {},
  data() {
    return {
      show: true,
      codes: [
        {
          i: "",
          isact: false
        },
        {
          i: "",
          isact: false
        },
        {
          i: "",
          isact: false
        },
        {
          i: "",
          isact: false
        }
      ],
      tempCode: [],
      count: 0,
      code: "",
      isAuto: true
    };
  },
  mounted() {},
  methods: {
    onInput(value) {
      if (this.count > 3) return;
      this.codes.splice(this.count, 1, {
        i: value,
        isact: true
      });
      this.tempCode.push(value);
      //   console.log("tempCode", this.tempCode);
      this.count++;

      if (this.count > 3) {
        this.code = "";
        for (let v of this.tempCode) {
          this.code += v;
        }
        this.code = parseInt(this.code);
        // console.log("parseInt", this.code);
        this.dapinglogin();
      }
    },
    onDelete() {
      if (this.count == 0) return;
      this.count--;
      this.codes.splice(this.count, 1, {
        i: "",
        isact: false
      });
      this.tempCode.splice(this.tempCode.length - 1, 1);
      //   console.log(this.tempCode);
    },
    dapinglogin() {
      //! cjy: 检测当前bankeid的有效性
      if (this.bankeid == 0) {
        Toast("当前班课无效， 请返回重试");
        return;
      }
      this.$http
        .post("/api/banke/dapinglogin", {
          code: this.code,
          bankeid: this.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            this.$emit("login", res.data.data.daping);
            Toast("连接成功");
            // console.log("dapinglogin", res);
            if (this.isAuto) {
              this.postdapingmsg();
            }
          } else {
            Toast("连接错误：" + res.data.msg);
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    postdapingmsg() {
      this.$http
        .post("/api/banke/postdapingmsg", {
          bankeid: this.bankeid,
          ecode: this.code,
          data: "",
          cmd: "sign"
        })
        .then(res => {
          if (res.data.code == "0") {
          } else {
          }
        })
        .catch(err => {});
    },
    autoSign() {
      this.isAuto = !this.isAuto;
    }
  }
};
</script>

<style lang='less' scoped>
.big-main-login {
  max-height: 100vh;
  overflow: hidden;
  .top {
    height: 60vh;
    position: relative;
    .icon {
      height: 165px;
      line-height: 165px;
      i {
        width: 100%;
        font-size: 80px;
        color: #aaa;
      }
    }
    .code {
      margin-top: 2.66667rem;
      width: 75%;
      margin: 80px auto;
      height: 36px;
      line-height: 36px;
      span {
        width: 15%;
        height: 100%;
        display: inline-block;
        margin: 0 5%;
        background: #666;
        height: 5px;
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 6px;
        &.act {
          height: 0;
        }
      }
    }
  }
  .key {
    height: 32vh;
    background: #f0f0f0;
  }
  .icon-wrap {
    position: absolute;
    width: 60%;
    left: 50%;
    bottom: 30px;
    transform: translate(-50%, 0);
    text-align: left;
    padding-left: 40px;
    color: #000000;
    .iconfont {
      color: transparent;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      font-size: 26px;
      &.act {
        color: #ff8900;
        border: none;
      }
    }
  }
}
</style>
