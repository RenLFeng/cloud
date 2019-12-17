<template>
  <div class="memberdesc-main">
    <div class="memberdesc clearfix">
      <div class="membertitledesc">
        {{$t('bankeZiYuan.Member')+$t('common.Total')}}
        <span
          style="padding-left:10px;"
        >{{membernumdesc}}人</span>
      </div>
      <div class="membernumdesc Average colord" @click="AverageScoreEchart">
        平均得分&nbsp;{{Average}}
        <i class="iconfont iconjiantou eicotrigger colord"></i>
      </div>
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
            @editclick="onEditclick"
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
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Actionsheet } from "mint-ui";

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
      liststatedesc: "",
      loadingState: false,
      isloading: false,
      Average: 0,
      popupMemberDetail: false,
      DetailItem: {},
      chartData: {},

      actionShow: false,
      actions: [
        {
          name: "查看",
          method: this.see
        },
        {
          name: "删除",
          method: this.dlMember
        }
      ]
    };
  },
  computed: {
    showcontrol() {
      if (this.$store.getters.caneditbanke) {
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
        return "";
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
    onEditclick(item) {
      this.DetailItem = item;
      this.actionShow = true;
    },
    see() {
      this.actionShow = false;
      this.popupMemberDetail = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
      this.chartData = {
        account: item.account
      };
    },
    dlMember() {
      if (!this.showcontrol) {
        Toast("你无权限");
        return;
      }
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          this.$http
            .post("/api/banke/reqmemberleave", {
              bankeid: this.bankeid
            })
            .then(res => {
              if (res.data.code == 0) {
                Toast("删除成功");
              } else {
                Toast("删除失败");
              }
            })
            .catch(() => {
              Toast("服务异常");
            });
        })
        .catch(() => {});
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
      Indicator.open("加载中");
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
            this.Average = parseInt(
              this.Average / (this.members.length ? this.members.length : 1)
            );
          }
          this.liststatedesc = "";
          Indicator.close();
        })
        .catch(() => {
          this.isloading = false;
          this.loadingState = false;
          Indicator.close();
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
.memberdesc-main .head {
  background: #fff;
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
.Average i {
  font-size: 22px;
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