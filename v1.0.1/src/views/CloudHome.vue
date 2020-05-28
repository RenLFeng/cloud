<template>
  <div class="fontsmall cloudHome" :class="selected=='banke'?'banke':''">
    <div class="mint-header-f mycreate-header" v-if="selected=='banke' && !order">
      <div class="lable tc position-c color1">
        <p :class="isCreate?'act navbar colord':''" @click="selectClass(1)" v-if="isteacher">
          <span class="tit-name fontnormal">我创建的</span>
        </p>
        <p :class="!isCreate?'act navbar colord':''" @click="selectClass(0)">
          <span class="tit-name fontnormal">我加入的</span>
        </p>
      </div>
      <i class="iconfont iconjiahao position-r fontmaintitle colord" @click="addBankeIcon"></i>
    </div>
    <!-- main -->
    <div :class="hasnavbar?'noheadercontainer page-wrap cloud':'page-wrap cloud'">
      <mt-tab-container
        class="page-tabbar-container"
        :class="!bankeempty?'bankeempty':''"
        v-model="selected"
      >
        <!-- :bottom-method="loadMore"
              @bottom-status-change="handleBottomChange"
              :bottom-all-loaded="allLoaded"
              bottomPullText
        bottomDropText="上拉加载更多"-->

        <div
          ref="bankewrap"
          class="banke-wrap scrollingtouch"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <mt-tab-container-item id="banke">
            <mt-loadmore
              :top-method="loadTop"
              @top-status-change="handleTopChange"
              :top-distance="80"
              ref="loadmore"
              class
              :auto-fill="autofill"
              :class="!bankeempty?'bankeempty':''"
            >
              <div class="bankecontainer" :class="!bankeempty?'bankeempty':''">
                <div
                  class="paret-class-wrap"
                  v-for="(item,selindex) in !isCreate?filterCurbankes:filterCourses"
                  :key="selindex"
                >
                  <BankeSimple
                    :classitem="item"
                    @click.native="courseclick(item)"
                    @showMenu="onShowMenu"
                    @gocourse="ongocourse"
                    :homeEventmsgs="homeEventmsgs"
                    :isCreate="isCreate"
                  ></BankeSimple>
                  <div class="subclass-wrap" v-if="isCreate">
                    <div
                      class="subclass"
                      v-for="(v,i) in filterCourseBanke (item.id)"
                      :key="i"
                      @click="bankeclick(v)"
                    >
                      <p class="stit color0 font18 ellipse">{{v.name}}</p>
                      <p
                        class="ggao position-c colory font-xxs ellipse tc"
                        v-if="v.info"
                      >公告:&nbsp;{{v.info}}</p>
                      <div class="sinfo-r">
                        <span class="colora font-xxs ellipse membernum">{{v.membernum}}人</span>
                        <span class="iconfont iconjiantou colora font18 position-r"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="NoCourseidBanke" v-if="isCreate">
                  <BankeSimple
                    v-for="(citem,i) in NoCourseidBanke()"
                    :key="i+'_index'"
                    :classitem="citem"
                    @click.native="bankeclick(citem)"
                    @showMenu="onShowMenu"
                    @gocourse="ongocourse"
                    :homeEventmsgs="homeEventmsgs"
                    :isCreate="isCreate"
                  ></BankeSimple>
                </div>

                <BottomLoadmore
                  v-if="allLoaded && listLoadend && bankeempty"
                  showType
                  loadtext="已经加载全部了"
                  type
                  color
                />
                <BottomLoadmore
                  v-if="!allLoaded && loading"
                  showType="loading"
                  loadtext="加载中..."
                  type="triple-bounce"
                  color
                />
              </div>
              <div v-if="!bankeempty&&!isloadtop" class="tc no-class empty bankeempty-icon">
                <i class="iconfont icontianjia fontmaintitle" @click="addBankeIcon"></i>
                <p v-if="isteacher">暂无课程，点击创建课程或加入班级</p>
                <p v-else>暂无课程，点击加入班级</p>
              </div>
              <div v-if="!bankeempty&&!isloadtop " class="tc bankeempty-icon">{{bankestatedesc}}</div>
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
      <mt-tab-item id="mine" @click.native="mineclick">
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
            <BankeSimple :classitem="item" @click.native="courseclick(item)" @showMenu="onShowMenu"></BankeSimple>
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
      pop-transition="popup-fade"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <SettedInfo @updateName="onUpdateName" />
    </mt-popup>
  </div>
