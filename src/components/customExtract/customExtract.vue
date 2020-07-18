<template>

  <div style="width: 100%; height: 100%;">
    <div id="main" class="pd">
      <div class="page-title bgd">
        <div>自定义提数{{' -  ' + pageTitle}}</div>
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
              v-model="customTaskForm.taskName"
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
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行方式：</span>
            </span>
          </div>
          <div class="group-content">
            <single-select
              :list="modeList"
              :defaultValue.sync="customTaskForm.mode"
              :disabled="htmlDisabled"></single-select>
          </div>
          <div class="group-label inline-group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
          </div>
          <div class="group-content">
            <single-select
              width="60px"
              :list="cycelNumberList"
              :defaultValue.sync="customTaskForm.cycleNumber"
              :disabled="customTaskForm.mode != '2' || htmlDisabled" style="margin-right: 8px;"></single-select>
            <single-select
              width="60px"
              :list="cycleTypeList"
              :defaultValue.sync="customTaskForm.cycleType"
              :disabled="customTaskForm.mode != '2' || htmlDisabled"></single-select>
          </div>
          <div class="group-label inline-group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行时间：</span>
            </span>
          </div>
          <div class="group-content">
            <div class="group-content" style="width: 164px;">
              <a-date-picker
                placeholder="请选择"
                format="YYYY-MM-DD HH:mm"
                :disabled="htmlDisabled"
                :getCalendarContainer="getCalendarContainer()"
                :allowClear="false"
                :showToday="false"
                :showTime="{
              allowClear: false,
              format: 'HH:mm',
              defaultValue: moment('00:00','HH:mm'),
              minuteStep: 5,
            }"
                v-model="customTaskForm.executionTime"/>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              v-model="customTaskForm.mobile"
              :disabled="htmlDisabled"></my-input>
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
              v-model="customTaskForm.email"
              @check="checkEmail"
              :isError="emailError"
              :errorWord="emailErrorWord"
              :disabled="htmlDisabled"></my-input>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
          </div>
          <div class="group-content">
            <my-input
              v-model="customTaskForm.FTP"
              :disabled="htmlDisabled"></my-input>
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
              :defaultValue.sync="customTaskForm.outputType"
              :disabled="htmlDisabled"></single-select>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
          </div>
          <div class="group-content">
            <my-textarea v-model="customTaskForm.describe"
                         placeholder="不超过100个字"
                         width="706px"
                         :disabled="htmlDisabled">
            </my-textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="group-content margin-left">
            <input type="checkbox" id="checkTask"
                   v-model="customTaskForm.isExamine"
                   :disabled="htmlDisabled">
            <label for="checkTask">考核任务</label>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label" :class="{disabled: htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">SQL语句：</span>
            </span>
          </div>
          <div class="group-content">
            <my-textarea v-model="customTaskForm.taskScript"
                         width="706px"
                         rows="5"
                         :disabled="htmlDisabled">
            </my-textarea>
          </div>
        </div>
        <div class="form-group" v-for="(item, index) in scriptList">
          <div class="group-content margin-left">
            <input type="checkbox" :id="'script' + index"
                   v-model="item.flag"
                   :disabled="htmlDisabled">
            <label :for="'script' + index"></label>
            <span class="script-label" :class="{disabled: htmlDisabled}">类型：</span>
            <single-select
              width="10%"
              :list="paramTypeList"
              :defaultValue.sync="item.type"
              :disabled="htmlDisabled">
            </single-select>
            <span class="script-label margin-left" :class="{disabled: htmlDisabled}">变量：</span>
            <my-input
              width="10%"
              v-model="item.param"
              :disabled="htmlDisabled">
            </my-input>
            <span class="script-label margin-left" :class="{disabled: htmlDisabled}">值：</span>
            <my-input
              width="25%"
              v-model="item.value"
              :disabled="htmlDisabled">
            </my-input>
            <span class="script-label margin-left" :class="{disabled: htmlDisabled}">数据集：</span>
            <single-select
              width="10%"
              :list="datasetList"
              :disabled="item.data && !item.data.indexOf('$') !== -1 && htmlDisabled"
              :defaultValue.sync="item.data">
            </single-select>
            <span class="script-label margin-left" :class="{disabled: htmlDisabled}">说明：</span>
            <my-input
              width="14%"
              v-model="item.desc"
              :disabled="htmlDisabled">
            </my-input>
            <span class="icon-plus operation-icon"
                  v-if="index === 0"
                  @click="plusScript(item)"><a-icon type="plus"></a-icon></span>
            <span class="icon-minus operation-icon"
                  v-else
                  @click="minusScript(index)"><a-icon type="minus"></a-icon></span>
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
            <button class="btn btn-sm btn-default" v-show="htmlType === 'add' || htmlType === 'edit'" @click="showSaveAsTemplateModal">另存为模板</button>
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
            <span class="content-text">{{customTaskForm.taskName}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行方式：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.mode | filterMode}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text" v-show="customTaskForm.mode == '2'">{{customTaskForm.cycleNumber}}{{customTaskForm.cycleType | filterCycleType}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行时间：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.executionTime.format('YYYY-MM-DD HH:mm')}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.mobile}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">邮箱：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.email}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.FTP}}</span>
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
            <span class="content-text">{{customTaskForm.outputType}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.describe}}</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-content margin-left">
            <span class="checkbox-flag" :class="{checked: customTaskForm.isExamine}"></span>
            <span>考核任务</span>
          </div>
        </div>
        <div class="form-group">
          <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">SQL语句：</span>
            </span>
          </div>
          <div class="group-content">
            <span class="content-text">{{customTaskForm.taskScript}}</span>
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
    <transition name="fade">
      <div class="modal-wrap" v-show="saveAsModalShow">
        <div class="modal">
          <div class="modal-header">
            <span class="text">另存为模板</span>
            <span class="close" @click="changeOwnerModalFlag = false"></span>
          </div>
          <div class="modal-body">
            <div class="form">
              <div class="form-group">
                <div class="group-label">
                <span class="label">
                  <span class="required-flag">*</span>
                  <span class="label-text">模板名称：</span>
                </span>
                </div>
                <div class="group-content">
                  <my-input width="380px"
                            v-model="newTemplateName"
                            :isError="newTemplateNameError"
                            :errorWord="newTemplateNameErrorWord"
                            @check="checkTemplateName">
                  </my-input>
                </div>
              </div>
              <div class="form-group">
                <div class="group-label">
                <span class="label">
                  <span class="required-flag">*</span>
                  <span class="label-text">归属分类：</span>
                </span>
                </div>
                <div class="group-content">
                  <single-select
                    width="380px"
                    :list="categoryList"
                    :defaultValue.sync="newTemplateCategoryId"
                    :isError="TemplateCategoryIdError"
                    :errorWord="TemplateCategoryIdErrorWord"
                    @check="checkTemplateCategoryId"></single-select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default btn-sm" @click="saveAsModalShow = false">取消</button>
            <button class="btn btn-primary btn-sm" @click="saveAsTemplate">确认</button>
          </div>
        </div>
      </div>
    </transition>
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
    import {saveCustomTask} from "../../assets/js/taskApi";
    import {saveAsTemplate} from '../../assets/js/customTaskApi'
    import {getCategoryList} from '../../assets/js/templateApi'
    import {MyMixin} from '../../assets/js/task/mixins.js'
