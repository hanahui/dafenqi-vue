<template>
  <!-- page -->
  <div class="mgt page" v-if="totalPage != 0">
    <!-- pageSize -->
    <div class="fl inline-flex" v-if="pageSizeShow">
      <span class="inline-block">显示行数</span>
      <select v-model="selfPageSize" class="input mgl page-select" @change="choosePageSizeClick">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
    </div>
    <!-- pageNum -->
    <div class="fr" style="display: flex">
      <nav aria-label="Page navigation">
        <ul class="vue-pagination">
          <li class="prev" :class="selfCurPage==1?'disabled':''">
            <a href="javascript:;" @click="choosePageClick(selfCurPage==1?1:curPage-1)" aria-label="Previous">
              <span aria-hidden="true">&lt;</span>
            </a>
          </li>
          <li v-for="page in showPageBtn" :class="selfCurPage==page?'active':''">
            <a href="javascript:;" v-if="page" @click="choosePageClick(page)">{{page}}</a>
            <span href="javascript:;" v-else>···</span>
          </li>
          <li class="next" :class="selfCurPage==totalPage?'disabled':''">
            <a href="javascript:;" @click="choosePageClick(selfCurPage==totalPage?totalPage:selfCurPage+1)" aria-label="Next">
              <span aria-hidden="true">&gt;</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="font-size0">
        <span class="mgl inline-block">跳转至第</span>
        <input v-model="jumpPage" class="input page-select jumpPage" type="text" style="width: 50px;"/>
        <span class="mgr page-font inline-block">页</span>
      </div>
      <div>
        <button class="btn btn-sm btn-default" @click="jumpPageClick">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "customPaging",
        props: {
            pageSizeShow: {
                type: Boolean,
                default: true
            },
            totalPage: {
                type: Number,
                default: 0
            },
            curPage: {
                type: Number,
                default: 1
            },
            pageSize: {
                type: Number,
                default: 10
            }
        },
        data: function () {
            return {
                jumpPage: '',
                selfPageSize: this.pageSize,
                selfCurPage: this.curPage
            }
        },
        watch: {
            totalPage: function (newTotalPage) {
                console.log('totalPage changed')
                this.totalPage = newTotalPage
            },
            curPage: function (newValue) {
                this.selfCurPage = newValue;
            }
        },
        computed: {
            showPageBtn: function () {//构建分页导航栏
                var that = this;
                let totalPage = parseInt(that.totalPage);
                // console.log("computed--->totalPage:",totalPage);
                let curPage = parseInt(that.selfCurPage);
                let arr = new Array();
                if (totalPage <= 5) {
                    for (let i = 1; i <= totalPage; i++) {
                        arr.push(i)
                    }
                    return arr;
                }
                if (curPage <= 2) return [1, 2, 3, 0, totalPage];
                if (curPage >= totalPage - 1) return [1, 0, totalPage - 2, totalPage - 1, totalPage];
                if (curPage === 3) return [1, 2, 3, 4, 0, totalPage];
                if (curPage === totalPage - 2) return [1, 0, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
                return [1, 0, curPage - 1, curPage, curPage + 1, 0, totalPage];
            }
        },
        methods: {
            /*
             * 选每页条数
             */
            choosePageSizeClick: function () {
                var that = this;
                that.selfCurPage = 1;
                that.$emit('update:pageSize', that.selfPageSize)
                that.$emit('update:curPage', that.selfCurPage)
                // that.$emit('changed')
            },
            /*
             * 选页数
             */
            choosePageClick: function (page) {
                console.log("methods--->goPage:", page, this.selfCurPage);
                var that = this;
                that.jumpPage = '';
                page = parseInt(page);
                // console.log(page != that.selfCurPage)
                that.selfCurPage = page;
                that.$emit('update:curPage', that.selfCurPage);
                that.$emit('changed')

            },
            /*
             * 跳转某页
             */
            jumpPageClick: function () {
                var that = this;
                var jumpPage = that.jumpPage;
                console.log("methods--->jumpPageClick:", jumpPage);
                var checkNum = /^[1-9]\d*$/;
                if (!checkNum.test(jumpPage)) {
                    // $.xcConfirm("跳转页为大于0的正整数", $.xcConfirm.typeEnum.info);
                    return;
                }
                var totalPage = that.totalPage;
                if (jumpPage > totalPage) {
                    // $.xcConfirm("跳转页必须小于等于总页数", $.xcConfirm.typeEnum.info);
                    return;
                }
                that.selfCurPage = jumpPage;
                that.choosePageClick(jumpPage);
            },
        }
    }
</script>

<style lang="less" scoped>
  .page-select {
    &.mgl {
      width: 60px;
    }

    &.jumpPage {
      margin: 0 8px;
      font-size: 14px;
    }
  }

  .inline-block {
    font-size: 14px;
  }
</style>