</template>

<script>
import axios from "axios";
import examhome from "../Exam/ExamHome";
import BankeSimple from "./components/BankeSimple";
const MineAbout = () => import("@/views/MineAbout");
import nativecode from "../nativecode";
import Empty from "@/common/empty";
import BottomLoadmore from "@/common/bottom-loadmore";
import SettedInfo from "@/views/my/settedinfo";
import {
  Toast,
  MessageBox,
  Tabbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Actionsheet
} from "mint-ui";
import Search from "vant/lib/search";
import "vant/lib/search/style";
import { mapState } from "vuex";
export default {
  name: "CloudHome",
  data() {
    return {
      filterCurbankes: [],
      filterCourses: [],
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
          name: "创建课程",
          method: this.onadd
        },
        {
          name: "加入班级",
          method: this.jion
        }
      ],
      actionsstu: [
        {
          name: "加入班级",
          method: this.jion
        }
      ],

      SearchHistoryLen: false,
      SearchHistoryArr: [],
      popupSearchHiosty: false,
      tempCurbankes: [],
      searchData: [],

      homeEventmsgs: false,
      courseitem: {
        ordernum: 0
      },
      bankeitem: {},
      page: 0,
      pagesize: 20,
      topStatus: "",
      bottomStatus: "",
      autofill: false,
      loading: false,
      listLoadend: false,
      allLoaded: false,
      popupSettedinfo: false,
      isloadtop: false,
      distance: 0,

      loadcourses: [],
      loadbankes: [],

      joincourse: []
    };
  },
  computed: {
    routerforward() {
      return this.$store.state.routerforward;
    },
    isCreate() {
      if (this.isteacher) {
        return this.$store.state.isCreate;
      }
      return 0;
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
      let oname = "置顶课程";
      if (this.courseitem && this.courseitem.ordernum) {
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
    curcourses() {
      return this.$store.state.banke.curcourses;
    },
    bankeempty() {
      if (this.filterCourses.length || this.filterCurbankes.length) {
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
      if (this.selected == "banke") {
        // this.initbanke();
        this.$nextTick(() => {
          if (this.distance) {
            let bankewrapEl = this.$refs.bankewrap;
            bankewrapEl.scrollTop = this.distance;
          }
        });
      } else if (this.selected == "mine") {
        this.initmine();
      }
    },
    isCreate() {}
  },
  created() {
    var osel = this.$store.state.homeselected;
    if (osel) {
      this.selected = osel;
    }
    if (this.selected == "banke") {
      // this.initbanke();
    }
    let localCurbankes = sessionStorage.getItem("curbankes") || "[]";
    localCurbankes = JSON.parse(localCurbankes);
    if (
      this.curbankes.length &&
      this.curbankes.length >= localCurbankes.length
    ) {
      this.loadcourses = this.curcourses;
      this.loadbankes = this.curbankes;
      let bankeScorllState = sessionStorage.getItem("bankeScorllState") || "";
      if (bankeScorllState) {
        bankeScorllState = JSON.parse(bankeScorllState);
        this.page = bankeScorllState.page;
        this.allLoaded = bankeScorllState.allLoaded;
        this.loading = bankeScorllState.loading;
        this.listLoadend = bankeScorllState.listLoadend;
      }
      this.initselecRoleLoad(this.loadbankes, this.isCreate, 1);
    } else {
      sessionStorage.setItem("scrolltop", 0);
      sessionStorage.setItem("homelocalstate", "");
      // this.initbanke();
      this.loadTopInit();
      this.loadMore();
    }
    this.initmine();
    this.eventmsgsOnmain();
  },
  mounted() {
    let scrollWrap = this.$refs.bankewrap;
    scrollWrap.addEventListener("scroll", this.onscrollfn, false);
  },
  methods: {
    showitem(item) {
      return item.courseid == 0;
    },
    filterCourseBanke(cid) {
      return this.filterCurbankes.filter(function(item) {
        return item.courseid == cid;
      });
    },
    NoCourseidBanke() {
      return this.filterCurbankes.filter(function(item) {
        return !item.courseid;
      });
    },
    loadTop() {
      this.loadTopInit();
      this.isloadtop = true;
      this.initbanke();
    },
    loadMore() {
      // let homelocalstate = this.gethomelocalstate();
      // if (homelocalstate) {
      //   this.page = homelocalstate.page;
      //   if (homelocalstate.allLoaded) return;
      // }
      this.loading = true;
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
      this.$store.commit("SET_ISCREATE", type);
      this.filterCurbankeFn(this.curbankes, this.isCreate, 0);
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
    ongocourse(v) {
      if (v.hasOwnProperty("courseid")) {
        this.bankeclick(v);
      } else {
        this.courseclick(v);
      }
    },
    courseclick(courseitem) {
      this.courseitem = courseitem;
      this.courseDedail();
    },
    //进入课程主页
    courseDedail() {
      if (this.courseitem.id) {
        if (this.isCreate) {
          let tourl = "/coursehome/" + this.courseitem.id;
          if (!nativecode.navigateTo(tourl)) {
            this.$store.commit("setRouterForward", true);
            this.$router.push(tourl);
            this.sethomelocalstate(1);
            let curbankes = this.curbankes;
            sessionStorage.setItem("curbankes", JSON.stringify(curbankes));
            sessionStorage.setItem(
              "curcourse",
              JSON.stringify(this.courseitem)
            );
          }
        } else {
          this.bankeclick(this.courseitem);
        }
        this.setbankeScorllState();
      }
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
          this.sethomelocalstate(1);
          let curbankes = this.curbankes;
          sessionStorage.setItem("curbankes", JSON.stringify(curbankes));
          this.setbankeScorllState();
        }
      }
    },
    setbankeScorllState() {
      sessionStorage.setItem(
        "bankeScorllState",
        JSON.stringify({
          page: this.page,
          allLoaded: this.allLoaded,
          loading: this.loading,
          listLoadend: this.listLoadend
        })
      );
    },
    onShowMenu(v) {
      console.log(v);
      this.courseitem = v;
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
      if (this.courseitem.id) {
        nativecode.dosharebanke(this.courseitem);
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
        // this.$router.push("/bankenew");
        this.$router.push("/CouresNew");
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
          bankeid: this.courseitem.id,
          dotop: this.courseitem.ordernum ? 0 : 1
        })
        .then(res => {
          if (res.data.code == 0) {
            // Toast("成功");
            this.loadbankes = [];
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
    //获得焦点
    onFocus() {
      let banke_history = localStorage.getItem("banke_history") || "[]";
      banke_history = JSON.parse(banke_history);
      this.SearchHistoryArr = banke_history;
      if (this.SearchHistoryArr.length) {
        this.SearchHistoryLen = true;
      }

      this.tempCurbankes = [];
      Object.assign(this.tempCurbankes, this.filterCurbankes);
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
      var url = "/api/api/bankequery2";
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
            let loadbankes = res.data.data.bankes;
            this.coursequery(loadbankes);
            this.loadcourses = [...this.loadcourses, ...res.data.data.courses];
            for (let citem of this.loadcourses) {
              citem.username = this.curuser.name;
            }
            console.log("城市来得快loadbankes", loadbankes);
            let arrId = [];
            for (let v of loadbankes) {
              arrId.push(v.id);
              // v.schoolid=1001
              if (!v.funcdesc || v.funcdesc == "{}") {
                v.funcdesc = {
                  disablejoin: true,
                  disablequit: true
                };
              } else {
                v.funcdesc = JSON.parse(v.funcdesc);
              }
            }
            if (loadbankes.length >= this.pagesize) {
              this.loading = false;
              this.page++;
              this.sethomelocalstate(1);
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.loading = true;
              this.allLoaded = true;
            }
            this.eventmsgsOnbankes(loadbankes, arrId);
          }
          if (!this.bankeempty) {
            this.bankestatedesc = "当前无班课";
          }
          this.$refs.loadmore.onTopLoaded();
        })
        .catch(res => {
          console.log(res);
          this.bankestatedesc = "发生异常";
          this.$refs.loadmore.onTopLoaded();
        });
    },
    //红点班课列表
    eventmsgsOnbankes(allbankes, bankeids) {
      this.$http
        .post("/api/eventmsgs/onbankes", {
          bankes: [...bankeids]
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length) {
            let serveData = res.data.data;
            for (let v of serveData) {
              for (let item of allbankes) {
                if (v.bankeid == item.id && v.count) {
                  item.eventmsgs = v.count;
                }
              }
            }
          }
          this.loadbankes = [...this.loadbankes, ...allbankes];
          this.initselecRoleLoad(this.loadbankes, this.isCreate, 1);
          this.isloadtop = false;
        })
        .catch(err => {
          this.loadbankes = [...this.loadbankes, ...allbankes];
          this.initselecRoleLoad(this.loadbankes, this.isCreate, 1);
          this.isloadtop = false;
        });
    },
    filterCurbankeFn(loadbankes, type, first) {
      let temp = [];
      let temp2 = [];
      if (type) {
        temp = loadbankes.filter(item => item.userid == this.curuser.id);
        temp2 = this.loadcourses.filter(item => item.userid == this.curuser.id);
      } else {
        temp = loadbankes.filter(item => item.userid != this.curuser.id);
        temp2 = this.loadcourses.filter(item => item.userid != this.curuser.id);
      }
      //首次加载
      if (temp.length == 0 && first) {
        this.$store.commit("SET_ISCREATE", 0);
        temp = loadbankes.filter(item => item.userid != this.curuser.id);
        temp2 = this.loadcourses.filter(item => item.userid != this.curuser.id);
      }
      if (!temp2.length && !first) {
        this.bankestatedesc = "当前无班课";
      }
      this.filterCurbankes = temp;
      this.filterCourses = temp2;
      console.log("班级", temp);
      console.log("课程", temp2);
      console.log("bankeempty", this.bankeempty);
      // console.log("bankestatedesc", this.bankestatedesc);
      this.$store.commit("banke/setBankes", loadbankes);
      this.$store.commit("banke/setCourse", this.loadcourses);
    },
    coursequery(joindata) {
      for (let i = 0; i < joindata.length; i++) {
        let item = joindata[i];
        if (!item.courseid) continue;
        if (item.courseid && !item.coursename) {
          this.$http
            .post("/api/course/query", {
              where: {
                id: item.courseid
              }
            })
            .then(res => {
              if (res.data.code == "0") {
                if (res.data.data.length) {
                  let serveData = res.data.data;
                  item.coursename = serveData[0].name;
                  item.avatar = serveData[0].avatar;
                }
              } else {
              }
            })
            .catch(err => {});
        }
      }
    },
    initselecRoleLoad(loadbankes, type, first) {
      if (this.isteacher) {
        this.filterCurbankeFn(loadbankes, type, first);
      } else {
        this.filterCurbankes = loadbankes;
        this.filterCourses = this.loadcourses;
        this.$store.commit("banke/setBankes", loadbankes);
        this.$store.commit("banke/setCourse", this.loadcourses);
      }
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
    onUpdateName(v) {
      this.popupSettedinfo = v;
      this.initmine();
    },
    onClearevnt(v) {
      if (v) {
        this.homeEventmsgs = false;
      }
    },
    gethomelocalstate() {
      let homelocalstate = sessionStorage.getItem("homelocalstate") || "";
      if (homelocalstate) {
        homelocalstate = JSON.parse(homelocalstate);
      }
      return homelocalstate;
    },
    sethomelocalstate(type) {
      let homelocalstate = this.gethomelocalstate();
      let allLoaded = false;
      let localstate = {};
      if (type) {
        if (homelocalstate.allLoaded || this.allLoaded) {
          allLoaded = true;
        }
        localstate = {
          allLoaded: allLoaded,
          page: this.page
        };
      } else {
        localstate = {
          allLoaded: allLoaded,
          page: 0
        };
      }
      sessionStorage.setItem("homelocalstate", JSON.stringify(localstate));
    },
    mineclick() {
      let topdistance = sessionStorage.getItem("scrolltop") || 0;
      this.distance = topdistance;
    },
    onscrollfn() {
      sessionStorage.setItem("scrolltop", this.$refs.bankewrap.scrollTop);
      //  console.log(this.$refs.bankewrap.scrollHeight);
      //  console.log(this.$refs.bankewrap.offsetHeight);
      //   console.log(document.documentElement.clientHeight+'-----------'+window.innerHeight); // 可视区域高度
      //   console.log(document.body.scrollTop); // 滚动高度
      //   console.log(document.body.offsetHeight); // 文档高度
    },
    onhidepage(v) {},
    loadTopInit() {
      this.sethomelocalstate(0);
      this.loadcourses = [];
      this.loadbankes = [];
      this.filterCurbankes = [];
      this.filterCourses = [];
      this.page = 0;
      this.loading = false;
      this.listLoadend = false;
      this.allLoaded = false;
    }
  },
  beforeDestroy() {},
  destroyed: function() {
    //! 记忆当前的选择
    this.$store.commit("setHomeSelected", this.selected);
    window.removeEventListener("scroll", this.onscrollfn);
  },
  components: {
    MineAbout,
    examhome,
    BankeSimple,
    Empty,
    BottomLoadmore,
    SettedInfo,
    [Search.name]: Search,
    [TabItem.name]: TabItem,
    [Tabbar.name]: Tabbar,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem,
    [Actionsheet.name]: Actionsheet
    // CourseHome
  },
  //在页面离开时记录滚动位置
  beforeRouteLeave(to, from, next) {
    if (to.path == "/login") {
      sessionStorage.setItem("homelocalstate", "");
      sessionStorage.removeItem("curbankes");
    }
    next();
  },
  //进入该页面时，用之前保存的滚动位置赋值
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        if (from.path == "/") {
          sessionStorage.setItem("scrolltop", 0);
          vm.sethomelocalstate(0);
        }
        let bankewrapEl = vm.$refs.bankewrap;
        let scrolltop = JSON.parse(sessionStorage.getItem("scrolltop"));
        bankewrapEl.scrollTop = scrolltop;
        let homelocalstate = vm.gethomelocalstate();
        if (homelocalstate) {
          vm.page = homelocalstate.page;
          if (homelocalstate.allLoaded && homelocalstate.page) {
            vm.allLoaded = homelocalstate.allLoaded;
            vm.listLoadend = homelocalstate.allLoaded;
          }
        }
      });
    });
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
}
.cloudHome.banke {
}
.cloudHome .page-wrap {
  height: 100%;
  margin-top: 0;
}
.cloudHome.banke .page-wrap {
  height: 100%;
  margin-top: 104px;
}
.cloudHome.banke .page-wrap .bankecontainer {
  min-height: calc(100vh - 175px);
  padding-bottom: 10px;
}
.cloudHome.banke .page-wrap .bankecontainer.bankeempty {
  min-height: 78vh;
}
</style>

<style lang="less" scoped>
.paret-class-wrap {
  width: 95%;
  margin: 0 auto;
  margin-bottom: 10px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  background: #fff;
  .subclass-wrap {
    padding: 0 10px;
    .subclass {
      position: relative;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 0.02667rem solid #f0f0f0;
      padding-right: 24px;
      .stit {
        width: 30%;
      }
      .ggao {
        width: 40%;
      }
      .sinfo-r {
        width: 16%;
        text-align: right;
        .membernum {
          display: block;
          width: 100%;
        }
        .iconfont {
          font-size: 26px;
          right: 0;
          top: 32px;
        }
      }
    }
  }
}
.NoCourseidBanke{
  .class-banke-list{
    width: 95%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
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
  height: calc(100vh - 175px);
  min-height: calc(100vh - 175px);
  overflow: auto;
}
</style>