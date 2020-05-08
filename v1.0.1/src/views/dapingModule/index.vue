<template>
  <div class="biggp-group-wrap" ref="doch" v-if="isLoad">
    <div class="fixed-header">
      <HeaderNav :navInfo="navInfo" />
      <p class="starttimedesc-wrap" v-if="starttimedesc">
        <span class="tit">签到时间:</span>
        <span>{{starttimedesc}}</span>
      </p>
    </div>
    <div class="main">
      <div class="member-wrap">
        <div class="MemberList">
          <MemberList
            :members="signMemberList"
            :isOpenSign="isOpenSign"
            :signid="signid"
            @setSign="onsetSign"
          />
          <p class="outer" v-if="[].length">旁听学生 6</p>
          <MemberList :members="[]" />
        </div>
      </div>
    </div>
    <div class="qrcode-info-wrap">
      <div class="code-wrap" v-if="isOpenSign">
        <img class="qrcode-img" :src="base64" alt />
        <!-- <canvas id="canvas"></canvas> -->
        <!-- <p class="join clearfix">
          <mt-switch v-model="isJoin"></mt-switch>
          <span>允许旁听学生扫码加入</span>
        </p>-->
        <p class="tips">请使用微信扫码签到</p>
      </div>
      <div v-else>
        <p class="open-sign-wrap">
          <a class="open-sign-btn" @click="openSign">
            <span class="text position-c colorf">开启签到</span>
          </a>
        </p>
      </div>
    </div>

    <div class="scroll-wrap" v-if="isShow">
      <i class="iconfont fontmaintitle iconicon-" :class="!toT?'opacity':''" @click="onScrollFn(0)"></i>
      <i
        class="iconfont fontmaintitle iconicon--copy"
        :class="!toB?'opacity':''"
        @click="onScrollFn(1)"
      ></i>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Switch } from "mint-ui";
import { parseURL } from "@/util";
import commontools from "@/commontools";
import HeaderNav from "./headerNav";
import MemberList from "./memberList";

