<template>
  <div class="memberdesc-main">
    <!-- <div v-if="showcontrol" class="uploadpart">
      <mt-tabbar class="uploadtabbar">
        <mt-tab-item id="1" @click.native="onMemberSign">
          <div>
            <img slot="icon" src="../assets/100x100.png" class="uploadimgsize" />
            <i class="iconfont iconfont-big iconqiandao0101"></i>
            <div>{{$t('common.Sign')}}</div>
            签到
          </div>
        </mt-tab-item>
        <mt-tab-item id="2" @click.native="onMemberGroup">
          <div>
            <img slot="icon" src="../assets/100x100.png" class="uploadimgsize" />
            <i class="iconfont iconfont-big iconfanganzhizuo_huaban"></i>
            <div>{{$t('bankeMember.Plan')}}</div>
            小组方案
          </div>
        </mt-tab-item>
      </mt-tabbar>
    </div>-->

    <div class="memberdesc clearfix">
      <div class="membertitledesc">
        {{$t('bankeZiYuan.Member')+$t('common.Total')}}
        <span
          style="padding-left:10px;"
        >{{membernumdesc}}人</span>
      </div>
      <div class="membernumdesc Average colord" @click="AverageScoreEchart">平均得分&nbsp;{{Average}}</div>
    </div>

    <div class="listcontainer">
      <div
        v-infinite-scroll="loadMoreMember"
        infinite-scroll-disabled="loadingState"
        infinite-scroll-distance="10"
      >
        <div
          v-for="(mitem,selindex) in members"
          v-bind:key="selindex"
          @click="seeMemberDetail(mitem)"
        >
          <BankeMemberSimple
            :indexShow="1"
            :icon="1"
            :memberuser="members[selindex]"
            :index="selindex"
          ></BankeMemberSimple>
        </div>
      </div>
      <div v-if="membersempty" class="tc emptydesc">{{$t(liststatedesc)}}</div>
    </div>
    <mt-popup
      v-model="popupMemberDetail"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="成员详情">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <div class="content-main">
        <MemberDetail :memberuser="DetailItem" :chartData="chartData" />
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";

import BankeMemberSimple from "./components/BankeMemberSimple";
import MemberDetail from "./bankeMember/detail";
import commontools from "../commontools";

export default {
  name: "BankeZiyuan",
  props: {
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      members: [],
      liststatedesc: "common.Loading",
      loadingState: false,
      isloading: false,
      Average: 0,
      popupMemberDetail: false,
      DetailItem: {},
      chartData: {}
    };
  },
  computed: {
    showcontrol() {
      if (this.$store.getters.isteacher) {
        return true;
      }
      return false;
    },
    membersempty() {
      if (this.members.length) {
        return false;
      }
      return true;
    },
    membernumdesc() {
      if (this.isloading) {
        return "common.Loading";
      }
      var nnum = 0;
      if (this.members.length) {
        nnum = this.members.length;
      }
      // nnum += ' 人';
      return nnum;
    }
  },
  created() {},
  components: {
    BankeMemberSimple,
    MemberDetail
  },
  methods: {
    seeMemberDetail(item) {
      this.DetailItem = item;
      this.popupMemberDetail = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
      this.chartData = {
        account: item.account
      };
    },
    AverageScoreEchart() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "AverageScore",
        params: { classid: this.bankeid }
      });
    },
    onMemberSign() {},
    onMemberGroup() {},
    loadMoreMember() {
      this.loadingState = true;
      this.isloading = true;
      var url = "/api/api/bankememberquery?bankeid=" + this.bankeid;
      this.$http
        .post(url)
        .then(res => {
          this.isloading = false;
          if (res.data.code == 0) {
            this.members = res.data.data["members"];
            for (let v of this.members) {
              this.Average =
                this.Average +
                v.score1 +
                v.score2 +
                v.score3 +
                v.score4 +
                v.score5;
            }
            this.Average = this.Average / this.members.length;
          }
          this.liststatedesc = "";
        })
        .catch(() => {
          this.isloading = false;
          this.loadingState = false;
        });
    },
    goBack() {
      if (this.popupMemberDetail) {
        this.popupMemberDetail = false;
      }
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    }
  }
};
</script>

<style scoped>
.memberdesc-main {
  background: #fff;
  margin-top: 10px;
}
.memberdesc {
  font-size: 18px;
  border-bottom: 1px solid #eaeaea;
  border-top: 1px solid #eaeaea;
  padding: 10px 10px;
}
.membertitledesc {
  float: left;
}

.membernumdesc {
  float: right;
}
.Average {
}

.loadmore {
  min-height: 200px;
}

.uploadtabbar {
  position: static;
}

.emptydesc {
  margin-top: 50px;
}

.uploadimgsize {
  width: 35px;
  heigth: 35px;

  margin-bottom: 2px;
}

.uploadtabbar img {
  border-radius: 50%;
}

.uploadpart {
}
.listcontainer {
}
</style>