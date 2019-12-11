<template>
  <div class="empty-wrap tc">
    <i class="iconfont fontmaintitle" :class="icon"></i>
    <p v-for="t in text" :key="t">{{t}}</p>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      default: "iconzanwushuju"
    },
    text: {
      default() {
        return ["暂无数据..."];
      }
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
.empty-wrap {
  position: fixed;
  width: 100%;
  max-width: 640px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
    color: #999;
    i {
    font-size: 30px;
  }
  p{
    margin: 5px 0;
  }
}
</style>
