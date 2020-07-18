<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>任务列表</div>
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
            <span class="label">状态：</span>
          </div>
          <div class="search-content">
            <single-select width="100%"
                           :list="stateList"
                           :defaultValue.sync="searchParam.taskState"></single-select>
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
      </div>
      <div class="search-group">
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
            <span class="curp url operation-btn" @click="seeTask(record)">查看</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="editTask(record)" v-show="record.task_state == '0' || record.task_state == '4'">修改</span>
            <span class="curp url operation-btn" @click="jumpHistory(record.vid,record.task_type)" v-show="record.task_state != '0' && record.task_state != '4'" >执行历史</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="deleteTask(record.vid)" v-show="record.task_state == '0' || record.task_state == '4'">删除</span>
            <span class="curp url operation-btn" @click="jumpLog(record.vid)" v-show="record.task_state != '0' && record.task_state != '4'">日志下载</span>
            <span class="curp url operation-btn more" v-show="record.task_state != '1' && record.task_state != '10' && record.task_state != '2'">
              <span class="icon iconfont" style="top: -2px;">&#xe736;</span>
              <div class="more-wrapper tooltip-box">
                <div class="arrow tooltip-arrow"></div>
                <div class="tooltip-content">
                  <ul class="operation-list">
                    <li class="operation-item" v-show="record.task_state == '0'" @click="submitTask(record.vid, '1')">提交</li>
                    <li class="operation-item" v-show="record.task_state == '0' || record.task_state == '4'" @click="jumpHistory(record.vid,record.task_type)">执行历史</li>
                    <li class="operation-item" v-show="record.task_state == '0' || record.task_state == '4'" @click="jumpLog(record.vid)">日志下载</li>
                    <li class="operation-item" v-show="record.task_state == '5' || record.task_state == '6' && record.task_type != '5'">重做</li>
                    <li class="operation-item" v-show="record.task_state == '2'" @click="submitTask(record.vid, '9')">停止</li>
                    <li class="operation-item" v-show="record.task_state == '9'" @click="submitTask(record.vid, '2')">恢复</li>
                  </ul>
                </div>
               </div>
              </span>
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
    import {getTaskList,deleteTask,updateTaskState} from "../../assets/js/taskApi";

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
                    {title: '操作', width: '230px', align: 'left', slot: 'operation'},
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
                getTaskList(params).then(res => {
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
            /* 保存任务列表页缓存 */
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
            /* 查看不同类型任务 */
            seeTask(task){
                let that = this;
                that.saveHtmlCache();
                let taskType = task.task_type;
                let taskId = task.vid;
                console.log('查看任务类型和id===', taskType,taskId)
                switch (taskType) {

                    // 指标提取
                    case '0':
                        break;
                    // 自定义
                    case '1':
                        that.$router.push({
                            path: '/customExtract',
                            query: {
                                htmlType: 'see',
                                taskId: taskId
                            }
                        })
                        break;
                    // 魔百和
                    case '3':
                        that.$router.push({
                            path: '/mobihe',
                            query: {
                                htmlType: 'see',
                                taskId: taskId
                            }
                        })
                        break;
                    // 号码包
                    case '5':
                        that.$router.push({
                            path: '/numberPack',
                            query: {
                                htmlType: 'see',
                                taskId: taskId
                            }
                        })
                        break;
                    default:
                        break;
                }
            },
            //  修改任务
            editTask(task){
                let that = this;
                that.saveHtmlCache();
                let taskType = task.task_type;
                let taskId = task.vid;
                console.log('修改任务类型和id===', taskType,taskId)
                switch (taskType) {
                    // 指标提取
                    case '0':
                        break;
                    // 自定义
                    case '1':
                        that.$router.push({
                            path: '/customExtract',
                            query: {
                                htmlType: 'edit',
                                taskId: taskId
                            }
                        })
                        break;
                    // 魔百和
                    case '3':
                        that.$router.push({
                            path: '/mobihe',
                            query: {
                                htmlType: 'edit',
                                taskId: taskId
                            }
                        })
                        break;
                    // 号码包
                    case '5':
                        that.$router.push({
                            path: '/numberPack',
                            query: {
                                htmlType: 'edit',
                                taskId: taskId
                            }
                        })
                        break;
                    default:
                        break;
                }
            },
            // 删除任务
            deleteTask(id){
                let that = this;
                that.$myModal({
                    show: true,
                    title: '确认删除该任务吗?',
                    type: 'confirm',
                    onOk: function(){
                        deleteTask({taskId: id}).then(res => {
                            console.log('删除任务===', res.data)
                            let data = res.data;
                            if(data.retCode ==  '0'){
                                // 删除成功
                                that.init();
                            }else{
                                // 删除失败
                            }
                        })
                    }
                })
            },
            // 执行历史
            jumpHistory(id,type){
                let that = this;
                that.saveHtmlCache();
                that.$router.push({
                    path: '/task/history',
                    query: {
                        taskId: id,
                        taskType: type
                    }
                })
            },
            // 日志下载
            jumpLog(id){
                let that = this;
                that.saveHtmlCache();
                that.$router.push({
                    path: '/task/log',
                    query: {
                        taskId: id,
                    }
                })
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
            // 提交/停止/恢复任务
            submitTask(taskId,state){
                let that = this;
                let params = {
                    taskId: taskId,
                    taskstate: state
                }
                updateTaskState(params).then(res => {
                    console.log('任务状态更新===', res.data);
                    that.init();
                })
            }
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
