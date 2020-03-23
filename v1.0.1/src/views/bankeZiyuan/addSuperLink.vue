<template>
  <div class="addsuper-link-wrap">
    <mt-header title="添加精选网站">
      <mt-button slot="left" icon="back" @click="Back()">返回</mt-button>
    </mt-header>
    <div class="main">
      <div v-if="lists.length">
        <div class="link-item" v-for="(item,index) in lists" :key="index">
          <img
            class="img object-fit-img position-l;"
            :src="item.imgsrc"
            :onerror="$defaultImg('img')"
          />
          <div class="info-wrap position-r">
            <p class="name font18 ellipse">{{item.name}}</p>
            <p class="link-url colora font16 ellipse">{{item.link}}</p>
          </div>
          <div class="icon-wrap position-r tc" @click="selectLink(item,index)">
            <i class="iconfont iconok- position-c" :class="item.act?'act':''"></i>
          </div>
        </div>
      </div>
      <Empty v-else :text="['未找到数据']" />
    </div>
    <div class="foot-btn position-fb">
      <p class="tit">请选择添加目录</p>
      <div class="btn-wrap clearfix">
        <p class="fl mulu">
          <mt-button @click="seleFolder">第一章</mt-button>
        </p>
        <p class="fr keep">
          <mt-button @click="submit">确定</mt-button>
        </p>
      </div>
    </div>
    <mt-popup
      v-model="popupmulu"
      position="right"
      class="popup-right"
      :modal="false"
      style="background:#f0f0f0"
    >
      <Mulu :bankeid="bankeid" @Cancel="onCancel" />
    </mt-popup>
  </div>
</template>

<script>
const data2 = [
  {
    id: 1,
    name: "北大媒体资源服务平台",
    imgsrc: "",
    link: "www.baidu.com"
  },
  {
    id: 2,
    name: "北外在线学习平台",
    imgsrc: "",
    link: "www.baidu.com"
  },
  {
    id: 3,
    name: "北外在线学习平台",
    imgsrc: "",
    link: "www.baidu.com"
  },
  {
    id: 4,
    name: "北外在线学习平台",
    imgsrc: "",
    link: "www.baidu.com"
  }
];
import {
  Indicator,
  Toast,
  MessageBox,
  Cell,
  Popup,
} from "mint-ui";
import Empty from "@/common/empty";
import Mulu from "./mulu";
export default {
  props: {
    bankeid: {
      default: ""
    }
  },
  data() {
    return {
      lists: [],
      currentId: "",
      popupmulu: false
    };
  },
  computed: {},
  created() {
    this.queryBanshu();
  },
  mounted() {},
  watch: {},
  methods: {
    selectLink(item, index) {
      this.lists[index].act = !this.lists[index].act;
    },
    queryBanshu() {
      this.$http
        .post("/api/banshu/query", {
          bankeid: this.bankeid,
          page: 0,
          pagesize: 10
        })
        .then(res => {
          if (res.data.code == "0") {
            for (let v of data2) {
              v.act = false;
            }
            this.lists = data2;
          } else {
          }
        })
        .catch(err => {});
    },
    seleFolder() {
      this.popupmulu = true;
    },
    submit() {
      for(let v of this.lists){
  
      }
    },
    onCancel() {
      this.popupmulu = false;
    },
    Back() {
      this.$emit("watchBack", true);
    }
  },
  components: { Empty, Mulu }
};
</script>

<style scoped lang="less">
.addsuper-link-wrap {
  .main {
    height: 70vh;
    min-height: 70vh;
    overflow: auto;
    padding: 10px;
    // border: 1px solid #f00;
    .link-item {
      position: relative;
      height: 90px;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      margin-bottom: 10px;
      > img {
        width: 62px;
        height: 62px;
        border-radius: 6px;
      }
      .info-wrap {
        width: calc(100% - 95px);
        padding-right: 40px;
      }
      > .icon-wrap {
        width: 40px;
        height: 100%;
        .iconfont {
          color: transparent;
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          font-size: 26px;
          &.act {
            color: #ff8900;
            border: none;
          }
        }
      }
    }
  }
  .foot-btn {
    // bottom: 10;
    background: #f0f0f0;
    .tit {
      color: #5d5d5d;
      background: #f0f0f0;
      padding: 0 10px;
    }
    .btn-wrap {
      padding: 17px 0;
      background: #fff;
      > p {
        margin: 0 2.2%;
        .mint-button--normal {
          width: 100%;
          height: 57px;
        }
        &.mulu {
          width: 58%;
          .mint-button--normal {
            color: #000;
            border: 1px solid #0089ff;
            text-align: left;
          }
        }
        &.keep {
          width: 33%;
          .mint-button--normal {
            background: #0089ff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
