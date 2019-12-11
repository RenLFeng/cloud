<template>
  <div class="pingce-dtail-warp">
    <div class="main" v-if="memberData.length">
      <div class="pic">
        <img :src="pingceItemfile.files" alt />
        <p class="color9">
          {{pingceItemfile.userid}}
          <span class="fr">{{pingceItemfile.createtime}}</span>
        </p>
      </div>
      <div class="list-main">
        <div class="content">
          <p class="clearfix tit">
            <span class="fl">{{memberData.length}} 人提交</span>
            <span class="fr">正确率 00%</span>
          </p>
          <List
            v-for="(v,index) in memberData"
            :key="index"
            :item="v"
            type="pingcedetail"
            :ptype="pingceItemfile.ptype"
            @click.native="onMemberClick(v)"
          />
        </div>
      </div>
    </div>
    <Empty v-else :text="['暂无记录...']" />
    <mt-popup v-model="popupDeatil" position="right" class="mint-popup" :modal="false" style>
      <mt-header :title="`${memBerItem.name}的答案`">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <AnswerDetail :memBerItem="memBerItem" />
    </mt-popup>
  </div>
</template>
<script>
import { Button, Indicator, Toast, Cell, MessageBox, Loadmore } from "mint-ui";
import List from "@/common/list";
import AnswerDetail from "./answerdetail";
import Empty from "@/common/empty";
export default {
  name: "",
  props: {
    data: {
      default() {
        return {};
      }
    }
  },
  components: {
    List,
    AnswerDetail,
    Empty
  },
  watch: {
    data: function(newValue, oldValue) {
      this.pingceItemfile = newValue;
      this.querySubmitDetail();
      console.log("000", this.pingceItemfile);
    }
  },
  data() {
    return {
      pingceItemfile: {},
      memberData: [],
      popupDeatil: false,
      memBerItem: {}
    };
  },
  mounted() {},
  methods: {
    querySubmitDetail() {
      this.$http
        .post("api/pingce/querysubmit", {
          id: this.pingceItemfile.id,
          bankeid: this.pingceItemfile.classid
        })
        .then(res => {
          if (res.data.code == "0") {
            this.memberData = res.data.data.submit;
            for (let item of this.memberData) {
              item.answerdesc = JSON.parse(item.answerdesc);
              for (let v of res.data.data.users) {
                if (item.userid == v.id) {
                  item.avatar = v.avatar;
                  item.name = v.account;
                }
              }
            }
            console.log("详细", this.memberData);
            if (this.pingceItemfile.ptype == "1") {
              for (let item of this.memberData) {
                for (let key in item.answerdesc.opts) {
                  let v = item.answerdesc.opts[key];
                  switch (v) {
                    case "A":
                      item.answerdesc.opts[key] = "正确";
                      break;
                    case "B":
                      item.answerdesc.opts[key] = "错误";
                      break;
                  }
                }
              }
            }
            if (this.pingceItemfile.ptype == "6") {
              for (let item of this.memberData) {
                item.isResponder='抢答成功'
              }
            }
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    onMemberClick(v) {
      this.memBerItem = v;
      this.popupDeatil = true;
    },
    goBacks() {
      if (this.popupDeatil) {
        this.popupDeatil = false;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-dtail-warp {
  .main {
    background: #fff;
    .pic {
      width: 75%;
      margin: 0 auto;
      padding: 30px 0 10px 0;
      img {
        width: 100%;
      }
      p {
        margin-top: 20px;
      }
    }
    .list-main {
      background: #f0f0f0;
      padding-top: 20px;
      .content {
        background: #fff;
        padding: 10px;
        .tit {
          border-bottom: 1px solid #f0f0f0;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
