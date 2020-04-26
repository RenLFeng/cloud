<template>
  <div class="bnake-end-wrap popup-scroll">
    <mt-header title="已结束班课" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="$back">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div
      class="main main-f overflow-scroll"
      v-if="EndCurbankes.length"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <div v-for="(item,selindex) in EndCurbankes" :key="selindex">
        <BankeSimple :classitem="item" :end="true" @click.native="bankeclick(item)"></BankeSimple>
      </div>
      <BottomLoadmore v-if="listLoadend && allLoaded" showType loadtext="已经加载全部了" type color />
      <BottomLoadmore
        v-if="!allLoaded && loading"
        showType="loading"
        loadtext="加载中..."
        type="triple-bounce"
        color
      />
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button, Field } from "mint-ui";
import nativecode from "../../nativecode";
import Empty from "@/common/empty";
import BankeSimple from "../components/BankeSimple";
import BottomLoadmore from "@/common/bottom-loadmore";
export default {
  name: "EndClass",
  props: {
    curbankes: {
      default() {
        return {};
      }
    },
    emitclick: {
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      EndCurbankes: [],
      bankeitem: {},
      page: 0,
      pagesize: 10,
      loading: false,
      listLoadend: false,
      allLoaded: false
    };
  },
  computed: {},
  created() {
    this.queryfinished();
  },
  mounted() {},
  watch: {
    curbankes: function(New, old) {
      // this.EndCurbankes = New;
    }
  },
  methods: {
    loadMore() {
      this.loading = true;
      this.queryfinished();
    },
    //查询已结束班课
    queryfinished() {
      this.$http
        .post("/api/banke/queryfinished", {
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.length >= this.pagesize) {
              this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.loading = true;
              this.allLoaded = true;
            }
            this.EndCurbankes = [... this.EndCurbankes,...res.data.data];
          } else {
            Toast("出错了");
          }
        })
        .catch(err => {
          Toast("服务异常...");
        });
    },
    bankeclick(bankeitem) {
      this.bankeitem = bankeitem;
      if (this.emitclick) {
        this.$emit("bankeclick", bankeitem);
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
    BankeSimple,
    BottomLoadmore
  }
};
</script>

<style scoped lang="less">
.bnake-end-wrap {
  .main {
    height: 93vh;
    min-height: 93vh;
  }
}
</style>
