<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(slide, index) in skuImageList"
        :key="slide.id"
      >
        <img :src="slide.imgUrl" :class="{active:activeIndex == index}" @click="changecurrentIndex(index)"/>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  data() {
    return {
      activeIndex:0
    }
  },
  props: ["skuImageList"],
  watch: {
    //监听数据：可以保证数据一定回来了，但是不能保证v-for遍历的结构是否完事，结构还不完整
    skuImageList(newValue, oldValue) {
      //进入nextTick，说明v-for遍历完成，结构也完整了
      this.$nextTick(() => {
        new Swiper(".swiper-container", {
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          //显示几个图片的配置项
          slidesPerView:3,
          //每一次切换图片的个数，默认是1，这里也写一些，知道有这个配置项
          slidesPerGroup : 1,
        });
      });
    },
  },
  methods:{
    changecurrentIndex(index){ 
      //修改响应式数据
      this.activeIndex = index
      //下面选中谁，大图就显示谁，把当前的选中的图片的index传给大图的组件
      this.$bus.$emit('getIndex',index)
    },
  
  }
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>