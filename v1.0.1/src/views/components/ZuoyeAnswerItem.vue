<template>
  <div>
    <div class="zacontainer">
      <div class="zaavatar">
        <img :src="resultitem.useravatar" class="zaavatarimg avatar" :onerror="$defaultImg('account')" />
        <div class="zabtnmore zatopmargin" v-if="showsubmitnum">
          <div @click="onseeAllSubmit(resultitem)" class="zatopnumbtn">{{resultitem.submitnum}}次提交</div>
        </div>
        <div class="zaavatartext zatopmargin">{{resultitem.username}}</div>
      </div>

      <TextEllipsis
        :text="resultitem.ztext"
        :height="50"
        :isLimitHeight="isLimitHeight"
        class="zatextmain"
      >
        <!--<span slot="before" class="h-tag h-tag-red">new</span> -->
        <template slot="more">
          <span>...</span>
          <span class="zatextviewmore" @click="isLimitHeight=false">查看更多</span>
        </template>
        <span slot="after" v-if="!isLimitHeight" @click="isLimitHeight=true">
          <span class="zatextviewmore">收起</span>
        </span>
      </TextEllipsis>

      <FileAttachList
        :isupload="isupload"
        :localfiles="resultitem.localfiles"
        class="falist"
      ></FileAttachList>
      <div class="zasubmittime">{{submittimedesc}}</div>
    </div>
    <div class="zabottom tc">
      <div class="zabottompart zabottompartdevide" @click="onclickscore">
        <div class="zabottomparttop">{{scoredesc}}</div>
        <div class="zabottompartbottom">老师评分</div>
      </div>
      <div class="zabottompart" @click="onclickcomment">
        <div class="zabottomparttop">{{commentnumdesc}}</div>
        <div class="zabottompartbottom">评论</div>
      </div>
    </div>
  </div>
</template>

<script>
import FileAttachList from "./FileAttachList";

import TextEllipsis from "./TextEllipsis";

import commontools from "../../commontools";

export default {
  name: "ZuoyeAnswerItem",
  data() {
    return {
      isupload: false,
      localfiles: [{ imgsrc: require("../../assets/zuoye_icon.png") }],
      text: "",
      isLimitHeight: true,
    };
  },
  mounted() {},
  methods: {
    onseeAllSubmit(item) {
      this.$emit("seeAllSubmit", item);
    },
    onclickcomment() {
      let data = {
        state: true,
        info: this.resultitem
      };
      this.$emit("commentClicked", data);
    },
    onclickscore() {
      let data = {
        state: true,
        info: this.resultitem
      };
      this.$emit("scoreClicked", data);
    }
  },
  computed: {
    commentnumdesc() {
      return this.resultitem.commentnum + "";
    },
    showsubmitnum() {
      if (this.resultitem.submitnum > 1) {
        return true;
      }
      return false;
    },
    defaultImage() {
      var srcstr = 'this.src="';
      srcstr += require("../../assets/account_default.png");
      srcstr += '"';
      return srcstr;
    },
    scoredesc() {
      if (this.resultitem.score < 0) {
        return "未评分";
      }
      var nfmt = "%i 分";
      return commontools.sprintf(nfmt, this.resultitem.score);
    },
    submittimedesc() {
       var szt = commontools.longTime(this.resultitem.submittime);
      // var szt = commontools.timeToHummanRead(this.resultitem.submittime);
      var szfmt = "%s 提交";
      return commontools.sprintf(szfmt, szt);
    }
  },
  props: {
    resultitem: {
      default() {
        return {
          username: "",
          useravatar: "",
          submitnum: 0,
          commentnum: 0,
          score: -1,
          submittime: "",
          localfiles: [],
          ztext: "",
          userid: 0
        };
      }
    }
  },
  components: {
    FileAttachList,
    TextEllipsis
    // [ImagePreview.name]:ImagePreview
  }
};
</script>

<style scoped>
.falist {
  margin-left: -5px;
}

.zabottom {
  height: 40px;
  border-top: 1px solid #a9a9a9;
}
.zabottompart {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  color: black;
  display: inline-block;
}
.zabottomparttop {
  margin-top: 4px;
  color: #0089ff;
}
.zabottompartbottom {
}
.zabottompartdevide {
  border-right: 1px solid #a9a9a9;
}

.zasubmittime {
  font-size: 14px;
  color: #a9a9a9;
}

.zatextmain {
  font-size: 16px;
  color: black;
  margin-top: 5px;
}
.zatextmaintext {
  text-overflow: ellipsis;
  display: inline-block;
}
.zatextviewmore {
  display: inline-block;
  color: #509f7a;
  font-weight: bold;
}

.zacontainer {
  background-color: white;
  padding: 10px;
}
.zaavatartext {
  margin-left: 35px;
}

.zatopmargin {
  padding-top: 5px;
}
.zatopnumbtn {
  font-size: 16px;
  margin-top: 1px;
}

.zaavatarimg {
  float: left;
  width: 30px;
  height: 30px;
}
.zaavatar {
  font-size: 18px;
  color: black;
  height: 30px;
}
.zabtnmore {
  color: #0089ff;
  float: right;
}
.tc {
  padding: 6px 0;
  height: auto;
}
</style>