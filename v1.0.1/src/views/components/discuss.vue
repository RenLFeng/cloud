<template>
  <div class="discuss-container">
    <div class="tit-info">
      <mt-cell :title="ItemInfo.username+'的作业'" :label="ItemInfo.ztext"></mt-cell>
    </div>
    <div class="discuss-list-content">
      <p class="discuss-number color9 fontnormal">评论（{{ItemInfo.commentnum}}）</p>
      <div
        class="list-content"
        v-if="teacherInfo.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50"
      >
        <div class="item clearIt" v-for="(lists ,tindex) in teacherInfo" :key="tindex">
          <img class="tit-pic" :src="lists.useravatar" alt :onerror="$defaultImg('account')"/>
          <ul class="teacher-content">
            <li class="teacher-name color9">
              {{lists.username}}
              &nbsp;&nbsp;
              <!-- <mt-badge size="small" color="#ff7403">老师</mt-badge> -->
              <span v-if="user.id!=lists.userid" class="hui-fu" @click="studentHF(lists,tindex)">回复</span>
            </li>
            <li v-if="lists.content" class="text">{{lists.content}}</li>
            <li v-if="lists.files" class="clearfix">
              <!-- <img
                :src="lists.files.filepath"
                class="pic-sub"
                @click="Preview(lists.files.filepath)"
              />-->
              <FileAttachList :isupload="false" class="falist" :localfiles="lists.files"></FileAttachList>
            </li>
            <li
              class="dade color9"
              :class="lists.lastreplydata.length?'border-bottom':''"
            >{{longTime(lists.createtime)}}</li>
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
                  <!-- <mt-badge size="small" color="#ff7403">老师</mt-badge> -->
                  <span v-if="user.id!=item.fromuserid" class="hui-fu" @click="studentHF(item,tindex)">回复</span>
                </li>
                <li class="text">回复{{item.tousername}}：{{item.content}}</li>

                <li class="clearfix">
                  <!-- <viewer> -->
                  <!-- <img
                    :src="item.files.filepath"
                    class="pic-sub"
                    @click="Preview(item.files.filepath)"
                  />-->
                  <FileAttachList :isupload="false" class="falist" :localfiles="item.files"></FileAttachList>
                  <!-- </viewer> -->
                  <!-- <viewer>
                    <img
                      v-for="(item,index) in item.files"
                      :key="index"
                      :src="item.filepath"
                      class="pic-sub"
                    />
                  </!-->
                </li>

                <li class="dade color9">{{longTime(item.createtime)}}</li>
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
      <div class="no-more" v-if="loading && teacherInfo.length>'10'">我是有底线的~~</div>
      <div class="no-more" v-if="noComment">暂未评论~~</div>
    </div>
    <mt-popup v-model="show" position="bottom" class="mint-popup-3" :closeOnClickModal="false">
      <div style class="hf-box">
        <p class="tit border-bottom-e5">
          <span class="qx button-blue" @click="qx">取消</span>
          <span class="qr button-blue" style="float:right" @click="HFSubmit()">确认</span>
        </p>
        <textarea class="border-bottom-e5" rows="8" placeholder="输入你的观点" v-model="textareaMsg"></textarea>
        <div class="add-pic">
          <div class="attachdesc border-bottom-e5">添加附件</div>
          <div class="listc">
            <img src="/assets/zuoye_add.png" alt @click="unloadFn" />
            <a v-for="(v,i) in commentPicSrc" :key="i">
              <img :src="v" alt />
              <i @click="dele(i)">x</i>
            </a>
          </div>
        </div>
      </div>
    </mt-popup>
    <div class="submit-msg clearIt">
      <div class="upload-content">
        <img src="/assets/zuoye_add.png" alt @click="unloadFn" />
        <input
          ref="uploadPic"
          type="file"
          name="file"
          class="upload"
          @change="uploadChange"
          style="display:none"
          accept="image/*"
        />
      </div>
      <input class="msg" type="text" v-model="discussMsg" placeholder="在此发表评论" @blur="$setInputScroll"/>
      <span class="color9 submit" style="color:#26a2ff" @click="submit()">发送</span>
    </div>
  </div>
</template>

