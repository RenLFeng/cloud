<template>
  <div class="mainpart" @click="onclick">
    <div class="reddot-Tips-wrap" :class="zuoyeitem.eventmsgs?'reddot-Tips':''">
      <img :src="userimg" :onerror="defaultimg" class="mainimg mainleft" />
    </div>
    <div class="mainright">
      <div class="rightcontrol" @click.stop="icoclick" v-if="zuoyeitem.state !=0">
        <img src="/assets/zuoye_edit.png" class="rightcontrolimg" v-if="hasedit" />
      </div>
      <div class="rightcontrol ku position-r" @click.stop="fabu" v-else>
        <span class="font16 colord position-c">发布</span>
      </div>
      <div class="rightstate" :class="{'rightstatemid':!hasedit}">
        <div v-if="zuoyeitem.state == 100">
          <img src="/assets/zuoye_st_play.png" class="rightstateimg" />
          <div class="rightsttext rightstplay">{{$t('bankeTask.Have_in_hand')}}</div>
        </div>
        <div v-else-if="zuoyeitem.state == 10" class="rightsttext">
          <div class="rightststopico"></div>
          <span class="rightststop">{{$t('bankeTask.Has_ended')}}</span>
        </div>
        <!-- <div v-else class="rightsttext">
          <div class="rightstnormalico"></div>
          <span class="rightstnormal">未开始</span>
        </div>-->
      </div>
    </div>
    <div :class="{'maincontent':true,'position-l ku':zuoyeitem.state==0}">
      <div class="mainctitle ellipse">{{zuoyeitem.name}}</div>
      <div class="maincsubtitle ellipse" v-if="zuoyeitem.state!=0 && hasedit">
        <i class="iconfont iconzu font18"></i>
        {{bankes}}
      </div>
      <div class="maincsubtitle ellipse" :class="{'submitnum':zuoyeitem.submitnum}" v-if="!hasedit" >{{memberdesc}}</div>
    </div>
  </div>
</template>

<script>
import commontools from "../../commontools";

import maintools from "../maintools";

export default {
  name: "BankeZuoyeSimple",
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += "/assets/zuoye_icon.png";
      srcstr += '"';
      return srcstr;
    },
    userimg() {
      var url = "/assets/zuoye_icon.png";
      return url;
    },
    bankes() {
      if (this.hasedit) {
        let str = "";
        if (this.zuoyeitem.publishdesc.bankeitems.length) {
          let len = this.zuoyeitem.publishdesc.bankeitems.length;
          for (let i = 0; i < len; i++) {
            let v = this.zuoyeitem.publishdesc.bankeitems[i];
            if (i == len - 1) {
              str += v.name;
            } else {
              str += v.name + "," + "\xa0\xa0";
            }
          }
          return str;
        }
        return "";
      }
    },
    memberdesc() {
      if (!this.zuoyeitem.state) {
        return this.$t("bankeTask.Not_yet_begun");
      }
      if (!this.hasedit) {
        //! . html
        if (this.zuoyeitem.submitnum) {
          return this.$t("bankeTask.Already_involved");
        } else {
          //！ 未参与
          if (this.zuoyeitem.state == 10) {
            return this.$t("bankeTask.Not_participate");
          }

          return this.$t("bankeTask.Not_participate");
        }
      }

      var szfmt =
        "%i" + this.$t("common.Person") + " " + this.$t("bankeTask.Partake");
      var nnum = 0;
      if (this.zuoyeitem.submitnum) {
        nnum = this.zuoyeitem.submitnum;
      }
      var ostr = commontools.sprintf(szfmt, nnum);
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
      this.$emit("editclick", this.zuoyeitem);
    },
    fabuedi() {},
    fabu() {
      this.$emit("fabuzy", this.zuoyeitem);
    },
    onclick() {
      //  console.log('bankefilesimple');
      if (this.pendclick) {
        this.pendclick = false;
        return;
      }
      this.$emit("normalclick", this.zuoyeitem);
    }
  },
  props: {
    zuoyeitem: {
      type: Object,
      default() {
        return {
          id: 0,
          name: "",
          state: 0,
          membernum: 0
        };
      },
      required: false
    },
    hasedit: {
      default() {
        return true;
      },
      required: false
    }
  }
};
</script>

<style scoped>
.mainpart {
  position: relative;
  height: 83px;
  border-bottom: 1px solid #eaeaea;
  padding: 10px;
}

.mainimg {
  width: 62px;
  height: 62px;
}

.mainleft {
  float: left;
}

.maincontent {
  margin-left: 72px;
  margin-right: 40px;
}
.maincontent.ku {
  padding-left: 70px;
  margin: 0;
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
.maincsubtitle .iconfont {
  color: #68b9ff;
}
.maincsubtitle.submitnum {
  color: #00c626;
}

.mainright {
  float: right;
  padding-top: 5px;
}
.rightcontrol {
  text-align: right;
}
.rightcontrol.ku {
  width: 62px;
  height: 39px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(0, 137, 255, 1);
  border-radius: 10px;
}
.rightcontrol.ku span {
  width: 100%;
  text-align: center;
}
.rightcontrolimg {
  width: 36px;
  height: 36px;

  margin-bottom: 5px;
}
.rightstate {
  font-size: 12px;
  height: 18px;
}
.rightstatemid {
  margin-top: 20px;
}

.rightstateimg {
}
.rightsttext {
  top: 2px;
  display: inline-block;
  height: 12px;
  position: relative;
}
.rightstplay {
  color: #ff8900;
}
.rightststop {
  color: #a5a5a5;
}
.rightststopico {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #b9b9b9;
  display: inline-block;

  position: relative;
  top: 1px;
}
.rightstnormal {
  color: #a5a5a5;
}
.rightstnormalico {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #00c626;
  display: inline-block;

  position: relative;
  top: 2px;
}

.eicotrigger {
  font-size: 22px;

  margin-right: 5px;
}
</style>