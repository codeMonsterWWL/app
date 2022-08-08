<template>
  <div class="pagination">
    <!-- 分页器分为三个部分，上中下 -->
    <!-- 上 -->
    <!-- 当前是第一页，上一页就不能点了 -->
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button
      v-if="startAndEnd.start > 1"
      @click="$emit('getPageNo', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <button v-if="startAndEnd.start > 2">···</button>

    <!-- 中 -->
    <!-- 遍历数字，遍历10，结果为1-10，这里遍历end，生成1-end，通过v-if，只显示start-end -->
    <button
      v-for="(page, index) in startAndEnd.end"
      :key="index"
      v-if="page >= startAndEnd.start"
      @click="$emit('getPageNo', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>

    <!-- 下 -->
    <button v-if="startAndEnd.end < totalPage - 1">···</button>
    <button
      v-if="startAndEnd.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
      :class="{ active: pageNo == totalPage }"
    >
      {{ totalPage }}
    </button>
    <!-- 当前是最后一页（等于totalPage），上一页就不能点了 -->
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('getPageNo', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
    <!-- <h1>{{ startAndEnd }}--{{ pageNo }}</h1> -->
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    //算出总页数
    totalPage() {
      //向上取整
      return Math.ceil(this.total / this.pageSize);
    },
    //算出连续页码的起始页码和结束页码
    startAndEnd() {
      const { continues, pageNo, totalPage } = this;
      let start = 0,
        end = 0;
      if (continues > totalPage) {
        //特殊情况：当总的页码数比连续的页码数还少时
        start = 1;
        end = totalPage;
      } else {
        //正常时，总的页码数大于连续页码数
        start = pageNo - Math.floor(continues / 2); //不写死，如果能确定连续页码是5的话，就直接减2，但是最好不写死
        end = pageNo + Math.floor(continues / 2);
        //start的bug：分页器的页码不能是0和负数，但是当 pageNo <= Math.floor(continues/2)时，start会变成0或者负数，得纠正
        if (start <= 0) {
          start = 1;
          end = continues;
        }
        //end的bug：我一共就有31页数据，但是当前页就为31页，那么end就凸出去了（end比totalPage还大，这显然扯淡）
        if (end > totalPage) {
          end = totalPage;
          start = end - continues + 1;
        }
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>