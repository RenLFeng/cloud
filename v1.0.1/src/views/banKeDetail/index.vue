<template>
  <div class="bk-zy-xq">
    <div class="curbanke-info">
      <ul>
        <li class="clearIt">
          <img
            class="float-l"
            :src="imgfilepath?imgfilepath:bankeInfo.avatar"
            :onerror="$defaultImg('banke')"
          />
          <div class="po">
            <div class="sub-po">
              <span class>班课名:{{bankeInfo.name}}</span>
              <span class>教师:{{bankeInfo.username}}</span>
              <span class>班课号:{{bankeInfo.id}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="cell-wrap">
      <ul class="border-bottom-e5">
        <li v-if="caneditbanke">
          <ul>
            <li @click="editBkFn">
              <mt-cell :title="$t('bankeXingQing.EditClass')" is-link></mt-cell>
            </li>
            <li @click="setNotice">
              <mt-cell title="发布公告" is-link></mt-cell>
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
            <div class="devide"  v-if="cansharebanke"></div>


            <li @click="edBk">
              <mt-cell :title="$t('bankeXingQing.EndingClass')" is-link></mt-cell>
            </li>



          </ul>
        </li>
        <li v-else>
          <ul>
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
            <div class="devide"  v-if="cansharebanke"></div>

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
              <li @click="closeBk" class="dange" v-if="showbankedange">
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
      <edit :bankeInfo="bankeInfo" :editBkState="editBkState" @imgSrcLoad="onImgSrcLoad" />
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
      <Proportion :bankeInfo="bankeInfo" @submitSuccess="onSubmitSuccess" :caneditbanke="caneditbanke"/>
    </mt-popup>
  </div>
</template>

<script>
import { Cell, Button, MessageBox, Field } from "mint-ui";
import edit from "./edit";
import Notice from "./Notice";
import Proportion from "./Proportion";
import nativecode from '@/nativecode'
export default {
  name: "",
  props: {
    bankeInfo: {
      default() {
        return {};
      }
    }
  },
  watch: {
    bankeInfo(newValue, oldValue) {
      this.bankeInfoData = newValue;
      console.log("gf", newValue);
    }
  },
  components: {
    edit,
    Notice,
    Proportion
  },
  data() {
    return {
      popupNotice: false,
      popupProportion: false,
      imgfilepath: "",
      bankeInfoData: {},
      editBkState: false,
      titData: {}
    };
  },

  computed: {
    caneditbanke() {
      let caneditbanke = this.$store.getters.caneditbanke;
      return caneditbanke;
    },
      showbankedange(){
        if (nativecode.platform == 'exsoftdaping'){
            return false;
        }
        return true;
      },
    haseditrole() {
      return this.$store.getters.haseditbankerole;
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/100x100.png");
      srcstr += '"';
      return srcstr;
    }
    ,cansharebanke(){
        if (this.bankeInfo.states > 0 && nativecode.hassharebanke()){
            return true;
        }
        return false;
      }
  },
  created() {},
  methods: {
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
        let url = `http://192.168.0.237:8088/ClassStatistics?id=${this.bankeInfo.id}`;
        url = 'http://localhost:9982/backend/#/ClassStatistics?id=' + this.bankeInfo.id;
        if (process.env.NODE_ENV !== "development")
        {
            url = document.location.origin;
            url += '/backend/#/ClassStatistics?id=' + this.bankeInfo.id;
        }
      window.location.href = url;
    },
    editBkFn() {
      if (!this.caneditbanke) return;
      this.editBkState = true;
      this.$emit("editBkFn", this.editBkState);
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
      sharebanke(){
        nativecode.dosharebanke(this.bankeInfo);
      },
      finishbanke(){
          let BankeData = this.$store.state.banke.curbankes;
          this.$http
              .post("/api/banke/updateinfo", {
                  id: this.bankeInfo.id,
                  states: 0,
              })
              .then(res => {
                  if (res.data.code == 0) {
                      MessageBox.alert(this.$t("confirm.Success")).then(() => {
                          for (let item of BankeData) {
                              if (item.id == res.data.data.id) {
                                  item.states = 0;
                              }
                          }
                          this.$store.commit("banke/appendBankes", BankeData);
                      });
                  } else {
                      MessageBox.alert(res.data.msg).then(() => {});
                  }
              })
              .catch(() => {});
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
            MessageBox.confirm('',{
                title: this.$t("confirm.Tips"),
                message:'结束后，只能查阅， 不可再开始该班课，是否继续？',
                confirmButtonText: this.$t("confirm.Ok"),
                cancelButtonText: this.$t("confirm.Cancel"),
                showCancelButton: true
            }).then(()=>{
                this.finishbanke();
            })
        })
        .catch(err => {});
    },

    closeBk() {
      if (!this.caneditbanke){
          MessageBox.confirm("", {
              title: '提示',
              message: '确认退出当前班课?',
              confirmButtonText: '退出',
              cancelButtonText: '取消',
              showCancelButton: true
          }).then(res=>{
              this.$http
                  .post("/api/banke/reqmemberleave", { bankeid: this.bankeInfo.id })
                  .then(res => {
                      if (res.data.code == 0) {
                          MessageBox.alert('退出成功').then(() => {
                              this.$store.commit("setRouterForward", true);
                              this.$router.push("/");
                          });
                      } else {
                          MessageBox.alert(res.data.msg).then(() => {});
                      }
                  })

          });
          return ;
      }
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
      if (this.popupNotice) {
        this.popupNotice = false;
      }
      if (this.popupProportion) {
        this.popupProportion = false;
      }
      if (this.editBkState) {
        this.editBkState = false;
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
  .curbanke-info {
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
          width: 100%;
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
            }
          }
        }
      }
    }
  }
  .cell-wrap {
    margin-top: 20px;
  }
  .popup-right {
    width: 100%;
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
