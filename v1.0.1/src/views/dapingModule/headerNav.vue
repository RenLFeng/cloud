<template>
  <div class="biggp-header-wrap">
    <div class="main">
      <div class="header-info-wrap">
        <div class="let-title">{{navInfo.letTitle}}</div>
        <div class="banke-name">{{navInfo.bankeName}}</div>
        <div class="num-member">
          <div class="num">
            <span class="sign-Total" v-if="navInfo.issign">{{navInfo.signTotal}}</span>
            <span class="total"><span v-if="navInfo.issign">/</span>{{navInfo.total}}</span>
          </div>
          <div class="text">
            <span v-if="navInfo.issign">
              <span class="sign-Total">实际签到</span>
              <span>/</span>
              <span class="total">应签到</span>
            </span>
            <span v-else>
              <span class="total">班课人数</span>
            </span>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    navInfo: {
      default() {
        return {
          letTitle: "成员名单",
          bankeName: "",
          signTotal: 0,
          total: 0
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="less">
.biggp-header-wrap {
  .main {
    // margin: 30px auto;
    .header-info-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 127px;
      .let-title {
        font-size: 47px;
        color: #707070;
        border-left: 8px solid #0089ff;
        padding-left: 10px;
      }
      .banke-name {
        font-size: 47px;
        color: #535353;
      }
      .num-member {
        .num {
          display: flex;
          justify-content: space-around;
          font-size: 74px;
          .sign-Total {
            color: #0089ff;
          }
          .total {
            color: #999;
          }
        }
        .text {
          display: flex;
          justify-content: space-between;
          font-size: 23px;
          color: #999;
          .sign-Total {
            color: #0089ff;
          }
          .total {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
