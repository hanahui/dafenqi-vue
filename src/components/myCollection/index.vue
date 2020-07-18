<template>
  <div id="main" class="">
    <div class="bgd page-title">
      <div class="fl">
        我的收藏
      </div>
      <!-- export -->
      <div class="export-wrapper fr" @click="exportClick">
        <span class="imp-font">导出</span>
        <img src="../../assets/img/icon-export.png" class="excel-img">
      </div>
    </div>

    <!-- 分类 -->
    <div class="xfxw fenlei-h clearFix">
      <!-- button -->
      <div class="fl font-size0">
        <button class="hot-button" :class="{'hot-button-blue': buttonId == 1}"  @click="buttonId = 1" >我的群像</button>
        <button class="hot-button" :class="{'hot-button-blue': buttonId == 2}"  @click="buttonId = 2">我的标签</button>
        <!--<button class="hot-button" :class="{'hot-button-bule': buttonId == 3}" @click="buttonId = 3" >我的任务</button>-->
      </div>
      <!-- search、important -->
      <div class="group fr">
        <!-- search -->
        <div class="search">
          <input class="searchKey" type="text" v-model="searchKey" placeholder="请输入查询关键字" @keyup.enter="searchClick">
          <img class="search_img" src="../../assets/img/icon-search.png" @click="searchClick">
        </div>
      </div>
    </div>
    <div class="table-border">
      <!-- 我的群像 -->
      <my-table v-if="buttonId == 1" :table-data="tableData" :cols="portraitCols" @sort="sortHander">
        <template slot="groupValue" slot-scope="{record}">{{record.groupValue | formatNum}}</template>
        <span slot="status" slot-scope="{record}" class="round" :style="record.status==0?'color: red; font-weight: bold;':''">{{record.status | statusFilter }}</span>
        <template slot="operation" slot-scope="{record}">
          <span class="curp url operation-btn" @click="detailAndUpdateClick(record.groupId,'see',record.product)">明细</span>
          <span class="operation-line"></span>
          <span class="curp url operation-btn" @click="detailAndUpdateClick(record.groupId,'edit',record.product)">修改</span>
          <span class="operation-line"></span>
          <span class="curp url operation-btn more-btn">
										<span>更多</span>
										<div class="more-wrapper tooltip-box">
											 <div class="arrow tooltip-arrow"></div>
											 <div class="tooltip-content">
												 <ul class="operation-list">
													 <li class="operation-item" @click="jumpConfigurationPage(record.groupId,record.moduleIds,record.status)">模块配置</li>
													 <li class="operation-item" @click="getLatest(record.groupId)">刷新画像</li>
													 <li class="operation-item" @click="jumpShowPage(record.groupId,record.moduleIds,record.status,record.groupName,record.groupValue)" :class="{'disabled': record.groupValue == 0 || record.status == 0}">显示画像</li>
													 <li class="operation-item" @click="cancelCollectionClick(record.collectionId)">取消收藏</li>
													 <li class="operation-item" @click="deleteClick(record.groupId)">删除</li>
												 </ul>
											 </div>
										 </div>
									</span>
        </template>
      </my-table>
      <!-- 我的标签 -->
      <my-table v-if="buttonId == 2" :table-data="tableData" :cols="labelCols" @sort="sortHander">
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
          <span class="curp url operation-btn" @click="cancelCollectionClick(record.collectionId)">取消收藏</span>
          <span class="operation-line" v-if="record.createUserId"></span>
          <span class="curp url operation-btn" v-if="record.createUserId" @click="detailAndUpdateClick(record.labelId,'see',record.product,record.categoryId)">明细</span>
          <span class="operation-line" v-if="record.createUserId"></span>
          <span class="curp url operation-btn more" v-if="record.createUserId">
                                    <span>更多</span>
									<div class="more-wrapper tooltip-box">
										 <div class="arrow tooltip-arrow"></div>
										 <div class="tooltip-content">
											 <ul class="operation-list">
												 <li class="operation-item"  @click="detailAndUpdateClick(record.labelId,'edit',record.product,record.categoryId)">修改</li>
												 <li class="operation-item" @click="deleteLabel(record.labelId)">删除</li>
											 </ul>
										 </div>
									 </div>
                                </span>
        </template>
      </my-table>
      <!-- page -->
      <my-paging :total-page="totalPage" :cur-page="curPage" :page-size="pageSize" @changed="init"></my-paging>
    </div>
  </div>
</template>

