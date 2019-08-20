<template>
    <div v-if="showmsg">
        <p v-if="itemtype == 'fill'">
            <span v-for="(textitem,textindex) in msghtml" v-bind:key="textindex">
                <span v-if="textitem.istext" v-html="textitem.text"></span>
                <span v-else><input v-model="textitem.answer" class="fillanswer"></input></span>
            </span>
        </p>
    <p v-else-if="showmsg" v-html="msghtml"></p>
    <div v-if="itemtype == 'sel'">
        <div v-for="(selitem,selindex) in msg.sel" v-bind:key="selindex">
            <el-radio v-model="msg.answer" :label="selindex"><span v-html="selitem"></span></el-radio>
        </div>
    </div>
        <div v-else-if="itemtype == 'fill'">

        </div>

    </div>


</template>

<script>



    export default {
        name: "ExamItem.vue",
        props:{
            msg:{},
            radio:"1"
        },

        computed:{
            showmsg:function(){
                //return false;
                if (typeof this.msg == 'undefined'){
                    return false;
                }
                if (typeof this.msg.text != 'undefined'){
                    return true;
                }
                return false;
            },
            itemtype:function(){
                if (this.showmsg){
                    if (typeof this.msg.sel != 'undefined'){
                        return 'sel';
                    }
                    if (typeof this.msg.type != 'undefined'){
                        return this.msg.type;
                    }
                }
                return 'unkown';
            }
            ,msghtml:function(){
                if (this.itemtype == 'fill' ){

                    if (typeof this.msg.fillarray != 'undefined'){

                        return this.msg.fillarray;
                    }

                    var text = this.msg.text;

                    var lastfindex = 0;
                    var curfindex = 0;
                    var textarray = new Array();
                    this.msg.answer = new Array();
                    var aindex = 0;
                    var othis = this;
                    while(1){
                        curfindex = text.indexOf('{{__}}', lastfindex);
                        if (curfindex >= 0){
                            if (curfindex > lastfindex){
                                textarray.push({
                                    text:text.substr(lastfindex, curfindex-lastfindex),
                                    istext:true
                                });
                            }
                            lastfindex = curfindex + 6;
                            othis.msg.answer.push("");
                            textarray.push({
                                istext:false,
                                answer:othis.msg.answer[aindex]
                            });
                            aindex++;
                        }
                        else{
                            break;
                        }
                    }
                    if (curfindex < 0){
                        curfindex = text.length ;
                        if (curfindex > lastfindex){
                            textarray.push({
                                istext:true,
                                text:text.substr(lastfindex, curfindex-lastfindex)
                            });
                        }
                    }
                    this.msg.fillarray = textarray;
                    console.log(this.msg.fillarray);
                    return this.msg.fillarray;


                    // var fillindex = 0;
                    // var othis = this;
                    // text = text.replace(/\{\{__\}\}/g, function(){
                    //     var replacetext = '';
                    //     console.log(othis.msg);
                    //     othis.msg['answer'+fillindex] = '';
                    //     replacetext += '<input auto-complete="false" style="width:50px;" v-model="msg.answer' + fillindex + '"></input>';
                    //     fillindex++;
                    //     return replacetext;
                    // });
                    // console.log(text);
                    //return text;
                }

                return this.msg.text;
            }
        },
        methods:{

        }
    }

</script>

<style scoped>

    .fillanswer{
        color:darkgreen;
        font-weight:bold;
        width:50px;
        padding:0px;
        font-size:inherit;
    }

</style>