<script>
import { Cell, Badge, Field, Toast, Indicator, InfiniteScroll } from "mint-ui";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import mimgcrop from "../../common/m-image-crop";
import { constants } from "crypto";
import { formateTime } from "../../util";
import FileAttachList from "./FileAttachList";
import ZuoyeDetailEdit from "../ZuoyeDetailEdit";
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
    zuoyeitem: {
      default() {
        return {};
      }
    }
  },
  components: {
    [ImagePreview.name]: ImagePreview,
    FileAttachList,
    ZuoyeDetailEdit
  },
  data() {
    return {
      loading: false,
      textareaMsg: "",
      show: false,
      index: "",
      discussMsg: "",
      teacherInfo: [],
      urlinfo: {
        urlupload: "/api/api/zuoyefileupload",
        urldel: "/api/api/zuoyefiledelete"
      },
      imgSrc: [],
      ItemInfo: {},
      indexItem: {},
      imgFileJson: "",
      topid: "",
      noComment: false,
      commentPic: [],
      commentPicSrc: [],
      longTime: commontools.longTime
    };
  },
  watch: {
    itemInfo: function(newValue, oldValue) {
      this.backInit();
      this.ItemInfo = newValue;
      this.commentQuery(this.ItemInfo);
    }
  },
  computed: {
    isTeacher() {
      return this.$store.getters.isteacher;
    },
      user() {
      return this.$store.getters.curuser;
    },
  },
  created() {},
  mounted() {},
  methods: {
    Preview(img) {
      let images = [img];

      ImagePreview(images);
    },
    commentQuery(item) {
      Indicator.open(this.$t("Indicator.Loading"));
      let url = "";
      if (this.topid) {
        url =
          "/api/comment/query?taboutid=" +
          item.submitid +
          "&tabout=0&topid=" +
          this.topid +
          "&pagesize=10";
      } else {
        url =
          "/api/comment/query?taboutid=" +
          item.submitid +
          "&tabout=0&pagesize=10";
      }
      this.$http
        .post(url, {})
        .then(res => {
          console.log("查询成功", res);
          if (res.data.code == "0") {
            let serveData = res.data.data;
            if (!serveData.length && !this.teacherInfo.length) {
              this.noComment = true;
            } else {
              if (serveData.length < 10) {
                this.loading = true;
              }
              for (let lists of serveData) {
                if (lists.files && typeof lists.files == "string") {
                  // after
                  let arr = [];
                  arr[0] = JSON.parse(lists.files);
                  lists.files = arr;
                  for (let v of lists.files) {
                    v.metainfo=JSON.parse(v.metainfo)
                    if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
                      v.imgsrc = v.filepath + v.metainfo.snapsuffix;
                    } else {
                      v.imgsrc = v.filepath;
                    }
                  }
                  //front    lists.files = JSON.parse(lists.files);
                }
                if (lists.lastreplydata == "") {
                  lists.lastreplydata = [];
                } else {
                  lists.lastreplydata = JSON.parse(lists.lastreplydata);
                  for (let item of lists.lastreplydata) {
                    if (item.files) {
                      // after
                      let arr = [];
                      arr[0] = JSON.parse(item.files);
                      item.files = arr;
                      for (let v of item.files) {
                         v.metainfo=JSON.parse(v.metainfo)
                        if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
                          v.imgsrc = v.filepath + v.metainfo.snapsuffix;
                        } else {
                          v.imgsrc = v.filepath;
                        }
                      }
                      //front   item.files = JSON.parse(item.files);
                    }
                  }
                }
              }
              this.topid = serveData[serveData.length - 1].id;
              // this.teacherInfo = this.teacherInfo.concat(serveData);
              this.teacherInfo = [...this.teacherInfo, ...serveData];
               console.log('lastreplydata', this.teacherInfo);
            }
          } else {
          }
          Indicator.close();
        })
        .catch(() => {
          Indicator.close();
          console.log("查询失败");
        });
    },
    loadMore() {
      if (this.teacherInfo.length >= "10") {
        this.commentQuery(this.ItemInfo);
      }
    },
    //提交评论
    submit() {
      if (!this.discussMsg && !this.imgFileJson) return;
      console.log('dsd',this.itemInfo);
      // return;
      Indicator.open(this.$t("Indicator.Committing"));
      this.$http
        .post("/api/comment/addcomment", {
          taboutid: this.itemInfo.submitid,
          content: this.discussMsg,
          files: this.imgFileJson
        })
        .then(res => {
          console.log("提交成功", res);
          if (res.data.code == "0") {
            let Data = res.data.data;
            if (Data.lastreplydata && typeof Data.lastreplydata == "string") {
              Data.lastreplydata = JSON.parse(Data.lastreplydata);
            }
            if (Data.files) {
              // arft
              let arr = [];
              arr[0] = JSON.parse(Data.files);
              Data.files = arr;
              for (let v of Data.files) {
                 v.metainfo=JSON.parse(v.metainfo)
                if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
                  v.imgsrc = v.filepath + v.metainfo.snapsuffix;
                } else {
                  v.imgsrc = v.filepath;
                }
              }
              // front  Data.files = JSON.parse(Data.files);
            }
            console.log('aaaaa',Data)
            this.teacherInfo.unshift(Data);
            this.ItemInfo.commentnum++;
            this.noComment = false;
            this.init();
            Indicator.close();
            this.$emit('plMessage','pl');
          } else {
            Indicator.close();
          }
        })
        .catch(() => {
          Indicator.close();
          console.log("提交失败");
          this.init();
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
      let subData = {};
      let item = this.indexItem;
      console.log('cvcv',item);
      subData.tcommentid = item.tcommentid || item.id;
      // subData.touserid = item.touserid || item.userid;
      // subData.tousername = item.tousername || item.username;


      subData.touserid = item.userid || item.fromuserid;
      subData.tousername = item.username || item.fromusername;

      subData.fromuserid = this.user.id;
      subData.fromusername = this.user.name;


      subData.content = this.textareaMsg;
      subData.files = this.imgFileJson;
      console.log(subData);
      // return;
      Indicator.open(this.$t("Indicator.Committing"));
      this.$http
        .post("/api/comment/addreply", subData)
        .then(res => {
          console.log("提交成功", res);
          if (res.data.code == "0") {
            let Data = res.data.data;
            if (this.imgFileJson) {
              // arft
              let arr = [];
              arr[0] = JSON.parse(this.imgFileJson);
              Data.files = arr;
              for (let v of Data.files) {
                 v.metainfo=JSON.parse(v.metainfo)
                if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
                  v.imgsrc = v.filepath + v.metainfo.snapsuffix;
                } else {
                  v.imgsrc = v.filepath;
                }
              }
              // front  Data.files = JSON.parse(this.imgFileJson);
            }
            this.teacherInfo[this.index].lastreplydata.push(Data);
            this.init();
            Indicator.close();
          } else {
            console.log("提交失败");
            Indicator.close();
          }
        })
        .catch(() => {
          Indicator.close();
          console.log("异常");
        });
    },
    // 查看更多
    learnMoreFn(item, index) {
      item.more = !item.more;
      if (item.more) {
        Indicator.open(this.$t("Indicator.Loading"));
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
                // arft
                let arr = [];
                arr[0] = JSON.parse(item.files);
                item.files = arr;
                for (let v of item.files) {
                   v.metainfo=JSON.parse(v.metainfo)
                  if (v.filepath && v.metainfo && v.metainfo.snapsuffix) {
                    v.imgsrc = v.filepath + v.metainfo.snapsuffix;
                  } else {
                    v.imgsrc = v.filepath;
                  }
                }
                // front  item.files = JSON.parse(item.files);
              }
            }
            this.teacherInfo[index].lastreplydata = Data;
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      } else {
        this.teacherInfo[index].lastreplydata.splice(
          3,
          this.teacherInfo[index].lastreplydata.length
        );
      }
      Indicator.close();
    },
    unloadFn() {
      this.$refs.uploadPic.click();
    },
    uploadChange(e) {
      let that = this;
      let file = e.target.files[0];
      let _filesize = file.size;
      if (_filesize / (1024 * 1024) > 300) {
        MessageBox({
          title: "提示",
          message: `<p>${file.name}</p>
              <p>此文件大小超上限，建议小于300M</p>`,
          showCancelButton: true
        });
        return;
      }
      // this.commentPic.push(file);
      // this.commentPicSrc.push(_URL.createObjectURL(file))
      this.uploadImg(file);
      this.$refs.uploadPic.value = "";
    },
    uploadImg(file) {
      let that = this;
      let formdata = new FormData();
      formdata.append("file", file);
      let url = this.urlinfo.urlupload;
      Indicator.open("上传中...");
      this.$http
        .post(url, formdata)
        .then(res => {
          if (res.data.code == 0) {
            this.imgFileJson = JSON.stringify(res.data.data);
            if (that.index >= "0") {
              this.HFSubmit();
            } else {
              this.submit();
            }
           // console.log("成功", res.data.data);
            Indicator.close();
          } else {
            Indicator.close();
            console.log("失败", res.data.data);
          }
        })
        .catch(() => {
          Indicator.close();
          console.log("catch", res.data.data);
        });
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
    backInit() {
      this.teacherInfo = [];
      this.topid = "";
      this.imgSrc = [];
      this.ItemInfo = {};
      this.indexItem = {};
      this.loading = false;
      this.noComment = false;
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
  font-size: 14px;
  // margin-top: 50px;
  .tit-info {
    .mint-cell-wrapper {
      font-size: 18px;
      padding: 15px 10px;
    }
  }
  .discuss-list-content {
    width: 100%;
    max-height: 70vh;
    overflow-y: scroll;
        padding-bottom: 25px;
    .discuss-number {
      padding: 20px 10px;
      background: #f0f0f0;
    }
    .list-content {
      padding:0 10px;
      .item {
        position: relative;
        // margin-bottom: 5vw;
        border-bottom: 1px solid #cccccc94;
        padding: 10px;
        padding-bottom: 20px;
        img.tit-pic {
          width: 63px;
          position: absolute;
          left: 0;
          top: 10px;
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
          width: calc(100% - 63px);
          .pic-sub {
            width: 131px !important;
            // height: 127px!important;
          }
        }
        .more {
          position: absolute;
          bottom: 3px;
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
    background: #fff;
    .upload-content {
      position: absolute;
      img {
        width: 60px !important;
        height: 60px !important;
        border-radius: 20% !important;
        left: 55px !important;
        top: 0 !important;
        transform: translate(0, -11%) !important;
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
      width: 13%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -20px;
      line-height: 40px;
      font-size: 18px;
      text-align: center;
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
  .imgclass {
    height: 100% !important;
  }
}
.mint-cell-label{
      font-size: 14px!important;
    line-height: 20px;
}
</style>