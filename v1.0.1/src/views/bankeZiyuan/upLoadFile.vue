<template>
  <div class="uploadfile-wrap">
    <mt-header title="上传资源">
      <mt-button slot="left" @click="canlce()">取消</mt-button>
      <mt-button slot="right" @click="submitUpload">确定</mt-button>
    </mt-header>
    <div class="main">
      <div class="img-wrap">
        <img
          class="img object-fit-img position-l;"
          :src="defaultImg"
          :onerror="$defaultImg('')"
          @click="uploadfile"
        />
      </div>
      <mt-field label="标题" v-model="filename" :disabled="true"></mt-field>
      <mt-cell title="目录" is-link :value="menuEndName" @click.native="queryMulu"></mt-cell>
    </div>
    <mt-popup
      v-model="popupmulu"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <Menu
        :bankeid="bankeid"
        :cfrom="cfrom"
        @Cancel="onCancel"
        @menuSelectEnd="onMenuSelectEnd"
        v-if="popupmulu"
        :parentid="parentid"
        :headerName="headerName"
      />
    </mt-popup>
  </div>
</template>
<script>
import commontools from "@/commontools";
const _URL = window.URL || window.webkitURL;
// _URL.createObjectURL(file),
import { Indicator, Toast } from "mint-ui";
import { getZYFileTypeIcon } from "@/util";
import Menu from "./menu";
export default {
  props: {
    bankeid: {
      default: 0
    },
    tempUploadFile: {
      default() {
        return {
          file: {},
          tempImg: ""
        };
      }
    },
    parentid: {
      default: 0
    },
    headerName: {
      default: ""
    },
    cfrom: {
      default: false
    }
  },
  data() {
    return {
      _URL,
      popupmulu: false,
      menuSelectEndData: null
    };
  },
  computed: {
    filename() {
      if (this.tempUploadFile.file.name) {
        return this.tempUploadFile.file.name;
      } else {
        return "";
      }
    },
    defaultImg() {
      let file = this.tempUploadFile.file;
      if (!file.type.includes("image")) {
        return getZYFileTypeIcon(this.tempUploadFile.file.name);
      } else {
        return this.tempUploadFile.tempImg;
      }
    },
    menuEndName() {
      if (this.menuSelectEndData) {
        return this.menuSelectEndData.menuName;
      } else {
        return this.headerName;
      }
    },
    uploadCurRoot() {
      if (
        !this.menuSelectEndData ||
        this.menuSelectEndData.parentid == this.parentid
      ) {
        return true;
      }
      return false;
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    douploadonefiledirect(onefile) {
      console.log("上传照片", onefile);
      if (!onefile) {
        console.log("上传照片 失败");
        return;
      }
      var formdata = new FormData();
      formdata.append("file", onefile);
      let parentid = this.parentid;
      if (this.menuSelectEndData) {
        parentid = this.menuSelectEndData.parentid;
      }
      var url = "/api/bankefile/fileupload?parentid=" + parentid;
      if (this.cfrom) {
        url += "&bankeid=" + this.bankeid + "&banketype=" + 1;
      } else {
        url += "&bankeid=" + this.bankeid;
      }

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
            // commontools.arrayMergeAsIds(this.files, res.data.data);
            if (this.uploadCurRoot) {
              let arr = [];
              arr[0] = res.data.data;
              this.$store.commit("SET_ZHIYUANS", {
                item: arr,
                type: 1
              });
            }
          } else {
            Toast("上传失败");
          }
          this.canlce();
        })
        .catch(err => {
          this.canlce();
          Indicator.close();
        });
    },
    submitUpload() {
      this.douploadonefiledirect(this.tempUploadFile.file);
    },
    onMenuSelectEnd(v) {
      this.menuSelectEndData = v;
      this.popupmulu = false;
      console.log("你看了多少呢", this.menuSelectEndData);
    },
    uploadfile() {
      this.$emit("uploadfile", true);
    },
    queryMulu() {
      this.popupmulu = true;
    },
    onCancel(v) {
      this.popupmulu = false;
    },
    canlce() {
      this.menuSelectEndData = null;
      this.$emit("canlce", true);
    },
    parseOneItem(item) {
      if (item.info) {
        item.info = JSON.parse(item.info);
        if (item.info.metainfo && typeof item.info.metainfo == "string") {
          item.info.metainfo = JSON.parse(item.info.metainfo);
        }
      }
    }
  },
  components: { Menu }
};
</script>

<style scoped lang="less">
.uploadfile-wrap {
  .main {
    .img-wrap {
      margin: 50px auto;
      text-align: center;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
