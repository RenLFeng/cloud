<template>
  <div class="pingce-dtail-warp">
    <div class="main">
      <div class="pic" v-if="pingceItemfile.ptype!='10'">
        <img :src="`${pingceItemfile.files}_snap.jpg`" class alt @click="previewimg" />
        <p class="color9">
          题目
          <span class="fr">{{pingceItemfile.createtime}}</span>
        </p>
      </div>
      <div v-if="pingceItemfile.ptype=='10'" class="clearfix">
        <div class="vote-wrap fl">
          <FileList :listData="voteInfos" type="isdetail" />
        </div>
      </div>
      <div class="big-wrap">
        <div class="van-navbr-wrap" v-if="pingceItemfile.ptype!='10' && memberData.length">
          <ul ref="mainwrap" :style="`left:-${Slide}px`">
            <li
              v-for="(v,i) in tabBar"
              :key="i"
              :class="v.isActive?'active':''"
              @click="selectClick($event,v,i)"
              ref="tbLi"
            >
              <span class="lable font18">{{v.label}}</span>
              <span class="num fontxs">{{v.num}}</span>
            </li>
            <span class="move-bar" :style="`left:${moveBar}px`"></span>
          </ul>
        </div>

        <!--  学生提交展示 -->
        <div class="list-main" v-if="memberData.length" :class="pingceItemfile.ptype!=10?'top':''">
          <div class="content">
            <!-- <p class="clearfix tit" v-if="pingceItemfile.ptype!='10'">
            <span class="fl">{{memberData.length}} 人提交</span>
            </p>-->
            <div>
              <List
                v-for="(v,index) in memberData"
                :key="index"
                :item="v"
                type="pingcedetail"
                :ptype="pingceItemfile.ptype"
                @click.native="onMemberClick(v)"
                @previewimg="onPreviewimg"
              />
            </div>
          </div>
        </div>
        <div v-else class="list-main">
          <span v-if="pingceItemfile.ptype!=10" class="position-c">无提交</span>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupDeatil" position="right" class="mint-popup" :modal="false" style>
      <mt-header :title="`${memBerItem.name}的答案`">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <div class="answer-detail-wrap">
        <div class="main">
          <p class="tit">
            <img
              class="itemavatar object-fit-img"
              :src="memBerItem.avatar"
              :onerror="$defaultImg('account')"
            />
            {{memBerItem.name}}
            <span class="time">{{memBerItem.countdate}}</span>
          </p>
          <p class="answer">{{memBerItem.answerdesc.textarea}}</p>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import {Indicator, Toast, MessageBox } from "mint-ui";
