<template>
  <div id="group" class="biggp-root">
    <DapingHome />
  </div>
</template>

<script>
import DapingHome from "./views/dapingModule";
export default {
  name: "app",
  components: {
    DapingHome
  }
};
</script>

<style>
#group {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.biggp-root {
  font-size: 16px;
}

.biggp-root .mint-switch {
  float: left;
}
.biggp-root .mint-switch-core {
  width: 50px;
  height: 30px;
  border-radius: 30px;
}
.biggp-root .mint-switch-core::before {
  width: 0;
}
.biggp-root .mint-switch-core::after {
  width: 32px;
  height: 30px;
  border-radius: 30px;
}
.biggp-root .mint-switch-input:checked + .mint-switch-core::after {
  -webkit-transform: translateX(0.53333rem);
  transform: translateX(19px);
}
.biggp-root .clearfix:after {
  content: ".";
  width: 0;
  height: 0;
  visibility: hidden;
  display: block;
  clear: both;
  overflow: hidden;
}
.biggp-root .position-c {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.biggp-root .iconfont{
  position: absolute;
  font-size: 30px;
}
</style>
<style lang="less" scoped>
</style>
