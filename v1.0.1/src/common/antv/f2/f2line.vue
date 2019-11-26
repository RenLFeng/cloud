<template>
  <div>
    <h3 class="tit">{{tit}}</h3>
    <canvas :id="elId" width height="200px" class="mychart-f2"></canvas>
  </div>
</template>

<script>
import uuidv1 from "uuid/v1";
export default {
  name: "",
  props: {
    tit: {
      default: ""
    },
    elId: {
      default: 0
    },
    rangeTypes: {
      default() {
        return [];
      }
    }
  },
  components: {
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
