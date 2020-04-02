<template>
  <div class="bnake-end-wrap popup-scroll">
    <div class="main main-f" v-if="EndCurbankes.length">
      <div v-for="(item,selindex) in EndCurbankes" :key="selindex">
        <BankeSimple :classitem="item" :end="true" @click.native="bankeclick(item)"></BankeSimple>
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button, Field } from "mint-ui";
import nativecode from "../../nativecode";
import Empty from "@/common/empty";
import BankeSimple from '../components/BankeSimple';
export default {
  props: {
    curbankes: {
      default() {
        return {};
      }
    },
      emitclick:{
        default(){
            return false;
        }
      }
  },
  data() {
    return {
      EndCurbankes: [],
      bankeitem: {}
    };
  },
  computed: {},
  created() {
    this.queryfinished();
  },
  mounted() {},
  watch: {
    curbankes:function(New,old) {
      this.EndCurbankes=New;
    }
  },
  methods: {
    queryfinished() {},
    bankeclick(bankeitem) {

      this.bankeitem = bankeitem;
      if (this.emitclick){
          this.$emit('bankeclick', bankeitem);
          return;
      }

      this.bankeDedail();
    },
    //进入班课
    bankeDedail() {
      if (this.bankeitem.id) {
        let tourl = "/bankehome/" + this.bankeitem.id;
        if (!nativecode.navigateTo(tourl)) {
          this.$store.commit("setRouterForward", true);
          this.$router.push(tourl);
        }
      }
    }
  },
  components: {
    Empty,
    BankeSimple
  }
};
</script>

<style scoped lang="less">
.bnake-end-wrap {
  .main {
  }
}
</style>
