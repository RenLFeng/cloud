<template>
  <div class="danmu-wrap">
    <mt-header title="弹幕互动" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="$back">返回</mt-button>
    </mt-header>
    <div class="main main-f">
      <!-- :bottom-method="loadMore"
          @bottom-status-change="handleBottomChange"
          :bottom-all-loaded="allLoaded"
          bottomPullText=""
      bottomDropText="上拉加载更多"-->
      <div class="list-scoll-wrap">
        <mt-loadmore
          ref="loadmore"
          :auto-fill="autofill"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div class="wrap">
            <div class="aaa" v-if="danmuDataList.length">
              <div class="item" v-for="(v,i) in danmuDataList" :key="i">
                <p class="info-text fontsmall" :style="`color:${v.info.color}`">{{v.info.text}}</p>
                <div class="info-name position-r">
                  <p class="font16">{{v.info.name}}</p>
                  <p class="font-xxs time">{{v.day}}&nbsp;{{v.time}}</p>
                </div>
              </div>
              <BottomLoadmore v-if="listLoadend" showType loadtext="已经加载全部了" type color />
              <BottomLoadmore
                v-if="!listLoadend && loading"
                showType="loading"
                loadtext="加载中..."
                type="triple-bounce"
                color
              />
            </div>
            <Empty v-else :text="['无数据']" />
          </div>
        </mt-loadmore>
      </div>
      <!-- <div class="mask"></div> -->
    </div>
    <div class="submit-wrap" :class="isOpen?'act':''">
      <div class="field-wrap clearfix">
        <span
          @click="selectColorBtn"
          class="iconfont iconyangshi eicotrigger position-l"
          style="color:#38ADA9"
        ></span>
        <div class="mint-field fl position-c">
          <input
            v-model="inputVal"
            placeholder="请输入弹幕内容"
            autocomplete="off"
            class="text-input"
            @keyup.enter="submitDanmu"
            @input="textChange($event.target.value)"
            maxlength="24"
          />
        </div>

        <span class="position-r submit-btn" @click="submitDanmu">发送</span>
      </div>
      <div class="colors-wrap">
        <p class="tit fontsmall">弹幕颜色</p>
        <div class="colors clearfix">
          <span
            class="fl fontsmall tc"
            v-for="(v,i) in colors"
            :key="i"
            @click="selectColorFn(i)"
            :style="`background:${v.isAct?v.color:''};color:${v.isAct?'#fff':v.color};border:1px solid ${v.color}`"
          >{{v.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Indicator,
  Toast,
  MessageBox,
  Cell,
  Field,
  loadmore,
  InfiniteScroll
} from "mint-ui";
import Empty from "@/common/empty";
import { parseURL, uniqueArr, sortFn } from "@/util";
import BottomLoadmore from "@/common/bottom-loadmore";
export default {
  name: "Danmu",
  props: {},
  data() {
    return {
      bankeid: 0,
      userid: 0,
      isOpen: false,
      isLink: false,
      LinkInfo: {},
      danmuDataList: [],
      inputVal: "",
      colorEnd: "#000000",
      colors: [
        {
          color: "#FF6600",
          name: "橙色",
          isAct: false
        },
        {
          color: "#FF0000",
          name: "红色",
          isAct: false
        },
        {
          color: "#0089FF",
          name: "蓝色",
          isAct: false
        },
        {
          color: "#C500FF",
          name: "紫色",
          isAct: false
        },
        {
          color: "#00BB1F",
          name: "绿色",
          isAct: false
        },
        {
          color: "#FEA6D2",
          name: "粉色",
          isAct: false
        }
      ],
      page: 0,
      pagesize: 10,
      loading: false,

      autofill: false,
      listLoadend: false,
      topStatus: "",
      bottomStatus: "",
      allLoaded: false,
      dropType: 0
    };
  },
  computed: {
    user() {
      return this.$store.getters.curuser;
    },
    caneditbanke() {
      let caneditbanke = this.$store.getters.caneditbanke;
      return caneditbanke;
    },
    detail_go_school() {
      return this.$store.state.detail_go_school;
    }
  },
  created() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
      this.userid = params.userid;
    }
    this.queryDapingLink();
    this.queryDanmu();
  },
  mounted() {},
  watch: {},
  methods: {
    // loadTop() {
    //   this.page = 0;
    //   this.danmuDataList = [];
    //   this.loadMore();
    // },
    loadMore() {
      this.loading = true;
      this.queryDanmu();
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    queryDanmu() {
      // Indicator.open("查询中...");
      this.$http
        .post("/api/danmu/query", {
          bankeid: this.bankeid,
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.length) {
              if (res.data.data.length >= this.pagesize) {
                this.loading = false;
                this.page++;
              } else {
                if (this.page) {
                  this.listLoadend = true;
                }
                this.allLoaded = true;
              }
              for (let v of res.data.data) {
                try {
                  v.info = JSON.parse(v.info);
                  let createtime = v.createtime.replace(/-/g, "/");
                  v.timeStr = new Date(createtime).getTime();
                } catch (e) {}

                v.time = v.createtime.split(" ")[1];
                v.day = this.getDayName(v.createtime);
              }
              this.danmuDataList = [...this.danmuDataList, ...res.data.data];
              let obj = {};
              this.danmuDataList = this.danmuDataList.reduce((cur, next) => {
                obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
                return cur;
              }, []);
              this.danmuDataList.sort(sortFn("timeStr", 0));
            } else {
              this.allLoaded = true;
            }
          } else {
            Toast("查询失败");
          }
          // Indicator.close();
          this.$refs.loadmore.onBottomLoaded();
        })
        .catch(err => {
          this.$refs.loadmore.onBottomLoaded();
          Toast("服务异常");
          // Indicator.close();
        });
    },
    textChange(v) {
      if (v.length > 23) {
        Toast("最大可输入24个字符");
      }
    },
    submitDanmu() {
      if (!this.isLink) {
        Toast("当前班课未开课");
        return;
      }
      if (!this.inputVal) {
        Toast("请输入弹幕内容");
        return;
      }
      let submitData = {
        bankeid: this.bankeid,
        info: {
          text: this.inputVal,
          color: this.colorEnd,
          name: this.user.name
        }
      };
      submitData.info = JSON.stringify(submitData.info);
      Indicator.open("发送中...");
      this.$http
        .post("/api/danmu/add", submitData)
        .then(res => {
          if (res.data.code == "0") {
            Toast("发送成功");
            this.inputVal = "";
            this.isOpen = false;
            res.data.data.info = JSON.parse(res.data.data.info);
            res.data.data.time = res.data.data.createtime.split(" ")[1];
            res.data.data.day = this.getDayName(res.data.data.createtime);
            this.danmuDataList = [...this.danmuDataList, ...[res.data.data]];
            this.allLoaded = false;
            this.listLoadend=false;
            this.loading=false;
          } else {
            Toast("发送失败");
          }
          Indicator.close();
        })
        .catch(err => {
          Toast("服务异常");
          Indicator.close();
        });
    },
    selectColorBtn() {
      this.isOpen = !this.isOpen;
    },
    selectColorFn(i) {
      if (this.colors[i].isAct) {
        this.colors[i].isAct = false;
        this.colorEnd = "#000000";
        return;
      }
      for (let v of this.colors) {
        v.isAct = false;
      }
      this.colors[i].isAct = true;
      this.colorEnd = this.colors[i].color;
    },
    //查询大屏登录
    queryDapingLink() {
      this.$http
        .post("/api/banke/dapingquery", {
          userid: this.userid
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data == null) {
              //  this.isLink=true;
            } else {
              this.LinkInfo = res.data.data.daping;
              console.log(this.LinkInfo);
              let curbanke = this.$store.state.curbanke;
              if (curbanke.id == this.LinkInfo.bankeid) {
                this.isLink = true;
              }
            }
          }
          Indicator.close();
        })
        .catch(err => {
          // Toast('服务异常')
          Indicator.close();
        });
    },
    getDayName(date) {
      let td = new Date();
      td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
      let od = new Date(date.replace(/-/g, "/"));
      od = new Date(od.getFullYear(), od.getMonth(), od.getDate());
      let xc = (od - td) / 1000 / 60 / 60 / 24;
      if (xc < -2) {
        return -xc + "天前";
      } else if (xc < -1) {
        return "前天";
      } else if (xc < 0) {
        return "昨天";
      } else if (xc == 0) {
        return "今天";
      } else if (xc < 2) {
        return "明天";
      } else if (xc < 3) {
        return "后天";
      } else {
        return xc + "天后";
      }
    }
  },
  components: {
    Empty,
    BottomLoadmore
  }
};
</script>

