<template>
  <div id="app" v-cloak :class="'' + systemTheme">
    <div class="layout">
      <!-- sidebar -->
      <div class="sidebar">
        <div class="unfolded-menu-wrapper" v-show="isFolded == false">
          <div class="logo">
            <img src="./assets/img/logo@2x.png" class="logo-image">
          </div>
          <div class="unfolded-content-wrapper">
            <div class="title">
              系统导航
              <i class="icon icon-fold fr mgr" title="收起" @click="isFolded = true"></i>
            </div>
            <ul class="sidebar-menu unfolded-menu">
              <li class="unfolded-menu-item menu-item"
                  v-for="(item, index) in menuList"
                  :class="{'open': index == 0, 'selected': index ==  0}">
                <div class="super-unfolded-menu-item">
<!--                  <svg class="icon svg-icon svg-icon-default" aria-hidden="true">-->
<!--                    <use :xlink:href="'#' + item.imageUrl"></use>-->
<!--                  </svg>-->
<!--                  <svg class="icon svg-icon svg-icon-primary" aria-hidden="true">-->
<!--                    <use :xlink:href="'#' + item.imageUrl + '1'"></use>-->
<!--                  </svg>-->
                  <span class="icon iconfont" :class="item.imageUrl"></span>
                  {{item.name}}
                  <span class="icon iconfont icon-shangyiye-copy i-dropdown fr mgr" @click="toggleMenuDrop($event)"></span>
                </div>
                <ul class="subMenu-list">
                  <li v-for="subItem in item.childMenus">
                    <a class="link" href="javascript:void(0);" :class="{'active': activeRouterPath.indexOf(subItem.url) !== -1}" @click="menuClicked($event,subItem.url)" :data-id="subItem.url">
                      {{subItem.name}}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="folded-menu-wrapper" v-show="isFolded == true">
          <div class="logo mini-logo">
            <img src="./assets/img/mini_new_logo@2x.png" class="logo-image">
          </div>
          <div class="folded-content-wrapper">
            <div class="title" @click="isFolded = false">
              <div class="icon-wrapper">
                <i class="icon icon-open" title="展开"></i>
              </div>
            </div>
            <ul class="sidebar-menu folded-menu">
              <li class="folded-menu-item menu-item"
                  v-for="(item,index) in menuList"
                  :class="{'selected': index == 0}">
                <div class="super-folded-menu-item">
                  <div class="icon-wrapper">
