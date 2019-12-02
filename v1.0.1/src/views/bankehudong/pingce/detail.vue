<template>
  <div class="pingce-dtail-warp">
    <div class="main">
      <div class="pic">
        <img :src="require('@/assets/pc.jpeg')" alt />
        <p class="color9">
          王老师
          <span class="fr">{{pingceItemfile.createtime}}</span>
        </p>
      </div>
      <div class="list-main">
        <div class="content">
          <p class="clearfix tit">
            <span class="fl">23 人提交</span>
            <span class="fr">正确率 30%</span>
          </p>
          <List
          v-for="(v,index) in data"
          :key="index"
          :item="v"
          type="pingcedetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from "@/common/list";
export default {
  name: "",
  props: {
    data: {
      default() {
        return [];
      }
    }
  },
  components: {
    List
  },
  watch: {
    data: function(newValue, oldValue) {
      this.pingceItemfile = newValue;
    }
  },
  data() {
    return {
      pingceItemfile: {}
    };
  },

  methods: {}
};
</script>

<style lang='less' scoped>
.pingce-dtail-warp {
  .main {
    background: #fff;
    .pic {
      width: 75%;
      margin: 0 auto;
      padding: 30px 0 10px 0;
      img {
        width: 100%;
      }
      p {
        margin-top: 20px;
      }
    }
    .list-main {
      background: #f0f0f0;
      padding-top: 20px;
      .content {
        background: #fff;
        padding: 10px;
        .tit{
            border-bottom: 1px solid #f0f0f0;
            padding: 10px 0;
        }
      }
    }
  }
}
</style>
