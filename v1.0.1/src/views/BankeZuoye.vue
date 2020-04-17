<template>
  <div>
    <div class="controlpart tc">
      <div
        class="controlbtn"
        v-for="(bitem, sindex) in $t(btnlist)"
        :key="sindex"
        :class="{controlbtnactive:curbtnindex==sindex, 'controlbtnthree':!hasedit,isEn:isEN=='en'}"
        @click="onbtnclick(sindex)"
      >{{bitem.name}}</div>
    </div>

    <div class="zy-list-box">
      <mt-loadmore
        :top-method="loadTop"
        :top-distance="120"
        @top-status-change="handleTopChange"
        ref="loadmore"
        class="zyloadmore"
        :bottom-method="loadBottom"
        @bottom-status-change="handleBottomChange"
        :bottom-all-loaded="allLoaded"
        :auto-fill="autofill"
        :distanceIndex="3"
      >
        <div v-for="(zitem, sindex) in zuoyelist" :key="sindex" class="zuoye">
          <BankeZuoyeSimple
            :zuoyeitem="zuoyelist[sindex]"
            :hasedit="hasedit"
            v-if="showitem(zitem)"
            @editclick="onitemedit"
            @normalclick="onnormalclick"
          ></BankeZuoyeSimple>
        </div>

        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'">{{$t('common.Drop_down_refresh')}}</span>
          <span v-show="topStatus === 'loading'">{{$t('common.Loading')}}</span>
        </div>

        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus === 'drop'">{{$t('common.Pull_up_Load')}}</span>
          <span v-show="bottomStatus === 'loading'">{{$t('common.Loading')}}</span>
        </div>

        <div v-if="zuoyelist.length==0" class="tc">{{$t('bankeTask.No_task')}}</div>
      </mt-loadmore>
    </div>

    <mt-actionsheet :actions="editmenudata" v-model="editmenuvisible" class="sheetdialog"></mt-actionsheet>
  </div>
</template>

 <script>
import BankeZuoyeSimple from "./components/BankeZuoyeSimple";

import { Indicator, Toast, MessageBox } from "mint-ui";

import commontools from "../commontools";
import { CollectionFn, getZYFileType } from "@/util";

import nativecode from "@/nativecode";

