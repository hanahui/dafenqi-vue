<template>
  <div style="width: 100%; height: 100%;">
    <div id="main" class="pd">
      <div class="page-title bgd">
        <div>魔百和详单{{' -  ' + pageTitle}}</div>
      </div>
      <!-- audit history list -->
      <div class="history" v-if="htmlType === 'edit' && auditHistoryData.length > 0">
        <div class="table-wrapper">
          <my-table :tableData="auditHistoryData"
                    :cols="auditHistoryCols">
            <template slot="ispass" slot-scope="{record}">{{record.ispass | filterIspass}}</template>
          </my-table>
        </div>
      </div>
      <!-- form block -->
      <div class="form" v-if="htmlType !== 'see'">
        <div class="form-group">
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">任务名称：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              width="618px"
              v-model="mobiheForm.taskName"
              @check="checkTaskName"
              :isError="taskNameError"
              :errorWord="taskNameErrorWord"
              :disabled="htmlDisabled"></my-input>
          </div>
          <div class="group-btn" style="margin-left: 8px" v-if="htmlType === 'add' || htmlType === 'edit'">
            <button class="btn btn-default btn-sm" @click="showTemplateModal">选择模板</button>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label disabled">
            <span class="label">
              <span class="label-text">执行方式：</span>
            </span>
          </div>
          <div class="group-content">
            <single-select
              :list="modeList"
              :defaultValue.sync="mobiheForm.mode"
              :disabled="true"></single-select>
          </div>
          <div class="group-label inline-group-label disabled">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
          </div>
          <div class="group-content">
            <single-select
              width="60px"
              :list="cycelNumberList"
              :defaultValue.sync="mobiheForm.cycleNumber"
              :disabled="true" style="margin-right: 8px;"></single-select>
            <single-select
              width="60px"
              :list="cycleTypeList"
              :defaultValue.sync="mobiheForm.cycleType"
              :disabled="true"></single-select>
          </div>
          <div class="group-label inline-group-label disabled">
            <span class="label">
              <span class="label-text">执行时间：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              v-model="mobiheForm.executionTime"
              :disabled="true"></my-input>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label disabled">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              v-model="mobiheForm.mobile"
              :disabled="true"></my-input>
          </div>
          <div class="group-label inline-group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="label-text">邮箱：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              width="418px"
              placeholder="输入多个邮箱时请用逗号分隔"
              v-model="mobiheForm.email"
              @check="checkEmail"
              :isError="emailError"
              :errorWord="emailErrorWord"
              :disabled="htmlDisabled"></my-input>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label disabled">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              v-model="mobiheForm.FTP"
              :disabled="true"></my-input>
          </div>
          <div class="group-label inline-group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">输出文件格式：</span>
            </span>
          </div>
          <div class="group-content">
            <single-select
              :list="outputList"
              :defaultValue.sync="mobiheForm.outputType"
              :disabled="htmlDisabled"></single-select>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label disabled">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
          </div>
          <div class="group-content">
            <my-textarea v-model="mobiheForm.describe"
                         placeholder="不超过100个字"
                         width="706px"
                         :disabled="true">
            </my-textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="group-content margin-left">
            <input type="checkbox" id="checkTask" disabled v-model="mobiheForm.isExamine">
            <label for="checkTask">考核任务</label>
          </div>
        </div>
        <div class="form-group" v-for="(item, index) in scriptList">
          <div class="group-content margin-left">
            <input type="checkbox" :id="'script' + index" :checked="item.flag" disabled>
            <label :for="'script' + index"></label>
            <span class="script-label disabled">类型：</span>
            <single-select
              width="10%"
              :list="paramTypeList"
              :defaultValue.sync="item.type"
              :disabled="true">
            </single-select>
            <span class="script-label disabled margin-left">变量：</span>
            <my-input
              width="10%"
              v-model="item.param"
              :disabled="true">
            </my-input>
            <span class="script-label margin-left" :class="{disabled: htmlDisabled}">值：</span>
            <my-input
              width="25%"
              v-model="item.value"
              :disabled="htmlDisabled">
            </my-input>
            <span class="script-label disabled margin-left">数据集：</span>
