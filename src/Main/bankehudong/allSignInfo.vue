<template>
  <div class="allSignInfo">
    <p @click="signquerymemberFn(item)">
      <mt-cell :title="`${$t('bankehHudong.Start_class_time')+':'+time}`" is-link></mt-cell>
      <!-- <mt-cell :title="`上课时间: ${item.starttime}`" is-link></mt-cell> -->
    </p>
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
  components: {},
  computed: {
    time() {
      return commontools.longTime(this.item.starttime);
    }
  },
  methods: {
    signquerymemberFn(item) {
      this.$emit("signquerymemberFn", item);
    }
  }
};
</script>

<style lang='less'>
.allSignInfo {
  .mint-cell:last-child {
    text-align: left !important;
  }
}
</style>
