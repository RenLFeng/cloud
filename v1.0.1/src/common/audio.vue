<template>
  <div class="audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
        <div class="audio-wrap">
            <audio src="http://192.168.0.2:9982/downloads/bankefile/20200110/4f0d2d85c379e8c092888dc47aa20f5b.mp3"></audio>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
      filename:{
          default:'未知文件名'
      }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
      goBacks(){

      },
  },
  components: {}
};
</script>

<style scoped lang="less">
.audio-wrap {
  .main {
  }
}
</style>
