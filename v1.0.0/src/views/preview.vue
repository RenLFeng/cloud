<template>
  <demo-section>
    <demo-block title="$t('basicUsage')">
      <van-button
        type="primary"
        @click="showImagePreview"
      >
        <!-- {{ $t('button1') }} -->
        预览图片
      </van-button>
    </demo-block>

    <demo-block title="$t('button2')">
      <van-button
        type="primary"
        @click="showImagePreview(3)"
      >
        <!-- {{ $t('button2') }} -->
        指定初始位置
      </van-button>
    </demo-block>

    <demo-block title="$t('button3')">
      <van-button
        type="primary"
        @click="showImagePreview(0, 1000)"
      >
        <!-- {{ $t('button3') }} -->
        异步关闭
      </van-button>
    </demo-block>

    <demo-block title="$t('componentCall')">
      <van-button
        type="primary"
        @click="componentCall"
      >
        <!-- {{ $t('componentCall') }} -->
        组件调用
      </van-button>
      <van-image-preview
        v-model="show"
        :images="images"
        :swipe-duration="300"
         :startPosition="index"
        @change="onChange"
      >
        <template #index>{{ index+1}}</template>
      </van-image-preview>
    </demo-block>
  </demo-section>
</template>

<script>
import Vue from "vue";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
Vue.use(ImagePreview);
const images = [
  'http://localhost:8080/downloads/zuoye/20191019/1004/ff7f5e8d5349c2c7fdee8610368c3d27.jpg_snap.jpg',
  'http://localhost:8080/downloads/zuoye/20191019/1004/5b34768a8e5ad20f92059d4b31896cbb.jpg_snap.jpg',
  'https://img.yzcdn.cn/vant/apple-3.jpg',
  'http://localhost:8080/img/ppt.c3c0d25e.svg'
];
export default {

  data() {
    return {
      show: false,
      images,
      index:2
    };
  },
  components:{
      [ImagePreview.name]:ImagePreview
  },
  methods: {
    componentCall() {
      this.show = true;
    },
    onChange(index) {
      this.index = index;
    },
    showImagePreview(position, timer) {
      const instance = ImagePreview({
        images,
        lazyLoad: true,
        swipeDuration: 300,
        asyncClose: !!timer,
        closeOnPopstate: true,
        startPosition: typeof position === 'number' ? position : 0
      });
      if (timer) {
        setTimeout(() => {
          instance.close();
        }, timer);
      }
    }
  }
};
</script>




