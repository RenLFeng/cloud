<template>
  <div class="pingce-dtail-warp">
    <div class="main">
      <div class="pic" v-if="pingceItemfile.ptype!='10'">
        <img
          :src="`${pingceItemfile.files}_snap.jpg`"
          class="object-fit-img"
          alt
          @click="previewimg"
        />
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
      <div class="list-main" v-if="memberData.length">
        <div class="van-navbr-wrap" v-if="pingceItemfile.ptype!='10'">
          <ul>
            <li
              v-for="(v,i) in tabBar"
              :key="i"
              :class="v.isActive?'active':''"
              @click="selectClick($event,v,i)"
            >
              <span class="lable font18">{{v.label}}</span>
              <span class="num fontxs">{{v.num}}</span>
            </li>
            <span class="move-bar" :style="`left:${tabActive*54}px`"></span>
          </ul>
        </div>
        <div class="content">
          <!-- <p class="clearfix tit" v-if="pingceItemfile.ptype!='10'">
            <span class="fl">{{memberData.length}} 人提交</span>
          </p> -->
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
      <!--<Empty v-else :text="['无提交']" /> -->
      <div v-else class="list-main">无提交</div>
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
import { Button, Indicator, Toast, Cell, MessageBox, Loadmore } from "mint-ui";
import List from "@/common/list";
import Empty from "@/common/empty";
import nativecode from "@/nativecode";
import FileList from "../pingceing/vote/filelist";
import { sortFn } from "@/util";
const xuanzhe = [
  {
    label: "ALL",
    num: 0,
    isActive: true
  },
  {
    label: "A",
    num: 0,
    isActive: false
  },
  {
    label: "B",
    num: 0,
    isActive: false
  },
  {
    label: "C",
    num: 0,
    isActive: false
  },

  {
    label: "D",
    num: 0,
    isActive: false
  },
  {
    label: "E",
    num: 0,
    isActive: false
  },
  {
    label: "F",
    num: 0,
    isActive: false
  },
  {
    label: "NA",
    num: 0,
    isActive: false
  }
];
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
      console.log("000000", this.pingceItemfile);
      this.querySubmitDetail();
    }
  },
  data() {
    return {
      pingceItemfile: {},
      memberData: [],
      popupDeatil: false,
      memBerItem: {
        answerdesc: {
          textarea: {}
        }
      },
      voteInfos: [],

      tabActive: 0,
      xuanzhe,
      panduan,
      zhuguan,
      qiangda
    };
  },
  computed: {
    tabBar() {
      switch (this.pingceItemfile.ptype) {
        case 1:
          return this.panduan;
        case 2:
          return this.xuanzhe;
        case 3:
          return this.xuanzhe;
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
    selectClick(e, v, i) {
      console.log(this.tabBar);
      return;
      // var arr = [1, 2, 3, 4, 1, 3, 4, 5, 5, 88, 7, 3, 1];
      // var temp = {};
      // arr.forEach(function(v, k) {
      //   if (temp[v]) {
      //     temp[v]++;
      //   } else {
      //     temp[v] = 1;
      //   }
      // });
      // console.log(temp);
      // return;
      let ev = e || window.event;
      // this.$nextTick(()=>{
      //   alert(ev.offsetX)
      // })
      if (!v.id) {
        this.pingceHistoryList = this.tempHistory;
        return;
      }
      let temp = this.tempHistory.filter(item => {
        return v.id == item.ptype;
      });
      this.pingceHistoryList = temp;
      console.log(temp);
    },
    previewimg() {
      nativecode.previewImage(this, this.pingceItemfile.files);
    },
    querySubmitDetail() {
      this.$http
        .post("api/pingce/querysubmit", {
          id: this.pingceItemfile.id,
          bankeid: this.pingceItemfile.classid
        })
        .then(res => {
          if (res.data.code == "0" && res.data.data.submit.length) {
            this.memberData = res.data.data.submit;
            for (let item of this.memberData) {
              item.answerdesc = JSON.parse(item.answerdesc);
              for (let v of res.data.data.users) {
                if (item.userid == v.id) {
                  item.avatar = v.avatar;
                  item.name = v.name;
                }
              }
            }
            console.log("详细", this.memberData);
            if (this.pingceItemfile.ptype == "1") {
              for (let item of this.memberData) {
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
              for (let item of this.memberData) {
                item.isResponder = "抢答成功";
              }
            }
            if (this.pingceItemfile.ptype == "10") {
              this.voteInfos = this.pingceItemfile.info.opts;
              for (let v of this.voteInfos) {
                v.count = 0;
              }
              for (let item of this.memberData) {
                for (let v of item.answerdesc.opts) {
                  for (let key in this.voteInfos) {
                    if (v == key) {
                      this.voteInfos[key].count++;
                      item.toName = this.voteInfos[key].name;
                    }
                  }
                }
              }
              this.voteInfos.sort(sortFn("count", 1));
              console.log("qqqqqq", this.voteInfos);
            }
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
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
    }
  }
};
</script>

<style lang='less' scoped>
.pingce-dtail-warp {
  .main {
    background: #fff;
    .vote-wrap {
    }
    .pic {
      width: 75%;
      margin: 0 auto;
      padding: 30px 0 10px 0;
      img {
        width: 100%;
      }
      p {
        margin-top: 20px;
      }
    }
    .list-main {
      background: #f0f0f0;
      padding-top: 20px;
      .content {
        background: #fff;
        padding: 10px;
        .tit {
          border-bottom: 1px solid #f0f0f0;
          padding: 10px 0;
        }
      }
    }
    .van-navbr-wrap {
      position: relative;
      width: 100vw;
      height: 54px;
      overflow: hidden;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      > ul {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        li {
          display: flex;
          width: 60px;
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
