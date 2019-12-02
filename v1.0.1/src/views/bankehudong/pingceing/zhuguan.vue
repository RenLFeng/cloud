<template>
  <div class="footer-item-z">
    <ul class="clearfix">
      <li class="fl">
        <i class="iconfont iconxiangji eicotrigger" style="color:#0089FF"></i>
      </li>
      <li class="fl">
        <i class="iconfont iconmomentwritepicture eicotrigger" style="color:#0089FF"></i>
      </li>
      <li class="fl">
        <i class="iconfont iconhuabi eicotrigger" style="color:#0089FF" @click="draw()"></i>
      </li>
    </ul>
    <p class="submit-btn">
      <mt-button type="default" :class="isSubmit?'act':''" @click="sumint">提交</mt-button>
    </p>

    <mt-popup
      v-model="popupDraw"
      position="right"
      class="mint-popup draw"
      :modal="false"
      style="background:#000"
    >
      <mt-header title>
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <div class="draw-main" @mousemove="beginPath($event)" id="mydraw">
        <img :src="pingceData.files" alt />
        <canvas
          id="canvas"
          class="fl"
          width="600"
          height="400"
          @mousedown="canvasDown($event)"
          @mouseup="canvasUp($event)"
          @mousemove="canvasMove($event)"
          @touchstart="canvasDown($event)"
          @touchend="canvasUp($event)"
          @touchmove="canvasMove($event)"
        ></canvas>
      </div>
      <div class="tool-main">
        <ul class="clearfix">
          <li class="fl colors" v-for="(v,i) in colors" :key="i" @click="setColor(v)">
            <span style="background:#fff">
              <a :style="{background:v}" :class="config.lineColor==v?'act':''"></a>
            </span>
          </li>
        </ul>
        <div class="btn-main clearfix">
          <p class="fl" @click="controlCanvas('')">
            <i class="iconfont iconhuabi eicotrigger" style="color:#0089FF"></i>
          </p>
          <p class="fl" @click="controlCanvas('clear')">
            <i class="iconfont iconxiangpi eicotrigger" style="color:#fff"></i>
          </p>
          <p class="fl" @click="controlCanvas('prev')">
            <i class="iconfont iconwithdraw eicotrigger" style="color:#fff"></i>
          </p>
          <p class="fl" @click="getImage">
            <mt-button>确定</mt-button>
          </p>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { Button, Indicator, Toast, MessageBox, Field } from "mint-ui";
