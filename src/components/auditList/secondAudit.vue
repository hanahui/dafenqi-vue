<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>任务二审</div>
    </div>
    <div class="search-block">
      <div class="search-group">
        <div class="search-item">
          <div class="search-label">
            <span class="label">任务ID：</span>
          </div>
          <div class="search-content">
            <my-input width="100%" v-model="searchParam.taskId"></my-input>
          </div>
        </div>
        <div class="search-item">
          <div class="search-label margin-left">
            <span class="label">任务名称：</span>
          </div>
          <div class="search-content">
            <my-input width="100%" v-model="searchParam.taskName"></my-input>
          </div>
        </div>
        <div class="search-item">
          <div class="search-label margin-left">
            <span class="label">创建人：</span>
          </div>
          <div class="search-content">
            <my-input width="100%" v-model="searchParam.userName"></my-input>
          </div>
        </div>
        <div class="search-item">
          <div class="search-label">
            <span class="label">执行方式：</span>
          </div>
          <div class="search-content">
            <single-select width="100%"
                           :list="modeList"
                           :defaultValue.sync="searchParam.mode"></single-select>
          </div>
        </div>
      </div>
      <div class="search-group">
        <div class="search-item">
          <div class="search-label margin-left">
            <span class="label">任务类型：</span>
          </div>
          <div class="search-content">
            <single-select width="100%"
                           :list="typeList"
                           :defaultValue.sync="searchParam.taskType"></single-select>
          </div>
        </div>
        <div class="search-item">
          <div class="search-label margin-left">
            <span class="label">创建时间：</span>
          </div>
          <div class="search-content">
            <a-date-picker
              placeholder="请选择"
              format="YYYY-MM-DD"
              :getCalendarContainer="getCalendarContainer()"
              :value="searchCreateTime"
              @change="createDateChanged"/>
          </div>
        </div>
        <div class="search-item large">
          <div class="search-label margin-left">
            <span class="label">执行时间：</span>
          </div>
          <div class="search-content large">
            <a-range-picker
              format="YYYY-MM-DD"
              :getCalendarContainer="getCalendarContainer()"
              @change="runTimeChange" />
          </div>
        </div>
        <button class="btn btn-sm btn-primary" style="margin-left: 24px;" @click="init">查询</button>
        <button class="btn btn-sm btn-default" @click="resetSearchForm">重置</button>
      </div>
    </div>
    <div class="table-block">
      <!-- 列表 -->
      <div class="table-wrapper">
        <my-table :cols='cols' :tableData='tableData'>
          <template slot="taskMode" slot-scope="{record}">{{record.modew | modeFilter}}</template>
          <template slot="taskType" slot-scope="{record}">{{record.task_type | typeFilter}}</template>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" @click="firstAuditTask(record)">审核</span>
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
    import moment from 'moment'
    import {mapGetters, mapActions} from 'vuex'
    import myInput from '../form/input'
    import singleSelect from "../form/singleSelect";
    import myTable from '../customTable'
    import paging from '../customPaging'
    import {getSecondAuditList} from "../../assets/js/taskApi";

    export default {
        name: 'tasklist',
        components: {
            'my-table': myTable,
            'single-select': singleSelect,
            'my-paging': paging,
            'my-input': myInput
        },
        data() {
            return {
                // userId: window.user?window.user.id:'',
                userId: 'd5b23873-c159-4358-a32f-e46804617561', // 测试
                searchParam: {
                    taskId: this.$store.getters.taskId,
                    taskName: this.$store.getters.taskName,
                    taskState: this.$store.getters.taskState,
                    userName: this.$store.getters.taskCreator,
                    mode: this.$store.getters.taskMode,
                    taskType: this.$store.getters.taskType,
                    createTime: this.$store.getters.taskCreateTime,
                    runStartTime: this.$store.getters.taskExecutionStime,
                    runEndTime: this.$store.getters.taskExecutionEtime
                },
                searchCreateTime: this.$store.getters.taskCreateTime ? moment(this.$store.getters.taskCreateTime, 'YYYY-MM-DD') : undefined,
                stateList:[
                    {text: '待提交', value: '0'},
                    {text: '一审待审核', value: '1'},
                    {text: '二审待审核', value: '10'},
                    {text: '审核不通过', value: '4'},
                    {text: '待执行', value: '2'},
                    {text: '正则执行', value: '3'},
                    {text: '执行成功', value: '5'},
                    {text: '执行失败', value: '6'},
                    {text: '停止', value: '9'},
                ],
                modeList: [
                    {text: '一次性任务', value: '1'},
                    {text: '周期性任务', value: '2'},
                ],
                typeList: [
                    {text: '自定义', value: '1'},
                    {text: '指标提取', value: '0'},
                    {text: '号码包', value: '5'},
                    {text: '标签提数', value: '6'},
                ],
                cols: [
                    {title: '任务ID', width: 'auto', align: 'left', key: 'vid',},
                    {title: '任务名称', width: 'auto', align: 'left', key: 'taskname', tooltip: true},
                    {title: '创建人', width: 'auto', align: 'left', key: 'userName'},
                    {title: '创建时间', width: 'auto', align: 'left', key: 'createTime', tooltip: true},
                    {title: '执行时间', width: 'auto', align: 'left', key: 'executetime', tooltip: true},
                    {title: '执行方式', width: 'auto', align: 'left', key: 'modew', slot: 'taskMode'},
                    {title: '任务类型', width: 'auto', align: 'left', key: 'task_type', slot: 'taskType'},
                    {title: '状态', width: 'auto', align: 'left', key: 'state'},
                    {title: '操作', width: '80px', align: 'left', slot: 'operation'},
                ],
                tableData: [],
                curPage: this.$store.getters.taskPageNum,
                pageSize: this.$store.getters.taskPageSize,
                totalPage: 0,
            }
        },
        mounted: function () {
            let that = this;
            that.init();
        },
        methods: {
            moment,
            getCalendarContainer() {
                return triggerNode => triggerNode.parentNode;
            },
            ...mapActions(['setTaskId','setTaskName','setTaskState','setTaskCreator','setTaskMode', 'setTaskType', 'setTaskCreateTime', 'setTaskExecutionSTime','setTaskExecutionETime', 'setTaskPageNum', 'setTaskPageSize']),
            /* 初始化任务列表数据 */
            init: function () {
                let that = this;
                let params = {
                    taskId: that.searchParam.taskId,
                    tasknamequ: that.searchParam.taskName,
                    userName: that.searchParam.userName,
                    modewqu: that.searchParam.mode,
                    taskstate: that.searchParam.taskState,
                    tasktype: that.searchParam.taskType,
                    createTime: that.searchParam.createTime,
                    runStartTime: that.searchParam.runStartTime,
                    runEndTime: that.searchParam.runEndTime,
                    pageNum: that.curPage,
                    pageSize: that.pageSize,
                    userId: that.userId
                }
                console.log('请求列表参数==',params)
                getSecondAuditList(params).then(res => {
                    console.log('任务列表===', res.data)
                    let data = res.data;
                    if (data.retCode == '0') {
                        let result = data.resultData;
                        that.totalPage = result.pages;
                        that.tableData = result.list;
                    }
                    else {
                        that.totalPage = 0;
                        that.tableData = [];
                    }
                })
            },
            createDateChanged(moment, timeStr){
                console.log(moment, '选择date');
                this.searchCreateTime = moment;
                this.searchParam.createTime = timeStr;
            },
            runTimeChange(moment, timeStr){
                console.log(moment,timeStr, '选择date');
                this.searchParam.runStartTime = timeStr[0]
                this.searchParam.runEndTime = timeStr[1]
            },
            /* 保存任务一审列表页缓存 */
            saveHtmlCache(){
                let that = this;
                console.log('save cache===', that.searchParam, that.pageSize,that.curPage)
                that.setTaskId(that.searchParam.taskId);
                that.setTaskName(that.searchParam.taskName);
                that.setTaskState(that.searchParam.taskState);
                that.setTaskCreator(that.searchParam.userName);
                that.setTaskMode(that.searchParam.mode);
                that.setTaskType(that.searchParam.taskType);
                that.setTaskCreateTime(that.searchParam.createTime);
                that.setTaskExecutionSTime(that.searchParam.runStartTime);
                that.setTaskExecutionETime(that.searchParam.runEndTime);
                that.setTaskPageNum(that.curPage);
                that.setTaskPageSize(that.pageSize);
            },
            /* 一审不同类型任务 */
            firstAuditTask(task){
                let that = this;
                that.saveHtmlCache();
                let taskType = task.task_type;
                let taskId = task.vid;
                console.log('二审任务类型和id===', taskType,taskId)
                switch (taskType) {

                    // 指标提取
                    case '0':
                        break;
                    // 自定义
                    case '1':
                        that.$router.push({
                            path: '/customExtract',
                            query: {
                                htmlType: 'audit',
                                auditType: 'secondAudit',
                                taskId: taskId
                            }
                        })
                        break;
                    // 魔百和
                    case '3':
                        that.$router.push({
                            path: '/mobihe',
                            query: {
                                htmlType: 'audit',
                                auditType: 'secondAudit',
                                taskId: taskId
                            }
                        })
                        break;
                    // 号码包
                    case '5':
                        that.$router.push({
                            path: '/numberPack',
                            query: {
                                htmlType: 'audit',
                                auditType: 'secondAudit',
                                taskId: taskId
                            }
                        })
                        break;
                    default:
                        break;
                }
            },
            resetSearchForm() {
                // console.log('重置')
                let that = this;
                that.searchParam.taskId = '';
                that.searchParam.taskName = '';
                that.searchParam.taskState = '';
                that.searchParam.userName = '';
                that.searchParam.mode = '';
                that.searchParam.taskType = '';
                that.searchParam.createTime = '';
                that.searchParam.runStartTime = '';
                that.searchParam.runEndTime = '';
            },
        },
        filters: {
            modeFilter(mode){
                return mode == '1' ? '一次性' : '周期性'
            },
            typeFilter(type){
                switch (type) {
                    case '0':
                        return '指标提取';
                    case '1':
                        return '自定义';
                    case '2':
                        return '批处理';
                    case '4':
                        return '明细提取';
                    case '5':
                        return '号码包';
                    case '6':
                        return '标签提数';
                    default:
                        return '自定义';
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/extractForm';
  @import '../../assets/css/list';
  .search-block {
    .search-group {
      display: flex;
      line-height: 28px;
      flex-wrap: wrap;
      .search-item{
        display: inline-flex;
        width: 240px;
        &.large{
          width: 300px;
        }
        .search-label {
          min-width: 70px;
          text-align: right;
          margin-bottom: 16px;
        }
        .search-content{
          width: 150px;
          margin-bottom: 16px;
          &.large{
            width: 260px;
          }
        }
      }
    }
  }

  .table-block {
    margin-top: 8px;
  }

</style>
