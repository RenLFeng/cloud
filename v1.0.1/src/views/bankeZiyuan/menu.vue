<template>
  <div class="mulu-wrap">
    <mt-header :title="myMenuname?myMenuname:headerName">
      <mt-button slot="left" @click="canlce()">取消</mt-button>
    </mt-header>
    <p class="Prev-btn" v-if="tempmenuData.length" @click="onprev">
      <i class="iconfont iconwithdraw-fill colord position-l"></i>
      <span style="color:#a5a5a5">返回上一层...</span>
    </p>
    <div
      class="main scrollingtouch"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <div v-if="menulist.length">
        <div
          class="folder-wrap-item"
          @click="onFolderClick(item)"
          v-for="(item,index) in menulist"
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
        <BottomLoadmore v-if="allLoaded && listLoadend" showType loadtext="已经加载全部了" type color />
        <BottomLoadmore
          v-if="!allLoaded && loading"
          showType="loading"
          loadtext="加载中..."
          type="triple-bounce"
          color
        />
      </div>
      <Empty v-else :text="['没有文夹']" />
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
import { Indicator, Toast, MessageBox } from "mint-ui";
const Empty = () => import("@/common/empty");
const BottomLoadmore = () => import("@/common/bottom-loadmore");
export default {
  props: {
    bankeid: {
      default: 0
    },
    parentid: {
      default: 0
    },
    headerName: {
      default: ""
    },
    cfrom: {
      default: false
    }
  },
  data() {
    return {
      cMenuItem: null,
      tempmenuData: [],
      menulist: [],
      page: 0,
      pagesize: 100,
      loading: false,
      listLoadend: false,
      allLoaded: false,
      newFileName: ""
    };
  },
  watch: {},
  computed: {
    myMenuname() {
      if (this.tempmenuData.length) {
        return this.tempmenuData[this.tempmenuData.length - 1].name;
      }
      return this.headerName;
    },
    myParentid() {
      if (this.tempmenuData.length) {
        return this.tempmenuData[this.tempmenuData.length - 1].id;
      }
      return this.parentid;
    }
  },
  created() {
    this.loadMoreFile(this.myParentid);
  },
  mounted() {},

  methods: {
    loadMore() {
      this.loading = true;
      this.loadMoreFile(this.myParentid);
    },
    loadMoreFile(parentid) {
      let postData = {
        bankeid: this.bankeid,
        page: this.page,
        pagesize: this.pagesize,
        parentid: parentid
      };
      if (this.cfrom) {
        postData.banketype = 1;
      }
      this.$http
        .post("/api/bankefile/querypage", postData)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.files.length >= this.pagesize) {
              this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.loading = true;
              this.allLoaded = true;
            }

            for (let item of res.data.data.files) {
              // this.menulist = [...this.menulist, ...[item]];
              if (item.ftype == "menu") {
                this.menulist = [...this.menulist, ...[item]];
                item.imgsrc = "/assets/file_icon/folder.svg";
              }
            }
          } else {
          }
        })
        .catch(res => {});
    },
    //点击文件夹
    onFolderClick(fitem) {
      this.cMenuItem = fitem;
      this.tempmenuData.push({
        id: fitem.id,
        name: fitem.name,
        datas: this.menulist
      });
      this.loadinit();
      this.loadMoreFile(fitem.id);
    },
    //返回上一级
    onprev() {
      this.menulist = this.tempmenuData[this.tempmenuData.length - 1].datas;
      this.tempmenuData.splice(this.tempmenuData.length - 1, 1);
      console.log("返回后", this.tempmenuData);
    },
    loadinit() {
      this.menulist = [];
      this.page = 0;
      this.loading = false;
      this.listLoadend = false;
      this.allLoaded = false;
    },
    //新建文件夹
    newFolder() {
      var url =
        "/api/bankefile/menuadd?parentid=" +
        this.myParentid +
        "&bankeid=" +
        this.bankeid;
      if (this.cfrom) {
        url += "&banketype=" + 1;
      }
      MessageBox.prompt("请输入文件名").then(({ value, action }) => {
        this.newFileName = value;
        Indicator.open("创建中...");
        this.$http
          .post(url, {
            name: this.newFileName
          })
          .then(res => {
            if (res.data.code == "0") {
              let item = res.data.data;
              item.imgsrc = "/assets/file_icon/folder.svg";
              this.menulist = [...[item], ...this.menulist];
            } else {
              Toast("创建失败");
            }
            Indicator.close();
          })
          .catch(err => {
            Toast("服务连接失败");
            Indicator.close();
          });
      });
    },
    submit() {
      this.$emit("menuSelectEnd", {
        parentid: this.myParentid,
        menuName: this.myMenuname
      });
    },
    canlce() {
      this.$emit("Cancel", true);
    }
  },
  components: {
    Empty,
    BottomLoadmore
  }
};
</script>

<style scoped lang="less">
.mulu-wrap {
  .Prev-btn {
    position: relative;
    height: 63px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    line-height: 63px;
    padding-left: 50px;
    z-index: 100;
    width: 100%;
    .iconfont {
      font-size: 30px;
    }
  }
  .main {
    // margin-top: 60px;
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
