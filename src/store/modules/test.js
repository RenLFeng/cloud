


// initial state

// shape: [{ id, quantity }]


//! cjy: 参考示例： https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/modules/products.js

const state = {

    items: [],

    checkoutStatus: null,


    msg:{
        text:'in test js'
    }

}



// getters

const getters = {

    cartProducts: (state, getters, rootState) => {

        return state.items.map(({ id, quantity }) => {

            //! 这里是访问其他模块。
            const product = rootState.products.all.find(product => product.id === id)

            return {

                title: product.title,

                price: product.price,

                quantity

            }

        })

    },



    cartTotalPrice: (state, getters) => {

        return getters.cartProducts.reduce((total, product) => {

            return total + product.price * product.quantity

        }, 0)

    }

}



// actions

const actions = {

    checkout ({ commit, state }, products) {

        const savedCartItems = [state.items]

        commit('setCheckoutStatus', null)

        // empty cart

        commit('setCartItems', { items: [] })

        //! 异步调用
        // shop.buyProducts(
        //
        //     products,
        //
        //     () => commit('setCheckoutStatus', 'successful'),
        //
        //     () => {
        //
        //         commit('setCheckoutStatus', 'failed')
        //
        //         // rollback to the cart saved before sending the request
        //
        //         commit('setCartItems', { items: savedCartItems })
        //
        //     }
        //
        // )

    },



    addProductToCart ({ state, commit }, product) {

        commit('setCheckoutStatus', null)

        if (product.inventory > 0) {

            const cartItem = state.items.find(item => item.id === product.id)

            if (!cartItem) {

                commit('pushProductToCart', { id: product.id })

            } else {

                commit('incrementItemQuantity', cartItem)

            }

            // remove 1 item from stock

            commit('products/decrementProductInventory', { id: product.id }, { root: true })

        }

    }

}



// mutations

const mutations = {

    pushProductToCart (state, { id }) {

        state.items.push({

            id,

            quantity: 1

        })

    },



    incrementItemQuantity (state, { id }) {

        const cartItem = state.items.find(item => item.id === id)

        cartItem.quantity++

    },



    setCartItems (state, { items }) {

        state.items = items

    },



    setCheckoutStatus (state, status) {

        state.checkoutStatus = status

    },


    setMsg(state,  msg ){
        state.msg = msg
    }



}



export default {

    namespaced: true,

    state,

    getters,

    actions,

    mutations

}