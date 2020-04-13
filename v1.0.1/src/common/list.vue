<template>
  <div
    class="mainpart common-list"
    :class="type=='pingcedetail'?'pingcedetail':type=='pingce'?'pingce':''"
    @click="onclick"
  >
    <img
      v-if="type=='common'"
      class="itemavatar object-fit-img"
      :src="`${item.info.img}`"
      :onerror="$defaultImg(item.info.img)"
    />
    <img
      v-if="type=='pingce'"
      class="itemavatar object-fit-img"
      :src="`${item.files}_snap.jpg`"
      :onerror="$defaultImg('file')"
    />
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
    <!-- 评测记录详情 -->
    <div class="maincontent pingcedetail" v-if="type=='pingcedetail'">
      <div class="mainctitle ellipse">
        <img class="itemavatar object-fit-img" :src="item.avatar" :onerror="$defaultImg('account')" />
        {{item.name}}
        <!--  cjy：不再显示正确错误  <span
          class="fr font-xs"
          :class="item.score>0?'colorA':'colorB'"
          v-if="ptype=='1'||ptype=='2'||ptype=='3'"
        >{{item.score>0?'正确':'错误'}}</span> -->
      </div>
      <div v-if="!item.hassubmit">未提交</div>
      <div v-if="ptype!='6' && item.hassubmit" class="maincsubtitle ellipse">{{ptype=='10'?`投票给:`:`提交答案:`}} {{answer}}</div>
      <div v-if="ptype=='6' && item.hassubmit">{{item.isResponder}}</div>
      <div v-if="ptype=='4' && item.hassubmit" class="pingc-img-wrap">
        <img
          class="pingc-img"
          :src="`${item.answerdesc.file}_snap.jpg`"
          alt
          @click="previewimg(item)"
        />
      </div>
      <div class="footer" v-if="item.hassubmit">
        <span class="color9 font-xs">{{item.submittime}}</span>
        <span class="fr colory font18">得分&nbsp;{{item.score}}</span>
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
    <!-- 收藏记录 -->
    <div class="maincontent common" v-if="type=='common'">
      <div class="mainctitle ellipse">{{item.title}}</div>
      <div class="maincsubtitle color9">
        <span>{{item.info.typeText}}</span>
        &nbsp;{{item.info.time}}
      </div>
    </div>
    <i
      v-if="type=='common' ||type=='pingce'"
      class="iconfont iconjiantou1 eicotrigger color9"
      @click.stop="edit(item)"
    ></i>
    <i
      v-if="type=='group'"
      class="iconfont iconjiantou1 eicotrigger color9"
      @click.stop="edit(item)"
    ></i>
    <i
      v-if="type!='pingcedetail' && type!='group'&& type!='common' && type!='pingce' "
      class="iconfont iconjiantou eicotrigger colord"
    ></i>
  </div>
</template>

<script>
import { Whatweek } from "../util";
import { watch } from "fs";
import { pingceType, defaultImg } from "@/util";
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
    index: {
      default: ""
    },
    type: {
      default: "sign"
    },
    classSignId: {
      default: 0
    },
    ptype: {
      default: null
    }
  },
  computed: {
    answer() {
      let str = "";
      if (this.ptype != "10" && this.ptype != "6" && this.ptype != "5") {
        if (this.item.answerdesc.opts.length) {
          for (let key in this.item.answerdesc.opts) {
            let v = this.item.answerdesc.opts[key];
            if (key == this.item.answerdesc.opts.length - 1) {
              str += v + " ";
            } else {
              str += v + " 、";
            }
          }
          return str;
        }
      } else if (this.ptype == "5") {
        if (this.item.answerdesc.textarea) {
          str = this.item.answerdesc.textarea;
          return str;
        }
      } else if (this.ptype == "10") {
        return this.item.toName;
      }
    },
    week() {
      return Whatweek(this.item.date);
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += ("/assets/100x100.png");
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
    previewimg(item) {
      this.$emit("previewimg", item);
    },
    edit(item) {
      this.$emit("edit", item);
    },
    onclick() {
      this.$emit("singleclick", this.item);
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
  height: auto;
  padding-bottom: 10px;
}
.mainpart.pingcedetail .pingc-img-wrap {
  padding: 42% 0 0;
  position: relative;
  margin: 10px;
}
.mainpart.pingcedetail .pingc-img {
  position: absolute;
  width: 70%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  object-fit: contain;
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
  height: 32px;
}
.pingcedetail .mainctitle img {
  width: 30px;
  height: 30px;
  left: 0;
  border-radius: 30px;
}
.pingcedetail .mainctitle > span {
  border-radius: 5px;
  padding: 3px 10px;
  color: #fff;
}
.pingcedetail .mainctitle .colorA {
  background: #3ee17f;
}
.pingcedetail .mainctitle .colorB {
  background: #ff8900;
}
.pingcedetail .maincsubtitle {
  width: 90%;
  font-size: 16px;
}
.pingcedetail .footer {
  margin-top: 5px;
}
.maincsubtitle {
  height: 25px;
  line-height: 30px;
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
.maincontent.common {
  padding-left: 60px;
}
</style>