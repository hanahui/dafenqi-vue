<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>模板管理{{' -  ' + pageTitle}}</div>
    </div>
    <!--add form block-->
    <div class="form" v-if="htmlType !== 'see'">
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板类型：</span>
            </span>
        </div>
        <div class="group-content">
          <input type="radio"
                 name="templateType"
                 id="private" value="1"
                 :disabled="htmlDisabled"
                 v-model="templateForm.templateType"><label for="private">私有</label>
          <input type="radio"
                 name="templateType"
                 id="public" value="0"
                 :disabled="htmlDisabled"
                 v-model="templateForm.templateType"><label for="public">公有</label>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板类别：</span>
            </span>
        </div>
        <div class="group-content">
          <input type="radio"
                 name="templateMode"
                 id="custom" value="1"
                 v-model="templateForm.templateMode"
                 :disabled="htmlDisabled"><label for="custom">自定义</label>
          <input type="radio"
                 name="templateMode"
                 disabled id="configure" value="0"
                 v-model="templateForm.templateMode"><label for="configure">配置</label>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板名称：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            width="396px"
            v-model="templateForm.templateName"
            @check="checkTemplateName"
            :isError="templateNameError"
            :errorWord="templateNameErrorWord"
            :disabled="htmlDisabled"></my-input>
        </div>
        <div class="group-label inline-group-label" :class="{'disabled': htmlDisabled}">
          <span class="label">
              <span class="required-flag">*</span>
            <span class="label-text">归属分类：</span>
            </span>
        </div>
        <div class="group-content">
          <single-select
            :list="categoryList"
            :defaultValue.sync="templateForm.categoryId"
            :isError="categoryError"
            :errorWord="categoryErrorWord"
            :disabled="htmlDisabled">
          </single-select>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
        </div>
        <div class="group-content">
          <single-select
            width="60px"
            style="margin-right: 8px;"
            :list="cycelNumberList"
            :defaultValue.sync="templateForm.cycleNumber"
            :disabled="templateForm.mode !== '2' || htmlDisabled"
          ></single-select>
          <single-select
            width="60px"
            :list="cycleTypeList"
            :defaultValue.sync="templateForm.cycleType"
            :disabled="templateForm.mode !== '2' || htmlDisabled"
          ></single-select>
        </div>
        <div class="group-label inline-group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行方式：</span>
            </span>
        </div>
        <div class="group-content">
          <single-select
            :list="modeList"
            :defaultValue.sync="templateForm.mode"
            :disabled="htmlDisabled"></single-select>
        </div>
        <div class="group-label inline-group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行时间：</span>
            </span>
        </div>
        <div class="group-content" style="width: 164px;">
          <a-date-picker
            :class="{error: executionError}"
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm"
            :getCalendarContainer="getCalendarContainer()"
            :allowClear="false"
            :showToday="false"
            :showTime="{
              allowClear: false,
              format: 'HH:mm',
              defaultValue: moment('00:00','HH:mm'),
              minuteStep: 5,
            }"
            :disabled="htmlDisabled"
            v-model="templateForm.executetime"/>
