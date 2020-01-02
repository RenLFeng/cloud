<template>
  <div class="f2-main-content">
    <mt-header title="得分统计" style="margin-bottom: 10px;" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
    </mt-header>
    <div class="chart-item">
      <h3 class="tit">资源得分情况</h3>
      <Table @tableSelected="onTableSelected" type="score1" />
      <div class="canvas-wrap">
        <canvas id="chart1" width height="200px" class="mychart-f2"></canvas>
        <span v-if="!serverData.length" class="content-warp">暂无数据...</span>
      </div>
    </div>
    <div class="chart-item">
      <h3 class="tit">签到得分情况</h3>
      <Table @tableSelected="onTableSelected" type="score2" />
      <div class="canvas-wrap">
        <canvas id="chart2" width height="200px" class="mychart-f2"></canvas>
        <span v-if="!serverData.length" class="content-warp">暂无数据...</span>
      </div>
    </div>
    <div class="chart-item">
      <h3 class="tit">作业得分情况</h3>
      <Table @tableSelected="onTableSelected" type="score3" />
      <div class="canvas-wrap">
        <canvas id="chart3" width height="200px" class="mychart-f2"></canvas>
        <span v-if="!serverData.length" class="content-warp">暂无数据...</span>
      </div>
    </div>
    <div class="chart-item">
      <h3 class="tit">评测得分情况</h3>
      <Table @tableSelected="onTableSelected" type="score4" />
      <div class="canvas-wrap">
        <canvas id="chart4" width height="200px" class="mychart-f2"></canvas>
        <span v-if="!serverData.length" class="content-warp">暂无数据...</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, Tabs, Button } from "vant";
