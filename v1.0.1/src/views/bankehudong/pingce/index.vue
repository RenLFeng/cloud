<template>
  <div class="pingce-wrap">
    <mt-header title="评测记录" class="mint-header-f">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="van-navbr-wrap">
      <ul>
        <li
          v-for="(v,i) in tabBar"
          :key="i"
          :class="v.isActive?'active':''"
          @click="selectClick($event,v,i)"
          ref="tbLi"
        >
          <span class="lable font18">{{v.label}}</span>
          <span class="num fontxs">{{v.num}}</span>
        </li>
        <span class="move-bar" :style="`left:${moveBar}px`"></span>
      </ul>
    </div>
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
      <!-- <p v-if="isScorll && !scorllEd" class="tc color9">
        <van-loading size="24px">加载中...</van-loading>
      </p>-->
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
    Empty
  },

  data() {
    return {
      pingceHistoryList: [],
      tempHistory: [],
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
      pingceid: 0,

      moveBar: 0,
      filterType: 0,
      tabBar: [
        {
          id: 0,
          label: "ALL",
          num: 0,
          isActive: true
        },
        {
          id: 2,
          label: "选择",
          num: 0,
          isActive: false
        },
        {
          id: 1,
          label: "判断",
          num: 0,
          isActive: false
        },
        {
          id: 4,
          label: "主观",
          num: 0,
          isActive: false
        },
        {
          id: 5,
          label: "写作",
          num: 0,
          isActive: false
        },
        {
          id: 6,
          label: "抢答",
          num: 0,
          isActive: false
        },
        {
          id: 10,
          label: "投票",
          num: 0,
          isActive: false
        }
        // {
        //   id: 5,
        //   label: "写作",
        //   num: 0,
        //   isActive: false
        // },
        // {
        //   id: 6,
        //   label: "抢答",
        //   num: 0,
        //   isActive: false
        // },
        // {
        //   id: 10,
        //   label: "投票",
        //   num: 0,
        //   isActive: false
        // }
      ]
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
    selectClick(e, v, i) {
      let curel = this.$refs.tbLi[i];
      // console.log(curel.offsetLeft);
      this.moveBar = curel.offsetLeft;
      this.filterType = v.id;

      // return;
      // let ev = e || window.event;
      // console.log(ev);
      // this.$nextTick(()=>{
      //   alert(ev.offsetX)
      // })
      for (let v of this.tabBar) {
        v.isActive = false;
      }
      this.tabBar[i].isActive = true;
      this.filterData(this.filterType);
    },
    filterData(type) {
      if (!type) {
        this.pingceHistoryList = this.tempHistory;
        return;
      }
      this.pingceHistoryList = this.tempHistory.filter(item => {
        if (type == 2) {
          return type == item.ptype || item.ptype == 3;
        } else {
          return type == item.ptype;
        }
      });
      this.$nextTick(() => {});
    },
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
            this.tempHistory = [...this.tempHistory, ...res.data.data];
            this.filterData(this.filterType);
            this.Statistics(this.tempHistory);
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
    },
    Statistics(arr) {
      if (Array.isArray(arr)) {
        this.initStatistics();
        this.tabBar[0].num = arr.length;
        for (let i = 0; i < arr.length; ++i) {
          let ptype = arr[i].ptype;
          for (let j = 1; j < this.tabBar.length; j++) {
            let v = this.tabBar[j];
            if (v.id == ptype || (v.id == 2 && ptype == 3)) {
              v.num++;
            }
          }
        }
      }
      console.log("ccc", this.tabBar);
    },
    initStatistics() {
      for (let v of this.tabBar) {
        v.num = 0;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-wrap {
  .van-navbr-wrap {
    position: fixed;
    z-index: 99;
    width: 100vw;
    height: 54px;
    overflow: hidden;
    margin-top: 49px;
    background: #fff;
    > ul {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      li {
        display: flex;
        width: 52px;
        height: 54px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span {
          color: #5d5d5d;
        }
        .lable {
        }
        .num {
        }
        &.active {
          span {
            color: #0089ff;
          }
        }
      }
      .move-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 52px;
        height: 3px;
        background: #0089ff;
      }
    }
  }
  .main {
    margin-top: 110px;
  }
}
</style>
<style>
.pingce-wrap .van-tabs__nav {
  border: none;
  border-radius: 0;
}
.pingce-wrap .van-tabs__wrap {
  width: 100%;
}
</style>