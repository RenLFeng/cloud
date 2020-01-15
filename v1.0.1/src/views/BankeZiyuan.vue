<template>
  <div class="url-wrap fontsmall">
    <div v-if="showupload" class="uploadpart">
      <mt-tabbar v-model="selected" class="uploadtabbar">
        <mt-tab-item id="1" @click.native="onUploadLocal">
          <div>
            <i class="iconfont iconfont-big iconicon---copy"></i>
            <div>{{$t('bankeZiYuan.Upload_files')}}</div>
            <!--本地上传-->
          </div>
        </mt-tab-item>

        <mt-tab-item id="2" @click.native="onUploadLink">
          <div>
            <i class="iconfont iconfont-big icon80"></i>
            <div>{{$t('bankeZiYuan.WebLink')}} {{bankeZhiYuanLinkItem.id}}</div>
            <!--网页链接-->
          </div>
        </mt-tab-item>
        <!-- <mt-tab-item id="3" @click.native="onUploadServer">
            <div>
              <i class="iconfont iconfont-big iconzhuanyeziyuanku"></i>
              <div>{{$t('bankeZiYuan.Resources_storehouse')}}</div>
            </div>
        </mt-tab-item>-->
      </mt-tabbar>
    </div>
    <div class="items-container">
      <p v-if="bankeZhiYuanLinkItem.length" class="Resources-total fonttiny">资源总数:{{filetotal}}</p>
      <mt-tab-container
        v-model="selected"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false"
      >
        <mt-tab-container-item id="1">
          <div class="listcontainer">
            <div>
              <div v-for="(fitem,selindex) in bankeZhiYuanLinkItem" v-bind:key="selindex">
                <BankeFileSimple
                  :fileitem="bankeZhiYuanLinkItem[selindex]"
                  :index="selindex"
                  :bankeZhiYuanLinkItem="bankeZhiYuanLinkItem"
                  :fileInfo="fileInfo"
                  @editclick="oneditclick"
                  @normalclick="onviewfile"
                ></BankeFileSimple>
              </div>
              <!-- <div v-if="loading &&  bankeZhiYuanLinkItem.length>10" class="tc color9 font-xs">我是有底线的...</div> -->
            </div>
            <div v-if="filesempty" class="tc emptydesc">{{$t(liststatedesc)}}</div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3" class="text-center">{{$t('common.PleaseAwait')}}</mt-tab-container-item>
        <mt-popup v-model="popupUploadLink" position="right" class="popup-right" :modal="false">
          <mt-header :title="$t('common.Add')+' '+$t('bankeZiYuan.WebLink')">
            <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
          </mt-header>
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
    <mt-popup v-model="popupZiyuanEdit" position="bottom" class="edit-container mint-popup-50">
      <div>
        <p>{{editItemFile.name}}</p>
        <ul class="clearfix tc">
          <li class="fl" @click="deletezy()">
            <i class="iconfont iconshanchu"></i>
            <span>删除</span>
          </li>
          <li class="fl" @click="showInfo()">
            <i class="iconfont iconxinxi"></i>
            <span>信息</span>
          </li>
        </ul>
      </div>
    </mt-popup>
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
            <span class="fl">{{item.name}}</span>
            <span class="fr">
              <span class="time fonttiny">{{item.countdate}}</span>
              <span v-if="item.score" class="score fr">得分&nbsp;{{item.score}}</span>
              <span v-else class="score fr">未得分</span>
            </span>
          </li>
        </ul>
      </div>
    </mt-popup>
    <mt-popup v-model="popupAudio" position="right" class="popup-right info-popup" :modal="false">
      <Audio :AudioiInfo="viewfileItem.info" @Backs="goBack" v-if="popupAudio" />
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import Vue from "vue";
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
import URL from "./bankeZY/url";
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
    }
  },
  data() {
    return {
      selected: "1",
      files: [],
      liststatedesc: "common.Loading",
      list: ["11", "22"],
      topStatus: "",
      loadingState: false,
      popupUploadLink: false,
      popupUploadZhiYuan: false,
      popupUploadFile: true,
      popupZiyuanEdit: false,
      popupEditInfo: false,

      UserList: [],
      noViewUserList: [],

      topid: "",
      autofill: false,
      loadMorePosition: "bottom",
      editItemFile: {},

      seeState: 0,

      actions: [
        {
          name: "收藏",
          method: this.Collection
        },
        {
          name: "信息",
          method: this.showInfo
        },
        {
          name: "删除",
          method: this.deletezy
        }
      ],
      actionShow: false,

      page: 0,
      pagesize: 10,
      filetotal: 0,

      loading: false,

      popupAudio: false,
      viewfileItem: {}
    };
  },
  watch: {
    selected() {
      this.$emit("UploadLinkSelectEd", this.selected);
    },
    popupZiyuanEdit() {
      this.$emit("popupZiyuanEdit", this.popupZiyuanEdit);
    },
    popupEditInfo() {
      this.$emit("popupZiyuanEdit", this.popupEditInfo);
    }
  },
  computed: {
    isteacher() {
      let isteacher = this.$store.getters.caneditbanke;
      return isteacher;
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
    this.$store.commit("SET_BANKEZHIYUANLINKITEM");
    // this.loadMoreFile();
    this.loadMore();
  },
  components: {
    BankeFileSimple,
    URL,
    Audio
  },
  methods: {
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
      if (!this.isteacher) {
        this.actions = filterItem(this.actions, "name", ["删除"]);
      }
      this.actionShow = true;
      this.editItemFile = fileitem;
      this.setSeeResources(fileitem);
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
            this.editItemFile.users = res.data.data.users;
            this.editItemFile.memberids = res.data.data.memberids;
            this.editItemFile.views = res.data.data.views;
            this.editItemFile.noviewnum =
              this.editItemFile.memberids.length -
              this.editItemFile.views.length;
          }
          if (this.editItemFile.views.length) {
            for (let v of this.editItemFile.views) {
              for (let item of this.editItemFile.users) {
                if (v.userid == item.id) {
                  v.name = item.name;
                  item.isView = true;
                }
              }
            }
            for (let v of this.editItemFile.users) {
              if (!v.isView) {
                this.noViewUserList.push(v);
              }
            }
          } else {
            this.noViewUserList = this.editItemFile.users;
          }
          if (this.noViewUserList.length) {
            this.UserList = this.noViewUserList;
          } else {
            this.seeState = 1;
            this.UserList = this.editItemFile.views;
          }
          console.log("editItemFile", this.editItemFile);
          console.log("noViewUserList", this.noViewUserList);
        })
        .catch(err => {});
    },
    deletezy() {
      if (!this.caneditbanke) {
        Toast("你无权限");
        return;
      }
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          this.$http
            .get("/api/Bankefile/delete?id=" + this.editItemFile.id, {})
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("删除成功").then(() => {
                  this.$store.commit(
                    "DELECT_BANKEZHIYUANLINKITEM",
                    this.editItemFile.id
                  );
                  this.popupZiyuanEdit = false;
                });
              } else {
                MessageBox.alert(res.data.msg);
                this.popupZiyuanEdit = false;
              }

              console.log(res);
            })
            .catch(() => {
              this.popupZiyuanEdit = false;
            });
        })
        .catch(() => {
          this.popupZiyuanEdit = false;
        });
    },
    showInfo() {
      this.popupEditInfo = true;
      this.popupZiyuanEdit = false;
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
    //下载资源
    onviewfile(fileitem) {
      this.setSeeResources(fileitem);
      if (fileitem.ftype == "file") {
        if (fileitem.finttype == "3") {
          this.viewfileItem = fileitem;
          this.$store.commit("SET_FOOTER_BAR_STATE", false);
          this.popupAudio = true;
        } else {
          nativecode.fileviewSingle(this, fileitem.info);
        }
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
    loadMore() {
      this.loading = true;
      this.loadMoreFile();
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
            if (res.data.data.files.length >= 10) {
              this.loadingState = true;
              this.loading = false;
            } else {
              this.loading = true;
            }
            console.log("success", res);
            let ids = [];
            for (let item of res.data.data.files) {
              ids.push(item.id);
              this.parseOneItem(item);
              if (item.ftype == "link") {
                item.imgsrc = require("../assets/file_icon/IT.svg");
              } else if (item.ftype == "file") {
                if (item.finttype == "1") {
                  if (item.info) {
                    item.imgsrc =
                      item.info.filepath + item.info.metainfo.snapsuffix;
                  } else {
                    item.imgsrc = getZYFileTypeIcon(item.info.filepath);
                  }
                } else {
                  item.imgsrc = getZYFileTypeIcon(item.info.filepath); //commontools.fileType(item.info);
                }
              }
            }
            this.page++;
            console.log("dsad", res.data.data);
            this.eventmsgsOnactivity(res.data.data.files, ids);
            // commontools.arrayMergeAsIds(this.files, res.data.data);
            // this.$store.commit("SET_BANKEZHIYUANLINKITEM", this.files);
            // console.log(" this.files", this.files);
            if (this.filesempty) {
              this.liststatedesc = "common.No_files";
              this.loadingState = true;
            }
          } else {
            this.loadingState = true;
          }
        })
        .catch(res => {
          console.log(res);
          //! cjy: 这里server 的http code 非200 页会走这里。
          //! 因此不能继续加载
          this.loadingState = true;
        });
    },
    //红点查询
    eventmsgsOnactivity(serverData, eventids) {
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
          } else {
          }
          commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_BANKEZHIYUANLINKITEM", this.files);
          console.log("红点查询", this.files);
        })
        .catch(err => {
          commontools.arrayMergeAsIds(this.files, serverData);
          this.$store.commit("SET_BANKEZHIYUANLINKITEM", this.files);
        });
    },
    onUploadLocal() {
      this.popupUploadFile = true;
      //  Toast('暂未实现');
      this.$refs.uploadfilebtn.value = "";
      this.$refs.uploadfilebtn.click();
    },
    onUploadLink() {
      this.popupUploadLink = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
      // this.$emit('UploadLinkSelectEd',this.selected)
      // Toast("暂未实现");
    },
    onUploadServer() {
      this.popupUploadZhiYuan = true;
      // Toast("暂未实现");
    },
    uploadChange(event) {
      if (event.target.files.length >= 6) {
        MessageBox.alert("最多同时上传5个文件");
        return;
      }
      if (event.target.files.length > 0) {
        var file = event.target.files;
        //! cjy: 大小限制？
        console.log("00000000", file);
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
          var formdata = new FormData();
          formdata.append("file", file[i]);

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
                  item.imgsrc = require("../assets/file_icon/IT.svg");
                } else if (item.ftype == "file") {
                  if (item.finttype == "1") {
                    if (item.info) {
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
                this.$store.commit("SET_BANKEZHIYUANLINKITEM", arr);
              }
            })
            .catch(err => {
              Indicator.close();
              console.log(err);
            });
        }
      }
    },
    onAddLinkState(state) {
      if (state) {
        this.popupUploadLink = false;
        this.selected = "1";
      }
    },
    goBack() {
      if (this.popupUploadLink) {
        this.popupUploadLink = false;
        this.selected = "1";
        this.$store.commit("SET_FOOTER_BAR_STATE", true);
      }
      if (this.popupAudio) {
        this.popupAudio = false;
        this.$store.commit("SET_FOOTER_BAR_STATE", true);
      }
      if (this.popupUploadZhiYuan) {
        this.popupUploadZhiYuan = false;
      }
      if (this.popupUploadFile) {
        this.popupUploadFile = false;
      }
      if (this.popupEditInfo) {
        //  this.popupZiyuanEdit = false;
        this.popupEditInfo = false;
      }
      // this.popupUploadFile=true;
    }
    // ...mapMutations(["SET_BANKEZHIYUANLINKITEM"])
  }
};
</script>

<style scoped>
.mint-tab-container {
  height: 75vh;
  min-height: 75vh;
  overflow-y: auto;
}
.mint-tabbar > .mint-tab-item.is-selected {
  background: none;
}
.loadmore {
  min-height: 200px;
}

.uploadtabbar {
  position: static;
}

.emptydesc {
  margin-top: 50px;
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
  border-top: 1px solid #eaeaea;
}
.url-wrap .items-container {
  margin-bottom: 17px;
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
          padding: 15px;
          border-top: 1px solid #f0f0f0;
          .time {
          }
        }
        .score {
          color: #ff8900;
          width: 75px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>