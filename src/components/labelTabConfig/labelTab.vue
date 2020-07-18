<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>标签表配置</div>
    </div>
    <button class="btn btn-primary" @click="toLabelAdd">新建 +</button>
    <div class="table-border">
      <my-table :table-data="tableData" :cols="labelTabCols">
        <span slot="dsType" slot-scope="{record}">{{record.dsType | dsTypeFilter}}</span>
        <span slot="tblType" slot-scope="{record}">{{record.tblType | tblTypeFilter}}</span>
        <template slot="operation" slot-scope="{ record }">
          <span class="curp url operation-btn" @click="toLabelEdit(record.dsId)">修改</span>
          <span class="operation-line"></span>
          <span class="curp url operation-btn" @click="delLabel(record.dsId)">删除</span>
        </template>
      </my-table>
      <!-- page -->
      <my-paging :total-page="totalPage" :cur-page="curPage" :page-size="pageSize" @changed="init"></my-paging>
    </div>
  </div>
</template>

<script>
import CustomTable from '../customTable'
import CustomPaging from '../customPaging'
import {
  getLabelTabList,
  getLabelTabDetail,
  getLabelTabDelete,
  getLabelTabEdit
} from '../../assets/js/labelTabConfig'
import { deleteLabel } from '../../assets/js/labelApi'
export default {
  name: 'labelTab',
  components: {
    'my-table': CustomTable,
    'my-paging': CustomPaging,
  },
  data() {
    return {
      userId: window.parent.user ? window.user.loginName : '测试', //用户ID
      curPage: this.$route.query.curPage || 1, //当前页码
      totalPage: 1, //总页数条数
      pageSize: this.$route.query.pageSize || 10, //每页条数
      jumpPage: '', //跳转某页
      tableData: [], //列表数据
      labelTabCols: [
        { title: '编号', key: 'dsId', tooltip: true, width: '' },
        { title: '数据源', key: 'dsType', slot: 'dsType', width: '' },
        { title: '数据库', key: 'schemaName', tooltip: true, width: '' },
        { title: '表名称', key: 'tblName', tooltip: true, width: '' },
        { title: '表描述', key: 'remark', tooltip: true, width: '' },
        { title: '表类型', key: 'tblType', slot: 'tblType', width: '' },
        { title: '操作', key: 'operation', slot: 'operation', width: '196px' }
      ],
      show: false,
      tipTitle: '哈哈哈'
    }
  },
  filters: {
    dsTypeFilter(val) {
      // console.log('filter--val--:', val)
      var str = ''
      switch (val) {
        case 1:
          str = 'HIVE'
          break
      }
      return str
    },
    tblTypeFilter(val) {
      // console.log('filter--val--:', val)
      var str = ''
      switch (val) {
        case 1:
          str = '主表'
          break
        case 2:
          str = '从表'
          break
      }
      return str
    }
  },
  mounted: function(event) {
    var that = this
    that.init()
  },
  methods: {
    /*
     * 初始化数据
     */
    init: function() {
      var that = this
      // var param = {
      //   userId: that.userId,
      //   curPage: that.curPage,
      //   pageSize: that.pageSize
      // }
      // console.log('methods--->init--->param:', param)
      this.getTabList()
    },

    getTabList() {
      let that = this
      getLabelTabList().then(res => {
        // let result = res.resultData
        console.log(res.data)
        if (0 == res.data.retCode) {
          var resultData = res.data.resultData
          // that.totalPage = resultData.length
          // that.curPage = resultData.curPage
          var data = resultData
          if (data) {
            that.tableData = data
          } else {
            that.tableData = new Array()
          }
        }
      })
    },

    // 新增
    toLabelAdd() {
      this.$router.push({
        path: '/labelTabConfig/add',
        query: { htmlType: 'add' }
      })
    },

    // 修改
    toLabelEdit(id) {
      this.$router.push({
        path: '/labelTabConfig/edit',
        query: { htmlType: 'edit', dsId: id }
      })
    },

    // 删除
    delLabel(id) {
      let that = this
      let params = new URLSearchParams()
      params.append('dsId', id)
      that.$myModal({
        show: true,
        title: '确认删除这条信息吗?',
        type: 'confirm',
        onOk: function(){
          getLabelTabDelete(params).then(res => {
            // 提示删除成功
            if (res.data.retCode === '0') {
              that.$message.success('删除成功!')
              that.getTabList()
            } else {
              let errorDesc = res.data.retDesc
              that.$warning({ title: errorDesc })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/list';
.table-border {
  margin-top: 8px;

  .operation-line {
    margin: 0 10px;
  }

  .operation-btn {
    cursor: pointer;
  }
}

.ant-modal-content {
  background-color: #2e2e2e;
}
</style>