export default {
  name: 'customExtract',
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
            taskState: '', // 任务状态
            htmlType: this.$route.query.htmlType || 'add',  // 类型：add(新增) edit(修改) see(查看) audit(审核)
            labelClassObject: {
                disabled: this.$route.query.htmlType === 'see' || this.$route.query.htmlType === 'audit'
            },
            // 任务form
            customTaskForm: {
                taskName: '',
                mode: '1',
                taskState: '1',
                cycleNumber: '1',
                cycleType: '1',
                executionTime: moment(),
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
            scriptList: [
                {flag: true, type: '0', param: '', value: '', data: '', desc: ''}
            ], // 任务数据列表
            saveAsModalShow: false,
            newTemplateName: '', // 另存为模板名称
            newTemplateNameError: false,
            newTemplateNameErrorWord: '请输入模板名称',
            categoryList: [], // 归属下拉列表
            newTemplateCategoryId: '', // 另存为模板 归属分类id
            TemplateCategoryIdError: false,
            TemplateCategoryIdErrorWord: '请选择归属分类',
        }
    },
    created(){
        let that = this;
        // 获取数据集列表
        that.queryDatasetList();
        // 获取模板归属分类列表
        that.queryCategoryList();
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
        /* 归属分类下拉列表 */
        queryCategoryList(){
            let that = this;
            let param = {userId: that.userId}
            getCategoryList(param).then(res => {
                let data = res.data;
                let list = data.resultData;
                console.log('归属分类下拉列表==',list)
                list.forEach(function(item){
                    let obj = {
                        text: item.categoryName,
                        value: item.categoryId,
                    }
                    that.categoryList.push(obj);
                })
            })
        },
        /* 赋值任务详情 */
        setTaskInfo(task){
            let that = this;
            // 赋值所选模板详情
            that.customTaskForm.taskName = task.taskName;
            that.customTaskForm.mode = task.taskMode;
            that.customTaskForm.taskState = task.taskState;
            that.customTaskForm.cycleNumber = task.cycleStep;
            that.customTaskForm.cycleType = task.taskCycle;
            that.customTaskForm.executionTime = moment(task.taskExecutetimeStr, 'YYYY-MM-DD HH:mm');
            that.customTaskForm.mobile = task.taskPhonenum;
            that.customTaskForm.email = task.taskEmail;
            that.customTaskForm.FTP = task.taskFtp;
            that.customTaskForm.outputType = task.fileType;
            that.customTaskForm.describe = task.taskDescribes;
            that.customTaskForm.taskScript = task.taskScript;
            that.customTaskForm.isExamine = task.isExamine == '1' ?  true : false;
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
            console.log(this.customTaskForm.taskName);
            let that = this;
            that.taskNameError = false;
            if (!that.customTaskForm.taskName) {
                that.taskNameError = true;
            }
        },
        /* 验证邮箱 */
        checkEmail() {
            console.log(this.customTaskForm.email, '邮箱text')
            let that = this;
            that.emailError = false;
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            let emailText = this.customTaskForm.email;
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
        /* 加一条参数列表 */
        plusScript(item) {
            let that = this;
            console.log(item, '当前item')
            if(that.htmlType === 'see' || that.htmlType === 'audit'){
                return false;
            }
            if (item.param === '' || item.value === '' || item.desc === '') {
                that.$myModal({
                    show: true,
                    type: 'warning',
                    title: '请填写完整信息'
                })
                return false;
            }
            let scirpt = {
                flag: true,
                type: '0',
                param: '',
                value: '',
                data: '',
                desc: ''
            }
            that.scriptList.push(scirpt);
        },
        /* 减一条参数列表 */
        minusScript(index) {
            let that = this;
            if(that.htmlType === 'see' || that.htmlType === 'audit'){
                return false;
            }
            that.scriptList.splice(index, 1);
        },
        // 获取模板参数列表参数
        getScriptList() {
            let that = this;
            that.customTaskForm.paramTypes = '';
            that.customTaskForm.cycleTypes = '';
            that.customTaskForm.taskParam = '';
            that.customTaskForm.taskValue = '';
            that.customTaskForm.taskSubValues = '';
            that.customTaskForm.taskDesc = '';
            that.scriptList.forEach(function (item) {
                that.customTaskForm.paramTypes += '~' + (item.flag ? '1':'0');
                that.customTaskForm.cycleTypes += '~' + item.type;
                that.customTaskForm.taskParam += '~' + item.param;
                that.customTaskForm.taskValue += '~' + item.value;
                if(item.data !== ''){
                    that.customTaskForm.taskSubValues += '~' + item.data;
                }else{
                    that.customTaskForm.taskSubValues += '~' + null;
                }
                that.customTaskForm.taskDesc += '~' + item.desc;
            })
        },
        getTaskParams(){
            let that = this;
            return {
                taskId: that.taskId,
                taskType: '1',
                taskName: that.customTaskForm.taskName,
                taskMode: that.customTaskForm.mode,
                cycleStep: that.customTaskForm.cycleNumber,
                taskCycle: that.customTaskForm.cycleType,
                taskExecutetimeStr: that.customTaskForm.executionTime.format('YYYY-MM-DD HH:mm'),
                taskPhonenum: that.customTaskForm.mobile,
                taskEmial: that.customTaskForm.email,
                taskFtp: that.customTaskForm.FTP,
                fileType: that.customTaskForm.outputType,
                isExamine: that.customTaskForm.isExamine ? '1' : '0',
                taskDescribes: that.customTaskForm.describe,
                taskScript: that.customTaskForm.taskScript,
                paramTypes: that.customTaskForm.paramTypes,
                cycleTypes: that.customTaskForm.cycleTypes,
                taskParam: that.customTaskForm.taskParam,
                taskValue: that.customTaskForm.taskValue,
                taskSubValues: that.customTaskForm.taskSubValues,
                taskDesc: that.customTaskForm.taskDesc,
                userId: that.userId
            }
        },
        /* 保存任务 */
        saveTask() {
            let that = this;
            if (that.taskNameError || that.emailError) {
                return;
            }
            store.dispatch("showLoading");
            that.getScriptList();
            let params = that.getTaskParams();
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
                this.customTaskForm.taskName = '';
                this.customTaskForm.mode = '';
                this.customTaskForm.cycleType = '1';
                this.customTaskForm.cycleNumber = '1';
                this.customTaskForm.executionTime = '';
                this.customTaskForm.mode = '';
                this.customTaskForm.email = '';
                this.customTaskForm.FTP = '';
                this.customTaskForm.outputType = 'txt';
                this.customTaskForm.describe = '';
                this.customTaskForm.isExamine = false;
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
            that.customTaskForm.taskName = template.templateName;
            that.customTaskForm.mode = template.templateMode;
            that.customTaskForm.cycleNumber = template.cycleStep;
            that.customTaskForm.cycleType = template.templateCycle;
            that.customTaskForm.executionTime = moment(template.executetimeStr, 'YYYY-MM-DD HH:mm');
            that.customTaskForm.mobile = template.phonenum;
            that.customTaskForm.email = template.email;
            that.customTaskForm.FTP = template.ftp;
            that.customTaskForm.outputType = template.fileType;
            that.customTaskForm.describe = template.describes;
            that.customTaskForm.taskScript = template.templateScript;
            that.customTaskForm.isExamine = template.isExamine == '1' ?  true : false;
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
        showSaveAsTemplateModal(){
            let that = this;
            that.saveAsModalShow = true;
            that.newTemplateNameError = false;
            that.TemplateCategoryIdError = false;
            that.newTemplateName = '';
            that.newTemplateCategoryId = '';
        },
        checkTemplateName(){
            let that = this;
            if(that.newTemplateName === ''){
                that.newTemplateNameError = true;
            }else{
                that.newTemplateNameError = false;
            }
        },
        checkTemplateCategoryId(){
            let that = this;
            if(that.newTemplateCategoryId === ''){
                that.TemplateCategoryIdError = true;
            }else{
                that.TemplateCategoryIdError = false;
            }
        },
        /* 另存为模板 */
        saveAsTemplate(){
            let that = this;
            if (that.taskNameError || that.emailError) {
                return;
            }
            that.checkTemplateName();
            that.checkTemplateCategoryId();
            if(that.newTemplateNameError || that.TemplateCategoryIdError){
                return;
            }
            store.dispatch("showLoading");
            that.getScriptList();
            let params = that.getTaskParams();
            params.templateName = that.newTemplateName;
            params.categoryId = that.newTemplateCategoryId;
            saveAsTemplate(params).then(res => {
                store.dispatch("hideLoading");
                console.log('另存为模板===',res.data);
                that.saveAsModalShow = false;
            })
        }
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
      .group-content {

        .operation-icon {
          display: inline-block;
          width: 28px;
          height: 28px;
          margin-left: 8px;
          line-height: 28px;
          text-align: center;
          background: #595959;
          cursor: pointer;
          transition: @transition-base;
          &:hover{
            background: #737373;
          }
        }
      }
      .info-form{
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
      .modal-wrap {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);

        .modal {
          position: absolute;
          width: 500px;
          height: 220px;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          background: #252525;

          .modal-header {
            height: 44px;
            line-height: 44px;
            text-align: center;
            border-bottom: 1px solid #0d0d0d;

            .text {
              font-size: 18px;
              font-weight: bold;
            }
          }

          .modal-body {
            padding: 0 20px;

            .form-group {
              width: 100%;
              margin: 0 auto 24px;
              .group-label{
                min-width: 82px;
              }
          }
          }

          .modal-footer {
            padding: 0 12px;
            text-align: right;
          }
        }
      }
    }

    &.lightTheme {
      // lightTheme style

    }

  }
</style>