import List from "@/common/list";
import Empty from "@/common/empty";
import nativecode from "@/nativecode";
import FileList from "../pingceing/vote/filelist";
import { sortFn } from "@/util";
const panduan = [
  {
    label: "ALL",
    num: 0,
    isActive: true
  },
  {
    label: "对",
    num: 0,
    isActive: false
  },
  {
    label: "错",
    num: 0,
    isActive: false
  },
  {
    label: "NA",
    num: 0,
    isActive: false
  }
];
const zhuguan = [
  {
    label: "ALL",
    num: 0,
    isActive: true
  },
  {
    label: "已作答",
    num: 0,
    isActive: false
  },
  {
    label: "NA",
    num: 0,
    isActive: false
  }
];
const qiangda = [
  {
    label: "ALL",
    num: 0,
    isActive: true
  },
  {
    label: "已参与",
    num: 0,
    isActive: false
  },
  {
    label: "NA",
    num: 0,
    isActive: false
  }
];
export default {
  name: "",
  props: {
    data: {
      default() {
        return {};
      }
    },
    showState: {
      default: false
    }
  },
  components: {
    List,
    Empty,
    FileList
  },
  watch: {
    data: function(newValue, oldValue) {
      this.pingceItemfile = newValue;
      console.log("fsfs", this.pingceItemfile);
      this.querySubmitDetail();
    },
    showState: function(newValue, oldValue) {
      this.inittabBar();
    }
  },
  data() {
    return {
      Slide: 0,
      pingceItemfile: {},
      memberData: [],
      tempMemberData: [],
      popupDeatil: false,
      memBerItem: {
        answerdesc: {
          textarea: {}
        }
      },
      voteInfos: [],

      moveBar: 0,
      filterType: "ALL",
      xuanz: [],
      panduan,
      zhuguan,
      qiangda,
      allmembers: []
      //  NaMembers: []
    };
  },
  computed: {
    NAdes() {
      let type = this.pingceItemfile.ptype;
      return "未作答";
    },
    tabBar() {
      switch (this.pingceItemfile.ptype) {
        case 1:
          return this.panduan;
        case 2:
          this.opts();

          return this.xuanz;
        case 3:
          this.opts();
          return this.xuanz;
        case 4:
          return this.zhuguan;
        case 5:
          return this.zhuguan;
        case 6:
          return this.qiangda;
        case 10:
          return [];
        default:
          [];
      }
    }
  },
  mounted() {},
  methods: {
    opts() {
      this.xuanz = [
        {
          label: "ALL",
          num: 0,
          isActive: true
        },
        {
          label: "NA",
          num: 0,
          isActive: false
        }
      ];
      let opts = this.pingceItemfile.optdesc.opts;
      for (let i = 0; i < opts.length; i++) {
        let v = opts[i];
        this.xuanz.splice(i + 1, 0, {
          label: v,
          num: 0,
          isActive: false
        });
      }
    },
    selectClick(e, v, i) {
      if (!v.num) return;
      let curel = this.$refs.tbLi[i];
      this.moveBar = curel.offsetLeft;
      this.filterType = v.label;
      for (let v of this.tabBar) {
        v.isActive = false;
      }
      this.tabBar[i].isActive = true;
      this.filterData(this.filterType);
    },
    filterData(type) {
      if (type == "ALL") {
        this.memberData = this.tempMemberData;
        return;
      }
      this.memberData = this.tempMemberData.filter(item => {
        if (type == "NA") {
          if (item.hassubmit) {
            return false;
          }
          return true;
        }
        if (!item.hassubmit) {
          return false;
        }
        if (this.pingceItemfile.ptype == 4) {
          return item.answerdesc.file;
        } else if (this.pingceItemfile.ptype == 5) {
          return item.answerdesc.textarea;
        } else {
          let opts = JSON.stringify(item.answerdesc.opts);
          if (opts.includes("正确")) {
            opts = "对";
          }
          return opts.includes(type);
        }
      });
      this.$nextTick(() => {});
    },
    Statistics(arr) {
      if (Array.isArray(arr)) {
        // let arr =JSON.parse(JSON.stringify(arr));
        this.initStatistics();
        this.tabBar[0].num = arr.length;
        for (let j = 1; j < this.tabBar.length; j++) {
          let v = this.tabBar[j];

          for (let i = 0; i < arr.length; ++i) {
            if (v.label == "NA") {
              if (!arr[i].hassubmit) {
                v.num++;
              }
              continue;
            }
            if (!arr[i].hassubmit) {
              continue;
            }

            if (this.pingceItemfile.ptype == 4) {
              v.num++;
            } else if (this.pingceItemfile.ptype == 5) {
              v.num++;
            } else {
              let and = arr[i].answerdesc;
              if (and && and.opts && typeof and.opts == "object") {
                let opts = JSON.stringify(and.opts);
                if (opts.includes("正确")) {
                  opts = "对";
                }
                if (opts.includes(v.label)) {
                  v.num++;
                }
              }
            }
          }
        }
        // this.tabBar[this.tabBar.length - 1].num = this.NaMembers.length;
      }
      console.log("tabBartabBar", this.tabBar);
    },
    previewimg() {
      nativecode.previewImage(this, this.pingceItemfile.files);
    },
    querySubmitDetail() {
      console.log("投票this.pingceItemfile", this.pingceItemfile);
      //! 清空当前数据
      this.memberData = [];
      this.tempMemberData = [];
      this.voteInfos = [];
      this.$http
        .post("api/pingce/querysubmit2", {
          //！ cjy： 使用新接口请求带有未提交的submit
          id: this.pingceItemfile.id,
          bankeid: this.pingceItemfile.classid
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.submit.length) {
              let members = res.data.data.submit;
              for (let item of members) {
                //! cjy: 目前得分为0 则视为未提交
                if (item.score) {
                  item.hassubmit = true;
                } else {
                  item.hassubmit = false;
                }
                try {
                  item.answerdesc = JSON.parse(item.answerdesc);
                } catch (e) {}
                if (!item.answerdesc) {
                  //! 设为空串
                  item.answerdesc = {};
                }

                let hasuinfo = false;

                for (let v of res.data.data.users) {
                  if (item.userid == v.id) {
                    item.avatar = v.avatar;
                    item.name = v.name;
                    hasuinfo = true;
                    break;
                  }
                }
                if (!hasuinfo) {
                  item.name = "未知用户";
                }
              }
              if (this.pingceItemfile.ptype == "1") {
                for (let item of members) {
                  for (let key in item.answerdesc.opts) {
                    let v = item.answerdesc.opts[key];
                    switch (v) {
                      case "A":
                        item.answerdesc.opts[key] = "正确";
                        break;
                      case "B":
                        item.answerdesc.opts[key] = "错误";
                        break;
                    }
                  }
                }
              }
              if (this.pingceItemfile.ptype == "6") {
                for (let item of members) {
                  if (item.hassubmit) {
                    item.isResponder = "抢答成功";
                    item.answerdesc.opts[0] = "已参与";
                  }
                }
              }
              if (this.pingceItemfile.ptype == "10") {
                this.voteInfos = this.pingceItemfile.info.opts;
                for (let v of this.voteInfos) {
                  v.count = 0;
                }
                for (let item of members) {
                  if (item.answerdesc.opts) {
                    for (let v of item.answerdesc.opts) {
                      for (let key in this.voteInfos) {
                        if (v == key) {
                          this.voteInfos[key].count++;
                          item.toName = this.voteInfos[key].name;
                        }
                      }
                    }
                  }
                }
                this.voteInfos.sort(sortFn("count", 1));
                console.log("投票", this.voteInfos);
              }
              this.tempMemberData = members;

              this.Statistics(this.tempMemberData);
              this.filterData(this.filterType);
              //! cjy: server 的 querysubmit 优化， 返回所有应提交的名单； 因为参与学生可能会变动
              //   this.bankememberquery(this.memberData);
              console.log("提交详细", members);
            } else {
              this.memberData = [];
              this.tempMemberData = [];
              this.voteInfos = [];
              this.initStatistics();
            }
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          // Toast("异常");
        });
    },
    //! cjy:
    // bankememberquery(memberData) {
    //   this.NaMembers = [];
    //   this.$http
    //     .post("/api/api/bankememberquery", {
    //       bankeid: this.pingceItemfile.classid
    //     })
    //     .then(res => {
    //       if (res.data.code == "0") {
    //         this.allmembers = res.data.data.members;
    //         for (let v of this.allmembers) {
    //           for (let item of memberData) {
    //             if (v.memberuserid == item.userid) {
    //               v.submit = true;
    //             }
    //           }
    //         }
    //         for (let v of this.allmembers) {
    //           if (!v.submit) {
    //             this.NaMembers.push(v);
    //           }
    //         }
    //         this.tabBar[this.tabBar.length - 1].num = this.NaMembers.length;
    //         // this.Statistics(this.tempMemberData);
    //         console.log("allmembers", this.allmembers);
    //         console.log("nanaan", this.NaMembers);
    //         console.log("hhhhhh", this.tabBar);
    //       }
    //     })
    //     .catch(err => {});
    // },
    onMemberClick(v) {
      if (this.pingceItemfile.ptype == "5") {
        this.memBerItem = v;
        console.log("vv", v);
        this.popupDeatil = true;
      }
    },
    onPreviewimg(item) {
      let tempImgs = [];
      tempImgs.push(nativecode.getUsedUrl(item.answerdesc.file));
      nativecode.previewImage(this, {
        urls: tempImgs,
        index: 0
      });
    },
    goBacks() {
      if (this.popupDeatil) {
        this.popupDeatil = false;
      }
    },
    initStatistics() {
      console.log("sb", this.tabBar);
      for (let v of this.tabBar) {
        v.num = 0;
      }
    },
    inittabBar() {
      this.moveBar = 0;
      this.filterType = "ALL";
      for (let item of this.tabBar) {
        item.isActive = false;
      }
      this.tabBar[0].isActive = true;
    }
  },
  destroyed() {}
};
</script>

