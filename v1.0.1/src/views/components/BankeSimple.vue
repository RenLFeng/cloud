<template>
  <div class="item class-banke-list">
    <div class="item">
      <img class="itemavatar" :src="classitem.avatar" :onerror="defaultimg" />
      <div class="itempart">
        <div class="wrap">
          <div class="itemtitle ellipse">
            {{classitem.name}}
            <span class="membernum fonttiny">{{classitem.membernum}}人</span>
          </div>
          <div class="font-xs ellipse">教师：{{classitem.username}} <span class="class-nmuber font-xs">班课号123456</span> </div>
          <div class="font-xs ellipse Notice">公告: {{classitem.info?classitem.info:'暂无公告'}}</div>
        </div>
      </div>
      <span class="go">
        <i class="iconfont iconjiantou1"></i>
      </span>
    </div>
     
  </div>
</template>

<script>
export default {
  name: "BankeSimple",
  props: {
    classitem: {
      type: Object,
      default() {
        return {
          name: "",
          avatar: ""
        };
      }
    }
  },
  data() {
    return {

    };
  },
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/100x100.png");
      srcstr += '"';
      return srcstr;
    }
  }
};
</script>
<style lang="less" scoped>
.class-banke-list {
  .item {
    position: relative;
    // background: #fff;
    height: 72px;
    border-top: 1px solid #f0f0f0;
    padding-left: 80px;
    .itemavatar {
      position: absolute;
      width: 55px;
      height: 80%;
      left: 10px;
      top: 50%;
      transform: translate(0, -50%);
      border-radius: 3px;
      background-color: white;
    }
    .itempart {
      width: 100%;
      .wrap {
        height: 80%;
        width: 80%;
        margin-top: 4px;
        > div {
          padding: 1px 0;
          .class-nmuber{
            margin-left: 10px;
          }
        }
        .itemtitle {
          font-size: 16px;
          .membernum {
            position: absolute;
            right: 36px;
            color: #aaaaaa;
          }
        }
        .Notice {
          color: #ff8900;
        }
      }
    }
    .go {
      position: absolute;
      right: 7px;
      top: 50%;
      transform: translate(0, -50%);
      color: #aaaaaa;
      .iconfont {
        font-size: 30px;
      }
    }
  }
}
</style>
<style scoped>
</style>