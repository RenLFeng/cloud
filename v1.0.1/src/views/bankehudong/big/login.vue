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
      code: ""
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
      this.$http
        .post("api/banke/dapinglogin", {
          code: this.code,
          bankeid: this.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            this.$emit("login", res.data.data.daping);
            // console.log("dapinglogin", res);
          }else{
              Toast('连接错误')
          }
        })
        .catch(err => {
             Toast('异常')
        });
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
    height: 40vh;
    background: #f0f0f0;
  }
}
</style>
