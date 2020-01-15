<template>
  <div class="pingce-wrap">
    <mt-header title="评测记录" class="mint-header-f">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div
      class="main"
      v-if="pingceHistoryList.length"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="500"
      infinite-scroll-immediate-check	="false"
    >
      <List
        v-for="(v,index) in pingceHistoryList"
        :key="index"
        :item="v"
        type="pingce"
        @click.native="details(v)"
        @edit="onEdit"
      />
      <p v-if="isScorll && !scorllEd" class="tc color9">
        <van-loading size="24px">加载中...</van-loading>
      </p>
      <p v-if="scorllEd && isScorll" class="tc color9">我是有底线的...</p>
    </div>
    <Empty v-else />
    <mt-popup
      v-model="popupDeatil"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0;    overflow: auto;"
    >
      <mt-header :title="pingceType(pingceItemfile.ptype)" class>
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Deatil :data="pingceItemfile" />
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import Loading from "vant/lib/loading";
import "vant/lib/loading/style";
import Empty from "@/common/empty";
import List from "@/common/list";
import Deatil from "./detail";
import { pingceType, CollectionFn } from "@/util";
import {
  Button,
  Indicator,
  Toast,
  Cell,
  MessageBox,
  Loadmore,
  InfiniteScroll,
  Actionsheet
} from "mint-ui";
export default {
  name: "PingCe",
  watch: {
    popupDeatil: function(val) {}
  },
  components: {
    List,
    Deatil,
    Empty,
    [Loading.name]: Loading
  },

  data() {
    return {
      pingceHistoryList: [],
      bankeid: 0,

      popupDeatil: false,

      pingceItemfile: {},
      pingceType,

      page: 0,
      pagesize: 10,
      loading: false,
      isScorll: false,
      scorllEd: false,

      actions: [
        {
          name: "收藏",
          method: this.Collection
        }
      ],
      actionShow: false,
      editItemObj: {},

      showsingle: false,
      pingceid: 0
    };
  },
  mounted() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    } else if (params.pingceid) {
      this.pingceid = params.pingceid;
      this.showsingle = true;
    }
    this.loadMore();
    // this.HistoryListRQuery();
  },
  methods: {
    onEdit(item) {
      console.log(item);
      this.editItemObj = item;
      this.actionShow = true;
    },
    //收藏
    Collection() {
      let imgIcon = "";
      //this.editItemObj.pic = this.editItemObj.files + "_snap.jpg";
      //this.editItemObj.name=pingceType(this.editItemObj.ptype)
      imgIcon = this.editItemObj.files + "_snap.jpg";
      let title = pingceType(this.editItemObj.ptype);
      let cobj = {};
      CollectionFn(cobj, 4, imgIcon, this.editItemObj.id, this.bankeid, title);
    },
    loadMore() {
      this.loading = true;
      this.isScorll = true;
      this.HistoryListRQuery();
    },
    HistoryListRQuery() {
      let qobj = {
        page: this.page,
        pagesize: this.pagesize
      };
      if (this.showsingle) {
        qobj.id = this.pingceid;
      } else {
        qobj.bankeid = this.bankeid;
      }
      this.$http
        .post("api/pingce/query", qobj)
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.length < this.pagesize) {
              this.loading = true;
              this.scorllEd = true;
            } else {
              this.loading = false;
              this.isScorll = false;
              this.page++;
            }
            this.pingceHistoryList = [
              ...this.pingceHistoryList,
              ...res.data.data
            ];
            console.log("pingce/query", res);
            if (this.showsingle) {
              if (res.data.data.length == 0) {
                Toast("未找到记录");
              } else {
                this.details(this.pingceHistoryList[0]);
              }
            }
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    details(v) {
      this.pingceItemfile = v;
      if (
        this.pingceItemfile.info &&
        typeof this.pingceItemfile.info == "string"
      ) {
        this.pingceItemfile.info = JSON.parse(this.pingceItemfile.info);
        for (let i = 0; i < this.pingceItemfile.info.opts.length; i++) {
          this.pingceItemfile.info.opts[i] = JSON.parse(
            this.pingceItemfile.info.opts[i]
          );
        }
      }
      console.log("vcvc", v);
      this.popupDeatil = true;
    },
    Backs() {
     this.$back();
        //alert('pcindex:'+window.history.length);
     //   window.history.length > 1 ? this.$router.go(-1) : this.$router.replace('/')
    },
    goBacks() {
      if (this.popupDeatil) {
        this.popupDeatil = false;
        if (this.showsingle) {
          this.Backs();
        }
      }
    },
    handler(e) {
      e.preventDefault();
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-wrap {
  .main {
    margin-top: 50px;
  }
}
</style>
