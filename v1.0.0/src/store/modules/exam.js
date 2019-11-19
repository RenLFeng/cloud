

import commontools from '../../commontools'


// initial state

// shape: [{ id, quantity }]


//! cjy: 参考示例： https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/modules/products.js


//! 设计原则：  一般 set时caller不clone；  取得用于编辑时caller执行clone

const state = {

    editingExamPaper:null,  //! 正在编辑中的试卷
    cachedExamPapers:null,

    lastFinishExamItem:null,   //! 最后编辑完成的题目

    previewExamItem:null,

}



// getters

const getters = {

}



// actions

const actions = {

}



// mutations

const mutations = {


    setLastFinishExamItem(state, eitem){
        state.lastFinishExamItem = eitem;
    },

    setPreviewExamItem(state, item){
        state.previewExamItem = item;
    },

    setEditingExamPaper(state,  paper ){
        state.editingExamPaper = paper;
    },

    saveExamPaper(state, paper){
        //! cjy: 使用clone方式，避免影响原来的编辑
        if (state.cachedExamPapers && paper.id){
            var i=0;
            var papers = state.cachedExamPapers;
            for(i=0; i<papers.length; i++){
                if (papers[i].id == paper.id){
                    papers[i] = commontools.clone(paper);
                    return;
                }
            }
            //! 新id； 添加到最前
            state.cachedExamPapers.splice(0, 0, commontools.clone(paper));
        }
    },
    saveCacheExamPapers(state, papers){
        state.cachedExamPapers = papers;
    },

    clearCacheForNewExamPaper(state){
        state.lastFinishExamItem = null;
        state.editingExamPaper = null;
    }

}



export default {

    namespaced: true,

    state,

    getters,

    actions,

    mutations

}