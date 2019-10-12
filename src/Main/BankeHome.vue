<template>
  <div>
    <mt-header :title="bankename">
      <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
    </mt-header>

    <div class="noheadercontainer page-wrap" :class="selected=='tongzhi'?'tongzhi':''">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="ziyuan">
          <BankeZiyuan :bankeid="id" v-if="showziyuan" @UploadLinkSelectEd="onUploadLinkSelectEd"></BankeZiyuan>
        </mt-tab-container-item>
        <mt-tab-container-item id="chengyuan">
          <BankeChengyuan :bankeid="id" v-if="showchengyuan"></BankeChengyuan>
        </mt-tab-container-item>

        <mt-tab-container-item id="zuoye">
          <BankeZuoye :bankeid="id" v-if="showzuoye" @showmenu="ontabshowmenu"></BankeZuoye>
        </mt-tab-container-item>
        <mt-tab-container-item id="hudong">
          <BankeHuDong :bankeid="id"/>
        </mt-tab-container-item>
        <mt-tab-container-item id="tongzhi">
          <bankeZouyeXq :bankeInfo="curbanke" @editBkFn="tongzhiOpenState" />
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <mt-tabbar v-model="selected" fixed :class="{hide:tabbarhide}" v-if="!tongzhiState">
      <mt-tab-item id="ziyuan">
        <i class="iconfont iconwenjianjiai"></i>
        <span class="fontnormal">资源</span>
      </mt-tab-item>
      <mt-tab-item id="chengyuan">
        <i class="iconfont iconuser"></i>
        <span class="fontnormal">成员</span>
      </mt-tab-item>
      <mt-tab-item id="zuoye">
        <i v-if="itemzuoyenormal" class="iconfont iconhuodong"></i>
        <span v-if="itemzuoyenormal" class="fontnormal">作业</span>
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
        <span class="fontnormal">互动</span>
      </mt-tab-item>
      <mt-tab-item id="tongzhi">
        <i class="iconfont iconxiangqing"></i>
        <span class="fontnormal">详情</span>
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
import bankeZouyeXq from "./banKeZuoyeXq/index";

export default {
  name: "BankeHome",
  data() {
    return {
      selected: "ziyuan",
      curbanke: {
        name: "未知班课",
        avatar: ""
      },
      showziyuan: false,
      showchengyuan: false,
      showzuoye: false,
      addmenudata: [{ name: "新增 作业", method: this.onAddZuoye }],
      addmenuvisible: false,
      tabbarhide: false,
      tongzhiState: false,
      zYLinkSelectEd: ""
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
      this.tongzhiState = data;
    },
    onUploadLinkSelectEd(data) {
      //  this.tongzhiState=true;
      this.zYLinkSelectEd = data;
    }
  },
  created() {
    // console.log(this.id);
    //console.log(this.$store.getters);
    var u = this.$store.getters["banke/getBankeById"](this.id); //this.$store.getters.getBankeById(this.id);
    if (u) {
      this.curbanke = u;
    }
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
