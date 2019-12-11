<template>
  <div class="banshu-wrap">
    <mt-header title="课堂板书">
      <mt-button slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div class="main">
      <ul class="pic" v-if="banshuList.length">
        <li v-for="(v,i) in banshuList" :key="i" @click="preview(i)">
          <img :src="v.files" alt />
          <p class="tr color9">{{v.uploadtime}}</p>
        </li>
      </ul>
      <Empty v-else />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "@vant/touch-emulator/index";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import { Toast } from "mint-ui";
import { parseURL } from "@/util";
import Empty from "@/common/empty";
export default {
  props: {},
  data() {
    return {
      banshuList: [],
      bankeid: null
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
  methods: {
    queryBanshu() {
      this.$http
        .post("/api/banshu/query", {
          bankeid: this.bankeid,
          page: 0,
          pagesize: 50
        })
        .then(res => {
          if (res.data.code == "0") {
            this.banshuList = res.data.data;
            // this.banshuList.push({
            //   bankeid: 1000,
            //   files:
            //     "/downloads/avatar/2019-12-05/649dd86fdaf8e173e6be25beea80c8d3.jpg",
            //   id: 1000,
            //   uploadtime: "2019-12-02 14:29:13"
            // });
            // this.banshuList.push({
            //   bankeid: 1000,
            //   files:
            //     "/downloads/avatar/2019-12-05/72bdb233382ac7aa26fc93b64f6a7865.jpg",
            //   id: 1000,
            //   uploadtime: "2019-12-02 14:29:13"
            // });
            // this.banshuList.push({
            //   bankeid: 1000,
            //   files:
            //     "/downloads/avatar/2019-12-05/5ecddd1df02b68e15649ccbfe181d50b.jpg",
            //   id: 1000,
            //   uploadtime: "2019-12-02 14:29:13"
            // });
          } else {
            Toast("失败");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    preview(index) {
      let tempImgs = [];
      for (let item of this.banshuList) {
        tempImgs.push(item.files);
      }
      ImagePreview({
        images: tempImgs,
        startPosition: index,
        onClose() {}
      });
      // this.$store.commit("SET_ISPREVIEW", false);
      // this.$store.commit("SET_IMAGES", tempImgs);
      // this.$store.commit("SET_INDEX", index);
      // this.$store.commit("SET_SHOW", true);
    }
  },
  components: {
    [ImagePreview.name]: ImagePreview,
    Empty
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
    .pic {
      li {
        width: 100%;
        max-width: 640px;
        height: auto;
        margin: 0 auto;
        margin-bottom: 20px;
        background: #fff;
        img {
          width: 100%;
          height: 260px;
        }
        p {
          padding: 10px;
        }
      }
    }
  }
}
</style>