import F2 from "@antv/f2/lib/index-all";
import { getDate, formateTime, getChartDate, getNextDate } from "../../util";
const chartType = ["最高分", "最低分", "平均分"];
import uuidv1 from "uuid/v1";
import Table from "./vanTable";
let chart = void 0;
let chart2 = void 0;
let chart3 = void 0;
let chart4 = void 0;
export default {
  name: "AverageScore",
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
  watch: {},
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
    Table
  },
  data() {
    return {
      classid: 0,
      index: 0,
      score1InitState: true,
      score2InitState: true,
      score3InitState: true,
        score4InitState:true,

      score1Data: [],
      score2Data: [],
      score3Data: [],
        score4Data:[],
      serverData: [],
      memberuserData: {}
    };
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    if (this.$route.params) {
      let params = this.$route.params;
      this.classid = params.classid;
    }
    this.getScoreinfo(getNextDate(7), 7);
  },
  methods: {
    getScoreinfo(start, n) {
      console.log("scoreinfo");
      this.$http
        .post("api/bankecount/scoreinfo", {
          userids: [1, 2, 3],
          classid: this.classid,
          startdate: start,
          enddate: getNextDate(0),
          pagesize: 1000
        })
        .then(res => {
          if (res.data.code == "0") {
            // res.data.data.scores.push({
            //   classid: 1000,
            //   countdate: "2019/11/21",
            //   id: 1006,
            //   score1: 90,
            //   score2: 80,
            //   score3: 70,
            //   score4: 0,
            //   score5: 0,
            //   userid: 3
            // });
            // res.data.data.scores.push({
            //   classid: 1000,
            //   countdate: "2019/11/21",
            //   id: 1006,
            //   score1: 60,
            //   score2: 50,
            //   score3: 40,
            //   score4: 0,
            //   score5: 0,
            //   userid: 2
            // });
            // res.data.data.scores.push({
            //   classid: 1000,
            //   countdate: "2019/11/21",
            //   id: 1006,
            //   score1: 55,
            //   score2: 45,
            //   score3: 35,
            //   score4: 0,
            //   score5: 0,
            //   userid: 1
            // });
            this.serverData = res.data.data.scores;
            let weeksignDate = getChartDate(n, null);//getDate(this.serverData[0].countdate, n);
            let tempData = [];
           // console.log(weeksignDate);
            for (let i = 0; i < weeksignDate.length; i++) {
              for (let v of chartType) {
                this.score1Data.push({
                  count: weeksignDate[i],
                  value: 0,
                  type: v
                });
                this.score2Data.push({
                  count: weeksignDate[i],
                  value: 0,
                  type: v
                });
                this.score3Data.push({
                  count: weeksignDate[i],
                  value: 0,
                  type: v
                });
                  this.score4Data.push({
                      count: weeksignDate[i],
                      value: 0,
                      type: v
                  });
              }
            }
            //score1
            if (this.score1InitState) {
              for (let item of this.score1Data) {
                for (let v of this.serverData) {
                  if (item.count == v.countdate) {
                    switch (item.type) {
                      case "最高分":
                        if (v.userid == "3") {
                          item.value = v.score1;
                        }
                        break;
                      case "最低分":
                        if (v.userid == "2") {
                          item.value = v.score1;
                        }
                        break;
                      case "平均分":
                        if (v.userid == "1") {
                          item.value = v.score1;
                        }
                        break;
                    }
                  }
                }
              }
            }
            //score2
            if (this.score2InitState) {
              for (let item of this.score2Data) {
                for (let v of this.serverData) {
                  if (item.count == v.countdate) {
                    switch (item.type) {
                      case "最高分":
                        if (v.userid == "3") {
                          item.value = v.score2;
                        }
                        break;
                      case "最低分":
                        if (v.userid == "2") {
                          item.value = v.score2;
                        }
                        break;
                      case "平均分":
                        if (v.userid == "1") {
                          item.value = v.score2;
                        }
                        break;
                    }
                  }
                }
              }
            }
            //score3
            if (this.score3InitState) {
              for (let item of this.score3Data) {
                for (let v of this.serverData) {
                  if (item.count == v.countdate) {
                    switch (item.type) {
                      case "最高分":
                        if (v.userid == "3") {
                          item.value =v.score3<0?0:v.score3;
                        }
                        break;
                      case "最低分":
                        if (v.userid == "2") {
                          item.value = v.score3<0?0:v.score3;
                        }
                        break;
                      case "平均分":
                        if (v.userid == "1") {
                          item.value = v.score3<0?0:v.score3;
                        }
                        break;
                    }
                  }
                }
              }
            }

              //score4
              if (this.score4InitState) {
                  for (let item of this.score4Data) {
                      for (let v of this.serverData) {
                          if (item.count == v.countdate) {
                              switch (item.type) {
                                  case "最高分":
                                      if (v.userid == "3") {
                                          item.value = v.score4;
                                      }
                                      break;
                                  case "最低分":
                                      if (v.userid == "2") {
                                          item.value = v.score4;
                                      }
                                      break;
                                  case "平均分":
                                      if (v.userid == "1") {
                                          item.value = v.score4;
                                      }
                                      break;
                              }
                          }
                      }
                  }
              }
          }

          this.chartInit();
          console.log("serverData", this.serverData);
          // console.log("weeksignDate", weeksignDate);
          // console.log("this.score1Data.data", this.score1Data);
          // console.log("this.score2Data.data", this.score2Data);
          // console.log("this.score3Data.data", this.score3Data);
        })
        .catch(err => {});
    },
    score1AverageScore() {
      if (!chart) {
        chart = new F2.Chart({
          id: "chart1",
          pixelRatio: window.devicePixelRatio
        });
        chart.source(this.score1Data, {
          count: {
            tickCount: 4
          },
          value: {
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
        chart
          .line()
          .position("count*value")
          .color("type")
          .shape("smooth");
        chart.render();
      } else {
        chart.changeData(this.score1Data);
        chart.source(this.score1Data, {});
      }
    },
    score2AverageScore() {
      if (!chart2) {
        chart2 = new F2.Chart({
          id: "chart2",
          pixelRatio: window.devicePixelRatio
        });
        chart2.source(this.score2Data, {
          count: {
            tickCount: 4
          },
          value: {
            formatter: function formatter(ivalue) {
              return ivalue;
            }
          }
        });
        chart2.axis("count", {
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
        chart2.legend({
          // align: "right"
          itemWidth: 70
          //  offsetY: 0,
          // offsetX: 150
        });
        chart2.tooltip({
          showCrosshairs: true,
          showXTip: true,
          onShow: function onShow(ev) {
            // console.log(ev);
          }
        });
        chart2
          .line()
          .position("count*value")
          .color("type")
          .shape("smooth");
        chart2.render();
      } else {
        chart2.changeData(this.score2Data);
        chart2.source(this.score2Data, {});
      }
    },
    score3AverageScore() {
      if (!chart3) {
        chart3 = new F2.Chart({
          id: "chart3",
          pixelRatio: window.devicePixelRatio
        });
        chart3.source(this.score3Data, {
          count: {
            tickCount: 4
          },
          value: {
            formatter: function formatter(ivalue) {
              return ivalue;
            }
          }
        });
        chart3.axis("count", {
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
        chart3.legend({
          // align: "right"
          itemWidth: 70
          //  offsetY: 0,
          // offsetX: 150
        });
        chart3.tooltip({
          showCrosshairs: true,
          showXTip: true,
          onShow: function onShow(ev) {
            // console.log(ev);
          }
        });
        chart3
          .line()
          .position("count*value")
          .color("type")
          .shape("smooth");
        chart3.render();
      } else {
        chart3.changeData(this.score3Data);
        chart3.source(this.score3Data, {});
      }
    },
      score4AverageScore() {
          if (!chart4) {
              chart4 = new F2.Chart({
                  id: "chart4",
                  pixelRatio: window.devicePixelRatio
              });
              chart4.source(this.score4Data, {
                  count: {
                      tickCount: 4
                  },
                  value: {
                      formatter: function formatter(ivalue) {
                          return ivalue;
                      }
                  }
              });
              chart4.axis("count", {
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
              chart4.legend({
                  // align: "right"
                  itemWidth: 70
                  //  offsetY: 0,
                  // offsetX: 150
              });
              chart4.tooltip({
                  showCrosshairs: true,
                  showXTip: true,
                  onShow: function onShow(ev) {
                      // console.log(ev);
                  }
              });
              chart4
                  .line()
                  .position("count*value")
                  .color("type")
                  .shape("smooth");
              chart4.render();
          } else {
              chart4.changeData(this.score4Data);
              chart4.source(this.score4Data, {});
          }
      },
    chartInit() {
      if (this.score1InitState) {
        this.score1AverageScore();
      }
      if (this.score2InitState) {
        this.score2AverageScore();
      }
      if (this.score3InitState) {
        this.score3AverageScore();
      }
        if (this.score4InitState) {
            this.score4AverageScore();
        }
    },
    onTableSelected(v) {
      this.index = v.index;
      // console.log("kfhlks", v);
      this.score1InitState = false;
      this.score2InitState = false;
      this.score3InitState = false;
      this.score4InitState = false;
      switch (v.type) {
        case "score1":
          this.score1Data = [];
          this.score1InitState = true;
          this.changeTable(this.index);
          break;
        case "score2":
          this.score2Data = [];
          this.score2InitState = true;
          this.changeTable(this.index);
          break;
        case "score3":
          this.score3Data = [];
          this.score3InitState = true;
          this.changeTable(this.index);
          break;
          case "score4":
              this.score4Data = [];
              this.score4InitState = true;
              this.changeTable(this.index);
              break;
      }
    },
    changeTable(index) {
      if (index == "0") {
        this.getScoreinfo(getNextDate(7), 7);
      } else if (index == "1") {
        this.getScoreinfo(getNextDate(30), 30);
      } else if (index == "2") {
        this.getScoreinfo(getNextDate(180), 180);
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  destroyed() {
    if (chart !== undefined) {
      // chart.destroy();
      chart = null;
    }
    if (chart2 !== undefined) {
      // chart2.destroy();
      chart2 = null;
    }
    if (chart3 !== undefined) {
      // chart3.destroy();
      chart3 = null;
    }
    if (chart4 !== undefined){
        chart4 = null;
    }
  }
};
</script>
<style lang="less" scoped>
.f2-main-content {
  .chart-item {
    background: #fff;
    .canvas-wrap {
      position: relative;
      span {
      }
    }
  }

  .tit {
    padding: 10px;
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
