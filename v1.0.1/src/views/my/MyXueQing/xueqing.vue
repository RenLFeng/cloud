<template>
  <div class="my-xueqing-wrap">
    <mt-header title="个人学情" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="goBack()">返回</mt-button>
    </mt-header>
    <div class="main main-f">
      <div class="top">
        <div class="user">
          <img
            :src="memberuserid?memberuser.avatar:user.avatar"
            :onerror="$defaultImg('account')"
            class="position-l avatarimgpart avatar"
          />
          <div class="fontsmall namepart ellipse">{{memberuserid?memberuser.name:user.name}}</div>
        </div>
        <!-- <div class="devide"></div> -->
        <mt-cell title="所属学校" is-link @click.native="bindSchool"></mt-cell>
      </div>
              <div class="lable tc">
          <p :class="!isJoin?'act':''" @click="selectClass(0)">
            <span class="tit-name fontsmall">我加入的班课</span>
                   <span class="tit-nub font16">{{myJoin.length?myJoin.length:0}}</span>
   
          </p>
          <p :class="isJoin?'act':''" @click="selectClass(1)">
            <span class="tit-name fontsmall">我创建的班课</span>
              <span class="tit-nub font16">{{myCreate.length?myCreate.length:0}}</span>
          </p>
        </div>
      <div class="info-list-wrap">
        <div v-if="classData.length">
            <div class="item"     v-for="(v,i) in classData"
                    :key="i" >
                            <img
                  :src="v.avatar"
                  :onerror="$defaultImg('account')"
                  class="position-l avatarimgpart"
                />
                <div class="item-info">
                  <p class="fontsmall ellipse">{{v.name}}</p>
                  <p class="fontsmall nub">班课人数：{{v.membernum}}</p>
                </div>
           </div>
        </div>
        <Empty v-else :text="['未找到班课']"/>
        </div>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";
import Empty from "@/common/empty";
export default {
  props: {
     memberuser: {
      default() {
        return {};
      }
    },
    memberuserid: {
      default:''
    },
  },
  data() {
    return {
      isJoin:0,
      classData:[],
      myCreate:[],
      myJoin:[],
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
  },
  created() {
  
  },
  mounted() {
       this.queryuserbanke(this.isJoin);
  },
  watch: {
    memberuserid: function(newValue, oldValue) {
  
    }
  },
  methods: {
    selectClass(type){
      this.isJoin=type;
      if(type){
        this.classData=this.myCreate
      }else{
        this.classData=this.myJoin
      }
    },
    queryuserbanke(type){
      let postData={
              	userid:this.memberuserid?this.memberuserid:this.user.id,
            }
      if(type){
        postData.queryowner=1;
      }
        Indicator.open("加载中...");
        this.$http
            .post("/api/banke/queryuserbanke",postData)
            .then(res => {
              if (res.data.code == "0") {
                if(res.data.data.length){
                  if(!type){
                    this.myJoin=res.data.data;
                    this.classData=this.myJoin;
                  }else{
                    this.myCreate=res.data.data
                }
              } else {
                }
              }
                 if(!type){
                  this.queryuserbanke(1);
                }
                 Indicator.close();
            })
            .catch(err => {
              Indicator.close();
            });
    },
    bindSchool() {
      if(this.memberuserid){
        if(!this.caneditbanke){
           this.$store.commit("SET_GO_SCHOOL", true);
        }
      }
     this.$store.commit("setRouterForward", true);
      this.$router.push({
       // name: "BindSchool",
          name:'BindSchoolList',  //! cjy: 这里直接跳转到schoollist即可
        params: {}
      });
    },
    goBack() {
      if(this.memberuserid){
        this.$emit("goback", false);
      }else{
          this.$router.go(-1);
      }
    }
  },
  components: {
    Empty
  }
};
</script>
<style scoped lang="less">
.my-xueqing-wrap {
  .main {
    .top {
      background: #fff;
      .user {
        position: relative;
        height: auto;
        padding: 20px 0 20px 80px;
        border-bottom: 1px solid rgb(85, 49, 49) 0f0;
        .avatarimgpart {
          width: 60px;
          height: 60px;
          float: left;
        }
        .accountpart {
          color: #c8c8cd;
          margin-top: 5px;
        }
      }
    }
          .lable {
    width: 100%;
        height: 60px;
        line-height: 30px;
        background:#fff;
            margin-top: 10px;
        > p {
          display: inline-block;
          width: 50%;
        }
        .tit-name,
        .tit-nub {
          color: #5d5d5d;
          display: block;
        }
        .act {
              border-bottom: 2px solid #0089ff;
          .tit-name,
          .tit-nub {
            color: #0089ff;
          }
        }
      }
    .info-list-wrap {
      position: relative;
      height: 66vh;
      min-height: 66vh;
      padding-bottom:50px;
      overflow-y: auto;
          background: #fff;
              .item{
          position: relative;
            padding: 15px 15px 15px 80px;
                border-top: 1px solid #f0f0f0;
           .avatarimgpart {
          width: 60px;
          height: 60px;
          float: left;
        }
        .accountpart {
          color: #c8c8cd;
          margin-top: 5px;
        }
      .item-info{
        .nub{
                  color:#FF8900;
        }

      }
      }
    }
  }
}
</style>