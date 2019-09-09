<template>
  <div>
    <div class="text-info">
      <div>
        <mt-cell title="创建时间" :value="itemInfo.starttime"></mt-cell>
      </div>
      <div class="no-border">
        <mt-cell title="最后一次开始时间" :value="itemInfo.starttime"></mt-cell>
      </div>
    </div>
    <p class="submit-info text-center border-bottom border-top">
      <span class="border-right" @click="subMit(0)" :class="isTrue?'':'my-color'">未提交（0人）</span>
      <span @click="subMit(1)" :class="isTrue?'my-color':''">已提交（0人）</span>
    </p>
    <ul v-if="lists.length" class="lists-container">
      <li v-for="(item,index) in lists" :key="index">
        <mt-cell :title="item.title" :label="item.label" :value="item.time+'  首次提交'"></mt-cell>
      </li>
    </ul>
  </div>
</template>
<script>
import { Cell,InfiniteScroll  } from "mint-ui";
export default {
  name: "",
  props: {
    itemInfo: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
       loading:true,
      isTrue: false,
      lists: [
        { title: "标题", label: "描述信息", time: "2019-03-02  12:20" },
        { title: "标题", label: "描述信息", time: "2019-03-02  12:20" },
        { title: "标题", label: "描述信息", time: "2019-03-02  12:20" }
      ]
    };
  },

  methods: {
    subMit(val) {
      this.isTrue = val;
      if (this.isTrue) {
      } else {
      }
    }
  }
};
</script>

<style lang='less'>
.hh{
  height: 300px;
  width: 100%;
  overflow: scroll;
  text-align: center;
}
.text-info {
  .no-border {
    .mint-cell-wrapper {
      background-image: none;
    }
  }
}
.submit-info {
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
  background: #fff;
  span {
    display: inline-block;
    width: 50%;
    height: 50px;
    line-height: 50px;
  }
  .border-right {
    border-right: 1px solid #ccc;
  }
}
.lists-container {
  li {
    .mint-cell:last-child {
      background-image: none;
    }
  }
  li:first-child {
    .mint-cell-wrapper {
      background-image: none;
    }
  }
  li:last-child {
    .mint-cell:last-child {
      background-image: linear-gradient(
        180deg,
        #d9d9d9,
        #d9d9d9 50%,
        transparent 50%
      );
    }
  }
}
</style>
