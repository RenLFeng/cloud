<template>
  <div class="all-mark">
    <p class="color9">
      <mt-cell title="活动尚未结束，以下得分可能不是最终得分"></mt-cell>
    </p>
    <div class="">
      <p @click="selectTextFn" class="my-color border-c-bottom">切换为按({{selectText?'得分':'学号'}})显示</p>
      <lists  :listsData="Data"/>
    </div>
  </div>
</template>

<script>
import lists from "../../common/lists-icon";
import pic from "../../assets/dis.jpg"
export default {
  name: "",
  props: {
    itemInfo: {
      default() {
        return {};
      }
    }
  },
  components: {
    lists
  },
  data() {
    return {
      selectText: false,
      Data: [
        { title: "标题", label: "描述信息", value: "尚无评分",icon:pic },
        { title: "标题", label: "描述信息", value: "尚无评分",icon:pic },
        { title: "标题", label: "描述信息", value: "尚无评分",icon:pic }
      ]
    };
  },

  methods: {
    selectTextFn() {
      this.selectText = !this.selectText;
    }
  }
};
</script>

<style scoped lang='less'>
.all-mark {
  .my-color {
    font-size: 18px;
    padding: 10px;
  }
}
</style>
