<template>
  <div class="uploadfile-wrap">
    <div class="main">
      <div class="img-wrap">
        <img class="img object-fit-img position-l;" :src="defaultImg" :onerror="$defaultImg('')" @click="uploadfile" />
      </div>
      <mt-field label="标题" placeholder="请输入标题" v-model="tempUploadFile.file.name"></mt-field>
      <!-- <mt-cell title="目录" is-link value @click.native="queryMulu"></mt-cell> -->
    </div>
    <mt-popup
      v-model="popupmulu"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <Mulu :bankeid="bankeid" @Cancel="onCancel" />
    </mt-popup>
  </div>
</template>
<script>
const _URL = window.URL || window.webkitURL;
// _URL.createObjectURL(file),
import { Indicator, Toast} from "mint-ui";
import { getZYFileTypeIcon } from "@/util";
import Mulu from "./mulu";
export default {
  props: {
    bankeid: {
      default: 0,
    },
    tempUploadFile: {
      default() {
        return {
          file: {},
          tempImg: ""
        };
      }
    }
  },
  data() {
    return {
      _URL,
      popupmulu:false,
    };
  },
  computed: {
    defaultImg() {
      let file = this.tempUploadFile.file;
      if (!file.type.includes("image")) {
        return getZYFileTypeIcon(this.tempUploadFile.file.name);
      } else {
        return this.tempUploadFile.tempImg;
      }
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    uploadfile(){
      this.$emit('uploadfile',true)
    },
    queryMulu() {
       this.popupmulu=true;
    },
    onCancel(){
      this.popupmulu=false;
    },
  },
  components: {Mulu}
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
