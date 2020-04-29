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
      <!-- <mt-cell title="目录" is-link :value="muluId" @click.native="queryMulu"></mt-cell> -->
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
      <Mulu :bankeid="bankeid" :muluId="muluId" @Cancel="onCancel" />
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
import { mapState, mapMutations } from "vuex";
import Mulu from "./mulu";
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {
    Mulu
  },
  data() {
    return {
      url: "",
      urlTitle: "",
      popupmulu: false,
      muluId: "第一章"
    };
  },
  computed: {
    // ...mapState(["bankeZhiYuanLinkItem"])
  },
  methods: {
    submit() {
      if (!this.urlTitle || !this.url) {
        MessageBox.alert("请填写详细信息");
        return;
      }
      this.$http
        .post("/api/bankefile/linkadd?bankeid=" + this.bankeid, {
          url: this.url,
          name: this.urlTitle
        })
        .then(res => {
          if (res.data.code == 0) {
            MessageBox.alert("添加成功").then(() => {
              let arr = [];
              arr[0] = res.data.data;
              res.data.data.imgsrc = ("/assets/file_icon/IT.svg");
              this.$store.commit("SET_BANKEZHIYUANLINKITEM", {item:arr,type:1});
              this.$emit("addLinkState", true);
              this.$store.commit("SET_FOOTER_BAR_STATE", true);
              this.url='';
               this.urlTitle='';
            });
          } else {
            MessageBox.alert(res.data.msg);
          }
          console.log(res);
        })
        .catch(() => {});
    },
    goBack() {
      this.$emit("addLinkState", true);
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    },
    queryMulu() {
      this.popupmulu = true;
    },
    onCancel() {
      this.popupmulu = false;
    }
    // ...mapMutations(['SET_BANKEZHIYUANLINKITEM']),
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
