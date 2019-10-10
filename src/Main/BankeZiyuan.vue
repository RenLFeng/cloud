<template>
  <mt-loadmore
    :top-method="loadTop"
    :bottom-method="loadBottom"
    ref="loadmore"
    :auto-fill="autofill"
    :bottom-all-loaded="loadingState"
  >
    <div class="url-wrap fontsmall">
      <div v-if="showupload" class="uploadpart">
        <mt-tabbar v-model="selected" class="uploadtabbar">
          <mt-tab-item id="1" @click.native="onUploadLocal">
            <div>
              <i class="iconfont iconfont-big iconicon---copy"></i>
              <div>从本地上传</div>
            </div>
          </mt-tab-item>

          <mt-tab-item id="2" @click.native="onUploadLink">
            <div>
              <i class="iconfont iconfont-big icon80"></i>
              <div>网页链接 {{bankeZhiYuanLinkItem.id}}</div>
            </div>
          </mt-tab-item>
          <mt-tab-item id="3" @click.native="onUploadServer">
            <div>
              <i class="iconfont iconfont-big iconzhuanyeziyuanku"></i>
              <div>资源库</div>
            </div>
          </mt-tab-item>
        </mt-tabbar>
      </div>
      <div class="items-container">
        <mt-tab-container class v-model="selected">
          <mt-tab-container-item id="1">
            <!-- v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loadingState"
            infinite-scroll-distance="50"-->
            <div class="listcontainer">
              <div>
                <div v-for="(fitem,selindex) in bankeZhiYuanLinkItem" v-bind:key="selindex">
                  <BankeFileSimple
                    :fileitem="bankeZhiYuanLinkItem[selindex]"
                    @editclick="oneditclick"
                    @normalclick="onviewfile"
                  ></BankeFileSimple>
                </div>
              </div>
              <div v-if="filesempty" class="tc emptydesc">{{liststatedesc}}</div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="3" class="text-center">尽请期待...</mt-tab-container-item>
          <mt-popup v-model="popupUploadLink" position="right" class="popup-right" :modal="false">
            <mt-header title="添加网页链接">
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
    </div>
  </mt-loadmore>
</template>

<script>
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";

import BankeFileSimple from "./components/BankeFileSimple";
import URL from "./bankeZY/url";
import commontools from "../commontools";
import { constants } from "crypto";
import { mapState, mapMutations } from "vuex";
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
      liststatedesc: "加载中",
      list: ["11", "22"],
      topStatus: "",
      loadingState: false,
      popupUploadLink: false,
      popupUploadZhiYuan: false,
      popupUploadFile: true,
      topid: "",
      autofill: false,
      loadMorePosition: "bottom"
    };
  },
  watch: {
    selected() {
      this.$emit("UploadLinkSelectEd", this.selected);
    }
  },
  computed: {
    showupload() {
      if (this.$store.getters.isteacher) {
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
    this.loadMoreFile();
  },
  components: {
    BankeFileSimple,
    URL
  },
  methods: {
    loadTop() {
      this.$store.commit("SET_BANKEZHIYUANLINKITEM");
      this.loadMorePosition = "top";
      this.loadMoreFile();
    },
    loadBottom() {
      this.loadMorePosition = "bottom";
      this.loadMoreFile();
    },
    // topStateChange(status) {
    //    this.topStatus = status;
    // },
    // bottomStateChange(status) {
    //    this.topStatus = status;
    // },
    oneditclick(fileitem) {
      MessageBox.confirm("您确定要删除吗？").then(res => {
        this.$http
          .get("/api/Bankefile/delete?id=" + fileitem.id, {})
          .then(res => {
            if (res.data.code == 0) {
              MessageBox.alert("删除成功").then(() => {
                this.$store.commit("DELECT_BANKEZHIYUANLINKITEM", fileitem.id);
              });
            } else {
              MessageBox.alert(res.data.msg);
            }
            console.log(res);
          })
          .catch(() => {});
      });
    },
    onviewfile(fileitem) {
      console.log(fileitem);
      if (fileitem.ftype == "file") {
        MessageBox.confirm("您可以下载当前文件!").then(res => {
          let down = document.createElement("a");
          let prefix = process.env.VUE_APP_HOST || "http://192.168.0.2:81";
          down.href = prefix + fileitem.url;
          down.download = fileitem.name;
          document.body.appendChild(down);
          down.click();
          down.remove();
        });
      }
      //   console.log(document.location);
      //  console.log(window.location.href);
      //   console.log(self.location.href);
      // var url = document.location.origin;
      // url += fileitem.filepath;
      // var desc = "浏览文件，请使用原生实现:";
      // desc += url;
      // Toast(desc);

      if (window.exsoftTest) {
        window.exsoftTest(fileitem.filepath, fileitem.filename1);
      }
    },
    loadMore() {
      if (this.files.length >= 10) {
        this.loadMoreFile();
      }
    },
    loadMoreFile() {
      let url = "";
      if (this.topid && this.loadMorePosition == "bottom") {
        url =
          "/api/bankefile/query?bankeid=" +
          this.bankeid +
          "&topid=" +
          this.topid +
          "&pagesize=10";
      } else {
        url = "/api/bankefile/query?bankeid=" + this.bankeid + "&pagesize=10";
      }
      this.$http
        .get(url)
        .then(res => {
          if (this.topid && this.loadMorePosition == "bottom") {
            this.$refs.loadmore.onBottomLoaded();
          } else if (this.loadMorePosition == "top") {
            this.$refs.loadmore.onTopLoaded();
          }
          if (res.data.code == 0) {
            if (res.data.data.length < 10) {
              this.loadingState = true;
            }
            for (let item of res.data.data) {
              if (item.info) {
                item.info = JSON.parse(item.info);
              }
            }
            commontools.arrayMergeAsIds(this.files, res.data.data);
            this.$store.commit("SET_BANKEZHIYUANLINKITEM", this.files);
            if (this.filesempty) {
              this.liststatedesc = "当前没有文件";
              this.loadingState = true;
            } else {
              if (res.data.data.length) {
                this.topid = this.files[this.files.length - 1].id;
              }
            }
          } else {
          }
        })
        .catch(res => {
          console.log(res);
          //! cjy: 这里server 的http code 非200 页会走这里。
          //! 因此不能继续加载
          this.loadingState = true;
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
      // this.$emit('UploadLinkSelectEd',this.selected)
      // Toast("暂未实现");
    },
    onUploadServer() {
      this.popupUploadZhiYuan = true;
      // Toast("暂未实现");
    },
    uploadChange(event) {
      if (event.target.files.length > 0) {
        var file = event.target.files;
        //! cjy: 大小限制？
        console.log(file);
        for (let item of file) {
          var formdata = new FormData();
          formdata.append("file", item);

          var url = "/api/bankefile/fileupload?";
          url += "bankeid=" + this.bankeid;

          Indicator.open("上传中");

          this.$http({
            url: url,
            method: "post",
            data: formdata,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          })
            .then(res => {
              Indicator.close();
              if (res.data.code == 0) {
                commontools.arrayMergeAsIds(this.files, res.data.data);
                res.data.data.info = JSON.parse(res.data.data.info);
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
      }
      if (this.popupUploadZhiYuan) {
        this.popupUploadZhiYuan = false;
      }
      if (this.popupUploadFile) {
        this.popupUploadFile = false;
      }
      // this.popupUploadFile=true;
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
  position: static;
}

.emptydesc {
  margin-top: 50px;
}

.uploadimgsize {
  width: 35px;
  heigth: 35px;

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
    margin-top: 20px;
  }
}
</style>