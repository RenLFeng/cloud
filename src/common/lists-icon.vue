<template>
  <div class="lists-container-icon">
      <ul>
        <li v-for="(item,index) in listsData" :key="index">
          <mt-cell :title="item.title" :label="item.label" :value="item.value">
            <img slot="icon" :src="item.icon" />
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
