<template>
  <div class="my-audio-wrap">
    <mt-header :title="filename">
      <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <div class="audio-wrap position-c">
        <audio :src="AudioiInfo.filepath" id="audio"></audio>
        <div class="clearfix control-ui">
          <i
            class="iconfont fl"
            :class="isPlay ?'iconbofang':'iconzanting'"
            @click="controlAudio()"
          ></i>
          <div class="fl progress-wrap">
            <!-- <mt-progress :value="progressing" :bar-height="5"></mt-progress> -->
            <div class="progress">
              <p class="progressing" :style="{ width: progressing + 'px' }"></p>
            </div>
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
      myAudio: null,
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
  components: {},
  destroyed(){

  },
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
