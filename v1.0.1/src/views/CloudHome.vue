<template>
  <div class="fontsmall cloudHome" :class="selected=='banke'?'banke':''">
    <!-- <mt-header v-if="hasnavbar" :title="$t('common.HomeTite')">
      <mt-button
        v-if="hasmainback"
        icon="back"
        slot="left"
        @click="onbackmain"
      >{{$t('common.Back')}}</mt-button>
    </mt-header>-->
    <!-- <i class="iconfont iconjia position-r fontmaintitle" @click="addBankeIcon"></i> -->

    <div class="mint-header-f mycreate-header" v-if="selected=='banke' && !order">
      <div class="lable tc position-c color1">
        <p :class="isCreate?'act navbar colord':''" @click="selectClass(1)">
          <span class="tit-name fontnormal">我创建的</span>
        </p>
        <p :class="!isCreate?'act navbar colord':''" @click="selectClass(0)">
          <span class="tit-name fontnormal">我加入的</span>
        </p>
      </div>
      <i class="iconfont iconjiahao position-r fontmaintitle colord" @click="addBankeIcon"></i>
    </div>

    <!-- My Tabel Header-->
    <!-- <mt-header
      v-if="selected=='mine' &&　!CliudBar"
      title="我的"
      class="mint-header-f mine-header fontnormal color1"
    ></mt-header>-->

    <!--Order  Header-->
    <!-- <mt-header title="班课调序" v-if="order &&　CliudBar" class="order-header">
      <mt-button slot="left" @click="orderCancel" class="fontnormal">取消</mt-button>
      <mt-button slot="right" @click="orderOnsave" class="fontnormal">确定</mt-button>
    </mt-header>-->

    <!-- main -->
    <div :class="hasnavbar?'noheadercontainer page-wrap cloud':'page-wrap cloud'">
      <mt-tab-container
        class="page-tabbar-container"
        :class="!bankeempty&&bankestatedesc=='当前无班课'?'bankeempty':''"
        v-model="selected"
      >
        <!-- v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false"-->
        <div class="banke-wrap scrollingtouch">
          <mt-tab-container-item id="banke">
            <mt-loadmore
              :top-method="loadTop"
              @top-status-change="handleTopChange"
              :top-distance="80"
              :bottom-method="loadMore"
              @bottom-status-change="handleBottomChange"
              :bottom-all-loaded="allLoaded"
              bottomPullText=""
              bottomDropText="上拉加载更多"
              ref="loadmore"
              class
              :auto-fill="autofill"
              :class="!bankeempty&&bankestatedesc=='当前无班课'?'bankeempty':''"
            >
              <!-- <div class="seach-wrap" style="padding:0 10px;margin-top: 2px;" v-if="!order">
            <div class="div_sech" @click="onFocus">
              <div class="box">
                <span class="color9">搜索</span>
                <i class="iconfont iconsoushuo fr fontlarge" style="color:#AAAAAA"></i>
              </div>
            </div>
            <i class="iconfont iconjiahao position-r fontmaintitle colord" @click="addBankeIcon"></i>
              </div>-->
              <!-- <span class="fontnormal position-r colord" @click="orderFn">调序</span> -->
              <!-- <p class="v"></p> -->
              <div
                class="bankecontainer"
                :class="!bankeempty&&bankestatedesc=='当前无班课'?'bankeempty':''"
              >
                <BankeSimple
                  v-for="(item,selindex) in curbankes"
                  :key="selindex"
                  :classitem="curbankes[selindex]"
                  @click.native="bankeclick(item)"
                  @showMenu="onShowMenu"
                  :homeEventmsgs="homeEventmsgs"
                ></BankeSimple>
                <BottomLoadmore
                  v-if="allLoaded && listLoadend && bankeempty"
                  showType
                  loadtext="已经加载全部了"
                  type
                  color
                />
              </div>
              <div
                v-if="!bankeempty&&bankestatedesc=='当前无班课'"
                class="tc no-class empty bankeempty-icon"
              >
                <i class="iconfont icontianjia fontmaintitle" @click="addBankeIcon"></i>
                <p v-if="isteacher">暂无班课，点击创建或加入班课</p>
                <p v-else>暂无班课，点击加入班课</p>
              </div>
              <div
                v-if="!bankeempty &&bankestatedesc!='当前无班课' "
                class="tc bankeempty-icon"
              >{{bankestatedesc}}</div>
            </mt-loadmore>
          </mt-tab-container-item>
        </div>

        <!-- <mt-tab-container-item id="exam">
          <examhome></examhome>
        </mt-tab-container-item>-->
        <mt-tab-container-item id="mine">
          <MineAbout @changeSelected="onChangeSelected" @clearevnt="onClearevnt"></MineAbout>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <mt-tabbar v-model="selected" fixed class="cloud cloud-b" v-if="!CliudBar">
      <mt-tab-item id="banke">
        <div class="bankehome">
          <i
            class="iconfont iconfont-big iconyunbanke-xuanzhong reddot-Tips-wrap"
            :class="homeEventmsgs?'reddot-Tips':''"
          ></i>
          <span class="fonttiny">云班课</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="mine">
        <div class="bankehome">
          <i class="iconfont iconfont-big iconwode-xuanzhong"></i>
          <span class="fonttiny">{{$t('common.My')}}</span>
        </div>
      </mt-tab-item>
    </mt-tabbar>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
    <mt-actionsheet :actions="actions2" v-model="actionShow2"></mt-actionsheet>
    <mt-actionsheet :actions="actionsstu" v-model="actionShowStu"></mt-actionsheet>

    <mt-popup
      v-model="popupSearchHiosty"
      class="search-popup"
      pop-transition="popup-fade"
      :modal="false"
      :class="SearchHistoryLen?'act':''"
    >
      <div class="search-wrap">
        <div class="seach-wrap">
          <div class="div_sech">
            <form action="/">
              <van-search
                placeholder="搜索"
                :show-action="true"
                v-model="value"
                @search="onSearch"
                @cancel="onCancel"
                @input="onInput"
              />
            </form>
          </div>
        </div>
        <div class="main" :class="SearchHistoryLen?'act':''">
          <div v-for="(item,selindex) in searchData" :key="selindex">
            <BankeSimple :classitem="item" @click.native="bankeclick(item)" @showMenu="onShowMenu"></BankeSimple>
          </div>
          <div v-if="SearchHistoryLen">
            <ul class="SearchHistoryLen">
              <li v-for="(item,i) in SearchHistoryArr" :key="i" @click="historClick(item)">
                {{item}}
                <span class="fr color9 fontnormal" @click.stop="de(i)">x</span>
              </li>
            </ul>
            <p class="tc color9 clear" @click="clearHistory">清除搜索记录</p>
          </div>
          <Empty v-if="!SearchHistoryLen&& !searchData.length" :text="['暂无搜索记录']" />
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupSettedinfo"
      :position="routerforward?'right':'left'"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <SettedInfo @updateName="onUpdateName" />
    </mt-popup>
  </div>
