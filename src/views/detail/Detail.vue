<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--属性：topImages 传入值：top-images-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from "../../components/content/goods/GoodsList";
  // import Toast from "../../components/common/toast/Toast";

  import {getDetail, Goods, Shop, GoodsParam} from "network/detail";
  import {getRecommend} from "../../network/detail";
  import {itemListenerMixin, backTopMixin} from "../../common/mixin";
  import {debounce} from "../../common/utils";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      Scroll,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getthemeTopYs: null,
        isShowBackTop: false,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //  6.读取评论的信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }


        //比update更好的做法,但是图片加载还没有完成
        // this.$nextTick(()=>{
        //   this.themeTopYs=[]
        //
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // })

        this.getthemeTopYs = debounce(() => {
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)

          console.log(this.themeTopYs);
        }, 100)
      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() {
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //上面拿不到数据，因为加载没完
    },
    updated() {
      //上面的mounted不行,可以用update来渲染

      // this.themeTopYs=[]
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getthemeTopYs()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        //获取Y值
        const positionY = -position.y

        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          // if ((i < length - 1 && positionY > this.this.themeTopYs[i] && positionY >
          //   this.themeTopYs[i + 1]) || (i === length - 1 && positionY > this.themeTopYs[i])) {
          //   console.log(i);
          // }
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
          //   this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i;
          //   console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex=this.currentIndex
          // }

          //优化
          if (this.currentIndex !== i && ((positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]))) {
            this.currentIndex = i;
            console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },

      addToCart() {
        //  获取信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //  添加到购物车
        // this.$store.commit('addCart', product)
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })

        //添加成功提示，上面已写(Promise), 下面是第二种方式
        this.addCart(product).then(res => {
          // this.show = true;
          // this.message = res;
          // console.log(res)
          //
          // setTimeout(() => {
          //   this.show = false
          //   this.message=''
          // }, 1500)

          this.$toast.show(res, 1500)
        })
      },
      backTop() {
        this.$refs.scroll.scrollTo(0, 0)
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>
