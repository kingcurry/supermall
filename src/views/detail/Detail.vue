<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
     <scroll class="content" ref="scroll">
       <detail-swiper :top-images="topImages">
       </detail-swiper>
       <detail-base-info :goods="goods"></detail-base-info>
       <detail-shop-info :shop="shop"></detail-shop-info>
       <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramsInfo"></detail-param-info>
       <detail-comment-info :commentInfo="commentInfo"></detail-comment-info>
       <goods-list :goods="recommends"></goods-list>
     </scroll>
    <h2>详情页: {{iid}}</h2>
  </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'

    import {debounce} from "../../common/utils";

    import {getDetail,Goods,GoodsParam,Shop,getRecommend} from 'network/detail'
    import {itemListenerMixin} from "../../common/mixin";

    export default {
      name: "Detail",
      data(){
        return{
          iid: '',
          topImages:[],
          goods: {},
          shop: {},
          detailInfo:{},
          paramsInfo: {},
          commentInfo: {},
          recommends: [],

        }
      },
      mixins:[itemListenerMixin],
      components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList
      },
      created(){
        //保存传入的iid
        this.iid = this.$route.params.iid;

        //根据iid请求数据
        getDetail(this.iid).then(res=>{
          //1.获取轮播图片数据
          const data = res.data.result;

          //2.获取顶部的图片数据
          this.topImages = res.data.result.itemInfo.topImages
          console.log(res);

          //3.获取商品信息
          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

          //4.创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)

          //5.获取商品详细信息
          this.detailInfo = data.detailInfo

          //6.获取参数信息
          this.paramsInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          //7.取出评论信息
          if (data.rate.list){
            this.commentInfo = data.rate.list[0];
          }
        })

        //详情页面
        getRecommend().then(res=>{
          this.recommends = res.data.list;
        })
      },
      mounted() {
        /*const refresh = debounce(this.$refs.scroll.refresh,100 )
        this.itemImgItemListener = ()=>{
          refresh();
        }
        this.$bus.$on('itemImageLoad', this.itemImgItemListener)*/
      },
      methods:{
          imageLoad(){
            this.$refs.scroll.refresh()
          }
      },
      destroy(){
        this.$bus.$off('itemImageLoad',this.itemImgItemListener)
      }
    }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height: calc(100% - 44px);
  }
</style>
