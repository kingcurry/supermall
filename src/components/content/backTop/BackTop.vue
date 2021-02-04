<template>
    <div class="backTop">
      <img src="~assets/img/common/top.png" alt="">
    </div>
</template>

<script>
    export default {
      name: "BackTop",
    }
</script>

<style scoped>
  .backTop{
    position: fixed;
    right: 8px;
    bottom: 55px
  }

  .backTop img{
    hidden: 43px;
    width: 43px;
  }
</style>