<style scoped lang="less">
.danmu-wrap {
  .main {
    height: 93vh;
    min-height: 93vh;
    position: relative;
    margin-top: 49px;
    .list-scoll-wrap {
      width: 100%;
      height: auto;
      max-height: 83vh;
      overflow: scroll;
      transition: all 0.3s;
      // background: #fff;
      .wrap {
        height: auto;
        min-height: 83vh;
        .item {
          position: relative;
          height: 87px;
          max-height: 87px;
          padding: 0 10px;
          border-top: 1px solid #f0f0f0;
          background: #fff;
          .info-text {
            position: absolute;
            left: 10px;
            top: 20px;
            width: 70%;
          }
          .info-name {
            width: 30%;
            text-align: right;
            color: #5d5d5d;
            .time {
              margin-top: 7px;
            }
          }
        }
      }
      &.act {
        height: 61vh;
      }
    }
    .mask {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9;
    }
  }
  .submit-wrap {
    position: fixed;
    width: 100%;
    height: 9vh;
    max-height: 40vh;
    left: 0;
    bottom: 0;
    z-index: 10;
    background: #fff;
    transition: all 0.3s;
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16);
    .field-wrap {
      position: relative;
      height: 9vh;
      .iconfont {
        font-size: 33px;
      }
      .submit-btn {
        width: 66px;
        height: 43px;
        font-size: 18px;
        text-align: center;
        background: #0089ff;
        line-height: 43px;
        color: #fff;
        border-radius: 30px;
      }
      .mint-field {
        width: 69%;
        min-height: 48px;
        padding-right: 9%;
        .text-input {
          width: 100%;
          background: rgba(249, 249, 249, 1);
          border: 1px solid rgba(240, 240, 240, 1);
          opacity: 1;
          border-radius: 8px;
        }
      }
    }
    .colors-wrap {
      padding: 0 10px;
      .tit {
        color: #5d5d5d;
        padding-bottom: 5px;
      }
      .colors {
        span {
          width: 28%;
          height: 50px;
          margin: 3px 2.6%;
          line-height: 50px;
          border-radius: 10px;
          &.act {
          }
        }
      }
    }
    &.act {
      height: 40vh;
      transition: all 0.3s;
    }
  }
}
</style>
<style>
.danmu-wrap .mint-field-core {
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  padding: 5px 5px;
  border-radius: 8px;
}
</style>