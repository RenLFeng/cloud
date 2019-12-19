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
              <form action="/">
                <van-search placeholder="搜索" :autofocus="false" @focus="onFocus" />
              </form>
            </div>
            <i class="iconfont iconjiahao colord position-r fontmaintitle" @click="addBankeIcon"></i>
          </div>
          <p class="v"></p>
          <div class="bankecontainer">
            <div v-for="(item,selindex) in curbankes" :key="selindex">
              <BankeSimple
                :classitem="curbankes[selindex]"
                @click.native="bankeclick(item)"
                @showMenu="onShowMenu"
              ></BankeSimple>
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
        <div class="bankehome">
          <i
            class="iconfont iconfont-big iconbianzu reddot-Tips-wrap"
            :class="homeEventmsgs?'reddot-Tips':''"
          ></i>
          <span class="fontnormal">{{$t('common.Class')}}</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="mine">
        <div class="bankehome">
          <i class="iconfont iconfont-big iconuser"></i>
          <span class="fontnormal">{{$t('common.My')}}</span>
        </div>
      </mt-tab-item>
    </mt-tabbar>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
    <mt-actionsheet :actions="actions2" v-model="actionShow2"></mt-actionsheet>

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
                :autofocus="false"
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
  </div>
</template>

<script>
import examhome from "../Exam/ExamHome";

import BankeSimple from "./components/BankeSimple";

import MineAbout from "./MineAbout";

import nativecode from "../nativecode";
import Empty from "@/common/empty";
import { Indicator, Toast, MessageBox, Actionsheet } from "mint-ui";
import Search from "vant/lib/search";
import "vant/lib/search/style";
import { mapState } from "vuex";
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
      ],
      SearchHistoryLen: false,
      SearchHistoryArr: [],
      popupSearchHiosty: false,
      tempCurbankes: [],
      searchData: [],

      homeEventmsgs: false
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
    this.eventmsgsOnmain();
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
        .post(url)
        .then(res => {
          if (res.data.code == 0) {
            let arrId = [];
            for (let v of res.data.data) {
              arrId.push(v.id);
            }
            this.eventmsgsOnbankes(res.data.data, arrId);
          }
          if (!this.bankeempty) {
            this.bankestatedesc = "当前无班课";
          }
        })
        .catch(res => {
          console.log(res);
          this.bankestatedesc = "发生异常";
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
          } else {
          }
          this.$store.commit("banke/setBankes", datas);
        })
        .catch(err => {
           this.$store.commit("banke/setBankes", datas);
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
    Empty
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
  font-size: 35px !important;
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
.div_sech {
  width: 85% !important;
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
  left: 50%;
  bottom: 5px;
  transform: translate(-50%, 0);
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
</style>