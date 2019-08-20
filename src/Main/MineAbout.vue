<template>
    <div>

        <div class="avatarpart" @click="onmine">
            <img :src="user.avatar" :onerror="defaultImage" class="avatarimgpart avatar">
            <div
            class="avatartextpart"
            >
                <div class="fontlarge namepart">{{user.name}}</div>
                <div class="fontsmall accountpart">账户:{{user.account}}
                    <i class="my-cell-allow-right"></i>
                </div>
            </div>
        </div>




        <div class="devide">
        </div>

        <mt-cell title="退出账户" is-link @click.native="onlogout">
        </mt-cell>

        <div class="devide"></div>
        <mt-cell title="设置" is-link @click.native="onset"></mt-cell>
        <mt-cell title="关于" is-link @click.native="onabout"></mt-cell>

    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox } from 'mint-ui';


    export default {
        name: "MineAbout"
        ,computed:{
            user(){
                return this.$store.getters.curuser;
            }
            ,defaultImage(){
                var srcstr = 'this.src="';
                srcstr += require('../assets/avatar-default.png');
                srcstr += '"';
                return srcstr;
            }
        }
        ,methods:{
            onlogout:function(){
                MessageBox.confirm('退出当前账户？').then(()=>{
                    this.dologout();
                });
            }
            ,dologout:function(){
                var url = '/api/api/logout';
                this.$http.post(url).then(()=>{
                    //! 清空本地账户信息
                    this.$store.commit('setLoginUser', {});
                    this.$store.commit('setRouterForward', true);
                    this.$router.push('/login');
                })
            }
            ,onset:function(){
               Toast('暂未实现');

            }
            ,onabout:function(){
                Toast('暂未实现');
            }
            ,onmine:function(){
                this.$store.commit('setRouterForward', true);
                this.$router.push('/mineinfo');
            }
        }
    }
</script>

<style scoped>

    .my-cell-allow-right::after {
        border: solid 2px #c8c8cd;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top:auto;
        right: 20px;
        position: absolute;
        width: 5px;
        height: 5px;

        margin-top:3px;

        transform: translateY(50%) rotate(45deg);
    }

    .avatarimgpart{
        width:60px;
        height:60px;
        float:left;
    }

    .accountpart{
        color:#c8c8cd;
        margin-top:5px;
    }
    .namepart{
        margin-top:10px;
    }

    .avatartextpart{
        margin-left:70px;
    }

    .avatarpart{
        height:80px;
        padding:10px;
        margin-top:10px;

    }




</style>