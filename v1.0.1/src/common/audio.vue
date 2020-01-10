<template>
  <div class="audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">

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
