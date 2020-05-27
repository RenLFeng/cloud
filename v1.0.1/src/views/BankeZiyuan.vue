<template>
  <div class="url-wrap fontsmall zhiyan-wrap">
    <mt-header :title="menuName?menuName:bankename" class="mint-header-f">
      <mt-button
        v-if="hasbackbtn && !selection"
        icon="back"
        slot="left"
        @click="backHome"
      >{{$t('common.Back')}}</mt-button>
      <!-- <mt-button v-if="hasbackbtn && selection" slot="left" @click="selectAll">全选</mt-button>
      <mt-button v-if="hasbackbtn && selection" slot="right" @click="cancelSelect">取消</mt-button>
      <div slot="right" v-if="showupload && !selection">
        <mt-button slot="right" class="iconfont iconjia icons" @click="selects"></mt-button>
        <mt-button slot="right" class="iconfont iconjia icons" @click="onSort"></mt-button>
        <mt-button slot="right" class="iconfont iconjia icons" @click="onaddFile"></mt-button>
      </div>-->
    </mt-header>
    <!-- <div v-if="showupload" class="uploadpart">
      <mt-tabbar v-model="selected" class="uploadtabbar">
        <mt-tab-item id="1" @click.native="onUploadLocal">
          <div>
            <i class="iconfont iconfont-big iconcongbendishangchuan" style="color:#FFCB8E"></i>
            <div class="fonttiny">{{$t('bankeZiYuan.Upload_files')}}</div>
          </div>
        </mt-tab-item>

        <mt-tab-item id="2" @click.native="onUploadLink">
          <div>
            <i class="iconfont iconfont-big iconwangyelianjie"></i>
            <div class="fonttiny">{{$t('bankeZiYuan.WebLink')}} {{arrZhiyuan.id}}</div>
          </div>
        </mt-tab-item>
      </mt-tabbar>
    </div>-->
    <div class="btn-wrap">
      <!-- <p class="jiaoan position-l" v-if="!cfrom && showJiaoAn" @click="jiaoan">
        <mt-button class="font16 btn">教案</mt-button>
        <i class="iconfont iconjiantou position-r colora"></i>
      </p>-->
      <div
        class="right-wrap position-r colora"
        :class="cfrom?'cfrom':''"
        v-if="showupload && !selection || cfrom"
      >
        <span class="iconfont iconpaixu icons sort" :class="cfrom?'position-l':''" @click="onSort "></span>
        <span
          class="iconfont iconiconfontadd icons file"
          :class="cfrom?'position-r':''"
          @click="onaddFile"
        ></span>
      </div>
      <span
        class="iconfont iconpaixu icons position-r showupload"
        v-if="!showupload && !cfrom"
        @click="onSort "
      ></span>
    </div>
    <p class="Prev-btn" v-if="tempmenuData.length" @click="onPrev">
      <i class="iconfont iconwithdraw-fill colord position-l"></i>
      <span style="color:#a5a5a5">返回上一层...</span>
    </p>
    <div class="items-container" :class="showupload?'showupload':''">
      <!-- <p v-if="arrZhiyuan.length" class="Resources-total fonttiny">资源总数:{{filetotal}}</p> -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item
          id="1"
          :class="{'listcontainer-wrap':true,'cfrom':cfrom,'showupload':showupload}"
        >
          <!-- 
             :bottom-method="loadMore"
              @bottom-status-change="handleBottomChange"
              :bottom-all-loaded="allLoaded"
              bottomPullText
          bottomDropText="上拉加载更多"-->

          <div
            ref="listcontainer"
            class="listcontainer scrollingtouch"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
          >
            <mt-loadmore
              :top-method="loadTop"
              @top-status-change="handleTopChange"
              :top-distance="80"
              ref="loadmore"
              :auto-fill="autofill"
              :class="filesempty?'filesempty':''"
            >
              <div class="wrap" :class="prevStyle?'prev':''">
                <div v-for="(fitem,selindex) in arrZhiyuan" v-bind:key="selindex" class="item-wrap">
                  <div
                    v-if="fitem.ftype=='menu'"
                    class="folder-wrap-item"
                    @click="onFolderClick(fitem)"
                  >
                    <img
                      class="img object-fit-img position-l;"
                      :src="fitem.imgsrc"
                      :onerror="$defaultImg('')"
                    />
                    <div class="info-wrap position-r">
                      <p class="name ellipse position-t">
                        {{fitem.name}}
                        <i
                          class="iconfont iconjiantou1 eicotrigger colord position-r"
                          @click.stop="oneditclick(fitem)"
                        ></i>
                      </p>
                      <p class="time font-xxs colora5 position-b">
                        {{fitem.createtime}}&nbsp;更新
                        <span class="fr">文件夹</span>
                      </p>
                    </div>
                  </div>
                  <BankeFileSimple
                    v-else
                    :fileitem="arrZhiyuan[selindex]"
                    :index="selindex"
                    :arrZhiyuan="arrZhiyuan"
                    :fileInfo="fileInfo"
                    :selection="selection"
                    :cfrom="cfrom"
                    @editclick="oneditclick"
                    @normalclick="onviewfile"
                    @selectionClick="onSelectionClick"
                  ></BankeFileSimple>
                </div>
                <BottomLoadmore
                  v-if="allLoaded && listLoadend"
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
              <div v-if="filesempty" class="tc emptydesc position-c">{{$t(liststatedesc)}}</div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3" class="tc">{{$t('common.PleaseAwait')}}</mt-tab-container-item>
        <mt-popup
          v-model="popupUploadLink"
          position="right"
          class="popup-right"
          :modal="false"
          style="background:#f0f0f0"
        >
          <URL
            :bankeid="cfrom?courseid:bankeid"
            @addLinkState="onAddLinkState"
            :cfrom="cfrom"
            :parentTempmenuData="tempmenuData"
            :curRootPrevid="curRootPrevid"
            :parentid="parentid"
            :headerName="menuName?menuName:bankename"
          />
        </mt-popup>
      </mt-tab-container>
    </div>
    <input
      ref="uploadfilebtn"
      type="file"
      name="file"
      class="upload__input"
      @change="uploadChange"
      style="display:none"
    />
    <mt-popup
      v-model="popupEditInfo"
      position="right"
      class="popup-right info-popup"
      :modal="false"
    >
      <!-- <div class="cfrom-view-header" v-if="cfrom">
        <div class="header-wrap">
          <span class="position-l colord" @click="goBack()">返回</span>
          <p class="position-c name" @click="showallBanke()">
            {{curcfromBanke.name}}
            <i class="iconfont iconjiantou1 position-r"></i>
          </p>
        </div>
        <ul class="bankes-wrap" :class="showallbankes?'act':''">
          <li
            v-for="(v,i) in allBankes"
            :key="i"
            :class="v.id==curcfromBanke.id?'act':''"
            @click="select(v)"
          >{{v.name}}</li>
        </ul>
        <div class="v-modal" v-if="showallbankes" @click="showallbankes=false"></div>
      </div>-->
      <mt-header :title="editItemFile.name">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <BankeFileSimple :fileitem="editItemFile" :seeState="0"></BankeFileSimple>
      <div class="info-list-main">
        <div class="tit-table">
          <p class="clearfix tc">
            <span
              :class="!seeState?'act fl':'fl'"
              @click="see(0,editItemFile.noviewnum)"
            >未查看（{{editItemFile.noviewnum}} 人）</span>
            <span
              :class="seeState?'act fr':'fr'"
              @click="see(1,editItemFile.viewnum)"
            >已查看（{{editItemFile.viewnum}}人）</span>
          </p>
        </div>
        <ul class="list-content overflow-scroll">
          <li v-for="(item,index) in UserList" :key="index" class="clearfix">
            <span class="name ellipse position-l">{{item.name}}</span>
            <span class="score-wrap position-r tr">
              <span v-if="item.score" class="score fr">得分&nbsp;{{item.score}}</span>
              <span v-else class="score fr">未查看</span>
              <span class="time fonttiny colora">{{item.countdate}}</span>
            </span>
          </li>
        </ul>
      </div>
    </mt-popup>
    <!-- <mt-popup v-model="popupAudio" position="right" class="popup-right info-popup" :modal="false">
      <Audio :audioInfo="viewfileItem.info" @Backs="goBack" v-if="popupAudio" />
    </mt-popup>-->
    <mt-popup
      v-model="popupSuperLink"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <AddSuperLink
        v-if="popupSuperLink"
        :bankeid="cfrom?courseid:bankeid"
        @watchBack="onWatchBack"
      />
    </mt-popup>
    <mt-popup
      v-model="popupUploadFile"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <UpLoadFile
        v-if="popupUploadFile"
        :cfrom="cfrom"
        :bankeid="cfrom?courseid:bankeid"
        :tempUploadFile="tempUploadFile"
        :parentid="parentid"
        :parentTempmenuData="tempmenuData"
        :curRootPrevid="curRootPrevid"
        :headerName="menuName?menuName:bankename"
        @uploadfile="onUploadLocal"
        @canlce="goBack()"
      />
    </mt-popup>
    <mt-popup
      v-model="popupmulu"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <Menu
        :bankeid="cfrom?courseid:bankeid"
        :cfrom="cfrom"
        :moveItemFile="editItemFile"
        :parentTempmenuData="tempmenuData"
        :curRootPrevid="curRootPrevid"
        v-if="popupmulu"
        :parentid="parentid"
        :headerName="menuName?menuName:bankename"
        @Cancel="onCancel"
        @menuSelectEnd="onMenuSelectEnd"
      />
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow" ref="Actionsheet" id="Actionsheet"></mt-actionsheet>
    <mt-popup v-model="popupSort" position="bottom" style="height:140px">
      <div data-v-1fca5e37 class="mint-actionsheet" id="Actionsheet" style>
        <ul class="mint-actionsheet-list" style="margin-bottom: 5px;">
          <li
            class="mint-actionsheet-listitem"
            :style="`color:${sortFile?'#0089ff':''}`"
            @click="sortfileFn(arrZhiyuan)"
          >按文件名称排序</li>
          <li
            class="mint-actionsheet-listitem"
            :style="`color:${sortTime?'#0089ff':''}`"
            @click="sorttimeFn(arrZhiyuan)"
          >按时间倒序排序</li>
        </ul>
        <a class="mint-actionsheet-button" @click="popupSort=false">取消</a>
      </div>
    </mt-popup>
    <!-- <div class="selection-wrap position-fb" v-if="selection">
      <ul class="clearfix">

        <li class="colord fl">
          <span class="iconfont iconbianji1"></span>
          <span class="font-xs">重命名</span>
        </li>
        <li class="colord fl">
          <span class="iconfont iconbianji1"></span>
          <span class="font-xs">移动</span>
        </li>
        <li class="colord fl">
          <span class="iconfont iconbianji1"></span>
          <span class="font-xs">转发</span>
        </li>
        <li class="colord fl">
          <span class="iconfont iconbianji1"></span>
          <span class="font-xs">删除</span>
        </li>
      </ul>
    </div>-->
  </div>
