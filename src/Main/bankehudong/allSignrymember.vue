<template>
  <div class="allSignStudent">
    <div v-if="item.length">
      <p v-for="(v,index) in item" :key="index">
        <mt-cell :title="`${v.studentName}: ${v.state?v.signtime:''}`" :value="v.state?'已签到':'未签到'"></mt-cell>
      </p>
    </div>
    <p v-if="!item.length" class="text-center">暂无学生签到记录</p>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    item: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  created() {
    console.log("hfhf", this.item);
  },
  methods: {}
};
</script>

<style lang='less'>
.allSignStudent {
  padding: 10px;
  .mint-cell:last-child {
    text-align: left !important;
  }
}
</style>
