<template>
  <div class="mulu-wrap">
    <mt-header title="第一章">
      <mt-button slot="left" @click="canlce()">取消</mt-button>
    </mt-header>
    <p class="Prev-btn">
      <i class="iconfont iconwithdraw-fill colord position-l"></i>
      <span style="color:#a5a5a5">返回上一层...</span>
    </p>
    <div class="main">
      <div v-if="lists.length">
        <div
          class="folder-wrap-item"
          @click="opneFolder(item)"
          v-for="(item,index) in lists"
          :key="index"
        >
          <img
            class="img object-fit-img position-l;"
            :src="item.imgsrc"
            :onerror="$defaultImg('folder')"
          />
          <div class="info-wrap position-r">
            <p class="name ellipse position-t">{{item.name}}</p>
            <p class="time font-xxs colora5 position-b">
              {{item.createtime}}&nbsp;更新
              <span class="fr">文件夹</span>
            </p>
          </div>
        </div>
      </div>
      <Empty v-else :text="['未创建文件夹']" />
    </div>
    <div class="foot-btn position-fb clearfix">
      <p class="fl new">
        <mt-button @click="newFolder">新建文件夹</mt-button>
      </p>
      <p class="fr keep">
        <mt-button @click="submit">确定</mt-button>
      </p>
    </div>
  </div>
</template>

<script>
// prettier setting.json  Prevent
import {
  Indicator,
  Toast,
  MessageBox,
} from "mint-ui";
import Empty from "@/common/empty";
export default {
  props: {
    bankeid: {
      default: 0
    },
    muluId: {
      default: 0
    }
  },
  data() {
    return {
      lists: [
        {
          id: 1,
          name: "第一节",
          imgsrc: "",
          createtime: "2018"
        },
        {
          id: 1,
          name: "第一节",
          imgsrc: "",
          createtime: "2018"
        }
      ],
      newFile:''
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    opneFolder(item) {},
    newFolder() {
      MessageBox.prompt("请输入文件名").then(({ value, action }) => {
        this.newFile=value;
        alert(this.newFile)
      });
    },
    submit() {},
    canlce() {
      this.$emit("Cancel", true);
    }
  },
  components: {
    Empty
  }
};
</script>

<style scoped lang="less">
.mulu-wrap {
  .Prev-btn {
    position: fixed;
    height: 63px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    line-height: 63px;
    padding-left: 50px;
    z-index: 100;
    top: 49px;
    width: 100%;
    .iconfont {
      font-size: 30px;
    }
  }
  .main {
    margin-top: 60px;
    height: 70vh;
    min-height: 70vh;
    overflow: auto;
    .folder-wrap-item {
      position: relative;
      height: 82px;
      padding: 10px;
      background: #fff;
      border-bottom: 0.02667rem solid #eaeaea;
      > img {
        height: 100%;
      }
      .info-wrap {
        width: calc(100% - 90px);
        height: 100%;
        > p {
          width: 100%;
        }
        .name {
        }
        .time {
        }
      }
    }
  }
  .foot-btn {
    // bottom: 10;
    background: #f0f0f0;
    > p {
      width: 40%;
      margin: 0 5%;
      .mint-button--normal {
        width: 100%;
        background: none;
        height: 57px;
      }
      &.new {
        .mint-button--normal {
          color: #0089ff;
          border: 1px solid #0089ff;
        }
      }
      &.keep {
        .mint-button--normal {
          background: #0089ff;
          color: #fff;
        }
      }
    }
  }
}
</style>
