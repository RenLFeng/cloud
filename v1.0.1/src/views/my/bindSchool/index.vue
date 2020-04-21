<template>
  <div class="bind-school-wrap">
    <mt-header title="学校绑定" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="back">返回</mt-button>
    </mt-header>
    <div class="main">
      <mt-cell title="选择学校" is-link @click.native="bindSchool" class="border-b">{{schoolname}}</mt-cell>
      <mt-field label="工号/学号" placeholder="请输入工号或学号" v-model="sno" class="border-b"></mt-field>
      <mt-field label="校验码" placeholder="请输入校验码，没有则不填" v-model="schoolpwd"></mt-field>
      <div class="button-worp">
        <mt-button class="button-auto-96" @click="onbindSchool">绑定</mt-button>
      </div>
    </div>

    <mt-popup v-model="popupSearch" class="search-popup" pop-transition="popup-fade" :modal="false">
      <div class="search-wrap">
        <div class="seach-wrap">
          <div class="div_sech">
            <form action="/">
              <van-search
                id="search"
                placeholder="输入学校名"
                :autofocus="true"
                :show-action="true"
                v-model="value"
                @search="onSearch"
                @cancel="onCancel"
                @input="onInput"
                @focus="onFocus"
              />
            </form>
          </div>
        </div>
        <div class="list-wrap" :class="searchData.length?'act':''">
          <div class v-if="searchData.length">
            <mt-cell
              :title="v.name"
              v-for="(v,i) in searchData"
              :key="i"
              class="border-b"
              @click.native="selectSchool(v)"
            ></mt-cell>
          </div>
          <Empty v-else :text="['暂无内容']" />
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button, Field } from "mint-ui";
import Search from "vant/lib/search";
import "vant/lib/search/style";
import Empty from "@/common/empty";
export default {
  name: "BindSchool",
  props: {},
  data() {
    return {
      ShowType: false,
      schoolInfo: {},
      sno: "",
      schoolpwd: "",
      popupSearch: false,
      value: "",
      lastsearchkey: null, //! cjy： 最后的搜索key
      searchtimerid: null, //! 搜索的定时器
      autofocus: true,
      searchData: [],
      isQuery: false
    };
  },
  computed: {
    schoolname() {
      if (this.updateinfoBindSinfo.name) {
        return this.updateinfoBindSinfo.name;
      } else {
        return this.schoolInfo.name;
      }
    },
    bindschool() {
      return this.$store.state.bindschool;
    },
    Settedinfo() {
      return this.$store.state.Settedinfo;
    },
    updateinfoBindSinfo() {
      return this.$store.state.schoolname;
    }
  },
  created() {
    if (!this.bindschool) {
      this.querybind();
    }
  },
  mounted() {},
  watch: {},
  destroyed: function() {
    if (this.searchtimerid) {
      clearTimeout(this.searchtimerid);
      this.searchtimerid = null;
    }
  },
  methods: {
    onbindSchool() {
      if (!this.schoolInfo.id) {
        Toast("请选择学校");
        return;
      }
      if (!this.sno) {
        Toast("请输入工号或学号");
        return;
      }
      // if (!this.schoolpwd) {
      //   Toast("请输入校验码");
      //   return;
      // }
      Indicator.open("全速绑定中...");
      this.$http
        .post("/api/school/bind", {
          schoolid: this.schoolInfo.id,
          sno: this.sno,
          schoolpwd: this.schoolpwd
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.user) {
              this.$store.commit("setLoginUser", res.data.data.user);
            }
            Toast("绑定成功");
            this.$store.commit("setRouterForward", true);
            if (this.Settedinfo) {
              this.$store.commit("SET_SCHOOL_NAME", this.schoolInfo);
              this.$store.commit("SET_TEDINFO", false);
              this.$router.go(-1);
            } else {
              this.$router.replace({
                name: "BindSchoolList",
                params: {}
              });
            }
          } else {
            let tipmsg = "绑定失败：" + res.data.msg;
            if (res.data.msg == "has bind in school") {
              tipmsg = "已绑定到该学校";
            } else if (res.data.msg == "invalid password") {
              tipmsg = "校验码不匹配";
            }
            Toast(tipmsg);
          }
          Indicator.close();
        })
        .catch(err => {
          Toast("出错啦");
          Indicator.close();
        });
    },
    bindSchool() {
      //this.searchData = [];  //！ cjy： 这里的搜索记录不清空； 与lastsearchkey对应
      this.popupSearch = true;
    },
    //搜索btn or end
    onSearch() {
      // this.onInput("");
      this.queryschool(this.value);
    },
    //取消
    onCancel() {
      this.popupSearch = false;
    },
    //输入框内容变化
    onInput(value) {
      // if (!value) {
      //   value = this.value;
      //   if (value == "") {
      //     return;
      //   }
      // }
      // if(this.isQuery) return;
      this.queryschool(this.value);
    },
    onFocus() {
      this.popupSearch = true;
      this.queryschool(this.value);
    },
    queryschool(skey) {
      // Indicator.open("搜索中...");

      if (!skey) {
        //! 1-15 允许搜索空字符串 ---》 保护学校关系， 这里不搜索空key？ 但是用户只要已输入‘学’字， 大部分学校均会显示出来
        //! cjy： 不搜索空字符串
        return;
      }

      console.log("queryschool:" + skey);

      //! 清除当前的搜索定时器
      if (this.searchtimerid) {
        clearTimeout(this.searchtimerid);
        this.searchtimerid = null;
      }
      if (this.isQuery) {
        //! 当前搜索中；启用定时延迟搜索
        let searchfun = () => {
          this.queryschool(skey);
        };
        this.searchtimerid = setTimeout(searchfun, 100);
        return;
      }
      if (this.lastsearchkey === skey) {
        //! key相同，无需再搜索
        return;
      }
      this.isQuery = true;
      this.$http
        .post("/api/school/queryschool", {
          page: 0,
          pagesize: 50,
          name: skey
        })
        .then(res => {
          //  console.log("queryschool", res);
          if (
            res.data.code == "0"
            //   && res.data.data.length
          ) {
            //   this.searchData = res.data.data;
            this.lastsearchkey = skey;
            this.searchData = res.data.data;
          }
          this.isQuery = false;
          //  Indicator.close();
        })
        .catch(err => {
          this.isQuery = false;
          //  Indicator.close();
        });
    },
    //选择学校
    selectSchool(v) {
      this.schoolInfo = v;
      // this.value = "";  //! cjy： 搜索关键字不清空
      this.popupSearch = false;
    },
    //查询是否有绑定
    querybind() {
      this.$http
        .post("/api/school/querybind", {})
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.bind.length) {
              this.$store.commit("setRouterForward", true);
              this.$router.push({
                name: "BindSchoolList",
                params: {}
              });
            }
          }
        })
        .catch(err => {});
    },
    back() {
      this.$store.commit("SET_BIND_SCHOLL", false);
      this.$router.go(-1);
    }
  },
  components: {
    [Search.name]: Search,
    Empty
  }
};
</script>

<style scoped lang="less">
.bind-school-wrap {
  .main {
    width: 100%;
    height: 93vh;
    min-height: 93vh;
    overflow-y: scroll;
    margin-top: 60px;
    .button-worp {
      margin: 60px auto;
      .button-auto-96 {
        background: #0089ff;
        color: #fff;
      }
    }
  }
  .list-wrap {
    width: 100%;
    height: 93vh;
    min-height: 93vh;
    background: #f0f0f0;
    overflow-y: scroll;
    &.act {
      background: #fff;
    }
  }
}
</style>
