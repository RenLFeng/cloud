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
    <!-- <canvas :id="`myChart3${concut}`" width height="200px"></canvas> -->
    <canvas id="mychart" class="mychart-f2" height="200px"></canvas>
  </div>
</template>

<script>
import { Tab, Tabs, Button } from "vant";
import F2 from "@antv/f2/lib/index-all";
// import uuidv1 from "uuid/v1";
let chart = void 0;
let data = [
  {
    country: "资源得分",
    value: 34,
    year: 1940
  },
  {
    country: "作业得分",
    value: 43,
    year: 1940
  },
  {
    country: "评测得分",
    value: 23,
    year: 1940
  },
  {
    country: "签到得分",
    value: 56,
    year: 1940
  },

  {
    country: "资源得分",
    value: 34,
    year: 1941
  },
  {
    country: "作业得分",
    value: 12,
    year: 1941
  },
  {
    country: "评测得分",
    value: 9,
    year: 1941
  },
  {
    country: "签到得分",
    value: 55,
    year: 1941
  },

  {
    country: "资源得分",
    value: 45,
    year: 1942
  },
  {
    country: "作业得分",
    value: 76,
    year: 1942
  },
  {
    country: "评测得分",
    value: 12,
    year: 1942
  },
  {
    country: "签到得分",
    value: 45,
    year: 1942
  }
];
let data2 = [
  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1940
  },

  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1941
  },

  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1942
  }
];
let data3 = [
  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1940
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1940
  },

  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1941
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1941
  },

  {
    country: "资源得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "作业得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "评测得分",
    value: Math.random() * 1000,
    year: 1942
  },
  {
    country: "签到得分",
    value: Math.random() * 1000,
    year: 1942
  }
];
export default {
  name: "",
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
    item: (newValue, oldValue) => {
      console.log("newValue", newValue);
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
      data2,
       data3
    };
  },
  created() {
    // this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    var v = this;
    setTimeout(() => {
      this.$nextTick(() => {
        v.drawing();
      });
    }, 1000);
  },
  destroyed() {
    chart.destroy();
    chart = null;
  },
  methods: {
    Change(active) {
      this.Selected=active;
      switch (this.Selected) {
        case 0:
          this.data = this.data2;
          this.drawing();
          break;
        case 1:
          this.data = this.data3;
          this.drawing();
          break;
        case 2:
          this.data = this.data2;
          this.drawing();
          break;
      }
    },
    drawing() {
      if (!chart) {
        chart = new F2.Chart({
          id: "mychart",
          pixelRatio: window.devicePixelRatio
        });

        chart.source(this.data, {
          value: {
            // type: 'cat',
            tickCount: 5
            // min: 1,
            //  ticks:ticks?ticks:null,
          },
          year: {
            // type: 'timeCat',
            // mask: "hh:mm",
            // range: [0, 1],
            // ticks:[0,2,4,6,8,10,12,14,16,18,20,22,24],
            // tickCount:5,
            // max: 100,
            // min: 0,
            formatter: function formatter(ivalue) {
              return ivalue;
            }
          }
        });
        chart.scale("year", {});
        // tooltip 与图例结合
        chart.tooltip({
          showXTip: true,
          snap: true,
          crosshairsType: "xy",
          crosshairsStyle: {
            lineDash: [2]
          }
        });

        chart
          .line()
          .position("year*value")
          .color("country")
          .shape("smooth");
        chart.render();
      } else {
        chart.changeData(this.data);
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
