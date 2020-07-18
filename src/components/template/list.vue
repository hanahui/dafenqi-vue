<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>模板管理</div>
    </div>
    <div class="search-block">
      <div class="search-group">
        <div class="search-label">
          <span class="label">模板名称：</span>
        </div>
        <div class="search-content">
          <my-input v-model="searchParam.templateName"></my-input>
        </div>
        <div class="search-label margin-left">
          <span class="label">模板类别：</span>
        </div>
        <div class="search-content">
          <single-select :list="templateTypeList" :defaultValue.sync="searchParam.templateCategory"></single-select>
        </div>
        <div class="search-label margin-left">
          <span class="label">创建人：</span>
        </div>
        <div class="search-content">
          <my-input v-model="searchParam.userName"></my-input>
        </div>
      </div>
      <div class="search-group">
        <div class="search-label">
          <span class="label">创建时间：</span>
        </div>
        <div class="search-content" style="width: 164px;">
          <a-date-picker
            placeholder="请选择"
            format="YYYY-MM-DD"
            :getCalendarContainer="getCalendarContainer()"
            :value="searchTime"
            @change="dateChanged"/>
        </div>
        <div class="search-label margin-left">
          <span class="label">归属分类：</span>
        </div>
        <div class="search-content">
          <single-select :list="categoryList" :defaultValue.sync="searchParam.categoryId"></single-select>
        </div>
        <button class="btn btn-sm btn-primary" style="margin-left: 24px;" @click="init">查询</button>
        <button class="btn btn-sm btn-default" @click="resetSearchForm">重置</button>
        <button class="btn btn-sm btn-default" @click="add">新增</button>
      </div>
    </div>
    <div class="table-block">
      <!-- 列表 -->
      <div class="table-wrapper">
        <my-table :cols='cols' :tableData='tableData'>
          <template slot="templateType" slot-scope="{record}">{{record.templateType == '1' ? '私有' : '公有'}}</template>
          <template slot="templateCategory" slot-scope="{record}">{{record.templateCategory == '1' ? '自定义' : '配置'}}</template>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" @click="see(record.templateId,'see')">查看</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="deleteTemplate(record.templateId)">删除</span>
            <span class="operation-line"></span>
            <span class="curp url operation-btn" @click="edit(record.templateId)">修改</span>
            <span class="curp url operation-btn more">
              <span class="icon iconfont">&#xe736;</span>
              <div class="more-wrapper tooltip-box">
                <div class="arrow tooltip-arrow"></div>
                <div class="tooltip-content">
                  <ul class="operation-list">
                    <li class="operation-item" @click="showModal(record.templateId,record.userName)">修改归属人</li>
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
    <div class="modal-wrap" v-show="changeOwnerModalFlag">
      <div class="modal">
        <div class="modal-header">
          <span class="text">修改归属人</span>
          <span class="close"></span>
        </div>
        <div class="modal-body">
          <div class="form">
            <div class="form-group">
              <div class="group-label">
                <span class="label">
                  <span class="label-text">创建人：</span>
                </span>
              </div>
              <div class="group-content">
                <my-input width="380px"
                          :value="oldCreator"
                          :disabled="true"></my-input>
              </div>
            </div>
            <div class="form-group">
              <div class="group-label">
                <span class="label">
                  <span class="label-text">新归属人：</span>
                </span>
              </div>
              <div class="group-content">
                <single-select
                  width="380px"
                  :list="userList"
                  :defaultValue.sync="newOwner"
                  :isError="ownerError"
                  :errorWord="ownerErrorWord"></single-select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default btn-sm" @click="changeOwnerModalFlag = false">取消</button>
          <button class="btn btn-primary btn-sm" @click="changedOwner">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import moment from 'moment'
    import {mapGetters, mapActions} from 'vuex'
    import myInput from '../form/input'
    import singleSelect from '../form/singleSelect'
    import myTable from '../customTable'
    import paging from '../customPaging'
    import {getTemplateList, getCategoryList, getUserList, deleteTemplate, updateTemplateOwner} from '../../assets/js/templateApi'

    export default {
        name: "templateList",
        components: {
            'my-table': myTable,
            'my-paging': paging,
            'my-input': myInput,
            'single-select': singleSelect
        },
        data() {
            return {
                // userId: window.user ? window.user.id : '10001',
                userId: 'd5b23873-c159-4358-a32f-e46804617561',
                searchParam: {
                    templateName: this.$store.getters.templateName,
                    templateCategory: this.$store.getters.templateType,
                    userName: this.$store.getters.templateCreator,
                    createTimeStr: this.$store.getters.templateCreateTime,
                    categoryId: this.$store.getters.templateCategoryId,
                },
                searchTime: this.$store.getters.templateCreateTime ? moment(this.$store.getters.templateCreateTime, 'YYYY-MM-DD') : undefined,
                // 模板类别列表
                templateTypeList: [
                    {text: '配置', value: '0', disabled: true},
                    {text: '自定义', value: '1'},
                ],
                // 归属分类列表
                categoryList: [],
                // 归属人下拉列表
                userList: [],
                changeOwnerModalFlag: false,
                changeTemplateId: '',
                oldCreator: '',
                newOwner: '',
                ownerError: false,
                ownerErrorWord: '请选择新的归属人!',
                cols: [
                    {title: '模板名称', width: 'auto', align: 'left', key: 'templateName',},
                    {title: '模板类型', width: 'auto', align: 'left', key: 'templateType', slot: 'templateType'},
                    {title: '模板类别', width: 'auto', align: 'left', key: 'templateCategory', slot: 'templateCategory'},
                    {title: '创建人', width: 'auto', align: 'left', key: 'userName'},
                    {title: '创建时间', width: 'auto', align: 'left', key: 'createTimeStr'},
                    {title: '操作', width: '176px', align: 'left', slot: 'operation'},
                ],
                tableData: [],
                curPage: this.$store.getters.templatePageNum,
                pageSize: this.$store.getters.templatePageSize,
                totalPage: 1,
            }
        },
        created() {
            // 获取归属分类下拉列表
            this.queryCategoryList();
            // 获取归属人下拉列表
            this.queryUserList();
        },
        mounted: function () {
            var that = this;
            that.init();
        },
        methods: {
            ...mapActions(['setTemplateName', 'setTemplateType', 'setTemplateCreator', 'setTemplateCreateTime', 'setTemplateCategoryId', 'setTemplatePageNum', 'setTemplatePageSize']),
            moment,
            getCalendarContainer() {
                return triggerNode => triggerNode.parentNode;
            },
            /* 初始模板列表  */
            init: function () {
                var that = this;
                let params = {
                    templateName: that.searchParam.templateName,
                    templateCategory: that.searchParam.templateCategory,
                    userName: that.searchParam.userName,
                    createTimeStr: that.searchParam.createTimeStr,
                    categoryId: that.searchParam.categoryId,
                    pageNum: that.curPage,
                    pageSize: that.pageSize,
                    userId: that.userId,
                }
                getTemplateList(params).then(res => {
                    console.log('数据集列表===', res.data)
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
            /* 保存页面缓存变量 */
            saveHtmlCache() {
                let that = this;
                console.log('save cache===', that.searchParam, that.pageSize,that.curPage)
                that.setTemplateName(that.searchParam.templateName);
                that.setTemplateType(that.searchParam.templateCategory);
                that.setTemplateCreator(that.searchParam.userName);
                that.setTemplateCreateTime(that.searchParam.createTimeStr);
                that.setTemplateCategoryId(that.searchParam.categoryId);
                that.setTemplatePageNum(that.curPage);
                that.setTemplatePageSize(that.pageSize);
            },
            /* 归属分类下拉列表 */
            queryCategoryList() {
                let that = this;
                let param = {userId: that.userId}
                getCategoryList(param).then(res => {
                    let data = res.data;
                    let list = data.resultData;
                    console.log('归属分类下拉列表==', list)
                    list.forEach(function (item) {
                        let obj = {
                            text: item.categoryName,
                            value: item.categoryId,
                        }
                        that.categoryList.push(obj);
                    })
                })
            },
            /* 归属人下拉列表 */
            queryUserList() {
                let that = this;
                getUserList().then(res => {
                    console.log('归属人下拉列表==', res.data.resultData)
                    let data = res.data;
                    let list = data.resultData;
                    list.forEach(function (item) {
                        let obj = {
                            text: item.name,
                            value: item.id,
                        }
                        that.userList.push(obj);
                    })
                })
            },
            dateChanged(moment, timeStr) {
                console.log(moment, '选择date');
                this.searchTime = moment;
                this.searchParam.createTimeStr = timeStr;
            },

            /* 重置search form */
            resetSearchForm() {
                let that = this;
                that.searchParam.templateName = '';
                that.searchParam.templateCategory = '';
                that.searchParam.userName = '';
            },

            /* 跳转新增数据集 */
            add() {
                let that = this;
                that.saveHtmlCache();
                that.$router.push({
                    path: '/templateList/add'
                })
            },

            /* 查看模板 */
            see(id) {
                let that = this;
                that.saveHtmlCache();
                that.$router.push({
                    path: '/templateList/detail',
                    query: {
                        templateId: id,
                        htmlType: 'see'
                    }
                })
            },

            /*  修改模板 */
            edit(id) {
                let that = this;
                that.saveHtmlCache();
                that.$router.push({
                    path: '/templateList/edit',
                    query: {
                        templateId: id,
                        htmlType: 'edit'
                    }
                })
            },


            /* 显示修改归属人弹窗 */
            showModal(templateId, userName) {
                let that = this;
                that.changeTemplateId = templateId;
                that.oldCreator = userName;
                that.changeOwnerModalFlag = true;
            },
            checkOwner() {
                let that = this;
                that.ownerError = false;
                if (that.newOwner === '') {
                    that.ownerError = true;
                    return false;
                }
            },
            /* 修改归属人 */
            changedOwner() {
                let that = this;
                if (that.ownerError) {
                    return;
                }
                ;
                let params = {templateId: that.changeTemplateId, userId: that.newOwner};
                updateTemplateOwner(params).then(res => {
                    console.log('修改归属人=', res.data)
                    let data = res.data;
                    if (data.retCode == '0') {
                        // 获取列表
                        that.init();
                        that.changeOwnerModalFlag = false;
                    }
                    else {
                        // 删除失败
                        that.$myModal({
                            show: true,
                            title: '归属人修改失败!',
                            type: 'error'
                        })
                    }
                })
            },

            /* 删除模板 */
            deleteTemplate(id) {
                let that = this;
                let param = {templateId: id};
                that.$myModal({
                    show: true,
                    type: 'confirm',
                    title: '确认要删除该模板吗？',
                    onOk: function () {
                        deleteTemplate(param).then(res => {
                            console.log('删除模板===', res.data);
                            let data = res.data;
                            if (data.retCode == '0') {
                                // 获取列表
                                that.init()
                            }
                            else {
                                // 删除失败
                                that.$myModal({
                                    show: true,
                                    title: '模板删除失败!',
                                    type: 'error'
                                })
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/list';
  @import '../../assets/css/extractForm';

  #main {
    .search-block {
      .search-group {
        display: flex;
        line-height: 28px;
        margin-bottom: 16px;

        .search-label {
          &.margin-left {
            margin-left: 24px;
          }
        }
      }
    }

    .table-block {
      margin-top: 24px;
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
          }
        }

        .modal-footer {
          padding: 0 12px;
          text-align: right;
        }
      }
    }
  }
</style>
