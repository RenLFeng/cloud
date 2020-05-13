import commontools from '../../commontools'




const state = {

    curbankes: [],
    curcourses: [],

}



// getters

const getters = {
    getBankeById: (state) => (id) => {
        var bks = state.curbankes;
        for (var i = 0; i < bks.length; i++) {
            if (bks[i].id == id) {
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

    appendBankes(state, bankes) {
        commontools.arrayMergeAsIds(state.curbankes, bankes);
        //console.log(state.curbankes);
    },

    setBankes(state, bankes) {
        state.curbankes = bankes;
    },

    REMOV_BANKES(state, v) {
        state.curbankes = v;
    },

    setCourse(state, course) {
        state.curcourses = course;
    },




}



export default {

    namespaced: true,

    state,

    getters,

    actions,

    mutations

}