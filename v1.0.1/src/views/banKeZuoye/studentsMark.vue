<template>
  <div class="all-mark">
    <p
      v-if="statedesc && allInfo.length"
      class="color9 title-back"
      style="border-bottom:1px solid #e5e5e5;    margin-bottom: 15px;"
    >
      <mt-cell :title="$t('bankeTask.State_tips_text')"></mt-cell>
    </p>
    <p
      v-if="!statedesc"
      class="color9 title-back"
      style="border-bottom:1px solid #e5e5e5;    margin-bottom: 15px;"
    >
      <mt-cell :title="$t('bankeTask.Has_ended')"></mt-cell>
    </p>
    <div class>
      <!-- <p @click="selectTextFn" class="my-color border-c-bottom">切换为按({{selectText?'得分':'学号'}})显示</p> -->
      <lists :listsData="allInfo" />
    </div>
  </div>
</template>

<script>
import lists from "../../common/lists-icon";
//import pic from "../../assets/dis.jpg";
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
      // console.log(oldValue);
      this.allInfo = newValue;
      this.state = this.itemInfo.state;
    }
  },
  components: {
    lists
  },
  data() {
    return {
      selectText: false,
      allInfo: [],
      state: 10
    };
  },
  computed: {
    statedesc() {
      if (this.state == 100) {
        return true;
      }
      return false;
    }
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
  .lists-container-icon {
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
