<template>
  <div class="bk-zy-xq">
    <div class="curbanke-info">
      <ul>
        <li class="clearIt">
          <img class="float-l" :src="imgfilepath?imgfilepath:bankeInfo.avatar" />
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
          <mt-cell title="编辑班课" is-link></mt-cell>
        </li>
        <li @click="edBk">
          <mt-cell title="结束班课" is-link></mt-cell>
        </li>
        <li @click="closeBk">
          <mt-cell title="删除班课" is-link></mt-cell>
        </li>
      </ul>
    </div>
    <mt-popup v-model="editBkState" position="right" class="popup-right" :modal="false">
      <mt-header title="编辑班课">
        <mt-button slot="left" icon="back" @click="goBack">取消</mt-button>
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
    }
  },
  created() {
    var newarr = [
      { num: 1, val: "ceshi", flag: "aa" },
      { num: 2, val: "ceshi2", flag: "aa2" },
      { num: 3, val: "ceshi3", flag: "aa3" }
    ];
    console.log(newarr.filter(item => item.num !== 1));
  },
  methods: {
    editBkFn() {
      if (!this.isteacher) return;
      this.editBkState = true;
      this.$emit("editBkFn", this.editBkState);
    },
    edBk() {
      if (!this.isteacher) return;
      MessageBox.confirm("", {
        title: "提示",
        message: "确定要结束班课吗?",
        showCancelButton: true
      })
        .then(res => {
          this.$http
            .post("/api/banke/delete", { id: this.bankeInfo.id })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("操作成功").then(() => {
                  // this.$router.push({
                  //   name: "cloudmain",
                  //   params: { state: true }
                  // });
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
      console.log("BankeDa", BankeData);
      MessageBox.confirm("", {
        title: "提示",
        message: "确定要删除班课吗?",
        showCancelButton: true
      })
        .then(res => {
          this.$http
            .post("/api/banke/delete", { id: this.bankeInfo.id })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("删除成功").then(() => {
                  let newBankeData = BankeData.filter(item => item.id !== this.bankeInfo.id);
                  this.$store.commit("banke/appendBankes", newBankeData);
                  // this.$router.push({
                  //   name: "cloudmain",
                  //   params: { state: true }
                  // });
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
          width: 25%;
          height: 20%;
          min-width: 20%;
          min-height: 20%;
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
              font-size: 3.5vw;
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
