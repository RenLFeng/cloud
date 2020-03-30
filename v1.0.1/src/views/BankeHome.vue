<template>
  <div>
    <mt-header v-show="hasnavbar && selected!='ziyuan'" :title="bankename" class="mint-header-f">
      <mt-button v-if="hasbackbtn" icon="back" slot="left" @click="goback">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div class="main-f" :class="selected=='tongzhi'?'tongzhi':''">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="ziyuan">
          <BankeZiyuan
            :bankeid="id"
            :hasbackbtn="hasbackbtn"
            :bankename="bankename"
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
          <BankeChengyuan :bankeid="id" v-if="showchengyuan" :schollid="curbanke.schoolid"></BankeChengyuan>
        </mt-tab-container-item>

        <mt-tab-container-item id="zuoye">
          <BankeZuoye :bankeid="id" v-if="showzuoye" @showmenu="ontabshowmenu"></BankeZuoye>
        </mt-tab-container-item>
        <mt-tab-container-item id="hudong">
          <BankeHuDong
            :bankeid="id"
            :bnakeuserid="curbanke.userid"
            :eventmsgs="eventmsgs"
            :selected="new Date().getTime()"
          />
        </mt-tab-container-item>
        <mt-tab-container-item id="tongzhi">
          <bankeZouyeXq :bankeInfo="$t(curbanke)" @editBkFn="tongzhiOpenState" />
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div class="my-foot-bar" v-if="Preview && !zyEditState && footerbar && isAndroid">
      <ul class="items clearfix">
        <li
          class="item fl reddot-Tips-wrap"
          :class="v.id==selected?'act':''"
          v-for="(v,i) in myFootBar"
          :key="i"
          @click="tabarClick(v)"
        >
          <span
            class="icon"
            :class="`iconfont ${v.icon} ${v.icon=='iconjiahao'?'colory position-c':''}`"
          ></span>
          <span class="fontnormal text" v-if="!v.isOpen">{{v.text}}</span>
        </li>
      </ul>
    </div>
    <mt-tabbar
      v-model="selected"
      fixed
      :class="{hide:tabbarhide}"
      v-if="Preview && !zyEditState && footerbar && !isAndroid"
      style="background:#fff"
    >
      <mt-tab-item id="ziyuan">
        <div class="bankehome">
          <i
            class="iconfont iconkeqian-xuanzhong reddot-Tips-wrap"
            :class="eventmsgs.zyTips?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">课前</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="hudong">
        <div class="bankehome">
          <i
            class="iconfont iconkezhong-xuanzhong reddot-Tips-wrap"
            :class="eventmsgs.hdTips.count?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">课中</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="zuoye">
        <div class="bankehome">
          <i
            v-if="itemzuoyenormal"
            class="iconfont iconkehou-xuanzhong reddot-Tips-wrap"
            :class="eventmsgs.zouyeTips?'reddot-Tips':''"
          ></i>
          <span v-if="itemzuoyenormal" :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">课后</span>
          <img
            v-if="!itemzuoyenormal"
            slot="icon"
            src="../assets/zuoye_add.png"
            class="tabitemmid"
            @click="onclickzuoye"
          />
        </div>
      </mt-tab-item>
      <mt-tab-item id="chengyuan">
        <div class="bankehome">
          <i
            class="iconfont iconxueqing-xuanzhong reddot-Tips-wrap"
            :class="eventmsgs.cyTips?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">学情</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="tongzhi">
        <div class="bankehome">
          <i
            class="iconfont iconbanke-wode-xuanzhong reddot-Tips-wrap"
            :class="eventmsgs.xqTips?'reddot-Tips':''"
          ></i>
          <span :class="{fonttiny:isEN=='en',fontnormal:isEN!='en'}">我的</span>
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
import bankeZouyeXq from "./banKeDetail/index";
import nativecode from "../nativecode";

