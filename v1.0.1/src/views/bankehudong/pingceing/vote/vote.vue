<template>
  <div class="vote-wrap footer-item footer-item-x">
    <div class="mian">
      <div class="answer-wrap">

      </div>
    </div>
    <div class="footer-wrap">
      <p class="tit border-b">请选择你支持的答案</p>
      <p class="submit-btn">
        <mt-button type="default" :class="isSubmit?'act':''" @click="sumint">提交</mt-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    type: {
      default: 10
    },
    submited: {
      default: false
    }
  },
  watch: {
    submited: function(newValue, oldValue) {
      this.isSubmitEnd = newValue;
    }
  },
  data() {
    return {
      isSubmitEnd: false,
      isSubmit: false,
      tempAnswer:[]
    };
  },

  methods: {
    sumint() {
      if (!this.isSubmit && !this.isSubmitEnd) {
        Toast("请选择");
        return;
      }
      if (this.isSubmitEnd) {
        Toast("你已提交过");
        return;
      }
      this.isSubmit = false;
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
    }
  }
}
</style>
