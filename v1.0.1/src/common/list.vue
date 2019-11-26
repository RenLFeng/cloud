<template>
  <div class="mainpart" @click="onclick">
    <div class="maincontent">
      <div class="mainctitle ellipse">
        {{item.date}}&nbsp;{{week}} &nbsp;签到
        <span class="fr font-xs color9">2 人 / 10 人</span>
      </div>
      <div v-if="classSignId==item.id" class="maincsubtitle colord">正在签到...</div>
      <div v-else class="maincsubtitle color9">{{item.starttime}}</div>
    </div>
    <i class="iconfont iconjiantou eicotrigger colord"></i>
  </div>
</template>

<script>
import { Whatweek } from "../util";
export default {
  name: "BankeMemberSimple",
  props: {
    item: {
      default() {
        return {};
      }
    },
    index: {
      default: 0
    },
    indexShow: {
      default: 0
    },
    icon: {
      default: 0
    },
    scoreText: {
      default: "得分"
    },
    memberuser: {
      default() {
        return {};
      }
    },
    classSignId:{
      default:0
    }
  },
  computed: {
    week() {
      return Whatweek(this.item.date);
    }
  },
  created() {},
  data() {
    return {
      pendclick: false,
      totalAll: 0
    };
  },
  methods: {
    onclick() {
      this.$emit('showStudentSignInfo',this.item)
    
    }
  }
};
</script>

<style scoped>
.mainpart {
  position: relative;
  height: 83px;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px;
  background: #fff;
}
.mainpart > .index {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
.mainpart > i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
.mainimg {
  width: 62px;
  height: 62px;

  border-radius: 50%;
}

.mainleft {
  float: left;
  margin-left: 15px;
}

.maincontent {
}

.mainctitle {
  font-size: 18px;
  color: #313131;
  width: 90%;

  height: 24px;
  margin-bottom: 6px;
  margin-top: 6px;
}
.maincsubtitle {
  height: 16px;
  font-size: 12px;
}

.mainright {
  float: right;
  padding-top: 20px;
}
.eicotrigger {
  font-size: 22px;

  margin-right: 5px;
}
</style>