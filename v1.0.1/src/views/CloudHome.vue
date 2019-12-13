<template>
  <div class="fontsmall">
    <mt-header v-if="hasnavbar" :title="$t('common.HomeTite')">
      <mt-button
        v-if="hasmainback"
        icon="back"
        slot="left"
        @click="onbackmain"
      >{{$t('common.Back')}}</mt-button>

      <!-- <mt-button slot="right" class="btnadd" v-if="showadd" @click="onadd">+</mt-button> -->
    </mt-header>
    <div :class="hasnavbar?'noheadercontainer page-wrap cloud':'page-wrap cloud'">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="banke">
          <div class="seach-wrap">
            <div class="div_sech">
              <mt-search
                v-model="value"
                cancel-text="取消"
                placeholder="搜索"
                autofocus
                @keyup.native="searchData"
              ></mt-search>
            </div>
            <i class="iconfont iconjiahao colord position-r fontmaintitle" @click="addBankeIcon"></i>
          </div>

          <p class="v"></p>
          <div class="bankecontainer">
            <div v-for="(item,selindex) in curbankes" v-bind:key="selindex">
              <BankeSimple
                :classitem="curbankes[selindex]"
                @click.native="bankeclick(item)"
                @showMenu="onShowMenu"
              ></BankeSimple>
              <!-- <div class="bankedevide"></div> -->
            </div>
            <div v-if="!bankeempty&&bankestatedesc=='当前无班课'" class="tc no-class empty">
              <i class="iconfont icontianjia fontmaintitle" @click="addBankeIcon"></i>
              <p>暂无班课，点击创建或加入班课</p>
            </div>
            <div v-if="!bankeempty &&bankestatedesc!='当前无班课' " class="tc">{{bankestatedesc}}</div>
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
    <mt-tabbar v-model="selected" fixed class="cloud cloud-b" v-if="!CliudBar">
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
  </div>
</template>

<script>
import examhome from "../Exam/ExamHome";

import BankeSimple from "./components/BankeSimple";

import MineAbout from "./MineAbout";

import nativecode from "../nativecode";

import { Indicator, Toast, MessageBox, Actionsheet } from "mint-ui";
export default {
  name: "CloudHome",
  data() {
    return {
      isBind: false,
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
    CliudBar() {
      return this.$store.state.CliudBar;
    },
    showadd() {
      if (this.selected == "banke") {
        return true;
      }
      return false;
    },
    hasmainback() {
      return nativecode.hasmainback();
    },
    hasnavbar() {
      return nativecode.hasnavbar();
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
    }
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
      this.bankeitem = bankeitem;
      this.bankeDedail();
    },
    onShowMenu(v) {
      console.log(v);
      this.bankeitem = v;
      if (this.bankeitem.ordernum) {
        this.actions[1].name = "取消置顶";
      } else {
        this.actions[1].name = "置顶班课";
      }
      this.actionShow = true;
    },
    //创建or加入
    addBankeIcon() {
      this.actionShow2 = true;
    },
    //进入班课
    bankeDedail() {
      if (this.bankeitem.id) {
        let tourl = "/bankehome/" + this.bankeitem.id;
        if (!nativecode.navigateTo(tourl)) {
          this.$store.commit("setRouterForward", true);
          this.$router.push(tourl);
        }
      }
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
      // this.popupJoin = true;
      this.$store.commit("setRouterForward", true);
      this.$router.push("/Join");
    },
    //置顶
    Roof() {
      this.$http
        .post("/api/banke/settop", {
          bankeid: this.bankeitem.id,
          dotop: this.bankeitem.ordernum ? "0" : 1
        })
        .then(res => {
          if (res.data.code == 0) {
            Toast("成功");
            this.initbanke();
          } else {
            Toast("失败");
          }
        })
        .catch(() => {
          Toast("服务异常");
        });
    },
    //搜索
    searchData() {},
    initbanke() {
      var url = "/api/api/bankequery";
      if (!this.bankeempty) {
        this.bankestatedesc = "加载中";
      }
      //! cjy: 防止出错， 总是重新拉取
      this.$http
        .post(url)
        .then(res => {
          if (res.data.code == 0) {
            this.$store.commit("banke/setBankes", res.data.data);
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
  },
  destroyed: function() {
    //! 记忆当前的选择
    this.$store.commit("setHomeSelected", this.selected);
  },
  components: {
    MineAbout,
    examhome,
    BankeSimple
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
.no-class {
  color: #999;
}
.no-class i {
  font-size: 80px;
}
</style>