<template>
  <div class="coures-new-wrap">
    <mt-header :title="cfrom?'编辑课程':'创建课程'">
      <mt-button slot="left" @click="back">取消</mt-button>

      <mt-button slot="right" @click="onsave" :disabled="savedisable">{{cfrom?'保存':'创建'}}</mt-button>
    </mt-header>

    <div>
      <div class="pic-wrap">
        <img
          :src="classitem.avatar"
          class="avatarimgpart"
          :onerror="$defaultImg('banke')"
          @click="onavatarset"
        />
        <p class="fontsmall color0">课程封面</p>
      </div>
      <mt-field
        @blur.native.capture="$setInputScroll"
        label="课程名称"
        placeholder="请输入课程名称"
        v-model="classitem.name"
      ></mt-field>
    </div>
    <input
      ref="uploadPic"
      type="file"
      name="file"
      class="upload"
      @change="uploadChange"
      style="display:none"
      accept="image/*"
    />
    <mt-popup
      v-model="popupMimgcrop"
      position="right"
      class="mint-popup-3"
      :modal="false"
      style="background:#000"
    >
      <mt-header :title="$t('personal.Edit_head')">
        <mt-button icon="back" slot="left" @click="popupMimgcrop = false">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <div class="cropComp">
        <mimgcrop
          v-model="imgobj"
          class="cropComp"
          ref="mimgcrop"
          @cancel="popupMimgcrop = false"
          @submit="onimgsubmit"
        ></mimgcrop>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
import mimgcrop from "@/common/m-image-crop";
import commontools from "@/commontools.js";
export default {
  name: "CouresNew",
  props: {
    curcourse: {
      default() {
        return {
          id: "",
          name: "",
          avatar: ""
        };
      }
    },
    cfrom: {
      default: false
    }
  },
  data() {
    return {
      classitem: {
        name: "",
        avatar: ""
      },
      popupMimgcrop: false,
      imgobj: {},
      history: [
        {
          id: 1,
          name: "物理"
        },
        {
          id: 2,
          name: "化学"
        },
        {
          id: 3,
          name: "英语"
        }
      ],
      templist: [],
      isOpen: false
    };
  },
  components: { mimgcrop },
  computed: {
    savedisable() {
      if (this.classitem.name.length > 0) {
        return false;
      }
      return true;
    },
    defaultImage() {
      var srcstr = 'this.src="';
      srcstr += "/assets/file_icon/file.svg";
      srcstr += '"';
      return srcstr;
    }
  },
  created() {
    if (this.cfrom) {
      this.classitem.id = this.curcourse.id;
      this.classitem.name = this.curcourse.name;
      this.classitem.avatar = this.curcourse.avatar;
    }
    console.log("lgkd", this.classitem);
    this.templist = JSON.parse(JSON.stringify(this.history));
  },
  methods: {
    onFocus() {
      if (this.history.length) {
        this.isOpen = true;
      }
    },
    onInput(v) {
      this.history = this.templist.filter(item => item.name.indexOf(v) > -1);
    },
    listSelect(v) {
      this.classitem.type = v;
      this.isOpen = false;
    },
    onsave() {
      let BankeData = this.$store.state.banke.curbankes;
      Indicator.open(this.$t("common.Saving"));
      var url = "/api/course/add";
      this.$http
        .post(url, this.classitem)
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            Object.assign(this.classitem, res.data.data);
            // this.$store.commit("banke/appendBankes", this.classitem);
            if (this.cfrom) {
              let coursers = JSON.parse(
                JSON.stringify(this.$store.state.banke.curcourses)
              );
              for (let v of coursers) {
                if (v.id == this.classitem.id) {
                  v.avatar = this.classitem.avatar;
                  v.name = this.classitem.name;
                }
              }
              this.$store.commit("banke/setCourse", coursers);
              this.$emit("ediend", this.classitem);
            } else {
              this.defaultNewBanke(res.data.data);
            }
          } else {
            let tipmsg = res.data.msg;
            if (tipmsg == "no privilige") {
              tipmsg = "无权限";
            } else if (tipmsg == "over num limit") {
              tipmsg = "超出数量限制";
            } else if (tipmsg == "disabled") {
              tipmsg = "功能已被禁用";
            } else if (tipmsg == "over num limit in school total") {
              tipmsg = "学校课程数已达上限";
            } else if (tipmsg == "over num limit in user") {
              tipmsg = "您创建的课程数已达上限。\r\n请先结束部分课程";
            }
            Toast(tipmsg);
          }
        })
        .catch(() => {
          Indicator.close();
          Toast(this.$t("common.Exception_occurred"));
        });
    },
    onavatarset() {
      this.$refs.uploadPic.click();
    },
    uploadChange(e) {
      let file = e.target.files[0];
      // this.uploadImg(file);
      this.$refs.uploadPic.value = "";
      this.$refs.mimgcrop.loadfile(file);
      this.popupMimgcrop = true;
    },
    onimgsubmit() {
      this.popupMimgcrop = false;
      console.log(this.imgobj);
      this.uploadimagedata(this.imgobj.base64);
    },
    uploadimagedata(base64str) {
      var url = "/api/banke/saveavatar";
      Indicator.open(this.$t("Indicator.Uploading"));
      this.$http
        .post(url, {
          jpeg: base64str
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            this.classitem.avatar = res.data.data.filepath;
          }
        })
        .catch(res => {
          Indicator.close();
        });
    },
    defaultNewBanke(course) {
      let postdata = {
        name: "默认班级",
        avatar: "",
        type: "",
        ordernum: null,
        courseid: course.id
      };
      let url = "/api/api/bankenew";
      this.$http
        .post(url, postdata)
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            this.updateinfo(res.data.data, course);
          }
          this.initbnakes();
        })
        .catch(() => {
          this.initbnakes();
        });
    },
    updateinfo(banke, course) {
      this.$http
        .post("api/banke/updateinfo", {
          id: banke.id,
          coursename: course.name,
          avatar: course.avatar
        })
        .then(res => {
          if (res.data.code == "0") {
          }
          this.initbnakes();
        })
        .catch(err => {
          this.initbnakes();
        });
    },
    initbnakes() {
      this.$store.commit("banke/setBankes", []);
      this.$router.push("/");
    },
    back() {
      if (this.cfrom) {
        this.$emit("calce", true);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.coures-new-wrap {
  .pic-wrap {
    margin: 30px auto;
    text-align: center;
    .avatarimgpart {
      width: 140px;
      height: 140px;
    }
    > p {
      margin-top: 10px;
    }
  }
  .bankename-wrap {
    height: 48px;
    overflow: hidden;
    .history-list {
      background: #fff;
      width: 95%;
      margin: 0 auto;
      padding: 0 10px;
      > li {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #f0f0f0;
        text-align: right;
      }
    }
    &.act {
      height: auto;
      transition: all 0.3s;
    }
  }
}
</style>
<style>
.coures-new-wrap .mint-cell-wrapper {
  background-image: none;
}
.coures-new-wrap .mint-cell:last-child {
  background-image: none;
}
</style>