export default {
  props: {},
  data() {
    return {
      navInfo: {
        letTitle: "学生名单",
        bankeName: "",
        signTotal: 0,
        total: 0,
        issign: false
      },
      tempList: [],
      signMemberList: [],
      isJoin: true,

      deviseH: 0,
      DOCH: 0,
      currentY: 0,
      isScroll: false,
      toB: true,
      toT: false,
      isShow: false,
      bankeinfo: {},

      isOpenSign: false,
      bankeid: "",
      signdata: {},
      signid: 0,
      base64: "",
      timer: null,
      isLoad: false
    };
  },
  computed: {
    starttimedesc() {
      if (!this.signdata.starttime) {
        return "";
      }
      return commontools.timeToHummanRead(
        this.signdata.starttime.replace(/-/g, "/"),1
      );
    }
  },
  created() {
    //http://192.168.0.239:8080/daping.html?bankeid=1040
    const UrlParams = parseURL(window.location.href);
    let id = UrlParams.bankeid;
    if (id.includes("#")) {
      id = id.split("#/")[0];
    }
    this.bankeid = id;
    this.querybanke();
    this.oninit();
  },
  mounted() {
    this.deviseH = window.innerHeight || document.documentElement.clientHeight;
    this.deviseH = this.deviseH - 370;
  },
  watch: {},
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // cjy:查询是否开启签到
    querybanke() {
      this.$http.post("/api/banke/search", { id: this.bankeid }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            this.bankeinfo = res.data.data[0];
            this.navInfo.bankeName = this.bankeinfo.name;
          }
        }
      });
    },
    // cjy: 更新内容； 定时调用
    updatecontent() {
      if (!this.isLoad) {
        return;
      }
      console.log("updatecontent");
      if (this.isOpenSign) {
        this.Signquerymember(this.signid);
      } else {
        this.querystulist();
      }
    },
    querystulist() {
      let url = "/api/api/bankememberquery?bankeid=" + this.bankeid;
      this.$http.post(url, {}).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.members) {
            let sm = res.data.data.members;

            //! cjy: 测试多名学生
            // for(let i=0; i<3; i++){
            //     sm = [...sm, ...sm];
            // }

            for (let i = 0; i < sm.length; i++) {
              sm[i].state = 1; //! 均视为已签到状态
              sm[i].changewrap = false;
              if (sm[i].avatar == null) {
                sm[i].avatar = "";
              }
              if (sm[i].name == null) {
                sm[i].name = "未知名";
              }
            }
            this.signMemberList = sm;
            this.navInfo.total = sm.length;
            this.onlistchanged();
          }
        }
      });
    },
    onlistchanged() {
      this.$nextTick(() => {
        this.DOCH = this.$refs.doch.offsetHeight;
        if (this.DOCH - this.deviseH >= 370) {
          this.isShow = true;
        }
      });
    },
    oninit() {
      //! cjy： 开启定时更新
      this.timer = setInterval(() => {
        this.updatecontent();
      }, 2000);
      Indicator.open("加载中");
      this.$http
        .post("/api/sign/signqueryself", { bankeid: this.bankeid })
        .then(res => {
          this.isLoad = true;
          if (res.data.code == 0) {
            console.log("resresres", res);
            if (res.data.data && res.data.data.signdata) {
              this.signdata = res.data.data.signdata;
              this.signid = this.signdata.id;
              this.isOpenSign = true;
              this.navInfo.issign = true;

              this.getSignCode();
            } else {
            }
          } else {
            //  Toast("未开启签到");
            Indicator.close();
            this.isLoad = true;
          }
          this.updatecontent();
        })
        .catch(() => {
          this.isLoad = true;
          Indicator.close();
        });
    },
    //学生签到状态
    Signquerymember(id) {
      this.$http
        .post("/api/sign/signquerymember", {
          id: id
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.signmembers.length) {
              this.init();
              let isSign = [];
              let noSign = [];
              let Data = res.data.data;
              let signnum = 0;
              let totalnum = 0;

              // //! cjy: 测试多名学生
              //   for(let i=0; i<3; i++){
              //       Data.signmembers = [...Data.signmembers, ...Data.signmembers];
              //   }

              for (let item of Data.signmembers) {
                for (let v of Data.users) {
                  if (item.userid == v.id) {
                    item.name = v.name;
                    item.avatar = v.avatar;
                    item.isShowPopver = false;
                  }
                }
                totalnum++;
                if (item.state) {
                  signnum++;
                  isSign.push(item);
                } else {
                  noSign.push(item);
                }
              }
              this.navInfo.total = totalnum;
              this.navInfo.signTotal = signnum;
              this.tempList = Data.signmembers;
              this.signMemberList = Data.signmembers;
              // this.tempList = [...isSign, ...noSign];
              // this.signMemberList = [...isSign, ...noSign];
              //  console.log("学生打卡记录", this.signMemberList);
              this.onlistchanged();
            }
            this.isOpenSign = true;
            this.navInfo.issign = true;
          } else {
          }
          Indicator.close();
          this.isLoad = true;
        })
        .catch(() => {
          Indicator.close();
          this.isLoad = true;
        });
    },
    onsetSign(ob) {
      if (ob.state) {
        this.navInfo.signTotal++;
      } else {
        this.navInfo.signTotal--;
      }
      let members = this.signMemberList;
      for (let v of members) {
        if (v.id == ob.id) {
          v.state = ob.state;
        }
      }
      this.signMemberList = members;
    },
    getSignCode() {
      //! cjy: 由客户端生成scene场景， 方便后续维护
      let scene = "sign;id=" + this.signid;
      this.$http
        .post(
          //"/api/weixin/qrcodesign",
          "/api/weixin/appqrcode",
          {
            //bankeid: this.bankeid
            scene: scene
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              this.base64 = "data:image/png;base64," + res.data.data;
            }
          }
        })
        .catch(() => {});
    },

    openSign() {
      Indicator.open("加载中...");
      this.$http
        .post("/api/sign/signadd", {
          bankeid: this.bankeid,
          info: "",
          usedaping: 1 //! 使用大屏的info
        })
        .then(res => {
          if (res.data.code == 0) {
            console.log("教师打卡上课,", res);
            let signData = res.data.data.sign;
            this.signdata = signData;
            this.signid = signData.id;
            this.isOpenSign = true;
            this.updatecontent();
            this.getSignCode();
          } else {
            Toast("开启失败：" + res.data.msg);
          }
          Indicator.close();
        })
        .catch(() => {
          Toast("出错了...");
          Indicator.close();
        });
    },
    scrollAnimation(currentY, targetY) {
      // 获取当前位置方法
      // const currentY = document.documentElement.scrollTop || document.body.scrollTop
      // 计算需要移动的距离
      let needScrollTop = targetY - currentY;
      let _currentY = currentY;
      console.log(needScrollTop);
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 20);
        _currentY += dist;
        window.scrollTo(_currentY, currentY);
        // 如果移动幅度小于二十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 20 || needScrollTop < -20) {
          this.scrollAnimation(_currentY, targetY);
        } else {
          window.scrollTo(_currentY, targetY);
          this.isScroll = false;
          let deviseH =
            window.innerHeight || document.documentElement.clientHeight;
          let currentY =
            document.documentElement.scrollTop || document.body.scrollTop;
          // alert(currentY);
          // alert(currentY + deviseH);
          // alert(this.DOCH);
          if (!currentY) {
            this.toT = false;
            this.toB = true;
          } else {
            this.toT = true;
            if (currentY + deviseH >= this.DOCH) {
              this.toB = false;
            } else {
              this.toB = true;
            }
          }
        }
      }, 1);
    },
    onScrollFn(type) {
      if (this.isScroll) return;
      this.isScroll = true;
      let currentY =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (type) {
        this.scrollAnimation(currentY, this.deviseH + currentY);
      } else {
        this.scrollAnimation(currentY, currentY - this.deviseH);
      }
    },
    init() {
      this.navInfo.total = 0;

      this.navInfo.signTotal = 0;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: {
    HeaderNav,
    MemberList,
    [Switch.name]: Switch
  }
};
</script>

