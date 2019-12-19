<template>
  <div>
    <mt-header v-show="hasnavbar" :title="bankename">
      <mt-button icon="back" slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div
      class="hasnavbar?'noheadercontainer page-wrap ':'page-wrap '"
      :class="selected=='tongzhi'?'tongzhi':''"
    >
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="ziyuan">
          <BankeZiyuan
            :bankeid="id"
            v-if="showziyuan"
            @UploadLinkSelectEd="onUploadLinkSelectEd"
            @popupZiyuanEdit="onPopupZiyuanEdit"
          ></BankeZiyuan>
        </mt-tab-container-item>
        <mt-tab-container-item id="chengyuan">
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
          <BankeHuDong :bankeid="id" :eventmsgs="eventmsgs" />
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
        <div class="bankehome">
          <i
            class="iconfont iconwenjianjiai reddot-Tips-wrap"
            :class="eventmsgs.zyTips?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Resources')}}</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="chengyuan">
        <div class="bankehome">
          <i class="iconfont iconuser reddot-Tips-wrap" :class="eventmsgs.cyTips?'reddot-Tips':''"></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Member')}}</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="zuoye">
        <div class="bankehome">
          <i
            v-if="itemzuoyenormal"
            class="iconfont iconhuodong reddot-Tips-wrap"
            :class="eventmsgs.zouyeTips?'reddot-Tips':''"
          ></i>
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
        </div>
      </mt-tab-item>
      <mt-tab-item id="hudong">
        <div class="bankehome">
          <i
            class="iconfont iconwenjianjiai reddot-Tips-wrap"
            :class="eventmsgs.hdTips.count?'reddot-Tips':''"
          ></i>
          <span
            :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}"
          >{{$t('bankeZiYuan.Interaction')}}</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="tongzhi">
        <div class="bankehome">
          <i
            class="iconfont iconxiangqing reddot-Tips-wrap"
            :class="eventmsgs.xqTips?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">{{$t('bankeZiYuan.Details')}}</span>
        </div>
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

import nativecode from "../nativecode";

export default {
  name: "BankeHome",
  data() {
    return {
      selected: "ziyuan",
      //curbanke: "common.Curbanke",
      //    Curbanke: {
      //   name: '未知班课',
      //   avatar: ""
      // }
      curbanke: {
        //! cjy： 预设字段， 方便触发vue的监听
        name: "",
        avatar: "",
        id: 0
      },
      bankeid: 0,
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
      zyEditState: false,
      eventmsgs: {
        zyTips: 0,
        cyTips: 0,
        zouyeTips: 0,
        hdTips: {
          count: 0,
          sign: 0,
          pingce: 0,
          pingceIng: 0,
          bigLogin: 0,
          banshu: 0
        },
        xqTips: 0
      }
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
    hasnavbar() {
      return nativecode.hasnavbar();
    },
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
      let bname =  this.curbanke.name;
      if (this.curbanke.states < 1){
          bname = '[已结束]' + bname;
      }
      return bname;
    },
    itemzuoyenormal() {
      if (!this.$store.getters.caneditbanke) {
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
    },
    loadBanke() {
      this.$http
        .post("/api/banke/search", {
          id: this.bankeid
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.length > 0) {
              this.curbanke = res.data.data[0];
              this.$store.commit("banke/appendBankes", this.curbanke);
              this.onBankeChange();
            }
          }
        })
        .catch(() => {});
    },
    onBankeChange() {
      this.$store.commit("setCurBanke", this.curbanke);
      if (!this.hasnavbar) {
        document.title = this.bankename;
      }
    },
    //红点-查询班课主页
    eventmsgsOnbanke() {
      this.$http
        .post("/api/eventmsgs/onbanke", {
          bankeid: this.id
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length) {
            let serveData = res.data.data;
            for (let v of serveData) {
              switch (v.eventtype) {
                case 1:
                  this.eventmsgs.zyTips = v.count;
                  break;
                case 2:
                  this.eventmsgs.hdTips.count += v.count;
                  this.eventmsgs.hdTips.sign = v.count;
                  break;
                case 3:
                  this.eventmsgs.zouyeTips = v.count;
                  break;
                case 4:
                  this.eventmsgs.hdTips.count += v.count;
                  this.eventmsgs.hdTips.pingce = v.count;
                  break;
                case 100:
                  this.eventmsgs.hdTips.count += v.count;
                  this.eventmsgs.hdTips.banshu = v.count;
                  break;
              }
            }
          } else {
          }
        })
        .catch(err => {});
    }
  },
  created() {
    console.log("bankehome:" + this.id);
    //console.log(this.$store.getters);

      //! 消除可能的wx缓存
      this.$http
          .post('/api/api/uservalidate')
          .then(res =>{
              if (res.data.code == 0){
                  this.$store.commit("setLoginUser", res.data.data);
              }
              else{
                  this.$store.commit("setLoginUser", {});
                  this.$store.commit("setRouterForward", true);
                  this.$router.push("/login");

                  nativecode.jsLogin(0, {});
              }
          })

    var u = this.$store.getters["banke/getBankeById"](this.id); //this.$store.getters.getBankeById(this.id);
    this.bankeid = this.id;
    if (u) {
      this.curbanke = u;
      this.onBankeChange();
    } else {
      // this.curbanke = this.$t("common.Curbanke");
      this.loadBanke();
    }
    // console.log('uuuuuuu',u)
    var ss = this.$store.state.bhomeselected;
    if (ss) {
      this.selected = ss;
    }
    this.checkNeedShow();
    console.log("班可", this.curbanke);
    this.eventmsgsOnbanke();
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

.bankehome {
  position: relative;
  height: 72px;
}
.bankehome i {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.bankehome span {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 5px;
  transform: translate(-50%, 0);
}
</style>
