<template>
  <div class="allSignInfo">
    <p @click="signquerymemberFn(item)">
      <mt-cell :title="`上课时间: ${item.starttime}`" is-link></mt-cell>
    </p>
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
    return {
    };
  },
  components: {

  },
  methods: {
    signquerymemberFn(item) {
      this.$emit("signquerymemberFn", item);
    },
  }
};
</script>

<style lang='less'>
.allSignInfo{
   .mint-cell:last-child {
    text-align: left !important;
  }
}
</style>
