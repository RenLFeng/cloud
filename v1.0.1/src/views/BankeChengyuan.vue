<template>
  <div class="memberdesc-main">
    <div class="memberdesc clearfix Average-wrap">
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

    <div class="listcontainer Member scrollingtouch">
      <mt-loadmore
        :top-method="loadTop"
        @top-status-change="handleTopChange"
        :top-distance="80"
        ref="loadmore"
        class
        :auto-fill="autofill"
      >
        <div class="list-wrap">
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
      </mt-loadmore>
    </div>
    <mt-popup
      v-model="popupMemberDetail"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="成员详情" class>
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <div class="content-main popup-scroll-MemberDetail">
        <MemberDetail :memberuser="DetailItem" :chartData="chartData" />
      </div>
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Actionsheet } from "mint-ui";
import { filterItem } from "@/util";
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
    },
    schollid: {
      default: 0
    }
  },
  data() {
    return {
      members: [],
      membersid: [],
      liststatedesc: "",
      loadingState: false,
      isloading: false,
      Average: 0,
      popupMemberDetail: false,
      DetailItem: {},
      chartData: {},

      actionShow: false,

      autofill: false,
      topStatus: false
    };
  },
  computed: {
    isteacher() {
      let isteacher = this.$store.getters.caneditbanke;
      return isteacher;
    },
    showcontrol() {
      if (this.$store.getters.caneditbanke) {
        return true;
      }
      return false;
    },
    actions() {
      let objret = [];
      objret.push({
        name: "查看",
        method: this.see
      });
      let canopt = this.$store.getters.caneditbanke;
      if (canopt) {
        objret.push({
          name: "删除",
          method: this.dlMember
        });
      }
      return objret;
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
    MemberDetail,
    [Actionsheet.name]: Actionsheet
  },
  methods: {
    loadTop() {
      this.loadMoreMember();
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
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
      let deluserid = this.DetailItem.memberuserid;
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          this.$http
            .post("/api/banke/memberdelete", {
              bankeid: this.bankeid,
              userid: deluserid
            })
            .then(res => {
              if (res.data.code == 0) {
                Toast("删除成功");
                for (let i = 0; i < this.members.length; i++) {
                  if (this.members[i].memberuserid == deluserid) {
                    this.members.splice(i, 1);
                    break;
                  }
                }
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
            let members = res.data.data["members"];
            for (let v of members) {
              if (!v.name) {
                v.name = "未知名";
              }
              if(!v.avatar){
                v.avatar='';
              }
              this.membersid.push(v.memberuserid);
            }
            let curbanke = this.$store.state.curbanke;
            if (typeof curbanke["scorerule1"] == "undefined") {
            }
            for (let v of members) {
              v.score = 0;
              v.score =
                (v.score1 * curbanke.scorerule1) / 100 +
                (v.score2 * curbanke.scorerule2) / 100 +
                (v.score3 * curbanke.scorerule3) / 100 +
                (v.score4 * curbanke.scorerule4) / 100;
              this.Average += v.score;
            }
            this.Average = parseInt(
              this.Average / (members.length ? members.length : 1)
            );
            if (this.schollid && members.length) {
              this.querybind(members);
            } else {
              this.members = members;
            }
          }
          this.liststatedesc = "";
          Indicator.close();
          this.$refs.loadmore.onTopLoaded();
        })
        .catch(() => {
          this.isloading = false;
          this.loadingState = false;
          Indicator.close();
          this.$refs.loadmore.onTopLoaded();
        });
    },
    //查询是否有绑定
    querybind(members) {
      this.$http
        .post("/api/school/querybind", {
          schoolid: this.schollid,
          userids: this.membersid
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.bind.length) {
              for (let v of members) {
                for (let item of res.data.data.bind) {
                  if (v.memberuserid == item.userid) {
                    v.sno = item.sno;
                    v.snoTitle = item.schoolrole > 5 ? "工号" : "学号";
                  }
                }
              }
            }
          }
          this.members = members;
        })
        .catch(err => {
          this.members = members;
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
  /* background: #fff; */
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
.Average-wrap {
  background: #fff;
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
.listcontainer.Member {
  height: 71vh;
  min-height: 71vh;
  overflow: scroll;
}
.listcontainer.Member .list-wrap{
  min-height: 71vh;
}
.popup-scroll-MemberDetail {
  height: 100vh;
  min-height: 100vh;
  overflow: auto;
  padding-bottom: 50px;
}
</style>