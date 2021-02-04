import {debounce} from "./utils";

export const itemListenerMixin = {
  data(){
    return{
      itemImgItemListener: null
    }
  },
  mounted(){
    const refresh = debounce(this.$refs.scroll.refresh,100 )

    //对监听事件进行保存
    this.itemImgItemListener = ()=>{
      refresh();
    };
    //3.监听item中图片加载完成
    this.$bus.$on('itemImageLoad',this.itemImgItemListener)

  }
}
