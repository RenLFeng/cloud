<template>
  <div class="allSignStudent">
    <div v-if="item.length">
      <p v-for="(v,index) in item" :key="index">
        <mt-cell :title="`${v.studentName}: ${v.state?time:''}`" :value="v.state?$t('bankehHudong.CheckIn'):$t('bankehHudong.No_sign_in')"></mt-cell>
      </p>
    </div>
    <p v-if="!item.length" class="text-center">{{$t('bankehHudong.No_student_sign_in_record')}}</p>
  </div>
</template>

<script>
import commontools from "../../commontools";
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
  computed: {
    time() {
         return  commontools.longTime(this.item.signtime);
    }
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
