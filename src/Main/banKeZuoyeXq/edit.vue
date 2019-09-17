<template>
  <div class="bk-edit-container">
    <div class="pic-container" @click="unloadFn">
      <img :src="imgSrc?imgSrc:bankeInfo.avatar" alt :onerror="defaultimg"/>
      <p>班课封面</p>
    </div>
    <div class="bk-info-lists">
      <ul class="border-bottom-e5">
        <!-- <li>
          <mt-field label="班级" placeholder v-model="banji"></mt-field>
        </li>-->
        <li>
          <mt-field label="课程" placeholder v-model="bankeNmae"></mt-field>
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
import defaultPic from "../../assets/avatar-default.png";
import { Cell, Button, MessageBox, Field } from "mint-ui";
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
      this.bankeNmae = this.bankeInfo.name;
      //   }
    }
  },
  data() {
    return {
      pic:'',
      defaultPic: defaultPic,
      banji: "",
      bankeNmae: "",
      bankeInfoData: {},
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      },
      imgSrc: "",
      BankeData: []
    };
  },
  created() {},
  computed: {
     defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/banke-default.png");
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {
    unloadFn() {
      this.$refs.uploadPic.click();
    },
    submit() {
      let BankeData = this.$store.state.banke.curbankes;
      this.$http
        .post("/api/banke/updateinfo", {
          id: this.bankeInfo.id,
          name: this.bankeNmae,
          states: this.bankeInfo.states,
          avatar: this.imgSrc ? this.imgSrc : this.bankeInfo.avatar
        })
        .then(res => {
          if (res.data.code == 0) {
            MessageBox.alert("操作成功").then(() => {
              this.imgSrc=res.data.data.avatar;
              this.$emit("imgSrcLoad", this.imgSrc);
               this.pic=res.data.data.avatar;
              for (let item of BankeData) {
                if (item.id == res.data.data.id) {
                  item.name = res.data.data.name;
                  item.avatar = this.imgSrc;
                }
              }
              this.$store.commit("banke/appendBankes", BankeData);
            });
          } else {
            MessageBox.alert(res.data.msg).then(() => {});
          }
        })
        .catch(() => {});
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
            this.imgSrc=res.data.data.filepath;
            console.log("成功", res)
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
    p{
      font-size: 14px;
      margin-top: 5px;
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
