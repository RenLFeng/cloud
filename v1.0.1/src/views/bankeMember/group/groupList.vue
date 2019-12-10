<template>
  <div class="subgroup-list-wrap">
    <div class="list-item" v-for="(item,index) in groupLists" :key="index">
      <div class="tit">
        {{item.name}} ({{item.membersnum}}人)
        <p class="fr">
          <span class="colord" @click="changeName(index)">改名</span>
          <span class="dl" @click="dl(index)">删除</span>
        </p>
      </div>
      <div class="subgroup-list">
        <ul class="clearfix">
          <li class="fl tc" v-for="(v,i) in item.files" :key="i">
            <img :src="v.img" />
            <p>{{v.name}}</p>
            <i class="iconfont iconshanchu1 eicotrigger" @click="dle(index,i)"></i>
          </li>
        </ul>
        <span class="add" @click="addMembers(item)">+</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Popup } from "mint-ui";
export default {
  name: "",
  props: {
    //  分组items
    items: {
      default() {
        return {};
      }
    },
    allMemBers: {
      default() {
        return [];
      }
    }
  },
  watch: {
    items: {
      handler(n, o) {
        this.groupLists = [...n];
      },
      // immediate: true,
      deep: true
    }
  },
  data() {
    return {
      groupLists: [],
      changeState: false
    };
  },

  methods: {
    //改名
    changeName(index) {
      MessageBox.prompt("请输入姓名")
        .then(({ value, action }) => {
          this.groupLists[index].name = value;
          this.changeState = true;
          this.$emit("changeFn", {
            groupLists: this.groupLists,
            changeState: this.changeState
          });
        })
        .catch(() => {});
    },
    //删除小组
    dl(index) {
        this.$emit('delectFn',index)
    },
    //删除成员
    dle(index,i){
         this.$emit('delectMemberFn',{gindex:index,i:i})
    },
    //新增成员
    addMembers(item) {
      this.$emit("addMembersFn", item);
    }
  }
};
</script>

<style lang='less' scoped>
.subgroup-list-wrap {
  margin-bottom: 20px;
  .list-item {
    background: #fff;
    padding: 10px;
    margin-bottom: 15px;
  }
  .tit {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
    span {
      margin-left: 10px;
    }
    .dl {
      color: #f00;
    }
  }
  .subgroup-list {
    ul {
      li {
        position: relative;
        width: 25%;
        margin-bottom: 10px;
        img {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
        i {
          position: absolute;
          right: 11px;
          top: 0;
          color: #f00;
        }
      }
    }
    .add {
      display: block;
      width: 65px;
      height: 65px;
      text-align: center;
      border-radius: 50px;
      border: 2px solid #aaa;
      color: #aaa;
      font-size: 40px;
      font-weight: bold;
      margin-top: 15px;
      margin-left: 10px;
    }
  }
}
</style>
