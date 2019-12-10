<template>
  <div class="baout-main">
    <div class="avatarpart" @click="onmine">
      <img :src="user.avatar" :onerror="defaultImage" class="avatarimgpart avatar" />
      <div class="avatartextpart">
        <div class="fontlarge namepart">{{user.name}}</div>
        <div class="fontsmall accountpart">
          {{$t('personal.Account')}}:{{user.account}}
          <i class="my-cell-allow-right"></i>
        </div>
      </div>
    </div>
    <div v-if="isTeacher">
      <div class="devide"></div>
      <mt-cell title="创建班课" is-link @click.native="onadd"></mt-cell>
    </div>

    <div class="devide"></div>
    <mt-cell v-if="hasloginpage" :title="$t('common.Logout')" is-link @click.native="onlogout"></mt-cell>
    <mt-cell v-if="canbindaccount" title="绑定账户" is-link @click.native="onbindaccount">
    </mt-cell>




    <div class="devide"></div>
    <mt-cell :title="$t('personal.Set_up')" is-link @click.native="onset"></mt-cell>
    <div class="devide"></div>
    <mt-cell :title="$t('personal.About')" is-link @click.native="onabout"></mt-cell>
    <div class="devide"></div>
    <mt-cell
      v-for="(item,index) in $t('langs')"
      :key="index"
      :title="item.name"
      @click.native="selectLang(item)"
    ></mt-cell>


    <mt-popup v-model="popupBind" position="right" class="mint-popup-3" :modal="false">
      <mt-header title="绑定账户">
        <mt-button slot="left" icon="back" @click="popupBind = false">返回</mt-button>
      </mt-header>

      <div class="binddiv">
        <div v-show="!shownewaccount">当前绑定账户：{{bindaccount}}</div>
        <div>
          <mt-button v-show="!shownewaccount" @click="uibindaction('changebind')">更改绑定</mt-button>
          <mt-button v-show="!shownewaccount" @click="uibindaction('changepassword')">修改密码</mt-button>
          <mt-button v-show="shownewaccount" @click.native="uibindactionchangebind">新增账户绑定</mt-button>
          <mt-button v-show="shownewaccount" @click="uibindaction('newaccount')">生成登陆账户</mt-button>
        </div>
        <div v-show="showbindpanel">
          <div>{{bindtitle}}</div>
          <div v-show="bindaction != 'changepassword'">账户：<input  v-model="inputaccount"></input></div>
          <div>密码：<input v-model="inputpassword" type="password"></input></div>
          <div><mt-button @click="uibindsubmit">提交</mt-button></div>
          <div>{{bindstatedesc}}</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>

import { Indicator, Toast, MessageBox, Button } from "mint-ui";

import nativecode from '../nativecode'

