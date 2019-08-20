<template>
    <div>
        <mt-header title="新增班课">

            <mt-button icon="back"  slot="left" @click="$router.go(-1)">返回</mt-button>

            <mt-button slot="right" @click="onsave" :disabled="savedisable">保存</mt-button>
        </mt-header>

        <div>
            <mt-field label="班课名" placeholder="请输入班课名" v-model="classitem.name"></mt-field>

            <mt-cell title="班课封面" is-link @click.native="onavatarset">
                <img :src="classitem.avatar" class=" avatarimgpart" :onerror="defaultImage">
            </mt-cell>
        </div>

    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox } from 'mint-ui';

    export default {
        name: "BankeNew"
        ,data(){
            return {
                classitem:{
                    name:'',
                    avatar:""
                }
            }
        }
        ,computed:{
            savedisable(){
                if (this.classitem.name.length > 0){
                    return false;
                 }
                 return true;
            }
            ,defaultImage(){
                var srcstr = 'this.src="';
                srcstr += require('../assets/banke-default.png');
                srcstr += '"';
                return srcstr;
            }
        }
        ,methods:{
            onsave(){
                Indicator.open('保存中');
                var url = '/api/api/bankenew';
                this.$http.post(url, this.classitem)
                    .then((res)=>{
                        Indicator.close();
                        Toast(res.data.msg);
                        if (res.data.code == 0){
                            this.classitem.id = res.data.data.id;
                            this.$store.commit('banke/appendBankes', this.classitem);
                            this.$router.go(-1);
                        }
                    })
                    .catch(()=>{
                        Indicator.close();
                        Toast('发生异常');
                    })
            }
            ,onavatarset(){
                Toast('暂未实现');
            }
        }
    }
</script>

<style scoped>

    .avatarimgpart{
        width:55px;
        height:55px;
        border-radius:3px;
    }

</style>