<template>
  <div class="banshu-wrap">
    <mt-header title="课堂板书" class="mint-header-f">
      <mt-button icon="back" slot="left" @click="$back">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div class="main overflow-scroll">
      <div v-if="banshuList.length">
        <ul
          class="pic"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <li class v-for="(v,i) in banshuList" :key="i" @click="preview(i)">
            <img :src="`${v.files}_snap.jpg`" alt class="object-fit-img" />
            <p class="fontsmall">
              {{v.uploadtime}}
              <i
                class="iconfont iconjiantou1 eicotrigger color9 fr"
                @click.stop="onEdit(v)"
              ></i>
            </p>
          </li>
        </ul>
        <BottomLoadmore v-if="listLoadend && allLoaded" showType loadtext="已经加载全部了" type color />
        <BottomLoadmore
          v-if="!allLoaded && loading"
          showType="loading"
          loadtext="加载中..."
          type="triple-bounce"
          color
        />
      </div>
      <Empty v-else />
      <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "@vant/touch-emulator/index";
import Loading from "vant/lib/loading";
import "vant/lib/loading/style";
import "@vant/touch-emulator/index";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import { parseURL, CollectionFn, getZYFileType } from "@/util";
import nativecode from "../../../nativecode";
import BottomLoadmore from "@/common/bottom-loadmore";
import {
  Indicator,
  Toast,
  MessageBox,
  Actionsheet,
} from "mint-ui";
import Empty from "@/common/empty";
const arr = {
  bankeid: 1000,
  files: "downloads/pingce/2019-12-17/ae950d99cfbdabd73cf6d92eaa5237f7.jpeg",
  id: 1000,
  uploadtime: "2019-12-02 14:29:13"
};
export default {
  props: {},
  data() {
    return {
      banshuList: [],
      bankeid: null,

      page: 0,
      pagesize: 10,
      loading: false,
      listLoadend: false,
      allLoaded: false,
      editItemObj: {},
      actionShow: false,
      actions: [
        {
          name: "收藏",
          method: this.Collection
        }
      ]
    };
  },
  computed: {},
  created() {
    const UrlParams = parseURL(window.location.href);
    let params = this.$route.params;
    if (UrlParams.id) {
      this.bankeid = UrlParams.id;
    } else {
      this.bankeid = params.bankeid;
    }
    this.queryBanshu();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    onEdit(item) {
      console.log(item);
      this.editItemObj = item;
      this.actionShow = true;
    },
    //收藏
    Collection() {
      let imgIcon = "";
      imgIcon = this.editItemObj.files + "_snap.jpg";
      let name = "课堂板书" + this.editItemObj.uploadtime;
      let cobj = {
        filepath: this.editItemObj.files
      };
      CollectionFn(cobj, 100, imgIcon, this.editItemObj.id, this.bankeid, name);
    },
    loadMore() {
      this.loading = true;
      this.queryBanshu();
    },
    queryBanshu() {
      this.$http
        .post("/api/banshu/query", {
          bankeid: this.bankeid,
          page: this.page,
          pagesize: this.pagesize
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.length >= this.pagesize) {
              this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                this.listLoadend = true;
              }
              this.loading = true;
              this.allLoaded = true;
            }
            this.banshuList = [...this.banshuList, ...res.data.data];
          } else {
            Toast("失败");
          }
          console.log("bb", this.banshuList);
        })
        .catch(err => {
          Toast("异常");
        });
    },
    preview(index) {
      let tempImgs = [];
      for (let item of this.banshuList) {
        tempImgs.push(nativecode.getUsedUrl(item.files));
      }
      nativecode.previewImage(this, {
        urls: tempImgs,
        index: index
      });

      // ImagePreview({
      //   images: tempImgs,
      //   startPosition: index,
      //   onClose() {}
      // });
      // this.$store.commit("SET_ISPREVIEW", false);
      // this.$store.commit("SET_IMAGES", tempImgs);
      // this.$store.commit("SET_INDEX", index);
      // this.$store.commit("SET_SHOW", true);
    }
  },
  components: {
    [ImagePreview.name]: ImagePreview,
    [Loading.name]: Loading,
    [Actionsheet.name]:Actionsheet,
    Empty,
    BottomLoadmore
  }
};
</script>
<style>
.tes {
  width: 100%;
  max-width: 640px;
  height: auto;
  max-height: 260px;
  overflow: hidden;
  resize: both;
}
.fill {
  object-fit: fill;
}
.contain {
  object-fit: contain;
}
.cover {
  object-fit: cover;
}
.none {
  object-fit: none;
}
.scale-down {
  object-fit: scale-down;
}
</style>
<style scoped lang="less">
.banshu-wrap {
  .main {
    background: #f0f0f0;
    margin-top: 50px;
    height: 93vh;
    min-height: 93vh;
    .pic {
      li {
        width: 100%;
        max-width: 640px;
        height: auto;
        margin: 0 auto;
        margin-bottom: 20px;
        background: #fff;
        padding: 0 30px;
        img {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 100%;
        }
        p {
          padding: 10px;
          i {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