<!--          <span class="date-remark">注：请在12点~20点之间选择！</span>-->
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            v-model="templateForm.mobile"
            :disabled="htmlDisabled"></my-input>
        </div>
        <div class="group-label inline-group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="label-text">邮箱：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            width="411px"
            placeholder="输入多个邮箱时请用逗号分隔"
            v-model="templateForm.email"
            @check="checkEmail"
            :isError="emailError"
            :errorWord="emailErrorWord"
            :disabled="htmlDisabled"></my-input>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            v-model="templateForm.ftp"
            :disabled="htmlDisabled"></my-input>
        </div>
        <div class="group-label inline-group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">输出文件格式：</span>
            </span>
        </div>
        <div class="group-content">
          <single-select
            :list="outputList"
            :defaultValue.sync="templateForm.outputType"
            :disabled="htmlDisabled"></single-select>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
        </div>
        <div class="group-content">
          <my-textarea v-model="templateForm.describe"
                       placeholder="不超过100个字"
                       width="664px"
                       :disabled="htmlDisabled">
          </my-textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="group-content margin-left">
          <input type="checkbox" id="checkTask"
                 v-model="templateForm.isExamine"
                 :disabled="htmlDisabled">
          <label for="checkTask">考核任务</label>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label" :class="{'disabled': htmlDisabled}">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">SQL语句：</span>
            </span>
        </div>
        <div class="group-content">
          <my-textarea v-model="templateForm.sql"
                       width="664px"
                       rows="5"
                       :isError="sqlError"
                       :errorWord="sqlErrorWord"
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
            :disabled="item.data && item.data.indexOf('$') ===  -1 || htmlDisabled"
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
      <div class="form-group">
        <div class="group-label">
          <span class="label"></span>
        </div>
        <div class="group-content">
          <button class="btn btn-sm btn-primary" @click="saveTemplate" v-show="htmlType == 'add' || htmlType === 'edit'">保存</button>
          <button class="btn btn-sm btn-default" @click="resetTemplateForm" v-show="htmlType === 'add' || htmlType === 'edit'">重置</button>
          <button class="btn btn-sm btn-default" @click="back">返回</button>
        </div>
      </div>
    </div>
    <!--info form-->
    <div class="form info-form" v-if="htmlType === 'see'">
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板类型：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.templateType == '1' ? '私有模板' : '公有模板'}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板类别：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.templateMode == '1' ? '自定义' : '配置'}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">模板名称：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.templateName}}</span>
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
          <span class="content-text">{{matchCategory(templateForm.categoryId)}}</span>
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
          <span class="content-text">{{templateForm.mode == '1' ? '一次性任务' : '周期性任务'}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">任务周期：</span>
            </span>
        </div>
        <div class="group-content" v-show="templateForm.mode == '2'">
          <span class="content-text">{{templateForm.cycleNumber}}{{templateForm.templateCycle | filterCycleType}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">执行时间：</span>
            </span>
        </div>
        <div class="group-content" style="width: 164px;">
          <span class="content-text">{{templateForm.executetime.format('YYYY-MM-DD HH:mm:ss')}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">手机号码：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.mobile}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">邮箱：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.email}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">FTP路径：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.ftp}}</span>
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
          <span class="content-text">{{templateForm.outputType}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-label">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{templateForm.describe}}</span>
        </div>
      </div>
      <div class="form-group">
        <div class="group-content margin-left">
          <span class="checkbox-flag" :class="{checked: templateForm.isExamine}"></span>
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
          <span class="content-text">{{templateForm.sql}}</span>
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
          <button class="btn btn-sm btn-primary" @click="saveTemplate" v-show="htmlType == 'add' || htmlType === 'edit'">保存</button>
          <button class="btn btn-sm btn-default" @click="resetTemplateForm" v-show="htmlType === 'add' || htmlType === 'edit'">重置</button>
          <button class="btn btn-sm btn-default" @click="back">返回</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
    import moment from 'moment'
    import myInput from '../form/input'
    import singleSelect from '../form/singleSelect'
    import myTextarea from '../form/textarea'
    import {getDatasetList} from '../../assets/js/datasetApi'
    import {getCategoryList,saveTemplate,getTemplateInfo} from '../../assets/js/templateApi'
    import {MyMixin} from '../../assets/js/task/mixins.js'
    export default {
        name: 'templateAdd',
        mixins: [MyMixin],
        components: {
            'my-input': myInput,
            'single-select': singleSelect,
            'my-textarea': myTextarea
        },
        data() {
            return {
                templateId: this.$route.query.templateId || '',
                scriptList: [
                    {flag: true, type: '0', param: '', value: '', data: '', desc: ''}
                ], // 模板数据列表
                templateForm: {
                    templateType: '1',
                    templateMode: '1',
                    templateName: '',
                    categoryId: '',
                    cycleNumber: '1',
                    templateCycle: '1',
                    mode: '1',
                    mobile: '',
                    executetime: moment(),
                    email: '',
                    ftp: '',
                    outputType: 'txt',
                    describe: '',
                    isExamine: false,
                    sql: '',
                    paramTypes: '',
                    cycleType: '0',
                    cycleTypes: '',
                    templateParam: '',
                    templateValue: '',
                    templateDesc: '',
                    taskSubValues: '',
                },
                templateNameError: false,
                templateNameErrorWord: '请输入模板名称！',
                categoryError: false,
                categoryErrorWord: '请选择归属分类',
                executionError: false,
                executionErrorWord: '请选择执行时间!',
                emailError: false,
                emailErrorWord: '请输入正确邮件格式!',
                sqlError: false,
                sqlErrorWord: '请输入sql语句!',
            }
        },
        created() {
            // 获取归属下拉列表
            let that = this
            that.queryCategoryList();
            // 获取数据集下拉列表
            that.queryDatasetList();
            if(that.htmlType !== 'add'){
                // 获取模板详情
                console.log('模板id==', that.templateId);
                let params = {templateId: that.templateId};
                getTemplateInfo(params).then(res => {
                    console.log('获取模板详情===',res.data);
                    let data = res.data;
                    let template = data.resultData || {};
                    that.setTemplateFormParam(template);
                })
            }
        },
        mounted() {
            let that = this
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
            // 获取用户数据集列表
            queryDatasetList(){
                let that = this;
                let param = {id: that.userName,pageNum: 1, pageSize: 9999}
                getDatasetList(param).then(res => {
                    console.log(res.data, '数据集列表')
                    let data = res.data.resultData;
                    let list = data.list;
                    list.forEach(function(item){
                        let obj = {
                            text: item.datasetName,
                            value: item.datasetId
                        }
                        that.datasetList.push(obj);
                    })
                })
            },
            /* 验证模板名 */
            checkTemplateName() {
                let that = this;
                that.templateNameError = false;
                if (that.templateForm.templateName === '') {
                    that.templateNameError = true;
                    return false;
                }
            },
            /* 验证归属分类 */
            checkCategoryId() {
                let that = this;
                that.categoryError = false;
                console.log('check categoryID')
                if (that.templateForm.categoryId === '') {
                    that.categoryError = true;
                    return false;
                }
            },
            /* 验证执行时间 */
            checkExecutionTime(){
                let that = this;
                that.executionError = false;
            },
            /* 验证邮箱 */
            checkEmail() {
                let that = this;
                that.emailError = false;
                let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                let emailText = this.templateForm.email;
                if (emailText) {
                    if (emailText.indexOf(',') !== -1) {
                        let emailArr = emailText.split(',');
                        emailArr.forEach(function (item) {
                            if (!reg.test(item)) {
                                that.emailError = true;
                                return false;
                            }
                        })
                    }
                    else {
                        if (!reg.test(emailText)) {
                            that.emailError = true;
                            return false;
                        }
                    }
                }
            },
            /* 验证sql  */
            checkSQL() {
                let that = this;
                that.sqlError = false;
                if (that.templateForm.sql === '') {
                    that.sqlError = true;
                    return false;
                }
            },
            /* 加一条参数列表 */
            plusScript(item) {
                let that = this;
                console.log(item, '当前item')
                if(that.htmlType === 'see'){
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
                that.scriptList.splice(index, 1);
            },
            // 获取模板参数列表参数
            getScriptList() {
                let that = this;
                that.templateForm.paramTypes = '';
                that.templateForm.cycleTypes = '';
                that.templateForm.templateParam = '';
                that.templateForm.templateValue = '';
                that.templateForm.taskSubValues = '';
                that.templateForm.templateDesc = '';
                that.scriptList.forEach(function (item) {
                    that.templateForm.paramTypes += '~' + (item.flag ? '1':'0');
                    that.templateForm.cycleTypes += '~' + item.type;
                    that.templateForm.templateParam += '~' + item.param;
                    that.templateForm.templateValue += '~' + item.value;
                    if(item.data !== ''){
                        that.templateForm.taskSubValues += '~' + item.data;
                    }else{
                        that.templateForm.taskSubValues += '~' + null;
                    }
                    that.templateForm.templateDesc += '~' + item.desc;
                })
                that.templateForm.cycleType = that.scriptList[that.scriptList.length - 1].type;
            },
            checkScript() {
                let that = this;
                let flag = true;
                for (let i = 0; i < that.scriptList.length; i++) {
                    let item = that.scriptList[i];
                    if (item.param === '' && item.value === ''  && item.desc === '' || item.param !== '' && item.value !== ''  && item.desc !== '') {
                        flag = true;
                    }
                    else {
                        flag = false;
                        that.$myModal({
                            show: true,
                            title: '请填写第' + (i + 1) + '条完整信息',
                            type: 'warning'
                        })
                        return flag;
                    }
                }
                return flag;
            },
            /* 获取模板参数 */
            getTemplateFormParam(){
                let that = this;
                let params = {
                    templateName: that.templateForm.templateName,
                    templateType: that.templateForm.templateType,
                    templateCategory: that.templateForm.templateMode,
                    categoryId: that.templateForm.categoryId,
                    templateCycle: that.templateForm.templateCycle,
                    cycleStep: that.templateForm.cycleNumber,
                    templateMode: that.templateForm.mode,
                    executetimeStr: that.templateForm.executetime.format('YYYY-MM-DD HH:mm'),
                    phonenum: that.templateForm.mobile,
                    email: that.templateForm.email,
                    ftp: that.templateForm.ftp,
                    fileType: that.templateForm.outputType,
                    describes: that.templateForm.describe,
                    isExamine: that.templateForm.isExamine ? '1' : '0',
                    templateScript: that.templateForm.sql,
                    paramTypes: that.templateForm.paramTypes,
                    cycleTypes: that.templateForm.cycleTypes,
                    cycleType: that.templateForm.cycleType,
                    templateParam: that.templateForm.templateParam,
                    templateValue: that.templateForm.templateValue,
                    templateDesc: that.templateForm.templateDesc,
                    taskSubValues: that.templateForm.taskSubValues,
                    userId: that.userId,
                }
                if(that.htmlType === 'edit'){
                    params.templateId = that.templateId
                }
                return params;
            },
            /* 保存模板 */
            saveTemplate() {
                let that = this;
                that.checkTemplateName()
                // that.checkCategoryId()
                that.checkSQL()
                if(that.templateNameError || that.categoryError || that.sqlError){
                    return;
                }
                if(that.checkScript()) {
                    // console.log('通过');
                    that.getScriptList();
                }
                else {
                    return false;
                }

                let params = that.getTemplateFormParam();
                console.log('保存模板参数===',params)
                saveTemplate(params).then(res => {
                    console.log('保存模板===', res.data)
                    let data = res.data;
                    if(data.retCode == '0'){
                        // 保存成功
                        that.$router.push({
                            path: '/templateList',
                        })

                    }else{
                        // 模板保存失败
                        that.$myModal({
                            show: true,
                            title: '模板保存失败!',
                            type: 'error'
                        })
                    }
                })

            },
            /* 重置模板 */
            resetTemplateForm() {
                let that = this;
                that.templateForm.templateType = '1';
                that.templateForm.templateMode = '1';
                that.templateForm.templateName = '';
                that.templateForm.categoryId = '';
                that.templateForm.cycleNumber = '1';
                that.templateForm.cycleType = '1';
                that.templateForm.mode = '1';
                that.templateForm.mobile = '';
                that.templateForm.executetime = moment();
                that.templateForm.email = '';
                that.templateForm.ftp = '';
                that.templateForm.outputType = 'txt';
                that.templateForm.describe = '';
                that.templateForm.isExamine = false;
                that.templateForm.sql = '';
                that.templateForm.paramTypes = '';
                that.templateForm.cycleTypes = '';
                that.templateForm.templateParam = '';
                that.templateForm.templateValue = '';
                that.templateForm.taskSubValues = '';
                that.templateForm.templateDesc = '';
                that.scriptList = [
                    {flag: true, type: '0', param: '', value: '', data: '', desc: ''}
                ]
            },

            /* 赋值模板参数 */
            setTemplateFormParam(template){
                let that = this;
                that.templateForm.templateName = template.templateName;
                that.templateForm.templateType = template.templateType;
                that.templateForm.templateMode = template.templateCategory;
                that.templateForm.categoryId = template.categoryId;
                that.templateForm.templateCycle = template.templateCycle;
                that.templateForm.cycleNumber = template.cycleStep;
                that.templateForm.mode = template.templateMode;
                that.templateForm.executetime = moment(template.executetimeStr, 'YYYY-MM-DD HH:mm');
                that.templateForm.mobile = template.phonenum;
                that.templateForm.email = template.email;
                that.templateForm.ftp = template.ftp;
                that.templateForm.outputType = template.fileType;
                that.templateForm.describe = template.describes;
                that.templateForm.isExamine = template.isExamine == '1' ? true : false;
                that.templateForm.sql = template.templateScript;
                that.setScriptList(template);
            },
            /* 赋值script list */
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
        },
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/extractForm';

  #app {
    &.darkTheme {
      @disabled-text-color: #4d4d4d;
      @modal-background: #252525;
      @border-color: #0d0d0d;

      .form {
        .form-group {
          .group-label {
            &.inline-group-label {
              min-width: 66px;
              margin-left: 24px;
            }
          }
        }

        .group-content {
          input[type="radio"] {
            & + label {
              min-width: 88px;
            }
          }

          .date-remark {
            margin-left: 8px;
            color: #808080;
          }

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
    }
  }
</style>
