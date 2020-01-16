<template>
  <div class="my-audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <div class="audio-wrap position-c">
        <audio :src="AudioiInfo.filepath" id="audio" ref=audio></audio>
        <div class="clearfix control-ui">
          <i class="iconfont fl" :class="isPlay ?'iconbofang':'iconzanting'" @click="controlAudio"></i>
          <div class="fl progress-wrap" ref="prgs">
            <mt-progress
              :value="progressing"
              :bar-height="5"
           
            ></mt-progress>
            <!-- <div class="progress"  ref="prgs" @click="progressFn($event)">
              <p class="progressing" :style="{ width: progressing + 'px' }"></p>
            </div>-->
          </div>
          <span class="time-font fr">{{playTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Progress } from "mint-ui";
import { parse } from "path";
export default {
  props: {
    AudioiInfo: {
      default() {
        return {};
      }
    },
  },
  watch: {
    AudioiInfo: function(newValue, oldValue) {},
  },
  data() {
    return {
      progressing: 0,
      musicLen: 0,
      playFlag: false,
      isPlay: true,
      timer: "",
      second: 0,
      myAudio: null,
      currentTime:0
    };
  },
  computed: {
    filename() {
      if (this.AudioiInfo.filename) {
        return this.AudioiInfo.filename;
      } else {
        return "未知文件名";
      }
    },
    playTime() {
      return this.toMs(this.second);
    },
    musicSize() {
      return this.toMs(this.musicLen);
    }
  },
  created() {
         
  },
  mounted() {
    //  this.controlAudio();
  },
  methods: {
    progressFn(e) {
      var e = e || e.window.event;
        var x = e.offsetX;
        var w = this.$refs.prgs.offsetWidth;
        var p = x / w;
        this.progressing =p * 100;
        this.second = this.myAudio.duration * p;
    },
    controlAudio() {
       this.myAudio = document.getElementById("audio");
      this.musicLen = this.myAudio.duration;
      let leng = this.myAudio.duration;
      console.log("时间", this.myAudio.duration);
      if (this.isPlay) {
        this.myAudio.play();
        this.isPlay = false;
        this.timer = setInterval(() => {
          this.progressing = (this.progressing / 100 + 0.1 / leng) * 100;
         // console.log("长度", this.progressing);
          this.second = this.second + 0.1;
          if (this.progressing >= 100) {
            clearInterval(this.timer);
            this.progressing = 0;
            this.second = 0;
            this.controlAudio();
          }
        }, 100);
      } else {
        this.myAudio.pause();
        this.isPlay = true;
        clearInterval(this.timer);
      }
    },
    toMs(time) {
      var m = Math.floor(time / 60);
      m = m > 9 ? m : "0" + m;
      var s = Math.floor(time % 60);
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    },
    goBacks() {
       clearInterval(this.timer);
      this.$emit("Backs", true);
    }
  },
  components: {},
  destroyed() {}
};
</script>

<style scoped lang="less">
.my-audio-wrap {
  .main {
    width: 100%;
    height: 93vh;
    min-height: 93vh;
    background: rgba(0, 0, 0, 0.8);
    .audio-wrap {
      width: 90%;
      .control-ui {
        background: #fff;
        height: 50px;
        line-height: 50px;
        border-radius: 13px;
        padding: 0 10px;
        > i {
          font-size: 38px;
          color: #0089ff;
        }
        .progress-wrap {
          width: 64%;
          position: absolute;
          top: 50%;
          left: 49%;
          -webkit-transform: translate(0, -50%);
          transform: translate(-50%, -50%);
          .progress {
            width: 100%;
            height: 5px;
            background: #ccc;
            border-radius: 20px;
            .progressing {
              height: 100%;
              background: #0089ff;
              width: 0;
            }
          }
        }
      }
    }
  }
}
</style>
