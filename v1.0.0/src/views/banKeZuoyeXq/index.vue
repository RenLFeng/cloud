<template>
  <div class="bk-zy-xq">
    <div class="curbanke-info">
      <ul>
        <li class="clearIt">
          <img
            class="float-l"
            :src="imgfilepath?imgfilepath:bankeInfo.avatar"
            :onerror="defaultimg"
          />
          <div class="float-l po">
            <div class="top">
              <span class>{{bankeInfo.name}}</span>
              <!-- <span class>二年级</span> -->
            </div>
            <!-- <div class="bottom color9">
              <span class>物理</span>
              <span class>{{bankeInfo.userupdatetime}}</span>
            </div>-->
          </div>
        </li>
      </ul>
    </div>
    <div class="cell-wrap">
      <ul class="border-bottom-e5">
        <li @click="editBkFn">
          <mt-cell :title="$t('bankeXingQing.EditClass')" is-link></mt-cell>
        </li>
        <li @click="edBk">
          <mt-cell :title="$t('bankeXingQing.EndingClass')" is-link></mt-cell>
        </li>
        <li @click="closeBk">
          <mt-cell :title="$t('bankeXingQing.DeleteClass')" is-link></mt-cell>
        </li>
      </ul>
    </div>
    <mt-popup v-model="editBkState" position="right" class="popup-right" :modal="false">
      <mt-header :title="$t('bankeXingQing.EditClass')">
        <mt-button slot="left" icon="back" @click="goBack">{{$t('confirm.Cancel')}}</mt-button>
      </mt-header>
      <edit :bankeInfo="bankeInfo" :editBkState="editBkState" @imgSrcLoad="onImgSrcLoad" />
    </mt-popup>
  </div>
</template>

<script>
import { Cell, Button, MessageBox, Field } from "mint-ui";
import edit from "./edit";
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
    }
  },
  components: {
    edit
  },
  data() {
    return {
      imgfilepath: "",
      bankeInfoData: {},
      editBkState: false
    };
  },

  computed: {
    isteacher() {
      let isteacher = this.$store.getters.isteacher;
      return isteacher;
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/banke-default.png");
      srcstr += '"';
      return srcstr;
    }
  },
  created() {},
  methods: {
    editBkFn() {
      if (!this.isteacher) return;
      this.editBkState = true;
      this.$emit("editBkFn", this.editBkState);
    },
    edBk() {
      if (!this.isteacher) return;
      let BankeData = this.$store.state.banke.curbankes;
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t("common.End") + " " + this.$t("common.Class") + "?",
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      })
        .then(() => {
          this.$http
            .post("/api/banke/updateinfo", {
              id: this.bankeInfo.id,
              name: this.bankeInfo.name || "",
              states: 0,
              avatar: this.imgfilepath
                ? this.imgfilepath
                : this.bankeInfo.avatar
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
                  // this.$router.go(-1);
                });
              } else {
                MessageBox.alert(res.data.msg).then(() => {});
              }
            })
            .catch(() => {});
        })
        .catch(err => {});
    },

    closeBk() {
      if (!this.isteacher) return;
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
                  this.$router.go(-1);
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
    },
    goBack() {
      this.editBkState = !this.editBkState;
      this.$emit("editBkFn", this.editBkState);
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
          padding-left: 15px;
          width: 100%;
          height: 100%;
          left: 25%;
          top: 50%;
          transform: translate(0, -7px);
          div {
            position: absolute;
            width: 100%;
            span {
              display: block;
              // font-size: 3.5vw;
            }
            &.top {
              top: 0;
            }
            &.bottom {
              bottom: 0;
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
