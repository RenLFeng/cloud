<template>
  <div class="url-container fontsmall">
    <mt-header :title="$t('common.Add')+' '+$t('bankeZiYuan.WebLink')">
      <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
      <mt-button slot="right" @click="submit">确定</mt-button>
    </mt-header>
    <div class>
      <mt-field
        :label="$t('common.Title')+':'"
        :placeholder="$t('common.Please_entry')+$t('common.Title')"
        v-model="urlTitle"
      ></mt-field>
      <mt-field
        label="网址:"
        :placeholder="$t('common.Please_entry')+$t('common.Url')"
        type="url"
        v-model="url"
      ></mt-field>
      <mt-cell title="目录" is-link :value="menuEndName" @click.native="queryMulu"></mt-cell>
    </div>
    <!-- <div class="button-worp">
      <mt-button class="button-auto-87" type="primary" @click="submit">{{$t('common.Submit')}}</mt-button>
    </div>-->
    <mt-popup
      v-model="popupmulu"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <Menu
        :bankeid="bankeid"
        v-if="popupmulu"
        @Cancel="onCancel"
        @menuSelectEnd="onMenuSelectEnd"
        :parentid="parentid"
        :headerName="headerName"
        :cfrom="cfrom"
      />
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
import { mapState, mapMutations } from "vuex";
import Menu from "./menu";
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    },
    cfrom: {
      default: false
    },
    parentid: {
      default: 0
    },
    headerName: {
      default: ""
    }
  },
  components: {
    Menu
  },
  data() {
    return {
      url: "",
      urlTitle: "",
      popupmulu: false,
      menuSelectEndData: null
    };
  },
  computed: {
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
    // ...mapState(["arrZhiyuan"])
  },
  methods: {
    submit() {
      if (!this.urlTitle || !this.url) {
        MessageBox.alert("请填写详细信息");
        return;
      }
      let parentid = this.parentid;
      if (this.menuSelectEndData) {
        parentid = this.menuSelectEndData.parentid;
      }
      var url =
        "/api/bankefile/linkadd?bankeid=" +
        this.bankeid +
        "&parentid=" +
        parentid;
      if (this.cfrom) {
        url += "&banketype=" + 1;
      }
      this.$http
        .post(url, {
          url: this.url,
          name: this.urlTitle
        })
        .then(res => {
          if (res.data.code == 0) {
            MessageBox.alert("添加成功").then(() => {
              res.data.data.imgsrc = "/assets/file_icon/IT.svg";
              if (this.uploadCurRoot) {
                let arr = [];
                arr[0] = res.data.data;
                this.$store.commit("SET_ZHIYUANS", {
                  item: arr,
                  type: 1
                });
              }
              this.$emit("addLinkState", true);
              if (!this.cfrom) {
                this.$store.commit("SET_FOOTER_BAR_STATE", true);
              }
              this.url = "";
              this.urlTitle = "";
            });
          } else {
            MessageBox.alert(res.data.msg);
          }
          console.log(res);
        })
        .catch(() => {});
    },
    onMenuSelectEnd(v) {
      this.menuSelectEndData = v;
      this.popupmulu = false;
      console.log("你看了多少呢", this.menuSelectEndData);
    },
    goBack() {
      this.menuSelectEndData=null;
      this.$emit("addLinkState", true);
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    },
    queryMulu() {
      this.popupmulu = true;
    },
    onCancel() {
      this.popupmulu = false;
    }
    // ...mapMutations(['SET_ZHIYUANS']),
  }
};
</script>

<style lang='less' scoped>
.url-container {
  .button-worp {
    margin-top: 10px;
  }
  .mint-cell-value.is-link {
    margin-right: 30px;
  }
}
</style>
