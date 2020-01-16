<template>
  <div class="discuss-container">
    <!-- <div class="tit-info">
      <mt-cell :title="itemInfo.username+'      的作业'" :label="itemInfo.ztext"></mt-cell>
    </div> -->
    <div class="discuss-list-content">
      <p class="discuss-number color9">评论（10）</p>
      <div
        class="list-content"
        v-if="teacherInfo.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="100"
      >
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
            <li v-if="lists.files">
              <img :src="lists.files.filepath" class="pic-sub" />
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

                <li v-if="item.files">
                  <img :src="item.files.filepath" class="pic-sub" />
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
      <div class="no-more" v-if="loading">我是有底线的~~</div>
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
import { Cell, Badge, Field, Toast, Indicator, InfiniteScroll } from "mint-ui";
// import dispic from "../../assets/dis.jpg";
// import dispic2 from "../../assets/dis.jpg";
// import mimgcrop from "../../common/m-image-crop";
// import { constants } from "crypto";
// import { formateTime } from "../../util";
// import FileAttachList from "./FileAttachList";
// import maintools from "../maintools";
// const _URL = window.URL || window.webkitURL;
// import commontools from "../../commontools";
const teacherInfo = [
  {
    content: "",
    createtime: "2019-09-10 11:13:25",
    files: {
      contenttype: "image/jpeg",
      fileid: "111",
      filename: "",
      filepath:
        "/downloads/zuoye/20190910/1001/9de7c1e76cdee928ddf808dbfa7715ff.jpg",
      filesize: 22940,
      filetype: 1,
      id: "111",
      metainfo: {},
      uploadtime: "2019-09-10 11:13:24",
      uploaduser: 1001
    },
    id: 1073,
    info: "",
    lastreplydata: [
      {
        content: "好好",
        createtime: "2019-09-10 11:13:34",
        files: {},
        fromuserid: 1001,
        fromusername: "teacher1",
        id: 1082,
        tcommentid: 1073,
        tcommenttype: 0,
        touserid: 1001,
        tousername: "teacher1"
      }
    ],
    replynum: 4,
    tabout: 0,
    taboutid: 1,
    ttype: 0,
    useravatar: "/teacher.png",
    userid: 1001,
    username: "teacher1"
  }
];
export default {
  name: "",
  props: {

  },
  data() {
    return {
      loading: false,
      image: "",
      textareaMsg: "",
      show: false,
      index: "",
      discussMsg: "",
      teacherInfo: teacherInfo,
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      },
      localfiles: [],
      imgSrc: [],
      files: [],
      ItemInfo: {},
      indexItem: {},
      inDestroy: false,
      imgFileJson: "",
      topid: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    commentQuery(item) {
      let url = "";
      if (this.topid) {
        url =
          "/api/comment/query?taboutid=" +
          item.id +
          "&tabout=0&topid=" +
          this.topid +
          "&pagesize=10";
      } else {
        url =
          "/api/comment/query?taboutid=" + item.id + "&tabout=0&pagesize=10";
      }
      this.$http
        .post(url, {})
        .then(res => {
          console.log("查询成功", res);
          let serveData = res.data.data;
          if (serveData.length < 10) {
            this.loading = true;
          }
          for (let item of serveData) {
            if (item.files && typeof item.files == "string") {
              item.files = JSON.parse(item.files);
            }
            if (item.lastreplydata == "") {
              item.lastreplydata = [];
            } else {
              item.lastreplydata = JSON.parse(item.lastreplydata);
            }
          }
          this.topid = serveData[serveData.length - 1].id;
           this.teacherInfo = this.teacherInfo.concat(serveData);
          // this.teacherInfo = [...this.teacherInfo, ...serveData];
        })
        .catch(() => {
          console.log("查询失败");
        });
    },
    loadMore() {
      this.commentQuery(this.ItemInfo);
    },
    //提交评论
    submit() {
      if (!this.discussMsg && !this.imgFileJson) return;
      this.$http
        .post("/api/comment/addcomment", {
          taboutid: this.itemInfo.id,
          content: this.discussMsg,
          files: this.imgFileJson
        })
        .then(res => {
          console.log("提交成功", res);
          let Data = res.data.data;
          if (this.imgFileJson) {
            Data.files = JSON.parse(this.imgFileJson);
          }
          this.teacherInfo.unshift(Data);
          this.init();
          s;
        })
        .catch(() => {
          console.log("提交失败");
          this.init();
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
      let that = this;
      let formdata = new FormData();
      formdata.append("file", file);
      let url = this.urlinfo.urlupload;
      this.$http
        .post(url, formdata)
        .then(res => {
          if (res.data.code == 0) {
            this.imgFileJson = JSON.stringify(res.data.data);
            // console.log( ' this.imgFileJson this.imgFileJson',this.imgFileJson);
            if (that.index >= "0") {
              this.HFSubmit();
            } else {
              this.submit();
            }
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
    },
    //回复评论
    HFSubmit() {
      if (!this.textareaMsg && !this.imgFileJson) return;
      Indicator.open(this.$t('Indicator.Loading'));
      let subData = {};
      let item = this.indexItem;
      subData.tcommentid = item.tcommentid || item.id;
      subData.touserid = item.touserid || item.userid;
      subData.tousername = item.tousername || item.username;
      subData.content = this.textareaMsg;
      subData.files = this.imgFileJson;
      this.$http
        .post("/api/comment/addreply", subData)
        .then(res => {
          Indicator.close();
          console.log("提交成功", res);
          let Data = res.data.data;
          if (this.imgFileJson) {
            Data.files = JSON.parse(this.imgFileJson);
          }
          this.teacherInfo[this.index].lastreplydata.push(Data);
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
            for (let item of Data) {
              if (item.files) {
                item.files = JSON.parse(item.files);
              }
            }
            this.teacherInfo[index].lastreplydata = Data;
          })
          .catch(() => {});
      } else {
        this.teacherInfo[index].lastreplydata.splice(
          3,
          this.teacherInfo[index].lastreplydata.length
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
      this.discussMsg = "";
      this.imgFileJson = "";
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
