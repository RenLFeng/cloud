<template>
  <div class="item class-banke-list">
    <div class="item" :class="classitem.ordernum?'act':''">
      <div class="reddot-Tips-wrap" :class="classitem.eventmsgs && homeEventmsgs?'reddot-Tips':''">
        <img class="itemavatar" :src="classitem.avatar" :onerror="$defaultImg('banke')" />
      </div>
      <div class="itempart">
        <div class="wrap">
          <div class="itemtitle ellipse">
            <span class="maxlong maxlong8">{{classitem.name}}</span>
            <span class="membernum fonttiny fr color9">{{classitem.membernum}}人</span>
          </div>
          <div class="font-xs ellipse">
            <span class="maxlong">教师：{{classitem.username}}</span>
            <span class="class-nmuber font-xs fr">班课号:{{classitem.id}}</span>
          </div>
          <div class="font-xs ellipse Notice">公告: {{classitem.info?classitem.info:'暂无公告'}}</div>
        </div>
      </div>
      <span class="go" v-if="!end">
        <i class="iconfont iconjiantou1" @click.stop="showMenu(classitem)"></i>
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
    },
    end: {
      default: false
    },
    homeEventmsgs: {
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/banke_default.png");
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {
    showMenu(item) {
      this.$emit("showMenu", item);
    }
  }
};
</script>
<style lang="less" scoped>
.class-banke-list {
  padding: 5px 0;
  .item {
    position: relative;
    // background: #fff;
    // height: 72px;
    border-top: 1px solid #f0f0f0;
    padding-left: 80px;
    .reddot-Tips-wrap {
      position: absolute;
      width: 55px;
      // height: 80%;
      left: 10px;
      top: 50%;
      transform: translate(0, -50%);
      background-color: white;
      .itemavatar {
        // position: absolute;
        width: 100%;
        // height: 100%;
        // left: 0;
        // top: 0;
        border-radius: 3px;
        object-fit: cover;
      }
    }

    .itempart {
      width: 100%;
      .wrap {
        height: 80%;
        width: 80%;
        margin-top: 4px;
        > div {
          .class-nmuber {
            margin-left: 10px;
          }
        }
        .itemtitle {
          font-size: 18px;
          .membernum {
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
    &.act {
      background: #f9f9f9;
    }
  }
}
</style>
<style scoped>
</style>