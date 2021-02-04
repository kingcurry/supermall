<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>

    <tab-control :titles="['流行','新款','精选']"
                 class="tab-control"
                 @tabClick="tabClick"
                 ref="tabControl" v-show="isTabFixed"/>

    <scroll class="content" ref="scroll" :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadmore"
            refresh>
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   class="tab-control"
                   @tabClick="tabClick"
                    ref="tabControl12"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata,getHomeGoods} from "network/home";

  import {debounce} from "../../common/utils";

  export default {
    name: "Home",
    data(){
      return{
        banners: [],
        recommends: [],
        goods:{
          'pop': {page: 0, list:[]},
          'new': {page: 0, list:[]},
          'sell': {page: 0, list:[]},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: '',
        isTabFixed: false,
        saveY: ''
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata();

      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh,0 )
      //3.监听item中图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        refresh();
      })


    },
    methods:{

      /**
       * 网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{

          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp();
        })
      },

      backClick(){
        this.$refs.scroll.scrollTo(0,0,500);
      },

      /**
       * 事件监听相关方法
       */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop';
                break;
           case 1:
            this.currentType = 'new';
                break;
           case 2:
            this.currentType = 'sell';
                break;
        }
        this.$refs.tabControl.currentIndex = index;
        this.$refs.tabControl12.currentIndex = index;
      },
      contentScroll(position){
        //1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000;
        //2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //上拉加载更多
      loadmore(pullingUp){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        //获取tabControl的offsetTop
        //所有一个组件都有一个属性$el:用于获取组件的元素

        this.tabOffsetTop = this.$refs.tabControl12.$el.offsetTop
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh();
    },
    deactivated() {
      console.log(this.$refs.scroll.getScrollY());
      this.saveY = this.$refs.scroll.getScrollY();
    }
  }
</script>

<style scoped>
  #home{
    /*margin-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
/*
    在浏览器使用原生滚动的时候需要导航栏一起滚动需要的样式
    position: fixed;
    left: 0;
    right:0;
    top: 0;
    z-index: 9;*/
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  /*.content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/


  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left:0;
    right:0;
  }

</style>
