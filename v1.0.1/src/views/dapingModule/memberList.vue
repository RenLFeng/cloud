<template>
  <div class="biggp-memberlist-wrap">
    <div class="main">
      <div class="lists-wrap">
        <ul ref="cul">
          <li
            class="item"
            v-for="(v,sindex) in members"
            :key="sindex"
            ref="cli"
            @click.stop="changeState($event,v,sindex)"
          >
            <img :class="!v.state?'opctive':''" :src="v.avatar" alt :onerror="$defaultImg('img')" />
            <span class="name" :class="!v.state?'opctive':''">{{v.name}}</span>
          </li>
        </ul>
        <!-- <ul v-for="(item,index) in members" :key="index" :class="group?'group':''">
          <li class="item group-item" v-if="group" :class="index==1?'act':''">
            <span class="group-name">{{index+1}}组</span>
            <span class="date">9/19</span>
          </li>
          <li
            class="item"
            v-for="(v,sindex) in item"
            :key="sindex"
            @click="selectGroup($event,item,index,v,sindex)"
          >
            <img :class="sindex>12?'opctive':''" :src="v.avatar" alt :onerror="$defaultImg('img')" />
            <span class="name">{{sindex}}{{v.name}}</span>
          </li>
        </ul>-->
      </div>
    </div>
    <div class="change-state-wrap" ref="setsign" v-if="showChangeState">
      <p class="title tc">设置&nbsp;{{curName}}&nbsp;的签到状态</p>
      <div class="btn-wrap">
        <span
          class
          :class="{'act':item.act,'isclick':item.isclick}"
          v-for="(item,index) in signTemp"
          :key="index"
          @click.stop="setSignState(item,index)"
        >{{item.text}}</span>
      </div>
      <i class="iconfont iconshanchu2 eicotrigger" @click.stop="hidewrap"></i>
    </div>
    <!-- <div class="popver-wrap" ref="popver" v-if="isShowPopver" @click="isShowPopver=false">
      <p class="tit">请选择分组</p>
      <ul class="group-list">
        <li
          class="num-item"
          :class="i==actindex?'act':''"
          v-for="(v,i) in members"
          :key="i"
          @click.stop="moveMember(v,i)"
        >{{i+1}}组</li>
      </ul>
      <i class="iconfont iconsanjiaoxing"></i>
    </div>-->
    <div class="mark" v-if="showChangeState" @click="hidewrap"></div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Switch } from "mint-ui";
