<template>
    <div>
        <div v-if="showmsg">
            <div class="textbody fontnormal">
                {{examitem.text}}
            </div>
            <div v-if="itemtype == 'sel'">
                <examitemsellist :examitem="examitem"></examitemsellist>
            </div>
        </div>
    </div>
</template>

<script>
    import examtools from '../../examtools'
    import examitemsellist from './examitemsellist'
    export default {
        name: "examitemfull"
        ,props:{
            examitem:Object
        }
        ,components:{
            examitemsellist
        }
        ,computed:{
            showmsg:function(){
                if (this.examitem && this.examitem.text){
                    return true;
                }
                return false;
            }
            ,itemtype:function(){
                return examtools.getItemType(this.examitem);
            }
        }

    }
</script>

<style scoped>

    .textbody{
        margin:10px;
    }

</style>