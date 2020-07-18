<template>
  <div id="main" class="pd">
    <div class="bgd page-title">
      <div class="detail-title page-title-text" v-if="type === 'see'">标签管理 - 自定义标签明细</div>
      <div class="edit-title page-title-text" v-if="type === 'edit'">标签管理 - 修改自定义标签</div>
      <div class="add-title page-title-text" v-if="type === 'add'">标签管理 - 新建自定义标签</div>
    </div>
    <div class="data" name="zuHe" id="biaoQian">
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
            <ul class="tree-list">
              <li class="parent-item open">
                <div class="node-wrapper">
                  <div class="switch"></div>
                  <span class="node-parent-icon"></span>
                  <span class="node node-parent">{{labelTreeData.topic}}</span>
                </div>
                <ul class="tree-list">
                  <li class="parent-item" v-for="(item, index) in labelTreeData.children" :key="index">
                    <div class="category">
                      <div class="switch"></div>
                      <span class="node-parent-icon"></span>
                      <span class="node node-parent"
                            :class="{active: category.categoryCode == item.categoryCode}"
                            @click="selectedCategory(item)">
                                                {{item.categoryName}}
                                            </span>
                    </div>
                    <ul class="tree-list" v-if="item.labelInfo"></ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="datatable">
        <div class="con-wrapper">
          <div class="custom-label-form">
            <div class="form-group flex">
              <div class="group-label" v-show="category.textName">
                <span class="require-flag">*</span>
                <span class="label-text">{{category.textName}}：</span>
              </div>
              <div class="group-content" v-click-outside="hideSearchResult">
                <div class="search-input-container" v-show="category.textType == 'str'">
                  <input class="search-input" type="text" v-model="labelKey" placeholder="请输入" @input="SearchLabel" :disabled="type == 'see'">
                  <div class="result-box" v-show="searchDown">
                    <div class="result-list">
                      <div class="searching" v-show="searching">搜索中...</div>
                      <div class="no-data item" v-show="!searching && searchResult.length === 0">暂无数据</div>
                      <div class="item" v-for="(item, index) in searchResult" @click="chooseLabel(item)">{{item}}</div>
                    </div>
                  </div>
                </div>
                <div class="date-container" v-show="category.textType == 'date'">
                  <a-date-picker
                    placeholder="请选择"
                    format="YYYY-MM-DD"
                    :disabled="type == 'see'"
                    :getCalendarContainer="getCalendarContainer()"
                    :value="customTime"
                    @change="createDateChanged"/>
                </div>
              </div>
            </div>
          </div>
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
    import store from "../../store/index.js";
    import moment from 'moment'
    import $ from 'jquery'
    import LabelTree from '../labelTree'
    import {getCustomLabelTree, getLabelDetail, searchCustomLabel, updateCustomLabel} from "../../assets/js/labelApi";

    export default {
        name: "customDetail",
        components: {
            'label-tree': LabelTree
        },
        data(){
            return {
                userId: window.user ? window.user.username : '测试',
                labelId: this.$route.query.labelId || '',
                type: this.$route.query.htmlType || 'add',
                buttonId: this.$route.query.buttonId || '',
                curPage: this.$route.query.curPage || 1,
                pageSize: this.$route.query.pageSize ||  10,
                _searchKey: this.$route.query.searchKey || '',
                backPath: '/label',
                product: this.$route.query.product || '',
                searchKey: '',
                isdrop:false,//是否显示下拉框
                dropList:[],//顶部下拉框列表项
                list:{}, //顶部下拉框默认选中项
                Arr:{},//顶部下拉前选中状态
                actives:'',
                Dlist:[],
                labelInfo: {},
                labelTreeData: {}, //  自定义标签树数据
                category: {}, // 当前自定义标签归属分类
                customTime: moment(), // 用户自定义时间
                labelKey: '',// 模糊搜索key
                searchDown: false, // 搜索结果下拉列表
                searching: false, // 搜索中
                searchTimer: null,
                searchResult: [], // 模糊匹配结果
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
            moment,
            getCalendarContainer() {
                return triggerNode => triggerNode.parentNode;
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
                if(that.type !== 'add') return;
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
                getCustomLabelTree(params).then(res => {
                    let data = res.data;
                    if(data.retCode == 0){
                        console.log('标签树数据--->',data.resultData);
                        that.labelTreeData = data.resultData
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
                        let result = res.data;
                        store.dispatch("hideLoading");
                        if (0 == result.retCode) {
                            var resultData = result.resultData;
                            console.log(resultData,'标签详情')
                            if(resultData){
                                that.labelInfo = resultData;
                                that.matchCategory(that.labelInfo.remark);
                            }
                        }
                    })
                }else{
                    store.dispatch("hideLoading");
                }
            },
            // 匹配自定义分类category
            matchCategory: function(remark){
                var that = this;
                var arr = that.labelTreeData.children;
                for(let i = 0, len = arr.length; i < len; i ++){
                    if(arr[i].remark === remark){
                        that.category = arr[i];
                        break;
                    }
                }
                console.log(that.category,'匹配的自定义分类')
                if(that.category.textType == 'str'){
                    that.labelKey = that.labelInfo.labelValues;
                }else if(that.category.textType == 'date'){
                    that.customTime = moment(that.labelInfo.labelValues, 'YYYY-MM-DD');
                }
            },
            // 选择自定义标签分类
            selectedCategory: function(obj){
                if(this.type == 'see' || this.type == 'edit'){
                    return;
                }
                if(this.category.categoryId !== obj.categoryId){
                    console.log('自定义标签类==',obj)
                    this.labelKey = '';

                    this.category = obj;
                }
            },
            // 模糊搜索匹配
            SearchLabel: function(event){
                var that = this;
                var value = event.target.value;
                if(value == ''){
                    that.searchDown = false;
                    return;
                }
                that.searchDown = true;
                that.searching = true;
                if(that.searchTimer){
                    clearTimeout(that.searchTimer);
                    that.searchTimer = null;
                }
                that.searchTimer = setTimeout(function(){
                    let params = {remark: that.category.remark, product: that.Arr.id || 1, labelValues: value}
                    searchCustomLabel(params).then(res => {
                        console.log('模糊匹配data==',res.data)
                        let  data = res.data;
                        that.searching = false;
                        that.searchResult = data.resultData || [];
                    })
                },500)
            },
            // 隐藏匹配下拉列表
            hideSearchResult: function(){
                this.searchDown = false
            },
            // 自定义时间控件选择
            createDateChanged(moment, timeStr){
                console.log(moment, '选择date');
                this.customTime = moment;
            },
            chooseLabel: function(label){
                var that = this;
                that.labelKey = label;
                that.searchDown = false;
            },
            // 保存提交
            submit:function(){
                var that = this;
                var labelName = $('.group-name .labelName').val();
                if(!that.category.remark){
                    // 未选择自定义分类
                    that.$myModal({
                        show: true,
                        title: '请选择自定义标签内容!',
                        okText: '知道了',
                    })
                    return false;
                }else{
                    if(that.category.textType == 'str' && that.labelKey == ''){
                        that.$myModal({
                            show: true,
                            title: '请输入自定义'+that.category.textName,
                            okText: '知道了',
                        })
                        return false;
                    }
                }

                if(labelName == ''){
                    that.$myModal({
                        show: true,
                        title: '请输入自定义标签名称!',
                        okText: '知道了',
                    })
                    return false;
                }
                var param = {
                    userId: that.userId,
                    labelName:labelName,
                    labelDefine: that.category.categoryName,
                    remark: that.category.remark,
                    product: that.Arr.id || 1,
                    labelValues: that.category.textType == 'str' ? that.labelKey : (that.category.textType == 'date' ? that.customTime.format('YYYY-MM-DD') : '')
                };
                if(that.type == 'edit'){
                    param.labelId = that.labelId
                }
                console.log("methods--->editClick--->param:",param);
                updateCustomLabel(param).then(res =>{
                    let data = res.data;
                    if(data.retCode == '0'){
                        // 保存成功返回
                        that.back();
                    }else{
                        that.$myModal({
                            show: true,
                            type: 'warning',
                            title: data.retDesc,
                            okText: '知道了',
                        })
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

<style lang="less" scoped>
  @import '../../assets/css/newGroup';
  /deep/.ant-calendar-picker-input{
    background: #161616 !important;
    cursor: pointer;
  }
  /* 一级标签 */
  .tree-list>li, .label-list>li{
    padding-left: 30px;
  }
  .node-parent, .node-leaf{
    display: inline-block;
    max-width: 60%;
    padding: 0 10px;
    border-radius: 4px;
    cursor: pointer;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .node-parent {
    font-size: 12px;
    font-family: "PingFang SC","Helvetica Neue",Helvetica,Arial,SimSun,sans-serif;
    letter-spacing:0.1em;
    &.active{
      color: #f2f2f2 !important;
      background:  #0696ff;
    }
  }
  .node-leaf.selected{
    background: #0696ff;
  }
  /* 节点图标 */
  .node-parent-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(../../assets/img/parent-node-icons.svg);
    background-size: 16px;
    vertical-align: middle;
    cursor: pointer;
  }
  .node-parent-text{
    cursor: pointer;
  }
  .node-parent-text:hover{
    text-decoration: underline;
  }
  .node-leaf-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(../../assets/img/leaf-node-icon.png);
    background-size: 16px;
    vertical-align: middle;
  }
  .parent-item {
    height: 32px;
    overflow: hidden;
    & > .node-wrapper {
      display: inline-block;
      width: 100%;
      & > .switch {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 10px;
        line-height: 32px;
        vertical-align: middle;
        background: url('../../assets/img/icon-arrow-right.png') center no-repeat;
        cursor: pointer;
      }
    }
    &.open {
      height: inherit;
      & > .node-wrapper {
        & > .switch {
          background: url('../../assets/img/icon-arrow-down.png') center no-repeat;
        }
      }
    }
  }
</style>

