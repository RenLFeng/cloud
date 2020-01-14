<template>
  <div class="my-audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <div class="audio-wrap position-c">
        <audio :src="AudioiInfo.filepath" id="audio"></audio>
        <div class="clearfix control-ui">
          <span class="time-font fl">{{playTime}}</span>
          <p class="fl progress-wrap">
            <mt-progress :value="progressing" :bar-height="5"></mt-progress>
          </p>
          <span class="time-font fr">{{musicSize}}</span>
          <p class="control-btn tc">
            <i class="iconfont" :class="isPlay ?'iconbofang':'iconzanting'" @click="controlAudio()"></i>
          </p>
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
    }
  },
  watch: {
    AudioiInfo: function(newValue, oldValue) {}
  },
  data() {
    return {
      progressing: 0,
      musicLen: 0,
      playFlag: false,
      isPlay: true,
      timer: "",
      second: 0,
      myAudio: null
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
      let s =
        this.second / 60 > 9
          ? parseInt(this.second / 60)
          : "0" + parseInt(this.second / 60);
      let s2 =
        this.second % 60 >= 10
          ? parseInt(this.second % 60)
          : "0" + parseInt(this.second % 60);
      return `${s}:${s2}`;
    },
    musicSize() {
      let s =
        this.musicLen / 60 > 9
          ? parseInt(this.musicLen / 60)
          : "0" + parseInt(this.musicLen / 60);
      let s2 =
        this.musicLen % 60 >= 10
          ? parseInt(this.musicLen % 60)
          : "0" + parseInt(this.musicLen % 60);
      return `${s}:${s2}`;
    }
  },
  created() {},
  mounted() {},
  methods: {
    controlAudio: function() {
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
    goBacks() {
      clearInterval(this.timer);
      this.progressing = 0;
      this.second = 0;
      this.$emit("Backs", true);
    }
  },
  components: {}
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
      width: 100%;
      .control-ui {
        background: #fff;
        .progress-wrap {
          width: 66%;
          margin: 0 4%;
        }
      }
      .control-btn {
        width: 100%;
        i {
          font-size: 50px;
          color: #0089ff;
        }
      }
    }
  }
}
</style>
