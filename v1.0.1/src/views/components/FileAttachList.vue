<template>
  <div class="flist-container" id="content">
    <ul class="flist-ul">
      <li
        v-for="(fitem, findex) in localfiles"
        :key="findex"
        class="imgblock"
        :class="{'liupload':isupload,'imgblocksmall':!isupload}"
      >
        <div class="imgcontainer blockborder" @click.stop="onImagePreview(localfiles,findex)">
          <img v-if="fitem.imgsrc" :src="fitem.imgsrc" :class="getimgclass(fitem)" />
          <img v-else :src="getimgico(fitem)" :onerror="getimgico(fitem)" class="iconclass" />
        </div>

        <div v-if="uploadstate(findex)" class="uploadbg">
          <div class="midtext">{{updatestatedesc(findex)}}</div>
        </div>
        <div v-else-if="isupload" class="uploadbg uploadbgtransparent"></div>

        <div v-if="isupload" class="delbtn" @click="delfileindex(findex)">
          <div class="delbtntext">x</div>
        </div>
      </li>
      <li v-if="isupload" class="imgblock liupload">
        <div class="blockborder" @click="onbtnupload">
          <div class="imgblocktext textadd">+</div>
        </div>
      </li>
    </ul>
    <input
      ref="uploadfilebtn"
      type="file"
      name="file"
      multiple
      @change="uploadChange"
      style="display:none"
    />
  </div>
