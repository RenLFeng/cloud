<template>
  <div>
    <van-tabs
      v-model="Selected"
      type="card"
      border
      color="#0091fa"
      @change="Change"
      class="table-vant"
    >
      <van-tab v-for="(item,index) in rangeTypes" :title="item.text" :key="index"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, Button } from "vant";
export default {
  name: "",
  props: {
    type: {
      default: ""
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button
  },
  data() {
    return {
      Selected: 0,
      rangeTypes: [
        {
          text: "近7天",
          value: "0"
        },
        {
          text: "近1月",
          value: "1"
        },
        {
          text: "近半年",
          value: "2"
        }
      ]
    };
  },

  methods: {
    Change(active) {
      this.Selected = active;
      this.$emit("tableSelected", {index:this.Selected,type:this.type});
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