<!--                    <svg class="icon svg-icon svg-icon-default" aria-hidden="true">-->
<!--                      <use :xlink:href="'#' + item.imageUrl"></use>-->
<!--                    </svg>-->
<!--                    <svg class="icon svg-icon svg-icon-primary" aria-hidden="true">-->
<!--                      <use :xlink:href="'#' + item.imageUrl + '1'"></use>-->
<!--                    </svg>-->
                    <span class="icon iconfont" :class="item.imageUrl"></span>
                  </div>
                </div>
                <ul class="subMenu-list menu-content">
                  <div class="text-wrapper menu-content-title">
                    <span>{{item.name}}</span>
                  </div>
                  <li class="menu-content-item" v-for="subItem in item.childMenus">
                    <a class="link" href="javascript:void(0);" :class="{'active': activeRouterPath.indexOf(subItem.url) !== -1}" @click="menuClicked($event,subItem.url)" :data-id="subItem.url">
                      {{subItem.name}}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- layout main -->
      <div class="layout-main">
        <!-- navbar -->
        <div class="navbar">
          <div class="container">
            <div class="row">
              <div class="system-name fl"></div>
              <div class="cell fr">
                <div class="row" style="line-height: 56px;">
                  <a class="cell mgr">{{user.name||'???'}}</a>
                  <a class="cell curp logout" @click="userlogout">退出</a>
                </div>
              </div>
              <div class="fr Pwd box">
                <span class="boxA" @click="showReporting">快捷报障</span>
                <div class="Pwd_box" v-show="quickReportingShow">
                  <div>
                    <span>标题：</span> <input id="Pwd_title" type="text" class="Pwd_title" placeholder='标题不可为空且不可超过200个字符' minlength="1" maxlength="200"
                                            onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)"
                                            onkeyup="this.value=this.value.substring(0, 200)" v-model="reportTitle">
                  </div>
                  <div>
                    <span style="position: relative;top: -135px;">内容：</span>
                    <textarea class="Pwd_content" style="resize:none;" placeholder='内容不可为空且不超过1000个字符' name='centerPwd' rows='7' required='required'
                              maxlength="1000" onchange="this.value=this.value.substring(0, 1000)" onkeydown="this.value=this.value.substring(0, 1000)"
                              onkeyup="this.value=this.value.substring(0, 1000)" v-model="reportContent"></textarea>
                  </div>
                  <div>
                    <input class="drop-btn-btn drop-btn-queren" style="background: #0696ff;border: 1px solid #0696ff;color: #fff" type="button" value="确认"
                           @click="quickReporting">
                    <input class="drop-btn-btn drop-btn-quxiao" type="button" value="取消" @click="hideReporting">
                  </div>
                </div>
                <div class="Pwd_jiao" style="display: none;"></div>
              </div>
              <div id="themeList" class="cell fr" style="position:relative; margin-right: 20px;" :class="{active: showTheme}" @click="showTheme = !showTheme">
                <div class="theme-title">
                  <span>皮肤</span>
                  <span class="theme-arrow"></span>
                </div>
                <div class="theme-box">
                  <span class="arrow-theme"></span>
                  <div class="theme-content">
                    <div class="dark-theme" :class="{active: systemTheme === 'darkTheme'}">
                      <div class="theme-color dark-color" @click="toggleTheme('darkTheme')" style="height: 30px;"></div>
                      <p class="theme-text dark-text">深色</p>
                    </div>
                    <div class="light-theme" :class="{active: systemTheme === 'lightTheme'}">
                      <div class="theme-color light-color" @click="toggleTheme('lightTheme')" style="height: 30px;"></div>
                      <p class="theme-text light-text">浅色</p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="droplist" class="cell fr" style="position:relative; margin-right: 20px;" v-click-outside="taggtON">
                <div class="taggt top-taggt" @click="isdrop = true">
                  <span v-if="isAllChecked || dropList.length === Arr.length">全部产品 &nbsp;</span>
                  <div v-else>
                    <span v-for="(item,index) in Arr">{{item.name}} {{index === Arr.length -1 ? '' : ",&nbsp;"}}</span>
                  </div>
                  <a class="curp dropjiao" :class="isdrop == true ? 'dropUp':'dropDown'"></a>
                </div>
                <div v-show="isdrop == true" class="drop product-top-drop">
                  <div v-if="dropList.length>1" class="drop-top">
                    <input @change='chooseAll' type="checkbox" v-model='isAllChecked' id="allProduct"><label for="allProduct">全部产品</label>
                  </div>
                  <div v-for="(item,index) in dropList" :key="index" class="drop-top">
                    <input @change="singleChecked" type="checkbox" v-model='list' :value="item.id" :id="'product' + item.id"><label :for="'product' + item.id">{{item.name}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="view-wrap">
          <a-locale-provider :locale="zh_CN">
            <router-view/>
          </a-locale-provider>
        </div>
      </div>
    </div>
    <div class="app-loading-wrapper" v-show="loading">
        <img class="imgLoad" src='data:image/gif;base64,R0lGODlhZABkAIABAEpJRwAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTI5MDY4N0Q1QTNDMTFFNzhCQjQ4MTMwQTdFMEFGODMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTI5MDY4N0U1QTNDMTFFNzhCQjQ4MTMwQTdFMEFGODMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMjkwNjg3QjVBM0MxMUU3OEJCNDgxMzBBN0UwQUY4MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMjkwNjg3QzVBM0MxMUU3OEJCNDgxMzBBN0UwQUY4MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTD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'>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery'
    import Vue from 'vue'
    import {mapState, mapActions} from 'vuex'
    import {getLoginUserInfo, getMenuOfUser, getProductOfUser, reporting} from '@/assets/js/indexApi.js'
    import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import moment from 'moment'
    import 'moment/locale/zh-cn'

    moment.locale('zh-cn')

    // 添加点击空白处的指令
    Vue.directive('click-outside', {
        bind: function bind(el, binding, vnode) {
            el.clickOutsideEvent = function (event) {
                // here I check that click was outside the el and his childrens
                if (!(el == event.target || el.contains(event.target))) {
                    // and if it did, call method provided in attribute value
                    vnode.context[binding.expression](event);
                }
            };
            console.log(el,el.clickOutsideEvent)
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        unbind: function unbind(el) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        }
    });

    export default {
        name: 'App',
        data: function () {
            return {
                zh_CN,
                activeRouterPath: this.$route.path,
                isFolded: false,
                menuList: [],
                pathName: window.location.pathname,
                user: {},
                showTheme: false,
                isdrop:false,//是否显示下拉框
                dropList:[],//顶部下拉框列表项
                list:[], //顶部下拉框默认选中项
                selectedProductList: [], // 确认选择产品列表
                isAllChecked: false, // 正在进行中的数据是否被选中
                actives:'',
                Arr:[], //顶部下拉前选中状态
                modeName: '达芬奇', // 系统模块名称
                quickReportingShow: false, // 快捷保障显示
                reportTitle: '达芬奇报障'+ new Date(),  //  快捷保障标题
                reportContent: '',  // 快捷保障内容
            }
        },
        created: function () {
            let that = this;

            // 获取登录用户权限菜单
            that.getMenuOfUser();

            // 获取登录用户权限产品
            that.getProductOfUser();

            // 获取登录用户信息
            that.getUserInfo();

        },
        computed: {
            ...mapState({
                systemTheme: state => state.systemTheme,
                loading: state =>  state.loading
            })
        },
        watch: {
            $route(to, from) {
                // console.log(to.fullPath, '路由to path')
                console.log(to, '路由to path')
                // console.log(from.fullPath, '路由from path')
                this.activeRouterPath = to.path;
            },
            systemTheme(newValue, oldValue){
                console.log('系统主题色changed===',newValue, oldValue)
            },
            list(newValue, oldValue){
                // console.log(newValue,oldValue,'产品list 新选中changed')
                let that = this;
                that.Arr = [];
                newValue.forEach(function(checkedItem){
                    that.dropList.forEach(function(item){
                        if(checkedItem === item.id){
                            that.Arr.push(item);
                        }
                    })
                })
            },
            selectedProductList(newList,oldList){
                console.log('产品列表===', newList, oldList);
                let same = true;
                if(oldList.length > 0){
                    if(newList.length !== oldList.length){
                        same = false;
                    }else{
                        for(let i =  0, len = newList.length; i < len; i++){
                            if(!oldList.includes(newList[i])){
                                same = false;
                                break;
                            }
                        }
                    }
                }
                console.log(same, '是否相同')
                if(!same){
                    this.$router.go(0);
                }
            },
        },
        methods: {
            ...mapActions(['setTheme']),
            // 获取地址栏变量
            getQueryParam: function (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURIComponent(r[2]);
                return null;
            },
            // 获取用户权限的菜单
            getMenuOfUser(){
                let that = this;
                let systemId = this.getQueryParam('systemId') || '17';
                window.systemId = this.systemId;

                that.menuList = [{"id":"78","parentId":"0","subSystemId":"1","name":"整体看板","url":"/","imageUrl":"icon-zhengtikanban","remark":null,"sort":1,"childMenus":[{"id":"84","parentId":"78","subSystemId":"1","name":"大盘总览","url":"/overView","imageUrl":null,"remark":null,"sort":1,"childMenus":[{"id":"98","parentId":"84","subSystemId":"84","name":"测试按钮","url":"1","imageUrl":null,"remark":null,"sort":84,"childMenus":[]}]},{"id":"85","parentId":"78","subSystemId":"2","name":"内容偏好","url":"/contentPreference","imageUrl":null,"remark":null,"sort":2,"childMenus":[]},{"id":"86","parentId":"78","subSystemId":"3","name":"消费偏好","url":"/consumptionPreference","imageUrl":null,"remark":null,"sort":3,"childMenus":[]},{"id":"88","parentId":"78","subSystemId":"5","name":"播放偏好","url":"/playPreference","imageUrl":null,"remark":null,"sort":5,"childMenus":[]},]},{"id":"79","parentId":"0","subSystemId":"2","name":"个人画像","url":"/","imageUrl":"icon-gerenhuaxiang","remark":null,"sort":2,"childMenus":[{"id":"90","parentId":"79","subSystemId":"1","name":"个人画像","url":"/personalPortrait","imageUrl":null,"remark":null,"sort":1,"childMenus":[]}]},{"id":"80","parentId":"0","subSystemId":"3","name":"报表中心","url":"/","imageUrl":"icon-baobiaozhongxin","remark":null,"sort":3,"childMenus":[{"id":"91","parentId":"80","subSystemId":"1","name":"热门画像","url":"/hotPortrait","imageUrl":null,"remark":null,"sort":1,"childMenus":[]},{"id":"92","parentId":"80","subSystemId":"2","name":"热门搜索","url":"/hotSearch","imageUrl":null,"remark":null,"sort":2,"childMenus":[]},{"id":"93","parentId":"80","subSystemId":"3","name":"系统日志","url":"/systemLog","imageUrl":null,"remark":null,"sort":3,"childMenus":[]}]},{"id":"81","parentId":"0","subSystemId":"4","name":"标签市场","url":"/","imageUrl":"icon-biaoqianshichang","remark":null,"sort":4,"childMenus":[{"id":"94","parentId":"81","subSystemId":"1","name":"标签列表","url":"/label","imageUrl":null,"remark":null,"sort":1,"childMenus":[]},{"id":"95","parentId":"81","subSystemId":"2","name":"标签总览","url":"/LabelOverview","imageUrl":null,"remark":null,"sort":2,"childMenus":[]}]},{"id":"82","parentId":"0","subSystemId":"5","name":"群体画像","url":"/","imageUrl":"icon-quntihuaxiang","remark":null,"sort":5,"childMenus":[{"id":"96","parentId":"82","subSystemId":"1","name":"群体画像","url":"/group","imageUrl":null,"remark":null,"sort":1,"childMenus":[]}]},{"id":"83","parentId":"0","subSystemId":"6","name":"我的收藏","url":"/","imageUrl":"icon-wodeshoucang","remark":null,"sort":6,"childMenus":[{"id":"97","parentId":"83","subSystemId":"1","name":"我的收藏","url":"/myCollection","imageUrl":null,"remark":null,"sort":1,"childMenus":[]}]}]

                // getMenuOfUser(systemId).then(res => {
                //     console.log( '菜单data===', res.data)
                //     that.menuList = res.data.data;
                // });
            },
            // 获取用户信息
            getUserInfo(){
                let that = this;
                that.user = {"id":"24","username":"13592517960","name":"韩阿辉","authorities":[{"authority":"test4"},{"authority":"咪视通"},{"authority":"test2"},{"authority":"test3"},{"authority":"咪咕影院H5"},{"authority":"咪咕TV"},{"authority":"咪咕直播app"},{"authority":"咪咕视频app"},{"authority":"咪咕影院app"},{"authority":"test1"}],"passwordFlag":0,"deptId":"1","deptName":"研发中心","dataAuthority":"","userType":0};
                window.user = that.user;
                // getLoginUserInfo(function(res){
                //     that.user = res.data;
                //     window.user = that.user;
                // })
            },
            // 获取用户权限产品
            getProductOfUser(){
                let that = this;
                // getProductOfUser(function(res){
                //     console.log('用户产品权限===', res.data)
                    that.dropList = [{"name":"咪视通","id":"6"},{"name":"咪咕影院H5","id":"3"},{"name":"咪咕TV","id":"5"},{"name":"咪咕直播app","id":"4"},{"name":"咪咕视频app","id":"1"},{"name":"咪咕影院app","id":"2"}];
                    window.productDropList = that.dropList;
                    if(sessionStorage.getItem('selectedProductList') && JSON.parse(sessionStorage.getItem('selectedProductList').length !== that.dropList.length)){
                        that.list = JSON.parse(sessionStorage.getItem('selectedProductList'))
                        that.selectedProductList = that.list;
                    }else{
                        that.isAllChecked = true;
                        that.chooseAll();
                        var accessToken= '';
                        if(that.dropList.length > 0){
                            that.dropList.forEach(function(item,index){
                                if(index<that.dropList.length-1){accessToken += item.id+'@';}else{ accessToken += item.id;}
                            });
                            sessionStorage.setItem('productArray', accessToken);
                            document.cookie="productArray="+accessToken+"; path=/";
                        }
                        that.selectedProductList = that.list;
                        // console.log(that.list, '默认全选')
                    }
                // })
            },
            // 菜单下拉
            toggleMenuDrop: function(event){
                var parentDom = event.target.parentNode.parentNode;
                console.log(parentDom.className.indexOf('open') === -1)
                if(parentDom.className.indexOf('open') === -1){
                    parentDom.classList.add('open');
                }else{
                    parentDom.classList.remove('open');
                }
            },
            // 用户退出
            userlogout: function(){

            },

            //  显示快捷保障
            showReporting: function(){
              let that = this;
              that.quickReportingShow = true;
              that.reportTitle = '';
              that.reportContent = '';
            },
            //  快捷保障
            quickReporting: function(){
              let that = this;
              if(that.reportTitle === '' || that.reportTitle === ''){

              }
              let params = {
                  loginName:that.user.username,//'登录名',
                  mobile:that.user.username,//'手机号',
                  deptName:that.user.deptName,//'部门名称',
                  deptId:that.user.deptId,//'部门id'
                  moduleFlag: that.modeName, //'报障模块'
                  mailSubject:that.reportTitle,//'标题',
                  mailContent:that.reportContent,//'内容',
              }
              //  console.log('快捷报障参数===',params);
              // reporting(params).then(res => {
              //     console.log('快捷报障返回===', res.data)
              //     let resp = res.data;
              //     if(resp.result == 0){
              //         quickReportingShow = false;
              //         // 提示发送成功
              //     }
              // })
              quickReportingShow = false;
            },
            // 隐藏快捷保障
            hideReporting: function(){
              let that = this;
              that.quickReportingShow = false;
            },
            // 切换主题色
            toggleTheme: function(theme){
                // console.log(theme, 'toggle theme');
                sessionStorage.setItem('theme', theme);
                document.getElementById('app').className = theme;
                this.setTheme(theme);
                this.$router.go(0);
            },
            //  菜单点击事件
            menuClicked:  function(event,url){
                console.log('路由跳转path===', url)
                // 获取a标签
                let menus =  document.getElementsByClassName('link');
                let clickedMenu  = [];
                for(let i =  0; i< menus.length; i++){
                    if(menus[i].getAttribute('data-id') == url){
                        clickedMenu.push(menus[i]);
                    }
                }
                // 所有menu-item title取消selected
                let titles = document.getElementsByClassName('menu-item');
                for(let i = 0; i< titles.length; i++){
                    titles[i].classList.remove('selected');
                }
                clickedMenu.forEach(function(menu){
                    menu.parentNode.parentNode.parentNode.classList.add('selected');
                })
                this.$router.push({
                    path: url
                })
            },
            // 全部产品选中
            chooseAll: function(){
                console.log(this.isAllChecked, '是否选中全部产品');
                let that = this;
                if(this.isAllChecked){
                    // 选中全部产品
                    that.Arr = that.dropList;
                    that.list = [];
                    that.dropList.forEach(function(item){
                        that.list.push(item.id);
                    });
                    let accessToken = '';
                    that.list.forEach(function(item,index){
                        if(index<that.list.length-1){accessToken += item+'@';}else{ accessToken += item;}
                    });
                }else{
                    // 取消选中全部产品
                    that.Arr = [];
                    that.list = [];
                }
            },
            singleChecked: function(){
                console.log(this.list, '当前选中的product item')
                console.log(this.Arr, '当前选中的product item')
                let that = this;
                if(that.list.length === that.dropList.length){
                    // console.log('全选');
                    that.isAllChecked = true;
                }else{
                    // console.log('非全选')
                    that.isAllChecked = false;
                }
            },
            // 产品下拉框外点击事件
            taggtON:function(){
                let that = this;
                if(!that.isdrop){
                    return;
                }
                var accessToken= '';
                if(that.list.length > 0){
                    that.isdrop = false;
                    that.list.forEach(function(item,index){
                        if(index<that.list.length-1){accessToken += item+'@';}else{ accessToken += item;}
                    });
                    sessionStorage.setItem('selectedProductList', JSON.stringify(that.list));
                    sessionStorage.setItem('productArray', accessToken);
                    document.cookie="productArray="+accessToken+"; path=/";
                    that.selectedProductList = that.list;
                }else{
                    // alert('至少选中一项');
                }
            },
            computedSelectedText: function(){
                let that = this;
                this.Arr = [];
                that.list.forEach(function(item){
                    for(var i = 0; i < that.dropList.length; i ++){
                        if(item === that.dropList[i].id){
                            that.Arr.push(that.dropList[i]);
                            break;
                        }
                    }
                });
            },
        }
    }
</script>

<style lang='less'>
  @import './assets/css/theme';
  @import './assets/css/customAntStyle';
  #app{
    position: relative;
    width: 100%;
    height: 100%;
    .layout{
      display: flex;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .view-wrap{
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
      /* 左侧菜单svg icon 样式 */
      .svg-icon{
        display: none;
        width: 16px;
        height: 16px;
        vertical-align: -.35em;
        fill: currentColor;
        overflow: hidden;
      }
      .svg-icon.svg-icon-default{
        display: inline-block;
      }
      .icon{
        margin-left: 16px;
        margin-right: 16px;
      }
      /* 左侧菜单样式 */
      .sidebar{
        height: 100%;
        font-size: 14px;
      }
      .sidebar .title .menu-icon,.sidebar-menu .menu-icon{
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
      .super-unfolded-menu-item .svg-icon{
        margin-left: 16px;
        margin-right: 14px;
        vertical-align: middle;
      }
      .sidebar-menu li a {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-weight: normal;
      }
      .sidebar-menu  li a.active:hover{
        color: #0696ff;
      }
      .subMenu-list{  /* 隐藏二级菜单 */
        display: none;
        transition: .3s;
      }
      .menu-item .i-dropdown{
        line-height: 1em;
        margin-top: 14px;
        cursor: pointer;
        font-weight: normal;
      }
      .menu-item.open .subMenu-list{  /* 显示二级菜单 */
        display: block;
      }
      .menu-item .super-unfolded-menu-item{
        font-weight: bold;
      }
      .menu-item.open .super-unfolded-menu-item .i-dropdown{
        transform: rotate(180deg);
        -ms-transform:rotate(180deg); /* Internet Explorer */
        -moz-transform:rotate(180deg); /* Firefox */
        -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
        -o-transform:rotate(180deg); /* Opera */
      }
      .menu-item.selected .svg-icon.svg-icon-default{
        display: none;
      }
      .menu-item.selected .svg-icon.svg-icon-primary{
        display: inline-block;
      }
      .unfolded-content-wrapper{
        position: relative;
        height: 100%;
        padding-top: 44px;
      }
      .folded-content-wrapper{
        height: 100%;
      }
      /* 展开菜单样式 */
      .unfolded-menu-wrapper{
        position: relative;
        width: 180px;
        height: 100%;
        padding-top: 56px;
      }
      .unfolded-menu-wrapper .logo{
        position: absolute;
        top: 0;
        left: 0;
        width: 180px;
        height: 56px;
        background: rgb(22,22,22);
      }
      .unfolded-menu-wrapper .logo .logo-image{
        position: absolute;
        display: block;
        width: 136px;
        height: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .unfolded-menu-wrapper .title{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 44px;
        padding-left: 48px;
        line-height: 44px;
      }
      .unfolded-menu-wrapper .title .icon-fold{
        display: inline-block;
        width: 16px;
        height: 100%;
        cursor: pointer;
      }
      .unfolded-menu-wrapper .unfolded-menu{
        position: relative;
        height: 100%;
        overflow-y: auto;
        line-height: 44px;
      }
      .unfolded-menu-wrapper .subMenu-list li a{
        padding-left: 64px;
      }
      .unfolded-menu-wrapper .subMenu-list li a.link.active{
        color: #0696ff;
        border-right: 4px solid #0696ff;
      }
      .unfolded-menu-wrapper .unfolded-menu-item.selected .super-unfolded-menu-item{
        color: #0696ff;
      }
      .unfolded-menu-wrapper .menu-content-item{
        height: 44px;
        line-height: 44px;
      }
      /* 折叠菜单样式 */
      .folded-menu-wrapper{
        position: relative;
        width: 60px;
        height: 100%;
        padding-top: 56px;
      }
      .folded-menu-wrapper .logo{
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        height: 56px;
        background: rgb(22,22,22);
      }
      .folded-menu-wrapper .logo .logo-image{
        position: absolute;
        display: block;
        width: 40px;
        height: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .folded-menu-wrapper .icon-wrapper{
        height: 44px;
        line-height: 44px;
      }
      .folded-menu-wrapper .text-wrapper{
        height: 46px;
        padding-left: 16px;
        line-height: 46px;
        text-align: left;
        font-weight: bold;
      }
      .folded-menu-wrapper .menu-content-title{
        font-weight: bold;
        font-size: 14px;
      }
      .folded-menu-wrapper .title{
        height: 44px;
        text-align: center;
      }
      .folded-menu-wrapper .title .icon-open{
        display: inline-block;
        width: 16px;
        height: 100%;
        cursor: pointer;
      }
      .folded-menu-wrapper .folded-menu-item{
        position: relative;
        height: 44px;
        text-align: center;
        margin-bottom: 0;
      }
      .folded-menu-wrapper .folded-menu .super-folded-menu-item{
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 200;
      }
      .folded-menu-wrapper .folded-menu .menu-item.selected .super-folded-menu-item{
        color: #0696ff;
      }
      .folded-menu-wrapper .folded-menu-item .menu-content{
        display: none;
        position: absolute;
        top: -1px;
        right: -129px;
        width: 130px;
        z-index: 199;
      }
      .folded-menu-wrapper .folded-menu-item:first-child:hover{
        border-top: 0;
      }
      .folded-menu-wrapper .folded-menu-item:hover .menu-content{
        display: block;
        min-height: 80px;
      }
      .folded-menu-wrapper .folded-menu-item.selected:hover .menu-content{
        display: block;
        min-height: 80px;
      }
      .folded-menu-wrapper .folded-menu-item.selected .menu-content .menu-content-title{
        display: block;
        min-height: 46px;
        color: #0696ff;
      }
      .folded-menu-wrapper .menu-content .menu-content-item{
        height: 44px;
        line-height: 44px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .folded-menu-wrapper .menu-content .menu-content-item a{
        padding-left: 16px;
      }
      .folded-menu-wrapper .menu-content .menu-content-item a.link.active{
        color: #0696ff;
        border-right: 0;
      }

      /* 右侧内容样式 */
      .layout-main{
        position: relative;
        flex: 1;
        padding-top: 56px;
        /*  navbar */
        .navbar{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 56px;
          padding-right: 16px;
          background: rgba(22,22,22,1);
        }
        .system-name{
          margin-left: 16px;
          line-height: 56px;
          font-size: 22px;
          font-weight: bold;
        }
        .box{
          width: auto;
          margin-right: 30px;
          height: 56px;
          text-align: center;
        }
        .boxA{
          width: auto;
          height: 56px;
          padding: 5px 8px;
          line-height: 56px;
          text-align: center;
          border: 1px #ccc solid;
          border-radius: 4px;
          cursor: pointer;
        }
        .boxA:hover {
          color:#0D7FF9;
          border-color: #0D7FF9;
        }
        .actives {
          background: #4D4F5E;
        }
        /* 画像顶部下拉框 */
        .top-taggt {
          min-width: 200px;
          height: 32px;
          line-height: 32px;
          margin-top: 13px;
          text-align: right;
          cursor: pointer;
        }
        .top-taggt:hover{
          color:  #0D7FF9;
        }
        .top-taggt span {
          line-height: 30px;
          margin-right: 12px;
        }
        .dropjiao {
          position: absolute;
          right: 0;
          top: 28px;
          width:0;
          height:0;
          border-right:4px solid transparent;
          border-left:4px solid transparent;
        }
        .dropUp {
          border-bottom:6px solid #ffffff;
        }
        .dropDown{
          border-top:6px solid #ffffff;
        }
        .top-taggt:hover .dropUp{
          border-bottom:6px solid #0D7FF9;
        }
        .top-taggt:hover .dropDown{
          border-top:6px solid #0D7FF9;
        }
        .drop-lr {
          width: 100%;
          border: 1px solid #E0E0E0;
        }
        .product-top-drop {
          position: relative;
          width:200px;
          border-radius: 4px;
          font-size: 14px;
          margin-left: 10px;
          right: 0;
          box-shadow: 0 3px 13px 0 #202127, inset 0 0 2px 0 #FFFFFF;
          z-index: 999;
        }
        .drop-top {
          height: 32px;
          line-height: 32px;
          padding-left: 10px;
        }
        .drop-btn {
          height: 48px;
          padding: 10px 15px;
        }
        .drop-btn-btn {
          float: right;
          margin-left: 8px;
          width: 64px;
          height: 28px;
          border-radius: 4px;
          font-size: 14px;
          text-align: center;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          color: #4D4D4D;
        }
        .Pwd {
          position: relative;
        }
        .Pwd_jiao {
          position:absolute;
          top: 45px;
          right: 35px;
          width: 10px;
          height: 10px;
          transform:rotate(45deg);
          -ms-transform:rotate(45deg); 	/* IE 9 */
          -moz-transform:rotate(45deg); 	/* Firefox */
          -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
          -o-transform:rotate(45deg); 	/* Opera */
          background: #fff;
        }
        .Pwd_box {
          position: absolute;
          top: 50px;
          right: 0;
          width: 350px;
          padding: 10px;
          height: 260px;
          border: 1px solid #ccc;
          border-radius: 4px;
          z-index: 100;
        }
        .Pwd_box div {
          margin: 10px;
          text-align: left;
        }
        .Pwd_box div .Pwd_title {
          width: 260px;
        }
        .Pwd_content {
          width: 260px;
          height: 155px;
        }
        /* 皮肤切换样式 */
        #themeList{
          position: relative;
          height: 56px;
          margin-right: 20px;
        }
        #themeList .theme-title{
          line-height: 56px;
          cursor: pointer;
        }
        #themeList .theme-title .theme-arrow{
          display: inline-block;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
          border-top: 6px solid #ffffff;
          margin-left: 8px;
        }
        #themeList:hover .theme-title{
          color: #0D7FF9;
        }
        #themeList:hover .theme-title .theme-arrow{
          border-top: 6px solid #0D7FF9;
        }
        #themeList .theme-box{
          display: none;
          position: absolute;
          top: 48px;
          right: 0;
          width: 110px;
          height: 78px;
          background: #252525;
          border: 1px solid #808080;
          box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
          z-index: 100;
        }
        #themeList.active .theme-box{
          display: block;
        }
        #themeList .theme-box .arrow-theme{
          display: inline-block;
          position: absolute;
          right: 10px;
          top: -4px;
          width: 8px;
          height: 8px;
          background: #252525;
          transform: rotate(45deg);
          border-top: 1px solid #808080;
          border-left: 1px solid  #808080;
        }
        #themeList:hover .theme-title{
          color: #0D7FF9;
        }
        #themeList:hover .theme-title .arrow-theme{
          background: #0D7FF9;
        }
        #themeList .theme-content{
          width: 100%;
          height: 100%;
          display: flex;
          padding: 0 10px;
          justify-content: space-around;
          align-items: center;
        }
        #themeList .theme-content .theme-color{
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        #themeList .theme-content .theme-color.dark-color{
          background: #333333;
          border: 1px solid rgba(102,102,102,1)
        }
        #themeList .theme-content .theme-color.light-color{
          background:rgba(247,247,247,1);
          border:1px solid rgba(204,204,204,1);
        }
        #themeList .theme-content .theme-text{
          margin-top: 5px;
          line-height: 14px;
          color: #cccccc;
        }
        #themeList .dark-theme.active .theme-color.dark-color {
          background: url('./assets/img/icon-dark-active.png') center no-repeat;
        }
        #themeList .light-theme.active .theme-color.light-color {
          background: #ffffff url('./assets/img/icon-light-active.png') center no-repeat;
        }
        a.logout:hover{
          color: #0D7FF9;
        }
      }
    }
    .app-loading-wrapper{
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      top: 0;
      left: 0;
      z-index: 100;
      .imgLoad{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 50px;
        height: 50px;
      }
    }
  }
</style>
