<template>
  <div>
    <mt-header :title="$t('common.AddClass')">
      <mt-button icon="back" slot="left" @click="$back">{{$t('common.Back')}}</mt-button>

      <mt-button slot="right" @click="onsave" :disabled="savedisable">{{$t('common.Keep')}}</mt-button>
    </mt-header>

    <div>
      <mt-field
        :label="$t('common.ClassName')"
        :placeholder="$t('common.Please_entry')+' '+$t('common.ClassName')"
        v-model="classitem.name"
      ></mt-field>

      <mt-cell :title="$t('common.CoverClass')" is-link @click.native="onavatarset">
        <img :src="classitem.avatar" class="avatarimgpart" :onerror="$defaultImg('banke')" />
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
export default {
  name: "BankeNew",
  data() {
    return {
      classitem: {
        name: "",
        avatar: ""
      },
      popupMimgcrop: false,
      imgobj: {}
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