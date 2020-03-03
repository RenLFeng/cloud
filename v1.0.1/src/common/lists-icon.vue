<template>
  <div class="lists-container-icon">
    <ul>
      <li :class="item.ztext?'item-container islabel':'item-container'" v-for="(item,index) in listsData" :key="index">
        <mt-cell :title="item.username" :value="!item.submitnum?'未提交':item.score<0?'未评分':item.score+'分'">
          <img slot="icon" :src="item.useravatar" :onerror="$defaultImg('account')"/>
        </mt-cell>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    listsData: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {

  },
  methods: {}
};
</script>

<style lang="less" scoped>
.lists-container-icon {
}
</style>
