<template>
  <div class="mainpart" @click="onclick">
    <img :src="fileimg" class="mainimg mainleft" :onerror="errorImg" />
    <div class="mainright" v-if="hasedit">
      <i class="iconfont icon-shanchu2 eicotrigger" @click="icoclick"></i>
    </div>
    <div class="maincontent">
      <div class="mainctitle ellipse">{{fileitem.name}}</div>
      <div class="maincsubtitle">{{filesizedesc}}</div>
      <div class="maincsubtitle">{{filetimedesc}}</div>
    </div>
  </div>
</template>

<script>
import commontools from "../../commontools";
import errorImg from '../../assets/100x100.png';
export default {
  name: "BankeFileSimple",
  computed: {
    errorImg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/100x100.png");
      srcstr += '"';
      return srcstr;
    },
    fileimg() {
      var r = this.fileitem.info ? this.fileitem.info.filepath : errorImg ;
      return r;
    },
    filesizedesc() {
      return commontools.renderFileSizeDesc(this.fileitem.info.filesize);
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
      // console.log('bankefilesimple icoclick');
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
          uploadtime: "",
        };
      },
      required: false
    },
    hasedit: {
      default() {
        return true;
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
</style>