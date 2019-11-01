<template>
  <div class="url-container fontsmall">
    <div class="border-e5-bottom">
      <mt-field :label="$t('common.Title')+':'" :placeholder="$t('common.Please_entry')+$t('common.Title')" v-model="url"></mt-field>
      <mt-field :label="$t('common.Url')+':'" :placeholder="$t('common.Please_entry')+$t('common.Url')" type="url" v-model="urlTitle"></mt-field>
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" type="primary" @click="submit">{{$t('common.Submit')}}</mt-button>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";
import {mapState,mapMutations} from 'vuex';
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  data() {
    return {
      url: "",
      urlTitle: ""
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
              let arr=[];
              arr[0]=res.data.data
               this.$store.commit('SET_BANKEZHIYUANLINKITEM', arr);
              this.$emit("addLinkState", true);
            });
          } else {
            MessageBox.alert(res.data.msg);
          }
          console.log(res);
        })
        .catch(() => {});
    },
    // ...mapMutations(['SET_BANKEZHIYUANLINKITEM']),
  }
};
</script>

<style lang='less' scoped>
.url-container {
  .button-worp {
    margin-top: 10px;
  }
  .popup-right {
    height: 60%;
  }
}
</style>
