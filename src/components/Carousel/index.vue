<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(carousel, index) in list"
        :key="carousel.id"
      >
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
//引入swiper
import Swiper from "swiper";
export default {
  name: "Carousel",
  props: ["list"],
  watch: {
    list: {
      immediate: true, //立即监听：不管你数据有没有变化，我上来就监听你一次
      //为什么watch监听不到list的变化，因为数据从来就没有发生变化，因为数据是父组件给的，给过来的时候就是一个对象，数据该有的都有了
      handler() {
        //只能监听到数据已经有了，但是v-for动态渲染的结构我们还是没有办法确定的，因此还是需要用药nexttick
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.cur, {
            loop: true, // 循环模式选项
            autoplay: {
              //自动切换
              delay: 1500,
              stopOnLastSlide: false,
              disableOnInteraction: true,
            },
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              clickable: true, //点击分页器小球切换图片，默认是false
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            // 如果需要滚动条
            // scrollbar: {
            //   el: '.swiper-scrollbar',
            // },
          });
        });
      },
    },
  },
};
</script>

<style>
</style>