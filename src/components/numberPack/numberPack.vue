<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>号码包任务{{' -  ' + pageTitle}}</div>
    </div>
    <!-- audit history list -->
    <div class="history" v-if="htmlType === 'edit' && auditHistoryData.length > 0">
      <div class="table-wrapper">
        <my-table :tableData="auditHistoryData"
                  :cols="auditHistoryCols">
        </my-table>
      </div>
    </div>
    <!-- form block -->
    <div class="form" v-if="htmlType !== 'see'">
      <div class="form-group">
        <div class="group-label" :class="labelClassObject">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">任务名称：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            width="400px"
            v-model="numberPackForm.taskName"
            @check="checkTaskName"
            :isError="taskNameError"
            :errorWord="taskNameErrorWord"
            :disabled="htmlType === 'audit'"></my-input>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="labelClassObject">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">号码来源：</span>
            </span>
        </div>
        <div class="group-content">
          <single-select
            width="400px"
            :list="sourceTypeList"
            :defaultValue.sync="numberPackForm.sourceType"
            :disabled="htmlType === 'audit'">
          </single-select>
        </div>
        <div class="group-label inline-group-label">
          <span class="label">
              <span class="required-flag">*</span>
            <span class="label-text">号码包：</span>
            </span>
        </div>
        <div class="group-btn">
          <input type="file" hidden ref="file" accept=".txt" @change="chooseFile">
          <button class="btn btn-default btn-sm" @click="$refs.file.click()" v-show="htmlType === 'add' || htmlType === 'edit'">选择文件</button>
          <button class="btn btn-default btn-sm" @click="downloadFile" v-show="htmlType === 'audit'">下载文件</button>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="labelClassObject">
            <span class="label">
              <span class="label-text">活动ID：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            width="570px"
            v-model="numberPackForm.activityId"
            :disabled="htmlType === 'audit'"></my-input>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="labelClassObject">
            <span class="label">
              <span class="label-text">备注：</span>
            </span>
        </div>
        <div class="group-content">
          <my-textarea v-model="numberPackForm.describe"
                       width="570px"
                       :disabled="htmlType === 'audit'">
          </my-textarea>
        </div>
      </div>
      <div class="form-group" v-if="htmlType === 'audit'">
        <div class="group-label">
            <span class="label">
              <span class="label-text">审核：</span>
            </span>
        </div>
        <div class="group-content">
          <input name="audit" type="radio" id="pass"
                 :value="auditType === 'firstAudit' ? '10' : '2'"
                 v-model="auditValue">
          <label for="pass" style="margin-right: 24px;">通过</label>
          <input name="audit" type="radio" id="nopass"
                 value="4"
                 v-model="auditValue">
          <label for="nopass">不通过</label>
        </div>
      </div>
      <div class="form-group" v-if="htmlType === 'audit'">
        <div class="group-label">
            <span class="label">
              <span class="label-text">审核意见：</span>
            </span>
        </div>
        <div class="group-content">
          <my-textarea v-model="auditOpinion"
                       width="570px">
          </my-textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
          <span class="label"></span>
        </div>
        <div class="group-content">
          <button class="btn btn-sm btn-primary" @click="saveTask" v-show="htmlType === 'add' || htmlType === 'edit'">保存</button>
          <button class="btn btn-sm btn-default" @click="resetTaskForm" v-show="htmlType === 'add' || htmlType === 'edit'">重置</button>
          <button class="btn btn-sm btn-default" @click="auditTask" v-show="htmlType === 'audit'">保存</button>
          <button class="btn btn-sm btn-default" @click="back" v-show="htmlType !== 'add'">返回</button>
        </div>
      </div>
    </div>
    <div class="form info-form" v-if="htmlType === 'see'">
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">任务名称：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{numberPackForm.taskName}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">号码来源：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{numberPackForm.sourceType | filterSourceType}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
            <span class="label-text">号码包：</span>
            </span>
        </div>
        <div class="group-content">
          <div class="group-btn">
            <button class="btn btn-default btn-sm" @click="downloadFile">下载文件</button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">活动ID：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{numberPackForm.activityId}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">备注：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{numberPackForm.describe}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
          <span class="label"></span>
        </div>
        <div class="group-content">
          <button class="btn btn-sm btn-default" @click="back">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import myTable from '../customTable'
    import myInput from '../form/input'
    import singleSelect from "../form/singleSelect";
    import myTextarea from '../form/textarea'
    import {saveTask, getTaskInfo,uploadFile,downloadFile} from "../../assets/js/numberPackApi";
    import {MyMixin} from '../../assets/js/task/mixins.js'
    export default {
        name: "numberPack",
        mixins: [MyMixin],
        components:{
            'my-input': myInput,
            'single-select': singleSelect,
            'my-textarea': myTextarea,
            'my-table': myTable
        },
        data(){
            return {
                taskId: this.$route.query.taskId || '',
                taskState: '', // 任务状态
                labelClassObject: {
                    disabled: this.$route.query.htmlType === 'audit'
                },
                // 魔百和详单 任务form
                numberPackForm: {
                    taskName: '',
                    sourceType: '2',
                    file: '',
                    activityId: '',
                    describe: '',
                },
                sourceTypeList: [
                    {text: '手动上传', value: 2}
                ],
                taskNameError: false, // 任务名称验证flag
                taskNameErrorWord: '请输入任务名称!',
                auditHistoryCols: [
                    {title: '审核人', key: 'userName'},
                    {title: '审核时间', key: 'auditTime'},
                    {title: '审核结果', key: 'auditStatus'},
                    {title: '审核意见', key: 'auditAdvice'},
                ], // 审核记录表格表头
            }
        },
        created(){
            let that = this;
            if(that.taskId){
                that.queryTaskInfo();
            }
        },
        methods:{
            // 获取号码包任务详情
            queryTaskInfo(){
                let that = this;
                let param = {taskId: that.taskId}
                getTaskInfo(param).then(res => {
                    console.log('号码包任务详情==', that.taskId, res.data)
                    let data = res.data;
                    let result = data.resultData;
                    that.setNumberPackForm(result)
                    that.auditHistoryData = result.auditHis || [];
                })
            },
            // 赋值号码包详情
            setNumberPackForm(taskInfo){
                let that = this;
                that.numberPackForm.taskName = taskInfo.taskName;
                that.numberPackForm.file = taskInfo.filePath;
                that.numberPackForm.activityId = taskInfo.marketingCode;
                that.numberPackForm.describe = taskInfo.remark;
            },
            // 验证任务名称
            checkTaskName(){
                let that = this;
                if(!that.numberPackForm.taskName){
                    that.taskNameError = true;
                }else{
                    that.taskNameError = false;
                }
            },
            // 选择上传文件
            chooseFile(event){
                let that = this;
                // console.log('files==',event.target.files)
                let file = event.target.files;
                let formData = new FormData;
                formData.append('file',file[0]);
                console.log('upload file===',formData)
                uploadFile(formData).then(res => {
                    console.log('上传文件==',res.data)
                    let data = res.data;
                    let markText = '';
                    if(data.code === '0'){
                        markText = '文件上传成功';
                        // 赋值form file上传后文件地址
                        that.numberPackForm.file = data.filePath;
                        that.$myModal({
                            show: true,
                            title: markText,
                            type: 'success',
                            okText: '知道了',
                        })
                    }else{
                        switch(data.code){
                            case '1001':
                                markText = '文件上传不能为空'
                                break;
                            case '2001':
                                markText = '文件内容不能超过500W条'
                                break;
                            case '3001':
                                markText = '文件内容全部不符合规范'
                                break;
                            default:
                                markText = data.desc
                                break;
                        }
                        that.$myModal({
                            show: true,
                            title: markText,
                            type: 'warning',
                            okText: '知道了',
                        })
                    }
                })
            },
            // 下载文件
            downloadFile(){
                let that = this;
                let param = '?taskId=' + that.taskId;
                downloadFile(param);
            },
            // 保存号码包任务
            saveTask(){
                let that = this;
                if(that.taskNameError){
                    return;
                }
                if(that.numberPackForm.file === ''){
                    // 提示请选择文件
                    that.$myModal({
                        show: true,
                        title: '请选择文件',
                        onOk: function(){
                            that.$refs.file.click();
                        }
                    })
                    return;
                }
                let params = {
                    taskName: that.numberPackForm.taskName,
                    filePath: that.numberPackForm.file,
                    sourceType: that.numberPackForm.sourceType,
                    marketingCode: that.numberPackForm.activityId,
                    remark: that.numberPackForm.describe,
                    userId: that.userId
                }
                if(that.htmlType === 'edit'){
                    // 修改任务
                    params.taskId = that.taskId
                }
                saveTask(params).then(res => {
                    console.log('保存号码包任务===', res.data);
                    if(res.data.retCode == '0'){
                        // 保存成功 跳转任务列表
                        that.$router.push({
                            path: '/tasklist'
                        })
                    }else{
                        that.$myModal({
                            show: true,
                            type: 'error',
                            title: '保存失败!',
                        })
                    }
                })
            },
            // 重置任务form
            resetTaskForm(){
                let that = this;
                that.numberPackForm.taskName = '';
                that.numberPackForm.numberSource = '';
                that.numberPackForm.file = '';
                that.numberPackForm.activityId = '';
                that.numberPackForm.describe = '';
                that.taskNameError = false;
            },
        },
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/extractForm';
  #app{
    &.darkTheme{
      @disabled-text-color: #4d4d4d;
      @modal-background: #252525;
      @border-color: #0d0d0d;
      // darkTheme style
      .form{
        .form-group{
          .group-label{
            &.inline-group-label{
              min-width: 66px;
              margin-left: 24px;
            }
          }
        }
      }
    }
  }
</style>