<!--            <my-input-->
<!--              width="10%"-->
<!--              v-model="item.data"-->
<!--              :disabled="true">-->
<!--            </my-input>-->
            <single-select
              width="10%"
              :list="datasetList"
              :defaultValue.sync="item.data"
              :disabled="true">
            </single-select>
            <span class="script-label disabled margin-left">说明：</span>
            <my-input
              width="14%"
              v-model="item.desc"
              :disabled="true">
            </my-input>
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
            <my-textarea width="706px"
                         v-model="auditOpinion">
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
            <button class="btn btn-sm btn-primary" @click="auditTask" v-show="htmlType === 'audit'">保存</button>
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
            <span class="content-text">{{mobiheForm.taskName}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">执行方式：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.mode | filterMode}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text" v-show="mobiheForm.mode == '2'">{{mobiheForm.cycleNumber}}{{mobiheForm.cycleType | filterCycleType}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">执行时间：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.executionTime}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.mobile}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">邮箱：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.email}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.FTP}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">输出文件格式：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.outputType}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{mobiheForm.describe}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-content margin-left">
            <span class="checkbox-flag" :class="{checked: mobiheForm.isExamine}"></span>
            <span>考核任务</span>
          </div>
        </div>
        <div class="form-group" v-for="(item, index) in scriptList">
          <div class="group-content margin-left" style="width: 100%;">
            <span class="checkbox-flag" :class="{checked: item.flag}"></span>
            <span class="script-label">类型：</span>
            <div style="width: 10%">{{item.type === '1' ?  '开始时间' : (item.type === '2' ? '结束时间' : '')}}</div>
            <span class="script-label margin-left">变量：</span>
            <div style="width: 10%">{{item.param}}</div>
            <span class="script-label margin-left">值：</span>
            <div style="width: 25%">{{item.value}}</div>
            <span class="script-label margin-left">数据集：</span>
            <div style="width: 10%">{{item.data}}</div>
            <span class="script-label margin-left">说明：</span>
            <div style="width: 14%">{{item.desc}}</div>
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
    <template-modal :show="templateModalShow"
                    @close="templateModalShow = false"
                    @selected="choseTemplate"></template-modal>
  </div>
</template>

