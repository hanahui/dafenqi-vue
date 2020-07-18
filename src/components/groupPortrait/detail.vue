<template>
  <div id="main" class="main pd">
    <div class="bgd page-title">
      <div class="detail-title page-title-text" v-show="type === 'see'">群体列表 - 群体明细</div>
      <div class="edit-title page-title-text" v-show="type === 'edit'">群体列表 - 修改群体</div>
      <div class="add-title page-title-text" v-show="type === 'add'">群体列表 - 新建群体</div>
    </div>
    <div class="data" name="zuHe" id="biaoQian">
      <div class="chart">
        <div class="tree-wrapper">
          <div class="ztreeSearch">
            <input type="text" id="search"
                   placeholder="请搜索标签"
                   v-model="searchKey"
                   @keyup.enter="search">
            <span class="searchIcon" @click="search"></span>
            <div class="addlist">
              <div class="taggt" @click.stop="taggtOFF()">
                <span>{{Arr.name}}</span>
                <a class="curp dropjiao" :class="isdrop == true ? 'dropUp':'dropDown'"></a>
              </div>
              <div v-show="isdrop == true" class="drop">
                <div v-for="(item,index) in dropList" :key="index" class="drop-top" :class="{active: Arr.name == item.name}" v-bind:data-val="item.id"
                     v-text="item.name" @click.stop="taggtON(item)">
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
        <div class="label-container flex">
          <div class="label-operation-area">
            <div class="dataTitle title-wrapper">
              <p class="title-text">操作提示：1、请点击标签进行人群组合；2、叶子节点只能单选</p>
            </div>
            <div class="con-wrapper">
              <div id="con">
                            <span class="result-item" v-for="(label,index) in selectedLabelList" :class="colorList[index]" :data-id="label.labelId">
                                <span>{{label.labelName}}</span>
                                <span v-show="type !==  'see'" class="item-close-icon" @click="deleteLabel(label.categoryId, index)">X</span>
                            </span>
              </div>
            </div>
            <div class="dataTitle operation-bottom editable border-top" v-if="type !== 'see'">
              <div class="">
                计算对象：<input name="attribute" type="radio" id="udid" value="udid" v-model="attribute"><label for="udid">udid</label>
                <input name="attribute" type="radio" id="userId" value="user_id" v-model="attribute"><label for="userId">userId</label>
                <input name="attribute" type="radio" id="mobile" value="phone_num" v-model="attribute"><label for="mobile">手机号码</label>
              </div>
              人群名称：<span class="name-text"></span>
              <input type="text" placeholder="请输入" class="labelName" :value="groupInfo.groupName || ''">
            </div>
            <div class="dataTitle operation-bottom nonEditable border-top" v-if="type === 'see'">
              <div class="">
                计算对象：<span v-show="attribute == 'udid'">udid</span>
                <span v-show="attribute == 'user_id'">userId</span>
                <span v-show="attribute == 'phone_num'">手机号码</span>
              </div>
              人群名称：<span class="name-text">{{groupInfo.groupName}}</span>
            </div>
          </div>
          <div class="selected-labels">
            <div class="selected-header">已选标签组合</div>
            <div class="selected-body">
              <div class="selected-group" v-for="(val, key, i) in selectedLabelObj">
                <div class="group-title-text">{{key}}</div>
                <div class="group-content" v-if="typeof val === 'object'">
                  <div class="content-item" v-for="(arr, attr) in val">
                    <span class="second-attr">{{attr}}:</span>
                    <span class="label-text" v-for="(item, category) in arr">{{category}}>{{item}}, </span>
                  </div>
                </div>
                <div class="group-content" v-else>
                  <div class="content-item">
                    <span class="second-attr">{{val}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="typeCon btn-wrapper" style="padding-top: 11px;">
          <button type="button" class="btn btn-sm btn-default btn-back" @click="btnBlack()">返回</button>
          <button type="button" class="btn btn-sm btn-primary btn-submit" v-if="type !== 'see'" @click="submit()">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery';
    import store from "../../store/index.js";
    import LabelTree from '../labelTree'
    import {createGroup, getGroupDetail, updateGroup} from "../../assets/js/groupPortraitApi";
    import {getLabelTreeByProduct} from '../../assets/js/labelApi';

    export default {
        name: "groupDetail",
        components: {
            'label-tree': LabelTree
        },
        data: function () {
            return {
                searchKey: '',
                groupInfo: {},  // 群体详情
                colorIndex: 0,    // 生成选中节点的颜色
                colorList: ['blue', 'green', 'yellow', 'orange', 'red', 'pink', 'purple'],
                test: [
                    {
                        "id": 1,
                        "code": "A10001",
                        "topic": "基础特征类",
                        "level": 0, "isLeaf": 0,
                        "expanded": "true",
                        "labelCount": 3,
                        "labelInfoList": [],
                        "children": [{
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
                flatLabelData: [],  // 标签树扁平数据(普通json数据)
                selectedLabelId: [], //  群体已选标签id
                selectedLabelType: [], // 选中的标签类型
                selectedLabelList: [], // 选中的标签列表
                userId: window.user ? window.user.username : '测试',
                groupId: this.$route.query.groupId,
                type: this.$route.query.htmlType || 'add',
                buttonId: this.$route.query.buttonId || '',
                curPage: this.$route.query.curPage || 1,
                pageSize: this.$route.query.pageSize || 10,
                _searchKey: this.$route.query.searchKey || '',
                product: this.$route.query.product || '',
                backPath: '/group',
                isdrop: false,//是否显示下拉框
                dropList: [],//顶部下拉框列表项
                list: {}, //顶部下拉框默认选中项
                Arr: {},//顶部下拉前选中状态
                actives: '',
                istaggt: true,
                Dlist: [],
                selectedLabelObj: {}, // 已选标签对象
                attribute: 'udid', // 计算属性
            }
        },
        beforeRouteEnter(to, from, next) {
            console.log('router form', from)
            next(vm => {
                vm.backPath = from.path;
            })
        },
        created: function () {
            var that = this;
            this.quanxian();
            // that.biaoqianlist();
            console.log("判断跳转类型：", that.type)
            if (that.type != "add") this.istaggt = false;

            that.labelId = that.$route.query.labelId || ''
            that.type = that.$route.query.htmlType || 'add'
            that.curPage = that.$route.query.curPage || 1
            that.buttonId = that.$route.query.buttonId || ''
            that.pageSize = that.$route.query.pageSize || 10
            that.product = that.$route.query.product || ''
            that._searchKey = that.$route.query.searchKey || ''
        },
        mounted: function () {
            var that = this;
            that.showGroupDetail();
        },
        methods: {
            //树数据源嵌套结构转扁平
            NestedToFlat(children, parent) {
                let that = this;
                var arr = []
                for (var i = 0; i < children.length; i++) {
                    arr.push({id: children[i].id, text: children[i].topic, level: children[i].level, parent: parent})
                    if (children[i].children) arr = arr.concat(that.NestedToFlat(children[i].children, children[i].id));
                }
                return arr;
            },
            matchLabelParent(id) {
                let that = this;
                for (let i = 0, len = that.flatLabelData.length; i < len; i++) {
                    console.log(that.flatLabelData[i].id, id, that.flatLabelData[i] == Number(id))
                    if (that.flatLabelData[i].id == Number(id)) {
                        return that.flatLabelData[i];
                    }
                }
            },
            //  根据已选标签设置已选标签对象内容
            setSelectedLabelObj: function (labelId) {
                let that = this;
                var labelText, parentId, labelParent, labelSecondAttr, attrText, labelFirstClass, firstClassText;
                console.log('匹配的已选标签id===', labelId);
                labelText = $('.node-leaf[data-id=' + labelId + ']').text(); // 标签文本
                console.log('匹配的已选标签===', labelText);
                parentId = $('.node-leaf[data-id=' + labelId + ']').attr('data-type');
                console.log('已选标签parentId===', parentId)
                if (parentId == 'null' || !parentId) {
                    // 处理自定义标签父元素id 负责4
                    parentId = '4';
                }
                labelParent = that.matchLabelParent(parentId);//  标签父元素
                console.log(labelParent);
                if (labelParent && labelParent.level == '2') {
                    labelSecondAttr = that.matchLabelParent(labelParent.parent);  // 标签第二类属性
                    attrText = labelSecondAttr && labelSecondAttr.text;
                }
                if (labelParent && labelParent.level == '1') {
                    labelSecondAttr = labelParent;  // 标签第二类属性
                    attrText = labelSecondAttr && labelSecondAttr.text;
                }
                if (labelSecondAttr && labelSecondAttr.level == '1') {
                    labelFirstClass = that.matchLabelParent(labelSecondAttr.parent); // 标签第一类归属
                    firstClassText = labelFirstClass && labelFirstClass.text;
                }
                if (labelParent.level == '0') {
                    that.$set(that.selectedLabelObj, labelParent.text, labelText)
                }
                else {
                    if (!that.selectedLabelObj[firstClassText]) {
                        that.$set(that.selectedLabelObj, firstClassText, {})
                    }
                    if (labelParent.level == '1') {
                        if (!that.selectedLabelObj[firstClassText][attrText]) {
                            that.$set(that.selectedLabelObj[firstClassText], attrText, labelText)
                        }
                    }
                    else if (labelParent.level == '2') {
                        if (!that.selectedLabelObj[firstClassText][attrText]) {
                            that.$set(that.selectedLabelObj[firstClassText], attrText, {})
                        }
                        that.$set(that.selectedLabelObj[firstClassText][attrText], labelParent.text, labelText)
                    }
                }
                console.log(that.selectedLabelObj)
            },
            showGroupDetail: function () {
                // 查找群体标签id对应的info
                var that = this;
                that.selectedLabelId.forEach(function (item) {
                    var obj = {
                        labelId: item,
                        categoryId: Number($('.node-leaf[data-id=' + item + ']').attr('data-type')),
                        labelName: $('.node-leaf[data-id=' + item + ']').text()
                    };
                    that.setSelectedLabelObj(item)

                    that.selectedLabelType.push(obj.categoryId);
                    that.selectedLabelList.push(obj);
                    console.log('匹配的已选标签id对象--->', obj)
                });
            },
            selectedLeaf: function (leaf) {
                console.log(leaf, '点击的leaf node')
                var that = this;
                if (that.type === 'see') {
                    return;
                }
                // 添加标签 去重
                if (that.selectedLabelList.length == 5) {
                    alert('最多可选5个标签');
                    return;
                }
                var index;
                var deleteLabelId;
                console.log(that.selectedLabelType, leaf.categoryId)
                if (that.selectedLabelType.indexOf(leaf.categoryId) > -1) {
                    // 查询到selectedLabelList 同类型 item
                    console.log('已选同类型')
                    for (var i = 0; i < that.selectedLabelList.length; i++) {
                        if (that.selectedLabelList[i].categoryId === leaf.categoryId) {
                            index = i;
                            break;
                        }
                    }
                    console.log(index, '查询的index')
                    deleteLabelId = that.selectedLabelList[index].labelId;
                    var deleteLabelIndex = that.selectedLabelId.indexOf(deleteLabelId);
                    that.selectedLabelId.splice(deleteLabelIndex, 1)
                    that.selectedLabelList.splice(index, 1);
                }
                else {
                    this.selectedLabelType.push(leaf.categoryId)
                }
                this.selectedLabelId.push(leaf.labelId)
                this.selectedLabelList.push(leaf);
                this.selectedLabelId.forEach(function (item) {
                    that.setSelectedLabelObj(item)
                })
            },
            deleteLabel: function (type, index) {
                var that = this;
                // console.log('删除的key===>', type);
                var typeIndex = that.selectedLabelType.indexOf(type);
                var deleteLabelIndex = that.selectedLabelId.indexOf(that.selectedLabelList[index].labelId);
                that.selectedLabelId.splice(deleteLabelIndex, 1)
                that.selectedLabelType.splice(typeIndex, 1);
                that.selectedLabelList.splice(index, 1);
                that.selectedLabelObj = {}
                that.selectedLabelId.forEach(function (item) {
                    that.setSelectedLabelObj(item)
                })
            },
            search: function () {
                var that = this;
                var searchKeyword = $.trim(that.searchKey);
                console.log(searchKeyword, '搜索节点关键字');
                // 折叠父节点
                $('li.parent-item').removeClass('open');
                $('span.node').each(function () {
                    var text = $(this).text();
                    if (text.indexOf(searchKeyword) != -1) {
                        console.log(text, '匹配到的项');
                        console.log($(this).parents('li.parent-item'), '匹配到的父节点');
                        if ($(this).parents('li.parent-item')) {
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
            taggtON: function (val) {//确认保存
                var that = this;
                that.isdrop = !that.isdrop;
                that.Arr = val;
                that.biaoqianlist();
            },
            taggtOFF: function () {//取消保存
                var that = this;
                console.log(that.type);
                $('#con').html() ? this.istaggt = false : this.istaggt = true;
                if (that.type == 'edit' || this.istaggt == false) return;
                this.isdrop = !this.isdrop;
                if (this.isdrop) {
                    $(document).one("click", function () { //如果可见就为documnet对象绑定个一次性的单击事件
                        console.log("如果可见就为documnet对象绑定个一次性的单击事件")
                        that.isdrop = false;
                    });
                }
            },
            biaoqianlist: function () {
                // 请求标签树数据
                var that = this;
                store.dispatch("showLoading");
                var pros = '';
                this.Arr.id ? pros = this.Arr.id : pros = that.dropList[0].id;
                let params = {userId: that.userId, pro: pros};
                console.log('标签树参数--->', pros);
                getLabelTreeByProduct(params).then(res => {
                    let data = res.data;
                    if (data.retCode == 0) {
                        console.log('标签树数据--->', data.resultData);
                        that.flatLabelData = that.NestedToFlat(data.resultData, 0);
                        that.labelTreeList = data.resultData;
                        that.jiazai();
                    }
                    else {
                        that.$myModal({
                            show: true,
                            type: 'warning',
                            title: data.retDesc,
                            onOk: function () {
                            }
                        })
                    }
                })

                // // 测试
                // that.flatLabelData = that.NestedToFlat(that.test, 0);
                // that.labelTreeList = that.test;
                // that.jiazai();
            },
            shuaxinbiaoqianlist: function () {
                // 请求标签树数据
                var that = this;
                that.biaoqianlist();
            },
            jiazai: function () {
                var that = this;
                console.log('groupId--->', that.groupId);
                console.log('htmlType--->', that.type);
                if (that.type == 'see' || that.type == 'edit') {
                    //请求群体信息
                    getGroupDetail(that.groupId).then(res => {
                        store.dispatch("hideLoading");
                        let data = res.data;
                        if (data.retCode == 0) {
                            if (data.resultData) {
                                that.groupInfo = data.resultData;
                                that.attribute = that.groupInfo.aggregationFiled || 'udid';
                                that.selectedLabelId = that.groupInfo.labelIds.split(',');
                                console.log('群体组成的标签组--->', that.selectedLabelId)
                                setTimeout(function () {
                                    that.showGroupDetail();
                                }, 200);
                            }
                        }
                        else {
                            that.$myModal({
                                show: true,
                                type: 'warning',
                                title: data.retDesc,
                                onOk: function () {
                                }
                            })
                        }
                    })
                }else{
                    store.dispatch("hideLoading");
                }
            },
            // 保存提交
            submit: function () {
                var that = this;
                var labelIdArr = [];
                $('.result-item').each(function () {
                    labelIdArr.push($(this).attr('data-id'));
                });
                if (labelIdArr.length == 0) {

                    return false;
                }
                var groupName = $('input.labelName').val();
                if (groupName == '') {
                    that.$myModal({
                        show: true,
                        type: 'warning',
                        title: '请输入人群名称!',
                        okText: '知道了',
                    })
                    return false;
                }
                var params = {
                    labelIds: labelIdArr.join(),
                    labelGroupName: groupName,
                    user: that.userId,
                    product: that.Arr.name,
                    aggregationFiled: that.attribute
                };
                if (that.type == 'edit') { // 修改保存
                    console.log(params, '修改params')
                    params.LabelGroupId = that.groupId;
                    updateGroup(params).then(res => {
                        let data = res.data;
                        if (data.retCode == 0) {
                            // 返回
                            that.back();
                        }
                        else {
                            that.$myModal({
                                show: true,
                                type: 'warning',
                                title: data.retDesc,
                                onOk: function () {
                                }
                            })
                        }
                    })
                }
                else if (that.type = 'add') { // 新建保存
                    console.log(params, '新增params')
                    createGroup(params).then(res => {
                        let data = res.data;
                        if (data.retCode == 0) {
                            that.back();
                        }
                        else {
                            that.$myModal({
                                show: true,
                                type: 'warning',
                                title: data.retDesc,
                                onOk: function () {
                                }
                            })
                        }
                    })

                }
            },
            btnBlack: function () {
                this.back();
            },
            back: function () {
                var that = this;
                console.log(that.backPath, '返回 页面 路径')
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
