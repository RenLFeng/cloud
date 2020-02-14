<template>
  <div class="danmu-wrap">
    <mt-header title="弹幕互动" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="$back">返回</mt-button>
    </mt-header>
          <div class="main main-f">
            <div 
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="100"
             infinite-scroll-immediate-check	="false"
            class="list-scoll-wrap" @click="isOpen=false">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :auto-fill="autofill">
              <div class="wrap">
                <div class="aaa" v-if="danmuDataList.length">
                  <div class="item" v-for="(v,i) in danmuDataList" :key="i">
                  <p class="info-text fontsmall" :style="`color:${v.info.color}`">{{v.info.text}}</p>
                  <div class="info-name position-r">
                    <p class="font16">{{v.info.name}}</p>
                    <p class="font-xxs time">{{v.day}}&nbsp;{{v.time}}</p>
                    </div>
                  </div>
                  <p class="tc color9" v-if="loading && page && !loadend">加载中...</p>
                  <p class="tc color9" v-if="loadend">我是有底线的...</p>
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
        <mt-field
          class="fl position-c"
          placeholder="请输入弹幕内容"
          :attr="{ maxlength: 24 }"
          v-model="inputVal"
        ></mt-field>
        <span class="position-r submit-btn" @click="submitDanmu">发送</span>
      </div>
      <div class="colors-wrap">
        <p class="tit fontsmall">弹幕颜色</p>
            <div class="colors clearfix">
              <span class="fl fontsmall tc" v-for="(v,i) in colors" :key="i" @click="selectColorFn(i)" :style="`background:${v.isAct?v.color:''};color:${v.isAct?'#fff':v.color};border:1px solid ${v.color}`">{{v.name}}</span>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Cell, Field ,loadmore ,InfiniteScroll  } from "mint-ui";
import Empty from "@/common/empty";
import { parseURL } from "@/util";
export default {
  name: "Danmu",
  props: {},
  data() {
    return {
      bankeid: 0,
      userid:0,
      isOpen: false,
      isLink:false,
      LinkInfo:{},
      danmuDataList: [],
      inputVal: "",
      colorEnd:'#000',
      colors: [
        {
          color: "#FF6600",
          name: "橙色",
          isAct:false
        },
        {
          color: "#F00",
          name: "红色",
           isAct:false
        },
        {
          color: "#0089FF",
          name: "蓝色",
           isAct:false
        },
        {
          color: "#C500FF",
          name: "紫色",
           isAct:false
        },
        {
          color: "#00BB1F",
          name: "绿色",
           isAct:false
        },
        {
          color: "#FEA6D2",
          name: "粉色",
           isAct:false
        }
      ],
      page:0,
      pagesize:10,
      autofill: true,
      loading:false,
      loadend:false
    };
  },
  computed: {
      user() {
      return this.$store.getters.curuser;
    },
    maxLen(){
      if(this.inputVal.length>23){
        return true;
      }else{
        return false;
      }
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
      this.userid=params.userid;
    }
    this.queryDapingLink();
    this.queryDanmu();
  },
  mounted() {},
  watch: {
  },
  methods: {
     loadTop() {
       this.page=0;
        this.danmuDataList=[];
      this.loadMore();
    },
    loadMore(){
      this.loading = true;
      this.queryDanmu();
    },
    queryDanmu(){
      Indicator.open("查询中...");
      this.$http
        .post("/api/danmu/query", {
            "bankeid":this.bankeid,
            "page":this.page,
            "pagesize":this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            if(res.data.data.length){
              for(let v of  res.data.data){
                // if(v.info.includes('json字符串')){
                //   v.info={"text":"fsdfs","color":"#0089FF","name":"json字符串"};
                //   v.info=JSON.stringify(v.info);
                // }
                v.info=JSON.parse(v.info);
                 v.time=v.createtime.split(' ')[1];
                 v.day=this.getDayName(v.createtime);
              }
              this.danmuDataList=[...this.danmuDataList,...res.data.data];
              if(res.data.data.length>=this.pagesize){
               this.loading = false;
               this.page++;
              }else{
              if(this.page){
                this.loadend = true;
              }
              }
            }
          } else {
              Toast('查询失败')
          }
          Indicator.close();
           this.$refs.loadmore.onTopLoaded();
        })
        .catch(err => {
          Toast('服务异常')
          Indicator.close();
        });
    },
    submitDanmu(){
      if(!this.isLink){
        Toast('请先连接到大屏端');
        return;
      }
      if(!this.inputVal){
        Toast('请输入弹幕内容')
        return;
      }
      let submitData={
          "bankeid":this.bankeid,
            "info":{
              text:this.inputVal,
              color:this.colorEnd,
              name:this.user.name
            },
      }
      submitData.info=JSON.stringify( submitData.info);
     Indicator.open("发送中...");
      this.$http
        .post("/api/danmu/add", submitData)
        .then(res => {
          if (res.data.code == "0") {
            Toast('发送成功');
            this.inputVal='';
            this.isOpen=false;
            res.data.data.info=JSON.parse(res.data.data.info);
              res.data.data.time=res.data.data.createtime.split(' ')[1];
               res.data.data.day=this.getDayName(res.data.data.createtime);
              this.danmuDataList=[...[res.data.data],...this.danmuDataList];
          } else {
              Toast('发送失败')
          }
          Indicator.close();
        })
        .catch(err => {
          Toast('服务异常')
          Indicator.close();
        });
    },
    selectColorBtn() {
      this.isOpen = !this.isOpen;
    },
    selectColorFn(i){
      for(let v of this.colors){
        v.isAct=false;
      }
      this.colors[i].isAct=true;
      this.colorEnd= this.colors[i].color;
    },
    //查询大屏登录
    queryDapingLink(){
       this.$http
        .post("/api/banke/dapingquery", {
           "userid":this.userid
        })
        .then(res => {
          if (res.data.code == "0") {
            if(res.data.data==null){
              //  this.isLink=true;
            }else{
              this.isLink=true;
              this.LinkInfo=res.data.data.daping;
              }
          }
          Indicator.close();
        })
        .catch(err => {
          // Toast('服务异常')
          Indicator.close();
        });
    },
  getDayName(date){
   let td=new Date();
   td=new Date(td.getFullYear(),td.getMonth(),td.getDate());
   let od=new Date(date.replace(/-/g, '/'));
   od=new Date(od.getFullYear(),od.getMonth(),od.getDate());
   let xc=(od-td)/1000/60/60/24;
   if(xc<-2){
      return -xc+"天前";
   }else if(xc<-1){
      return "前天";
   }else if(xc<0){
      return "昨天";
   }else if(xc==0){
      return "今天";
   }else if(xc<2){
      return "明天";
   }else if(xc<3){
      return "后天";
   }else{
      return xc+"天后";
   }
}
  },
  components: {
    Empty
  }
};
</script>

<style scoped lang="less">
.danmu-wrap {
  .main {
    height: 93vh;
    min-height: 93vh;
    position: relative;
    margin-top:49px;
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
            color:#5D5D5D;
            .time{
              margin-top:7px;
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
            &.act{

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