<template>
  <div class="bk-edit-container">
    <div class="pic-container">
      <img :src="imgSrc?imgSrc:bankeInfo.avatar" alt @click="unloadFn" />
      <p>班课封面</p>
    </div>
    <div class="bk-info-lists">
      <ul class="border-bottom-e5">
        <li>
          <mt-field label="班级" placeholder v-model="banji"></mt-field>
        </li>
        <li>
          <mt-field label="课程" placeholder v-model="kecheng"></mt-field>
        </li>
      </ul>
    </div>
    <div class="submit-fixed">
      <mt-button class="botton-96" type="default" @click="submit">保存</mt-button>
    </div>
    <input
      ref="uploadPic"
      type="file"
      name="file"
      class="upload"
      @change="uploadChange"
      accept="image/*"
      style="display:none"
    />
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    bankeInfo: {
      default() {
        return {};
      }
    },
    editBkState: {
      default() {
        return "";
      }
    }
  },
  watch: {
    bankeInfo(newValue, oldValue) {
      this.bankeInfoData = newValue;
    },
    editBkState(newValue, oldValue) {
    //   if (!newValue) {
        this.banji = this.bankeInfo.id;
        this.kecheng =this.bankeInfo.name;
    //   }
    }
  },
  data() {
    return {
      banji: "",
      kecheng: "",
      bankeInfoData: {},
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      },
      imgSrc: ""
    };
  },
  created() {},
  methods: {
    unloadFn() {
      this.$refs.uploadPic.click();
    },
    submit() {
      alert("保存");
    },
    uploadChange(e) {
      let file = e.target.files[0];
      let formdata = new FormData();
      this.uploadImg(file);
      this.$refs.uploadPic.value = "";
    },
    uploadImg(file) {
      let formdata = new FormData();
      formdata.append("file", file);
      let url = this.urlinfo.urlupload;
      this.$http
        .post(url, formdata)
        .then(res => {
          if (res.data.code == 0) {
            this.imgSrc = res.data.data.filepath;
            this.$emit("imgSrcLoad", this.imgSrc);
            console.log("成功", res);
          } else {
            console.log("失败", res);
          }
        })
        .catch(() => {
          console.log("catch", res.data.data);
        });
    },
    init() {}
  },
  destroyed() {}
};
</script>

<style lang='less'>
.bk-edit-container {
  .pic-container {
    text-align: center;
    padding: 30px 0;
    img {
      width: 20%;
    }
  }
  .mint-field-core {
    text-align: right;
  }
  .mint-cell .mint-cell-wrapper {
    padding-right: 10px;
  }
}
</style>
