<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>群体画像</div>
    </div>
    <!-- search、important -->
    <div class="xfxw fenlei-h clearFix">
      <div class="group fl">
        <button type="button" class="hot-button hot-button-blue" @click="jumpCreatePage">新建群体 +</button>
      </div>
      <div class="group fr">
        <!-- search -->
        <div class="search">
          <input class="searchKey" type="text" placeholder="请输入人群名称" v-model="searchKey" @keyup.enter="searchClick">
          <img class="search_img" src="../../assets/img/icon-search.png" @click="searchClick">
        </div>
      </div>
    </div>
    <div>
      <!-- 我的群像 -->
      <my-table :table-data="tableData" :cols="portraitCols" @sort="sortHander">
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
												 <li class="operation-item"
                             :class="{'disabled': record.status == 0}"
                             @click="jumpConfigurationPage(record.groupId,record.moduleIds,record.status)">模块配置</li>
												 <li class="operation-item disabled" v-show="record.refreshing">刷新画像</li>
												 <li class="operation-item" v-show="!record.refreshing" @click="getLatest(record.groupId, record)">刷新画像</li>
												 <li class="operation-item disabled" v-show="record.refreshing">
													 显示画像({{record.countDown}}s)</li>
												 <li class="operation-item" v-show="!record.refreshing" :class="{'disabled': record.groupValue == 0 || record.status == 0}" @click="jumpShowPage(record.groupId,record.moduleIds,record.status,record.groupName,record.groupValue)">显示画像</li>
												 <li class="operation-item" v-if="!record.collectionId" @click="collectClick(record.groupId)">收藏</li>
												 <li class="operation-item" v-else @click="cancelCollection(record.collectionId)">取消收藏</li>
												 <li class="operation-item" @click="deleteClick(record.groupId)">删除</li>
											 </ul>
										 </div>
									 </div>
								</span>
        </template>
      </my-table>
      <my-paging :total-page.sync="totalPage"
              :cur-page.sync="curPage"
              :page-size.sync="pageSize"
              @changed="init"></my-paging>
    </div>
  </div>
</template>

