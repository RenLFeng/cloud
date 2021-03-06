

import commontools from '../../commontools'




const state = {

    curbankes:[]

}



// getters

const getters = {
    getBankeById:(state)=>(id)=>{
        var bks = state.curbankes;
        for(var i=0; i<bks.length; i++){
            if (bks[i].id == id){
                return bks[i];
            }
        }
        return null;
    }
}



// actions

const actions = {

}



// mutations

const mutations = {

    appendBankes(state, bankes){
        commontools.arrayMergeAsIds(state.curbankes, bankes);
        //console.log(state.curbankes);
    }




}



export default {

    namespaced: true,

    state,

    getters,

    actions,

    mutations

}