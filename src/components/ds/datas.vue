<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>数据集管理</div>
    </div>
    <div class="search-block">
      <div class="search-group">
        <div class="search-label">
          <span class="label">编号：</span>
        </div>
        <div class="search-content">
          <my-input v-model="searchParam.number"></my-input>
        </div>
        <div class="search-label margin-left">
          <span class="label">名称：</span>
        </div>
        <div class="search-content">
          <my-input v-model="searchParam.name"></my-input>
        </div>
        <div class="search-label margin-left">
          <span class="label">创建人：</span>
        </div>
        <div class="search-content">
          <my-input v-model="searchParam.creator"></my-input>
        </div>
        <button class="btn btn-sm btn-primary" style="margin-left: 24px;" @click="init">查询</button>
        <button class="btn btn-sm btn-default" @click="resetSearchForm">重置</button>
        <button class="btn btn-sm btn-default" @click="add">新增</button>
      </div>
    </div>
    <div class="table-block">
      <!-- 列表 -->
      <div class="table-wrapper">
        <my-table :cols='cols' :tableData='tableData'>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" @click="see(record.datasetId,'see')">查看</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="download(record.datasetId)">下载</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="deleteSet(record.datasetId)">删除</span>
          </template>
        </my-table>
        <my-paging :curPage.sync="curPage"
                   :totalPage.sync='totalPage'
                   :pageSize.sync='pageSize'>
        </my-paging>
      </div>
    </div>
  </div>
</template>

<script>
    import myInput from '../form/input'
    import myTable from '../customTable'
    import paging from '../customPaging'
    import {getDatasetList, deleteDataset, downloadDataset} from "../../assets/js/datasetApi";

    export default {
        name: "dataset",
        components: {
            'my-table': myTable,
            'my-paging': paging,
            'my-input': myInput
        },
        data() {
            return {
                userId: window.user ? window.user.name : '10001',
                searchParam: {
                    number: this.$route.query.searchNumber || '',
                    name: this.$route.query.searchName || '',
                    creator: this.$route.query.searchCreator || ''
                },
                cols: [
                    {title: '编号', width: 'auto', align: 'left', key: 'datasetId', },
                    {title: '名称', width: 'auto', align: 'left', key: 'datasetName',tooltip: true},
                    {title: '创建时间', width: 'auto', align: 'left', key: 'createTimeStr'},
                    {title: '创建人', width: 'auto', align: 'left', key: 'userId'},
                    {title: '备注', width: 'auto', align: 'left', key: 'remark',tooltip: true},
                    {title: '操作', width: '176px', align: 'left', slot: 'operation'},
                ],
                tableData: [],
                curPage: Number(this.$route.query.curPage) || 1,
                pageSize: Number(this.$route.query.pageSize) || 10,
                totalPage: Number(this.$route.query.totalPage) || 1,
            }
        },
        mounted: function () {
            var that = this;
            that.init();
        },
        methods: {
            /* 初始数据集列表  */
            init: function () {
                var that = this;
                let params = {
                    datasetId: that.searchParam.number,
                    datasetName: that.searchParam.name,
                    userName: that.searchParam.creator,
                    pageNum: that.curPage,
                    pageSize: that.pageSize,
                    id: that.userId,
                }
                console.log('window.user',window.user)
                getDatasetList(params).then(res => {
                    console.log('数据集列表===', res.data)
                    let data = res.data;
                    if(data.retCode == '0'){
                        let result = data.resultData;
                        that.totalPage = result.total;
                        that.tableData = result.list;
                    }else{
                        that.totalPage = 0;
                        that.tableData = [];
                    }
                })
            },

            /* 重置search form */
            resetSearchForm() {
                let that = this;
                that.searchParam.number = '';
                that.searchParam.name = '';
                that.searchParam.creator = '';
            },

            /* 跳转新增数据集 */
            add() {
                let that = this;
                that.$router.push({
                    path: '/datas/add',
                    query: {
                        searchNumber: that.searchParam.number,
                        searchName: that.searchParam.name,
                        searchCreator: that.searchParam.creator,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                    }
                })
            },

            /* 查看数据集 */
            see(id) {
                let that = this;
                that.$router.push({
                    path: '/datas/detail',
                    query: {
                        datasetId: id,
                        htmlType: 'see',
                        searchNumber: that.searchParam.number,
                        searchName: that.searchParam.name,
                        searchCreator: that.searchParam.creator,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                    }
                })
            },

            /* 删除数据集 */
            deleteSet(id) {
                let that = this;
                let param = {datasetId: id + '', id: that.userId};
                that.$myModal({
                    show: true,
                    type: 'confirm',
                    title: '确认要删除该数据集吗？',
                    onOk: function(){
                        deleteDataset(param).then(res =>  {
                            console.log('删除数据集===',res.data);
                            // 获取列表
                            that.init()
                        })
                    }
                })

            },

            /* 下载数据集 */
            download(id) {
                let that = this;
                let params = '?datasetId=' + id + '&id=' + that.userId
                downloadDataset(params)
            }

        }
    }
</script>

<style lang="less" scoped>
  #main {
    .search-block {
      .search-group {
        display: flex;
        line-height: 28px;

        .search-label {
          &.margin-left {
            margin-left: 24px;
          }
        }
      }
    }

    .table-block {
      margin-top: 24px;
    }
  }
</style>
