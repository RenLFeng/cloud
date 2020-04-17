<template>
  <div class="url-wrap fontsmall zhiyan-wrap" :class="Previd?'prev':''">
    <mt-header :title="!selection?bankename:`已选择${selectnmb}文件`" class="mint-header-f">
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
    <!-- <p class="Prev-btn" v-if="Previd" @click="onprev">
      <i class="iconfont iconwithdraw-fill colord position-l"></i>
      <span style="color:#a5a5a5">返回上一层...</span>
    </p>-->

    <div v-if="showupload" class="uploadpart">
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
            <div class="fonttiny">{{$t('bankeZiYuan.WebLink')}} {{bankeZhiYuanLinkItem.id}}</div>
          </div>
        </mt-tab-item>
      </mt-tabbar>
    </div>
    <div class="items-container">
      <p v-if="bankeZhiYuanLinkItem.length" class="Resources-total fonttiny">资源总数:{{filetotal}}</p>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item
          id="1"
          class="listcontainer-wrap"
          :class="showupload?'showupload':''"
        >
          <!-- v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="50"
          infinite-scroll-immediate-check="false"-->
          <div class="listcontainer">
            <mt-loadmore
              :top-method="loadTop"
              @top-status-change="handleTopChange"
              :top-distance="120"
              :bottom-method="loadMore"
              @bottom-status-change="handleBottomChange"
              :bottom-all-loaded="allLoaded"
              :bottom-distance="100"
              ref="loadmore"
              class="zyloadmore"
              :class="filesempty?'filesempty':''"
              :auto-fill="autofill"
              :distanceIndex="3"
            >
              <div class="wrap">
                <div
                  v-for="(fitem,selindex) in bankeZhiYuanLinkItem"
                  v-bind:key="selindex"
                  class="item-wrap"
                >
                  <div
                    v-if="fitem.ftype=='folder'"
                    class="folder-wrap-item"
                    @click="onFolderClick(fitem)"
                  >
                    <img
                      class="img object-fit-img position-l;"
                      :src="fitem.imgsrc"
                      :onerror="$defaultImg('')"
                    />
                    <div class="info-wrap position-r">
                      <p class="name ellipse position-t">{{fitem.name}}</p>
                      <p class="time font-xxs colora5 position-b">
                        {{fitem.createtime}}&nbsp;更新
                        <span class="fr">文件夹</span>
                      </p>
                    </div>
                  </div>
                  <BankeFileSimple
                    v-else
                    :fileitem="bankeZhiYuanLinkItem[selindex]"
                    :index="selindex"
                    :bankeZhiYuanLinkItem="bankeZhiYuanLinkItem"
                    :fileInfo="fileInfo"
                    :selection="selection"
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
              </div>
              <div v-if="filesempty" class="tc emptydesc position-c">{{$t(liststatedesc)}}</div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3" class="text-center">{{$t('common.PleaseAwait')}}</mt-tab-container-item>
        <mt-popup
          v-model="popupUploadLink"
          position="right"
          class="popup-right"
          :modal="false"
          style="background:#f0f0f0"
        >
          <URL :bankeid="bankeid" @addLinkState="onAddLinkState" />
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
      multiple
    />
    <mt-popup
      v-model="popupEditInfo"
      position="right"
      class="popup-right info-popup"
      :modal="false"
    >
      <mt-header :title="editItemFile.name">
        <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      </mt-header>
      <BankeFileSimple :fileitem="editItemFile" :seeState="0"></BankeFileSimple>
      <div class="info-list-main">
        <div class="tit-table">
          <p class="clearfix tc">
            <span :class="!seeState?'act fl':'fl'" @click="see(0)">未查看（{{editItemFile.noviewnum}} 人）</span>
            <span :class="seeState?'act fr':'fr'" @click="see(1)">已查看（{{editItemFile.viewnum}}人）</span>
          </p>
        </div>
        <ul class="list-content">
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
    <mt-popup v-model="popupAudio" position="right" class="popup-right info-popup" :modal="false">
      <Audio :audioInfo="viewfileItem.info" @Backs="goBack" v-if="popupAudio" />
    </mt-popup>
    <mt-popup
      v-model="popupSuperLink"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <AddSuperLink v-if="popupSuperLink" :bankeid="bankeid" @watchBack="onWatchBack" />
    </mt-popup>
    <mt-popup
      v-model="popupUploadFile"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="上传资源">
        <mt-button slot="left" @click="goBack()">取消</mt-button>
        <mt-button slot="right" @click="submitUpload">确定</mt-button>
      </mt-header>
      <UpLoadFile
        v-if="popupUploadFile"
        :bankeid="bankeid"
        :tempUploadFile="tempUploadFile"
        @uploadfile="onUploadLocal"
      />
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
    <div class="selection-wrap position-fb" v-if="selection">
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
    </div>
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
  Cell,
  Popup,
  InfiniteScroll,
  Actionsheet
} from "mint-ui";

