<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>
        任务列表-日志下载
        <span class="fr">
          <button class="btn btn-sm btn-default" style="margin-right: 0;" @click="back">返回</button>
        </span>
      </div>
    </div>
    <div class="table-block">
      <!-- 列表 -->
      <div class="table-wrapper">
        <my-table :cols='cols' :tableData='tableData'>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" @click="downloadData(record.taskId,record.logName)">下载</span>
          </template>
        </my-table>
        <my-paging :curPage.sync="curPage"
                   :totalPage.sync='totalPage'
                   :pageSize.sync='pageSize'
                   @changed="init">
        </my-paging>
      </div>
    </div>
  </div>
</template>

<script>
    import myTable from '../customTable'
    import paging from '../customPaging'
    import {getTaskLogList,downloadLog} from '../../assets/js/taskApi'
    export default {
        name: "executiveHitory",
        components: {
            'my-paging': paging,
            'my-table': myTable,
        },
        data(){
            return {
                // userId: window.user?window.user.id:'',
                userId: 'd5b23873-c159-4358-a32f-e46804617561', // 测试
                taskId: this.$route.query.taskId || '',
                taskType: this.$route.query.taskType || '',
                cols: [
                    {title: '任务名称', width: 'auto', align: 'left', key: 'taskName', tooltip: true},
                    {title: '日志文件名', width: 'auto', align: 'left', key: 'logName', tooltip: true},
                    {title: '最近更新时间', width: 'auto', align: 'left', key: 'updateTime', tooltip: true},
                    {title: '操作', width: '100px', align: 'left', slot: 'operation'},
                ],
                tableData: [],
                curPage: 1,
                pageSize: 10,
                totalPage: 0,
            }
        },
        created(){
            this.init();
        },
        methods: {
            init(){
                let that =  this;
                let params = {
                    taskId: that.taskId,
                    pageNum: that.curPage,
                    pageSize: that.pageSize
                }
                getTaskLogList(params).then(res => {
                    console.log('任务日志列表===', res.data);
                    let data = res.data;
                    if(data.retCode == '0'){
                        let result = data.resultData;
                        that.totalPage = result.pages;
                        that.tableData =  result.list;
                    }else{
                        that.totalPage = 0;
                        that.tableData =  [];
                    }
                })
            },
            // 下载历史记录
            downloadData(taskId, logfile){
                let that =  this;
                let params = '?taskid='+taskId+'&logfile='+logfile;
                downloadLog(params);
            },
            // 返回
            back(){
                history.go(-1);
            }
        }
    }
</script>

<style scoped>

</style>
