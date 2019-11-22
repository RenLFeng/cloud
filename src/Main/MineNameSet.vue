<template>
    <div>

        <mt-header :title="$t('personal.Nickname')">

            <mt-button icon="back" @click="$router.go(-1)" slot="left">{{$t('common.Back')}}</mt-button>

            <mt-button slot="right" :disabled="savedisable" @click="dosave">{{$t('common.Keep')}}</mt-button>
        </mt-header>

        <div class="textline tc">
            <input v-model="myname" :placeholder="$t('personal.Nickname_entry')" autocomplete="off" class="textinput fontnormal">
            <div class="tl" style="margin-top:5px;">{{$t('personal.Nickname_tips')}}</div>
        </div>
    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox } from 'mint-ui';
    import commontools from '../commontools'

    export default {
        name: "MineNameSet",
        data(){
            return {
                myname:this.getUserName()
            }
        }
        ,computed:{
            savedisable(){
                var oname = this.getUserName();
                if (oname == this.myname){
                    return true;
                }
                if (!this.myname){
                    return true;
                }
                return false;
            }
        }
        ,methods:{
            getUserName:function(){
                var us = this.$store.getters.curuser;
                if (us && us.name){
                    return us.name;
                }
                return '';
            }
            ,dosave(){
                var url = '/api/api/userUpdateInfo';
                Indicator.open(this.$t('Indicator.Saving'));
                this.$http.post(url,{
                    name:this.myname
                })
                    .then((res)=>{
                        Indicator.close();
                        Toast(res.data.msg);
                        if (res.data.code == 0){
                            //! success
                            var us = this.$store.getters.curuser;
                            if (us){
                                var usclone = commontools.clone(us);
                                usclone.name = this.myname;
                                this.$store.commit('setLoginUser', usclone);
                                this.$router.go(-1);
                            }
                        }
                    })
                    .catch(()=>{
                        Indicator.close();
                    });
            }
        }
        ,created(){

        }


    }
</script>

<style scoped>

    .textline{


        margin:20px;
    }

    .textinput{
        border:none;
        border-bottom:1px solid #d3d3d3;

        width:100%;


    }

</style>