import BankeFileSimple from "./components/BankeFileSimple";
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
  filterItem
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
    }
  },
  watch: {
    bankename: function(newv, oldv) {
      //  alert(0)
      //   this.headerName=newv;
    }
  },
  data() {
    return {
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

      // loading: false,

      popupAudio: false,
      viewfileItem: {},

      headerName: "",
      rootid: 0,
      Previd: 0,
      headerAddBtn: false,
      headerSortBtn: false,
      popupSuperLink: false,
      popupUploadFile: false,
      tempUploadFile: {},
      tempUploadImg: [],
      newFile: "",

      selection: false,
      selectnmb: 0,
      dlid: null,

      page: 0,
      pagesize: 10,
      autofill: false,
      listLoadend: false,
      topStatus: "",
      bottomStatus: "",
      allLoaded: false,
      dropType: 0
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
      if (isteacher) {
        if (this.headerSortBtn) {
          objret.push({
            name: "按文件名称排序",
            method: this.sortFile
          });
          objret.push({
            name: "按时间倒序排序",
            method: this.sortTime
          });
        } else if (this.headerAddBtn) {
          objret.push({
            name: "上传本地文件",
            method: this.onUploadLocal
          });
          objret.push({
            name: "添加网页链接",
            method: this.addLink
          });
          objret.push({
            name: "添加精选网站",
            method: this.superLink
          });
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
          // objret.push({
          //   name: "移动",
          //   method: ""
          // });
        }
      }
      if (!this.headerSortBtn && !this.headerAddBtn) {
        objret.push({
          name: "收藏",
          method: this.Collection
        });
        objret.push({
          name: "查看情况",
          method: this.showInfo
        });
        // if (nativecode.hassharebanke()) {
        //   objret.push({
        //     name: "转发",
        //     method: this.zhiyuanShare
        //   });
        // }
      }
      return objret;
    },
    fileInfo() {
      for (let v of this.bankeZhiYuanLinkItem) {
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
        if (this.bankeZhiYuanLinkItem.length) {
          return false;
        } else {
          return true;
        }
      }
    },
    bankeZhiYuanLinkItem() {
      return this.$store.state.bankeZhiYuanLinkItem;
    }
    // ...mapState(["bankeZhiYuanLinkItem"])
  },
  created() {
    this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
      item: [],
      type: 0
    });
    this.loadMoreFile();
  },
  components: {
    BankeFileSimple,
    URL,
    Audio,
    AddSuperLink,
    UpLoadFile,
    BottomLoadmore
  },
  methods: {
    //选择
    selects() {
      this.selection = true;
    },
    //全选
    selectAll() {
      let temp = JSON.parse(JSON.stringify(this.bankeZhiYuanLinkItem));
      for (let v of temp) {
        v.isAct = true;
      }
      this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
        item: temp,
        type: 3
      });
    },
    //取消多选
    cancelSelect() {
      this.selection = false;
      let temp = JSON.parse(JSON.stringify(this.bankeZhiYuanLinkItem));
      for (let v of temp) {
        v.isAct = false;
      }
      this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
        item: temp,
        type: 3
      });
    },
    onSelectionClick(fileitem) {
      let temp = JSON.parse(JSON.stringify(this.bankeZhiYuanLinkItem));
      for (let v of temp) {
        if (v.id == fileitem.id) {
          v.isAct = !v.isAct;
        }
      }
      this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
        item: temp,
        type: 3
      });
      // let temp = JSON.parse(JSON.stringify(this.bankeZhiYuanLinkItem));
      // temp[i].isAct = !temp[i].isAct;
      // this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
      //   item: temp,
      //   type: 3
      // });
    },
    //点击文件夹
    onFolderClick(fitem) {
      this.Previd = testData2[0].id;
      this.headerName = testData2[0].name;
    },
    //返回上一级
    onprev() {
      this.Previd = 0;
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
      this.actionShow = true;
      this.editItemFile = fileitem;
      this.dlid = this.editItemFile.id;
      this.setSeeResources(fileitem);
    },
    queryviews(fileitem) {
      this.$http
        .post("api/bankefile/queryviews", {
          id: fileitem.id,
          bankeid: fileitem.bankeid
        })
        .then(res => {
          if ((res.data.code = "0")) {
            console.log("queryviews", res);
            this.noViewUserList = [];
            this.UserList = [];
            this.seeState = 0;

            fileitem.memberids = res.data.data.memberids;
            fileitem.users = res.data.data.users;
            fileitem.views = res.data.data.views;

            fileitem.noviewnum =
              fileitem.memberids.length - fileitem.views.length;
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
    see(v) {
      this.seeState = v;
      if (v == "0") {
        this.UserList = this.noViewUserList;
      } else {
        this.UserList = this.editItemFile.views;
      }
    },
    //设置已阅读资源
    setSeeResources(fileitem) {
      this.$http
        .post("api/bankefile/setview", {
          bankefileid: fileitem.id,
          classid: fileitem.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            fileitem.viewnum++;
            fileitem.eventmsgs = false;
          }
        })
        .catch(res => {});
    },
    deletezy() {
      if (!this.$store.getters.caneditbanke) {
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
                  this.$store.commit("DELECT_BANKEZHIYUANLINKITEM", this.dlid);
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

      // fileitem.downurl = nativecode.getDownUrl(fileitem.url);
      // if (nativecode.ncall("jsFileLink", fileitem)) {
      //   return;
      // }
      // if (fileitem.ftype == "file") {
      //   MessageBox.confirm("您可以下载当前文件!").then(res => {
      //     let down = document.createElement("a");
      //     down.href = fileitem.downurl;
      //     down.download = fileitem.name;
      //     document.body.appendChild(down);
      //     down.click();
      //     down.remove();
      //     return;
      //   });
      // }
      //
      // var desc = "请在正式环境查看";
      // Toast(desc);
      //
      // if (window.exsoftTest) {
      //   window.exsoftTest(fileitem.filepath, fileitem.filename1);
      // }
    },
    parseOneItem(item) {
      if (item.info) {
        item.info = JSON.parse(item.info);
        if (item.info.metainfo && typeof item.info.metainfo == "string") {
          item.info.metainfo = JSON.parse(item.info.metainfo);
        }
      }
    },
    loadTop() {
      this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
        item: [],
        type: 1
      });
      this.page = 0;
      this.listLoadend = false;
      this.allLoaded = false;
      this.dropType = 0;
      this.loadMoreFile();
    },
    loadMore() {
      // this.loading = true;
      this.dropType = 1;
      this.loadMoreFile();
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadMoreFile() {
      this.$http
        .post("/api/bankefile/querypage", {
          bankeid: this.bankeid,
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == 0) {
            this.filetotal = res.data.data.total;
            if (res.data.data.files.length >= this.pagesize) {
              // this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
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
              } else if (item.ftype == "folder") {
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
          if (this.dropType) {
            this.$refs.loadmore.onBottomLoaded();
          } else {
            this.$refs.loadmore.onTopLoaded();
          }
        })
        .catch(res => {
          if (this.dropType) {
            this.$refs.loadmore.onBottomLoaded();
          } else {
            this.$refs.loadmore.onTopLoaded();
          }
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
          commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
            item: serverData,
            type: 2
          });
        })
        .catch(err => {
          commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
            item: serverData,
            type: 2
          });
        });
    },
    onSort() {
      this.headerSortBtn = true;
      this.actionShow = true;
    },
    onaddFile() {
      this.headerAddBtn = true;
      this.actionShow = true;
    },
    //文件排序
    sortFile() {},
    //时间排序
    sortTime() {
      let temp = this.bankeZhiYuanLinkItem;
      temp = temp.reverse(temp);
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
      MessageBox.prompt("请输入文件名").then(({ value, action }) => {
        this.newFile = value;
        alert(this.newFile);
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
      if (event.target.files.length >= 6) {
        MessageBox.alert("最多同时上传5个文件");
        return;
      }
      if (event.target.files.length > 0) {
        var file = event.target.files;
        //! cjy: 大小限制？
        // console.log("00000000", file);
        console.log("upload files:");
        console.log(file);
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
      console.log("douploadonefile:");
      console.log(onefile);
      //! cjy: 因为可能选择手机照片； 而手机照片可能很大（10M-30M），且带旋转， 因此这里需要处理
      fixCaptureImage(onefile, true)
        .then(res => {
          this.douploadonefiledirect(res);
          // this.tempUploadFile = {
          //   file: res,
          //   tempImg: _URL.createObjectURL(res)
          // };
          // console.log("是的撒", this.tempUploadFile);
          // this.popupUploadFile = true;
        })
        .catch(res => {
          this.douploadonefiledirect(res);
          // this.tempUploadFile = {
          //   file: res,
          //   tempImg: _URL.createObjectURL(res)
          // };
          // this.popupUploadFile = true;
        });
    },
    submitUpload() {
      this.douploadonefiledirect(this.tempUploadFile.file);
    },
    douploadonefiledirect(onefile) {
      console.log("douploadfile direct:");
      console.log(onefile);
      if (!onefile) {
        console.log("err file");
        return;
      }
      var formdata = new FormData();
      formdata.append("file", onefile);

      var url = "/api/bankefile/fileupload?";
      url += "bankeid=" + this.bankeid;

      Indicator.open(this.$t("Indicator.Uploading"));

      this.$http({
        url: url,
        method: "post",
        data: formdata,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            console.log("54", res.data.data);
            this.parseOneItem(res.data.data);
            let item = res.data.data;
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
                }
              } else {
                item.imgsrc = getZYFileTypeIcon(item.info.filepath);
              }
            }
            commontools.arrayMergeAsIds(this.files, res.data.data);
            //  res.data.data.info = JSON.parse(res.data.data.info);
            let arr = [];
            arr[0] = res.data.data;
            this.$store.commit("SET_BANKEZHIYUANLINKITEM", {
              item: arr,
              type: 1
            });

            this.tempUploadFile = {};
            this.popupUploadFile = false;
          }
        })
        .catch(err => {
          Indicator.close();
          console.log(err);
        });
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
      }
      if (this.popupEditInfo) {
        this.popupEditInfo = false;
      }
    },
    backHome() {
      this.$router.replace("/");
    }

    // ...mapMutations(["SET_BANKEZHIYUANLINKITEM"])
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
  height: calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  position: relative;
}
.listcontainer-wrap .listcontainer .wrap {
  min-height: calc(100vh - 180px);
}

.listcontainer-wrap.showupload {
  height: calc(100vh - 260px);
  min-height: calc(100vh - 260px);
  position: relative;
}
.listcontainer-wrap.showupload .listcontainer .wrap {
  min-height: calc(100vh - 260px);
}
.listcontainer-wrap .listcontainer {
  overflow: scroll;
}
</style>
<style lang="less" scoped>
.url-wrap {
  .items-container {
    margin-top: 10px;
    .Resources-total {
      text-align: right;
      background: #fff;
      padding: 8px;
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
    position: fixed;
    height: 63px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    line-height: 63px;
    padding-left: 50px;
    z-index: 100;
    top: 49px;
    width: 100%;
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
        }
        .name {
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