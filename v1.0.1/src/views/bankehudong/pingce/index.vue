<template>
  <div class="pingce-wrap">
    <mt-header title="评测记录">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <List
        v-for="(v,index) in pingceHistoryList"
        :key="index"
        :item="v"
        type="pingce"
        @click.native="details(v)"
      />
    </div>
    <mt-popup
      v-model="popupDeatil"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header :title="pingceType(pingceItemfile.ptype)">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Deatil :data="pingceItemfile"/>
    </mt-popup>
  </div>
</template>

<script>
import List from "@/common/list";
import Deatil from "./detail";
import {pingceType} from '@/util'
export default {
  name: "PingCe",
  components: {
    List,
    Deatil
  },
  data() {
    return {
      pingceHistoryList: [],
      bankeid: 0,

      popupDeatil:false,

      pingceItemfile:{},
      pingceType,

    };
  },
  mounted() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    }
    this.HistoryListRQuery();
  },
  methods: {
    HistoryListRQuery() {
      this.$http
        .post("api/pingce/query", {
          bankeid: this.bankeid,
          page: 0,
          pagesize: 50
        })
        .then(res => {
          if (res.data.code == "0") {
            this.pingceHistoryList = res.data.data;
            console.log("pingce/query", res);
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    details(v) {
      this.pingceItemfile=v;
      this.popupDeatil=true;
    },
    Backs() {
      this.$router.go(-1);
    },
    goBacks(){
      if(this.popupDeatil){
        this.popupDeatil=false;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-wrap {
  .main {
    margin-top: 10px;
  }
}
</style>
