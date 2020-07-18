<template>
  <div class="" style="width: 100%;height:100%;">
    <div id="main" style="padding-top: 68px;">
      <div class="page-title bgd">
        <div>标签总览</div>
      </div>
      <div class="data">
        <!-- 全部标签 -->
        <div class="chart" id="jsmind_container"></div>
        <div class="table-switch" @click="tableShow = true">
          <span class="badge">{{totalNumber}}</span>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="table-wrapper" v-show="tableShow" @click="tableShow = false">
      <div class="mindtable" :class="{show: tableShow}">
        <!-- 近期上线 -->
        <div class="table-box" style="margin-bottom: 10px;">
          <div class="table-title">
            近期新上线
          </div>
          <div class="table-content">
            <my-table :table-data="createList" :cols="createCols"></my-table>
          </div>
        </div>
        <div class="table-box">
          <!-- 近期优化调整 -->
          <div class="table-title">
            近期优化调整
          </div>
          <div class="table-content">
            <my-table :table-data="updateList" :cols="updateCols"></my-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import CustomTable from '../customTable'
    import store from "../../store/index.js";
    import {getLabelTree, getRecentList} from "../../assets/js/labelApi";

    import {jm} from '../../assets/js/jsmind.js';
    export default {
        name: "labelOverview",
        components: {
            'my-table': CustomTable
        },
        data(){
            return {
                userId: window.user ? window.user.username: '测试',
                mind: {
                    "meta":{
                        "name":"jsMind-demo-tree",
                        "author":"hizzgdev@163.com",
                        "version":"0.2"
                    },
                    "format":"node_tree",
                    "data":{}
                },
                options: {
                    container:'jsmind_container',
                    editable:false,
                    theme:'info',
                    view:{
                        hmargin:10,        // 思维导图距容器外框的最小水平距离
                        vmargin:10,         // 思维导图距容器外框的最小垂直距离
                        line_width:2,       // 思维导图线条的粗细
                        line_color:'#CCCCCC'   // 思维导图线条的颜色
                    }
                },
                colorList:['#CCC2FF','#EDC74D','#6FE38A','#A8C7FF'],
                tableShow: false,
                createList:[],//上线数据
                updateList:[],//调整数据
                createCols: [
                    {title: '标签名称', key: 'labelName', tooltip: true, width: '33.333%'},
                    {title: '标签类型', key: 'labelType', width: '33.333%',align:'center'},
                    {title: '上线时间', key: 'createTime', width: '33.333%',align: 'center'},
                ],
                updateCols: [
                    {title: '标签名称', key: 'labelName', tooltip: true, width: '33.333%'},
                    {title: '标签类型', key: 'labelType', width: '33.333%',align:'center'},
                    {title: '上线时间', key: 'updateTime', width: '33.333%',align: 'center'},
                ],

            }
        },
        mounted: function () {
            var that = this;
            that.init();
        },
        computed: {
            totalNumber: function(){
                let that = this;
                let count = that.createList.length + that.updateList.length;
                return count;
            }
        },
        methods: {
            /*
            * 初始化数据
            */
            init: function(){

                var that = this;
                //标签树
                // loading
                store.dispatch("showLoading");
                let params = {userId: that.userId}
                getLabelTree(params).then(res => {
                    store.dispatch("hideLoading");
                    let result = res.data;
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        if(resultData){
                            var data = that.loadTreeListUtil(resultData);
                            that.mind.data = data;
                            var jm = new jsMind(that.options);
                            jm.show(that.mind);
                        }
                    }
                }).catch(error => {
                    store.dispatch("hideLoading");
                }).catch(function(){
                    console.log('init tree error')
                })

                // // 测试
                // var test = [
                //     {
                //         "id":1,
                //         "code":"A10001",
                //         "topic":"基础特征类",
                //         "level":0,
                // 	"isLeaf":0,
                //         "expanded":false,
                //         "labelCount":3,
                //         "labelInfoList":[],
                //         "children":[{
                //             "id": 5,
                //             "code": "B10001",
                //             "topic": "自然属性",
                //             "level": 1,
                //             "isLeaf": 0,
                //             "expanded": "true",
                //             "labelCount": 3,
                //             "labelInfoList": [],
                //             "children": [{
                //                 "id": 23,
                //                 "code": "C10001",
                //                 "topic": "年龄",
                //                 "level": 2,
                //                 "isLeaf": 1,
                //                 "expanded": true,
                //                 "labelCount": 3,
                //                 "labelInfoList": [{
                //                     "curPage": 1,
                //                     "pageSize": 10,
                //                     "totalCount": 0,
                //                     "totalPageCount": 0,
                //                     "startIndex": 0,
                //                     "endIndex": 10,
                //                     "data": [],
                //                     "labelId": 3,
                //                     "labelCode": "T10027",
                //                     "categoryId": 23,
                //                     "categoryName": "年龄",
                //                     "labelName": "老年",
                //                     "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                //                     "labelDefine": "表示用户当前所属年龄段",
                //                     "labelType": "1",
                //                     "labelTypeName": "挖掘类",
                //                     "labelStatus": "3",
                //                     "labelStatusName": "上线",
                //                     "labelDs": "1",
                //                     "labelDsName": "科升",
                //                     "labelFlag": "ip端",
                //                     "updateTimeType": "1",
                //                     "updateTimeTypeName": "日",
                //                     "remark": null,
                //                     "status": null,
                //                     "labelIds": null,
                //                     "createUserId": "admin",
                //                     "createUserName": "admin",
                //                     "createTime": "2019-03-28",
                //                     "updateUserId": "admin",
                //                     "updateUserName": "admin",
                //                     "updateTime": "2019-03-28",
                //                     "searchKey": null,
                //                     "collectionId": null
                //                 },
                //                     {
                //                         "curPage": 1,
                //                         "pageSize": 10,
                //                         "totalCount": 0,
                //                         "totalPageCount": 0,
                //                         "startIndex": 0,
                //                         "endIndex": 10,
                //                         "data": [],
                //                         "labelId": 2,
                //                         "labelCode": "T10026",
                //                         "categoryId": 23,
                //                         "categoryName": "年龄",
                //                         "labelName": "青年",
                //                         "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                //                         "labelDefine": "表示用户当前所属年龄段",
                //                         "labelType": "1",
                //                         "labelTypeName": "挖掘类",
                //                         "labelStatus": "3",
                //                         "labelStatusName": "上线",
                //                         "labelDs": "1",
                //                         "labelDsName": "科升",
                //                         "labelFlag": "gender.keyword='0'",
                //                         "updateTimeType": "1",
                //                         "updateTimeTypeName": "日",
                //                         "remark": null,
                //                         "status": null,
                //                         "labelIds": null,
                //                         "createUserId": "admin",
                //                         "createUserName": "admin",
                //                         "createTime": "2019-03-28",
                //                         "updateUserId": "admin",
                //                         "updateUserName": "admin",
                //                         "updateTime": "2019-03-28",
                //                         "searchKey": null,
                //                         "collectionId": null
                //                     },
                //                     {
                //                         "curPage": 1,
                //                         "pageSize": 10,
                //                         "totalCount": 0,
                //                         "totalPageCount": 0,
                //                         "startIndex": 0,
                //                         "endIndex": 10,
                //                         "data": [],
                //                         "labelId": 1,
                //                         "labelCode": "T10028",
                //                         "categoryId": 23,
                //                         "categoryName": "年龄",
                //                         "labelName": "中年",
                //                         "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                //                         "labelDefine": "表示用户当前所属年龄段",
                //                         "labelType": "1",
                //                         "labelTypeName": "挖掘类",
                //                         "labelStatus": "3",
                //                         "labelStatusName": "上线",
                //                         "labelDs": "1",
                //                         "labelDsName": "科升",
                //                         "labelFlag": "age.keyword>7",
                //                         "updateTimeType": "1",
                //                         "updateTimeTypeName": "日",
                //                         "remark": null,
                //                         "status": null,
                //                         "labelIds": null,
                //                         "createUserId": "admin",
                //                         "createUserName": "admin",
                //                         "createTime": "2019-03-28",
                //                         "updateUserId": "admin",
                //                         "updateUserName": "admin",
                //                         "updateTime": "2019-03-28",
                //                         "searchKey": null,
                //                         "collectionId": null
                //                     }],
                //                 "children": []
                //             }]
                //         },
                //             {
                //                 "id": 6,
                //                 "code": "B10002",
                //                 "topic": "地域属性",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 7,
                //                 "code": "B10003",
                //                 "topic": "社会属性",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 8,
                //                 "code": "B10004",
                //                 "topic": "通信属性",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 9,
                //                 "code": "B10005",
                //                 "topic": "终端属性",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 10,
                //                 "code": "B10006",
                //                 "topic": "用户状态",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             }]
                //     },
                //     {
                //         "id": 2,
                //         "code": "A10002",
                //         "topic": "用户行为类",
                //         "level": 0,
                //         "isLeaf": 0,
                //         "expanded": "true",
                //         "labelCount": 0,
                //         "labelInfoList": [],
                //         "children": [{
                //             "id": 11,
                //             "code": "B10007",
                //             "topic": "使用行为",
                //             "level": 1,
                //             "isLeaf": 1,
                //             "expanded": "true",
                //             "labelCount": 0,
                //             "labelInfoList": [],
                //             "children": [
                //                 {
                //                     "id": 24,
                //                     "code": "C10024",
                //                     "topic": "test",
                //                     "level": 2,
                //                     "isLeaf": 1,
                //                     "expanded": "true",
                //                     "labelCount": 0,
                //                     "labelInfoList": [],
                //                     "children": []
                //                 }
                // 		]
                //         },
                //             {
                //                 "id": 12,
                //                 "code": "B10008",
                //                 "topic": "消费行为",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             }]
                //     },
                //     {
                //         "id": 3,
                //         "code": "A10003",
                //         "topic": "内容偏好类",
                //         "level": 0,
                //         "isLeaf": 0,
                //         "expanded": "true",
                //         "labelCount": 3,
                //         "labelInfoList": [],
                //         "children": [{
                //             "id": 13,
                //             "code": "B10009",
                //             "topic": "电影",
                //             "level": 1,
                //             "isLeaf": 1,
                //             "expanded": "true",
                //             "labelCount": 0,
                //             "labelInfoList": [],
                //             "children": []
                //         },
                //             {
                //                 "id": 14,
                //                 "code": "B10010",
                //                 "topic": "电视剧",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 15,
                //                 "code": "B10011",
                //                 "topic": "综艺",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 16,
                //                 "code": "B10012",
                //                 "topic": "动漫",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 17,
                //                 "code": "B10013",
                //                 "topic": "纪实",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 18,
                //                 "code": "B10014",
                //                 "topic": "教育",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 19,
                //                 "code": "B10015",
                //                 "topic": "演义",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 20,
                //                 "code": "B10016",
                //                 "topic": "体育",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 21,
                //                 "code": "B10017",
                //                 "topic": "音乐",
                //                 "level": 1,
                //                 "isLeaf": 1,
                //                 "expanded": "true",
                //                 "labelCount": 0,
                //                 "labelInfoList": [],
                //                 "children": []
                //             },
                //             {
                //                 "id": 22,
                //                 "code": "B10018",
                //                 "topic": "少儿",
                //                 "level": 1,
                //                 "isLeaf": 0,
                //                 "expanded": false,
                //                 "labelCount": 3,
                //                 "labelInfoList": [],
                //                 "children": [
                //                     {
                // 					"id": 25,
                // 					"code": "C10024",
                // 					"topic": "test",
                // 					"level": 2,
                // 					"isLeaf": 1,
                // 					"expanded": "true",
                // 					"labelCount": 3,
                // 					"labelInfoList": [],
                // 					"children": []
                //                 	}
                // 			]
                //             }]
                //     },
                //     {
                //         "id": 4,
                //         "code": "A10004",
                //         "topic": "自定义组合类",
                //         "level": 0,
                //         "isLeaf": 0,
                //         "expanded": "true",
                //         "labelCount": 0,
                //         "labelInfoList": [],
                //         "children": []
                //     }
                // ]
                //
                // var data = that.loadTreeListUtil(test);
                // that.mind.data = data;
                // //console.log(that.mind)
                // //console.log(that.options)
                // console.log(window.jsMind, 'window.jsMind')
                // var jm = new jsMind(that.options);
                // jm.show(that.mind);


                //近期上线
                var createParam = {
                    orderBy: "CREATE_TIME"
                };
                console.log("methods--->init--->createParam:",createParam);
                getRecentList(createParam).then(res => {
                    let result = res.data;
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        if(resultData){
                            that.createList = resultData;
                        }else{
                            that.createList = new Array();
                        }
                    }
                })

                //近期调整
                var updateParam = {
                    orderBy: "UPDATE_TIME"
                };
                console.log("methods--->init--->updateParam:",updateParam);
                getRecentList(updateParam).then(res => {
                    let result = res.data;
                    if (0 == result.retCode) {
                        var resultData = result.resultData;
                        if(resultData){
                            that.updateList = resultData;
                        }else{
                            that.updateList = new Array();
                        }
                    }
                })
            },
            /*
    * 处理数据
    */
            loadTreeListUtil: function(treeList){
                //console.log("methods--->loadTreeListUtil--->treeList:",treeList);
                var that = this;
                var startHtml = "<div style='text-align: center;margin-top: 10px;'>";
                var endHtml = "</div>";
                var count = 0;
                for(var i in treeList){
                    var obj = treeList[i];
                    count += obj.labelCount;
                    obj.topic =  obj.topic+startHtml+obj.labelCount+endHtml;
                    var customColor = that.colorList[i];
                    obj.backgroundColor = customColor;
                    obj.children = that.loadChildrenUtil(obj.children, customColor);
                }
                var tree = new Object();
                tree["id"] = "0";
                tree["topic"] = "全部标签"+startHtml+count+endHtml;
                tree["children"] = treeList;
                console.log("methods--->loadTreeListUtil--->tree:",tree);
                return tree;
            },
            /*
            * 处理子节点数据
            */
            loadChildrenUtil: function(children, customColor){
                //console.log("methods--->loadChildrenUtil--->children:",children);
                var that = this;
                if(children){
                    for(var i in children){
                        var obj = children[i];
                        obj.topic =  obj.topic+" "+obj.labelCount;
                        //console.log(obj.topic)
                        obj.backgroundColor = customColor;
                        obj.children = that.loadChildrenUtil(obj.children, customColor);
                    }
                    return children;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  /* 标签总览 样式 */
  body{
    position:absolute;
    width: 100%;
    height: 100%;
  }
  #app{
    position: relative;
    width: 100%;
    height: 100%;
  }
  #main{
    position: relative;
    width: 100%;
    height: 100%;
    padding: 60px 16px 16px;
  }
  .page-title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: 16px;
    padding-top: 24px;
  }
  .data {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .table-switch{
    position: absolute;
    right: 54px;
    top: 36px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 27px 27px;
    cursor: pointer;
    z-index: 10;
  }
  .table-switch .badge{
    position: absolute;
    right: -4px;
    top: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    line-height: 20px;
    text-align: center;
    color: #fff;
    background: #f93138;
    border-radius: 10px;
  }
  #jsmind_container{
    padding: 20px;
  }
  .chart{
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .jsmind-inner{
    overflow: auto;
  }
  .mindtable {
    position: absolute;
    top: 0;
    right: -100%;
    width: 406px;
    height: 100%;
    padding: 10px;
  }
  .mindtable.show{
    right: 0;
  }
  .table-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0,0,0,.4);
  }
  .mindtable .table-box{
    position: relative;
    height: 50%;
    padding-top: 40px;
  }
  .table-title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:40px;
    line-height: 40px;
    text-align: center;
  }
  .table-content{
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-clip: border-box
  }
  table th, table td{
    line-height: 40px;
    text-align: center;
  }
  table tr.item td:first-child, table tr.table-header td:first-child{
    text-align: left;
  }
  table tr.item td:last-child, table tr.table-header td:last-child{
    text-align: right;
  }
  table tr.no-data td{
    text-align: center;
  }
</style>
