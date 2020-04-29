<template>
  <div class="footer-item footer-item-d">
    <ul class="clearfix" :class="indexNumber.length<4?'flex':''">
      <li class="fl" v-for="(item,index) in indexNumber" :key="index" @click="select(item)">
        <span :class="item.isTrue?'act':''">{{item.v}}</span>
      </li>
    </ul>
    <p class="submit-btn">
      <mt-button
        type="default"
        :class="isSubmit?'act':''"
        @click="sumint"
      >{{isSubmitEnd?'已提交':'提交'}}</mt-button>
    </p>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
const indexNumber = [];
export default {
  name: "",
  props: {
    optdesc: {
      default() {
        return ["A", "B", "C", "D", "E", "F", "J"];
      }
    },
    type: {
      default: 3
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
      indexNumber: [],
      isSubmit: false,
      isSubmitEnd: false,
      tempAnswer: []
    };
  },
  created() {
    for (let v of this.optdesc) {
      this.indexNumber.push({
        v: v,
        isTrue: false
      });
    }
  },
  mounted() {},
  computed: {},
  methods: {
    select(item) {
      if (this.isSubmitEnd) {
        return;
      }
      if (this.type == "3") {
        //单选
        for (let v of this.indexNumber) {
          v.isTrue = false;
        }
        item.isTrue = true;
        this.tempAnswer = [item.v];
        this.isSubmit = true;
        // this.$emit("selectFn", { item: item, type: "3" });
      } else if (this.type == "2") {
        //多选
        item.isTrue = !item.isTrue;
        if (item.isTrue) {
          this.tempAnswer.push(item.v);
        } else {
          for (let key in this.tempAnswer) {
            if (item.v == this.tempAnswer[key]) {
              this.tempAnswer.splice(key, 1);
            }
          }
        }
        // this.$emit("selectFn", item);
        for (let v of this.indexNumber) {
          if (v.isTrue) {
            this.isSubmit = true;
            return;
          } else {
            this.isSubmit = false;
          }
        }
      }
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
      this.isSubmit = false;
      this.$emit("submitFn", this.tempAnswer);
      this.tempAnswer = [];
      // for (let v of this.indexNumber) {
      //   v.isTrue = false;
      // }
    }
  }
};
</script>

<style lang='less'>
.footer-item {
  ul {
    margin-bottom: 20px;
    &.flex {
      display: flex;
      justify-content: center;
    }
    li {
      width: 25%;
      margin-bottom: 10px;
      span {
        display: block;
        width: 50px;
        height: 50px;
        margin: 0 23%;
        border: 2px solid #0089ff;
        line-height: 50px;
        text-align: center;
        border-radius: 50px;
        font-weight: bold;
        font-size: 22px;
        color: #0089ff;
        &.act {
          background: #0089ff;
          color: #fff;
        }
      }
    }
  }
  .submit-btn {
    width: 90%;
    margin: 0 auto;
    button {
      width: 100%;
      background: #aaa;
      border-radius: 20px;
      color: #fff;
      &.act {
        background: #3ee17f;
      }
    }
  }
}
</style>