export default {
  props: {
    members: {
      default() {
        return [];
      }
    },
    group: {
      default: true
    },
    isOpenSign: {
      default: false
    },
    signid: {
      default: 0
    },
  },
  data() {
    return {
      isShowPopver: false,
      actindex: 0,
      showChangeState: false,
      signTemp: [
        {
          id: 1,
          text: "已签到",
          act: false,
          isclick: false
        },
        // {
        //   id: 2,
        //   text: "迟到",
        //   act: false
        // },
        {
          id: 0,
          text: "未签到",
          act: false,
          isclick: false
        }
      ],
      curName: ""
    };
  },
  computed: {
  },
  created() {},
  mounted() {},
  watch: {
  },
  methods: {
    changeState(e, item, i) {
      if (!this.isOpenSign) return;
      this.editItem = item;
      let ev = e || e.window.event;
      let cul = this.$refs.cul;
      let eli = this.$refs.cli[i];

      let culoffsetLeft = cul.offsetLeft;
      let lioffsetLeft = eli.offsetLeft;
      if (culoffsetLeft != lioffsetLeft) {
        lioffsetLeft = lioffsetLeft - 150;
      }
      this.curName = item.name;
      this.showChangeState = true;
      for (let v of this.signTemp) {
        v.isclick = false;
        if (v.id == this.editItem.state) {
          v.isclick = true;
        }
      }

      this.$nextTick(() => {
        this.$refs.setsign.style.left = `${lioffsetLeft}px`;
        this.$refs.setsign.style.top = `${eli.offsetTop + 160}px`;
      });
      this.$emit("showChangeState", true);
    },
    setSignState(v, index) {
      // console.log('mgk',this.editItem);
      if (v.isclick) return;
      for (let v of this.signTemp) {
        v.act = false;
      }
      v.act = true;
      this.studentChangestate(v.id);
    },
    studentChangestate(state) {
      this.$http
        .post("/api/sign/changestate", {
          userid: this.editItem.userid,
          signid: this.signid,
          state: state
        })
        .then(res => {
          if (res.data.code == 0) {
            Toast("设置成功");
            this.hidewrap();
            this.$emit("setSign", { id: this.editItem.id, state: state });
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(e => {
          Toast("操作失败");
          this.hidewrap();
        });
    },
    hidewrap() {
      this.showChangeState = false;
      for (let v of this.signTemp) {
        v.act = false;
      }
      this.$emit("showChangeState", false);
    },
    selectGroup(e, item, index, sitem, sindex) {
      if (!this.group) return;
      this.actindex = index;
      this.isShowPopver = true;
      let ev = e || e.window.event;

      let clientX = ev.clientX;
      let clientY = ev.clientY;

      let offsetX = ev.offsetX;
      let offsetY = ev.offsetY;
      this.$nextTick(() => {
        this.$refs.popver.style.left = `${clientX - 245 + (44 - offsetX)}px`;
        this.$refs.popver.style.top = `${clientY - 135 - offsetY}px`;
      });

      console.log(ev);
    },
    moveMember(member, i) {
      alert(i);
    }
  },
  components: {
    [Switch.name]: Switch
  }
};
</script>

<style scoped lang="less">
.biggp-memberlist-wrap {
  .main {
    .lists-wrap {
      > ul {
        display: flex;
        flex-wrap: wrap;
        &.group {
          border: 2px solid rgba(236, 236, 236, 1);
          padding-right: 20px;
          margin-bottom: 20px;
          border-radius: 10px;
          position: relative;
          padding-left: 100px;
        }
        .item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 22px;
          color: #313131;
          // margin-bottom: 20px;
          margin-right: 56px;
          padding: 20px 0;
          img {
            width: 88px;
            height: 90px;
            border-radius: 50%;
            &.opctive {
              opacity: 0.4;
            }
          }
          .name {
            margin-top: 10px;
            &.opctive {
              opacity: 0.4;
            }
          }
        }
        .group-item {
          background: #ececec;
          justify-content: space-evenly;
          font-size: 24px;
          padding-left: 15px;
          padding-right: 15px;
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          margin-right: 43px;
          .group-name {
            color: #0089ff;
          }
          .date {
            color: #535353;
          }
          &.act {
            background: #0089ff;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            .group-name {
              color: #fff;
            }
            .date {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .popver-wrap {
    position: fixed;
    display: flex;
    width: 490px;
    height: 115px;
    left: 0;
    top: 0;
    z-index: 13;
    // transform: translate(-50%, -50%);
    color: #7a7a7a;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    border: 1px solid rgba(236, 236, 236, 1);
    box-shadow: 0px 3px 6px rgba(0, 31, 57, 0.65);
    align-items: flex-end;
    justify-content: space-evenly;
    .tit {
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .group-list {
      display: flex;
      justify-content: space-evenly;
      .num-item {
        width: 38px;
        height: 38px;
        font-weight: 400;
        &.act {
          color: #0089ff;
          font-weight: bold;
        }
      }
    }
    .iconfont {
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #fff;
      font-size: 20px;
    }
  }
  .change-state-wrap {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    width: 396px;
    height: 160px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(195, 195, 195, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 10px;
    z-index: 9999999;
    flex-direction: column;
    .title {
      padding: 20px;
      background: #ececec;
      color: #000;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-size: 26px;
      margin: 0;
      text-align: center;
    }
    .btn-wrap {
      padding: 15px;
      text-align: center;
      span {
        width: 30%;
        height: 57px;
        background: #ffffff;
        border: 1px solid #0089ff;
        opacity: 1;
        border-radius: 10px;
        color: #0089ff;
        font-size: 24px;
        display: inline-block;
        line-height: 57px;
        margin: 0 5%;
        &.act {
          color: #fff;
          background: #0089ff;
        }
        &.isclick {
          color: #999;
          border: 1px solid #999;
          opacity: 0.5;
        }
      }
    }
    .iconfont {
      right: 3px;
      top: 2px;
      color: #999;
      font-size: 23px;
    }
  }
  .mark{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 99;
  }
}
</style>
