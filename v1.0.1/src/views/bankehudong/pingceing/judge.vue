<template>
  <div class="footer-item footer-item-j">
    <ul class="clearfix" v-if="type=='1'">
      <li class="fl" v-for="(item,index) in indexNumber" :key="index" @click="select(item)">
        <span :class="item.isTrue?'act':''">{{item.v}}</span>
      </li>
    </ul>
    <div v-if="type=='5'">
      <mt-field
        v-model="textareaAnswer"
        :disabled="isSubmitEnd"
        placeholder="请输入答案后点击提交"
        type="textarea"
        rows="6"
      ></mt-field>
    </div>
    <div v-if="type=='6'">
      <div class="Responder tc fontnormal" v-if="!ponderState" @click="ResponderFn">点击抢答</div>
      <p v-if="ponderState" class="colory tc Responder-ed">{{ResponderText}}</p>
    </div>
    <p class="submit-btn" v-if="type!='6'">
      <mt-button
        type="default"
        :class="isSubmit?'act':''"
        @click="sumint"
      >{{isSubmitEnd?'已提交':'提交'}}</mt-button>
    </p>
  </div>
</template>

<script>
import {Indicator, Toast, MessageBox } from "mint-ui";
const indexNumber = [
  {
    v: "正确",
    id: "A",
    isTrue: false
  },
  {
    v: "错误",
    id: "B",
    isTrue: false
  }
];
export default {
  name: "",
  props: {
    type: {
      default: 1
    },
    submited: {
      default: false
    }
  },
  watch: {
    textareaAnswer: function(newValue, oldValue) {
      if (newValue == "") {
        this.isSubmit = false;
      } else {
        this.isSubmit = true;
      }
    },
    submited: function(newValue, oldValue) {
      this.isSubmitEnd = newValue;
    }
  },
  data() {
    return {
      indexNumber: [],
      isSubmit: false,
      isSubmitEnd: false,
      Answer: [],
      textareaAnswer: "",
      ponderState: false
    };
  },
  computed: {
    ResponderText() {
      return "抢答成功，请您作答...";
    }
  },
  created() {
    for (let v of indexNumber) {
      this.indexNumber.push({
        v:v.v,
        id: v.id,
        isTrue: false
      });
    }
  },
  methods: {
    select(item) {
      if (this.isSubmitEnd) {
        return;
      }
      for (let v of this.indexNumber) {
        v.isTrue = false;
      }
      item.isTrue = true;
      this.Answer = [item.id];
      this.isSubmit = true;
    },
    sumint() {
      if (!this.isSubmit && !this.isSubmitEnd) {
        Toast("请选择");
        return;
      }
      if (this.isSubmitEnd) {
        Toast("你已提交过");
        return;
      }
      if (this.type == "1") {
        this.$emit("submitFn", this.Answer);
        this.Answer = [];
        this.isSubmit = false;
      } else if (this.type == "5") {
        this.$emit("submitFn", this.textareaAnswer);
        this.isSubmit = false;
      }
    },
    //抢答
    ResponderFn() {
      if (this.isSubmitEnd) {
        Toast("你已抢答过");
        return;
      }
      this.ponderState = true;
      this.$emit("submitFn", "");
    }
  }
};
</script>

<style lang='less'>
.footer-item-j {
  ul {
    li {
      width: 50%;
      margin-bottom: 10px;
      span {
        width: 70%;
        margin: 0 15%;
        &.act {
          background: #0089ff;
          color: #fff;
        }
      }
    }
  }
  textarea {
    border: 1px solid #0089ff;
    border-radius: 11px;
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 10px;
  }
  .Responder {
    width: 140px;
    height: 140px;
    line-height: 140px;
    background: linear-gradient(
      180deg,
      rgba(255, 196, 170, 1) 0%,
      rgba(255, 7, 0, 1) 100%
    );
    border-radius: 50%;
    margin: 50px auto;
    color: #fff;
  }
  .Responder-ed {
    margin: 100px auto;
  }
}
</style>
