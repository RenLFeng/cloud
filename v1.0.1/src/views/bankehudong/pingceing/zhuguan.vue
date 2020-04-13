<template>
  <div class="footer-item-z">
    <!-- <img :src="imgUrl" alt="" class="imgUrl"> -->
    <ul class="clearfix">
      <!--
      <li class="fl">
        <i class="iconfont iconxiangji eicotrigger" style="color:#0089FF" @click="unloadFn"></i>
      </li>
      -->
      <li class="fl">
        <i
          class="iconfont iconmomentwritepicture eicotrigger"
          style="color:#0089FF"
          @click="unloadFn"
        ></i>
      </li>
      <li class="fl">
        <i class="iconfont iconhuabi eicotrigger" style="color:#0089FF" @click="draw()"></i>
      </li>
    </ul>
    <p class="submit-btn">
      <mt-button type="default" :class="isSubmit?'act':''" @click="sumint">{{isSubmitEnd?'已提交':'提交'}}</mt-button>
    </p>
    <input
      ref="uploadPic"
      type="file"
      name="file"
      class="upload"
      @change="uploadChange"
      style="display:none"
      accept="image/*"
    />
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
      <div class="draw-wrap">
        <!--
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
        -->
        <div
          class="mydraw-main"
          id="mydraw"
          ref="drawwrap"
          @touchstart="cwraptstart($event)"
          @touchend="cwraptend($event)"
          @touchmove="cwraptmove($event)"
        >
          <canvas
            ref="drawcanvas"
            :style="drawcstyle"
            id="mycanvas"
            @mousedown="mouseststart($event)"
            @mousemove="mousestmove($event)"
            @mouseup="mousestup($event)"
            @touchstart="canvaststart($event)"
            @touchend="canvastend($event)"
            @touchmove="canvastmove($event)"
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
            <!--
          <p class="fl" @click="controlCanvas('prev')">
            <i class="iconfont iconwithdraw eicotrigger" style="color:#fff"></i>
          </p>
            -->
            <p class="fl" @click="getImage">
              <mt-button>确定</mt-button>
            </p>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { Button, Indicator, Toast, MessageBox, Field } from "mint-ui";

