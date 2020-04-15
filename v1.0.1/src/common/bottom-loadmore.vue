<template>
  <div class="bottom-loadmore-wrap">
    <div class="main">
      <div class="box">
        <mt-spinner class="load-icon" :type="type" :color="color"></mt-spinner>
        <p class="load-text">{{loadtext}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from "mint-ui";
export default {
  props: {
    loadtext: {
      default: "加载中..."
    },
    type: {
      default: "snake"
    },
    color: {
      default: "#ccc"
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="less">
.bottom-loadmore-wrap {
  .main {
    .box {
      position: relative;
      height: 60px;
      .load-icon {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      .load-text {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>
