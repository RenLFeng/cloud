<template>
  <div class="discuss-container">
    <div class="tit-info">
      <mt-cell :title="itemInfo.username+'      的作业'" :label="itemInfo.ztext"></mt-cell>
    </div>
    <img :src="image" alt />
    <div class="discuss-list-content">
      <p class="discuss-number color9">评论（10）</p>
      <div class="list-content" v-if="teacherInfo.length">
        <div class="item clearIt" v-for="(lists ,tindex) in teacherInfo" :key="tindex">
          <img class="tit-pic" :src="lists.useravatar" alt />
          <ul class="teacher-content">
            <li class="teacher-name color9">
              {{lists.username}}
              &nbsp;&nbsp;
              <mt-badge size="small" color="#ff7403">老师</mt-badge>
              <span class="hui-fu" @click="studentHF(lists,tindex)">回复</span>
            </li>
            <li v-if="lists.content" class="text">{{lists.content}}</li>
            <li v-if="lists.useravatar">
              <img :src="lists.useravatar" class="pic-sub" />
              <!-- <img
                v-for="(item,index) in lists.useravatar"
                :key="index"
                :src="item.src"
                class="pic-sub"
              />-->
            </li>
            <li
              class="dade color9"
              :class="lists.lastreplydata.length?'border-bottom':''"
            >{{lists.createtime}}</li>
            <li
              v-for="(item ,index) in lists.lastreplydata"
              :key="index"
              class="student-content clearIt"
              :class="index!=lists.lastreplydata.length-1?'border-bottom':''"
            >
              <ul>
                <li class="teacher-name color9">
                  {{item.fromusername}}
                  &nbsp;&nbsp;
                  <mt-badge size="small" color="#ff7403">老师</mt-badge>
                  <span class="hui-fu" @click="studentHF(item,tindex)">回复</span>
                </li>
                <li class="text">回复 {{item.fromusername}}：{{item.content}}</li>

                <li v-if="item.useravatar">
                  <img :src="item.useravatar" class="pic-sub" />
                  <!-- <img
                    v-for="(item,index) in item.useravatar"
                    :key="index"
                    :src="item.src"
                    class="pic-sub"
                  />-->
                </li>

                <li class="dade color9">{{item.createtime}}</li>
              </ul>
            </li>
          </ul>
          <span
            v-if="lists.replynum>3"
            class="more"
            @click="learnMoreFn(lists,tindex)"
          >{{lists.more?'收起':'查看更多'}}</span>
        </div>
      </div>
    </div>
    <mt-popup v-model="show" position="bottom" class="mint-popup-3" :closeOnClickModal="false">
      <div style class="hf-box">
        <p class="tit border-bottom-e5">
          <span class="qx" @click="qx">取消</span>
          <span class="qr" style="float:right" @click="HFSubmit()">确认</span>
        </p>
        <textarea class="border-bottom-e5" rows="10" placeholder="输入你的观点" v-model="textareaMsg"></textarea>
        <div class="add-pic">
          <div class="attachdesc border-bottom-e5">添加附件</div>
          <div class="listc">
            <!-- <FileAttachList :urlinfo="urlinfo" :localfiles="localfiles" ></FileAttachList> -->
            <img src="../../assets/zuoye_add.png" alt @click="unloadFn" />
            <a v-for="(item,index) in imgSrc" :key="index">
              <img class="hf-Submit-pic" :src="item.src" alt />
              <i @click="dele(index)">x</i>
            </a>
          </div>
        </div>
      </div>
    </mt-popup>
    <div class="submit-msg clearIt">
      <div class="upload-content">
        <img src="../../assets/zuoye_add.png" alt @click="unloadFn" />
        <input
          ref="uploadPic"
          type="file"
          name="file"
          class="upload"
          @change="uploadChange"
          accept="image/*"
          style="display:none"
        />
      </div>
      <input class="msg" type="text" v-model="discussMsg" placeholder="在此发表评论" />
      <span class="color9 submit" @click="submit()">发送</span>
    </div>
  </div>
</template>

