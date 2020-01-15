<template>
  <div class="members-list-wrap">
    <mt-header title="添加分组成员" class="mint-header-f">
      <mt-button icon="back" slot="left" @click="goback">{{backText}}</mt-button>
    </mt-header>
    <div class="main main-f">
      <p class="tit tc" @click="seeMemberType">{{MemBerTypeText}}</p>
      <div class="lists-main">
        <ul>
          <li class="member-item" v-for="(v,index) in tempMemBersList" :key="index"     @click="selectMember(index)">
            <i
              class="iconfont iconok- eicotrigger"
              :class="{'ed':v.isTrue,'act':v.isAct}"
            ></i>
            <img class :src="v.avatar" alt :onerror="$defaultImg('account')"/>
            <p class="group" :class="{'istrue':v.groupName}">
              <span>{{v.name}}</span>
              <!-- <span>{{v.account}}</span> -->
              <span v-if="v.groupName" class="color9 font-xs">已分配到&nbsp;{{v.groupName}}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" @click="addMember">完成</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from "mint-ui";
export default {
  name: "",
  props: {
    allMemBers: {
      default() {
        return [];
      }
    },
    tempData: {
      default() {
        return [];
      }
    },
    addMembersItem: {
      default() {
        return [];
      }
    }
  },
  watch: {
    allMemBers: {
      handler(n, o) {
        this.TallMemBers = [...n];
      },
      deep: true
    },
    tempData: function(newValue, oldValue) {
      this.TtempData = newValue;
      this.MemBerType = false;
    },
    addMembersItem: function(newValue, oldValue) {
      this.TallMemBers = this.allMemBers;
      this.MemBerType = false;
      // console.log("this.TtempData", this.TtempData);
      console.log("this.TallMemBers", this.TallMemBers);
      this.tempMemBersList = this.TallMemBers.filter(v => {
        return !v.isTrue;
      });
      this.TaddMembersItem = newValue;
      this.memerLenth = this.TaddMembersItem.membersnum;
      this.count = this.TaddMembersItem.membersnum;
    }
  },
  data() {
    return {
      options: [],
      MemBerType: false,

      TallMemBers: [], //所有成员
      TtempData: [], //所有小组
      TaddMembersItem: {}, //当前小组

      tempMemBersList: [], //成员列表暂存区
      memerLenth: 0,
      count: 0
    };
  },
  created() {},
  computed: {
    backText() {
      if (this.count <= this.memerLenth) {
        return "返回";
      } else {
        return "取消";
      }
    },
    MemBerTypeText() {
      if (!this.MemBerType) {
        return "切换为显示全部";
      } else {
        return "切换为只显示未分配小组的人";
      }
    }
  },
  methods: {
    seeMemberType() {
      this.MemBerType = !this.MemBerType;
      if (this.MemBerType) {
        this.tempMemBersList = this.TallMemBers;
      } else {
        this.tempMemBersList = this.tempMemBersList.filter(v => {
          return !v.isTrue;
        });
      }
    },
    selectMember(index) {
      if (this.tempMemBersList[index].isTrue) {
        Toast("当前学生已分配");
        return;
      }
      this.tempMemBersList[index].isAct = !this.tempMemBersList[index].isAct;
      if (this.tempMemBersList[index].isAct) {
        this.TaddMembersItem.files.push({
          id: this.tempMemBersList[index].memberuserid,
          img: this.tempMemBersList[index].avatar,
          // name: this.tempMemBersList[index].account
          name: this.tempMemBersList[index].name
        });
        this.TaddMembersItem.members.push(
          this.tempMemBersList[index].memberuserid
        );
        this.TaddMembersItem.membersnum++;
        this.count++;
      } else {
        this.TaddMembersItem.files = this.TaddMembersItem.files.filter(v => {
          return v.id != this.tempMemBersList[index].memberuserid;
        });
        this.TaddMembersItem.members = this.TaddMembersItem.members.filter(
          v => {
            return v != this.tempMemBersList[index].memberuserid;
          }
        );
        this.TaddMembersItem.membersnum--;
        this.count--;
      }

      //刷新ui
      if (this.MemBerType) {
        this.tempMemBersList = this.tempMemBersList.filter(v => {
          return v.memberuserid != 0;
        });
      } else {
        this.tempMemBersList = this.tempMemBersList.filter(v => {
          return !v.isTrue;
        });
      }
      console.log(this.TaddMembersItem);
      console.log(this.tempMemBersList);
    },

    addMember() {
      if (this.count <= this.memerLenth) {
        MessageBox.confirm("你未新添成员，是否返回")
          .then(action => {
            this.init();
            this.$emit("hideMemberpageFn", {
              popup: false,
              oldLength: this.memerLenth
            });
          })
          .catch(() => {});
      } else {
        this.$emit("addMemberFn", this.TtempData);
        this.init();
      }
    },
    goback() {
      if (this.count <= this.memerLenth) {
        this.init();
        this.$emit("hideMemberpageFn", {
          popup: false,
          oldLength: this.memerLenth
        });
      } else {
        MessageBox.confirm("你已修改信息，是否取消")
          .then(action => {
            this.$emit("hideMemberpageFn", {
              state: true,
              popup: false,
              oldLength: this.memerLenth
            });
            this.init();
          })
          .catch(() => {});
      }
    },
    init() {
      this.MemBerType = false;
      this.memerLenth = 0;
      this.count = 0;
      for (let v of this.tempMemBersList) {
        v.isAct = false;
      }
      if (this.MemBerType) {
        this.tempMemBersList = this.tempMemBersList.filter(v => {
          return v.memberuserid != 0;
        });
      } else {
        this.tempMemBersList = this.tempMemBersList.filter(v => {
          return !v.isTrue;
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.members-list-wrap {
  .main {
    .arr {
      li {
        &.act {
          background: #999;
        }
      }
    }
    background: #fff;
    .tit {
      padding: 20px;
      background: #f0f0f0;
    }
    .member-item {
      position: relative;
      height: 70px;
      padding: 10px;
      margin-bottom: 10px;
      padding-left: 130px;
      border-bottom: 1px solid #f0f0f0;
      i {
        position: absolute;
        width: 26px;
        height: 26px;
        border: 1px solid #999;
        border-radius: 50%;
        left: 10px;
        top: 50%;
        transform: translate(0, -50%);
        font-size: 25px;
        color: transparent;
        &.act {
          color: #ff8900;
          border: none;
        }
        &.ed {
          color: #999;
          border: none;
        }
      }
      img {
        position: absolute;
        left: 35px;
        top: 50%;
        transform: translate(0, -50%);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 15px;
        object-fit: cover;
      }
      .group {
        width: 100%;
        position: absolute;
        left: 130px;
        top: 50%;
        transform: translate(0px, -50%);
        &.istrue {
        }
        span {
          display: block;
        }
      }
    }
  }
  .button-worp {
    // position: absolute;
    // bottom: 0;
    // width: 100%;
    button {
      height: 50px;
      line-height: 50px;
      background: none;
      border: 1px solid #0089ff;
      border-radius: 30px;
      color: #0089ff;
    }
  }
}
</style>
