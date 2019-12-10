<template>
  <div
    class="mainpart common-list"
    :class="type=='pingcedetail'?'pingcedetail':type=='pingce'?'pingce':''"
    @click="onclick"
  >
    <img v-if="type=='pingce'" class="itemavatar" :src="item.files" :onerror="defaultimg" />
    <div class="maincontent" v-if="type=='sign'">
      <div class="mainctitle ellipse">
        {{item.date}}&nbsp;{{week}} &nbsp;签到
        <span
          class="fr font-xs color9"
        >{{item.joinnum}} 人 / {{item.totalnum}} 人</span>
      </div>
      <div v-if="classSignId==item.id" class="maincsubtitle colord">正在签到...</div>
      <div v-else class="maincsubtitle color9">{{item.starttime}}</div>
    </div>
    <!-- 评测记录 -->
    <div class="maincontent" v-if="type=='pingce'">
      <div class="mainctitle ellipse">
        {{pingceType}}
        <span class="fr font-xs color9">{{item.joinnum}}人 / {{item.totalnum}} 人</span>
      </div>
      <div class="maincsubtitle color9">{{item.createtime}}</div>
    </div>
    <!-- 签到详情 -->
    <div class="maincontent pingcedetail" v-if="type=='pingcedetail'">
      <div class="mainctitle ellipse">
        <img class="itemavatar" :src="item.avatar" :onerror="defaultimg" />
        {{item.name}}
        <span class="fr font-xs colorf">正确</span>
      </div>
      <div class="maincsubtitle">提交答案: {{answer}}</div>
      <div class="footer">
        <span class="color9 font-xs">{{item.submittime}}</span>
        <span class="fr colory">得分&nbsp;{{item.score}}</span>
      </div>
    </div>
    <!-- 成员分组 -->
    <div class="maincontent" v-if="type=='group'">
      <div class="mainctitle ellipse">
        {{item.name}}
        <span v-if="index==0" class="fr font-xs colory">默认分组</span>
      </div>
      <div
        class="maincsubtitle color9"
      >{{item.subgroupnum}} 人已被划分小组，划分为 {{item.subgroupmnum}}个小组{{item.createtime}}</div>
    </div>
    <i v-if="type=='group'" class="iconfont iconjiantou1 eicotrigger color9"></i>
    <i v-if="type!='pingcedetail' && type!='group'" class="iconfont iconjiantou eicotrigger colord"></i>
  </div>
</template>

<script>
import { Whatweek } from "../util";
import { watch } from "fs";
import { pingceType } from "@/util";
export default {
  name: "BankeMemberSimple",
  props: {
    item: {
      default() {
        return {};
      }
    },
    text: {
      default: ""
    },
    index:{
      default: ''
    },
    type: {
      default: "sign"
    },
    classSignId: {
      default: 0
    }
  },
  computed: {
    answer() {
      let str = "";
      for (let v of this.item.answerdesc.opts) {
        str += v + "、";
      }
      return str;
    },
    week() {
      return Whatweek(this.item.date);
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../assets/100x100.png");
      srcstr += '"';
      return srcstr;
    },
    pingceType() {
      return pingceType(this.item.ptype);
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
      this.$emit("showStudentSignInfo", this.item);
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
.mainpart.pingcedetail {
  padding: 0;
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
.pingcedetail .mainctitle {
  position: relative;
  padding-left: 45px;
  width: 100%;
}
.pingcedetail .mainctitle img {
  width: 35px;
  height: 35px;
  left: 0;
}
.pingcedetail .mainctitle .colorf {
  background: #3ee17f;
  border-radius: 5px;
  padding: 3px 10px;
}
.pingcedetail .maincsubtitle {
  font-size: 16px;
}
.pingcedetail .footer {
  margin-top: 5px;
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
.common-list.pingce {
  padding-left: 80px;
}
.common-list img {
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>