<script>
import { Cell, Badge, Field, Toast, Indicator } from "mint-ui";
import dispic from "../../assets/dis.jpg";
import dispic2 from "../../assets/dis.jpg";
import mimgcrop from "../../common/m-image-crop";
import { constants } from "crypto";
import { formateTime } from "../../util";
import FileAttachList from "./FileAttachList";
import maintools from "../maintools";
const _URL = window.URL || window.webkitURL;
import commontools from "../../commontools";
export default {
  name: "",
  props: {
    itemInfo: {
      default() {
        return {};
      }
    },
    teacher: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      image: "",
      textareaMsg: "",
      show: false,
      index: "",
      discussMsg: "",
      teacherInfo: [],
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      },
      localfiles: [],
      imgSrc: [],
      files: [],
      ItemInfo: {},
      indexItem: {},
      inDestroy: false
    };
  },
  watch: {
    teacher(newValue, oldValue) {
      this.teacherInfo = newValue;
      console.log("watchwatch", newValue);
    }
  },
  created() {},
  mounted() {},
  methods: {
    //提交评论
    submit() {
      // if (!this.discussMsg && !this.files.length) return;
      this.$http
        .post("/api/comment/addcomment", {
          taboutid: this.itemInfo.id,
          content: this.discussMsg,
          files: ""
        })
        .then(res => {
          console.log("提交成功", res);
          let submitMsgData = {
            useravatar: res.data.data.useravatar,
            username: res.datadata.data.username,
            content: res.datadata.data.content,
            createtime: res.datadata.data.createtime,
            lastreplydata: []
          };
          this.teacher.unshift(submitMsgData);
          this.discussMsg = "";
        })
        .catch(() => {
          console.log("提交失败");
        });
    },
    unloadFn() {
      this.$refs.uploadPic.click();
    },
    uploadChange(e) {
      let that = this;
      let file = e.target.files[0];
      let formdata = new FormData();
      this.uploadImg(file);
      this.$refs.uploadPic.value = "";
    },
    uploadImg(file) {
      let formdata = new FormData();
      formdata.append("file", file);
      let url = this.urlinfo.urlupload;
      this.$http
        .post(url, formdata)
        .then(res => {
          if (res.data.code == 0) {
            this.image = res.data.data.filepath;
            console.log("成功", res.data.data);
          } else {
            console.log("失败", res.data.data);
          }
        })
        .catch(() => {
          console.log("catch", res.data.data);
        });
    },
    //回复button
    studentHF(item, index) {
      console.log("回复回复", item);
      this.indexItem = item;
      this.index = index;
      this.show = true;
      console.log("item  data", item);
    },
    //回复评论
    HFSubmit() {
      if (!this.textareaMsg && this.imgSrc.length == 0) return;
      Indicator.open();
      let item = this.indexItem;
      let id = item.tcommentid || item.id;
      this.$http
        .post("/api/comment/addreply", {
          tcommentid: id,
          touserid: item.userid || item.nomtouserid,
          tousername: item.username || item.tousername,
          content: this.textareaMsg,
          files: ""
        })
        .then(res => {
          Indicator.close();
          console.log("提交成功", res);
          let Data = res.data.data;
          this.teacher[this.index].lastreplydata.push(Data);
          this.init();
        })
        .catch(() => {
          Indicator.close();
          console.log("提交失败");
        });
    },
    learnMoreFn(item, index) {
      item.more = !item.more;
      if (item.more) {
        this.$http
          .get(
            "/api/comment/queryreply?tcommentid=" +
              item.id +
              "&topid=&pagesize=",
            {}
          )
          .then(res => {
            let Data = res.data.data;
            this.teacher[index].lastreplydata = Data;
          })
          .catch(() => {});
      } else {
        this.teacher[index].lastreplydata.splice(
          3,
          this.teacher[index].lastreplydata.length
        );
      }
    },
    qx() {
      this.init();
    },
    init() {
      this.show = false;
      this.index = "";
      this.textareaMsg = "";
      this.imgSrc = [];
      this.indexItem = {};
    },
    dele(index) {
      this.imgSrc.splice(index, 1);
    },
    unloadServer(files) {
      let param = new FormData();
      for (let i = 0; i < files.length; i++) {
        param.append("imgFile" + (i + 1), files[i]);
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="less">
.discuss-container {
  .tit-info {
    .mint-cell-wrapper {
      padding: 15px 10px;
    }
  }
  .discuss-list-content {
    width: 100%;
    max-height: 75vh;
    overflow-y: scroll;
    .discuss-number {
      padding: 20px 10px;
      background: #f0f0f0;
      font-size: 1.125rem;
    }
    .list-content {
      padding: 10px;
      .item {
        position: relative;
        margin-bottom: 5vw;
        // padding-bottom: 10px;
        img.tit-pic {
          width: 18%;
          position: absolute;
          left: 0;
          top: 0;
        }
        ul {
          width: 90%;
          height: auto;
          float: right;
          li {
            padding: 5px 0;
          }
          .teacher-name {
            .hui-fu {
              float: right;
              color: #57a4de;
            }
          }
          .student-content {
          }
        }
        .teacher-content {
          width: 80%;
          .pic-sub {
            width: 100%;
          }
        }
        .more {
          position: absolute;
          bottom: -15px;
          width: 100%;
          text-align: center;
          color: #57a4de;
        }
      }
    }
  }
  .submit-msg {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    border: 1px solid #ccc;
    padding: 10px 0;
    border-radius: 8px;
    .upload-content {
      position: absolute;
      img {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 20%;
        left: 50%;
        top: 0;
        transform: translate(8%, -8%);
        .upload {
          display: none;
        }
      }
    }

    input {
      width: 70%;
      height: 40px;
      padding: 3px 12px 0;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-left: 60px;
    }

    .submit {
      width: 2.5rem;
      height: 100%;
      position: absolute;
      right: 5px;
      top: 50%;
      margin-top: -20px;
      line-height: 40px;
      font-size: 18px;
    }
  }
  .mint-popup-bottom {
    width: 100%;
    height: 50vh;
    max-height: 50vh;
    min-height: 50vh;
    overflow-y: scroll;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 0 0 35px 13px #656060;
    .hf-box {
      .tit {
        padding: 10px;
        .qr {
          float: right;
        }
      }
      textarea {
        width: 100%;
        padding: 15px;
      }
      .add-pic {
        .listc {
          float: left;
          a {
            position: relative;
            display: inline-block;
          }
          i {
            position: absolute;
            right: 4px;
            top: -10px;
            width: 18px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            background: #000;
            border-radius: 10px;
            color: #fff;
          }
        }
        .attachdesc {
          padding: 10px;
        }
      }
    }
    .hf-Submit-pic {
      width: 4.375rem;
      height: 3.675rem;
      margin-right: 10px;
    }
  }
}
</style>
