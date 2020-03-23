<template>
  <div class="bindend-list-wrap">
    <mt-header title="已绑定的学校" class="mint-header-f">
      <mt-button slot="left" icon="back" @click="goback">返回</mt-button>
    </mt-header>
    <div class="main main-f">
      <p class="title fontsmall" v-if="BindSchoolListData.length">已绑定的学校</p>
      <div class="list-wrap" v-if="BindSchoolListData.length">
        <div
          class="item border-b"
          v-for="(item,i) in BindSchoolListData"
          :key="i"
          @click="showSchollInfo(item)"
        >
          <img class="pic" :src="item.avatar" :onerror="$defaultImg('school')" />
          <div class="text-info-wrap">
            <p class="fontsmall">{{item.name}}</p>
            <p>
              {{snodesc(item)}}：
              <span>{{item.sno}}</span>
            </p>
          </div>
          <i class="iconfont iconjiantou position-r color9 fontlarge"></i>
        </div>
      </div>
      <Empty v-else :text="['暂无内容']" />
    </div>
    <div class="button-worp position-fb" v-if="!detail_go_school">
      <mt-button class="button-auto-96" @click="onbindNewSchool">绑定新学校</mt-button>
    </div>
    <mt-popup
      v-model="popupBindSchoolInfo"
      position="right"
      class="mint-popup-3"
      :modal="false"
      style="background:#f0f0f0"
    >
      <BindSchoolInfo :info="showSchoolInfo" @back="onBack" :caneditbanke="detail_go_school"/>
    </mt-popup>
  </div>
</template>

<script>
import BindSchoolInfo from "./bindSchool-info";
import { Indicator, Toast, MessageBox, Cell } from "mint-ui";
import Empty from "@/common/empty";
import {parseURL } from "@/util";
export default {
  name: "BindSchoolList",
  props: {},
  data() {
    return {
      popupBindSchoolInfo: false,
      BindSchoolListData: [],
      showSchoolInfo: {},
    };
  },
  computed: {
       caneditbanke() {
      let caneditbanke = this.$store.getters.caneditbanke;
      return caneditbanke;
    },
    detail_go_school() {
          return this.$store.state.detail_go_school;
        }
  },
  created() {
    this.querybind();
  },
  mounted() {},
  watch: {
    popupBindSchoolInfo: function(newValue, oldValue) {}
  },
  methods: {
      snodesc(item){
          if (item.schoolrole == 10){
              return '工号'
          }
          return '学号'
      },
    querybind() {
      Indicator.open("加载中...");
      this.$http
        .post("/api/school/querybind", {})
        .then(res => {
          console.log("querybind", res);
          if (res.data.code == "0") {
            if (res.data.data.bind.length) {
              for (let v of res.data.data.bind) {
                for (let item of res.data.data.school) {
                  if (v.schoolid == item.id) {
                    v.avatar = item.avatar;
                    v.name = item.name;
                  }
                }
              }
            } else {
            }
            this.BindSchoolListData = res.data.data.bind;
          } else {
          }
          Indicator.close();
        })
        .catch(err => {
          Indicator.close();
        });
    },
    onbindNewSchool() {
      this.$store.commit("SET_BIND_SCHOLL", true);
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "BindSchool",
        params: { ShowType: true}
      });
    },
    showSchollInfo(v) {
      this.showSchoolInfo = v;
      this.popupBindSchoolInfo = true;
    },
    onBack(v) {
      this.popupBindSchoolInfo = false;
      if (v) {
        this.querybind();
      }
    },
    goback() {
      this.$store.commit("SET_BIND_SCHOLL", true);
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
      this.$router.go(-1);
        //! cjy: 这里直接返回到 home； 否则一定场景比较怪异：   bindschool->back->
    }
  },
  components: {
    BindSchoolInfo,
    Empty
  }
};
</script>

<style scoped lang="less">
.bindend-list-wrap {
  background: #fff;
  .main {
    .title {
      padding: 10px;
    }
    .list-wrap {
      width: 100%;
      height: 75vh;
      min-height: 75vh;
      overflow-y: scroll;
      .item {
        position: relative;
        padding: 15px 10px 15px 80px;
        .pic {
          width: 60px;
          height: 60px;
          object-fit: cover;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translate(0, -50%);
          border-radius: 30px;
        }
      }
    }
  }
  .button-worp {
    .button-auto-96 {
      width: 96%;
    }
  }
}
</style>
