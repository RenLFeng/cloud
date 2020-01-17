<template>
  <div class="my-audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <div class="audio-wrap position-c">
        <audio id="audio" :src="AudioInfo.filepath" ref="audio"></audio>
        <div class="clearfix control-ui">
          <i class="iconfont fl" :class="isPlay ?'iconbofang':'iconzanting'" @click="play()"></i>
          <div class="fl progress-wrap" ref="prgs" @click="progressFn($event)">
            <!-- <mt-progress :value="progressBar" :bar-height="5"></mt-progress> -->
            <p class="progress">
              <span class="progressing" v-bind:style="{ width: progressBar + '%' }"></span>
               <!-- <span class="progressing" :style="{width:`${progressBar}%`}"></span> -->
            </p>
          </div>
          <span class="time-font fr">{{cTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Progress } from "mint-ui";
import { parseURL } from "@/util";
export default {
  name: "Audio",
  props: {
    AudioInfo: {
      default() {
        return {};
      }
    }
  },
  watch: {},
  data() {
    return {
      // audioInfo: {
      //   filename: "",
      //   filepath: ""
      // },
   ll:50,
      isPlay: true,
      cTime: null,
      dTime: null,
      progressBar: 0,
      playfirst: false,

      myAudio: null,
    };
  },
  computed: {
    filename() {
      if (this.AudioInfo.filename) {
        return this.AudioInfo.filename;
      }
      return "音频";
    }
  },
  created() {},
  mounted() {
    console.log("audio mounted");
    this.playfirst = true;
    this.isPlay = true;
           this.addEventListeners();
        this.doplayfirst();
  },
  methods: {
    addEventListeners: function() {
      const self = this;
      self.$refs.audio.addEventListener("timeupdate", self._currentTime),
        self.$refs.audio.addEventListener("canplay", self._durationTime);
      self.$refs.audio.addEventListener("ended", self.endedFn);
    },
    removeEventListeners: function() {
      const self = this;
      self.$refs.audio.removeEventListener("timeupdate", self._currentTime);
      self.$refs.audio.removeEventListener("canplay", self._durationTime);
      self.$refs.audio.addEventListener("ended", self.endedFn);
    },

    _currentTime: function() {
      const self = this;
                 self.cTime = this.toMs(self.$refs.audio.currentTime);
      self.progressBar =
        (self.$refs.audio.currentTime / self.$refs.audio.duration) * 100;
      // console.log(' self.cTime',self.cTime);

    },
    _durationTime: function() {
      const self = this;
      self.dTime = this.toMs(self.$refs.audio.duration);
    },
    doplayfirst() {
      if (this.isPlay && this.playfirst) {
        this.$refs.audio.play();
        this.isPlay = false;
        this.playfirst = false; //! 仅自动播放一次，避免循环播放
      }
    },
    play() {
      //   console.log('audio play');
      // console.log(this.AudioInfo);
      if (this.isPlay) {
        this.$refs.audio.play();
        this.isPlay = false;
      } else {
        this.$refs.audio.pause();
        this.isPlay = true;
      }
    },
    progressFn(e) {
      const self = this;
      var e = e || e.window.event;
      var x = e.offsetX;
      var w = self.$refs.prgs.offsetWidth;
      var p = x / w;
      self.progressBar = p * 100;
      self.$refs.audio.currentTime = self.$refs.audio.duration * p;
      
      console.log('this.$refs.audio.currentTime',self.$refs.audio.currentTime);
    },
    endedFn() {
      this.progressBar = 0;
      this.$refs.audio.currentTime = 0;
      this.isPlay = true;
    },
    toMs(time) {
      var m = Math.floor(time / 60);
      m = m > 9 ? m : "0" + m;
      var s = Math.floor(time % 60);
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    },
    goBacks() {
      this.removeEventListeners();
      //  this.$back();
      this.$emit("Backs", {});
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
            position: absolute;
            width: 100%;
            height:5px;
            left: 0;
            top: 0;
            background: #ccc;
            border-radius: 20px;
            .progressing {
              position: absolute;
              // width:50%;
              left: 0;
              height: 5px;
              background: #0089ff;
            }
          }
        }
        .time-font {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
