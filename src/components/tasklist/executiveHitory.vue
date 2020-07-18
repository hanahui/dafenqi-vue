<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>
        任务列表-执行历史
        <span class="fr">
          <button class="btn btn-sm btn-default" style="margin-right: 0;" @click="back">返回</button>
        </span>
      </div>
    </div>
    <div class="table-block">
      <!-- 列表 -->
      <div class="table-wrapper">
        <my-table :cols='cols' :tableData='tableData'>
          <template slot="tstate" slot-scope="{record}">{{record.tstate | filterState}}</template>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" @click="downloadData(record.historyId,record.taskFile)">下载</span>
          </template>
        </my-table>
      </div>
    </div>
  </div>
</template>

<script>
    import myTable from '../customTable'
    import paging from '../customPaging'
    import {getTaskHistoryList,downloadHistory} from '../../assets/js/taskApi'
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
                    {title: '任务名称', width: 'auto', align: 'left', key: 'tasknameflow'},
                    {title: '文件名', width: 'auto', align: 'left', key: 'taskFile', tooltip: true},
                    {title: '执行开始时间', width: 'auto', align: 'left', key: 'taskSdate', tooltip: true},
                    {title: '执行结束时间', width: 'auto', align: 'left', key: 'taskEdate', tooltip: true},
                    {title: '数据开始时间', width: 'auto', align: 'left', key: 'bizStartTime', tooltip: true},
                    {title: '数据结束时间', width: 'auto', align: 'left', key: 'bizEndTime', tooltip: true},
                    {title: '下次数据时间', width: 'auto', align: 'left', key: 'nextStartTime', tooltip: true},
                    {title: '状态', width: 'auto', align: 'left', key: 'tstate',slot: 'tstate'},
                    {title: '操作', width: '100px', align: 'left', slot: 'operation'},
                ],
                tableData: [],
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
                    taskType: that.taskType
                }
                getTaskHistoryList(params).then(res => {
                    console.log('任务执行历史===', res.data);
                    let data = res.data;
                    if(data.retCode == '0'){
                        that.tableData =  data.resultData;
                    }else{
                        that.tableData =  [];
                    }
                })
            },
            // 下载历史记录
            downloadData(id,file){
                let that =  this;
                let params = '?id=' + that.taskId + ","+ id + "," + file + '&userId=' + that.userId
                downloadHistory(params)
            },
            // 返回
            back(){
                history.go(-1);
            }
        },
        filters: {
            filterState(state){
                switch (state) {
                    case 'C':
                        return '执行完成';
                    case 'R':
                        return '执行中';
                    case 'F':
                        return '失败';
                }
            }
        }
    }
</script>

<style scoped>

</style>