</template>
<script>
import Vue from "vue";
import "@vant/touch-emulator/index";
import commontools from "../../commontools";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import { Indicator, Toast, MessageBox } from "mint-ui";
import nativecode from "../../nativecode";
Vue.use(ImagePreview);
export default {
  name: "FileAttachList",
  data() {
    return {
      curUploadingFile: null,
      inDestroy: false,
      show: false,
      index: 0,
      isLoad: false,
      tempLocalfiles: [],
      tempImgs: [],
      popupDownLoad: false
    };
  },
  props: {
    isupload: {
      default() {
        return true;
      },
      required: false
    },
    localfiles: {
      default() {
        return [];
      },
      required: false
    },
    urlinfo: {
      default() {
        return {
          urlupload: "",
          urldel: "",
          isuploading: false
        };
      },
      required: false
    }
  },
  computed: {
    isFile() {
      if (
        !this.$store.state.isPreview &&
        this.tempLocalfiles.length &&
        !this.tempLocalfiles[this.index].imgsrc
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  destroyed() {
    this.inDestroy = true;
    this.cancelAllUpload();
  },
  watch: {
    curUploadingFile() {
      if (this.curUploadingFile) {
        this.urlinfo.isuploading = true;
      } else {
        this.urlinfo.isuploading = false;
      }
    }
  },
  mounted() {},
  methods: {
    onImagePreview(item, index) {
      console.log(item);
      this.tempLocalfiles = [];
      this.tempImgs = [];
      let file = item;
      // console.log("filefile", file);
      for (let v of file) {
        if (v.imgsrc) {
          this.tempImgs.push(v.filepath);
        } else {
          v.imgsrc = "";
          this.tempImgs.push(this.getimgico(v));
        }
      }
      if (
        //window.__wxjs_environment === "miniprogram"
        nativecode.platform == "miniprogram"
      ) {
        // console.log(this.tempImgs);
        let wx = nativecode.getwx();
        let imgs = this.tempImgs;
        for (let i = 0; i < imgs.length; i++) {
          imgs[i] = nativecode.getDownUrl2(imgs[i]);
        }
        let i = index;
        let that = this;
        wx.previewImage({
          current: imgs[i], // 当前显示图片的http链接
          urls: imgs, // 需要预览的图片http链接列表
          success(res) {
            console.log("success", res);
          },
          fail(res) {
            console.log("error", res);
          }
        });
      } else {
        this.$store.commit("SET_ISPREVIEW", false);
        this.$store.commit("SET_PREVIEWLOADFILE", item);
        this.$store.commit("SET_IMAGES", this.tempImgs);
        this.$store.commit("SET_INDEX", index);
        this.$store.commit("SET_SHOW", true);
      }
    },
    goBacks() {
      this.popupDownLoad = false;
    },
    onItemClick(fitem) {
      if (!this.isupload) {
        // Toast('文件浏览请使用原生实现:' + fitem.filepath);
        fitem.name = fitem.filename;
        fitem.downurl = nativecode.getDownUrl(fitem.filepath);
        fitem.ftype = "file";
        nativecode.ncall("jsFileLink", fitem);
      }
    },
    uploadstate(findex) {
      //return true;

      if (!this.urlinfo.urlupload) {
        return false; //! 这里不做上传
      }

      var fitem = this.localfiles[findex];

      if (fitem && fitem.uploadState && fitem.uploadState != "success") {
        return true;
      }

      return false;
    },
    getimgclass(fitem) {
      if (fitem.w && fitem.h) {
        if (fitem.w > fitem.h) {
          return "imgclassvertical";
        }
      }
      return "imgclass";
    },
    updatestatedesc(findex) {
      var fitem = this.localfiles[findex];
      if (fitem && fitem.uploadState) {
        if (fitem.uploadState == "wait") {
          return this.$t("bankeTask.Wait_uploading");
        } else if (fitem.uploadState == "fail") {
          return this.$t("bankeTask.Upload_failure");
        } else if (fitem.uploadState == "doing") {
          var s = fitem.uploadProgress;
          s += "%";
          return s;
        }
      }
      return "";
    },
    uploadChange(event) {
      if (event.target.files.length >= 6) {
        MessageBox.alert("最多同时上传5个文件");
        return;
      }
      if (event.target.files.length > 0) {
        var file = event.target.files;
        // console.log(file);
        for (let i = 0; i < file.length; i++) {
          let _filesize = file[i].size;
          if (_filesize / (1024 * 1024) > 300) {
            MessageBox({
              title: "提示",
              message: `<p>${file[i].name}</p>
              <p>此文件大小超上限，建议小于300M</p>`,
              showCancelButton: true
            });
            continue;
          }
          var vo = {};
          vo.file = file[i];
          vo.ftype = commontools.fileGetType(file[i].type);
          vo.mimetype = file[i].type;
          if (vo.ftype == "img") {
            vo.imgsrc = URL.createObjectURL(file[i]);
          }
          vo.filesize = file[i].size;
          vo.filename = file[i].name;
          vo.uploadState = "wait";
          vo.uploadProgress = 0;

          vo.w = vo.h = 0;

          this.localfiles.push(vo);
        }
        this.tryNextUpload();
      }
    },
    cancelAllUpload() {
      for (var i = 0; i < this.localfiles.length; i++) {
        if (this.localfiles[i].uploadCancel) {
          this.localfiles[i].uploadCancel.cancel("cancel by method");
          this.localfiles[i].uploadCancel = null;
        }
      }
      this.curUploadingFile = null;
      this.tryNextUpload();
    },
    tryNextUpload() {
      if (!this.inDestroy) {
        if (this.curUploadingFile == null && this.urlinfo.urlupload) {
          //! 这里只上传wait状态的； 已经上传失败的不再处理
          for (var i = 0; i < this.localfiles.length; i++) {
            if (this.localfiles[i].uploadState == "wait") {
              this.douploadfile(i);
              //   break;
            }
          }
        }
      }
    },
    douploadfile(findex) {
      var fitem = this.localfiles[findex];
      if (fitem && fitem.file) {
        var formdata = new FormData();
        formdata.append("file", fitem.file);

        var CancelToken = this.$http.CancelToken;
        var source = CancelToken.source();

        fitem.uploadCancel = source;

        this.curUploadingFile = fitem;

        fitem.uploadProgress = 0;
        this.$set(fitem, "uploadState", "doing");

        var url = this.urlinfo.urlupload;
        this.$http({
          url: url,
          method: "post",
          onUploadProgress: pevent => {
            this.updateProgress(pevent, fitem);
          },
          cancelToken: source.token,
          data: formdata
        })
          .then(res => {
            if (res.data.code == 0) {
              this.finishUpload(fitem, res.data.data);
            } else {
              this.finishUpload(fitem, false);
            }
          })
          .catch(() => {
            this.finishUpload(fitem, false);
          });
      }
    },
    finishUpload(fitem, bok) {
      fitem.uploadCancel = null;
      if (bok) {
        this.$set(fitem, "uploadState", "success");
        fitem.serverData = bok;
        console.log(bok);
        if (typeof bok.metainfo == "string") {
          bok.metainfo = JSON.parse(bok.metainfo);
        }
        if (bok.metainfo && bok.metainfo.w && bok.metainfo.h) {
          //! 更新宽高， 重新显示图片
          fitem.w = bok.metainfo.w;
          fitem.h = bok.metainfo.h;
        }
      } else {
        this.$set(fitem, "uploadState", "fail");
      }
      if (this.curUploadingFile == fitem) {
        this.curUploadingFile = null;
      }
    },
    updateProgress(pevent, fitem) {
      // console.log(pevent);
      var complete = ((pevent.loaded / pevent.total) * 100) | 0;
      //  console.log(fitem.uploadProgress);
      this.$set(fitem, "uploadProgress", complete);
    },
    getimgico(fitem) {
      return commontools.fileType(fitem);
    },
    getimgnativeico(fitem) {
      console.log(fitem);
      return commontools.fileSnapPath(fitem);
    },
    delfileindex(findex) {
      var tips = this.$t("bankeTask.Delete_file") + " %s？";
      var filename = "";
      if (this.localfiles[findex].filename) {
        filename = this.localfiles[findex].filename;
      }
      tips = commontools.sprintf(tips, filename);

      MessageBox.confirm(tips).then(() => {
        if (this.curUploadingFile == this.localfiles[findex]) {
          this.cancelAllUpload();
        }
        this.localfiles.splice(findex, 1);
      });
    },
    onbtnupload() {
      this.$refs.uploadfilebtn.value = "";
      this.$refs.uploadfilebtn.click();
    }
  }
};
</script>

<style scoped>
.flist-container {
  width: 100%;
  overflow: visible;
}

.flist-ul li {
}

.liupload {
  float: left;
}

.imgblock {
  display: inline-block;
  width: 23vw;
  height: 23vw;
  padding: 5px;

  max-width: 200px;
  max-height: 200px;

  position: static;

  overflow: visible;
}

.imgblocksmall {
  width: 19vw;
  height: 19vw;
  max-width: 80px;
  max-height: 80px;
  /* margin: 0 2vw; */
}

.imgblocktext {
  top: 50%;
  left: 50%;

  position: relative;
  transform: translate(-50%, -50%);
  display: inline-block;
}

.uploadbg {
  font-size: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  float: left;

  position: relative;
  left: 0;
  top: -100%;
}
.uploadbgtransparent {
  background: rgba(0, 0, 0, 0);
}

.imgcontainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.imgclass {
  width: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.imgclassvertical {
  height: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.imgcontainer img {

}

.iconclass {
  width: 100%;
  height: 100%;
}

.textadd {
  font-size: 36px;
  font-weight: bold;
  color: #eaeaea;
}
.blockborder {
  border-radius: 2px;
  width: 100%;
  height: 100%;
}

.delbtn {
  font-size: 16px;
  background-color: black;
  color: white;
  border-radius: 50%;

  position: relative;
  left: 100%;
  top: -200%;
  transform: translate(-50%, -50%);

  display: inline-block;

  width: 20px;
  height: 20px;

  float: left;
}

.delbtntext {
  top: 50%;
  left: 50%;

  position: relative;
  transform: translate(-50%, -50%);
  display: inline-block;
}
.midtext {
  top: 50%;
  left: 50%;

  position: relative;
  transform: translate(-50%, -50%);
  display: inline-block;
}
/* onImagePreview */
</style>