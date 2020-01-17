<template>
  <div class="about-wrap">
    <div class="main">
      <div class="file tc position-c">
        <p class="icon-b">
          <i class="iconfont iconyunpingtai position-c"></i>
        </p>
        <p class="fontnormal">中科卓软云班课</p>
        <p class="color9 font16">V 1.0 Build {{buildver}}</p>
      </div>
      <p class="footer color9 tc font16">
        <span>深圳市中科卓软科技有限公司 版权所有</span>
        <span>www.exsoft.com.cn</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
        buildver:'20011701'
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style lang="less">
.about-wrap {
  .main {
    width: 100%;
    height: 93vh;
    min-height: 93vh;
    background: #f0f0f0;
    .file {
      p {
        padding: 5px 0;
      }
      .icon-b {
        position: relative;
        width: 120px;
        height: 120px;
        background: rgba(0, 137, 255, 1);
        margin: 0 auto;
        border-radius: 20px;
        i {
          font-size: 80px;
          color: #fff;
        }
      }
    }
    .footer {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 30px;
      span {
        display: block;
      }
    }
  }
}
</style>
