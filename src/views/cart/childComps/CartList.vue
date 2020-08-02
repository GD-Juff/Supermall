<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <!--    <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>-->
      <!--      <li v-for="item in cartList">{{item}}</li>-->

      <cart-list-item v-for="(item,index) in cartList"
                      :key='index'
                      :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  import {mapGetters} from 'vuex'

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>

  .cart-list {
    position: absolute;
    height: calc(100% - 133px);
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
