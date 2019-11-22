<template>
  <div class="container">
    <div style="height:100%;">
      <div v-if="!states">
        <textarea v-model="zanswer.ztext" placeholder="请输入答案" class="zdetail"></textarea>

        <div class="attachdesc">添加附件</div>
        <div class="listc">
          <FileAttachList :urlinfo="urlinfo" :localfiles="zanswer.localfiles"></FileAttachList>
        </div>
        <div class="bottommargin"></div>
      </div>
      <div v-else>{{answerdesc}}</div>
    </div>
  </div>
</template>
<script>
import FileAttachList from "../components/FileAttachList";

export default {
  name: "ZuoyeDetailEdit",
  data() {
    return {
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      }
    };
  },
  props: {
    zanswer: {
      default() {
        return {
          ztext: "",
          localfiles: []
        };
      }
    },
    states: {
      default() {
        return false;
      }
    },
    zuoyeitem: {
      default() {
        return {};
      }
    }
  },
  computed: {
    answerdesc(){
  return  this.zuoyeitem.answerdesc?this.zuoyeitem.answerdesc:'未设置答案'
    }
  },
  components: {
    FileAttachList
  }
};
</script>

<style scoped>
.container {
  overflow: scroll;
  height: 100%;
}

.zdetail {
  /* old:300px */
  max-height: 300px;
  height: 40%;
  padding: 10px;
  font-size: 18px;
  width: 100%;
}
.zdetailrl {
  padding: 10px;
  font-size: 18px;
  width: 100%;
}
.attachdesc {
  padding: 5px 10px;
  font-size: 16px;
  border-bottom: 1px solid #eaeaea;
  border-top: 1px solid #eaeaea;
}
.listc {
  margin: 10px;
  overflow: visible;
}

.bottommargin {
  height: 100px;
}
</style>