<script>
    import store from "../../store/index.js";
    import {getGroupList,deleteGroup,refreshGroup,getGroupStatus} from "../../assets/js/groupPortraitApi";
    import {collectionGroup,cancelCollection} from "../../assets/js/myCollectionApi";
    import CustomTable from '../customTable'
    import CustomPaging from '../customPaging'
    export default {
        name: "groupList",
        components: {
            'my-table': CustomTable,
            'my-paging': CustomPaging
        },
        data(){
            return {
                userId: window.user ? window.user.username : '测试', // 登录用户ID
                status:3,//测试用删除
                btnStatus:2,//测试用删除
                searchKey:this.$route.query.searchKey || '',//关键词
                curPage: Number(this.$route.query.curPage) || 1,//当前页码
                totalPage: 2,//总页数
                pageSize: Number(this.$route.query.pageSize) || 10,//每页条数
                jumpPage:'',
                tableData:[], //列表数据
                sortFlag: '',
                sortOrder: '',
                refreshTimer: null, // 刷新定时器
                ongoing: false,
                ongoingList: [],
                portraitCols: [
                    {title:  '人群ID', key: 'groupId', tooltip: true, width: '10%'},
                    {title:  '人群名称', key: 'groupName', tooltip: true, width: '12.5%'},
                    {title:  '产品类型', key: 'product', tooltip: true, sort: true, width: '10%'},
                    {title:  '人群数量', key: 'groupValue', tooltip: true, slot: 'groupValue', width: '10%', align: 'right'},
                    {title:  '更新时间', key: 'updateTime', tooltip: true, sort: true, width: '17.5%', align: 'center'},
                    {title:  '创建人', key: 'createUserName', tooltip: true, width: '12.5%'},
                    {title:  '状态', key: 'status', slot: 'status', width: '12.5%'},
                    {title:  '操作', key: 'operation', slot: 'operation', width: '196px'}
                ]
            }
        },
        created: function () {
            var that = this;
            document.addEventListener("visibilitychange", function(){
                if(document.hidden) {
                    // 页面被挂起
                    if(that.refreshTimer){
                        clearInterval(that.refreshTimer);
                    }
                    that.refreshTimer = null;
                }
                else {
                    // 页面呼出
                    console.log('页面呼出');
                    that.isOngoing();
                }
            });
        },
        mounted: function () {
            let that = this;
            // 获取群体列表
            that.init();
        },
        beforeDestroy(){
            let that = this;
            console.log('beforeDestroy clear refreshTimer')
            clearInterval(that.refreshTimer);
            that.refreshTimer = null;
        },
        methods: {
            /*
            * 初始化数据
            */
            init: function () {
                var that = this;
                store.dispatch("showLoading");
                var param = {
                    user: that.userId,
                    searchKey: that.searchKey,
                    curPage: that.curPage,
                    pageSize: that.pageSize,
                    sortFlag: that.sortFlag,
                    sortOrder: that.sortOrder
                };
                console.log("methods--->init--->param:",param);

                getGroupList(param).then(res => {
                    let resp = res.data;
                    store.dispatch("hideLoading");
                    if ('0' == resp.retCode) {
                        var datas = resp.resultData;
                        that.totalPage = datas.totalPageCount;
                        that.tableData = []
                        datas.data.forEach(function(item){
                            item.refreshing = false;
                            item.countDown = 0;
                            that.tableData.push(item);
                        })
                        that.isOngoing();
                    }
                })


                // //  测试
                // let datas = [
                //     {
                //        "curPage": 1,
                //        "pageSize": 10,
                //        "totalCount": 0,
                //        "totalPageCount": 0,
                //        "startIndex": 0,
                //        "endIndex": 10,
                //        "data": [],
                //        "groupId": 5,
                //        "groupCode": "P10005",
                //        "groupName": "renqun",
                //        "groupValue": 0,
                //        "labelIds": "28",
                //        "moduleIds": "1,2,4,5,6,7,11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22",
                //        "status": 1,
                //        "deleted": 0,
                //        "createUserId": "admin",
                //        "createUserName": "admin",
                //        "createTime": "2019/03/26 00:00",
                //        "updateUserId": "admin",
                //        "updateUserName": "admin",
                //        "updateTime": "2019/03/26 00:00"
                //     },
                //     {
                //     	"curPage": 1,
                //     	"pageSize": 10,
                //     	"totalCount": 0,
                //     	"totalPageCount": 0,
                //     	"startIndex": 0,
                //     	"endIndex": 10,
                //     	"data": [],
                //     	"groupId": 4,
                //     	"groupCode": "P10004",
                //     	"groupName": "mygroup-17",
                //     	"groupValue": 1,
                //     	"labelIds": "1,2,3",
                //     	"moduleIds": "1,2,4,5,6,7,11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25",
                //     	"status": 0,
                //     	"deleted": 0,
                //     	"createUserId": "admin",
                //     	"createUserName": "admin",
                //     	"createTime": "2019/03/26 00:00",
                //     	"updateUserId": "1",
                //     	"updateUserName": "admin1",
                //     	"updateTime": "2019/03/26 00:00"
                //     },
                //     {
                //     	"curPage": 1,
                //     	"pageSize": 10,
                //     	"totalCount": 0,
                //     	"totalPageCount": 0,
                //     	"startIndex": 0,
                //     	"endIndex": 10,
                //     	"data": [],
                //     	"groupId": 3,
                //     	"groupCode": "P10003",
                //     	"groupName": "renqun",
                //     	"groupValue": 0,
                //     	"labelIds": "1,2",
                //     	"moduleIds": "1,2,4,5,6,7,11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25",
                //     	"status": 1,
                //     	"deleted": 0,
                //     	"createUserId": "admin",
                //     	"createUserName": "admin",
                //     	"createTime": "2019/03/26 00:00",
                //     	"updateUserId": "test",
                //     	"updateUserName": "test",
                //     	"updateTime": "2019/03/26 00:00"
                //     },
                //     {
                //     	"curPage": 1,
                //     	"pageSize": 10,
                //     	"totalCount": 0,
                //     	"totalPageCount": 0,
                //     	"startIndex": 0,
                //     	"endIndex": 10,
                //     	"data": [],
                //     	"groupId": 2,
                //     	"groupCode": "P10002",
                //     	"groupName": "mygrouptest",
                //     	"groupValue": 1,
                //     	"labelIds": "1,2",
                //     	"moduleIds": "1,2,4,5,6,7,11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22",
                //     	"status": 1,
                //     	"deleted": 0,
                //     	"createUserId": "test",
                //     	"createUserName": "test",
                //     	"createTime": "2019/03/26 00:00",
                //     	"updateUserId": "admin",
                //     	"updateUserName": "admin",
                //     	"updateTime": "2019/03/26 00:00"
                //     },
                // ]
                // datas.forEach(function(item){
                //     item.refreshing = false;
                //     item.countDown = 0;
                //     that.tableData.push(item);
                // })
            },
            isOngoing: function(){
                let that = this;
                that.ongoingList = [];
                that.ongoing = false;
                if(that.refreshTimer){
                    clearInterval(that.refreshTimer);
                }
                that.refreshTimer = null;
                that.tableData.forEach(function(item){
                    // console.log(item, '是否有进行中item')
                    if(item.status == 0){
                        that.ongoing = true;
                        that.ongoingList.push(item);
                    }
                })
                console.log(that.ongoing, '存在进行中的数据');
                if(that.ongoing){
                    that.refreshTimer = setInterval(function(){
                        // 请求进行中列表的数据状态
                        // console.log('请求刷新状态定时器')
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
                key  =  key === 'updateTime' ? 'time' : key;
                that.sortFlag = key;
                that.sortOrder = direction;
                that.init()
            },
            /*
        	* 替换数据
        	* return value字符串
        	*/
            replaceData: function(datas,replaceDate){
                console.log("methods--->dataReplace--->datas:",datas,",replaceDate:",replaceDate);
                if(0 == datas.length || !datas[0].chart_value){
                    console.log("methods--->dataReplace--->datas:无数据");
                    return null;
                };
                var chartValue = datas[0].chart_value;
                for(var i in replaceDate){
                    var obj = replaceDate[i];
                    var regExp = new RegExp(obj.content);
                    chartValue = chartValue.replace(regExp,obj.repContent);
                };
                console.log("methods--->dataReplace--->replaceData:",chartValue);
                return chartValue;
            },
            /*
        	* 处理数据
        	* return array
        	*/
            loadData: function(data){
                console.log("methods--->loadData--->data:",data);
                var array = new Array();
                if(!data){
                    console.log("methods--->loadData--->array:无数据");
                    return array;
                };
                var valueArray = data.split('|');
                for ( var i in valueArray) {
                    var value = valueArray[i];
                    var strArray = value.split(':');
                    var obj = new Object();
                    obj.name = strArray[0];
                    var value = "0";
                    if(strArray[1]){
                        value = parseFloat(strArray[1]);
                    }
                    obj.value = value;
                    array.push(obj);
                };
                console.log("methods--->loadData--->array:",array);
                return array;
            },
            /*
        	* 计算占比(四舍五入)
        	* val:数量
        	* totalVal:总数
        	* isPercentage:是否百分比,默认为是
        	* decimalNum:小数位数,默认为2
        	*/
            loadRatio: function(val,totalVal,isPercentage,decimalNum){
                console.log("methods--->loadRatio--->val:",val,",totalVal:",totalVal);
                if('' == val || '' == totalVal){
                    return '0';
                };
                if(typeof decimalNum == 'undefined'){
                    decimalNum = 2;
                };
                var obj = 1;
                if(isPercentage){
                    obj = 100;
                };
                var result = ((Number(val) / Number(totalVal)) * obj).toFixed(decimalNum).toString();
                console.log("methods--->loadRatio--->result:",result);
                return result;
            },
            /*
             * 搜索
             */
            searchClick: function(){
                var that = this;
                var searchKey = that.searchKey;
                console.log("methods--->searchClick--->searchKey:",searchKey);
                that.curPage = 1;
                that.init();
            },
            /* 新增群体 */
            jumpCreatePage: function(){
                // window.location.href = apis.detailAndUpdateHtml + '?backPath='+this.localPath + '&curPage='+ this.curPage + '&pageSize=' + this.pageSize + '&searchKey=' + this.searchKey;

                let that = this;
                that.$router.push({
                    path: '/group/detail',
                    query: {
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                        searchKey: that.searchKey
                    }
                })
            },
            /*
         * 群像详情/修改
         * id:人群ID
         * htmlType:页面标识,detail:详情;update:修改
         */
            detailAndUpdateClick: function(groupId,htmlType,product){
                let that = this;
                console.log("methods--->detailAndUpdateClick--->groupId:",groupId+",htmlType:"+htmlType+"产品类型："+product);
                that.$router.push({
                    path: '/group/detail',
                    query: {
                        groupId: groupId,
                        htmlType: htmlType,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                        searchKey: that.searchKey,
                        product: product
                    }
                })
            },
            /* 群像模块配置
            * groupId:人群id
            * moduleId:模块id
            * */
            jumpConfigurationPage: function(groupId, moduleId,status){  // 跳转配置页面id（参数：人群唯一标识
                let that = this;
                if(status == 0){
                    // toastr.warning('当前群体为未完成状态!')
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
                        pageSize: that.pageSize,
                        searchKey: that.searchKey
                    }
                })
            },
            /*
         * 群像收藏
         * groupId:人群ID
         * type:1
         * 		1：我的群像;
         *	  2：我的标签;
         *  	3：我的任务;
         */
            collectClick: function(groupId){
                var that = this;
                var param = {
                    userId: that.userId,
                    collectionType: 1,
                    collectionTypeId: groupId
                };
                console.log("methods--->collectClick--->param:",param);
                that.$myModal({
                    show: true,
                    title: '确认收藏吗？',
                    type: 'confirm',
                    onOk: function(){
                        collectionGroup(param).then(res => {
                            let data = res.data;
                            if(data.retCode == 0){
                                // 请求新的群体列表
                                that.init();
                                console.log('收藏成功')
                                // toastr.success('收藏成功');
                            }
                        })
                    }
                });
            },
            /*
             * 群像取消收藏
             * collectionId:收藏id
             */
            cancelCollection: function(collectionId){
                let that = this;
                let param = {collectionId: collectionId};
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
            getLatest: function(id,obj){
                // 点击后loading 其他操作不可操作 成功后可操作
                console.log("methods--->refreshClick--->id:",id);
                var that = this;
                let params = {user: that.userId};
                refreshGroup(id,params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        // toastr.success('刷新请求已提交');
                        //that.curPage = 1;
                        that.init();
                    }
                })
            },
            /* 更新列表状态 */
            updateStatus: function(){

            }
        },
        filters: {
            statusFilter: function (val) {
                console.log("filters--->statusFilter--->val:",val);
                var str = "";
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
                }
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
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/list';
</style>
