<template>
  <div class="mainpart" @click="onclick">
    <img :src="userimg" :onerror="defaultimg" class="mainimg mainleft avatar" />
    <div class="mainright" v-if="hasedit">
      <i class="iconfont icon-bianji eicotrigger" @click="icoclick"></i>
    </div>
    <div class="maincontent">
      <div class="mainctitle ellipse">{{memberuser.name}}</div>
      <div class="maincsubtitle">{{memberdesc}}</div>
    </div>
  </div>
</template>

<script>
import commontools from "../../commontools";

import maintools from "../maintools";

export default {
  name: "BankeMemberSimple",
  computed: {
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
  data() {
    return {
      pendclick: false
    };
  },
  methods: {
    icoclick() {
      // console.log('bankefilesimple icoclick');
      this.pendclick = true;
      this.$emit("editclick", this.fileitem);
    },
    onclick() {
      //  console.log('bankefilesimple');
      if (this.pendclick) {
        this.pendclick = false;
        return;
      }
      this.$emit("normalclick", this.fileitem);
    }
  },
  props: {
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
    }
  }
};
</script>

<style scoped>
.mainpart {
  height: 83px;
  border-bottom: 1px solid #eaeaea;
  padding: 10px;
}

.mainimg {
  width: 62px;
  height: 62px;

  border-radius: 50%;
}

.mainleft {
  float: left;
}

.maincontent {
  margin-left: 72px;
  margin-right: 40px;
}

.mainctitle {
  font-size: 20px;
  color: #313131;

  height: 24px;
  margin-bottom: 6px;
  margin-top: 6px;
}
.maincsubtitle {
  margin-top: 10px;
  height: 16px;

  font-size: 12px;
  color: #a5a5a5;
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