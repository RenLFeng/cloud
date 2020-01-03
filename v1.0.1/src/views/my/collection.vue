<template>
  <div class="collection-wrap">
    <mt-header title="我的收藏" class="mint-header-f">
      <mt-button icon="back" slot="left" @click="$back">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main main-f" v-if="collectionHiostry.length">
      <List
        v-for="(v,index) in collectionHiostry"
        :key="index"
        :item="v"
        type="common"
        @edit="onEdit"
        @click.native="filedetail(v)"
      />
    </div>
    <Empty v-else />
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import List from "@/common/list";
import Empty from "@/common/empty";
import nativecode from "@/nativecode";

import { getCollectionType } from "@/util";

import {
  Indicator,
  Toast,
  MessageBox,
  Cell,
  Popup,
  InfiniteScroll,
  Actionsheet
} from "mint-ui";
export default {
  name: "Collection",
  props: {},
  data() {
    return {
      editItemObj: {},
      collectionHiostry: [],
      page: 0,
      pagesize: 10,

      actions: [
        {
          name: "重命名",
          method: this.setName
        },
        {
          name: "删除收藏",
          method: this.dl
        }
      ],
      actionShow: false,
    };
  },
  computed: {},
  created() {
    this.userfavQuery();
  },

  mounted() {},
  watch: {},
  methods: {
    userfavQuery() {
      Indicator.open("加载中...");
      this.$http
        .post("/api/userfav/query", {
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            Toast("成功");
            let ch = res.data.data;
            for (let v of ch) {
              v.info = JSON.parse(v.info);
              if (v.info.type) {
                v.info.typeText = getCollectionType(v.info.type);
              }
            }
            this.collectionHiostry = ch;
            console.log("success", this.collectionHiostry);
          } else {
            Toast("失败");
          }
          Indicator.close();
        })
        .catch(err => {
          Toast("异常");
          Indicator.close();
        });
    },
    onEdit(item) {
      this.editItemObj = item;
      this.actionShow = true;
    },
    setName() {
      MessageBox.prompt("重命名收藏", "").then(({ value, action }) => {
        //alert(this.editItemObj.id)
        //alert(value);
        let curobj = this.editItemObj;
        if (value.length > 0) {
          this.$http
            .post("/api/userfav/save", {
              id: this.editItemObj.id,
              title: value
            })
            .then(res => {
              if (res.data.code == "0") {
                //   Toast("成功");
                curobj.title = value;
              } else {
                Toast("失败");
              }
              Indicator.close();
            })
            .catch(err => {
              Toast("异常");
              Indicator.close();
            });
        }
      });
    },
    dl() {
      // if (!this.caneditbanke) {
      //   Toast("你无权限");
      //   return;
      // }
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          Indicator.open("刪除中...");
          this.$http
            .post("/api/userfav/delete", {
              id: this.editItemObj.id
            })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("删除成功").then(() => {
                  this.userfavQuery();
                  this.actionShow = false;
                });
              } else {
                MessageBox.alert(res.data.msg);
                this.actionShow = false;
              }
              Indicator.close();
              console.log(res);
            })
            .catch(() => {
              Indicator.close();
              this.actionShow = false;
            });
        })
        .catch(() => {
          Indicator.close();
          this.actionShow = false;
        });
    },
    filedetail(fileItem) {
      switch (fileItem.eventtype) {
        case 1:
          // let tourl = "/bankehome/" + fileItem.info.bankeid;
          // if (!nativecode.navigateTo(tourl)) {
          //   this.$store.commit("setRouterForward", true);
          //   this.$router.push(tourl);
          // }
          let obj = fileItem.info.itemfile;
          obj.filename = fileItem.title;
          nativecode.fileview(this, obj);
          break;
        case 2:
          return "";
          break;
        case 3:
          this.$store.commit("setRouterForward", true); //! 作业
          this.$router.push("/zuoyeresult/" + fileItem.eventid);
          break;
        case 4: //! 评测
          this.$store.commit("setRouterForward", true);
          this.$router.push({
            name: "PingCe",
            params: { pingceid: fileItem.eventid }
          });
          break;
        case 100: //! 板书
          nativecode.fileview(this, fileItem.info.itemfile);
          // this.$store.commit("setRouterForward", true);
          // this.$router.push({
          //   name: "Banshu",
          //   params: { bankeid: fileItem.info.bankeid }
          // });
          break;
        default:
          return "";
      }
    },
  },
  components: {
    List,
    Empty
  }
};
</script>

<style scoped lang="less">
.collection-wrap {
  .main {
  }
}
</style>
