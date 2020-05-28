<template>
  <div class="bk-zy-xq">
    <div class="curbanke-info">
      <ul>
        <li class="clearfix">
          <img
            class="fl"
            :src="imgfilepath?imgfilepath:bankeInfo.avatar"
            :onerror="$defaultImg('banke')"
          />
          <div class="po">
            <div class="sub-po">
              <span class="tit fontlarge ellipse">{{bankeInfo.name}}</span>
              <span class="teacher font16 ellipse">教师:&nbsp;{{bankeInfo.username}}</span>
              <span class="nub font16 ellipse">班课号:&nbsp;{{bankeInfo.id}}</span>
            </div>
          </div>
        </li>
      </ul>
      <i class="iconfont iconbianji11 position-r colord" @click="editBkFn" v-if="caneditbanke"></i>
    </div>
    <div class="cell-wrap">
      <ul class>
        <li class="school" @click="showSchoo">
          <mt-cell title="所属学校" is-link></mt-cell>
        </li>
        <div class="devide"></div>
        <li v-if="caneditbanke">
          <ul class="list-wrap">
            <li @click="setNotice">
              <mt-cell title="发布公告" is-link></mt-cell>
            </li>
            <li @click="classConfigfn">
              <mt-cell title="班级设置" is-link></mt-cell>
            </li>
            <li @click="setProportion">
              <mt-cell title="得分占比设置" is-link></mt-cell>
            </li>
            <div class="devide"></div>

            <li @click="situation">
              <mt-cell title="学情统计" is-link></mt-cell>
            </li>
            <div class="devide"></div>

            <li @click="sharebanke" v-if="cansharebanke">
              <mt-cell title="分享班课" is-link></mt-cell>
            </li>
            <div class="devide" v-if="cansharebanke"></div>

            <li @click="edBk">
              <mt-cell title="结束班课" is-link></mt-cell>
            </li>
          </ul>
        </li>
        <li v-else>
          <ul>
            <div class="devide"></div>
            <li @click="setNotice">
              <mt-cell title="查看公告" is-link></mt-cell>
            </li>
            <li @click="setProportion">
              <mt-cell title="查看得分占比" is-link></mt-cell>
            </li>
            <div class="devide"></div>

            <li @click="sharebanke" v-if="cansharebanke">
              <mt-cell title="分享班课" is-link></mt-cell>
            </li>
            <div class="devide" v-if="cansharebanke"></div>

            <div v-if="haseditrole">
              <li @click="situation">
                <mt-cell title="学情统计" is-link></mt-cell>
              </li>
              <div class="devide"></div>

              <li @click="closeBk" class="dange" v-if="showbankedange">
                <mt-cell title="删除班课" is-link></mt-cell>
              </li>
            </div>
            <div v-else>
              <li @click="bankesearch" class="dange" v-if="showbankedange">
                <mt-cell title="退出班课" is-link></mt-cell>
              </li>
            </div>
          </ul>
        </li>
      </ul>
    </div>
    <mt-popup v-model="editBkState" position="right" class="popup-right" :modal="false">
      <mt-header :title="$t('bankeXingQing.EditClass')">
        <mt-button slot="left" icon="back" @click="goBack">{{$t('confirm.Cancel')}}</mt-button>
      </mt-header>
      <edit
        :bankeInfo="bankeInfo"
        :editBkState="editBkState"
        v-if="editBkState"
        @imgSrcLoad="onImgSrcLoad"
      />
    </mt-popup>

    <mt-popup
      v-model="popupNotice"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header :title="caneditbanke?'发布公告':'查看公告'">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <Notice :bankeInfo="bankeInfo" @submitSuccess="onSubmitSuccess" :caneditbanke="caneditbanke" />
    </mt-popup>
    <mt-popup
      v-model="popupProportion"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="得分占比">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <Proportion
        :bankeInfo="bankeInfo"
        @submitSuccess="onSubmitSuccess"
        :caneditbanke="caneditbanke"
      />
    </mt-popup>
    <mt-popup
      v-model="popupSchool"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="所属学校" class="mint-header-f">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <div class="main main-f">
        <div class="scholl-wrap">
          <div v-for="(v,i) in schoolInfo" :key="i" class="item">
            <img class="avatar" :src="v.avatar" :onerror="$defaultImg('school')" />
            <p class="fontsmall">{{v.name}}</p>
          </div>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupClassConfig"
      position="right"
      class="popup-right info-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <ClassConfig v-if="popupClassConfig" :bankeInfo="bankeInfo" @back="goBack" />
    </mt-popup>
  </div>
</template>

