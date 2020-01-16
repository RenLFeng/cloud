<template>
  <div class="Zanbi-main">
    <p style="padding:10px;">设置各类教学活动在学生得分中的占比。</p>
    <div class="content">
      <div class="item-box">
        <p class="tit">资源得分占比：</p>
        <p class="input">
          <input type="number" v-model="scorerule1" :disabled="!caneditbanke" />
          <span>%</span>
        </p>
      </div>
      <div class="item-box">
        <p class="tit">签到得分占比：</p>
        <p class="input">
          <input type="number" v-model="scorerule2" :disabled="!caneditbanke" />
          <span>%</span>
        </p>
      </div>
      <div class="item-box">
        <p class="tit">作业得分占比：</p>
        <p class="input">
          <input type="number" v-model="scorerule3" :disabled="!caneditbanke" />
          <span>%</span>
        </p>
      </div>
      <div class="item-box">
        <p class="tit">评测得分占比：</p>
        <p class="input">
          <input type="number" v-model="scorerule4" :disabled="!caneditbanke" />
          <span>%</span>
        </p>
      </div>
      <p class="footer-btn" v-if="caneditbanke">
        <mt-button type="default" @click.native="Submit" class="submit">确认</mt-button>
        <mt-button type="default" @click.native="reSet" class="seSet">恢复默认</mt-button>
      </p>
    </div>
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
  data() {
    return {
      scorerule1: this.bankeInfo.scorerule1,
      scorerule2: this.bankeInfo.scorerule2,
      scorerule3: this.bankeInfo.scorerule3,
      scorerule4: this.bankeInfo.scorerule4,
      scorerule5: this.bankeInfo.scorerule5
    };
  },

  methods: {
    Submit() {
      this.$http
        .post("api/banke/updateinfo", {
          id: this.bankeInfo.id,
          scorerule1: this.scorerule1,
          scorerule2: this.scorerule2,
          scorerule3: this.scorerule3,
          scorerule4: this.scorerule4
        })
        .then(res => {
          if (res.data.code == "0") {
         //   Toast("成功");
            this.$emit("submitSuccess", false);
          } else {
            Toast("失败");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    reSet() {}
  }
};
</script>

<style lang='less'>
.Zanbi-main {
  .content {
    background: #fff;
    padding: 10px;
    .item-box {
      margin-bottom: 10px;
      .tit {
        margin-bottom: 10px;
      }
      .input {
        position: relative;
        input {
          width: 95%;
          margin: 0 auto;
          padding: 10px 5px;
          border: 1px solid #0089ff;
          border-radius: 10px;
          background: #fff;
        }
        span {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
    .footer-btn {
      margin-top: 30px;
      button {
        width: 45%;
        text-align: center;
        border-radius: 20px;
        // padding: 10px 0;
        &.submit {
          border: 1px solid #0089ff;
          margin-right: 5%;
        }
        &.seSet {
          border: 1px solid #aaa;
          margin-left: 5%;
        }
      }
    }
  }
}
</style>