export default {
  name: "MineAbout",
  data() {
    return {
        popupBind:false,
        bindaccount:'',
        showbindpanel:false,
        inputaccount:'',
        inputpassword:'',
        bindaction:'',
        bindstatedesc:'',
        bindtitle:''
    };
  },
  components: {
  },
  computed: {
      hasloginpage(){
          return nativecode.hasloginpage();
      }
      ,shownewaccount(){
          if (this.bindaccount.length > 0){
              return false;
          }
          return true;
      }
      ,canbindaccount(){
          return nativecode.canbindaccount();
      },
    isTeacher() {
      return this.$store.getters.isteacher;
    },
    user() {
      return this.$store.getters.curuser;
    },
    defaultImage() {
      var srcstr = 'this.src="';
      srcstr += require("../assets/avatar-default.png");
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {

    onadd() {
      var isteacher = this.$store.getters.isteacher;
      if (isteacher) {
        //! 跳转新增课堂
        this.$store.commit("setRouterForward", true);
        this.$router.push("/bankenew");
      } else {
        //! 跳转搜索课堂
        Toast("加入课堂， 暂未实现");
      }
      // this.$emit("changeSelected", "banke");
    },
    selectLang(item) {
      this.$i18n.locale = item.langType;
      localStorage.setItem("lang", item.langType);
      this.$store.commit("SET_LANG", item.langType);
    },
    onlogout: function() {
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t("confirm.Exit_current_account"),
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      }).then(() => {
        this.dologout();
      });
    },
    uibindsubmit:function(){
        var url = '/api/weixin/changebind';
        this.bindstatedesc = '处理中...';
        this.$http.post(url, {
            action:this.bindaction,
            account:this.inputaccount,
            password:this.inputpassword
        }).then((res)=>{
            this.bindstatedesc = '完成';
            if (res.data.code == 0){
                if (res.data.data && res.data.data.id){
                    //! id发生了改变
                    this.bindaccount = res.data.data.account;
                    this.$store.commit("setLoginUser", res.data.data);
                }
                else if (res.data.data && res.data.data.length > 0){
                    //! 新账户
                    this.bindaccount = res.data.data;
                }
            }
            else{
                this.bindstatedesc = res.data.msg;
            }
        }).catch(()=>{
            this.bindstatedesc = '异常';
        })
    }
    ,uibindactionchangebind:function(){
        this.uibindaction('changebind');
    }
    ,uibindaction:function(sza){
        console.log('uibindaction');
        this.bindaction = sza;
        this.bindtitle = '';
        this.bindstatedesc = '';
        this.inputaccount = '';
        this.inputpassword = '';
        if (this.shownewaccount){
            if (sza == 'newaccount'){
                this.bindtitle = '生成登陆账户';
            }
            else if (sza == 'changebind'){
                this.bindtitle = "新增账户绑定";
            }
        }
        else {
            if (sza == 'changepassword'){
                this.bindtitle = '修改密码';
            }
            else{
                this.bindtitle = '更改绑定';
            }
        }
        this.showbindpanel = true;
    }

    ,onbindaccount:function(){
        Indicator.open('加载中...');
        // this.popupBind = true;
        var url = "/api/weixin/querybind";
        this.$http.post(url).then((res)=>{
            Indicator.close();
            if (res.data.code == 0){
                if (res.data.data){
                    this.bindaccount = res.data.data;
                }
                else{
                    this.bindaccount = "";
                }
                this.popupBind = true;
            }

        }).catch(()=>{
            Indicator.close();
        })
    },
    dologout: function() {
      var url = "/api/api/logout";
      this.$http.post(url).then(() => {
        //! 清空本地账户信息
        this.$store.commit("setLoginUser", {});
        this.$store.commit("setRouterForward", true);
        this.$store.commit("banke/REMOV_BANKES", []);
        this.$router.push("/login");
      });
    },
    onset: function() {
      // Toast("暂未实现");
    },
    onabout: function() {
      // Toast("暂未实现");
    },
    onmine: function() {
      this.$store.commit("setRouterForward", true);
      this.$router.push("/mineinfo");
    },
    goBack() {

    }
  }
};
</script>

<style scoped>
.baout-main {
  padding-bottom: 50px;
}
.my-cell-allow-right::after {
  border: solid 2px #c8c8cd;
  border-bottom-width: 0;
  border-left-width: 0;
  content: " ";
  top: auto;
  right: 20px;
  position: absolute;
  width: 5px;
  height: 5px;

  margin-top: 3px;

  transform: translateY(50%) rotate(45deg);
}

.avatarimgpart {
  width: 60px;
  height: 60px;
  float: left;
}

.accountpart {
  color: #c8c8cd;
  margin-top: 5px;
}
.namepart {
  margin-top: 10px;
}

.avatartextpart {
  margin-left: 70px;
}

.avatarpart {
  height: 80px;
  padding: 10px;
  background: #fff;
}
</style>
<style>
.mint-cell-wrapper {
  background-image: none !important;
}
</style>