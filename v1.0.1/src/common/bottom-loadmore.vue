<template>
  <div class="bottom-loadmore-wrap">
    <div class="main">
      <div class="box" :class="showType=='loading'?'loading':''">
        <mt-spinner v-if="showType=='loading'" class="load-icon" :type="type" :color="color"></mt-spinner>
        <p class="load-text">{{loadtext}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from "mint-ui";
export default {
  props: {
    showType: {
      default: "loading"
    },
    loadtext: {
      default: "加载中..."
    },
    type: {
      default: "triple-bounce"
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
  components: {
    [Spinner.name]:Spinner
  }
};
</script>

<style scoped lang="less">
.bottom-loadmore-wrap {
  .main {
    .box {
      position: relative;
      height: 40px;
      .load-icon {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      .load-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        font-size: 14px;
      }
      &.loading {
        height: 60px;
        .load-text {
          bottom: 10px;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }
  }
}
</style>
