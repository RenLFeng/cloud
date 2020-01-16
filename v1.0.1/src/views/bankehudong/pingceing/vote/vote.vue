<template>
  <div class="vote-wrap footer-item footer-item-x">
    <div class="mian">
      <div class="answer-wrap">
        <Filelist :listData="pingceData.info.opts" @voteSelect="onSelect" />
      </div>
    </div>
    <div class="footer-wrap">
      <p class="tit border-b">请选择你支持的答案</p>
      <p class="submit-btn">
        <mt-button type="default" :class="isSubmit?'act':''" @click="sumint">{{isSubmitEnd?'已提交':'提交'}}</mt-button>
      </p>
    </div>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox, Loadmore } from "mint-ui";
import Filelist from "./filelist";
export default {
  name: "Vote",
  props: {
    type: {
      default: 10
    },
    submited: {
      default: false
    },
    pingceData: {
      default() {
        return {};
      }
    }
  },
  watch: {
    submited: function(newValue, oldValue) {
      this.isSubmitEnd = newValue;
    },
    pingceData: function(newValue, oldValue) {
      console.log("是的范德萨范德萨", newValue);
      this.listData = newValue;
    }
  },
  data() {
    return {
      isSubmitEnd: false,
      // isSubmit: false,
      tempAnswer: [],
      listData: {},
      info: []
    };
  },
  computed: {
    isSubmit() {
      if (this.submited) {
        return false;
      } else {
        for (let v of this.pingceData.info.opts) {
          if (v.isAct) {
            return true;
          }
        }
      }
    }
  },
  components: {
    Filelist
  },

  methods: {
    onSelect(items) {
      let i = items.index;
      this.info = items.obj;
      this.pingceData.info.opts = [];
      for (let v of items.obj) {
        this.pingceData.info.opts.push(v);
        if (v.isAct) {
          this.tempAnswer = [i];
        }
      }
      console.log("pvoteSelect", this.pingceData.info.opts);
    },
    sumint() {
      if (!this.isSubmit && !this.isSubmitEnd) {
        Toast("请投票");
        return;
      }
      if (this.isSubmitEnd) {
        Toast("你已提交过");
        return;
      }
      console.log("投票", this.tempAnswer);
      this.$emit("submitFn", this.tempAnswer);
      this.tempAnswer = [];
    }
  }
};
</script>

<style lang='less'>
.vote-wrap {
  .mian {
    .answer-wrap {
      height: 70vh;
      min-height: 70vh;
      overflow-y: scroll;
      background: #f0f0f0;
      padding: 10px 5px;
    }
  }
}
</style>