import { fixCaptureImage } from "@/util";

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
    },
    submited: {
      default: false
    }
  },
  watch: {
    submited: function(newValue, oldValue) {
      this.isSubmitEnd = newValue;
    }
  },
  data() {
    return {
      isSubmitEnd: false,
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

      selfile: null,

      //! cjy: 绘制相关参数
      drawdata: {
        wrapwidth: 0,
        wrapheight: 0,
        wrapleft: 0,
        wraptop: 0,
        cwidth: 0,
        cheight: 0,
        scale: 1.0,
        minscale: 1.0,
        maxscale: 1.0,
        cleft: 0,
        ctop: 0,
        mincleft: 0,
        minctop: 0,
        imgwidth: 0,
        imgheight: 0,
        ctx: null,
        img: null,
        lasttouches: [],
          lastmouse:{},
        touchmode: "", //! multi single draw
        usegesture: null
      },

      popupDraw: false,
      isSubmit: false,
      imgData: "",

        defaultimgurl:'',  //! 默认图片

      uploadData: {}
    };
  },
  created() {
    this.$emit("setNav", "在线涂鸦画板");
  },
  mounted() {
    // const canvas = document.querySelector("#canvas");
    // this.context = canvas.getContext("2d");
    this.config.lineColor = colors[0];
    // this.initDraw();
    // this.setCanvasStyle();
  },
  destroyed() {},
  computed: {
    drawcstyle() {
      return {
        position: "absolute",
        left: `${this.drawdata.cleft}px`,
        top: `${this.drawdata.ctop}px`,
        transform: `scale(${this.drawdata.scale})`
      };
    }
  },
  methods: {
    unloadFn() {
      this.$refs.uploadPic.click();
    },
    uploadChange(e) {
      console.log("updatechange");
      // console.log(file);
      let that = this;
      let file = e.target.files[0];
      // this.uploadImg(file);
      if (file) {
        // this.selfile = file;
        //  let url = URL.createObjectURL(file);
        //   this.pingceData.editimgurl = url;
        fixCaptureImage(file).then(res => {
          //  this.selfile = res;
          //  let url = URL.createObjectURL(res);
          this.isSubmit = true;
          this.pingceData.editimgurl = res;
        });
      }

      this.$refs.uploadPic.value = "";
    },
    uploadimgbase64() {
      console.log("uploadimgbase64");
      Indicator.open("上传中...");
      this.$http
        .post("/api/pingce/savejpeg", {
          jpeg: this.pingceData.editimgurl
        })
        .then(res => {
          console.log(res);
          Indicator.close();
          if (res.data.code == 0) {
            this.uploadData = res.data.data;
            this.isSubmit = true;
            this.imgUrl = this.uploadData.filepath;
            this.selfile = null;
            this.sumint();
          } else {
            Indicator.close();
          }
        })
        .catch(res => {
          Toast("异常");
          console.log(res);
          Indicator.close();
        });
    },
    uploadImg(file) {
      let that = this;
      let formdata = new FormData();
      formdata.append("file", file);
      Indicator.open("上传中...");
      this.$http
        .post("/api/api/pingcefileupload", formdata)
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            console.log(res);
            //  Toast('成功');
            this.uploadData = res.data.data;
            this.isSubmit = true;
            this.imgUrl = this.uploadData.filepath;
            this.selfile = null;
            this.sumint();
          } else {
            Toast("失败");
          }
          Indicator.close();
        })
        .catch(res => {
          Toast("异常");
          console.log(res);
          Indicator.close();
        });
    },
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
      //   const preData = this.context.getImageData(0, 0, 600, 400);
      // 空绘图表面进栈
      //  this.middleAry.push(preData);
    },
      mousestmove(e){
          if (this.drawdata.touchmode == "draw") {
              e.preventDefault();
              let pos = {};
              pos.x = e.pageX;
              pos.y = e.pageY;
              pos = this.clienttocanvas(pos);
              let ctx = this.drawdata.ctx;
              ctx.lineTo(pos.x, pos.y);
              ctx.stroke();
          } else if (this.drawdata.touchmode == "begindraw") {
              this.drawdata.touchmode = "draw";
              {
                  this.cdrawsetstyle();
                  let ctx = this.drawdata.ctx;
                  ctx.beginPath();
                  let pos = {
                      x: e.pageX,
                      y: e.pageY,
                  };
                  pos = this.clienttocanvas(pos);
                  ctx.moveTo(pos.x, pos.y);
                  e.preventDefault();
              }
          }
      },
    canvastmove(e) {
      if (e.touches.length != 1) {
        return;
      }
      if (this.drawdata.touchmode == "draw") {
        e.preventDefault();
        let pos = {};
        pos.x = e.touches[0].clientX;
        pos.y = e.touches[0].clientY;
        pos = this.clienttocanvas(pos);
        let ctx = this.drawdata.ctx;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (this.drawdata.touchmode == "begindraw") {
        this.drawdata.touchmode = "draw";
        {
          this.cdrawsetstyle();
          let ctx = this.drawdata.ctx;
          ctx.beginPath();
          let pos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
          pos = this.clienttocanvas(pos);
          ctx.moveTo(pos.x, pos.y);
          e.preventDefault();
        }
      }
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
      mousestup(e){
          if (this.drawdata.touchmode == "draw") {
              e.preventDefault();
              this.drawdata.touchmode = "";
          }
      },
    canvastend(e) {
      if (this.drawdata.touchmode == "draw") {
        e.preventDefault();
        this.drawdata.touchmode = "";
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
    cwraptend(e) {
      if (this.drawdata.touchmode.length > 0) {
        e.preventDefault();
      }
      this.drawdata.touchmode = "";
    },
    touchgetdist(et1, et2) {
      let ni = (et1.clientX - et2.clientX) * (et1.clientY - et2.clientY);
      if (ni < 0) {
        ni = ni * -1;
      }
      return ni;
    },
    touchgetmove(curtouches, lasttouches, checkshrehold) {
      let dx = curtouches[0].clientX - lasttouches[0].clientX;
      let dy = curtouches[0].clientY - lasttouches[0].clientY;
      let shrehold = 1;
      if (
        !checkshrehold ||
        Math.abs(dx) >= shrehold ||
        Math.abs(dy) >= shrehold
      ) {
        return {
          action: "move",
          dx: dx,
          dy: dy
        };
      }
      return null;
    },
    detectGesture(curtouches, lasttouches, usegesture) {
      if (curtouches.length > 1 && lasttouches.length > 1) {
        let curdist = 0; //this.touchgetdist(curtouches[0], curtouches[1]);
        let lastdist = 0; //this.touchgetdist(lasttouches[0], lasttouches[1]);

        let xdist =
          Math.abs(curtouches[0].clientX - curtouches[1].clientX) -
          Math.abs(lasttouches[0].clientX - lasttouches[1].clientX);
        let ydist =
          Math.abs(curtouches[0].clientY - curtouches[1].clientY) -
          Math.abs(lasttouches[0].clientY - lasttouches[1].clientY);

        let mixdist = xdist + ydist;
        let mixshrehold = 200;

        let shrehold = 0; //Math.max(10*10, lastdist * 0.01);
        // shrehold = 10 * 10;
        shrehold = 1.0;
        let doubleshrehold = shrehold * 4;
        let curgesture = null;

        if (
          (xdist >= shrehold && ydist >= shrehold) ||
          (xdist >= 0 && ydist >= 0 && xdist + ydist >= doubleshrehold)
          //  || mixdist >= mixshrehold
        ) {
          curgesture = {
            action: "scale",
            scale: 1,
            dist: curdist - lastdist
          };
        } else if (
          (xdist <= -shrehold && ydist <= -shrehold) ||
          (xdist <= 0 && ydist <= 0 && xdist + ydist <= -doubleshrehold)
          //  ||  mixdist <= -mixshrehold
        ) {
          curgesture = {
            action: "scale",
            scale: 0,
            dist: lastdist - curdist
          };
        }
        //if (Math.abs(xdist) < shrehold && Math.abs(ydist) < shrehold)
        else {
          //  if (Math.abs(xdist) <= shrehold/2 && Math.abs(ydist)<=shrehold/2)
          curgesture = this.touchgetmove(curtouches, lasttouches, true);
        }
        if (
          usegesture &&
          curgesture &&
          curgesture.action != usegesture.action
        ) {
          // return null;
          if (usegesture.action == "move") {
            return this.touchgetmove(curtouches, lasttouches, false);
          }
          return usegesture;
          return curgesture;
        }

        // if (curgesture.dist ){
        //     if (curgesture.dist > 500){
        //         console.log('detectgesture. curdist:'+curdist + "  lastdist:"+lastdist);
        //     }
        // }

        // if (curgesture.action == 'scale' && usegesture){
        //     if (curgesture.scale != usegesture.scale){
        //         if (curgesture.dist < usegesture.dist * 1.2)
        //         {
        //             //return null;
        //         }
        //         usegesture.dist = curgesture.dist;
        //     }
        // }

        if (usegesture == null) {
          console.log("xdist:" + xdist + " ydist:" + ydist);
          let szlog = "xdist:" + xdist + " ydist:" + ydist;
          //  alert(szlog);
        }

        return curgesture;
      } else if (curtouches.length == 1 && lasttouches.length == 1) {
        let curgesture = this.touchgetmove(curtouches, lasttouches);
        return curgesture;
      }
      return null;
    },
    cdrawscale(zoomout) {
      let curz = this.drawdata.scale;
      let fstep = 1.05;

      if (zoomout) {
        curz *= fstep;
      } else {
        curz /= fstep;
      }
      if (curz < this.drawdata.minscale) {
        curz = this.drawdata.minscale;
      }
      if (curz > this.drawdata.maxscale) {
        curz = this.drawdata.maxscale;
      }
      this.drawdata.scale = curz;
      //! 重设pos
      this.cdrawsetpos(this.drawdata.cleft, this.drawdata.ctop);
    },
    cdrawstep(dx, dy) {
      let usex = dx / this.drawdata.scale;
      let usey = dy / this.drawdata.scale;
      usex = this.drawdata.cleft + usex;
      usey = this.drawdata.ctop + usey;
      //! tudo. 检测区域范围
      //this.drawdata.cleft = usex;
      // this.drawdata.ctop = usey;
      this.cdrawsetpos(usex, usey);
    },
    cdrawsetpos(cleft, ctop) {
      let widthrange =
        this.drawdata.cwidth * this.drawdata.scale - this.drawdata.wrapwidth;
      let heightrange =
        this.drawdata.cheight * this.drawdata.scale - this.drawdata.wrapheight;
      if (widthrange < 0) {
        widthrange = 0;
      }
      if (heightrange < 0) {
        heightrange = 0;
      }
      widthrange /= 2;
      heightrange /= 2;
      // console.log('widthrange:'+widthrange);
      if (cleft < this.drawdata.mincleft - widthrange) {
        cleft = this.drawdata.mincleft - widthrange;
      }
      if (cleft > this.drawdata.mincleft + widthrange) {
        cleft = this.drawdata.mincleft + widthrange;
      }
      if (ctop < this.drawdata.minctop - heightrange) {
        ctop = this.drawdata.minctop - heightrange;
      }
      if (ctop > this.drawdata.minctop + heightrange) {
        ctop = this.drawdata.minctop + heightrange;
      }
      this.drawdata.cleft = cleft;
      this.drawdata.ctop = ctop;
    },
    cwraptmove(e) {
      if (this.drawdata.touchmode == "multi") {
        let gesture = this.detectGesture(
          e.touches,
          this.drawdata.lasttouches,
          this.drawdata.usegesture
        );

        if (gesture) {
          this.drawdata.lasttouches = e.touches;
          if (!this.drawdata.usegesture) {
            this.drawdata.usegesture = gesture; //! 确定当前的gesture模式
            console.log("detect gesture");
            console.log(e);
            console.log(gesture);
          } else {
            if (gesture) {
              this.drawdata.usegesture = gesture;
            }
          }
          if (gesture.action == "scale") {
            this.cdrawscale(gesture.scale);
          } else if (gesture.action == "move") {
            this.cdrawstep(gesture.dx, gesture.dy);
          }
        }
      }
      if (this.drawdata.touchmode.length > 0) {
        e.preventDefault();
      }
    },
    cwraptstart(e) {
      //  console.log('cwrapstart:');
      //   console.log(e);
      if (
        this.drawdata.touchmode == "draw" ||
        this.drawdata.touchmode == "begindraw"
      ) {
        return;
      }
      if (e.touches.length > 0) {
        this.drawdata.lasttouches = e.touches;
        this.drawdata.touchmode = "multi";
      }

      if (this.drawdata.touchmode.length > 0) {
        this.drawdata.usegesture = null;
        e.preventDefault();
      }
    },
    clienttowrap(pos) {
      //! client坐标转换为wrap内坐标
      if (pos.x) {
        let rret = {};
        rret.x = pos.x - this.drawdata.wrapleft;
        rret.y = pos.y - this.drawdata.wraptop;
        return rret;
      }
      return null;
    },
    clienttocanvas(pos) {
      //! 坐标转换， client坐标转换为canvas内坐标
      return this.wraptocanvas(this.clienttowrap(pos));
    },
    wraptocanvas(pos) {
      //! 坐标转换， wrap坐标转换为canvas坐标
      if (pos.x) {
        let rret = { x: 0, y: 0 };
        rret.x =
          pos.x -
          this.drawdata.cleft -
          (this.drawdata.cwidth / 2) * (1.0 - this.drawdata.scale);
        rret.y =
          pos.y -
          this.drawdata.ctop -
          (this.drawdata.cheight / 2) * (1.0 - this.drawdata.scale);
        rret.x /= this.drawdata.scale;
        rret.y /= this.drawdata.scale;
        return rret;
      }
      return pos;
    },
      mouseststart(e){
        console.log('mousestart');
        console.log(e);
        e.preventDefault();
        this.drawdata.lastmouse = e;
        this.drawdata.touchmode = 'begindraw';
      },
    canvaststart(e) {
        console.log('canvaststart:');
      //  console.log(e);
      let ox = e.target.offsetLeft;
      let oy = e.target.offsetTop;
      //   console.log(e.target);
      //return ;
      //! cjy: 无法阻止冒泡
      if (e.touches.length == 1) {
        this.drawdata.lasttouches = e.touches;
        this.drawdata.touchmode = "begindraw";
      } else {
        //! 如果为多点触控， 则会先chuan'd传递length为1
        this.drawdata.touchmode = "";
      }
      // console.log('offset left:'+ox + ' offset top:'+oy + ' curmode:'+this.drawdata.touchmode);
      if (this.drawdata.touchmode.length > 0) {
        e.preventDefault();
      } else {
        this.drawdata.lasttouches = [];
      }
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
      console.log("setColor");
      this.config.lineColor = color;
    },
    // 设置笔刷大小
    setBrush(type) {
      console.log("setBrush");
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
          // this.context.clearRect(
            //   0,
            //   0,
            //   this.context.canvas.width,
            //   this.context.canvas.height
            // );
            // this.preDrawAry = [];
            // this.nextDrawAry = [];
            // this.middleAry = [this.middleAry[0]];
            this.cdrawsetimg(this.defaultimgurl);
          break;
      }
    },
    cdrawinit() {
      //console.log(this.$refs.drawwrap);
      this.drawdata.wrapwidth = this.$refs.drawwrap.offsetWidth; //! cjy: 延迟才能获得正确的宽高
      this.drawdata.wrapheight = this.$refs.drawwrap.offsetHeight;
    },
    getClientOffset(fnode) {
      //! cjy: 注意： 此方法有局限性， 只适用于不复杂的parentnode， 例如， 没有transform scale等属性
      //! 不同的page， 需要重写此函数
      let pos = { x: 0, y: 0 };
      let curnode = fnode;
      while (curnode && curnode != document.body) {
        pos.x += curnode.offsetLeft;
        pos.y += curnode.offsetTop;
        //console.log(pos);
        //console.log(curnode);
        //curnode = curnode.offsetParent;
        break;
      }
      return pos;
    },
    cdrawrepos() {
      // if (this.drawdata.wrapwidth > 0)
      {
        this.drawdata.cleft =
          (this.drawdata.wrapwidth - this.drawdata.cwidth) / 2;
        this.drawdata.ctop =
          (this.drawdata.wrapheight - this.drawdata.cheight) / 2;

        this.drawdata.mincleft = this.drawdata.cleft;
        this.drawdata.minctop = this.drawdata.ctop;

        let rpos = this.getClientOffset(this.$refs.drawwrap);
        this.drawdata.wrapleft = rpos.x;
        this.drawdata.wraptop = rpos.y;
        console.log(this.drawdata);
      }
    },
    cdrawsetfit() {
      //!  设置scale到适合屏幕的宽高
      if (this.drawdata.cwidth > 0 && this.drawdata.cheight > 0) {
        let xscale = this.drawdata.wrapwidth / this.drawdata.cwidth;
        let yscale = this.drawdata.wrapheight / this.drawdata.cheight;
        let usescale = Math.min(xscale, yscale);
        let maxscale = 2.0;
        if (usescale > maxscale) {
          usescale = maxscale;
        }
        this.drawdata.minscale = usescale;
        let usemaxscale = usescale * 3;
        if (usemaxscale < 1) {
          usemaxscale = 1;
        }
        this.drawdata.maxscale = Math.min(usemaxscale, maxscale);

        this.drawdata.scale = usescale;

        this.cdrawrepos();
      }
    },
    cdrawsetimg(url) {
      let img = new Image();
      img.src = url;
      img.onload = () => {
        //
        this.cdrawinit();
        this.drawdata.img = img;

        if (img.width <= 0 || img.height <= 0) {
          return;
        }

        let maxwidth = 1920;
        let maxheight = 1080;
        // maxwidth = maxheight = 100;
        let width = img.width;
        let height = img.height;
        if (width > maxwidth) {
          width = maxwidth;
          height = (maxwidth * img.height) / img.width;
        }
        if (height > maxheight) {
          height = maxheight;
          width = (maxheight * img.width) / img.height;
        }

        this.drawdata.imgwidth = img.width;
        this.drawdata.imgheight = img.height;
        let canva = this.$refs.drawcanvas;
        canva.width = width;
        canva.height = height;
        this.drawdata.cwidth = canva.width;
        this.drawdata.cheight = canva.height;
        this.drawdata.ctx = canva.getContext("2d");
        this.cdrawsetfit();
        //this.cdrawrepos();
        this.drawdata.ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          width,
          height
        );
      };
    },
    // 生成图片
    getImage() {
      // html2canvas(document.querySelector("#mydraw"), {
      //   allowTaint: true,
      //   taintTest: false,
      //   width: 1920,
      //   height: 1080
      // }).then(c => {
      //   this.imgUrl = c.toDataURL("image/jpeg", 1.0);
      //   this.isSubmit = true;
      //   this.goBacks();
      //   console.log("生成图片", this.imgUrl);
      // });
      let ca = this.$refs.drawcanvas;
      if (this.drawdata.cwidth > 0) {
        let imgurl = ca.toDataURL("image/jpeg", 0.8);
        this.selfile = null;
        this.isSubmit = true;
        this.pingceData.editimgurl = imgurl;
        this.goBacks();
      }
    },
    // 设置绘画配置
    setCanvasStyle() {
      this.context.lineWidth = this.config.lineWidth;
      this.context.shadowBlur = this.config.shadowBlur;
      this.context.shadowColor = this.config.lineColor;
      this.context.strokeStyle = this.config.lineColor;
    },
    cdrawsetstyle() {
      let ctx = this.drawdata.ctx;
      if (!ctx) {
        return;
      }
      ctx.lineWidth = this.config.lineWidth;
      ctx.shadowBlur = this.config.shadowBlur;
      ctx.shadowColor = this.config.lineColor;
      ctx.strokeStyle = this.config.lineColor;
      console.log(this.config);
    },

    sumint() {
      if (this.isSubmitEnd) {
        Toast("你已提交过");
        return;
      }
      if (
        !this.isSubmit
        // && this.selfile == null  //! cjy: 因为手机拍照像素高的缘故，导致原图很大， 因此这里不应当提交原图，而是经过编辑后最大1080p的图片
      ) {
        Toast("请绘制");
        return;
      }

      if (this.selfile != null) {
        //! 提交当前文件
        this.uploadImg(this.selfile);
        return;
      }

      console.log(this.imgUrl);
      if (this.imgUrl.length <= 1) {
        if (
          this.pingceData.editimgurl &&
          this.pingceData.editimgurl.indexOf("base64,") > 0
        ) {
          this.uploadimgbase64();
          return;
        } else {
          console.log(this.pingceData.editimgurl);
          Toast("edigimg 异常");
          return;
        }
      } else {
        //onsole.log(this.pingceData.editimgurl);
        //Toast('异常');
        //  return;
      }

      this.$emit("submitFn", this.imgUrl);
      this.uploadData = {};
      this.imgUrl = "";
      this.isSubmit = false;
      //  this.controlCanvas("clear");
    },
    draw() {
      let url = this.pingceData.files;
      if (this.pingceData.editimgurl) {
        url = this.pingceData.editimgurl;
      }
      this.defaultimgurl = url;
      this.cdrawsetimg(url);
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
  // .imgUrl{
  //   position: fixed;
  //   width: 100%;
  //   height: auto;
  //   z-index: 9999999999;
  //   top: 0;
  // }
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
    .draw-wrap {
      width: 100%;
      height: 93vh;
      overflow: hidden;
    }
    .mydraw-main {
      position: relative;
      height: 63vh;
      overflow: hidden;
    }
    .draw-main {
      position: relative;
      .canvas2 {
        position: absolute;
        left: 0;
        top: 0;
      }
      canvas3 {
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
      // position: fixed;
      width: 100%;
      height: 30vh;
      // bottom: 25px;
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
