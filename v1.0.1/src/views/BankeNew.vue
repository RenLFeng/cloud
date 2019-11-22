<template>
  <div>
    <mt-header :title="$t('common.AddClass')">
      <mt-button icon="back" slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>

      <mt-button slot="right" @click="onsave" :disabled="savedisable">{{$t('common.Keep')}}</mt-button>
    </mt-header>

    <div>
      <mt-field
        :label="$t('common.ClassName')"
        :placeholder="$t('common.Please_entry')+' '+$t('common.ClassName')"
        v-model="classitem.name"
      ></mt-field>

      <mt-cell :title="$t('common.CoverClass')" is-link @click.native="onavatarset">
        <img :src="classitem.avatar" class="avatarimgpart" :onerror="defaultImage" />
      </mt-cell>
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
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";

export default {
  name: "BankeNew",
  data() {
    return {
      classitem: {
        name: "",
        avatar: ""
      }
    };
  },
  computed: {
    savedisable() {
      if (this.classitem.name.length > 0) {
        return false;
      }
      return true;
    },
    defaultImage() {
      var srcstr = 'this.src="';
      srcstr += require("../assets/file_icon/file.svg");
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {
    onsave() {
      Indicator.open(this.$t("common.Saving"));
      var url = "/api/api/bankenew";
      this.$http
        .post(url, this.classitem)
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            this.classitem.id = res.data.data.id;
            this.$store.commit("banke/appendBankes", this.classitem);
            this.$router.push("/");
          } else {
          }
          Toast(res.data.msg);
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
      let that = this;
      let file = e.target.files[0];
      this.uploadImg(file);
      this.$refs.uploadPic.value = "";
    },
    uploadImg(file) {
      let that = this;
      let formdata = new FormData();
      formdata.append("file", file);
      let url = "/api/api/zuoyefileupload";
      this.$http
        .post(url, formdata)
        .then(res => {
          if (res.data.code == 0) {
            this.classitem.avatar = res.data.data.filepath;
            console.log("成功", res.data.data);
          } else {
            console.log("失败", res.data.data);
          }
        })
        .catch(() => {
          console.log("catch", res.data.data);
        });
    }
  }
};
</script>

<style scoped>
.avatarimgpart {
  width: 55px;
  height: 55px;
  border-radius: 3px;
}
</style>