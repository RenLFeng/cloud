<template>
  <div class="group-main">
    <mt-header title="成员分组方案管理">
      <mt-button icon="back" slot="left" @click="$router.go(-1)">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="content">
      <List
        v-for="(v,index) in groupList"
        :key="index"
        :item="v"
        :index="index"
        type="group"
        @click.native="listClick(v,index)"
      />
    </div>
    <div class="button-worp">
      <mt-button class="button-auto-96" @click="addGroup">添加成员小组方案</mt-button>
    </div>
    <mt-popup
      v-model="popuoEdit"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0;"
    >
      <Edit :EditItem="EditItem" @editBack="onEditBack" :allMemBers="allMemBers" />
    </mt-popup>
    <mt-actionsheet :actions="actions" v-model="actionShow"></mt-actionsheet>
  </div>
</template>

<script>
import List from "@/common/list";
import Edit from "./edit";
import { parseURL } from "@/util";
import { Indicator, Toast, MessageBox, Popup, Actionsheet } from "mint-ui";
export default {
  name: "Group",
  components: {
    List,
    Edit
  },
  watch: {
    EditSelect() {
      //   if(this.EditSelect)
    }
  },
  data() {
    return {
      actionShow: false,
      actions: [
        {
          name: "复制",
          method: this.copy
        },
        {
          name: "编辑",
          method: this.editGroup
        },
        {
          name: "删除",
          method: this.deleteGroup
        },
        {
          name: "设置默认分组",
          method: this.defaultFn
        }
      ],

      allMemBers: [],
      groupList: [],
      bankeid: "",
      EditItem: {},
      index: 0,
      popuoEdit: false,
      EditSelect: false,

      subgroupData: []
    };
  },
  computed: {
    isteacher() {
      let isteacher = this.$store.getters.isteacher;
      return isteacher;
    }
  },
  created() {
    const UrlParams = parseURL(window.location.href);
    let params = this.$route.params;
    if (UrlParams.id) {
      this.bankeid = UrlParams.id;
    } else {
      this.bankeid = params.bankeid;
    }
    this.querygroup(this.bankeid);
    this.bankememberquery(this.bankeid);
  },

  methods: {
    //班课成员查询
    bankememberquery() {
      this.$http
        .post("/api/api/bankememberquery", {
          bankeid: this.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            this.allMemBers = res.data.data.members;
            // for (let item of this.allMemBers) {
            //   item.isTrue = false;
            //   item.isAct = false;
            // }
            console.log("allMemBers", this.allMemBers);
          }
        })
        .catch(err => {});
    },
    querygroup(id) {
      this.$http
        .post("/api/group/querygroup", {
          bankeid: id,
          page: 0,
          pagesize: 50
        })
        .then(res => {
          if (res.data.code == "0") {
            this.groupList = res.data.data;
            console.log("groupList", this.groupList);
          }
        })
        .catch(err => {});
    },
    listClick(item, index) {
      this.EditItem = item;
      this.index = index;
      // this.EditSelect = true;
      this.actionShow = true;
    },
    //复制
    copy() {},
    //设置默认
    defaultFn() {
      this.$http
        .post("/api/group/setdefault", {
          id: this.EditItem.id
        })
        .then(res => {
          if (res.data.code == "0") {
            Toast("成功");
            this.querygroup(this.bankeid);
          } else {
            Toast("失败");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    //删除
    deleteGroup() {
      if (!this.isteacher) {
        Toast("你无权限");
        return;
      }
      MessageBox.confirm("您确定要删除吗？")
        .then(res => {
          this.$http
            .post("/api/group/deletegroup", {
              id: this.EditItem.id
            })
            .then(res => {
              if (res.data.code == 0) {
                MessageBox.alert("删除成功").then(() => {
                  this.EditSelect = false;
                  this.querygroup(this.bankeid);
                });
              } else {
                MessageBox.alert(res.data.msg);
                this.EditSelect = false;
              }

              console.log(res);
            })
            .catch(() => {
              this.EditSelect = false;
            });
        })
        .catch(() => {
          this.EditSelect = false;
        });
    },

    //编辑
    editGroup() {
      this.actionShow = false;
      this.popuoEdit = true;
    },

    //新增
    addGroup(type) {
      if (!this.isteacher) {
        Toast("你无权限");
        return;
      }
      Indicator.open("加载中...");
      let obj = {
        name: "大班",
        bankeid: this.EditItem.bankeid
      };
      this.$http
        .post("/api/group/savegroup", obj)
        .then(res => {
          if (res.data.code == "0") {
            Toast("成功");
            console.log(res.data.data);
            this.querygroup(this.bankeid);
          } else {
            Toast("失败");
          }
          Indicator.close();
        })
        .catch(error => {
          Toast("异常");
          Indicator.close();
        });
    },
    onEditBack(v) {
      if (v.type) {
        this.querygroup(this.bankeid);
        this.popuoEdit = v.state;
      } else {
        this.popuoEdit = v.state;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.group-main {
  .content {
    margin-top: 10px;
  }
  .edit-container {
    padding: 15px;
    p {
      padding: 0.26667rem 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20px;
      word-break: break-all;
    }
    ul {
      li {
        width: 33%;
        i {
          font-size: 0.8rem;
          background: #e3e3e3;
          border-radius: 50%;
          padding: 8px;
        }
        span {
          display: block;
          margin-top: 10px;
        }
      }
    }
  }
  .button-worp {
    position: fixed;
    left: 50%;
    bottom: 15px;
    width: 90%;
    transform: translate(-50%, 0);
    .mint-button {
      background: #fff;
      border: 1px solid #0089ff;
      border-radius: 20px;
      color: #0089ff;
    }
  }
}
</style>