export default {
  name: "BankeZuoye",
  props: {
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  computed: {
    isEN() {
      return this.$store.state.lang;
    },
    editmenudata() {
      var odatas = [];
      console.log(this.curzuoye);
      if (this.curzuoye) {
        if (nativecode.hassharecommon() && this.curzuoye.state > 0) {
          odatas.push({
            name: "分享作业",
            method: this.sharezuoye
          });
        }

        if (this.curzuoye.state == 100) {
          //!
          odatas.push({
            name: this.$t("common.End"),
            method: this.menustop
          });
        } else if (this.curzuoye.state == 10) {
          odatas.push({
            name: this.$t("common.Delete"),
            method: this.menudel
          });
        } else {
          odatas.push({
            name: this.$t("common.Strat"),
            method: this.menustart
          });
          odatas.push({
            name: this.$t("common.Edit"),
            method: this.menuedit
          });
          odatas.push({
            name: this.$t("common.Delete"),
            method: this.menudel
          });
        }
        if (this.curzuoye.state > 0) {
          //! 开始后才允许收藏
          odatas.push({
            name: "收藏",
            method: this.Collection
          });
        }
      }
      return odatas;
    }
  },
  created() {
    //   console.log('国际化',this.$i18n.messages)
  },

  methods: {
    Collection() {
      // console.log(this.curzuoye)
      let imgIcon = "zuoye";
      let title = this.curzuoye.name;
      let cobj = {};
      CollectionFn(
        cobj,
        3,
        imgIcon,
        this.curzuoye.id,
        this.curzuoye.ownerid,
        title
      );
    },
    onbtnclick(sindex) {
      this.curbtnindex = sindex;
    },

    menustop() {
      this.domenuopt(10);
    },
    sharezuoye() {
      if (this.curzuoye) {
        nativecode.dosharecommon("zuoye", this.curzuoye.id, this.curzuoye.name);
      }
    },
    menudel() {
      MessageBox.confirm("您确定要删除吗？").then(res => {
        this.$http
          .post("/api/azuoye/delete", { id: this.curzuoye.id })
          .then(res => {
            console.log(res);
            if (res.data.code == 0) {
              for (let i = 0; i < this.zuoyelist.length; i++) {
                if (this.curzuoye.id == this.zuoyelist[i].id) {
                  this.zuoyelist.splice(i, 1);
                  return;
                }
              }
              MessageBox.alert("删除成功").then(() => {});
            } else {
              MessageBox.alert("失败");
            }
          })
          .catch(() => {});
      });
    },
    menustart() {
      this.domenuopt(100);
    },
    menuedit() {
      if (this.curzuoye) {
        this.$store.commit("setBankeData", {
          modulename: "zuoyelist",
          bankeid: this.bankeid,
          fn: fobj => {
            fobj.editingZuoye = this.curzuoye;
          }
        });
        this.$store.commit("setRouterForward", true);
        this.$router.push("/zuoyenew/" + this.bankeid);
      }
    },
    menuresult() {
      if (this.curzuoye) {
        //! 先加载，再跳转，避免次级界面跳跃
        var zuoyeid = this.curzuoye.id;
        var url = "/api/api/zuoyeresultquery?zuoyeid=" + zuoyeid;
        Indicator.open(this.$t("Indicator.Loading"));
        this.$http
          .post(url)
          .then(res => {
            Indicator.close();
            if (res.data.code == 0) {
              this.$store.commit("setBankeData", {
                modulename: "zuoyeresult",
                bankeid: zuoyeid,
                fn: fobj => {
                  fobj.resultdata = res.data.data;
                }
              });
              this.toResultView();
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(() => {
            Indicator.close();
            Toast("异常");
          });
      }
    },
    toResultView() {
      this.$store.commit("setRouterForward", true);
      this.$router.push("/zuoyeresult/" + this.curzuoye.id);
    },
    onnormalclick(zitem) {
      this.curzuoye = zitem;
      if (!this.curzuoye.state) {
        this.menuedit();
      } else {
        this.menuresult();
      }
    },
    domenuopt(nstateto) {
      if (this.curzuoye) {
        console.log(this.curzuoye);

        let doopt = () => {
          Indicator.open(this.$t("Indicator.Processing"));
          this.$http
            .post("/api/api/bankezuoyesetstate", {
              zuoyeid: this.curzuoye.id,
              state: nstateto
            })
            .then(res => {
              Indicator.close();
              if (res.data.code == 0) {
                for (let item of this.zuoyelist) {
                  if (item.id == this.curzuoye.id) {
                    item.state = nstateto;
                    return;
                  }
                }
                // commontools.arrayMergeAsIds(this.zuoyelist, res.data.data);
              } else {
                Toast(res.data.msg);
              }
            })
            .catch(() => {
              Indicator.close();
            });
        };

        if (nstateto == 10) {
          MessageBox.confirm("结束作业？\r\n结束后学生不可再提交").then(() => {
            doopt();
          });
        } else {
          doopt();
        }

        //!
        //this.curzuoye.state = nstateto;
      }
    },
    onitemedit(zitem) {
      this.curzuoye = zitem;
      this.editmenuvisible = true;
    },
    showitem(zitem) {
      var useindex = this.curbtnindex;
      if (!this.$store.getters.caneditbanke) {
        //! 学生
        if (useindex > 0) {
          useindex += 1;
        }
      }
      if (useindex == 0) {
        return true;
      }
      if (useindex == 1) {
        //! 未开始
        if (zitem.state == 0) {
          return true;
        }
      }
      if (useindex == 2) {
        //! 进行中
        if (zitem.state == 100) {
          return true;
        }
      }
      if (useindex == 3) {
        //! 已结束
        if (zitem.state == 10) {
          return true;
        }
      }
      return false;
    },
    loadTop() {
      this.allLoaded = false;
      this.doQueryZuoye(true);
    },
    loadBottom() {
      this.doQueryZuoye(false);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
      console.log(status);
    },
    doQueryZuoye(ball) {
      var url = "/api/api/bankezuoyequery?bankeid=" + this.bankeid;
      if (!ball) {
        if (this.zuoyelist.length) {
          var lasti = this.zuoyelist[this.zuoyelist.length - 1];
          url += "&topzuoyeid=" + lasti.id;
        }
      }
      this.$http
        .post(url)
        .then(res => {
          if (ball) {
            this.$refs.loadmore.onTopLoaded();
          } else {
            this.$refs.loadmore.onBottomLoaded();
          }
          if (res.data.code == 0) {
            if (!res.data.data.length) {
              this.allLoaded = true;
            }
            let zlist = res.data.data;
            for (let v of zlist) {
              v.eventmsgs = false; //! 预创建member
            }
            if (ball) {
              //! clear cur all
              // this.zuoyelist = [];  //! cjy: 这里清空会导致vue界面闪烁（呈现为无item的界面）
              //! 这里需要清空， 否则遗留上个班课或上个账户的作业
              //  this.zuoyelist = zlist;
            } else {
              //    commontools.arrayMergeAsIds(this.zuoyelist, zlist);
            }

            let ids = [];
            for (let v of res.data.data) {
              ids.push(v.id);
            }
            this.eventmsgsOnactivity(res.data.data, ids, ball);
          }
        })
        .catch(() => {});
    },
    appendzlist(serverData, ball) {
      if (ball) {
        this.zuoyelist = serverData;
      } else {
        commontools.arrayMergeAsIds(this.zuoyelist, serverData);
      }
    },
    //红点查询
    eventmsgsOnactivity(serverData, eventids, ball) {
      if (serverData.length == 0) {
        return;
      }
      this.$http
        .post("/api/eventmsgs/onactivity", {
          bankeid: this.bankeid,
          eventtype: 3,
          eventids: [...eventids]
        })
        .then(res => {
          if (res.data.code == "0") {
            for (let v of serverData) {
              for (let id of res.data.data) {
                if (v.id == id) {
                  v.eventmsgs = true;
                }
              }
            }
            console.log("红点查询", res.data.data);
            //  commontools.arrayMergeAsIds(this.zuoyelist, serverData);
          } else {
          }
          this.appendzlist(serverData, ball);
        })
        .catch(err => {
          //  commontools.arrayMergeAsIds(this.zuoyelist, serverData);
          this.appendzlist(serverData, ball);
        });
    }
  },
  data() {
    return {
      btnlist: !this.$store.getters.caneditbanke ? "btnlist" : "btnlist2",
      //   btnlist: (() => {
      //     if (!this.$store.getters.isteacher) {
      //       return [
      //         { name: "全部" },
      //         { name: "进行中" },
      //         { name: "已结束" }
      //       ];
      //     }
      //     return [
      //       { name: "全部" },
      //       { name: "未开始" },
      //       { name: "进行中" },
      //       { name: "已结束" }
      //     ];
      //   })(),
      curbtnindex: 0,
      zuoyelist: [],
      curzuoye: null,
      editmenuvisible: false,
      topStatus: "",
      bottomStatus: "",
      autofill: false,
      hasedit: this.$store.getters.caneditbanke,
      page: 0,
      pagesize: 10,
      allLoaded: false
    };
  },
  created() {
    //   this.doQueryZuoye(true);
    var d = this.$store.getters.getBankeData("zuoyelist", this.bankeid);
    if (d && d.zuoyelist && d.zuoyelist.length) {
      this.zuoyelist = commontools.clone(d.zuoyelist);
    }
    //! 总是去尝试刷新；
    this.doQueryZuoye(true);
  },
  destroyed() {
    this.$store.commit("setBankeData", {
      modulename: "zuoyelist",
      bankeid: this.bankeid,
      fn: zobj => {
        zobj.zuoyelist = this.zuoyelist;
      }
    });
  },
  watch: {
    editmenuvisible() {
      this.$emit("showmenu", this.editmenuvisible);
    }
  },
  components: {
    BankeZuoyeSimple
  }
};
</script>

 <style scoped>
.sheetdialog {
  z-index: 99999;
}

.zyloadmore {
  min-height: 200px;
}

.controlpart {
  margin: 10px 10px;
  border: 1px solid #0089ff;
  border-radius: 15px;

  background-color: white;
}

.controlbtn {
  width: 25%;
  border: none;
  color: #0089ff;
  font-size: 18px;
  height: 40px;
  margin-top: 0px;

  background: rgba(0, 0, 0, 0);

  padding: 10px;

  display: inline-block;

  outline: none;
}
.isEn {
  font-size: 14px !important;
}
.controlbtnthree {
  width: 33.33%;
}

.controlbtnactive {
  background-color: #0089ff;
  color: white;

  border-radius: 13px;
}
.mint-actionsheet {
  bottom: 68px;
}
.zy-list-box {
  height: 71vh;
  overflow: auto;
}
</style>