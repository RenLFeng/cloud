<template>
    <div>

        <mt-header :title="$t('personal.Personal_information')">

            <mt-button icon="back" @click="$router.go(-1)" slot="left">{{$t('common.Back')}}</mt-button>
        </mt-header>

        <mt-cell :title="$t('personal.Head_portrait')" is-link @click.native="onavatarset">
            <img :src="user.avatar" class="avatar avatarimgpart">
        </mt-cell>

        <mt-cell :title="$t('personal.Nickname')" is-link @click.native="onnameset">
            <span>{{user.name}}</span>
        </mt-cell>

        <mt-cell :title="$t('personal.Account')" >
            <span>{{user.account}}</span>
        </mt-cell>

        <mt-cell :title="$t('personal.Role')">
            <span>{{userrole}}</span>
        </mt-cell>


        <mt-popup v-model="popupVisible3" position="right" class="mint-popup-3" :modal="false">
            <mt-header :title="$t('personal.Edit_head')">

                <mt-button icon="back" slot="left" @click="popupVisible3 = false">{{$t('common.Back')}}</mt-button>

                <!--<mt-button slot="right" @click="avatarsave">使用</mt-button>  -->
            </mt-header>

            <div class="cropComp">
                <mimgcrop
                    v-model="imgobj"
                    class="cropComp"
                    ref="mimgcrop"

                    @cancel="popupVisible3 = false"
                    @submit="onimgsubmit"
                >

                </mimgcrop>
            </div>

        </mt-popup>



            <input ref="mineavatarupload" type="file" name="file" class="upload__input" @change="uploadChange" accept="image/*" style="display:none">
    </div>
</template>

<script>

    import {Indicator, Toast,MessageBox } from 'mint-ui';

    // import Vue from 'vue'
    // import cropImageMobile from 'vue-crop-image-mobile'
    // Vue.use(cropImageMobile)
    // <crop-image-mobile
    // :imageFile="file"
    // :layerZIndex="20170424"
    // :layerOpacity=".1"
    // layerColor="#000"
    // :autoCompress="false"
    // :quality="0.7"
    // ref="cropImageMobile" />

    import mimgcrop from '../common/m-image-crop'

    import commontools from '../commontools'
    import maintools from './maintools'


    export default {
        name: "MineInfo"
        ,data(){
            return {
                file:'',
                popupVisible3:false,
                imageCorpUrl:'',
                imgobj:{},
                imgcropconfig:{
                    size:100,  //! 这里size为限制原始图片size
                    isSlice:true,
                    path:null,
                }
            }
        }
        ,computed:{
            user(){
                return this.$store.getters.curuser;
            },
            userrole(){
                var u = this.user;
                return maintools.userroledesc(u.role);
            }
        }
        ,components:{
            mimgcrop
        }
        ,methods:{
            onnameset(){
                this.$store.commit('setRouterForward', true);
                this.$router.push('/minenameset');
            }
            ,avatarsave(){
                this.$refs.cropImageMobile.cropImage(this.imgcropcb
                );
            }
            ,onimgsubmit(){
                this.popupVisible3 = false;
                console.log(this.imgobj);
                this.uploadimagedata(this.imgobj.base64);
            }
            ,uploadimagedata(base64str){
                var url = '/api/api/userUpdateAvatar';
                Indicator.open(this.$t('Indicator.Uploading'));
                this.$http.post(url,
                    {
                        jpeg:base64str
                    }).then((res)=>{
                    Indicator.close();
                    if (res.data.msg){
                        Toast(res.data.msg);
                    }
                    if (res.data.code == 0){
                        //! 保存信息
                        var url = res.data.data.filepath;
                       // var uc = this.curuser;
                     //   uc = commontools.clone(uc);
                       // uc.avatar = url;
                      //  uc.name = 'ttt';
                        this.$store.commit('setUserAvatar', url);
                      //  console.log('commit set ok!');
                    }
                }).catch((res)=>{
                    Indicator.close();
                    console.log(res);
                });
            }
            ,imgcropcb(res1, res2){
                console.log('imgcropcb');
                console.log(res1);
                console.log(res2);

                 var reader = new FileReader()
                reader.onload = (data) => {
                let res = data.target || data.srcElement   //! base64 encode file data .
                    console.log(res);
                }
                 reader.readAsDataURL(res2);

            }
            ,onavatarset(){

              //  if (typeof FileReader == 'undefined')
                {
                   // Toast('您的环境不支持设置头像');
                  //  return;
                }


               // this.popupVisible3 = true;
                this.$refs.mineavatarupload.value = "";
                this.imgobj = {};
               this.$refs.mineavatarupload.click();

                //this.$store.commit('setRouterForward', true);
                //this.$router.push('/mineavatarset');
            }
            ,uploadChange(event){
                console.log('avatar updatechange');
                console.log(event);



                if (event.target.files.length > 0){
                    var file = event.target.files[0];

                  //  this.file = file;
                    console.log(file);

                    this.$refs.mimgcrop.loadfile(file);

                    this.popupVisible3 = true;

                    //! cjy: objecturl 需要主动释放
                   // var fileurl = window.createObjectURL(file);
                  //  console.log(fileurl);

                    // var reader = new FileReader()
                    // reader.onload = (data) => {
                    //     let res = data.target || data.srcElement   //! base64 encode file data .
                    //     console.log(res);
                    // }
                    // reader.readAsDataURL(file);
                }
            }
        }
    }
</script>

<style scoped>




    .mint-popup-3{
        width:100%;
        height:100%;
        background-color:#000;
    }

    .cropComp{
        position:absolute;
        top:40px;
        left:0px;
        right:0;
        bottom:0;
    }



    .avatarimgpart{
        width:60px;
        height:60px;

        margin:5px;
    }

</style>