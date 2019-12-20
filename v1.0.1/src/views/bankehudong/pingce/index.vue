<template>
  <div class="pingce-wrap">
    <mt-header title="评测记录">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div
      class="main"
      v-if="pingceHistoryList.length"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="500"
      infinite-scroll-immediate-check="false"
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
      style="background:#f0f0f0"
    >
      <mt-header :title="pingceType(pingceItemfile.ptype)">
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
import { pingceType, CollectionFn, getZYFileTypeIcon } from "@/util";
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
const arr = {
  answerdesc: "",
  classid: 1000,
  createtime: "2019-12-17 10:48:45",
  files: "/downloads/pingce/2019-12-17/ae950d99cfbdabd73cf6d92eaa5237f7.jpeg",
  id: 1003,
  info: null,
  joinnum: 1,
  optdesc: "{opts : []}",
  ptype: 5,
  score: 10,
  timelimit: 600,
  totalnum: 3,
  userid: 1001
};
export default {
  name: "PingCe",
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
      editItemObj: {}
    };
  },
  mounted() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    }
    this.HistoryListRQuery();
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
      this.editItemObj.pic = this.editItemObj.files + "_snap.jpg";
      this.editItemObj.name=pingceType(this.editItemObj.ptype)
      CollectionFn(this.editItemObj, 4, imgIcon, this.editItemObj.id);
    },
    loadMore() {
      this.loading = true;
      this.isScorll = true;
      this.HistoryListRQuery();
    },
    HistoryListRQuery() {
      this.$http
        .post("api/pingce/query", {
          bankeid: this.bankeid,
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            // for (let i = 0; i < 5; i++) {
            //   res.data.data.push(arr);
            // }
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
      this.popupDeatil = true;
    },
    Backs() {
      this.$router.go(-1);
    },
    goBacks() {
      if (this.popupDeatil) {
        this.popupDeatil = false;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-wrap {
  .main {
    margin-top: 10px;
  }
}
</style>