<style lang='less' scoped>
.pingce-dtail-warp {
  .main {
    background: #fff;
    .vote-wrap {
      width: 100%;
    }
    .pic {
      width: 60%;
      height: 28vh;
      margin: 0 auto;
      padding: 30px 0 10px 0;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        margin-top: 20px;
      }
    }
    .big-wrap {
      position: relative;
      .list-main {
        position: relative;
        width: 100%;
        height: 60vh;
        min-height: 60vh;
        background: #f0f0f0;
        overflow: scroll;
        .content {
          background: #fff;
          // padding: 10px;
          .tit {
            border-bottom: 1px solid #f0f0f0;
            padding: 10px 0;
          }
        }
        &.top {
          padding-top: 26px;
        }
      }
    }

    .van-navbr-wrap {
      position: absolute;
      width: 100vw;
      height: 54px;
      z-index: 99;
      top: 0;
      left: 0;
      overflow-x: scroll;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      > ul {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        transition: all 0.3s;
        li {
          display: flex;
          width: 58px;
          height: 54px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          span {
            color: #5d5d5d;
          }
          .lable {
          }
          .num {
          }
          &.active {
            span {
              color: #0089ff;
            }
          }
        }
        .move-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 52px;
          height: 3px;
          background: #0089ff;
          transition: all 0.3s;
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .na-wrap {
      .item {
        padding: 10px;
        border-bottom: 1px solid #f0f0f0;
        li {
          img {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .answer-detail-wrap {
    .main {
      padding: 10px;
      .tit {
        img {
          width: 30px;
          margin-right: 10px;
          border-radius: 50%;
        }
        .time {
          margin-left: 10px;
        }
      }
      .answer {
        margin-top: 20px;
      }
    }
  }
}
</style>
