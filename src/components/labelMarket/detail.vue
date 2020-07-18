<template>
  <div id="main" class="pd">
    <div class="bgd page-title">
      <div class="detail-title page-title-text" v-if="type === 'see'">标签管理 - 组合标签明细</div>
      <div class="edit-title page-title-text" v-if="type === 'edit'">标签管理 - 修改组合标签</div>
      <div class="add-title page-title-text" v-if="type === 'add'">标签管理 - 新建组合标签</div>
    </div>
    <div class="data"  name="zuHe" id="biaoQian">
      <div class="chart">
        <div class="tree-wrapper">
          <div class="ztreeSearch">
            <input type="text"
                   placeholder="请搜索标签" id="search"
                   v-model="searchKey"
                   @keyup.enter="search">
            <span class="searchIcon" @click="search"></span>
            <div class="addlist">
              <div class="taggt" @click.stop="taggtOFF()">
                <span>{{Arr.name}}</span>
                <a class="curp dropjiao" :class = "isdrop == true ? 'dropUp':'dropDown'"></a>
              </div>
              <div v-show="isdrop == true" class="drop">
                <div v-for="(item,index) in dropList" :key="index" class="drop-top" :class="{active: Arr.name == item.name}" v-bind:data-val="item.id"  v-text="item.name" @click.stop="taggtON(item)">
                </div>
              </div>
            </div>
          </div>
          <div id="treeDemo" class="tree">
            <label-tree :tree-node="labelTreeList"
                       :selected-label="selectedLabelId"
                       @selected="selectedLeaf"></label-tree>
          </div>
        </div>
      </div>
      <div class="datatable">
        <div class="dataTitle title-wrapper">
          <p class="title-text">操作提示：(1) 点击标签进行标签组合；(2)叶子节点只能单选</p>
        </div>
        <div id="con">
                        <span class="result-item" v-for="(label,index) in selectedLabelList" :class="colorList[index]" :data-id="label.labelId">
                            <span>{{label.labelName}}</span>
                            <span v-show="type !==  'see'" class="item-close-icon" @click="deleteLabel(label.categoryId, index)">X</span>
                        </span>
        </div>
        <div class="dataTitle group-name editable border-top" v-if="type !== 'see'">
          标签名称：<input type="text" placeholder="请输入" class="labelName" :value="labelInfo.labelName || ''">
        </div>
        <div class="dataTitle group-name nonEditable border-top" v-if="type === 'see'">
          标签名称：<span class="name-text">{{labelInfo.labelName}}</span>
        </div>
        <div class="typeCon btn-wrapper">
          <button type="button" class="btn btn-sm btn-default btn-back" @click="btnBlack()">返回</button>
          <button type="button" class="btn btn-sm btn-primary btn-submit" @click="submit()" v-if="type !== 'see'">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery'
    import store from "../../store/index.js";
    import LabelTree from '../labelTree'
    import {getLabelTreeByProduct, getLabelDetail, updateLabel} from "../../assets/js/labelApi";

    export default {
        name: "detail",
        components: {
            'label-tree': LabelTree
        },
        data(){
            return {
                searchKey: '',
                labelInfo: {},  // 自定义标签详情
                colorIndex: 0,    // 生成选中节点的颜色
                colorList: ['blue', 'green', 'yellow', 'orange', 'red', 'pink', 'purple'],
                test: [
                    {
                        "id":1,
                        "code":"A10001",
                        "topic":"基础特征类",
                        "level":0,"isLeaf":0,
                        "expanded":"true",
                        "labelCount":3,
                        "labelInfoList":[],
                        "children":[{
                            "id": 5,
                            "code": "B10001",
                            "topic": "自然属性",
                            "level": 1,
                            "isLeaf": 0,
                            "expanded": "true",
                            "labelCount": 3,
                            "labelInfoList": [],
                            "children": [{
                                "id": 23,
                                "code": "C10001",
                                "topic": "年龄",
                                "level": 2,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 3,
                                "labelInfoList": [{
                                    "curPage": 1,
                                    "pageSize": 10,
                                    "totalCount": 0,
                                    "totalPageCount": 0,
                                    "startIndex": 0,
                                    "endIndex": 10,
                                    "data": [],
                                    "labelId": 3,
                                    "labelCode": "T10027",
                                    "categoryId": 23,
                                    "categoryName": "年龄",
                                    "labelName": "老年",
                                    "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                                    "labelDefine": "表示用户当前所属年龄段",
                                    "labelType": "1",
                                    "labelTypeName": "挖掘类",
                                    "labelStatus": "3",
                                    "labelStatusName": "上线",
                                    "labelDs": "1",
                                    "labelDsName": "科升",
                                    "labelFlag": "ip端",
                                    "updateTimeType": "1",
                                    "updateTimeTypeName": "日",
                                    "remark": null,
                                    "status": null,
                                    "labelIds": null,
                                    "createUserId": "admin",
                                    "createUserName": "admin",
                                    "createTime": "2019-03-28",
                                    "updateUserId": "admin",
                                    "updateUserName": "admin",
                                    "updateTime": "2019-03-28",
                                    "searchKey": null,
                                    "collectionId": null
                                },
                                    {
                                        "curPage": 1,
                                        "pageSize": 10,
                                        "totalCount": 0,
                                        "totalPageCount": 0,
                                        "startIndex": 0,
                                        "endIndex": 10,
                                        "data": [],
                                        "labelId": 2,
                                        "labelCode": "T10026",
                                        "categoryId": 23,
                                        "categoryName": "年龄",
                                        "labelName": "青年",
                                        "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                                        "labelDefine": "表示用户当前所属年龄段",
                                        "labelType": "1",
                                        "labelTypeName": "挖掘类",
                                        "labelStatus": "3",
                                        "labelStatusName": "上线",
                                        "labelDs": "1",
                                        "labelDsName": "科升",
                                        "labelFlag": "gender.keyword='0'",
                                        "updateTimeType": "1",
                                        "updateTimeTypeName": "日",
                                        "remark": null,
                                        "status": null,
                                        "labelIds": null,
                                        "createUserId": "admin",
                                        "createUserName": "admin",
                                        "createTime": "2019-03-28",
                                        "updateUserId": "admin",
                                        "updateUserName": "admin",
                                        "updateTime": "2019-03-28",
                                        "searchKey": null,
                                        "collectionId": null
                                    },
                                    {
                                        "curPage": 1,
                                        "pageSize": 10,
                                        "totalCount": 0,
                                        "totalPageCount": 0,
                                        "startIndex": 0,
                                        "endIndex": 10,
                                        "data": [],
                                        "labelId": 1,
                                        "labelCode": "T10028",
                                        "categoryId": 23,
                                        "categoryName": "年龄",
                                        "labelName": "中年",
                                        "labelValues": "14岁以下、14-18、19-22、23-30、30-40、41-50、51-60、60岁以上",
                                        "labelDefine": "表示用户当前所属年龄段",
                                        "labelType": "1",
                                        "labelTypeName": "挖掘类",
                                        "labelStatus": "3",
                                        "labelStatusName": "上线",
                                        "labelDs": "1",
                                        "labelDsName": "科升",
                                        "labelFlag": "age.keyword>7",
                                        "updateTimeType": "1",
                                        "updateTimeTypeName": "日",
                                        "remark": null,
                                        "status": null,
                                        "labelIds": null,
                                        "createUserId": "admin",
                                        "createUserName": "admin",
                                        "createTime": "2019-03-28",
                                        "updateUserId": "admin",
                                        "updateUserName": "admin",
                                        "updateTime": "2019-03-28",
                                        "searchKey": null,
                                        "collectionId": null
                                    }],
                                "children": []
                            }]
                        },
                            {
                                "id": 6,
                                "code": "B10002",
                                "topic": "地域属性",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 7,
                                "code": "B10003",
                                "topic": "社会属性",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 8,
                                "code": "B10004",
                                "topic": "通信属性",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 9,
                                "code": "B10005",
                                "topic": "终端属性",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 10,
                                "code": "B10006",
                                "topic": "用户状态",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            }]
                    },
                    {
                        "id": 2,
                        "code": "A10002",
                        "topic": "用户行为类",
                        "level": 0,
                        "isLeaf": 0,
                        "expanded": "true",
                        "labelCount": 0,
                        "labelInfoList": [],
                        "children": [{
                            "id": 11,
                            "code": "B10007",
                            "topic": "使用行为",
                            "level": 1,
                            "isLeaf": 1,
                            "expanded": "true",
                            "labelCount": 0,
                            "labelInfoList": [],
                            "children": []
                        },
                            {
                                "id": 12,
                                "code": "B10008",
                                "topic": "消费行为",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            }]
                    },
                    {
                        "id": 3,
                        "code": "A10003",
                        "topic": "内容偏好类",
                        "level": 0,
                        "isLeaf": 0,
                        "expanded": "true",
                        "labelCount": 0,
                        "labelInfoList": [],
                        "children": [{
                            "id": 13,
                            "code": "B10009",
                            "topic": "电影",
                            "level": 1,
                            "isLeaf": 1,
                            "expanded": "true",
                            "labelCount": 0,
                            "labelInfoList": [],
                            "children": []
                        },
                            {
                                "id": 14,
                                "code": "B10010",
                                "topic": "电视剧",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 15,
                                "code": "B10011",
                                "topic": "综艺",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 16,
                                "code": "B10012",
                                "topic": "动漫",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 17,
                                "code": "B10013",
                                "topic": "纪实",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 18,
                                "code": "B10014",
                                "topic": "教育",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 19,
                                "code": "B10015",
                                "topic": "演义",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 20,
                                "code": "B10016",
                                "topic": "体育",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 21,
                                "code": "B10017",
                                "topic": "音乐",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            },
                            {
                                "id": 22,
                                "code": "B10018",
                                "topic": "少儿",
                                "level": 1,
                                "isLeaf": 1,
                                "expanded": "true",
                                "labelCount": 0,
                                "labelInfoList": [],
                                "children": []
                            }]
                    },
                    {
                        "id": 4,
                        "code": "A10004",
                        "topic": "自定义组合类",
                        "level": 0,
                        "isLeaf": 1,
                        "expanded": "true",
                        "labelCount": 0,
                        "labelInfoList": [
                            {
                                "curPage": 1,
                                "pageSize": 10,
                                "totalCount": 0,
                                "totalPageCount": 0,
                                "startIndex": 0,
                                "endIndex": 10,
                                "data": [],
                                "labelId": 191,
                                "labelCode": "T10191",
                                "categoryId": 4,
                                "categoryName": null,
                                "labelName": "tang",
                                "labelValues": "青年,男,河南省,中国移动,iphone",
                                "labelDefine": "23-34岁的人群,男性群体,河南省人群,中国移动,当前主流的手机品牌",
                                "labelType": "2",
                                "labelTypeName": "事实类",
                                "labelStatus": "3",
                                "labelStatusName": "上线",
                                "labelDs": "1",
                                "labelDsName": "科升",
                                "labelFlag": "age.keyword in ('3','4'),gender.keyword = '0',location_prov.keyword = '河南',mobile_service_brand.keyword = '1',phone_brand.keyword = 'APPLE'",
                                "updateTimeType": "1",
                                "updateTimeTypeName": "日",
                                "remark": null,
                                "status": null,
                                "labelIds": "3,6,16,42,57",
                                "createUserId": "1",
                                "createUserName": "孙立00201",
                                "createTime": "2019-04-17",
                                "updateUserId": "1",
                                "updateUserName": "孙立00201",
                                "updateTime": "2019-04-17",
                                "searchKey": null,
                                "collectionId": null
                            },
                            {
                                "curPage": 1,
                                "pageSize": 10,
                                "totalCount": 0,
                                "totalPageCount": 0,
                                "startIndex": 0,
                                "endIndex": 10,
                                "data": [],
                                "labelId": 190,
                                "labelCode": "T10190",
                                "categoryId": 4,
                                "categoryName": null,
                                "labelName": "tang",
                                "labelValues": "青年,男,河南省,中国移动",
                                "labelDefine": "23-34岁的人群,男性群体,河南省人群,中国移动",
                                "labelType": "2",
                                "labelTypeName": "事实类",
                                "labelStatus": "3",
                                "labelStatusName": "上线",
                                "labelDs": "1",
                                "labelDsName": "科升",
                                "labelFlag": "age.keyword in ('3','4'),gender.keyword = '0',location_prov.keyword = '河南',mobile_service_brand.keyword = '1'",
                                "updateTimeType": "1",
                                "updateTimeTypeName": "日",
                                "remark": null,
                                "status": null,
                                "labelIds": "3,6,16,42",
                                "createUserId": "1",
                                "createUserName": "孙立00201",
                                "createTime": "2019-04-17",
                                "updateUserId": "1",
                                "updateUserName": "孙立00201",
                                "updateTime": "2019-04-17",
                                "searchKey": null,
                                "collectionId": null
                            }
                        ],
                        "children": []
                    }
                ],
                labelTreeList: [], // 标签树list
                selectedLabelId: [], //  已选标签id
                selectedLabelType: [], // 选中的标签类型
                selectedLabelList: [], // 选中的标签列表
                userId: window.user ? window.user.username : '测试',
                labelId: this.$route.query.labelId || '',
                type: this.$route.query.htmlType || 'add',
                buttonId: this.$route.query.buttonId || '',
                curPage: this.$route.query.curPage || 1,
                pageSize: this.$route.query.pageSize ||  10,
                _searchKey: this.$route.query.searchKey || '',
                backPath: '/label',
                product: this.$route.query.product || '',
                isdrop:false,//是否显示下拉框
                dropList:[],//顶部下拉框列表项
                list:{}, //顶部下拉框默认选中项
                Arr:{},//顶部下拉前选中状态
                actives:'',
                Dlist:[]
            }
        },
        beforeRouteEnter(to,from,next){
            console.log('router form',from)
            next(vm =>  {
                vm.backPath = from.path;
            })
        },
        created: function () {
            var that = this;
            this.quanxian();
            console.log("判断跳转类型：",that.type)

            that.labelId=that.$route.query.labelId || ''
            that.type=that.$route.query.htmlType || 'add'
            that.buttonId=that.$route.query.buttonId || ''
            that.curPage=that.$route.query.curPage || 1
            that.pageSize=that.$route.query.pageSize ||  10
            that.product=that.$route.query.product || '',
            that._searchKey=that.$route.query.searchKey || ''
        },
        methods:{
            showLabelDetail: function(){
                // 查找群体标签id对应的info
                var that = this;
                that.selectedLabelId.forEach(function(item){
                    $('.node-leaf[data-id='+item+']').addClass('selected');
                    var obj = {
                        labelId: item,
                        categoryId: Number($('.node-leaf[data-id='+item+']').attr('data-type')),
                        labelName: $('.node-leaf[data-id='+item+']').text()
                    };

                    that.selectedLabelType.push(obj.categoryId);
                    that.selectedLabelList.push(obj);
                    console.log('匹配的已选标签id对象--->', obj)
                });
            },
            selectedLeaf: function(leaf){
                console.log(leaf, '点击的leaf node')
                var that = this;
                if(that.type === 'see'){
                    return;
                }
                // 添加标签 去重
                if(that.selectedLabelList.length ==  5){
                    return;
                }
                var index;
                var deleteLabelId;
                console.log(that.selectedLabelType, leaf.categoryId, '判断是否已选同类型标签')
                if(that.selectedLabelType.indexOf(leaf.categoryId) > -1){
                    // 查询到selectedLabelList 同类型 item
                    console.log('已选同类型')
                    for(var i = 0; i < that.selectedLabelList.length; i++){
                        if(that.selectedLabelList[i].categoryId === leaf.categoryId){
                            index = i;
                            break;
                        }
                    }
                    console.log(index, '查询的index')
                    deleteLabelId = that.selectedLabelList[index].labelId;
                    var deleteLabelIndex =  that.selectedLabelId.indexOf(deleteLabelId);
                    that.selectedLabelId.splice(deleteLabelIndex, 1)
                    that.selectedLabelList.splice(index, 1);
                }else{
                    this.selectedLabelType.push(leaf.categoryId)
                }
                this.selectedLabelId.push(leaf.labelId)
                this.selectedLabelList.push(leaf);
            },
            deleteLabel: function(type, index){
                var that = this;
                console.log('删除的key===>', type);
                var typeIndex =  that.selectedLabelType.indexOf(type);
                var deleteLabelIndex = that.selectedLabelId.indexOf(that.selectedLabelList[index].labelId);
                that.selectedLabelId.splice(deleteLabelIndex,1)
                that.selectedLabelType.splice(typeIndex,1);
                that.selectedLabelList.splice(index, 1);
            },
            search: function(){
                var that = this;
                var searchKeyword = $.trim(that.searchKey);
                console.log(searchKeyword, '搜索节点关键字');
                // 折叠父节点
                $('li.parent-item').removeClass('open');
                $('span.node').each(function() {
                    var text =  $(this).text();
                    if(text.indexOf(searchKeyword) != -1){
                        console.log(text, '匹配到的项');
                        console.log($(this).parents('li.parent-item'), '匹配到的父节点');
                        if($(this).parents('li.parent-item')){
                            // 展开匹配到的父节点
                            $(this).parents('li.parent-item').addClass('open');
                        }
                    }
                })
            },
            quanxian: function () {
                var that = this;
                let data = window.productDropList;
                if (data.length > 0) {
                    that.dropList = data;
                    if (data.length > 1) {
                        that.list = that.dropList[0];
                        that.Arr = that.dropList[0];
                        if (that.product) {
                            that.dropList.forEach(function (item, index) {
                                if (item.name == that.product) {
                                    that.list = item;
                                    that.Arr = item;
                                }
                            })
                        }
                    }
                    else {
                        var _html = '<div  class="taggt"><span>' + data[0].name + '&nbsp;</span></div>'
                        that.list = data[0];
                        that.Arr = data[0];
                        $('#droplist').html(_html)
                    }
                    that.biaoqianlist();
                }
                else {
                    var _html = '<div class="taggt"><span>&nbsp;</span></div>'
                    that.$myModal({
                        show: true,
                        title: '警告',
                        content: '该用户未开通任何权限！',
                        type: 'warning',
                        onOk: function () {
                        }
                    })
                    $('#droplist').html(_html)
                }
            },
            taggtON: function(val){//确认保存
                var that = this;
                that.isdrop = !that.isdrop;
                that.Arr = val;
                that.biaoqianlist();
            },
            taggtOFF: function(){//取消保存
                var that = this;
                if(that.type != 'add') return;
                this.isdrop = !this.isdrop;
                if(this.isdrop){
                    $(document).one("click", function() { //如果可见就为documnet对象绑定个一次性的单击事件
                        console.log("如果可见就为documnet对象绑定个一次性的单击事件")
                        that.isdrop = false;
                    });
                }
            },
            biaoqianlist: function(){
                // 请求标签树数据
                var that = this;
                store.dispatch("showLoading");
                var pros ='';
                this.Arr.id ? pros = this.Arr.id:pros = that.dropList[0].id;
                console.log('标签树参数--->',pros);
                let params = {userId: that.userId,pro:pros};
                getLabelTreeByProduct(params).then(res => {
                    let data = res.data;
                    if(data.retCode == 0){
                        console.log('标签树数据--->',data.resultData);
                        that.labelTreeList = data.resultData;
                        that.jiazai();
                    }else{
                        that.$myModal({
                            show: true,
                            type: 'warning',
                            title: data.retDesc,
                            onOk: function(){}
                        })
                    }
                })
            },
            shuaxinbiaoqianlist: function(){
                // 请求标签树数据
                var that = this;
                that.biaoqianlist();
            },
            jiazai: function (){
                var that = this;
                console.log('labelId--->',that.labelId);
                console.log('htmlType--->',that.type);
                if(that.type == 'see' || that.type == 'edit'){
                    var param = {
                        labelId: that.labelId
                    };
                    //请求标签信息
                    getLabelDetail(param).then(res => {
                        store.dispatch("hideLoading");
                        let result = res.data;
                        if (0 == result.retCode) {
                            var resultData = result.resultData;
                            if(resultData){
                                that.labelInfo = resultData;
                                that.selectedLabelId = that.labelInfo.labelIds.split(',');
                            }
                        }
                        that.showLabelDetail();
                    })
                }else{
                    store.dispatch("hideLoading");
                }
            },
            // 保存提交
            submit: function(){
                var that = this;
                var labelIdArr = [];
                var labelTextArr = [];
                $('.result-item').each(function(){
                    labelIdArr.push($(this).attr('data-id'));
                    labelTextArr.push($(this).contents().filter(function(){
                        return this.nodeType == 3
                    }).text())
                });
                if(labelIdArr.length == 0){
                    //toastr.warning('请选择标签');
                    return false;
                }
                var labelName = $('.group-name .labelName').val();
                if(labelName == ''){
                    //toastr.warning('请输入自定义标签名称');
                    return false;
                }
                var param = {
                    userId: that.userId,
                    labelId: that.labelId,
                    labelName:labelName,
                    labelDefine: labelTextArr.join(),
                    labelIds:labelIdArr.join(),
                    product: that.Arr.name,
                };
                console.log("methods--->editClick--->param:",param);
                updateLabel(param).then(res => {
                    let result = res.data;
                    if (0 == result.retCode) {
                        // toastr.success('保存成功!');
                        // 返回
                        that.back();
                    }
                })
            },
            btnBlack: function(){
                this.back();
            },
            back: function(){
                var that = this;
                console.log(that.backPath, '返回 页面 路径')
                console.log(that.searchKey,that.pageSize,that.curPage,that.buttonId)
                if(that.backPath){
                    that.$router.push({
                        path: that.backPath,
                        query: {
                            searchKey: that._searchKey,
                            curPage: that.curPage,
                            pageSize: that.pageSize,
                            buttonId: that.buttonId
                        }
                    })
                }else{
                    that.$router.push({
                        path: '/',
                    })
                }
            }
        }
    }
</script>

<style lang="less">
@import '../../assets/css/newGroup';
</style>
