<template>
  <div>
    <mt-header :title="bankename">
      <mt-button icon="back" slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div class="noheadercontainer page-wrap" :class="selected=='tongzhi'?'tongzhi':''">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="ziyuan">
          <BankeZiyuan
            :bankeid="id"
            v-if="showziyuan"
            @UploadLinkSelectEd="onUploadLinkSelectEd"
            @popupZiyuanEdit="onPopupZiyuanEdit"
          ></BankeZiyuan>
        </mt-tab-container-item>
        <mt-tab-container-item id="chengyuan" >
          <div class="chengyuan-head tc" @click="groupFn">
            <i class="iconfont iconxiaozu eicotrigger"></i>
            <p>分组方案</p>
          </div>
          <BankeChengyuan :bankeid="id" v-if="showchengyuan"></BankeChengyuan>
        </mt-tab-container-item>

        <mt-tab-container-item id="zuoye">
          <BankeZuoye :bankeid="id" v-if="showzuoye" @showmenu="ontabshowmenu"></BankeZuoye>
        </mt-tab-container-item>
        <mt-tab-container-item id="hudong">
          <BankeHuDong :bankeid="id" />
        </mt-tab-container-item>
        <mt-tab-container-item id="tongzhi">
          <bankeZouyeXq :bankeInfo="$t(curbanke)" @editBkFn="tongzhiOpenState" />
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <mt-tabbar
      v-model="selected"
      fixed
      :class="{hide:tabbarhide}"
      v-if="Preview && !zyEditState && footerbar"
    >
      <mt-tab-item id="ziyuan">
        <i class="iconfont iconwenjianjiai"></i>
        <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Resources')}}</span>
      </mt-tab-item>
      <mt-tab-item id="chengyuan">
        <i class="iconfont iconuser"></i>
        <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Member')}}</span>
      </mt-tab-item>
      <mt-tab-item id="zuoye">
        <i v-if="itemzuoyenormal" class="iconfont iconhuodong"></i>
        <span
          v-if="itemzuoyenormal"
          :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}"
        >{{$t('bankeZiYuan.Task')}}</span>
        <img
          v-if="!itemzuoyenormal"
          slot="icon"
          src="../assets/zuoye_add.png"
          class="tabitemmid"
          @click="onclickzuoye"
        />
      </mt-tab-item>
      <mt-tab-item id="hudong">
        <i class="iconfont iconwenjianjiai"></i>
        <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Interaction')}}</span>
      </mt-tab-item>
      <mt-tab-item id="tongzhi">
        <i class="iconfont iconxiangqing"></i>
        <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Details')}}</span>
      </mt-tab-item>
    </mt-tabbar>

    <mt-actionsheet :actions="addmenudata" v-model="addmenuvisible"></mt-actionsheet>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";

import BankeZiyuan from "./BankeZiyuan";
import BankeHuDong from "./bankehudong";
import BankeChengyuan from "./BankeChengyuan";
import BankeZuoye from "./BankeZuoye";
import listIcon from "../common/lists-icon";
import pic from "../assets/dis.jpg";
import bankeZouyeXq from "./banKeDetail/index";

export default {
  name: "BankeHome",
  data() {
    return {
      selected: "ziyuan",
      curbanke: "common.Curbanke",
      //    Curbanke: {
      //   name: '未知班课',
      //   avatar: ""
      // }
      showziyuan: false,
      showchengyuan: false,
      showzuoye: false,
      addmenudata: [
        {
          name: "新增 作业",
          method: this.onAddZuoye
        }
      ],
      addmenuvisible: false,
      tabbarhide: false,
      zYLinkSelectEd: "",
      zyEditState: false
    };
  },
  props: {
    id: {
      default: 0
    }
  },
  watch: {
    selected() {
      this.checkNeedShow();
    }
  },
  computed: {
    footerbar() {
      return this.$store.state.footerBarState;
    },
    Preview() {
      return this.$store.state.isPreview;
    },
    isEN() {
      return this.$store.state.lang;
    },
    bankename() {
      return this.curbanke.name;
    },
    itemzuoyenormal() {
      if (!this.$store.getters.isteacher) {
        return true;
      }

      if (this.selected == "zuoye") {
        return false;
      }
      return true;
    }
  },
  methods: {
    onPopupZiyuanEdit(v) {
      this.zyEditState = v;
    },
    onclickzuoye() {
      if (this.selected == "zuoye") {
        //Toast('新增作业， 暂未实现');
        this.addmenuvisible = true;
      }
    },
    ontabshowmenu(bshow) {
      this.tabbarhide = bshow;
    },
    onAddZuoye() {
      //Toast('暂未实现');
      this.$store.commit("setRouterForward", true);
      var url = "/zuoyenew/" + this.id;
      this.$router.push(url);
    },
    checkNeedShow() {
      if (!this.showziyuan && this.selected == "ziyuan") {
        this.showziyuan = true;
      } else if (!this.showchengyuan && this.selected == "chengyuan") {
        this.showchengyuan = true;
      } else if (!this.showzuoye && this.selected == "zuoye") {
        this.showzuoye = true;
      }
    },
    tongzhiOpenState(data) {
      // this.tongzhiState = data;
    },
    onUploadLinkSelectEd(data) {
      //  this.tongzhiState=true;
      // this.zYLinkSelectEd = data;
    },
    groupFn() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Group",
        params: { bankeid: this.id }
      });
    }
  },
  created() {
    // console.log(this.id);
    //console.log(this.$store.getters);
    var u = this.$store.getters["banke/getBankeById"](this.id); //this.$store.getters.getBankeById(this.id);

    if (u) {
      this.curbanke = u;
    } else {
      this.curbanke = this.$t("common.Curbanke");
    }
    // console.log('uuuuuuu',u)
    var ss = this.$store.state.bhomeselected;
    if (ss) {
      this.selected = ss;
    }
    this.checkNeedShow();
    console.log("班可", this.curbanke);
  },
  destroyed() {
    this.$store.commit("setBHomeSelected", this.selected);
  },
  components: {
    BankeZiyuan,
    BankeChengyuan,
    BankeZuoye,
    bankeZouyeXq,
    BankeHuDong
  }
};
</script>

<style scoped>
.chengyuan-head {
  background: #fff;
  padding: 10px;
}
.chengyuan-head i {
  font-size: 45px;
  color: #8ecbff;
}
.iconfont {
  display: block;
  padding-bottom: 10px;
  font-size: 26px;
}
.page-wrap.tongzhi {
  background: #f0f0f0;
}
.page-tabbar-container {
}

.tabitemmid {
  margin-top: 10px;

  /*cjy: old size: 24px;*/
  width: 40px;
  height: 40px;
  transform: translate(-8px, -8px);
}
</style>
