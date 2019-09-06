<template>
  <div class="url-wrap">
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
            <div>网页链接</div>
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
          <div class="listcontainer">
            <!--
            -- todo. 更换为 loadmore  ， infite-scroll 操作不当（网络不好时，很容易无限循环请求）
            <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore" class="loadmore"
            >
                <ul>
                    <li v-for="item in list">{{ item }}</li>
                </ul>
            <div slot="top" class="mint-loadmore-top">-->
            <!-- <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span> -->
            <!-- <span v-show="topStatus !== 'loading'" >下拉刷新全部</span>
                    <span v-show="topStatus === 'loading'">Loading...</span>
                </div>
            </mt-loadmore>
            -->

            <div
              v-infinite-scroll="loadMoreFile"
              infinite-scroll-disabled="loadingState"
              infinite-scroll-distance="10"
            >
              <div v-for="(fitem,selindex) in files" v-bind:key="selindex">
                <BankeFileSimple
                  :fileitem="files[selindex]"
                  @editclick="oneditclick"
                  @normalclick="onviewfile"
                ></BankeFileSimple>
              </div>
            </div>
            <div v-if="filesempty" class="tc emptydesc">{{liststatedesc}}</div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <URL/>
        </mt-tab-container-item>

        <mt-tab-container-item id="3" class="text-center">尽请期待...</mt-tab-container-item>
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
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox ,Cell } from "mint-ui";

import BankeFileSimple from "./components/BankeFileSimple";
import URL from "./bankeZY/url";
import commontools from "../commontools";

export default {
  name: "BankeZiyuan",
  props: {
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      selected: "1",
      files: [],
      liststatedesc: "加载中",
      list: ["11", "22"],
      topStatus: "",
      loadingState: false
    };
  },
  watch:{
       selected() {
      this.$emit('UploadLinkSelectEd',this.selected)
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
      }
      return true;
    },
  },
  created() {},
  components: {
    BankeFileSimple,
    URL
  },
  methods: {
    oneditclick(fileitem) {
      Toast("编辑文件, 例如：删除等功能");
    },
    onviewfile(fileitem) {
      //console.log(document.URL);
      //   console.log(document.location);
      //  console.log(window.location.href);
      //   console.log(self.location.href);
      var url = document.location.origin;
      url += fileitem.filepath;
      var desc = "浏览文件，请使用原生实现:";
      desc += url;
      Toast(desc);

      if (window.exsoftTest) {
        window.exsoftTest(fileitem.filepath, fileitem.filename1);
      }
    },
    loadMoreFile() {
      this.loadingState = true;
      var url = "/api/api/bankefilequery?bankeid=" + this.bankeid;
      if (this.files.length) {
        url += "&fileid=" + this.files[this.files.length - 1].id;
      }
      this.$http
        .post(url)
        .then(res => {
          if (res.data.code == 0) {
            commontools.arrayMergeAsIds(this.files, res.data.data);

            if (this.filesempty) {
              this.liststatedesc = "当前没有文件";
            } else {
              if (res.data.data.length) {
                this.loadingState = false; //! 还可继续加载
              }
            }
          } else {
          }
        })
        .catch(res => {
          console.log(res);
          //! cjy: 这里server 的http code 非200 页会走这里。
          //! 因此不能继续加载
          // this.loadingState = true;
        });
    },
    loadTop() {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 3000);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    onUploadLocal() {
      //  Toast('暂未实现');
      this.$refs.uploadfilebtn.value = "";
      this.$refs.uploadfilebtn.click();
    },
    onUploadLink() {
        // this.$emit('UploadLinkSelectEd',this.selected)
      Toast("暂未实现");
    },
    onUploadServer() {
      Toast("暂未实现");
    },
    uploadChange(event) {
      if (event.target.files.length > 0) {
        var file = event.target.files[0];

        //! cjy: 大小限制？
        console.log(file);

        var formdata = new FormData();
        formdata.append("file", file);

        var url = "/api/api/bankeupload?";
        url += "bankeid=" + this.bankeid;

        Indicator.open("上传中");

        this.$http({
          url: url,
          method: "post",
          data: formdata,
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
          .then(res => {
            console.log(res);
            Indicator.close();
            if (res.data.code == 0) {
              commontools.arrayMergeAsIds(this.files, res.data.data);
            }
          })
          .catch(err => {
            Indicator.close();
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped>
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
</style>
<style lang="less" scoped>
.url-wrap{
    .items-container{
        margin-top: 20px;
    }
}
</style>