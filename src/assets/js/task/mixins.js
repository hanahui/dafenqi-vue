/* 任务共用方法 */
import {firstAudit,secondAudit} from "../taskApi";
import {getDatasetList} from "../datasetApi";
import {getCustomTaskInfo} from "../customTaskApi";
import {getTemplateList,getTemplateInfo} from '../templateApi'
export const MyMixin = {
  data: function(){
    return {
      // userId: window.user ? window.user.id : '10001', // 登录用户ID
      userId: 'd5b23873-c159-4358-a32f-e46804617561', // 测试
      userName: window.user ? window.user.name : '测试',
      htmlType: this.$route.query.htmlType ||  'add',  // 类型：add(新增) edit(修改) see(查看) audit(审核)
      modeList: [
        {text: '一次性任务', value: '1'},
        {text: '周期性任务', value: '2'}
      ],
      cycleTypeList: [
        {text: '日', value: '1'},
        {text: '周', value: '2'},
        {text: '月', value: '3'},
      ],
      cycelNumberList: [
        {text: '1', value: '1'},
        {text: '2', value: '2'},
        {text: '3', value: '3'},
        {text: '4', value: '4'},
        {text: '5', value: '5'},
        {text: '6', value: '6'},
        {text: '7', value: '7'},
        {text: '8', value: '8'},
        {text: '9', value: '9'},
        {text: '10', value: '10'},
        {text: '11', value: '11'},
        {text: '12', value: '12'},
        {text: '13', value: '13'},
        {text: '14', value: '14'},
        {text: '15', value: '15'},
        {text: '16', value: '16'},
        {text: '17', value: '17'},
        {text: '18', value: '18'},
        {text: '19', value: '19'},
        {text: '20', value: '20'},
        {text: '21', value: '21'},
        {text: '22', value: '22'},
        {text: '23', value: '23'},
        {text: '24', value: '24'},
        {text: '25', value: '25'},
        {text: '26', value: '26'},
        {text: '27', value: '27'},
        {text: '28', value: '28'},
        {text: '29', value: '29'},
        {text: '30', value: '30'},
      ],
      outputList: [
        {text: 'txt', value: 'txt'},
        {text: 'excel', value: 'excel'}
      ],
      paramTypeList: [
        {text: '开始时间', value: '1'},
        {text: '结束时间', value: '2'},
      ],
      templateModalShow: false,
      templateTypeList: [
        {text: '全部', value: ''},
        {text: '配置', value: '0'},
        {text: '自定义', value: '1'}
      ],
      categoryList: [], // 归属下拉列表
      auditType: this.$route.query.auditType, // 审核类型(一审：firstAudit  二审：secondAudit)
      auditValue: this.$route.query.auditType === 'firstAudit' ? '10' : '2', // 审核是否通过
      auditOpinion: '', // 审核意见
      auditHistoryData: [], // 审核记录列表
      auditHistoryCols: [
        {title: '审核人', key: 'userName'},
        {title: '审核时间', key: 'examineTime'},
        {title: '审核结果', key: 'ispass', slot: 'ispass'},
        {title: '审核意见', key: 'examineSuggestion'},
      ], // 审核记录表格表头
      datasetList: [], // 数据集列表
    }
  },
  computed: {
    pageTitle() {
      switch (this.htmlType) {
        case 'add':
          return '新增'
          break;
        case 'see':
          return '查看'
          break;
        case  'edit':
          return '修改'
          break;
        case 'audit':
          return '审核'
          break;
      }
    },
    htmlDisabled: function(){
      return this.htmlType === 'audit' ? true : false
    }
  },
  filters: {
    filterIspass(ispass){
      return ispass == '0' ? '审核不通过' : '审核通过'
    },
    filterSourceType(type){
      return type == '2' ? '手动上传' : ''
    },
    filterMode(mode){
      return mode == '1' ? '一次性任务' : (mode == '2' ? '周期性任务' : '')
    },
    filterCycleType(type){
      return type === '1' ? '日' : (type === '2' ? '周' : (type === '3' ? '月' : ''))
    }
  },
  methods: {
    // 匹配归属分类Id
    matchCategory(categoryId){
      let that = this;
      for(let i = 0, len = that.categoryList.length; i < len; i++){
        if(categoryId == that.categoryList[i].value){
          return that.categoryList[i].text;
        }
      }
    },
    /* 获取数据集列表 */
    queryDatasetList(){
      let that = this;
      let params = {
        id: that.userName,
      }
      getDatasetList(params).then(res => {
        console.log('获取数据集列表===', res.data)
        let data = res.data;
        let result = data.resultData;
        that.datasetList = result.list;
      })
    },
    /* 选择模板 */
    choseTemplate: function (template) {
      let that = this;
      // 关闭modal
      that.templateModalShow = false;
      console.log(template.templateId, '选择的模板id');
      let params = {templateId: template.templateId};
      getTemplateInfo(params).then(res => {
        console.log('获取模板详情===',res.data);
        let data = res.data;
        let template = data.resultData || {};
        that.setTemplateInfo(template);
      })
    },
    /* 获取任务详情 */
    queryTaskDetail(){
      let that = this;
      let params = {taskId: that.taskId};
      getCustomTaskInfo(params).then(res => {
        console.log('任务详情===',res.data);
        let data = res.data;
        that.setTaskInfo(data.resultData)
      })
    },
    /* show 模板modal */
    showTemplateModal() {
      let that = this;
      that.templateModalShow = true;
    },
    // 审核
    auditTask() {
      let that = this;
      let params = {
        taskId: that.taskId,
        taskstate: that.auditValue,
        suggestion: that.auditOpinion,
        userId: that.userId
      }
      if(that.auditType === 'firstAudit'){
        // 一审审核
        firstAudit(params).then(res => {
          console.log('任务一审审核===',res.data);
          if(that.auditValue == '4'){
            // 审核不通过
            that.$router.push({
              path: '/tasklist'
            })
          }else{
            that.$router.push({
              path: '/secondAudit'
            })
          }
        })
      }else if(that.auditType === 'secondAudit'){
        // 二审审核
        secondAudit(params).then(res => {
          console.log('任务二审审核===',res.data);
          that.$router.push({
            path: '/tasklist'
          })
        })
      }
    },
    // 返回
    back(){
      history.go(-1);
    }
  }
}
