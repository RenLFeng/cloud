<template>
  <div class="biggp-memberlist-wrap">
    <div class="main">
      <div class="lists-wrap">
        <ul>
          <li
            class="item"
            v-for="(v,sindex) in members"
            :key="sindex"
            @click="selectGroup($event,item,index,v,sindex)"
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
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    members: {
      default() {
        return [];
      }
    },
    group: {
      default: true
    }
  },
  data() {
    return {
      isShowPopver: false,
      actindex: 0
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
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
  components: {}
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
}
</style>
