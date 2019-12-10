<template>
  <div class="fontsmall">
    <mt-header :title="$t('common.HomeTite')">
      <mt-button icon="back" slot="left" @click="onbackmain">{{$t('common.Back')}}</mt-button>

      <!-- <mt-button slot="right" class="btnadd" v-if="showadd" @click="onadd">+</mt-button> -->
    </mt-header>
    <div class="noheadercontainer page-wrap cloud">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="banke">
          <div class="seach-wrap">
            <div class="div_sech">
              <form action target="frameFile">
                <mt-search
                  v-model="value"
                  cancel-text="取消"
                  placeholder="搜索"
                  @keyup.enter.native="searchData"
                ></mt-search>
              </form>
              <iframe name="frameFile" style="display: none;"></iframe>
            </div>
            <i class="iconfont iconjiahao colord position-r fontmaintitle" @click="addBankeIcon"></i>
          </div>

          <p class="v"></p>
          <div class="bankecontainer">
            <div v-for="(item,selindex) in curbankes" v-bind:key="selindex">
              <BankeSimple :classitem="curbankes[selindex]" @click.native="bankeclick(item)"></BankeSimple>
              <!-- <div class="bankedevide"></div> -->
            </div>
            <div v-if="!bankeempty" class="tc">{{bankestatedesc}}</div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="exam">
          <examhome></examhome>
        </mt-tab-container-item>
        <mt-tab-container-item id="mine">
          <MineAbout @changeSelected="onChangeSelected"></MineAbout>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <mt-tabbar v-model="selected" fixed class="cloud cloud-b">
      <mt-tab-item id="banke">
        <i class="iconfont iconfont-big iconbianzu"></i>
        <span class="fontnormal">{{$t('common.Class')}}</span>
      </mt-tab-item>
      <mt-tab-item id="mine">
        <i class="iconfont iconfont-big iconuser"></i>
        <span class="fontnormal">{{$t('common.My')}}</span>
      </mt-tab-item>
    </mt-tabbar>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
    <mt-actionsheet :actions="actions2" v-model="actionShow2"></mt-actionsheet>

    <mt-popup
      v-model="popupJoin"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="加入班课">
        <mt-button icon="back" slot="left" @click="goback">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Join />
    </mt-popup>
  </div>
</template>

<script>
import examhome from "../Exam/ExamHome";

import BankeSimple from "./components/BankeSimple";

import MineAbout from "./MineAbout";

import nativecode from "../nativecode";

import { Indicator, Toast, MessageBox, Actionsheet } from "mint-ui";
import Join from "./bankehome/join";
export default {
  name: "CloudHome",
  data() {
    return {
      selected: "banke",
      classitem: {
        name: "11",
        avatar: ""
      },
      bankestatedesc: "",
      value: "",
      popupJoin: false,
      actionShow: false,
      actionShow2: false,
      actions: [
        {
          name: "进入班课",
          method: this.bankeDedail
        },
        {
          name: "置顶班课",
          method: this.Roof
        }
      ],
      actions2: [
        {
          name: "创建班课",
          method: this.onadd
        },
        {
          name: "使用班课号加入班课",
          method: this.jion
        }
      ]
    };
  },
  computed: {
    showadd() {
      if (this.selected == "banke") {
        return true;
      }
      return false;
    },
    curbankes() {
      return this.$store.state.banke.curbankes;
    },
    bankeempty() {
      //   console.log(this.curbankes);
      if (this.curbankes.length) {
        return true;
      }
      return false;
    },
  },
  watch: {
    selected() {
      // console.log(this.selected);
      if (this.selected == "banke") {
        this.initbanke();
      }
    },
    seachvalue: function(newvs, oldvs) {
      if (!newvs) {
      }
    }
  },
  created: function() {
    var osel = this.$store.state.homeselected;
    if (osel) {
      this.selected = osel;
    }
    if (this.selected == "banke") {
      this.initbanke();
    }
  },
  methods: {
    onChangeSelected(v) {
      this.selected = v;
    },
    onbackmain() {
      nativecode.ncall("jsBackMain", {});
    },
    bankeclick(bankeitem) {
      console.log(bankeitem);
      this.bankeitem = bankeitem;
      this.actionShow = true;
    },
    addBankeIcon() {
      this.actionShow2 = true;
    },
    //进入班课
    bankeDedail() {
      this.$store.commit("setRouterForward", true);
      this.$router.push("/bankehome/" + this.bankeitem.id);
    },
    // 创建班课
    onadd() {
      var isteacher = this.$store.getters.isteacher;
      if (isteacher) {
        //! 跳转新增课堂
        this.$store.commit("setRouterForward", true);
        this.$router.push("/bankenew");
      } else {
        //! 跳转搜索课堂
        Toast("加入课堂， 暂未实现");
      }
    },
    //加入班课
    jion() {
      this.popupJoin = true;
    },
    goback() {
      if (this.popupJoin) {
        this.popupJoin = false;
      }
    },
    //置顶
    Roof() {},
    //搜索
    searchData() {
      for(let item of this.curbankes){

      }
    },
    initbanke() {
      var url = "/api/api/bankequery";
      if (!this.bankeempty) {
        this.bankestatedesc = "加载中";
        this.$http
          .post(url)
          .then(res => {
            if (res.data.code == 0) {
              this.$store.commit("banke/appendBankes", res.data.data);
            }
            if (!this.bankeempty) {
              this.bankestatedesc = "当前无班课";
            }
          })
          .catch(res => {
            console.log(res);
            this.bankestatedesc = "发生异常";
          });
      }
    }
  },
  destroyed: function() {
    //! 记忆当前的选择
    this.$store.commit("setHomeSelected", this.selected);
  },
  components: {
    MineAbout,
    examhome,
    BankeSimple,
    Join
  }
};
</script>

<style scoped>
.mint-tab-container-item {
  background: #fff;
}
.v {
  background: #fff;
  height: 10px;
}
.cloud .iconfont-big {
  font-size: 33px !important;
}
.btnadd {
  font-size: 30px;
}

.bankecontainer {
  height: 100%;
}

.bankedevide {
  height: 10px;
}

.my-cell-allow-right::after {
  border: solid 2px #c8c8cd;
  border-bottom-width: 0;
  border-left-width: 0;
  content: " ";
  top: 50%;
  right: 20px;
  position: absolute;
  width: 5px;
  height: 5px;
  -webkit-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
}
.cloud-b .mint-tab-item {
  color: #232323;
  background-color: #fff;
}
.cloud-b .mint-tab-item.is-selected {
  color: #26a2ff;

  background-color: #f0f0f0;
}
.seach-wrap {
  position: relative;
}
.seach-wrap i {
  font-size: 37px;
}
.mint-search {
  width: 85% !important;
}

.mint-searchbar-inner .mintui-search {
  font-size: 25px;
  color: #d9d9d9;
  padding-right: 5px;
}
</style>