<script>
import { MessageBox, Indicator, Toast } from "mint-ui";
import edit from "./edit";
import ClassConfig from "./classConfig";
import Notice from "./Notice";
import Proportion from "./Proportion";
import nativecode from "@/nativecode";
export default {
  name: "",
  props: {
    bankeInfo: {
      default() {
        return {
          name: "",
          avatar: "",
          id: 0,
          info: "",
          funcdesc: { disablejoin: true, disablequit: true },
          scorerule1: "",
          scorerule2: "",
          scorerule3: "",
          scorerule4: "",
          scorerule5: "",
          username: ""
        };
      }
    }
  },
  watch: {
    bankeInfo(newValue, oldValue) {
      this.bankeInfoData = newValue;
    }
  },
  components: {
    edit,
    Notice,
    Proportion,
    ClassConfig
  },
  data() {
    return {
      popupNotice: false,
      popupProportion: false,
      imgfilepath: "",
      bankeInfoData: {},
      editBkState: false,
      titData: {},
      popupSchool: false,
      schoolInfo: [],

      popupClassConfig: false
    };
  },

  computed: {
    caneditbanke() {
      let caneditbanke = this.$store.getters.caneditbanke;
      return caneditbanke;
    },
    showbankedange() {
      if (nativecode.platform == "exsoftdaping") {
        return false;
      }
      return true;
    },
    haseditrole() {
      return this.$store.getters.haseditbankerole;
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += "/assets/100x100.png";
      srcstr += '"';
      return srcstr;
    },
    cansharebanke() {
      if (this.bankeInfo.states > 0 && nativecode.hassharebanke()) {
        return true;
      }
      return false;
    }
  },
  created() {},
  methods: {
    ondisablequit(v) {},
    ondisablejoin(v) {},
    showSchoo() {
      // console.log("vv", this.bankeInfo);
      console.log(this.bankeInfo);
      if (!this.bankeInfo.schoolid) {
        Toast("未绑定过学校");
        return;
      }
      Indicator.open("加载中...");
      this.$http
        .post("/api/school/queryschool", {
          page: 0,
          pagesize: 50,
          id: this.bankeInfo.schoolid
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length) {
            this.schoolInfo = res.data.data;
            this.popupSchool = true;
          } else {
            Toast("未找到数据");
          }
          Indicator.close();
        })
        .catch(err => {
          Indicator.close();
        });
    },
    //班级设置
    classConfigfn() {
      this.popupClassConfig = true;
    },
    //发布公告
    setNotice() {
      this.popupNotice = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    //得分占比
    setProportion() {
      this.popupProportion = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    onSubmitSuccess(v) {
      if (this.popupProportion) {
        this.popupProportion = v;
      }
      if (this.popupNotice) {
        this.popupNotice = v;
      }
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    },
    //学情统计
    situation() {
      let url =
        "http://192.168.0.237:8088/#/ClassStatistics?backendid=" +
        this.bankeInfo.id +
        "&from=" +
        1;
      if (process.env.NODE_ENV !== "development") {
        url = document.location.origin;
        url +=
          "/backend/#/ClassStatistics?backendid=" +
          this.bankeInfo.id +
          "&from=" +
          1;
      }
      window.location.href = url;
      sessionStorage.setItem("homelocalstate", "");
    },
    editBkFn() {
      if (!this.caneditbanke) return;
      this.editBkState = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    sharebanke() {
      nativecode.dosharebanke(this.bankeInfo);
    },

    edBk() {
      if (!this.caneditbanke) return;

      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t("common.End") + " " + this.$t("common.Class") + "?",
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      })
        .then(() => {
          //! cjy: 二次确认
          MessageBox.confirm("", {
            title: this.$t("confirm.Tips"),
            message: "结束后，只能查阅， 不可再开始该班课，是否继续？",
            confirmButtonText: this.$t("confirm.Ok"),
            cancelButtonText: this.$t("confirm.Cancel"),
            showCancelButton: true
          }).then(() => {
            this.finishbanke();
          });
        })
        .catch(err => {});
    },
    finishbanke() {
      let BankeData = this.$store.state.banke.curbankes;
      this.$http
        .post("/api/banke/updateinfo", {
          id: this.bankeInfo.id,
          states: 0
        })
        .then(res => {
          if (res.data.code == 0) {
            MessageBox.alert(this.$t("confirm.Success")).then(() => {
              for (let item of BankeData) {
                if (item.id == res.data.data.id) {
                  item.states = 0;
                }
              }
              // Object.assign()
              this.$store.commit("banke/appendBankes", BankeData);
              this.remocurbanke(res.data.data.id);
            });
          } else {
            MessageBox.alert(res.data.msg).then(() => {});
          }
        })
        .catch(() => {});
    },
    bankesearch() {
      this.$http
        .post("/api/banke/search", {
          id: this.bankeInfo.id
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length > 0) {
            let bankeItem = res.data.data[0];
            if (bankeItem.funcdesc == "{}" || !bankeItem.funcdesc) {
              this.quitBk();
            } else {
              if (bankeItem.funcdesc.includes("disablequit")) {
                Toast("禁止退出班课");
                return;
              } else {
                this.quitBk();
              }
            }
          }
        })
        .catch(err => {
          Toast("服务出错了");
        });
    },
    quitBk() {
      MessageBox.confirm("", {
        title: "提示",
        message:
          "退出当前班课后,提交的作业及得分等数据将会清空,无法恢复,请谨慎操作！",
        confirmButtonText: "确认退出",
        cancelButtonText: "取消",
        showCancelButton: true
      }).then(res => {
        MessageBox.confirm("", {
          title: "提示",
          message:
            "请再次确认是否要退出当前班课,退出当前班课后,提交的作业及得分等数据将会清空,无法恢复,请谨慎操作！",
          confirmButtonText: "退出并清除数据",
          cancelButtonText: "取消",
          showCancelButton: true
        }).then(res => {
          this.$http
            .post("/api/banke/reqmemberleave", { bankeid: this.bankeInfo.id })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("退出成功").then(() => {
                  this.remocurbanke(this.bankeInfo.id);
                  this.$store.commit("setRouterForward", true);
                  this.$router.push("/");
                });
              } else {
                MessageBox.alert(res.data.msg).then(() => {});
              }
            });
        });
      });
      return;
    },
    remocurbanke(id) {
      let BankeData = this.$store.state.banke.curbankes;
      let newBankeData = BankeData.filter(item => item.id !== id);
      this.$store.commit("banke/setBankes", newBankeData);
    },
    closeBk() {
      let BankeData = this.$store.state.banke.curbankes;
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t("common.Delete") + " " + this.$t("common.Class") + "?",
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      })
        .then(res => {
          this.$http
            .post("/api/banke/delete", { id: this.bankeInfo.id })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert(this.$t("confirm.Success")).then(() => {
                  let newBankeData = BankeData.filter(
                    item => item.id !== this.bankeInfo.id
                  );
                  this.$store.state.banke.curbankes = newBankeData;
                  this.$back();
                });
              } else {
                MessageBox.alert(res.data.msg).then(() => {});
              }
            })
            .catch(() => {});
        })
        .catch(err => {});
    },
    onImgSrcLoad(data) {
      this.imgfilepath = data;
      this.editBkState = false;
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    },
    goBack() {
      if (this.popupClassConfig) {
        this.popupClassConfig = false;
      }
      if (this.popupNotice) {
        this.popupNotice = false;
      }
      if (this.popupProportion) {
        this.popupProportion = false;
      }
      if (this.editBkState) {
        this.editBkState = false;
      }
      if (this.popupSchool) {
        this.popupSchool = false;
      }
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    }
  },
  destroyed() {
    this.imgfilepath = "";
  }
};
</script>

