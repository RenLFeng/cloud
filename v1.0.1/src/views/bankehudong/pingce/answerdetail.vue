<template>
  <div class="answer-detail-wrap">
    <div class="main">
      <p class="tit">
        <img class="itemavatar" :src="memBerItem.avatar" :onerror="$defaultImg('account')" />
        {{memBerItem.name}}
        <span class="time">{{memBerItem.countdate}}</span>
      </p>
      <p v-if="memBerItem.answerdesc.textarea" class="answer">{{memBerItem.answerdesc.textarea}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    memBerItem: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("@/assets/100x100.png");
      srcstr += '"';
      return srcstr;
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="less">
.answer-detail-wrap {
  .main {
      padding: 10px;
      .tit{
          img{
              width: 30px;
              margin-right: 10px;
              border-radius: 50%;
          }
          .time{
              margin-left:10px;
          }
      }
      .answer{
          margin-top: 20px;
      }
  }
}
</style>