const colors = [
  "#FF0000",
  "#FF8900",
  "#FFDD00",
  "#00FF43",
  "#38ADA9",
  "#0089FF",
  "#C500FF"
];
export default {
  name: "",
  props: {
    pingceData: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      colors,
      brushs: [
        {
          className: "small fa fa-paint-brush",
          lineWidth: 3
        },
        {
          className: "middle fa fa-paint-brush",
          lineWidth: 6
        },
        {
          className: "big fa fa-paint-brush",
          lineWidth: 12
        }
      ],
      context: {},
      imgUrl: "",
      canvasMoveUse: true,
      // 存储当前表面状态数组-上一步
      preDrawAry: [],
      // 存储当前表面状态数组-下一步
      nextDrawAry: [],
      // 中间数组
      middleAry: [],
      // 配置参数
      config: {
        lineWidth: 1,
        lineColor: "",
        shadowBlur: 2
      },

      popupDraw: false,
      isSubmit: false,
      imgData: ""
    };
  },
  created() {
    this.$emit("setNav", "在线涂鸦画板");
  },
  mounted() {
    const canvas = document.querySelector("#canvas");
    this.context = canvas.getContext("2d");
    this.config.lineColor = this.colors[3];
    this.initDraw();
    this.setCanvasStyle();
  },
  destroyed() {},
  computed: {},
  methods: {
    isPc() {
      const userAgentInfo = navigator.userAgent;
      const Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      ];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    removeImg() {
      this.imgUrl = "";
    },
    initDraw() {
      const preData = this.context.getImageData(0, 0, 600, 400);
      // 空绘图表面进栈
      this.middleAry.push(preData);
    },
    canvasMove(e) {
      if (this.canvasMoveUse) {
        console.log("canvasMove");
        const t = e.target;
        let canvasX;
        let canvasY;
        if (this.isPc()) {
          canvasX = e.clientX - t.parentNode.offsetLeft;
          canvasY = e.clientY - t.parentNode.offsetTop;
        } else {
          canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
          canvasY = e.changedTouches[0].clientY - t.parentNode.offsetTop;
        }
        this.context.lineTo(canvasX, canvasY);
        this.context.stroke();
      }
    },
    beginPath(e) {
      const canvas = document.querySelector("#canvas");
      if (e.target !== canvas) {
        console.log("beginPath");
        this.context.beginPath();
      }
    },
    // mouseup
    canvasUp(e) {
      console.log("canvasUp");
      const preData = this.context.getImageData(0, 0, 600, 400);
      if (!this.nextDrawAry.length) {
        // 当前绘图表面进栈
        this.middleAry.push(preData);
      } else {
        this.middleAry = [];
        this.middleAry = this.middleAry.concat(this.preDrawAry);
        this.middleAry.push(preData);
        this.nextDrawAry = [];
      }
      this.canvasMoveUse = false;
    },
    // mousedown
    canvasDown(e) {
      console.log("canvasDown");
      this.canvasMoveUse = true;
      // client是基于整个页面的坐标
      // offset是cavas距离顶部以及左边的距离
      const canvasX = e.clientX - e.target.parentNode.offsetLeft;
      const canvasY = e.clientY - e.target.parentNode.offsetTop;
      this.setCanvasStyle();
      // 清除子路径
      this.context.beginPath();
      this.context.moveTo(canvasX, canvasY);
      console.log("moveTo", canvasX, canvasY);
      // 当前绘图表面状态
      const preData = this.context.getImageData(0, 0, 600, 400);
      // 当前绘图表面进栈
      this.preDrawAry.push(preData);
    },
    // 设置颜色
    setColor(color) {
      this.config.lineColor = color;
    },
    // 设置笔刷大小
    setBrush(type) {
      this.config.lineWidth = type;
    },
    // 操作
    controlCanvas(action) {
      switch (action) {
        case "prev":
          if (this.preDrawAry.length) {
            const popData = this.preDrawAry.pop();
            const midData = this.middleAry[this.preDrawAry.length + 1];
            this.nextDrawAry.push(midData);
            this.context.putImageData(popData, 0, 0);
          }
          break;
        case "next":
          if (this.nextDrawAry.length) {
            const popData = this.nextDrawAry.pop();
            const midData = this.middleAry[
              this.middleAry.length - this.nextDrawAry.length - 2
            ];
            this.preDrawAry.push(midData);
            this.context.putImageData(popData, 0, 0);
          }
          break;
        case "clear":
          this.context.clearRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
          );
          this.preDrawAry = [];
          this.nextDrawAry = [];
          this.middleAry = [this.middleAry[0]];
          break;
      }
    },
    // 生成图片
    getImage() {
      html2canvas(document.querySelector("#mydraw")).then(c => {
        this.imgUrl = c.toDataURL("image/jpeg");
        this.isSubmit = true;
        this.goBacks();
        console.log("生成图片", this.imgUrl);
      });

      // const canvas = document.querySelector("#canvas");
      // const src = canvas.toDataURL("image/jpeg ");
      // this.imgUrl = src;
      // this.isSubmit = true;
      // console.log("生成图片", this.imgUrl);
      // this.controlCanvas('clear');
      // this.goBacks();
      //   if (!this.isPc()) {
      //     // window.open(`data:text/plain,${src}`)
      //     window.location.href = src;
      //   }
    },
    // 设置绘画配置
    setCanvasStyle() {
      this.context.lineWidth = this.config.lineWidth;
      this.context.shadowBlur = this.config.shadowBlur;
      this.context.shadowColor = this.config.lineColor;
      this.context.strokeStyle = this.config.lineColor;
    },

    sumint() {
      if (!this.isSubmit) {
        Toast("请绘制");
        return;
      }
      this.$emit("submitFn", this.imgUrl);
      this.imgUrl = "";
       this.isSubmit = false;
      this.controlCanvas("clear");
    },
    draw() {
      this.popupDraw = true;
    },
    goBacks() {
      if (this.popupDraw) {
        this.popupDraw = false;
      }
    }
  }
};
</script>

<style lang='less'>
.footer-item-z {
  #pic {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999999999;
  }
  .mint-header {
    background-color: #000 !important;
  }
  ul {
    padding: 40px 0;
    margin-bottom: 0;
    li {
      width: 25%;
      margin: 0 4%;
      text-align: center;
      i {
        font-size: 35px;
      }
    }
  }
  .submit-btn {
    position: absolute;
    width: 80%;
    left: 50%;
    bottom: -60px;
    transform: translate(-50%, 0);
    button {
      width: 100%;
      background: #aaa;
      border-radius: 20px;
      color: #fff;
      &.act {
        background: #3ee17f;
      }
    }
  }
  .draw {
    .draw-main {
      position: relative;
      .canvas2 {
        position: absolute;
        left: 0;
        top: 0;
      }
      canvas {
        position: absolute;
        left: 0;
        top: 0;
      }
      img {
        width: 100%;
        height: 200px;
        margin: 110px auto;
      }
    }
    .tool-main {
      position: fixed;
      width: 100%;
      bottom: 25px;
      .colors {
        width: 10%;
        margin: 0 2.1%;
        padding: 10px 0;
        span {
          position: relative;
          display: block;
          width: 30px;
          height: 30px;
          border-radius: 20px;
          a {
            position: absolute;
            display: block;
            width: 80%;
            height: 80%;
            top: 50%;
            left: 50%;
            border-radius: 20px;
            transform: translate(-50%, -50%);
            transition: all 0.3s;
            &.act {
              width: 110%;
              height: 110%;
            }
          }
        }
      }
      .btn-main {
        p {
          width: 20%;
          margin: 0 2.5%;
          i {
            font-size: 35px;
          }
          button {
            background: #0089ff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