<script>
    import store from "../../store/index.js";
    import moment from 'moment'
    import myInput from '../form/input'
    import myTable from '../customTable'
    import singleSelect from "../form/singleSelect";
    import myTextarea from '../form/textarea';
    import TemplateModal from '../templateModal'
    import {getTemplateList,getTemplateInfo} from "../../assets/js/templateApi";
    import {saveCustomTask} from "../../assets/js/taskApi";
    import {getCustomTaskInfo} from "../../assets/js/customTaskApi";
    import {MyMixin} from '../../assets/js/task/mixins.js'
    export default {
        name: "mobihe",
        mixins: [MyMixin],
        components: {
            'my-input': myInput,
            'my-table': myTable,
            'single-select': singleSelect,
            'my-textarea': myTextarea,
            'template-modal': TemplateModal
        },
        data() {
            return {
                taskId: this.$route.query.taskId || '',
                labelClassObject: {
                    disabled: this.$route.query.htmlType === 'see' || this.$route.query.htmlType === 'audit'
                },
                // 魔百和详单 任务form
                mobiheForm: {
                    taskName: '',
                    mode: '',
                    cycleNumber: '1',
                    cycleType: '1',
                    executionTime: '',
                    mobile: '',
                    email: '',
                    FTP: '',
                    outputType: 'txt',
                    describe: '',
                    taskScript: '',
                    isExamine: false,
                    paramTypes: '',
                    cycleTypes: '',
                    taskParam: '',
                    taskValue: '',
                    taskSubValue: '',
                    taskDesc: '',
                },
                taskNameError: false, // 任务名称验证flag
                emailError: false, // 邮箱验证flag
                taskNameErrorWord: '请输入任务名称!',
                emailErrorWord: '请输入正确邮件格式!',
                scriptList: [], // 任务数据列表
                templateTypeList: [
                    {text: '全部', value: ''},
                    {text: '配置', value: '0'},
                    {text: '自定义', value: '1'}
                ],
            }
        },
        created(){
            let that = this;
            // 获取数据集列表
            that.queryDatasetList();
            // 获取任务详情
            if(that.htmlType !== 'add'){
                that.queryTaskDetail();
            }
        },
        methods: {
            moment,
            getCalendarContainer() {
                return triggerNode => triggerNode.parentNode;
            },
            /* 赋值任务详情 */
            setTaskInfo(task){
                let that = this;
                // 赋值所选模板详情
                that.mobiheForm.taskName = task.taskName;
                that.mobiheForm.mode = task.taskMode;
                that.mobiheForm.cycleNumber = task.cycleStep;
                that.mobiheForm.cycleType = task.taskCycle;
                that.mobiheForm.executionTime = task.taskExecutetimeStr;
                that.mobiheForm.mobile = task.taskPhonenum;
                that.mobiheForm.email = task.taskEmail;
                that.mobiheForm.FTP = task.taskFtp;
                that.mobiheForm.outputType = task.fileType;
                that.mobiheForm.describe = task.taskDescribes;
                that.mobiheForm.taskScript = task.taskScript;
                that.mobiheForm.isExamine = task.isExamine == '1' ?  true : false;
                that.scriptList = [];
                if(task.list && task.list.length > 0){
                    task.list.forEach(function(item){
                        let obj =  {
                            flag: item.paramType == '1' ? true : false,
                            type: item.cycleType,
                            param: item.taskParam,
                            value: item.taskValue,
                            data: item.taskSubValue == 'null' ? '' : item.taskSubValue,
                            desc: item.taskDesc,
                        }
                        that.scriptList.push(obj);
                    })
                }
                if(task.taskExamines && task.taskExamines.length > 0){
                    that.auditHistoryData = task.taskExamines;
                }
            },
            /* 验证taskname */
            checkTaskName() {
                console.log(this.mobiheForm.taskName);
                let that = this;
                that.taskNameError = false;
                if (!that.mobiheForm.taskName) {
                    that.taskNameError = true;
                }
            },
            /* 验证邮箱 */
            checkEmail() {
                console.log(this.mobiheForm.email, '邮箱text')
                let that = this;
                that.emailError = false;
                let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                let emailText = this.mobiheForm.email;
                if (emailText) {
                    if (emailText.indexOf(',') !== -1) {
                        let emailArr = emailText.split(',');
                        emailArr.forEach(function (item) {
                            if (!reg.test(item)) {
                                that.emailError = true;
                            }
                        })
                    }
                    else {
                        if (!reg.test(emailText)) {
                            that.emailError = true;
                        }
                    }
                }
            },
            // 获取模板参数列表参数
            getScriptList() {
                let that = this;
                that.mobiheForm.paramTypes = '';
                that.mobiheForm.cycleTypes = '';
                that.mobiheForm.taskParam = '';
                that.mobiheForm.taskValue = '';
                that.mobiheForm.taskSubValues = '';
                that.mobiheForm.taskDesc = '';
                that.scriptList.forEach(function (item) {
                    that.mobiheForm.paramTypes += '~' + (item.flag ? '1':'0');
                    that.mobiheForm.cycleTypes += '~' + item.type;
                    that.mobiheForm.taskParam += '~' + item.param;
                    that.mobiheForm.taskValue += '~' + item.value;
                    if(item.data !== ''){
                        that.mobiheForm.taskSubValues += '~' + item.data;
                    }else{
                        that.mobiheForm.taskSubValues += '~' + null;
                    }
                    that.mobiheForm.taskDesc += '~' + item.desc;
                })
            },
            /* 保存任务 */
            saveTask() {
                let that = this;
                if (that.taskNameError || that.emailError) {
                    return;
                }
                store.dispatch("showLoading");
                that.getScriptList();
                let params = {
                    taskId: that.taskId,
                    taskType: '3',
                    taskName: that.mobiheForm.taskName,
                    taskMode: that.mobiheForm.mode,
                    cycleStep: that.mobiheForm.cycleNumber,
                    taskCycle: that.mobiheForm.cycleType,
                    taskExecutetimeStr: that.mobiheForm.executionTime,
                    taskPhonenum: that.mobiheForm.mobile,
                    taskEmial: that.mobiheForm.email,
                    taskFtp: that.mobiheForm.FTP,
                    fileType: that.mobiheForm.outputType,
                    isExamine: that.mobiheForm.isExamine ? '1' : '0',
                    taskDescribes: that.mobiheForm.describe,
                    taskScript: that.mobiheForm.taskScript,
                    paramTypes: that.mobiheForm.paramTypes,
                    cycleTypes: that.mobiheForm.cycleTypes,
                    taskParam: that.mobiheForm.taskParam,
                    taskValue: that.mobiheForm.taskValue,
                    taskSubValues: that.mobiheForm.taskSubValues,
                    taskDesc: that.mobiheForm.taskDesc,
                    userId: that.userId
                }
                console.log('save mobihe task params===', params)
                saveCustomTask(params).then(res => {
                    store.dispatch("hideLoading");
                    // console.log(res.data, 'save mobihe form')
                    // 跳转任务列表页面
                    let data = res.data;
                    if(data.retCode == '0'){
                        that.$router.push({
                            path: '/tasklist'
                        })
                    }else{
                        // 保存失败
                        that.$myModal({
                            show: true,
                            title: '任务保存失败!',
                            type: 'error'
                        })
                    }

                }).catch(error => {
                    store.dispatch("hideLoading");
                })
            },
            /* 重置任务form */
            resetTaskForm() {
                if(this.htmlType === 'add'){
                    this.mobiheForm.taskName = '';
                    this.mobiheForm.mode = '';
                    this.mobiheForm.cycleType = '1';
                    this.mobiheForm.cycleNumber = '1';
                    this.mobiheForm.executionTime = '';
                    this.mobiheForm.mode = '';
                    this.mobiheForm.email = '';
                    this.mobiheForm.FTP = '';
                    this.mobiheForm.outputType = 'txt';
                    this.mobiheForm.describe = '';
                    this.mobiheForm.isExamine = false;
                    this.taskNameError = false;
                    this.emailError = false;
                    this.scriptList = [];
                }else if(this.htmlType === 'edit'){
                    this.queryTaskDetail();
                }
            },
            setTemplateInfo(template){
                let that = this;
                // 赋值所选模板详情
                that.mobiheForm.taskName = template.templateName;
                that.mobiheForm.mode = template.templateMode;
                that.mobiheForm.cycleNumber = template.cycleStep;
                that.mobiheForm.cycleType = template.templateCycle;
                that.mobiheForm.executionTime = template.executetimeStr;
                that.mobiheForm.mobile = template.phonenum;
                that.mobiheForm.email = template.email;
                that.mobiheForm.FTP = template.ftp;
                that.mobiheForm.outputType = template.fileType;
                that.mobiheForm.describe = template.describes;
                that.mobiheForm.taskScript = template.templateScript;
                that.mobiheForm.isExamine = template.isExamine == '1' ?  true : false;
                that.setScriptList(template);
            },
            /* 赋值模板 script list */
            setScriptList(template) {
                let that = this;
                if(template.list && template.list.length > 0){
                    that.scriptList = [];
                    template.list.forEach(function(item){
                        let obj =  {
                            flag: item.paramType == '1' ? true : false,
                            type: item.cycleType,
                            param: item.templateParam,
                            value: item.templateValue,
                            data: item.taskSubValue == 'null' ? '' : item.taskSubValue,
                            desc: item.templateDescribes,
                        }
                        that.scriptList.push(obj);
                    })
                }
            },
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/extractForm';
  #app {
    &.darkTheme {
      @disabled-text-color: #4d4d4d;
      @modal-background: #252525;
      @border-color: #0d0d0d;
      .form{
        &.info-form{
          .form-group{
            .group-label{
              min-width: 110px;
            }
            .group-content{
              &.margin-left{
                margin-left: 85px;
              }
            }
          }
        }
      }
    }

    &.lightTheme {
      // lightTheme style

    }

  }
</style>