</template>

<script>
const _URL = window.URL || window.webkitURL;
// _URL.createObjectURL(file),
import Vue from "vue";
import { fixCaptureImage } from "../util";
import BottomLoadmore from "@/common/bottom-loadmore";
import {
  Indicator,
  Toast,
  MessageBox,
  TabContainer,
  TabContainerItem,
  Actionsheet,
  Tabbar,
  TabItem
} from "mint-ui";

import BankeFileSimple from "./components/BankeFileSimple";
const Menu = () => import("@/views/bankeZiyuan/menu");
// import Menu from "./bankeZiyuan/menu";
import URL from "./bankeZiyuan/url";
import UpLoadFile from "./bankeZiyuan/upLoadFile";
import AddSuperLink from "./bankeZiyuan/addSuperLink";
import commontools from "../commontools";
import { constants } from "crypto";
import { mapState, mapMutations } from "vuex";
import Audio from "../common/audio";
import {
  CollectionFn,
  getZYFileType,
  preview,
  defaultImg,
  getZYFileTypeIcon,
  filterItem,
  sortLikeWin
} from "@/util";
import nativecode from "../nativecode";
export default {
  name: "BankeZiyuan",
  props: {
    bankeid: {
      default: 0
    },
    hasbackbtn: {
      default: true
    },
    bankename: {
      default: ""
    },
    courseid: {
      default: 0
    },
    cfrom: {
      default: false
    },
    Refresh: {
      default: false
    },
    allBankes: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      curbanke: {},
      selected: "1",
      files: [],
      liststatedesc: "common.Loading",
      list: ["11", "22"],
      loadingState: false,
      popupUploadLink: false,

      popupZiyuanEdit: false,
      popupEditInfo: false,

      UserList: [],
      noViewUserList: [],

      topid: "",
      loadMorePosition: "bottom",
      editItemFile: {},

      seeState: 0,

      actionShow: false,

      filetotal: 0,

      popupAudio: false,
      viewfileItem: {},

      headerName: "",
      rootid: 0,
      headerAddBtn: false,
      headerSortBtn: false,
      popupSuperLink: false,
      popupUploadFile: false,
      tempUploadFile: {},
      tempUploadImg: [],
      newFileName: "",

      selection: false,
      selectnmb: 0,
      dlid: null,

      page: 0,
      pagesize: 10,
      autofill: false,
      topStatus: "",
      bottomStatus: "",

      allLoaded: false,
      loading: false,
      listLoadend: false,

      popupmulu: false,
      mypageState: 0,
      bankeCourseid: 0,

      cMenuItem: {},
      tempmenuData: [],
      sortFile: false,
      sortTime: false,
      showJiaoAn: true,
      menuSelectEndData: null,
      tempScorllTop: [],

      moveId: null,

      popupSort: false,
      // changParentid: false,
      curcfromBanke: {},
      showallbankes: false
    };
  },
  watch: {
    selected() {
      this.$emit("UploadLinkSelectEd", this.selected);
    },
    // popupZiyuanEdit() {
    //   this.$emit("popupZiyuanEdit", this.popupZiyuanEdit);
    // },
    popupEditInfo() {
      this.$emit("popupZiyuanEdit", this.popupEditInfo);
    },
    actionShow(v, o) {
      if (!v) {
        this.headerAddBtn = false;
        this.headerSortBtn = false;
      }
    }
  },
  computed: {
    isteacher() {
      let isteacher = this.$store.getters.caneditbanke;
      return isteacher;
    },
    actions() {
      //       headerAddBtn
      // headerSortBtn
      let objret = [];
      let isteacher = this.$store.getters.caneditbanke;

      if (isteacher || this.cfrom) {
        if (this.headerSortBtn) {
          // objret.push({
          //   name: "按文件名称排序",
          //   method: this.sortfileFn
          // });
          // objret.push({
          //   name: "按时间倒序排序",
          //   method: this.sorttimeFn
          // });
        } else if (this.headerAddBtn) {
          objret.push({
            name: "上传本地文件",
            method: this.onUploadLocal
          });
          objret.push({
            name: "添加网页链接",
            method: this.addLink
          });
          // objret.push({
          //   name: "添加精选网站",
          //   method: this.superLink
          // });
          objret.push({
            name: "新建文件夹",
            method: this.newFolder
          });
        }
        if (!this.headerSortBtn && !this.headerAddBtn) {
          objret.push({
            name: "删除",
            method: this.deletezy
          });
          // objret.push({
          //   name: "编辑",
          //   method: ""
          // });
          objret.push({
            name: "移动",
            method: this.updateItemBtn
          });
        }
      }
      if (!this.headerSortBtn && !this.headerAddBtn) {
        objret.push({
          name: "收藏",
          method: this.Collection
        });
        if (!this.cfrom) {
          objret.push({
            name: "查看情况",
            method: this.showInfo
          });
        }
        // if (nativecode.hassharebanke()) {
        //   objret.push({
        //     name: "转发",
        //     method: this.zhiyuanShare
        //   });
        // }
      }
      console.log("更多反馈了过来", objret);
      return objret;
    },
    fileInfo() {
      for (let v of this.arrZhiyuan) {
        let localfiles = [];
        if (v.info) {
          let arr = [];
          arr[0] = v.info;
          localfiles = arr;
        } else {
          localfiles = [];
        }
        return localfiles;
      }
    },
    showupload() {
      if (nativecode.platform == "exsoftdaping") {
        return true;
      }
      if (this.$store.getters.caneditbanke) {
        return true;
      }
      return false;
    },
    filesempty() {
      if (this.files.length) {
        return false;
      } else {
        if (this.arrZhiyuan.length) {
          return false;
        } else {
          return true;
        }
      }
    },
    arrZhiyuan() {
      return this.$store.state.arrZhiyuan;
    },
    miniprogram() {
      if (nativecode.platform == "miniprogram") {
        return true;
      }
      return false;
    },

    menuName() {
      if (this.tempmenuData.length) {
        return this.tempmenuData[this.tempmenuData.length - 1].name;
      }
      return this.bankename;
    },
    parentid() {
      if (this.tempmenuData.length) {
        return this.tempmenuData[this.tempmenuData.length - 1].id;
      }
      return 0;
    },
    prevStyle() {
      if (this.allLoaded && this.listLoadend && this.tempmenuData.length) {
        return true;
      }
      return false;
    },
    curRootPrevid() {
      if (this.tempmenuData.length) {
        return this.tempmenuData[this.tempmenuData.length - 1].curRootPrevid;
      }
      return null;
    },
    showViewid() {
      if (this.curcfromBanke) {
        return this.curcfromBanke.id;
      }
      return 0;
    }

    // ...mapState(["arrZhiyuan"])
  },
  created() {
    if (this.cfrom) {
      sessionStorage.setItem("cfrom", this.cfrom);
    }
    this.$store.commit("SET_ZHIYUANS", {
      item: [],
      type: 3
    });
    let curbanke = sessionStorage.getItem("curbanke");
    if (curbanke) {
      this.curbanke = JSON.parse(curbanke);
      this.bankeCourseid = this.curbanke.courseid;
    }
    this.loadMoreFile(this.parentid);
    // this.loadMore(this.parentid);
    console.log("cfrom 课程ID", this.courseid);
    console.log("班课的课程ID", this.bankeCourseid);
    console.log("班课ID", this.bankeid);
    if (this.cfrom) {
      this.curcfromBanke = JSON.parse(JSON.stringify(this.allBankes[0]));
    }
  },
  components: {
    BankeFileSimple,
    URL,
    Audio,
    AddSuperLink,
    UpLoadFile,
    BottomLoadmore,
    Menu,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem,
    [Actionsheet.name]: Actionsheet,
    [TabItem.name]: TabItem,
    [Tabbar.name]: Tabbar
  },
  methods: {
    //选择
    selects() {
      this.selection = true;
    },
    //全选
    selectAll() {
      let temp = JSON.parse(JSON.stringify(this.arrZhiyuan));
      for (let v of temp) {
        v.isAct = true;
      }
      this.$store.commit("SET_ZHIYUANS", {
        item: temp,
        type: 3
      });
    },
    //取消多选
    cancelSelect() {
      this.selection = false;
      let temp = JSON.parse(JSON.stringify(this.arrZhiyuan));
      for (let v of temp) {
        v.isAct = false;
      }
      this.$store.commit("SET_ZHIYUANS", {
        item: temp,
        type: 3
      });
    },
    onSelectionClick(fileitem) {
      let temp = JSON.parse(JSON.stringify(this.arrZhiyuan));
      for (let v of temp) {
        if (v.id == fileitem.id) {
          v.isAct = !v.isAct;
        }
      }
      this.$store.commit("SET_ZHIYUANS", {
        item: temp,
        type: 3
      });
    },
    onFolderClick(fitem) {
      let listcontainer = this.$refs.listcontainer;
      let prevTop = listcontainer.scrollTop;
      this.tempScorllTop.push(prevTop);
      let localarrZhiyuan = this.$store.state.arrZhiyuan;
      localarrZhiyuan = JSON.parse(JSON.stringify(localarrZhiyuan));
      this.cMenuItem = fitem;
      this.tempmenuData.push({
        cfrom: true,
        id: fitem.id,
        curRootPrevid: fitem.parentid,
        curRootPrevname: this.menuName,
        name: fitem.name,
        page: this.page,
        allLoaded: this.allLoaded,
        loading: this.loading,
        listLoadend: this.listLoadend,
        datas: localarrZhiyuan
      });
      this.loadTop();
    },
    onPrev() {
      this.$store.commit("SET_ZHIYUANS", {
        item: this.tempmenuData[this.tempmenuData.length - 1].datas,
        type: 3
      });
      this.onprevInitData();
    },
    //收藏
    Collection() {
      let imgIcon = "";
      let cobj = {}; //! cjy: 减少信息； 这里的editItemfile 非常大
      if (this.editItemFile.ftype == "file") {
        let filesize = 0;
        if (this.editItemFile.info && this.editItemFile.info.filesize) {
          filesize = this.editItemFile.info.filesize;
        }
        cobj = {
          url: this.editItemFile.url,
          ftype: "file",
          filesize: filesize
        };
        //console.log(this.editItemFile);
        switch (this.editItemFile.finttype) {
          case 0:
            imgIcon = getZYFileType(this.editItemFile.url);
            break;
          case 1:
            // this.editItemFile.pic = this.editItemFile.localfile[0].imgsrc;
            //  imgIcon = this.editItemFile.localfile[0].imgsrc;
            imgIcon = this.editItemFile.imgsrc;
            break;
          case 2:
            imgIcon = "MP4";
            break;
          case 3:
            imgIcon = "MP3";
            break;
          case 4: //! 文档
            imgIcon = getZYFileType(this.editItemFile.url);
            break;
          default:
            //! iqiqta
            imgIcon = getZYFileType(this.editItemFile.url);
            break;
        }
      } else if (this.editItemFile.ftype == "link") {
        imgIcon = "IT";
        cobj = {
          url: this.editItemFile.url,
          ftype: "link"
        };
      }
      let title = this.editItemFile.name;
      CollectionFn(cobj, 1, imgIcon, this.editItemFile.id, this.bankeid, title);
    },
    oneditclick(fileitem) {
      this.moveId = fileitem.id;
      this.actionShow = true;
      this.editItemFile = fileitem;
      this.dlid = this.editItemFile.id;
      // this.setSeeResources(fileitem);
    },
    // showallBanke() {
    //   this.showallbankes = !this.showallbankes;
    // },
    // select(v) {
    //   if (v.id == this.curcfromBanke.id) return;
    //   this.curcfromBanke = v;
    //   this.showallbankes = false;
    //   this.queryviews(this.editItemFile);
    // },
    queryviews(fileitem) {
      let postdata = {
        id: fileitem.id,
        bankeid: this.bankeid
      };
      if (this.cfrom) {
        postdata.bankeid = this.courseid;
        postdata.banketype = 1;
      }
      this.$http
        .post("api/bankefile/queryviews", postdata)
        .then(res => {
          if ((res.data.code = "0")) {
            console.log("queryviews", res);
            this.noViewUserList = [];
            this.UserList = [];
            this.seeState = 0;
            fileitem.memberids = res.data.data.memberids;
            fileitem.users = res.data.data.users;
            fileitem.views = res.data.data.views;

            fileitem.noviewnum = fileitem.users.length - fileitem.views.length;
            fileitem.noviewnum =
              fileitem.noviewnum > 0 ? fileitem.noviewnum : 0;
          }
          if (fileitem.views.length) {
            for (let v of fileitem.views) {
              for (let item of fileitem.users) {
                if (v.userid == item.id) {
                  v.name = item.name;
                  item.isView = true;
                }
              }
            }
            for (let v of fileitem.users) {
              if (!v.isView) {
                this.noViewUserList.push(v);
                console.log("附件是看的", v);
              }
            }
          } else {
            this.noViewUserList = fileitem.users;
          }
          if (this.noViewUserList.length) {
            this.UserList = this.noViewUserList;
          } else {
            this.seeState = 1;
            this.UserList = fileitem.views;
          }
        })
        .catch(err => {});
    },
    showInfo() {
      this.popupEditInfo = true;
      this.queryviews(this.editItemFile);
    },
    //学生查看or未查看
    see(v, numb) {
      if (!numb) return;
      this.seeState = v;
      if (v == "0") {
        this.UserList = this.noViewUserList;
      } else {
        this.UserList = this.editItemFile.views;
      }
    },
    //设置已阅读资源
    setSeeResources(fileitem) {
      let postdata = {
        bankefileid: fileitem.id,
        classid: this.bankeid
      };
      if (this.cfrom) {
        postdata.classid = this.courseid;
        postdata.banketype = 1;
      }
      this.$http
        .post("api/bankefile/setview", postdata)
        .then(res => {
          if (res.data.code == "0") {
            fileitem.viewnum++;
            fileitem.eventmsgs = false;
          } else {
            // if (fileitem.eventmsgs) {
            //   if (res.data.msg == "not first set view") {
            //     fileitem.eventmsgs = false;
            //     let arrzy = JSON.parse(
            //       JSON.stringify(this.$store.state.arrZhiyuan)
            //     );
            //     this.$store.commit("SET_ZHIYUANS", {
            //       item: serverData,
            //       type: 2
            //     });
            //   }
            // }
          }
        })
        .catch(res => {});
    },
    deletezy() {
      if (!this.$store.getters.caneditbanke && !this.cfrom) {
        Toast("你无权限");
        return;
      }
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          this.$http
            .get("/api/Bankefile/delete?id=" + this.dlid, {})
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("删除成功").then(() => {
                  this.$store.commit("DEL_ZHIYUAN_ITEM", this.dlid);
                });
              } else {
                MessageBox.alert(res.data.msg);
              }

              console.log(res);
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //下载资源
    onviewfile(fileitem) {
      this.setSeeResources(fileitem);
      if (fileitem.ftype == "file") {
        nativecode.fileviewSingle(this, fileitem.info);
      } else if (fileitem.ftype == "link") {
        nativecode.fileviewUrl(this, fileitem);
      }
    },
    parseOneItem(item) {
      if (item.info) {
        item.info = JSON.parse(item.info);
        if (item.info.metainfo && typeof item.info.metainfo == "string") {
          item.info.metainfo = JSON.parse(item.info.metainfo);
        }
      }
    },
    loadTopInit() {
      this.$store.commit("SET_ZHIYUANS", {
        item: [],
        type: 3
      });
      this.files = [];
      this.page = 0;
      this.loading = false;
      this.listLoadend = false;
      this.allLoaded = false;
      let listcontainer = this.$refs.listcontainer;
      this.$nextTick(() => {
        listcontainer.scrollTop = 0;
      });
    },
    loadTop() {
      this.loadTopInit();
      this.loadMore(this.parentid);
    },
    loadMore() {
      this.loading = true;
      this.loadMoreFile(this.parentid);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadMoreFile(parentid) {
      let postData = {
        bankeid: this.bankeid,
        page: this.page,
        pagesize: this.pagesize,
        parentid: this.parentid
      };
      if (this.cfrom) {
        (postData.bankeid = this.courseid), (postData.banketype = 1);
      } else {
        if (this.bankeCourseid) {
          postData.bankeid = this.bankeCourseid;
          postData.banketype = 1;
        }
      }
      if (this.sortTime) {
        postData.ordername = "id";
        postData.order = "asc";
      }
      if (this.sortFile) {
        postData.ordername = "name";
        postData.order = "asc";
      }
      this.$http
        .post("/api/bankefile/querypage", postData)
        .then(res => {
          if (res.data.code == 0) {
            // res.data.data.files[0].ftype = "folder";
            this.filetotal = res.data.data.total;
            if (res.data.data.files.length >= this.pagesize) {
              this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.loading = true;
              this.allLoaded = true;
            }
            console.log("资源", res);
            let ids = [];
            for (let item of res.data.data.files) {
              ids.push(item.id);
              this.parseOneItem(item);
              if (!item.isAct) {
                item.isAct = false;
              }
              if (item.ftype == "link") {
                item.imgsrc = "/assets/file_icon/IT.svg";
              } else if (item.ftype == "file") {
                if (item.finttype == "1") {
                  if (
                    item.info &&
                    item.info.metainfo &&
                    item.info.metainfo.snapsuffix
                  ) {
                    item.imgsrc =
                      item.info.filepath + item.info.metainfo.snapsuffix;
                  } else {
                    item.imgsrc = getZYFileTypeIcon(item.info.filepath);
                  }
                } else {
                  item.imgsrc = getZYFileTypeIcon(item.info.filepath); //commontools.fileType(item.info);
                }
              } else if (item.ftype == "menu") {
                item.imgsrc = "/assets/file_icon/folder.svg";
              }
            }
            // console.log("方式发多少", res.data.data.files);
            this.eventmsgsOnactivity(res.data.data.files, ids);
            if (this.filesempty) {
              this.liststatedesc = "common.No_files";
              this.loadingState = true;
            }
          } else {
            this.loadingState = true;
          }
          this.$refs.loadmore.onTopLoaded();
        })
        .catch(res => {
          this.$refs.loadmore.onTopLoaded();
          console.log(res);
          //! cjy: 这里server 的http code 非200 页会走这里。
          //! 因此不能继续加载
          this.loadingState = true;
        });
    },
    //红点查询
    eventmsgsOnactivity(serverData, eventids) {
      if (serverData.length == 0) {
        return;
      }
      this.$http
        .post("/api/eventmsgs/onactivity", {
          bankeid: this.bankeid,
          eventtype: 1,
          eventids: [...eventids]
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.length) {
            for (let v of serverData) {
              for (let id of res.data.data) {
                if (v.id == id) {
                  v.eventmsgs = true;
                }
              }
            }
          }
          // commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_ZHIYUANS", {
            item: serverData,
            type: 2
          });
        })
        .catch(err => {
          // commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_ZHIYUANS", {
            item: serverData,
            type: 2
          });
        });
    },
    onSort() {
      this.popupSort = true;
      return;
      this.headerSortBtn = true;
      this.actionShow = true;
      this.$nextTick(() => {
        let Actionsheet = document.querySelector(".mint-actionsheet-list");
        console.log("Actionsheet点击", Actionsheet);
      });
    },
    onaddFile() {
      this.headerAddBtn = true;
      this.actionShow = true;
    },
    //文件排序
    sortfileFn(data) {
      if (this.sortFile) return;
      this.sortFile = true;
      this.sortTime = false;
      let temp = JSON.parse(JSON.stringify(data));
      let finalList = temp.sort((a, b) => sortLikeWin(a.name, b.name));
      this.$store.commit("SET_ZHIYUANS", {
        item: finalList,
        type: 3
      });
      this.popupSort = false;
    },
    //时间倒序排序
    sorttimeFn(data) {
      if (this.sortTime) return;
      this.sortTime = true;
      this.sortFile = false;
      let temp = JSON.parse(JSON.stringify(data));
      temp.sort(function(a, b) {
        return a.createtime > b.createtime ? 1 : -1;
      });
      this.$store.commit("SET_ZHIYUANS", {
        item: temp,
        type: 3
      });
      this.popupSort = false;
    },
    //添加网站
    addLink() {
      this.onUploadLink();
    },
    onUploadLink() {
      this.popupUploadLink = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    onAddLinkState(state) {
      if (state) {
        this.popupUploadLink = false;
        this.selected = "1";
      }
    },
    //添加精选网站
    superLink() {
      this.popupSuperLink = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    //新建文件夹
    newFolder() {
      var url = "/api/bankefile/menuadd?parentid=" + this.parentid;
      if (this.cfrom) {
        url += "&bankeid=" + this.courseid + "&banketype=" + 1;
      } else {
        url += "&bankeid=" + this.bankeid;
      }
      MessageBox.prompt("请输入文件名").then(({ value, action }) => {
        this.newFileName = value;
        Indicator.open("创建中...");
        this.$http
          .post(url, {
            name: this.newFileName
          })
          .then(res => {
            if (res.data.code == "0") {
              let item = res.data.data;
              item.imgsrc = "/assets/file_icon/folder.svg";
              let arr = [];
              arr[0] = res.data.data;
              this.$store.commit("SET_ZHIYUANS", {
                item: arr,
                type: 1
              });
            } else {
              Toast("创建失败");
            }
            Indicator.close();
          })
          .catch(err => {
            Toast("服务连接失败");
            Indicator.close();
          });
      });
    },
    onWatchBack() {
      this.popupSuperLink = false;
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    },
    //上传本地文件btn
    onUploadLocal() {
      this.$refs.uploadfilebtn.value = "";
      this.$refs.uploadfilebtn.click();
    },
    //上传文件
    uploadChange(event) {
      // if (event.target.files.length >= 6) {
      //   MessageBox.alert("最多同时上传5个文件");
      //   return;
      // }
      if (event.target.files.length > 0) {
        var file = event.target.files;
        //! cjy: 大小限制？
        console.log("原文件", file);
        for (let i = 0; i < file.length; i++) {
          let _filesize = file[i].size;
          if (_filesize / (1024 * 1024) > 300) {
            MessageBox({
              title: "提示",
              message: `<p>${file[i].name}</p>
              <p>此文件大小超过上限，建议小于300M</p>`,
              showCancelButton: true
            });
            continue;
          }
          this.douploadonefile(file[i]);
        }
      }
    },
    douploadonefile(onefile) {
      let type = onefile.type;
      if (type.indexOf("image") > -1) {
        //! cjy: 因为可能选择手机照片； 而手机照片可能很大（10M-30M），且带旋转， 因此这里需要处理
        fixCaptureImage(onefile, true)
          .then(res => {
            this.goUploadInitpage(res);
          })
          .catch(err => {
            this.goUploadInitpage(res);
          });
      } else {
        this.goUploadInitpage(onefile);
      }
    },
    goUploadInitpage(file) {
      this.tempUploadFile = {
        file: file,
        tempImg: _URL.createObjectURL(file)
      };
      if (!this.popupUploadFile) {
        this.popupUploadFile = true;
      }
    },
    goBack() {
      if (this.popupAudio) {
        this.popupAudio = false;
        this.$store.commit("SET_FOOTER_BAR_STATE", true);
      }
      if (this.popupSuperLink) {
        this.popupSuperLink = false;
        this.$store.commit("SET_FOOTER_BAR_STATE", true);
      }
      if (this.popupUploadFile) {
        this.popupUploadFile = false;
        this.tempUploadFile = {};
      }
      if (this.popupEditInfo) {
        this.popupEditInfo = false;
        this.showallbankes = false;
      }
    },
    backHome() {
      if (this.cfrom) {
        this.$emit("calce", true);
      } else {
        if (this.miniprogram) {
          this.$router.replace("/");
        } else {
          if (this.Refresh) {
            this.$router.replace("/");
          } else {
            this.$router.go(-1);
          }
        }
      }
    },
    //教案
    jiaoan() {
      this.showJiaoAn = false;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
    },
    updateItemBtn() {
      this.popupmulu = true;
    },
    updateItem() {
      let parentid = this.parentid;
      if (this.menuSelectEndData) {
        parentid = this.menuSelectEndData.parentid;
      }
      Indicator.open("正全速移动...");
      this.$http
        .post("/api/bankefile/updatefile", {
          id: this.editItemFile.id,
          parentid: parentid
        })
        .then(res => {
          if (res.data.code == "0") {
            let curzhiyuans = this.arrZhiyuan;
            curzhiyuans = curzhiyuans.filter(item => {
              return item.id != this.editItemFile.id;
            });
            this.$store.commit("SET_ZHIYUANS", {
              item: curzhiyuans,
              type: 3
            });
            Toast("移动成功");
          } else {
            Toast("移动失败");
          }
          Indicator.close();
          this.popupmulu = false;
        })
        .catch(err => {
          Toast("连接服务失败");
          Indicator.close();
          this.popupmulu = false;
        });
    },
    onMenuSelectEnd(v) {
      this.menuSelectEndData = v;
      this.updateItem();
    },
    onCancel(v) {
      this.popupmulu = false;
      this.menuSelectEndData = null;
    },
    onprevInitData() {
      let listcontainer = this.$refs.listcontainer;
      this.page = this.tempmenuData[this.tempmenuData.length - 1].page;
      this.allLoaded = this.tempmenuData[
        this.tempmenuData.length - 1
      ].allLoaded;
      this.loading = this.tempmenuData[this.tempmenuData.length - 1].loading;
      this.listLoadend = this.tempmenuData[
        this.tempmenuData.length - 1
      ].listLoadend;
      this.tempmenuData.splice(this.tempmenuData.length - 1, 1);
      this.$nextTick(() => {
        listcontainer.scrollTop = this.tempScorllTop[
          this.tempScorllTop.length - 1
        ];
        this.tempScorllTop.splice(this.tempScorllTop.length - 1, 1);
      });
    }

    // onsubmitUpload() {
    //   this.douploadonefiledirect(this.tempUploadFile.file);
    // },
    // douploadonefiledirect(onefile) {
    //   console.log("上传照片", onefile);
    //   if (!onefile) {
    //     console.log("上传照片 失败");
    //     return;
    //   }
    //   var formdata = new FormData();
    //   formdata.append("file", onefile);
    //   let parentid = this.parentid;
    //   if (this.selectMenuItem) {
    //     parentid = this.selectMenuItem.id;
    //   }
    //   var url = "/api/bankefile/fileupload?parentid=" + parentid;
    //   if (this.cfrom) {
    //     url += "&bankeid=" + this.courseid + "&banketype=" + 1;
    //   } else {
    //     url += "&bankeid=" + this.bankeid;
    //   }

    //   Indicator.open(this.$t("Indicator.Uploading"));

    //   this.$http({
    //     url: url,
    //     method: "post",
    //     data: formdata,
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" }
    //   })
    //     .then(res => {
    //       Indicator.close();
    //       if (res.data.code == 0) {
    //         console.log("54", res.data.data);
    //         this.parseOneItem(res.data.data);
    //         let item = res.data.data;
    //         if (item.ftype == "link") {
    //           item.imgsrc = "/assets/file_icon/IT.svg";
    //         } else if (item.ftype == "file") {
    //           if (item.finttype == "1") {
    //             if (
    //               item.info &&
    //               item.info.metainfo &&
    //               item.info.metainfo.snapsuffix
    //             ) {
    //               item.imgsrc =
    //                 item.info.filepath + item.info.metainfo.snapsuffix;
    //             }
    //           } else {
    //             item.imgsrc = getZYFileTypeIcon(item.info.filepath);
    //           }
    //         }
    //         commontools.arrayMergeAsIds(this.files, res.data.data);
    //         //  res.data.data.info = JSON.parse(res.data.data.info);
    //         let arr = [];
    //         arr[0] = res.data.data;
    //         this.$store.commit("SET_ZHIYUANS", {
    //           item: arr,
    //           type: 1
    //         });

    //         this.tempUploadFile = {};
    //         this.popupUploadFile = false;
    //       } else {
    //         Toast("上传失败");
    //       }
    //     })
    //     .catch(err => {
    //       Indicator.close();
    //       console.log(err);
    //     });
    // },

    // ...mapMutations(["SET_ZHIYUANS"])
  },
  destroyed: function() {
    sessionStorage.removeItem("curbanke");
  }
};
</script>

