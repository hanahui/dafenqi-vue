<template>
  <div style="width: 100%; height:100%;">
    <div id="main" class="pd">
      <div class="bgd page-title">
        <div class="fl">标签管理</div>
        <!-- important and export -->
        <div class="export-wrapper fr" @click="exportClick">
          <img src="../../assets/img/icon-export.png" class="excel-img">
          <span class="imp-font">全量标签导出</span>
        </div>
        <div class="dividing-line fr" v-if="isAdmin">
          <span class="line"></span>
        </div>
      </div>

      <!-- 分类 -->
      <div class="xfxw fenlei-h clearFix">
        <!-- button -->
        <div class="fl font-size0">
          <button :class="tree.id==buttonId?'hot-button hot-button-blue':'hot-button'" v-for="(tree,index) in treeList" @click="buttonClick(tree.id)">{{tree.topic}}
          </button>
        </div>
        <div class="group fr flex">
          <div class="group" v-show="4 == buttonId || buttonId == 80">
            <button class="hot-button hot-button-blue add-button" v-on:click="labelEditClick('','add')"> +</button>
          </div>
          <!-- search -->
          <div class="search">
            <input class="searchKey" type="text" v-model="searchKey" placeholder="请输入标签名称" @keyup.enter="searchClick">
            <img class="search_img" src="../../assets/img/icon-search.png" @click="searchClick">
          </div>
        </div>
      </div>
      <div class="subList" v-show="4 != buttonId && 80 != buttonId">
        <div class="group fl" v-if="0 != childrenList.length">
          <span :class="tree.id==categoryId?'subItem subItemActive':'subItem'" v-for="(tree,index) in childrenList"
                v-on:click="childClick(tree.id)">{{tree.topic}}</span>
        </div>
      </div>
      <div class="table-border">
        <my-table :table-data="tableData" :cols="labelCols" @sort="sortHander">
						<span slot="labelFlag" slot-scope="{record}" class="mgr curp url more-info">
							<span><img src="../../assets/img/icon-detail.png" class="td-icon" alt=""></span>
							<div class="more-wrapper tooltip-box" style="right: -16px; top: 33px;">
								 <div class="arrow tooltip-arrow"></div>
								 <div class="tooltip-content">
									 <div class="detail">
										 <p class="detail-text" style="">口径：{{record.labelFlag}}</p>
									 </div>
								 </div>
							</div>
						</span>
          <span slot="more" slot-scope="{record}" class="mgr curp url more-info">
							<span><img src="../../assets/img/icon-more.png" class="td-icon" alt=""></span>
							<div class="more-wrapper tooltip-box" style="width: 190px; right: -16px; top: 33px;">
								 <div class="arrow tooltip-arrow"></div>
								 <div class="tooltip-content">
									 <div class="detail">
										 <p class="detail-text">标签名称：{{record.labelName}}</p>
										 <p class="detail-text">标签值：{{record.labelValues}}</p>
										 <p class="detail-text">创建人：{{record.createUserName}}</p>
										 <p class="detail-text">创建时间：{{record.createTime}}</p>
										 <p class="detail-text">状态：{{record.labelStatusName}}</p>
										 <p class="detail-text">数据源：{{record.labelDsName}}</p>
										 <p class="detail-text">更新时间：{{record.updateTime}}</p>
										 <p class="detail-text">更新频率：{{record.updateTimeTypeName}}</p>
									 </div>
								 </div>
							</div>
						</span>
          <template slot="operation" slot-scope="{record}">
            <span class="curp url operation-btn" v-if="!record.collectionId" @click="collectClick(record.labelId)">收藏</span>
            <span class="curp url operation-btn" v-else @click="cancelCollectionClick(record.collectionId)">取消收藏</span>
            <span class="operation-line" v-show="record.createUserId"></span>
            <span class="curp url operation-btn" v-show="record.createUserId" @click="labelEditClick(record.labelId,'see',record.product)">明细</span>
            <span class="operation-line" v-show="record.createUserId"></span>
            <span class="curp url operation-btn more" v-show="record.createUserId">
                                    <span>更多</span>
									<div class="more-wrapper tooltip-box">
										 <div class="arrow tooltip-arrow"></div>
										 <div class="tooltip-content">
											 <ul class="operation-list">
												 <li class="operation-item" @click="labelEditClick(record.labelId,'edit',record.product)">修改</li>
												 <li class="operation-item" @click="deleteLabel(record.labelId)">删除</li>
											 </ul>
										 </div>
									 </div>
                                </span>
          </template>
        </my-table>
        <!-- page -->
        <my-paging :total-page="totalPage" :cur-page.sync="curPage" :page-size.sync="pageSize" @changed="init"></my-paging>
      </div>
    </div>
    <!-- Modal -->
    <div class="mask" v-show="modalShow">
      <div class="modal fade" id="myModal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">批量导入</h4>
            </div>
            <div class="modal-body">
              <form class="form-inline">
                <div class="form-group">
                  <label for="">文件名字:</label>
                  <span class="excel-name" v-text="importFileName"></span>
                </div>
                <div class="form-group">
                  <input id="import" type="file" class="form-control hidden" @change="selectedFile">
                </div>
                <span class="browse-btn" @click="clickInput">
							浏览
							<img src="../../assets/img/excel.png" class="btn-icon">
						</span>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-default" @click="modalShow = false">取消</button>
              <button type="button" class="btn btn-sm btn-primary" @click="confirmImport">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery';
    import store from "../../store/index.js";
    import CustomTable from '../customTable'
    import CustomPaging from '../customPaging'
    import {getLabelTree, getLabelList, exportLabel, importLabel, deleteLabel} from "../../assets/js/labelApi";
    import {collectionGroup, cancelCollection} from "../../assets/js/myCollectionApi";

    export default {
        name: "list",
        components: {
            'my-table': CustomTable,
            'my-paging': CustomPaging
        },
        data() {
            return {
                isAdmin: window.user ? window.user.admin : false,
                localPath: '',//当前页路径
                userId: window.user ? window.user.username : '测试', //用户ID(改为用户手机号)测试
                userName: window.user ? window.user.name : '测试', // 用户名
                searchKey: this.$route.query.searchKey || '',//关键词
                buttonId: '4',//按钮标识
                categoryId: this.$route.query.categoryId || '',//类别ID
                thisLabelId: this.$route.query.thisLabelId || '', //标签id
                curPage: Number(this.$route.query.curPage) || 1,//当前页码
                totalPage: 0,//总页数条数
                pageSize: Number(this.$route.query.pageSize) || 10,//每页条数
                jumpPage: '',//跳转某页
                treeList: [],//标签树
                childrenList: [],//子节点(属性)
                tableData: [],//列表数据
                sortFlag: '',
                sortOrder: '',
                importFileName: '',//导入文件名
                labelCols: [
                    {title: '标签ID', key: 'labelId', tooltip: true, width: '10%'},
                    {title: '二级分类', key: 'categoryName', sort: true, tooltip: true, width: '18%'},
                    {title: '标签名称', key: 'labelName', tooltip: true, width: '17%'},
                    {title: '标签定义', key: 'labelDefine', tooltip: true, width: '15%'},
                    {title: '产品类型', key: 'product', sort: true, tooltip: true, width: '15%'},
                    {title: '口径', key: 'labelFlag', slot: 'labelFlag', width: '5%'},
                    {title: '更多', key: 'more', slot: 'more', width: '5%'},
                    {title: '操作', key: 'operation', slot: 'operation', width: '196px'},
                ],
                modalShow: false, //  modal显示
                labelImportUrl: '/labelsys-service/label/info/import', // 标签导入接口
            }
        },
        beforeMount: function () {
            var that = this;
            that.initTree();
        },
        watch: {
            treeList: function (val) {
                console.log("watch--->treeList--->val:", val);
                var that = this;
                console.log('that buttonId', this.$route.query.buttonId)
                if (!this.$route.query.buttonId) {
                    that.buttonId = val[0].id;
                }
                else {
                    that.buttonId = this.$route.query.buttonId;
                }
            },
            buttonId: function (val, oldVal) {
                console.log("watch--->buttonId--->val:", val, ",oldVal:", oldVal);
                var that = this;
                var treeList = that.treeList;
                var categoryId = that.categoryId;
                for (var i in treeList) {
                    var id = treeList[i].id;
                    if (val == id) {
                        var childrenList = treeList[i].children;
                        if (0 != childrenList.length) {
                            that.childrenList = childrenList;
                            if ("" == categoryId || "" != oldVal) {
                                that.categoryId = childrenList[0].id;
                            }
                        }
                        else {
                            that.childrenList = new Array();
                            if ("" == categoryId || "" != oldVal) {
                                that.categoryId = id;
                            }
                        }
                        that.init();
                        return;
                    }
                }
            },
        },
        methods: {
            /*
            * 初始化标签树
            */
            initTree: function () {
                var that = this;
                //标签树
                // loading
                store.dispatch("showLoading");
                console.log(window.user)
                let params = {userId: that.userId}
                getLabelTree(params).then(res => {
                    store.dispatch("hideLoading");
                    let result = res.data;
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        if (resultData) {
                            that.treeList = resultData;
                        }
                    }
                }).catch((error) => {
                    store.dispatch("hideLoading");
                })
            },
            /*
            * 初始化数据
            */
            init: function () {
                var that = this;
                that.tableData = [];
                var param = {
                    userId: that.userId,
                    searchKey: that.searchKey,
                    categoryId: that.categoryId,
                    curPage: that.curPage,
                    pageSize: that.pageSize,
                    sortFlag: that.sortFlag,
                    sortOrder: that.sortOrder
                };
                if (that.thisLabelId) {
                    param.thisLabelId = that.thisLabelId;
                }
                console.log("methods--->init--->param:", param);
                getLabelList(param).then(res => {
                    let result = res.data;
                    that.thisLabelId = '';
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        that.totalPage = resultData.totalPageCount;
                        that.curPage = resultData.curPage;
                        var data = resultData.data;
                        if (data) {
                            that.tableData = data;
                        }
                        else {
                            that.tableData = new Array();
                        }
                    }

                })
            },
            /* 数据排序 */
            sortHander: function (key, direction) {
                var that = this;
                key = key === 'categoryName' ? 'category' : key;
                that.sortFlag = key;
                that.sortOrder = direction;
                that.init()
            },
            /*
             * 类型按钮切换事件
             */
            buttonClick: function (id) {
                console.log("methods--->buttonClick--->id:", id);
                var that = this;
                that.curPage = 1;
                that.buttonId = id;
            },
            /*
             * 属性按钮切换事件
             */
            childClick: function (id) {
                console.log("methods--->childClick--->id:", id);
                var that = this;
                if(that.categoryId != id){
                    if ("" != that.categoryId) {
                        that.searchKey = '';
                        that.pageSize = 10;
                        that.curPage = 1;
                        that.jumpPage = '';
                    }
                    that.categoryId = id;
                    that.init();
                }
            },
            /*
             * 搜索
             */
            searchClick: function () {
                var that = this;
                var searchKey = that.searchKey;
                console.log("methods--->searchClick--->searchKey:", searchKey);
                that.curPage = 1;
                that.jumpPage = '';
                that.init();
            },
            /*
             * 导出
             */
            exportClick: function () {
                var that = this;
                var categoryId = encodeURI(that.categoryId);
                var searchKey = encodeURI(that.searchKey);
                var userId = that.userId || '';

                console.log("methods--->exportClick--->categoryId:", categoryId, ",searchKey:", searchKey);
                // location.href = apis.labelExportUrl+"?categoryId="+categoryId+"&searchKey="+searchKey+"&userId="+userId;
                let param = "?categoryId=" + categoryId + "&searchKey=" + searchKey + "&userId=" + userId;
                exportLabel(param);
            },
            /* 导入点击 */
            importClick: function () {
                let that = this;
                that.importFileName = '';
                that.modalShow = true;
            },
            // 触发input点击事件
            clickInput: function () {
                $('#import').click();
            },
            selectedFile: function () {
                let that = this;
                that.importFileName = $('#import')[0].files[0].name;
            },
            /* 导入Excel */
            confirmImport: function () {
                let that = this;
                // 是否选中文件
                if (!that.importFileName) {
                    // toastr.warning('请选择文件');
                    return;
                }
                var file = $('#import')[0].files[0];
                var formData = new FormData();
                formData.append("files", file);
                formData.append("user", that.userId);

                importLabel(formData).then(res => {
                    let response = res.data;
                    if (response.retCode == 0) {
                        that.modalShow = false;
                    }
                })
            },
            /*
            * 收藏/取消收藏
            */
            collectClick: function (id) {
                console.log("methods--->collectClick--->id:", id);
                var that = this;
                var param = {
                    userId: that.userId,
                    collectionType: 2,
                    collectionTypeId: id
                };
                console.log("methods--->collectClick--->param:", param);
                that.$myModal({
                    show: true,
                    title: '确认收藏吗？',
                    type: 'confirm',
                    onOk: function () {
                        collectionGroup(param).then(res => {
                            let data = res.data;
                            if (data.retCode == 0) {
                                // 请求新的群体列表
                                that.init();
                                console.log('收藏成功')
                            }
                        })
                    }
                });
            },
            cancelCollectionClick: function (id) {
                console.log("methods--->collectClick--->id:", id);
                var that = this;
                var param = {
                    collectionId: id
                };
                console.log("methods--->collectClick--->param:", param);
                that.$myModal({
                    show: true,
                    title: '确认取消收藏吗？',
                    type: 'confirm',
                    onOk: function () {
                        cancelCollection(param).then(res => {
                            let data = res.data;
                            if (data.retCode == 0) {
                                // 请求新的群体列表
                                that.init();
                                console.log('取消收藏成功')
                                // toastr.success('取消收藏成功');
                            }
                        })
                    }
                });
            },
            /*
             * 标签详细/修改
             * id:标签ID(可空)
             * htmlType:页面标识,add:新增;see:详情;edit:修改
             */
            labelEditClick: function (id, htmlType, product) {
                console.log("methods--->labelEditClick--->id:", id + ",htmlType:" + htmlType);
                var that = this;
                var buttonId = that.buttonId;
                if ("add" == htmlType && 4 != buttonId && 80 != buttonId) {
                    return;
                }
                let path = '';
                if(buttonId == 4){
                    path = '/label/detail'
                }
                if(buttonId == 80){
                    path = '/label/customDetail'
                }
                that.$router.push({
                    path: path,
                    query: {
                        labelId: id,
                        htmlType: htmlType,
                        buttonId: buttonId,
                        categoryId: that.categoryId,
                        searchKey: that.searchKey,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                        product: product
                    }
                })

            },
            /* 标签(自定义)删除 */
            deleteLabel: function (id) {
                console.log('methods--->deleteLabel--->id:', id);
                let that = this;
                let params = {labelId: id};
                deleteLabel(params).then(res => {
                    let data = res.data;
                    if (data.retCode == '0') {
                        that.init();
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/list';
</style>
