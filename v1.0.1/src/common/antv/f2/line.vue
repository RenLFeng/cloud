<template>
  <div class="f2-main">
    <h3 class="tit">{{chartType}}</h3>
    <van-tabs
      v-model="Selected"
      type="card"
      border
      color="#0091fa"
      @change="Change"
      class="table-vant"
    >
      <van-tab v-for="(item,index) in rangeTypes" :title="item.text" :key="index"></van-tab>
    </van-tabs>
    <div class="canvas-wrap">
      <canvas :id="elId" width height="200px" class="mychart-f2"></canvas>
      <span v-if="!serverData.length" class="content-warp">暂无数据...</span>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, Button } from "vant";
import F2 from "@antv/f2/lib/index-all";
import { getDate, formateTime, getNextDate } from "../../../util";
const chartType = ["资源得分", "作业得分", "评测得分", "签到得分"];
import uuidv1 from "uuid/v1";
let chart = void 0;
let data = [];
export default {
  name: "f2line",
  props: {
    item: {
      default() {
        return [];
      }
    },
    chartType: {
      default: "得分曲线"
    }
  },
  watch: {
    item: function(newValue, oldValue) {
      console.log("newValue", newValue);
      this.memberuserData = newValue;
      this.getScoreinfo(this.memberuserData, getNextDate(7), 7);
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button
  },
  data() {
    return {
      Data: [],
      elId: "",
      Selected: 0,
      rangeTypes: [
        {
          text: "近7天",
          value: "0"
        },
        {
          text: "近1月",
          value: "1"
        },
        {
          text: "近半年",
          value: "2"
        }
      ],
      data,
      serverData: [],
      memberuserData: {}
    };
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted: {
    isroute() {
      let params = this.$route.params;
      if (params.calssid) {
        return true;
      } else {
        return false;
      }
    },
    classid() {
      let params = this.$route.params;
      if (params.calssid) {
        return params.calssid;
      }
    }
  },
  mounted() {
    console.log("this.$routethis.$route", this.$route);
  },
  destroyed() {
    chart.destroy();
    chart = null;
  },
  methods: {
    getScoreinfo(item, start, n) {
      console.log("scoreinfo", item);
      this.$http
        .post("api/bankecount/scoreinfo", {
          userids: [item.memberuserid],
          classid: item.classid,
          startdate: start,
          enddate: "2019/11/25",
          pagesize: 1000
        })
        .then(res => {
          // res.data.data.scores.push({
          //   classid: 1000,
          //   countdate: "2019/11/20",
          //   id: 1006,
          //   score1: 10,
          //   score2: 30,
          //   score3: 0,
          //   score4: 0,
          //   score5: 0,
          //   userid: 1003
          // });
          // res.data.data.scores.push({
          //   classid: 1000,
          //   countdate: "2019/11/19",
          //   id: 1006,
          //   score1: 20,
          //   score2: 40,
          //   score3: 0,
          //   score4: 0,
          //   score5: 0,
          //   userid: 1003
          // });
          this.serverData = res.data.data.scores;
          let weeksignDate = getDate(this.serverData[0].countdate, n);
          let tempData = [];
          for (let i = 0; i < weeksignDate.length; i++) {
            for (let v of chartType) {
              this.data.push({
                count: weeksignDate[i],
                value: 0,
                type: v
              });
            }
          }
          for (let item of this.data) {
            for (let v of this.serverData) {
              if (item.count == v.countdate) {
                switch (item.type) {
                  case "资源得分":
                    item.value = v.score1;
                    break;
                  case "签到得分":
                    item.value = v.score2;
                    break;
                  case "作业得分":
                    item.value = v.score3;
                    break;
                  case "评测得分":
                    item.value = v.score4;
                    break;
                }
              }
            }
          }
          this.drawing();
          console.log("分", this.serverData);
          // console.log("weeksignDate", weeksignDate);
          // console.log("this.datathis.data", this.data);
        })
        .catch(err => {});
    },
    Change(active) {
      this.Selected = active;
      this.data = [];
      if (this.Selected == "0") {
        this.getScoreinfo(this.memberuserData, getNextDate(7), 7);
      } else if (this.Selected == "1") {
        this.getScoreinfo(this.memberuserData, getNextDate(30), 30);
      } else if (this.Selected == "2") {
        this.getScoreinfo(this.memberuserData, getNextDate(180), 180);
      }
    },
    drawing() {
      if (!chart) {
        chart = new F2.Chart({
          id: this.elId,
          pixelRatio: window.devicePixelRatio
        });
        chart.source(this.data, {
          count: {
            // type: 'cat',
            tickCount: 4
            // min: 1,
            //  ticks:ticks?ticks:null,
          },
          value: {
            // type: 'timeCat',
            // mask: "hh:mm",
            // range: [0, 1],
            // ticks:ticks,
            // tickCount:6,
            // max: max,
            // min: 0,
            formatter: function formatter(ivalue) {
              return ivalue;
            }
          }
        });
        chart.axis("count", {
          line: null,
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = "left";
            } else if (index === total - 1) {
              textCfg.textAlign = "right";
            }
            return textCfg;
          }
        });
        //图例
        chart.legend({
          // align: "right"
          itemWidth: 70
          //  offsetY: 0,
          // offsetX: 150
        });
        chart.tooltip({
          showCrosshairs: true,
          showXTip: true,
          onShow: function onShow(ev) {
            // console.log(ev);
          }
        });
        //陰影chart.area()
        // chart.area().position('count*value').color('type').shape('')
        chart
          .line()
          .position("count*value")
          .color("type")
          .shape("smooth");
        chart.render();
      } else {
        chart.changeData(this.data);
        chart.source(this.data, {});
      }
    }
  }
};
</script>
<style lang="less" scoped>
.f2-main {
  .tit {
    padding: 10px;
  }
  .canvas-wrap{
    position: relative;
    span{

    }
  }
}
</style>
<style>
.van-tabs__wrap {
  width: 90%;
  margin: 0 auto;
  padding: 15px 0;
}
.van-tabs__nav {
  border: 1px solid rgb(0, 145, 250);
  border-radius: 20px;
}
.van-tab {
  display: inline-block;
  width: 33.3%;
  text-align: center;
  padding: 10px 0;
  border-radius: 20px;
}
.van-tab.van-tab--active .van-ellipsis {
  color: #fff;
}
</style>