<style lang="less" scoped>
.bk-zy-xq {
  .main {
    margin-top: 56px;
  }
  .curbanke-info {
    .iconbianji11 {
      font-size: 30px;
    }
    width: 100%;
    position: relative;
    background: #fff;
    ul {
      padding: 10px;
      li.dange {
        color: red;
      }
      li {
        position: relative;
        img {
          width: 88px;
          height: 88px;
          min-width: 88px;
          min-height: 88px;
        }

        div.po {
          position: absolute;
          width: 75%;
          height: 100%;
          left: 100px;
          top: 50%;
          transform: translate(0, -50%);
          .sub-po {
            position: absolute;
            width: 100%;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
            span {
              display: block;
              padding: 3px 0;
            }
          }
        }
      }
    }
  }
  .cell-wrap {
    margin-top: 20px;
    height: 60vh;
    min-height: 60vh;
    overflow: auto;
    .list-wrap {
      background: #fff;
      .school {
        padding-right: 15px;
      }
    }
  }
  .popup-right {
    width: 100%;
  }
  .scholl-wrap {
    .item {
      position: relative;
      padding: 30px 30px 30px 80px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translate(0, -50%);
        border-radius: 30px;
      }
      .name {
      }
    }
  }
}
</style>
<style>
.mint-cell {
  background-image: none !important;
}
.mint-cell .mint-cell-wrapper {
  text-indent: 10px;
  padding: 0;
  font-size: 3.5vw;
}
</style>
