<template>
  <div class="bind-school-wrap">
    <mt-header title="学校绑定" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="back">返回</mt-button>
    </mt-header>
    <div class="main">
      <mt-cell title="选择学校" is-link @click.native="bindSchool" class="border-b">{{schoolInfo.name}}</mt-cell>
      <mt-field label="工号/学号" placeholder="请输入工号或学号" v-model="sno" class="border-b"></mt-field>
      <mt-field label="校验码" placeholder="请输入校验码" v-model="schoolpwd"></mt-field>
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
                placeholder="搜索"
                :autofocus="true"
                :show-action="true"
                :disabled="isQuery"
                v-model="value"
                @search="onSearch"
                @cancel="onCancel"
                @input="onInput"
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
      autofocus: true,
      searchData: [],
      isQuery: false
    };
  },
  computed: {
    bindschool() {
      return this.$store.state.bindschool;
    }
  },
  created() {
    if (!this.bindschool) {
      this.querybind();
    }
  },
  mounted() {},
  watch: {},
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
      if (!this.schoolpwd) {
        Toast("请输入校验码");
        return;
      }
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
            this.$router.push({
              name: "BindSchoolList",
              params: {}
            });
          } else {
            Toast("绑定失败");
          }
          Indicator.close();
        })
        .catch(err => {
          Toast("出错啦");
          Indicator.close();
        });
    },
    bindSchool() {
      this.searchData = [];
      this.popupSearch = true;
    },
    //搜索btn or end
    onSearch() {
      this.onInput("");
    },
    //取消
    onCancel() {
      this.popupSearch = false;
    },
    //输入框内容变化
    onInput(value) {
      if (!value) {
        value = this.value;
        if (value == "") {
          return;
        }
      }
      // if(this.isQuery) return;
      this.queryschool();
    },
    queryschool() {
      Indicator.open("搜索中...");
      this.isQuery = true;
      this.$http
        .post("/api/school/queryschool", {
          page: 0,
          pagesize: 50,
          name: this.value
        })
        .then(res => {
          console.log("queryschool", res);
          if (res.data.code == "0" && res.data.data.length) {
            this.searchData = res.data.data;
          }
          this.isQuery = false;
          Indicator.close();
        })
        .catch(err => {
          this.isQuery = false;
          Indicator.close();
        });
    },
    //选择学校
    selectSchool(v) {
      this.schoolInfo = v;
      this.value = "";
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
