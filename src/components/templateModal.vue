<!-- 选择模板弹窗组件 -->
<template>
  <div class="modal-wrapper" v-show="show">
    <div class="modal-box">
      <div class="modal-header">
        选择模板
        <span class="modal-close" @click="$emit('close')">x</span>
      </div>
      <div class="modal-body">
        <div class="search-form form">
          <div class="form-group">
            <div class="group-item">
              <div class="form-label">
                <span class="label">模板名称：</span>
              </div>
              <div class="form-content">
                <my-input
                  v-model="modalSearchForm.templateName"></my-input>
              </div>
            </div>
            <div class="group-item">
              <div class="form-label">
                <span class="label">模板类型：</span>
              </div>
              <div class="form-content">
                <single-select
                  :list="templateTypeList"
                  :defaultValue.sync="modalSearchForm.templateType"></single-select>
              </div>
            </div>
            <div class="group-item">
              <div class="form-label">
                <span class="label">创建人：</span>
              </div>
              <div class="form-content">
                <my-input
                  v-model="modalSearchForm.creator"></my-input>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="group-item">
              <div class="form-label">
                <span class="label">创建时间：</span>
              </div>
              <div class="form-content">
                <a-date-picker
                  dropdownClassName="customDatepicker"
                  placeholder="请选择"
                  :getCalendarContainer="getCalendarContainer()"
                  :allowClear="false"
                  @change="selectedTime"/>
              </div>
            </div>
            <div class="group-item">
              <div class="form-label disabled">
                <span class="label">归属分类：</span>
              </div>
              <div class="form-content">
                <single-select :disabled="true"></single-select>
              </div>
            </div>
            <div class="group-item">
              <div class="form-label">
                <span class="label"></span>
              </div>
              <div class="form-content font-size0" style="width: 164px;">
                  <span>
                    <button class="btn btn-sm btn-primary" @click="queryTemplateList">查询</button>
                  </span>
                <span>
                    <button class="btn btn-sm btn-default" @click="resetTemplateSearchForm">重置</button>
                  </span>
              </div>
            </div>
          </div>
        </div>
        <div class="template-table">
          <my-table style="margin-bottom: 24px;" :table-data="templateTableData"
                    :cols="templateCols" @selectRow="selected">
            <template slot="templateType" slot-scope="{record}">{{record.templateType == '1' ? '私有' : '公有'}}</template>
          </my-table>
          <div class="paging-wrapper">
            <my-paging :cur-page.sync="curPage"
                       :page-size.sync="pageSize"
                       :total-page.sync="totalPage"
                       :page-size-show="false"
                       @changed="queryTemplateList"></my-paging>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
    import moment from  'moment'
    import customTable from "./customTable";
    import customPaging from "./customPaging";
    import myInput from './form/input'
    import singleSelect from "./form/singleSelect";
    import {getTemplateList} from '../assets/js/templateApi'
    export default {
        name: "templateModal",
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        components: {
            'my-table': customTable,
            'my-paging': customPaging,
            'my-input': myInput,
            'single-select': singleSelect,
        },
        data(){
            return {
                // userId: window.user ? window.user.id : '10001', // 登录用户ID
                userId: 'd5b23873-c159-4358-a32f-e46804617561', // 测试
                modalShow: this.show,
                modalSearchForm: {
                    templateName: '',
                    templateType: '1',
                    creator: '',
                    createTime: '',
                    categoryId: ''
                },
                templateTypeList: [
                    {text: '全部', value: ''},
                    {text: '配置', value: '0'},
                    {text: '自定义', value: '1'}
                ],
                templateTableData: [], // 模板列表
                templateCols: [
                    {title: '模板名称', key: 'templateName', tooltip: true, width: '30%'},
                    {title: '模板类型', key: 'templateType', tooltip: true, width: '20%',slot: 'templateType'},
                    {title: '创建人', key: 'userName', tooltip: true, width: '20%'},
                    {title: '创建时间', key: 'createTimeStr', tooltip: true, width: '30%'},
                ],
                curPage: 1,
                pageSize: 10,
                totalPage: 0,
            }
        },
        created(){
            let that = this;
            that.queryTemplateList();
        },
        methods: {
            moment,
            getCalendarContainer() {
                return triggerNode => triggerNode.parentNode;
            },
            /* 选择datepicker */
            selectedTime: function (time) {
                // console.log(time, 'date picker changed')
                this.modalSearchForm.createTime = time;
            },
            /* 重置模板search form */
            resetTemplateSearchForm: function () {
                this.modalSearchForm.templateName = '';
                this.modalSearchForm.templateType = '1';
                this.modalSearchForm.creator = '';
                this.modalSearchForm.createTime = '';
                this.modalSearchForm.categoryId = '';
            },
            /* 查询模板列表 */
            queryTemplateList() {
                let that = this;

                let params = {
                    pageNum: that.curPage,
                    pageSize: that.pageSize,
                    templateName: that.modalSearchForm.templateName,
                    templateCategory: that.modalSearchForm.templateType,
                    userName: that.modalSearchForm.creator,
                    categoryId: that.modalSearchForm.categoryId,  // 归属分类id
                    userId: that.userId
                }
                if(that.modalSearchForm.createTime !== ''){
                    params.createTimeStr = that.modalSearchForm.createTime.format('YYYY-MM-DD')
                }else{
                    params.createTimeStr = that.modalSearchForm.createTime
                }
                getTemplateList(params).then(res => {
                    let result = res.data;
                    if (result.retCode == '0') {
                        let datas = result.resultData
                        that.totalPage = datas.pages;
                        that.templateTableData = datas.list;
                    }
                })
            },
            selected(template){
                let that = this;
                console.log('选择的模板==', template);
                that.$emit('selected',template);
            }
        }
    }
</script>

<style lang="less" scoped>
  @import '../assets/css/extractForm';
  #app {
    &.darkTheme {
      @disabled-text-color: #4d4d4d;
      @modal-background: #252525;
      @border-color: #0d0d0d;
      // darkTheme style
      .modal-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        overflow: auto;
        z-index: 100;

        .modal-box {
          position: relative;
          width: 60%;
          margin: 30px auto 0;
          background: @modal-background;

          .modal-header {
            height: 44px;
            line-height: 44px;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            text-align: center;
            border-bottom: 1px solid @border-color;

            .modal-close {
              float: right;
              display: inline-block;
              width: 40px;
              text-align: center;
              cursor: pointer;
            }
          }

          .modal-body {
            min-height: 400px;
            padding: 0 16px 24px;

            .search-form {
              .form-group {
                justify-content: space-around;

                .group-item {
                  display: inline-flex;

                  .form-label {
                    min-width: 80px;
                    text-align: right;

                    &.disabled {
                      color: @disabled-text-color;
                    }
                  }
                }
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