<style scoped>
.mint-tabbar > .mint-tab-item.is-selected {
  background: none;
}
.loadmore {
  min-height: 200px;
}

.uploadtabbar {
  background: #fff;
  position: static;
}
.uploadimgsize {
  width: 35px;
  height: 35px;

  margin-bottom: 2px;
}

.uploadtabbar img {
  border-radius: 50%;
}

.uploadpart {
}
.listcontainer {
  position: relative;
  height: 100%;
  border-top: 1px solid #eaeaea;
}
.listcontainer-wrap {
  height: calc(100vh - 190px);
  min-height: calc(100vh - 190px);
  position: relative;
}
.listcontainer-wrap .listcontainer .wrap {
  min-height: calc(100vh - 190px);
}

.listcontainer-wrap.showupload {
  height: calc(100vh - 190px);
  min-height: calc(100vh - 190px);
  position: relative;
}
.listcontainer-wrap.showupload .listcontainer .wrap {
  min-height: calc(100vh - 190px);
}

.listcontainer-wrap.cfrom {
  height: calc(100vh - 114px);
  min-height: calc(100vh - 114px);
  position: relative;
}
.listcontainer-wrap.cfrom .listcontainer .wrap {
  min-height: calc(100vh - 114px);
}

.listcontainer-wrap .listcontainer .wrap.prev {
  padding-bottom: 64px;
}
.listcontainer-wrap .listcontainer {
  overflow: scroll;
}
</style>
<style lang="less" scoped>
.url-wrap {
  .btn-wrap {
    position: relative;
    width: 100%;
    height: 60px;
    background: #fff;
    span.showupload {
      font-size: 28px;
    }
    .jiaoan {
      width: 64px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(170, 170, 170, 1);
      border-radius: 4px;
      .btn {
        height: 100%;
        color: #aaaaaa;
        background: #fff;
      }
      .iconfont {
        right: 0;
      }
    }
    .right-wrap {
      &.cfrom {
        width: 100%;
        .sort {
          left: 20px;
        }
        .file {
          right: 0;
        }
      }
      .iconfont {
        font-size: 28px;
      }
    }
  }
  .items-container {
    margin-top: 4px;
    .Resources-total {
      text-align: right;
      background: #fff;
      padding: 8px;
    }
    &.showupload {
      margin-top: 0;
    }
  }
  .edit-container {
    padding: 15px;
    p {
      padding: 0.26667rem 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20px;
      word-break: break-all;
    }
    ul {
      li {
        width: 33%;
        i {
          font-size: 0.8rem;
          background: #e3e3e3;
          border-radius: 50%;
          padding: 8px;
        }
        span {
          display: block;
          margin-top: 10px;
        }
      }
    }
  }
  .info-popup {
    background: #f0f0f0;
    .cfrom-view-header {
      position: relative;
      width: 100%;
      height: 50px;
      .header-wrap {
        position: relative;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: #fff;
        .name {
          i {
            font-size: 26px;
            right: -30px;
            color: #aaa;
          }
        }
      }
      .bankes-wrap {
        position: absolute;
        width: 100%;
        height: 210px;
        top: -160px;
        left: 0;
        background: #fff;
        text-align: center;
        opacity: 0;
        border-top: 1px solid #f0f0f0;
        transition: all 0.2s;
        overflow: auto;
        li {
          height: 53px;
        }
        &.act {
          top: 100%;
          opacity: 1;
          transition: all 0.2s;
          z-index: 9998;
        }
        li {
          width: 100%;
          height: 50px;
          border-bottom: 1px solid #f0f0f0;
          line-height: 50px;
          color: #000;
          font-size: 16px;
          &.act {
            color: #0089ff;
          }
        }
      }
      .v-modal {
        z-index: 9997;
      }
    }
    .info-list-main {
      background: #fff;
      margin-top: 15px;
      .tit-table {
        p {
          padding: 15px 0;
          span {
            width: 50%;
            &.act {
              color: #0089ff;
            }
          }
        }
      }
      .list-content {
        height: 70vh;
        min-height: 70vh;
        li {
          position: relative;
          height: 55px;
          padding: 0 10px;
          border-top: 1px solid #f0f0f0;
          .name {
            width: 73%;
          }
          .score-wrap {
            width: 27%;
            span {
              display: block;
            }
            .time {
            }
            .score {
              color: #ff8900;
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
}
.zhiyan-wrap {
  &.prev {
    margin-top: 61px;
  }
  .icons {
    color: #aaa !important;
    margin: 0 6px;
    font-size: 20px;
  }
  .Prev-btn {
    position: relative;
    width: 100%;
    height: 63px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    line-height: 63px;
    padding-left: 50px;
    .iconfont {
      font-size: 30px;
    }
  }
  .items-container {
    .folder-wrap-item {
      position: relative;
      height: 82px;
      padding: 10px;
      background: #fff;
      border-bottom: 0.02667rem solid #eaeaea;
      > img {
        height: 100%;
      }
      .info-wrap {
        width: calc(100% - 90px);
        height: 100%;
        > p {
          width: 100%;
          .iconfont {
            font-size: 22px;
            right: 4px;
          }
        }
        .name {
          padding-right: 30px;
        }
        .time {
        }
      }
    }
  }
  .selection-wrap {
    z-index: 10000;
    background: #fff;
    padding: 14px 0;
    box-shadow: 0 -3px 5px 0px #ccc;
    ul {
      width: 90%;
      margin: 0 auto;
      li {
        width: 25%;
        text-align: center;
        span {
          display: block;
        }
        .iconfont {
          font-size: 30px;
        }
      }
    }
  }
  .item-wrap {
    position: relative;
  }
  .select-icon {
    width: 35px;
    height: 100%;
    .iconfont {
      color: transparent;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      font-size: 26px;
      &.act {
        color: #ff8900;
        border: none;
      }
    }
  }
}
</style>
<style>
.mint-tab-container-wrap {
  /* height: 100%; */
}
.mint-loadmore.filesempty {
  /* height: 100%; */
}
.mint-loadmore.filesempty .mint-loadmore-content {
  /* position: relative;
  height: 100%; */
}
</style>