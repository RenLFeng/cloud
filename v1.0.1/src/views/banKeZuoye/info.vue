<template>
  <div class="zy-info-wrap">
    <div class="text-info">
      <div class="padding-right">
        <mt-cell :title="$t('bankeTask.Create_time')" :value="itemInfo.starttime"></mt-cell>
      </div>
      <div class="no-border padding-right">
        <mt-cell :title="$t('bankeTask.Last_start_time')" :value="itemInfo.starttime"></mt-cell>
      </div>
    </div>
    <p class="submit-info tc border-bottom border-top fontsmall">
      <span
        class="border-right"
        @click="subMit(0)"
        :class="isTrue?'':'colord'"
      >{{$t('bankeTask.Not_yet')}}（{{noSubMit.length}}{{$t('common.Person')}}）</span>
      <span
        @click="subMit(1)"
        :class="isTrue?'colord':''"
      >{{$t('bankeTask.Submitted')}}（{{isSubMit.length}}{{$t('common.Person')}}）</span>
    </p>

    <ul v-if="isTrue" class="list-wrap">
      <li v-for="(item,index) in isSubMit" :key="index">
        <!-- <mt-cell :title="item.username" :label="item.ztext" :value="item.submittime"></mt-cell> -->
        <div class="item">
          <p class="tit">
            <span class="fontnormal name ellipse">{{item.username}}</span>
            <span class="font14 color9 tr position-r">{{item.submittime}}</span>
          </p>
          <p class="ztext font16 word-wrap">{{item.ztext}}</p>
        </div>
      </li>
    </ul>
    <ul v-if="!isTrue" class="list-wrap">
      <li v-for="(item,index) in noSubMit" :key="index">
        <div class="item">
          <p class="tit">
            <span class="fontnormal name ellipse">{{item.username}}</span>
            <span class="font14 color9 tr position-r">未提交作业</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    itemInfo: {
      default() {
        return {};
      }
    },
    allZuoyeitem: {
      default() {
        return [];
      }
    }
  },
  watch: {
    allZuoyeitem: function(newValue, oldValue) {
      this.allInfo = newValue;
      // console.log("vcvcvcv", this.allInfo);
      for (let item of this.allInfo) {
        if (item.submitid) {
          this.isSubMit.push(item);
        } else {
          this.noSubMit.push(item);
        }
      }
      // console.log("isSubMit", this.isSubMit);
      // console.log("noSubMit", this.noSubMit);
    }
  },
  data() {
    return {
      allInfo: [],
      loading: true,
      isTrue: false,
      isSubMit: [],
      noSubMit: []
    };
  },
  created() {},
  created() {},
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
.zy-info-wrap {
  .mint-cell .mint-cell-wrapper {
    padding-right: 10px;
  }
  .hh {
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
    // border-bottom: 1px solid #ccc;
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
  .list-wrap {
    height: 67vh;
    min-height: 67vh;
    overflow: scroll;
    > li {
      background: #fff;
      padding: 10px;
      margin-bottom: 10px;
    }
    .item {
      .tit {
        position: relative;
        margin-bottom: 6px;
        .name {
          display: inline-block;
          width: 70%;
        }
        .tr {
          display: inline-block;
          width: 30%;
        }
        .time {
        }
      }
      .ztext {
        color: #666;
      }
    }
  }
}
</style>
