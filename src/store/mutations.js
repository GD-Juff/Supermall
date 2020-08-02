import {ADD_COUNTER,ADD_TO_CART} from "./mutations-types";

export default {
  // addCart(state, payload) {
  //   let oldProduct = null
  //   for (let item in state.cartList) {
  //     if (item.iid === payload.iid) {
  //       oldProduct = item
  //     }
  //   }
  //   if (oldProduct) {
  //     oldProduct.count+=1
  //   }else {
  //     payload.count = 1
  //     state.cartList.push(payload)
  //   }
  // }
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked=true
    state.cartList.push(payload)
  }
}
