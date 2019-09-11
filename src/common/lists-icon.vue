<template>
  <div class="lists-container-icon">
      <ul>
        <li v-for="(item,index) in listsData" :key="index">
          <mt-cell :title="item.username" :label="item.ztext" :value="item.score>=0?item.score:'未评分'">
            <img slot="icon" :src="item.useravatar" />
          </mt-cell>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: '',
 props: {
    listsData: {
      default() {
        return [];
      }
    }
  },
  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style lang="less" scoped>


</style>
