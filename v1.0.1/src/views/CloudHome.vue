<template>
  <div class="fontsmall">
    <mt-header :title="$t('common.HomeTite')">
      <mt-button icon="back" slot="left" @click="onbackmain">{{$t('common.Back')}}</mt-button>

      <!-- <mt-button slot="right" class="btnadd" v-if="showadd" @click="onadd">+</mt-button> -->
    </mt-header>
    <div class="noheadercontainer page-wrap cloud">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="banke">
          <mt-search v-model="value" :result.sync="result"></mt-search>
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
  </div>
</template>

<script>
import examhome from "../Exam/ExamHome";

import BankeSimple from "./components/BankeSimple";

import MineAbout from "./MineAbout";

import nativecode from "../nativecode";

import { Indicator, Toast, MessageBox } from "mint-ui";

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
      result: []
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
    }
  },
  watch: {
    selected() {
      // console.log(this.selected);
      if (this.selected == "banke") {
        this.initbanke();
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
    bankeclick(bankeitem) {
      console.log(bankeitem);
      if (bankeitem.id) {
        this.$store.commit("setRouterForward", true);
        this.$router.push("/bankehome/" + bankeitem.id);
      }
    },
    initbanke() {
      var url = "/api/api/bankequery";
      if(!this.bankeempty){
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
    BankeSimple
  }
};
</script>

<style scoped>
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
.mint-searchbar-inner .mintui-search {
  font-size: 25px;
  color: #d9d9d9;
  padding-right: 5px;
}
</style>