<style lang="less">
.biggp-group-wrap {
  padding: 0 5vw;
  margin-bottom: 60px;
  .main {
    .member-wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 127px;
      .MemberList {
        width: 75%;
        min-width: 75%;
        max-width: 75%;
        padding-right: 20px;
        border-right: 1px dashed rgba(112, 112, 112, 1);
        .outer {
          margin: 25px 0;
          border-bottom: 1px dashed rgba(112, 112, 112, 1);
          font-size: 24px;
          padding-bottom: 10px;
          color: #7a7a7a;
          margin-right: 69px;
        }
      }
    }
  }
  .qrcode-info-wrap {
    position: fixed;
    right: 2vw;
    top: 50%;
    display: flex;
    justify-content: flex-end;
    transform: translate(0, -50%);
    z-index: 12;
    .code-wrap {
      .qrcode-img {
        width: 280px;
      }
      #canvas {
      }
      p {
        font-size: 24px;
      }
      .join {
        display: flex;
        align-items: center;
        padding: 0 25px;
        span {
          margin-left: 10px;
        }
      }
      .tips {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 66px;
        color: #000;
        font-weight: bold;
        background: rgba(236, 236, 236, 1);
        margin-top: 30px;
        padding: 0 30px;
      }
    }
  }
  .fixed-header {
    position: fixed;
    left: 50%;
    top: 0;
    width: 90vw;
    margin: 0 auto;
    z-index: 9;
    background: #fff;
    transform: translate(-50%, 0);
  }
  .fixed-header .starttimedesc-wrap {
    position: absolute;
    right: 0;
    bottom: -25px;
    margin: 0;
  }
  .fixed-header .starttimedesc-wrap .tit {
    font-weight: bold;
  }
  .scroll-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 70%;
    z-index: 11;
    background: #fff;
    text-align: center;
    .iconfont {
      font-size: 60px;
      margin: 0 15px;
      &.opacity {
        opacity: 0.3;
      }
    }
  }
  .open-sign-wrap {
    position: fixed;
    top: 50%;
    transform: translate(-100%;-50%);
    .open-sign-btn {
      position: relative;
      display: block;
      width: 247px;
      height: 247px;
      background: linear-gradient(
        180deg,
        rgba(153, 205, 250, 1) 0%,
        rgba(0, 130, 241, 1) 100%
      );
      box-shadow: 0px 6px 6px rgba(0, 137, 255, 0.36);
      border-radius: 50%;
      opacity: 1;
      .text {
        font-size: 30px;
        color: #fff;
      }
    }
  }
}
</style>