</template>

<script>
import examhome from "../Exam/ExamHome";

import BankeSimple from "./components/BankeSimple";

import MineAbout from "./MineAbout";
import SettedInfo from "./my/settedinfo";
import nativecode from "../nativecode";
import Empty from "@/common/empty";
import BottomLoadmore from "@/common/bottom-loadmore";
import {
  Indicator,
  Toast,
  MessageBox,
  Actionsheet,
  Spinner,
  InfiniteScroll
} from "mint-ui";
import Search from "vant/lib/search";
import "vant/lib/search/style";
import { mapState } from "vuex";
export default {
  name: "CloudHome",
  data() {
    return {
      filterCurbankes: [],
      // isCreate: 1,
      order: false,

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
      actionShowStu: false,
      actions2: [
        {
          name: "创建班课",
          method: this.onadd
        },
        {
          name: "使用班课号加入班课",
          method: this.jion
        }
      ],
      actionsstu: [
        {
          name: "使用班课号加入班课",
          method: this.jion
        }
      ],

      SearchHistoryLen: false,
      SearchHistoryArr: [],
      popupSearchHiosty: false,
      tempCurbankes: [],
      searchData: [],

      homeEventmsgs: false,
      bankeitem: {
        ordernum: 0
      },
      page: 0,
      pagesize: 10,
      topStatus: "",
      bottomStatus: "",
      autofill: false,
      // loading: false,
      listLoadend: false,
      allLoaded: false,
      dropType: 0,

      popupSettedinfo: false
    };
  },
  computed: {
    routerforward() {
      return this.$store.state.routerforward;
    },
    isCreate() {
      return this.$store.state.isCreate;
    },
    CliudBar() {
      return this.$store.state.CliudBar;
    },
    showadd() {
      if (this.selected == "banke") {
        return true;
      }
      return false;
    },
    actions() {
      let ret = [];
      if (nativecode.hassharebanke()) {
        ret.push({
          name: "分享班课",
          method: this.bankeShare
        });
      }
      let oname = "置顶班课";
      if (this.bankeitem && this.bankeitem.ordernum) {
        oname = "取消置顶";
      }
      ret.push({
        name: oname,
        method: this.Roof
      });
      return ret;
    },
    isteacher() {
      return this.$store.getters.isteacher;
    },
    hasmainback() {
      return nativecode.hasmainback();
    },
    hasnavbar() {
      if (nativecode.platform == "miniprogram") {
        return false;
      }
      return nativecode.hasnavbar();
    },
    curbankes() {
      return this.$store.state.banke.curbankes;
    },
    bankeempty() {
      if (this.curbankes.length) {
        return true;
      }
      return false;
    },
    curuser() {
      return this.$store.getters.curuser;
    }
  },
  watch: {
    selected() {
      // console.log(this.selected);
      if (this.selected == "banke") {
        // this.initbanke();
      } else if (this.selected == "mine") {
        this.initmine();
      }
    },
    seachvalue: function(newvs, oldvs) {
      if (!newvs) {
      }
    }
  },
  created() {
    var osel = this.$store.state.homeselected;
    if (osel) {
      this.selected = osel;
    }
    if (this.selected == "banke") {
      // this.initbanke();
    }
    this.initbanke();
    this.eventmsgsOnmain();
  },
  methods: {
    loadTop() {
      this.filterCurbankes = [];
      this.page = 0;
      this.allLoaded = false;
      this.dropType = 0;
      this.initbanke();
    },
    loadMore() {
      // this.loading = true;
      this.dropType = 1;
      this.initbanke();
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    selectClass(type) {
      if (this.isCreate == type) return;
      // this.isCreate = type;
      this.$store.commit("SET_ISCREATE", type);
      this.filterCurbankeFn(this.filterCurbankes, this.isCreate, 0);
    },
    orderFn() {
      this.order = true;
      this.$store.commit("SET_CLOUD_BAR", true);
    },
    // 取消调序
    orderCancel() {
      this.order = false;
      this.$store.commit("SET_CLOUD_BAR", false);
    },
    // 保存调序
    orderOnsave() {},

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
    onShowMenu(v) {
      console.log(v);
      this.bankeitem = v;
      this.actionShow = true;
    },
    //创建or加入
    addBankeIcon() {
      let istea = this.$store.getters.isteacher;
      console.log(istea);
      if (this.isteacher) {
        this.actionShow2 = true;
      } else {
        this.actionShowStu = true;
      }
    },
    bankeShare() {
      if (this.bankeitem.id) {
        nativecode.dosharebanke(this.bankeitem);
      }
    },
    islogined() {
      //  return false;
      let u = this.$store.getters.curuser;
      //console.log(u);
      if (u && u.id) {
        return true;
      }
      return false;
    },
    checklogin() {
      if (this.islogined()) {
        return true;
      }
      MessageBox.confirm("", {
        title: "登陆提示",
        message: "您未登陆，是否现在登陆？",
        confirmButtonText: "登陆",
        cancelButtonText: "取消",
        showCancelButton: true
      }).then(() => {
        nativecode.navigateToLogin(this);
      });
      return false;
    },
    // 创建班课
    onadd() {
      if (!this.checklogin()) {
        return;
      }
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
      if (!this.checklogin()) {
        return;
      }
      // this.popupJoin = true;
      this.$store.commit("setRouterForward", true);
      this.$router.push("/Join");
    },
    //置顶
    Roof() {
      this.$http
        .post("/api/banke/settop", {
          bankeid: this.bankeitem.id,
          dotop: this.bankeitem.ordernum ? 0 : 1
        })
        .then(res => {
          if (res.data.code == 0) {
            // Toast("成功");
            this.filterCurbankes = [];
            this.page = 0;
            this.initbanke();
          } else {
            Toast("失败");
          }
        })
        .catch(() => {
          Toast("服务异常");
        });
    },
    initmine() {
      //! 避免wx 缓存
      this.$http.post("/api/api/uservalidate").then(res => {
        if (res.data.code == 0) {
          this.$store.commit("setLoginUser", res.data.data);
          let curuser = this.$store.getters.curuser;
          if (curuser.hassettedinfo == null) {
            this.popupSettedinfo = true;
          }
        } else {
          this.$store.commit("setLoginUser", {});
          this.$store.commit("setRouterForward", true);
          this.$router.push("/login");

          nativecode.jsLogin(0, {});
        }
      });
    },
    onUpdateName(v) {
      this.popupSettedinfo = v;
      this.initmine();
    },
    //获得焦点
    onFocus() {
      let banke_history = localStorage.getItem("banke_history") || "[]";
      banke_history = JSON.parse(banke_history);
      this.SearchHistoryArr = banke_history;
      if (this.SearchHistoryArr.length) {
        this.SearchHistoryLen = true;
      }

      this.tempCurbankes = [];
      Object.assign(this.tempCurbankes, this.curbankes);
      this.popupSearchHiosty = true;
      for (let v of this.tempCurbankes) {
        v.searchKey = v.id + v.name;
      }
    },
    //搜索btn or end
    onSearch() {
      let banke_history = localStorage.getItem("banke_history") || "[]";
      banke_history = JSON.parse(banke_history);
      banke_history.push(this.value);
      localStorage.setItem("banke_history", JSON.stringify(banke_history));
      this.SearchHistoryLen = false;
      this.onInput("");
    },
    //输入框内容变化
    onInput(value) {
      if (!value) {
        value = this.value;
        if (value == "") {
          return;
        }
      }
      let temp = [];
      for (let v of this.tempCurbankes) {
        if (v.searchKey.indexOf(value) > -1) {
          temp.push(v);
        } else {
        }
      }
      this.SearchHistoryLen = false;
      this.searchData = temp;
    },
    historClick(val) {
      this.onInput(val);
    },
    //取消
    onCancel() {
      this.popupSearchHiosty = false;
      this.SearchHistoryArr = [];
      this.searchData = [];
      this.SearchHistoryLen = false;
    },
    clearHistory() {
      localStorage.setItem("banke_history", "");
      this.SearchHistoryArr = [];
      this.SearchHistoryLen = false;
    },
    de(i) {
      this.SearchHistoryArr.splice(i, 1);
      if (!this.SearchHistoryArr.length) {
        this.SearchHistoryLen = false;
      }
      localStorage.setItem(
        "banke_history",
        JSON.stringify(this.SearchHistoryArr)
      );
    },
    initbanke() {
      var url = "/api/api/bankequery";
      if (!this.bankeempty) {
        this.bankestatedesc = "加载中";
      }
      //! cjy: 防止出错， 总是重新拉取
      this.$http
        .post(url, {
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == 0) {
            let arrId = [];
            for (let v of res.data.data) {
              arrId.push(v.id);
              // v.schoolid=1001
            }
            if (res.data.data.length >= this.pagesize) {
              // this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.allLoaded = true;
            }
            this.eventmsgsOnbankes(res.data.data, arrId);
          }
          if (!this.bankeempty) {
            this.bankestatedesc = "当前无班课";
          }
          if (this.dropType) {
            this.$refs.loadmore.onBottomLoaded();
          } else {
            this.$refs.loadmore.onTopLoaded();
          }
        })
        .catch(res => {
          console.log(res);
          this.bankestatedesc = "发生异常";
          if (this.dropType) {
            this.$refs.loadmore.onBottomLoaded();
          } else {
            this.$refs.loadmore.onTopLoaded();
          }
        });
    },
    //红点班课列表
    eventmsgsOnbankes(datas, bankeids) {
      this.$http
        .post("/api/eventmsgs/onbankes", {
          bankes: [...bankeids]
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length) {
            let serveData = res.data.data;
            for (let v of serveData) {
              for (let item of datas) {
                if (v.bankeid == item.id && v.count) {
                  item.eventmsgs = v.count;
                }
              }
            }
          }
          this.filterCurbankes = [...this.filterCurbankes, ...datas];
          this.filterCurbankeFn(this.filterCurbankes, this.isCreate, 1);
        })
        .catch(err => {
          this.filterCurbankes = [...this.filterCurbankes, ...datas];
          this.filterCurbankeFn(this.filterCurbankes, this.isCreate, 1);
        });
    },
    //红点班课主页
    eventmsgsOnmain() {
      this.$http
        .post("/api/eventmsgs/onmain", {})
        .then(res => {
          if (res.data.code == "0" && res.data.data.banke) {
            this.homeEventmsgs = true;
          } else {
          }
        })
        .catch(err => {});
    },
    filterCurbankeFn(bankes, type, first) {
      let temp = [];
      if (type) {
        temp = bankes.filter(item => item.userid == this.curuser.id);
      } else {
        temp = bankes.filter(item => item.userid != this.curuser.id);
      }
      //首次加载
      if (temp.length == 0 && first) {
        // this.isCreate = 0;
        this.$store.commit("SET_ISCREATE", 0);
        temp = bankes.filter(item => item.userid != this.curuser.id);
      }
      if (!temp.length && !first) {
        this.bankestatedesc = "当前无班课";
        console.log("bankeempty", this.bankeempty);
        console.log("bankestatedesc", this.bankestatedesc);
      }
      this.$store.commit("banke/setBankes", temp);
    },
    onClearevnt(v) {
      if (v) {
        this.homeEventmsgs = false;
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
    [Search.name]: Search,
    //  [Tab.name]: Tab,
    //   [Tabs.name]: Tabs,
    Empty,
    BottomLoadmore,
    SettedInfo
  }
};
</script>

<style scoped>
.mint-tab-container-item {
  /* background: #fff; */
}
.v {
  background: #fff;
  height: 10px;
}
.cloud .iconfont-big {
  font-size: 35px !important;
}
.btnadd {
  font-size: 30px;
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
  color: #999;
  background-color: #fff;
}
.cloud-b .mint-tab-item.is-selected {
  color: #26a2ff;
  background-color: #fff;
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
.bankeempty-icon {
}
.no-class {
  color: #999;
}
.no-class i {
  font-size: 80px;
}
.div_sech {
  width: 85% !important;
}
.div_sech .box {
  height: 43px;
  background: rgba(249, 249, 249, 1);
  border: 1px solid rgba(240, 240, 240, 1);
  opacity: 1;
  border-radius: 8px;
  line-height: 43px;
  padding: 0 10px;
}
.van-search__content {
  background: rgba(249, 249, 249, 1) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(240, 240, 240, 1) !important;
}
.search-popup {
}
.bankehome {
  position: relative;
  height: 50px;
}
.bankehome i {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.bankehome span {
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translate(-50%, 0);
}
.cloudHome {
  overflow: hidden;
}
.cloudHome.banke {
}
.cloudHome .page-wrap {
  height: 100%;
  margin-top: 0;
}
.cloudHome.banke .page-wrap {
  height: 100%;
  margin-top: 94px;
}
.cloudHome.banke .page-wrap .bankecontainer {
  min-height: 74vh;
  /* padding-bottom: 30px; */
}
.cloudHome.banke .page-wrap .bankecontainer.bankeempty {
  min-height: 78vh;
}
</style>

<style lang="less" scoped>
.search-popup {
  background: #f0f0f0;
  .main {
    &.act {
      padding: 0 20px;
    }
  }
  .div_sech {
    width: 100% !important;
    .van-search__action {
      color: #0089ff;
    }
  }
  .SearchHistoryLen {
    li {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  &.act {
    background: #fff;
  }
  .clear {
    padding: 20px 0;
    color: #0089ff;
  }
}
.mycreate-header {
  width: 100%;
  height: 95px;
  background: #fff;
  padding: 15px 0;
  .lable {
    width: 60%;
    line-height: 45px;
    > p {
      position: relative;
      display: inline-block;
      width: 50%;
      &.navbar::after {
        width: 30%;
        border-radius: 2px;
      }
      &.act {
      }
    }
  }
  > i {
    font-size: 30px;
  }
}
</style>
<style>
.mint-loadmore.bankeempty {
  height: 100%;
}
.mint-loadmore.bankeempty .mint-loadmore-content {
  position: relative;
  height: 100%;
}
.page-tabbar-container.bankeempty {
  height: 100%;
}
.mint-tabbar.is-fixed {
  background: #fff;
}
.banke-wrap {
  width: 100%;
  height: 74vh;
  overflow: auto;
}
</style>