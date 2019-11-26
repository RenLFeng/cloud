<template>
  <div class="member-detail-main">
    <BankeMemberSimple :memberuser="memberuser" scoreText="在本班课中得分"></BankeMemberSimple>
    <ul class="Statistics clearfix tc">
      <li class="fl">
        <span class="colory fontsmall">{{memberuser.score1}}</span>
        <span>资源得分</span>
      </li>
      <li class="fl">
        <span class="colory fontsmall">{{memberuser.score3}}</span>
        <span>作业得分</span>
      </li>
      <li class="fl">
        <span class="colory fontsmall">{{memberuser.score4}}</span>
        <span>评测得分</span>
      </li>
      <li class="fl" style="border-right: none;">
        <span class="colory fontsmall">{{memberuser.score2}}</span>
        <span>签到得分</span>
      </li>
    </ul>
    <p class="tc Explain">学生在本班课中的总得分是按得分占比折算后的得分。</p>
    <div class="table-main">
      <F2LineChart :item="memberuser" />
      <!-- <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>-->
    </div>
  </div>
</template>
<script>
import F2 from "@antv/f2/lib/index-all";
import BankeMemberSimple from "../components/BankeMemberSimple";
import F2LineChart from "../../common/antv/f2/line";
export default {
  name: "",
  props: {
    memberuser: {
      default() {
        return {};
      }
    },
    chartData: {
      default() {
        return {};
      }
    }
  },
  watch: {
    memberuser:  function(newValue, oldValue) {
      console.log("newValuenewValue", newValue);
    },
    chartData:  function(newValue, oldValue) {
      console.log("chartDatachartDatachartData", newValue);
    },
  },
  components: {
    BankeMemberSimple,
    F2LineChart
  },
  data() {
    return {
      Data: [],
      itemData: {},
      index:2
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang='less' scoped>
.member-detail-main {
  .mainpart,
  .Statistics {
    background: #fff;
  }
  .Statistics {
    border-top: 1px solid #f0f0f0;
    li {
      width: 25%;
      padding: 10px;
      border-right: 1px solid #ccc;
      span {
        display: block;
        padding: 5px 0;
      }
    }
  }
  .Explain {
    margin: 10px 0 20px 0;
  }
  .table-main {
    background: #fff;
  }
}
</style>