export default {
  name: "BankeHome",
  data() {
    return {
      myFootBar: [
        {
          id: "ziyuan",
          text: "课前",
          icon: "iconkeqian-xuanzhong"
        },
        {
          id: "hudong",
          text: "课中",
          icon: "iconkezhong-xuanzhong"
        },
        {
          id: "zuoye",
          text: "课后",
          icon: "iconkehou-xuanzhong"
        },
        {
          id: "chengyuan",
          text: "学情",
          icon: "iconxueqing-xuanzhong"
        },
        {
          id: "tongzhi",
          text: "我的",
          icon: "iconbanke-wode-xuanzhong"
        }
      ],
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
        id: 0,
        info: "",
        scorerule1: "",
        scorerule2: "",
        scorerule3: "",
        scorerule4: "",
        scorerule5: ""
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
    selected: function(newValue, oldValue) {
      this.checkNeedShow();
      if (newValue == "zuoye") {
        this.myFootBar[2].icon = "iconjiahao";
        this.myFootBar[2].isOpen = true;
      } else {
        this.myFootBar[2].icon = "iconkehou-xuanzhong";
        this.myFootBar[2].isOpen = false;
      }
    }
  },
  computed: {
    isAndroid() {
      if (nativecode.platform == "exsoftandroid") {
        return true;
      }
      return false;
    },
    hasnavbar() {
      return nativecode.hasnavbar();
    },
    hasbackbtn() {
      if (nativecode.platform == "exsoftdaping") {
        return false;
      }
      return true;
    },
    footerbar() {
      return this.$store.state.footerBarState;
    },
    Preview() {
      return this.$store.state.Preview.isPreview;
    },
    isEN() {
      return this.$store.state.lang;
    },
    bankename() {
      let bname = this.curbanke.name;
      if (this.curbanke.states < 1) {
        bname = "[已结束]" + bname;
      }
      return bname;
    },
    schollid() {
      return this.curbanke.schoolid;
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
    tabarClick(v) {
      this.selected = v.id;
      if (v.id == "zuoye" && v.isOpen) {
        this.onclickzuoye();
      }
    },
    onPopupZiyuanEdit(v) {
      this.zyEditState = v;
    },
    onclickzuoye() {
      if (this.selected == "zuoye") {
        //Toast('新增作业， 暂未实现');
        this.addmenuvisible = true;
      }
    },
    goback() {
      // alert(window.history.length);
      //  window.history.length > 1 ? this.$router.go(-1) : this.$router.replace('/')
      //! cjy: 微信小程序， 这里不准确， 这里直接返回主页
      this.$router.replace("/");
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
    this.$store.commit("SET_GO_SCHOOL", false);
    console.log("bankehome:" + this.id);
    //console.log(this.$store.getters);

    //! 消除可能的wx缓存
    this.$http.post("/api/api/uservalidate").then(res => {
      if (res.data.code == 0) {
        this.$store.commit("setLoginUser", res.data.data);
      } else {
        this.$store.commit("setLoginUser", {});
        this.$store.commit("setRouterForward", true);
        this.$router.push("/login");

        nativecode.jsLogin(0, {});
      }
    });

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
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 50px;
  height: 50px;
}
.mint-tab-item {
  padding: 0;
}
.bankehome {
  position: relative;
  height: 75px;
}
.bankehome i {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translate(-50%, 0);
  color: #999;
  font-size: 30px;
}
.bankehome span {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 9px;
  transform: translate(-50%, 0);
}
.mint-tabbar > .mint-tab-item {
  color: #999;
}
.mint-tabbar > .mint-tab-item.is-selected {
  background-color: #fff;
}
.mint-tabbar > .mint-tab-item.is-selected i {
  color: #26a2ff;
}
</style>
<style lang="less" scoped>
.my-foot-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 86px;
  background: #fff;
  box-shadow: 0 0 6px 1px #ccc;
  .items {
    height: 100%;
    .item {
      height: 100%;
      width: 20%;
      color: #aaaaaa;
      position: relative;
      text-align: center;
      padding-top: 15px;
      span {
        display: block;
      }
      .icon {
        padding-bottom: 0;
        font-size: 30px;
        &.iconjiahao {
          font-size: 37px;
        }
      }
      .text {
      }
      &.act {
        color: #0089ff;
      }
    }
  }
}
</style>
