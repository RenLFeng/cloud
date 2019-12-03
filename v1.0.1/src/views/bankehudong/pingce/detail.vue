<template>
  <div class="pingce-dtail-warp">
    <div class="main">
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
          <List v-for="(v,index) in memberData" :key="index" :item="v" type="pingcedetail" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from "@/common/list";
export default {
  name: "",
  props: {
    data: {
      default() {
        return [];
      }
    }
  },
  components: {
    List
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
      memberData: []
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
             console.log("详细", this.memberData);
            for (let item of this.memberData) {
              item.answerdesc = JSON.parse(item.answerdesc);
              for (let v of res.data.data.users) {
                if (item.userid == v.id) {
                  item.avatar=v.avatar;
                  item.name = v.account;
                }
              }
            }
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
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
