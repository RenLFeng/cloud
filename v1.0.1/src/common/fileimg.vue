<template>
  <div class="file-img-wrap">
    <div class="main">
      <img class="img" :src="src" :onerror="errImg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
      src:{
          default:''
      },
      errImg:{
          default: ""
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
.file-img-wrap {
  .main {
    .img {
      border: 0;
      vertical-align: middle;
      width: 60px;
      height: 60px;
      border-radius: 10px;
      position: absolute;
    }
  }
}
</style>
