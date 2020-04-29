<template>
  <div class="container">
    <div style="height:100%;">
      <div>
        <mt-field placeholder="请输入答案" type="textarea" rows="8" v-model="zanswer.ztext" :disabled="answerdesc" @blur.native.capture="$setInputScroll"></mt-field>
        <div class="attachdesc">{{answerdesc?'附件':'添加附件(300M以内)'}}</div>
        <div class="listc">
          <FileAttachList :urlinfo="urlinfo" :localfiles="zanswer.localfiles" :isupload="answerdesc?false:true"></FileAttachList>
        </div>
        <div class="bottommargin"></div>
      </div>
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
    zuoyeitem: {
      default() {
        return {};
      }
    }
  },
  computed: {
    answerdesc() {
      if (this.zuoyeitem.answerdesc) {
        return true;
      } else {
        return false;
      }
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