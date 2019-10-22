<template>
  <div class="mainpart zy-content" >
    <FileAttachList v-if="localfiles.length" :isupload="false" class="falist" :localfiles="localfiles" />
    <img v-if="!localfiles.length" :src="fileimg" class="mainimg mainleft" :onerror="errorImg" />
    <div class="mainright" v-if="hasedit">
      <i class="iconfont icon-shanchu2 eicotrigger" @click="icoclick"></i>
    </div>
    <div class="maincontent"  @click="onclick">
      <div class="mainctitle ellipse">{{fileitem.name}}</div>
      <div class="maincsubtitle text-ellipsis">{{filesizedesc}}</div>
      <div class="maincsubtitle text-ellipsis">{{filetimedesc}}</div>
    </div>
  </div>
</template>

<script>
const fileType = ["txt", "rar", "xlsx", "docx", "ppt", "pdf"];
import commontools from "../../commontools";
import FileAttachList from "./FileAttachList";
export default {
  name: "BankeFileSimple",
  components: {
    FileAttachList
  },
  created() {
 
  },
  computed: {
    localfiles() {
      let arr = [];
      if (this.fileitem.info) {
        arr[0] = this.fileitem.info;
        this.fileitem.localfile = arr;
        for (let v of this.fileitem.localfile) {
          if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
            v.imgsrc = v.filepath + v.metainfo.snapsuffix;
          } else {
            v.imgsrc = "";
          }
        }
      } else {
        this.fileitem.localfile = [];
      }
      return this.fileitem.localfile;
    },
    errorImg() {
      var srcstr = 'this.src="';
      if (this.fileitem.ftype == "file") {
        srcstr += require("../../assets/file_icon/file.svg");
      } else {
        srcstr += require("../../assets/file_icon/IT.svg");
      }
      srcstr += '"';
      return srcstr;
    },
    fileimg() {
      let r = this.fileitem.url;
      var fitem = this.fileitem.info;
      if (fitem.filepath && fitem.metainfo && fitem.metainfo.snapsuffix) {
        r = fitem.filepath + fitem.metainfo.snapsuffix;
      }
      for (let item of fileType) {
        if (this.fileitem.name.includes(item)) {
          r = require(`../../assets/file_icon/${item}.svg`);
        }
        if (
          this.fileitem.name.includes("doc") ||
          this.fileitem.name.includes("rtf")
        ) {
          r = require(`../../assets/file_icon/docx.svg`);
        }
        if (this.fileitem.name.includes("zip")) {
          r = require(`../../assets/file_icon/rar.svg`);
        }
        if (this.fileitem.name.includes("xls")) {
          r = require(`../../assets/file_icon/xlsx.svg`);
        }
      }

      // var r = errorImg; //this.fileitem.info ? this.fileitem.info.filepath : errorImg ;
      // //！ cjy： 对于图片使用缩略图； 否则根据文件类型返回对应img
      //   var fitem = this.fileitem.info;
      //   if (fitem.filepath && fitem.metainfo && fitem.metainfo.snapsuffix){
      //       r = fitem.filepath + fitem.metainfo.snapsuffix;
      //   }
      return r;
    },
    filesizedesc() {
      if (this.fileitem.info) {
        return commontools.renderFileSizeDesc(this.fileitem.info.filesize);
      } else {
        return this.fileitem.url;
      }
    },
    filetimedesc() {
      // return '11';
      var str = this.fileitem.createtime;
      str += " 发布";
      return str;
    }
  },
  data() {
    return {
      pendclick: false
    };
  },
  methods: {
    icoclick() {
      this.pendclick = true;
      this.$emit("editclick", this.fileitem);
    },
    onclick() {
      // console.log('bankefilesimple');
      if (this.pendclick) {
        this.pendclick = false;
        return;
      }
      this.$emit("normalclick", this.fileitem);
    }
  },
  props: {
    fileitem: {
      type: Object,
      default() {
        return {
          filename: "++",
          filepath: "",
          filesize: 0,
          uploadtime: ""
        };
      },
      required: false
    },
    hasedit: {
      default() {
        return true;
      }
    },
    index: {
      default: 0
    },
    bankeZhiYuanLinkItem: {
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.mainpart {
  height: 83px;
  border-bottom: 1px solid #eaeaea;
  padding: 10px;
}

.mainimg {
  width: 62px;
  height: 62px;
  border-radius: 10px;
}

.mainleft {
  float: left;
}

.maincontent {
  margin-left: 72px;
  margin-right: 40px;
}

.mainctitle {
  font-size: 16px;
  color: #313131;

  height: 24px;
  margin-bottom: 6px;
}
.maincsubtitle {
  margin-top: 3px;
  height: 16px;

  font-size: 12px;
  color: #a5a5a5;
}

.mainright {
  float: right;
  padding-top: 20px;
}
.eicotrigger {
  font-size: 22px;

  margin-right: 5px;
}
.mainpart .flist-container{
  width: auto;
  float: left;
}

</style>