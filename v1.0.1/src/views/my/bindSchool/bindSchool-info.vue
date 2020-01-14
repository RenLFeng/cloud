<template>
  <div class="bind-info-wrap">
    <mt-header title="学校信息" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="back(0)">返回</mt-button>
    </mt-header>
    <div class="main main-f">
      <div class="title">
        <img class="avatar" src :onerror="$defaultImg('school')" />
        <p class="fontsmall">{{schoolInfo.name}}</p>
      </div>
      <p class="tit">我在该学校的信息</p>
      <mt-cell title="工号" :value="schoolInfo.sno" class="sno"></mt-cell>
      <p class="canse tc fontsmall" @click="canseBind">取消绑定该学校</p>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";
export default {
  props: {
    info: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      schoolInfo: {}
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    info: function(newValue, oldValue) {
      this.schoolInfo = newValue;
    }
  },
  methods: {
    canseBind() {
      MessageBox.confirm("你确认要取消绑定吗？").then(res => {
        Indicator.open("操作中...");
        this.$http
          .post("/api/school/deletebind", {
            schoolid: this.schoolInfo.schoolid
          })
          .then(res => {
            if (res.data.code == "0") {
              Toast("成功");
              this.back(1);
            } else {
              Toast("失败");
            }
            Indicator.close();
          })
          .catch(err => {
            Indicator.close();
          });
      });
    },
    back(type) {
      this.$emit("back", type);
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.bind-info-wrap {
  .main {
    width: 100%;
    height: 93vh;
    min-height: 93vh;
    overflow-y: scroll;
    .title {
      position: relative;
      padding: 40px 40px 40px 80px;
      background: #fff;
      .avatar {
        width: 60px;
        height: 60px;
        object-fit: cover;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translate(0, -50%);
        border-radius: 30px;
      }
    }
    .tit {
      padding: 10px;
    }
    .sno {
      padding: 0 20px;
    }
    .canse {
      margin-top: 15px;
      background: #fff;
      padding: 20px 0;
      color: #000;
    }
  }
}
</style>
