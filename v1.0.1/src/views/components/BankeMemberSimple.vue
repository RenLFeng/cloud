<template>
  <div class="mainpart" :class="memberDetail?'memberDetail':''" @click="onclick">
    <span v-if="indexShow" class="index colory">{{index+1}}</span>
    <img
      :src="userimg"
      :onerror="$defaultImg('account')"
      class="mainimg mainleft avatar position-l"
      :class="memberDetail?'memberDetail':''"
    />
    <div class="mainright" v-if="hasedit">
      <i class="iconfont icon-bianji eicotrigger" @click="icoclick"></i>
    </div>
    <div class="maincontent">
      <div class="mainctitle ellipse">{{memberuser.name}}</div>
      <div class="maincsubtitle color9" v-if="!sign &&　memberuser.sno">学号: {{memberuser.sno}}</div>
      <div v-if="!sign" class="maincsubtitle colory">{{scoreText}}:&nbsp;{{scoreTotal}}分</div>
      <div
        v-if="sign"
        class="maincsubtitle colory"
      >{{memberuser.state?$t('bankehHudong.CheckIn'):$t('bankehHudong.No_sign_in')}}</div>
      <!-- <div class="maincsubtitle">{{memberdesc}}</div> -->
    </div>
    <i v-if="icon" class="iconfont iconjiantou1 eicotrigger colord" @click.stop="icoclick"></i>
    <a class="color9" v-if="sign">得分:{{memberuser.score}}</a>
  </div>
</template>

<script>
import commontools from "../../commontools";

import maintools from "../maintools";

export default {
  name: "BankeMemberSimple",
  props: {
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
    memberDetail: {
      default: false
    },
    memberuser: {
      type: Object,
      default() {
        return {
          id: 0,
          name: "",
          account: "",
          role: ""
        };
      },
      required: false
    },
    hasedit: {
      default() {
        return false;
      },
      required: false
    },
    sign: {
      default: 0
    }
  },
  computed: {
    scoreTotal() {
      return this.memberuser.score;
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/100x100.png");
      srcstr += '"';
      return srcstr;
    },
    userimg() {
      return this.memberuser.avatar;
    },
    memberdesc() {
      if (this.memberuser.role >= 10) {
        //!  教师不显示账户
        return this.$t("common.Teacher");
        // return maintools.userroledesc(this.memberuser.role);
      }
      var roledesc = maintools.userroledesc(this.memberuser.role);
      if (roledesc == "游客") {
        roledesc = this.$t("common.Tourist");
      } else if (roledesc == "教师") {
        roledesc = this.$t("common.Teacher");
      } else if (roledesc == "学员") {
        roledesc = this.$t("common.Student");
      }
      var ostr = this.memberuser.account;
      ostr += " / ";
      ostr += roledesc;
      return ostr;
    }
  },
  created() {
    // console.log("memberusermemberuser", this.memberuser);
  },
  data() {
    return {
      pendclick: false,
      totalAll: 0
    };
  },
  methods: {
    icoclick() {
      // console.log('bankefilesimple icoclick');
      this.pendclick = true;
      this.$emit("editclick", this.memberuser);
    },
    onclick() {
      //  console.log('bankefilesimple');
      if (this.pendclick) {
        this.pendclick = false;
        return;
      }
      this.$emit("normalclick", this.fileitem);
    }
  }
};
</script>

<style scoped>
.mainpart {
  position: relative;
  /* height: 83px; */
  border-bottom: 1px solid #eaeaea;
  padding: 18px 0;
  background: #fff;
}
.memberDetail.mainpart {
  height: auto;
}
.memberDetail.mainpart .maincontent > div {
  margin: 5px 0;
}
.mainpart > .index {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
.mainpart > i,
.mainpart > a {
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
  /* float: left; */
  margin-left: 15px;
  object-fit: cover;
}

.memberDetail.mainleft {
  float: initial;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}

.maincontent {
  margin-left: 92px;
  margin-right: 40px;
}

.mainctitle {
  font-size: 18px;
  color: #313131;

  /* height: 24px; */
  /* margin-bottom: 6px;
  margin-top: 6px; */
}
.maincsubtitle {
  /* height: 16px; */
  font-size: 14px;
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