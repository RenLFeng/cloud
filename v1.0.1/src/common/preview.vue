<template>
  <div>
    <van-image-preview
      v-model="pshow"
      :images="images"
      :swipe-duration="300"
      :showIndex="isFile?true:false"
      @change="onChange"
      @close="onClose"
      :clickNu="clickNu"
    >
      <template v-slot:index>
        <div class="file-info" v-if="isFile">
          <p>{{tempLocalfiles[index].filename}}</p>
          <p>{{tempLocalfiles[index].size}}</p>
          <div style="color:#fff">
            <mt-button type="primary" @click.native="downLoadFile()">下载附件</mt-button>
          </div>
        </div>
      </template>
    </van-image-preview>
    <div :class="isFile?'page-nb isFile':'page-nb'" v-if="tempLocalfiles.length">
      <span class="iconfont iconjiantou2" @click="Prev"></span>
      {{index+1}}&nbsp;/&nbsp;{{tempLocalfiles.length}}
      <span
        class="iconfont iconjiantou"
        @click="Next"
      ></span>
      <span v-if="!isFile" class="iconfont iconlist-xiazai img-down" @click="downLoadFile()"></span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "@vant/touch-emulator/index";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import commontools from "../commontools";
import nativecode from "../nativecode";
Vue.use(ImagePreview);
export default {
  name: "",
  props: {
    pshow: {
      default: false
    },
    pindex: {
      default: 0
    },
    Pimages: {
      default() {
        return [];
      }
    },
    PtempLocalfiles: {
      default() {
        return [];
      }
    }
  },
  watch: {
    pshow: function(newValue, oldValue) {
      if (!newValue) {
        this.$emit("toggleClick", newValue);
      }
    },
    Pimages: function(newValue, oldValue) {
      this.images = newValue;
      console.log("images", this.images);
    },
    PtempLocalfiles: function(newValue, oldValue) {
      this.tempLocalfiles = newValue;
      console.log("tempLocalfiles", this.tempLocalfiles);
    },
    pindex: function(newValue, oldValue) {
      this.index = newValue;
      console.log("tempLocalfiles", this.index);
    }
  },
  data() {
    return {
      images: [],
      tempLocalfiles: [],
      index: 0,
      clickNu: 0
    };
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
  created() {},
  methods: {
    onChange(index) {
      this.index = index;
      if (this.tempLocalfiles.length && !this.tempLocalfiles[index].imgsrc) {
        this.tempLocalfiles[index].size = commontools.renderFileSizeDesc(
          this.tempLocalfiles[index].filesize
        );
      }
    },
    onClose() {
      this.images = [];
      this.tempLocalfiles = [];
      this.index = 0;
    },
    downLoadFile() {
      let fitem = this.tempLocalfiles[this.index];
      if (nativecode.ncall("jsFileLink", fitem)) {
        return;
      }
      fitem.name = fitem.filename;
      fitem.downurl = nativecode.getDownUrl(fitem.filepath);
      fitem.ftype = "file";
      nativecode.ncall("jsFileLink", fitem);
      console.log("fitemfitem", fitem);
      let down = document.createElement("a");
      down.href = fitem.downurl;
      down.download = fitem.name;
      document.body.appendChild(down);
      down.click();
      down.remove();
      return;
      if (window.exsoftTest) {
        window.exsoftTest(fitem.filepath, fitem.filename1);
      }
    },
    Prev() {
      this.index--;
      if (this.index == -1) {
        this.index = this.tempLocalfiles.length - 1;
      }
      if (this.clickNu == this.index) {
        this.index--;
      }
      if (this.index == -1) {
        this.index = this.tempLocalfiles.length - 1;
      }
      this.clickNu = this.index;
    },
    Next() {
      this.index++;
      if (this.index == this.tempLocalfiles.length) {
        this.index = 0;
      }
      if (this.clickNu == this.index) {
        this.index++;
      }
      if (this.index == this.tempLocalfiles.length) {
        this.index = 0;
      }
      this.clickNu = this.index;
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'></style>