<script>
    import store from "../../store/index.js";
    import CustomTable from '../customTable'
    import CustomPaging from '../customPaging'
    import {getCollectionList, cancelCollection, exportCollectionLabel} from "../../assets/js/myCollectionApi";
    import {deleteGroup, refreshGroup,getGroupStatus} from "../../assets/js/groupPortraitApi";
    import {deleteLabel} from "../../assets/js/labelApi";

    export default {
        name: "index",
        components: {
            'my-table': CustomTable,
            'my-paging': CustomPaging
        },
        data(){
            return {
                userId: window.user ? window.user.username : '测试',//用户ID
                searchKey: this.$route.query.searchKey || '',//关键词
                buttonId: this.$route.query.buttonId || 1,//按钮标识
                curPage: Number(this.$route.query.curPage) || 1,//当前页码
                totalPage: 0,//总页数条数
                pageSize: Number(this.$route.query.pageSize) || 10,//每页条数
                jumpPage: '',//跳转某页
                refreshTimer: null, // 刷新定时器
                ongoing: false,
                ongoingList: [], //
                tableData: [],//列表数据
                sortFlag: '',
                sortOrder: '',
                labelSortFlag: '',
                labelSortOrder: '',
                addSvg: '',
                portraitCols: [
                    {title:  '人群ID', key: 'groupId', tooltip: true, width: '10%'},
                    {title:  '人群名称', key: 'groupName', tooltip: true, width: '12.5%'},
                    {title:  '产品类型', key: 'product', tooltip: true, sort: true, width: '10%'},
                    {title:  '人群数量', key: 'groupValue', tooltip: true, slot: 'groupValue', width: '10%', align: 'right'},
                    {title:  '更新时间', key: 'updateTime', tooltip: true, sort: true, width: '17.5%', align: 'center'},
                    {title:  '创建人', key: 'createUserName', tooltip: true, width: '12.5%'},
                    {title:  '状态', key: 'status', slot: 'status', width: '12.5%'},
                    {title:  '操作', key: 'operation', slot: 'operation', width: '196px'}
                ],
                labelCols: [
                    {title: '标签ID', key: 'labelId',  tooltip: true, width: '10%'},
                    {title: '二级分类', key: 'categoryName', sort: true, tooltip: true, width: '10%'},
                    {title: '标签名称', key: 'labelName', tooltip: true, width: '17%'},
                    {title: '标签定义', key: 'labelDefine', tooltip: true, width: '15%'},
                    {title: '产品类型', key: 'product', sort: true, tooltip: true, width: '15%'},
                    {title: '口径', key: 'labelFlag', slot: 'labelFlag', width: '5%'},
                    {title: '更多', key: 'more', slot: 'more', width: '5%'},
                    {title: '操作', key: 'operation', slot: 'operation', width: '196px'},
                ]
            }
        },
        filters: {
            statusFilter: function (val) {
                console.log("filters--->statusFilter--->val:",val);
                var str = ""
                switch (val) {
                    case 0:
                        str = '进行中';
                        break;
                    case 1:
                        str = '已完成';
                        break;
                    // case 2:
                    //     str = '未完成';
                    //     break;
                    // case 3:
                    //     str = '进行中';
                    //     break;
                };
                return str;
            },
            // 数字千分化(整型或浮点数字)
            formatNum: function(num) {
                if(typeof num === 'number') {
                    if(num%1 === 0) { // 整型
                        return num.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
                    } else { // 浮点
                        return num.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    }
                } else {
                    return num;
                }
            },
        },
        mounted: function (event) {
            var that = this;
            that.init();
        },
        watch: {
            buttonId: function(val, oldVal){
                console.log("watch--->buttonId--->val:",val,",oldVal:",oldVal);
                var that = this;
                if(val != oldVal){
                    that.buttonId = val;
                    that.searchKey = '';
                    that.pageSize = 10;
                    that.curPage = 1;
                    that.jumpPage = '';
                    that.init();
                }
            },
        },
        beforeDestroy(){
            let that = this;
            console.log('beforeDestroy clear refreshTimer')
            clearInterval(that.refreshTimer);
            that.refreshTimer = null;
        },
        methods: {
            isOngoing: function(){
                let that = this;
                that.ongoingList = [];
                that.ongoing = false;
                if(that.refreshTimer){
                    clearInterval(that.refreshTimer);
                }
                that.refreshTimer = null;
                that.tableData.forEach(function(item){
                    console.log(item, '是否有进行中item')
                    if(item.status == 0){
                        that.ongoing = true;
                        that.ongoingList.push(item);
                    }
                })
                console.log(that.ongoing, '存在进行中的数据');
                if(that.ongoing){
                    that.refreshTimer = setInterval(function(){
                        // 请求进行中列表的数据状态
                        console.log('请求刷新状态定时器')
                        that.queryStatus();
                    }, 5000)
                }else{
                    if(that.refreshTimer){
                        clearInterval(that.refreshTimer);
                    }
                    that.refreshTimer = null;
                }
            },
            queryStatus: function(){
                let that = this;
                console.log(that.ongoingList, '进行中的列表');
                let params = [];
                that.ongoingList.forEach(function(item){
                    params.push(item.groupId);
                })
                if(params.length == 0){
                    return;
                }
                console.log('请求进行中状态参数===>', params);

                getGroupStatus(params).then(res => {
                    let resp = res.data;
                    if(resp.retCode == 0){
                        // 更新tableData中数据状态
                        if(resp.resultData && resp.resultData.length > 0){
                            resp.resultData.forEach(function(item){
                                for(let i = 0; i < that.tableData.length; i++){
                                    if(item.groupId === that.tableData[i].groupId){
                                        that.tableData[i].status = item.status;
                                        that.tableData[i].groupValue = item.groupValue;
                                        break;
                                    }
                                }
                            });
                            that.isOngoing();
                        }
                    }
                })
            },
            sortHander: function(key, direction){
                var that = this;
                if(that.buttonId == 2){
                    key  =  key === 'categoryName' ? 'category' : key;
                    that.labelSortFlag = key;
                    that.labelSortOrder = direction;
                }else if(that.buttonId == 1){
                    key  =  key === 'updateTime' ? 'time' : key;
                    that.sortFlag = key;
                    that.sortOrder = direction;
                }
                that.init()
            },
            /*
            * 初始化数据
            */
            init: function () {
                var that = this;
                that.tableData = [];
                store.dispatch("showLoading");
                var param = {
                    userId: that.userId,
                    searchKey: that.searchKey,
                    collectionType: that.buttonId,
                    curPage: that.curPage,
                    pageSize: that.pageSize,
                    sortFlag: that.buttonId == 1 ? that.sortFlag : that.labelSortFlag,
                    sortOrder: that.buttonId == 1 ? that.sortOrder : that.labelSortOrder
                };
                console.log("methods--->init--->param:",param);
                getCollectionList(param).then(res => {
                    store.dispatch("hideLoading");
                    let result = res.data;
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        that.totalPage = resultData.totalPageCount;
                        that.curPage = resultData.curPage;
                        var data = resultData.data;
                        if(data){
                            that.tableData = data;
                        }else{
                            that.tableData = new Array();
                        }
                        if(that.buttonId == 1){
                            that.isOngoing();
                        }
                    }
                })
            },
            /*
			 * 类型按钮切换事件
			 */
            buttonClick : function(id) {
                console.log("methods--->buttonClick--->id:",id);
                var that = this;
                that.buttonId = id;
            },
            /*
             * 搜索
             */
            searchClick: function(){
                var that = this;
                var searchKey = that.searchKey;
                console.log("methods--->searchClick--->searchKey:",searchKey);
                that.curPage = 1;
                that.jumpPage = '';
                that.init();
            },
            pageSearch: function(curPage, pageSize){
                console.log('trigger pageing component change page event..........')
                let that = this;
                that.curPage = curPage;
                that.pageSize = pageSize;
                console.log( 'emit 参数----',curPage, pageSize)
                that.init();
            },
            /*
             * 导出
             */
            exportClick: function(){
                var that = this;
                var buttonId = encodeURI(that.buttonId);
                var searchKey = encodeURI(that.searchKey);
                // location.href = 'http://183.192.162.169:18080/labelsys-service/label/conllectionExport'+"?collectionType="+buttonId+"&searchKey="+searchKey+"&userId="+that.userId+"&curPage=1&pageSize=9999";
                let param = "?collectionType="+buttonId+"&searchKey="+searchKey+"&userId="+that.userId+"&curPage=1&pageSize=9999";
                exportCollectionLabel(param);
            },
            /*
            * 取消收藏
            * id:人群ID / 标签ID
            */
            cancelCollectionClick: function(id){
                console.log("methods--->collectClick--->id:",id);
                var that = this;
                var param = {
                    collectionId: id
                };
                console.log("methods--->collectClick--->param:",param);
                that.$myModal({
                    show: true,
                    title: '确认取消收藏吗？',
                    type: 'confirm',
                    onOk: function(){
                        cancelCollection(param).then(res => {
                            let data = res.data;
                            if(data.retCode == 0){
                                // 请求新的群体列表
                                //that.curPage = 1;
                                that.init();
                                console.log('取消收藏成功')
                                // toastr.success('取消收藏成功');
                            }
                        })
                    }
                });
            },
            /*
         * 群像详情修改 / 标签明细修改
         * id:人群ID / 标签ID
         * type:人群类型(例1:组合标签)
         * htmlType:页面标识,detail:详情;update:修改
         */
            detailAndUpdateClick: function(id,htmlType,product,categoryId){
                console.log("methods--->groupImgDetailUpdateClick--->id:",id+",htmlType:"+htmlType+', buttonId--->',this.buttonId);
                let that = this;
                if(that.buttonId == 1){ // 我的群像
                    that.$router.push({
                        path: '/group/detail',
                        query: {
                            groupId: id,
                            htmlType: htmlType,
                            searchKey: that.searchKey,
                            curPage: that.curPage,
                            pageSize: that.pageSize,
                            buttonId: that.buttonId,
                            product: product
                        }
                    })
                }else if(that.buttonId == 2){ // 我的标签
                    let path = '';
                    if(categoryId == 4){
                        path = '/label/detail'
                    }
                    if(categoryId == 80){
                        path = '/label/customDetail'
                    }
                    that.$router.push({
                        path: path,
                        query: {
                            labelId: id,
                            htmlType: htmlType,
                            searchKey: that.searchKey,
                            curPage: that.curPage,
                            pageSize: that.pageSize,
                            buttonId: that.buttonId,
                            product: product
                        }
                    })
                }
            },
            /* 群像模块配置
            * groupId:人群id
            * moduleId:模块id
            * */
            jumpConfigurationPage: function(groupId, moduleId,status){  // 跳转配置页面id（参数：人群唯一标识）
                let that = this;
                if(status == 0){
                    return false;
                }
                console.log("methods--->jumpConfigurationPage--->groupId:",groupId+",moduleId:",moduleId);
                that.$router.push({
                    path: '/group/configure',
                    query: {
                        groupId: groupId,
                        moduleId: moduleId,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                        searchKey: that.searchKey
                    }
                })
            },
            /*
             * 群像显示画像
             * groupId:人群id
             * moduleId:模块id
             */
            jumpShowPage: function(groupId,moduleId,status,groupName,groupValue){
                let that = this;
                if(status == 0 || groupValue == 0){
                    //toastr.warning('当前群体为未完成状态!')
                    return false;
                }
                console.log("methods--->jumpShowPage--->groupId:",groupId+",moduleId:",moduleId);
                that.$router.push({
                    path: '/group/portraitDetail',
                    query: {
                        groupId: groupId,
                        moduleId: moduleId,
                        groupName: groupName,
                        curPage: that.curPage,
                        searchKey: that.searchKey,
                        pageSize: that.pageSize,
                        buttonId: that.buttonId,
                    }
                })
            },
            /*
             * 群像删除
             */
            deleteClick: function(id){
                console.log("methods--->deleteClick--->id:",id);
                var that = this;
                that.$myModal({
                    show: true,
                    title: '确认删除该群体吗？',
                    type: 'confirm',
                    onOk: function(){
                        deleteGroup(id).then(res =>  {
                            let resp = res.data;
                            if ('0' == resp.retCode) {
                                // toastr.success('删除成功');
                                that.curPage = 1;
                                that.init();
                            }
                        })
                    }
                });
            },
            /* 刷新 获取最新人群信息 */
            getLatest: function(id){
                // 点击后loading 其他操作不可操作 成功后可操作
                console.log("methods--->refreshClick--->id:",id);
                var that = this;
                let params = {user: that.userId};
                refreshGroup(id,params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        // toastr.success('刷新请求已提交');
                        // that.curPage = 1;
                        that.init();
                    }
                })
            },
            /* 标签(自定义)删除 */
            deleteLabel: function(id){
                console.log('methods--->deleteLabel--->id:',id);
                let that = this;
                let params = {labelId: id};
                deleteLabel(params).then(res => {
                    let resp = res.data;
                    if(resp.retCode == '0'){
                        // toastr.success('删除成功');
                        that.init();
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/list';
</style>
