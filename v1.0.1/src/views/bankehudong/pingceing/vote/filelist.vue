<template>
  <div class="vote-list-wrap">
    <div class="main clearfix">
      <div
        v-for="(v,index) in listData"
        :key="index"
        class="file-item fl"
        :class="type=='isdetail'?'act':''"
      >
        <p class="pic" @click="select(v,index)">
          <img :src="`${v.file}_snap.jpg`" :onerror="defaultimg" class="object-fit-img" />
          <span class="mask" v-if="v.isAct && type==''">
            <i class="iconfont iconok- position-c"></i>
          </span>
        </p>
        <div class="user-info-wrap">
          <p class="user">
            <img src="f" :onerror="$defaultImg('account')" class="object-fit-img" />
            <span class="name">{{v.name}}</span>
            <span
              v-if="type==''"
              class="iconfont iconicon-- fr position-r colord"
              @click="view(index)"
            ></span>
            <a class="position-r" v-if="type=='isdetail'">
              <span class="iconfont iconshou colory" v-if="index=='0' && !isRepeat"></span>
              <span class="score colory fontsmall">{{v.count}}</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nativecode from "../../../../nativecode";
export default {
  props: {
    listData: {
      default() {
        return [];
      }
    },
    type: {
      default: ""
    },
    isSubmitEnd: {
      default: false
    }
  },
  watch: {
    isSubmitEnd: function(newValue, oldValue) {
      this.isSubmitEnd = newValue;
    }
  },
  data() {
    return {};
  },
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += "/assets/100x100.png";
      srcstr += '"';
      return srcstr;
    },
    isRepeat() {
      let tempnb = this.listData[0].count;
      for (let i = 1; i < this.listData.length; i++) {
        let item = this.listData[i];
        if (tempnb == item.count) {
          return true;
          break;
        } else {
          return false;
        }
      }
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    select(item, index) {
      if (this.isSubmitEnd) {
        return;
      }
      if (item.isAct) {
        item.isAct = false;
      } else {
        for (let v of this.listData) {
          v.isAct = false;
        }
        item.isAct = true;
      }
      this.$emit("voteSelect", { obj: this.listData, index: index });
    },
    view(i) {
      let tempImgs = [];
      for (let v of this.listData) {
        tempImgs.push(nativecode.getUsedUrl(v.file));
      }
      nativecode.previewImage(this, {
        urls: tempImgs,
        index: i
      });
    }
  },
  components: {}
};
</script>

<style lang="less">
.vote-list-wrap {
  background: #f0f0f0;
  padding: 10px 0;
  .main {
    .file-item {
      position: relative;
      width: 48%;
      margin: 0 1%;
      background: #fff;
      margin-bottom: 10px;
      .pic {
        position: relative;
        border: 1px solid #000;
        img {
          width: 100%;
        }
        .mask {
          i {
            font-size: 70px;
            color: #fff;
          }
        }
      }
      .user-info-wrap {
        padding: 5px;
        .user {
          position: relative;
          img {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            margin-right: 10px;
          }
          a {
            .score {
              padding-left: 5px;
            }
            .iconfont {
              font-size: 24px;
            }
          }
        }
      }
      &.act {
        // width: 96%;
        // margin: 0 2%;
      }
    }
  }
}
</style>
