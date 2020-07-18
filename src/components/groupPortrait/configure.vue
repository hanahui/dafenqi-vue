<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>群体列表 - 模块配置</div>
    </div>
    <div class="modules-wrapper bgd mgt">
      <div class="modules-form">
        <div class="form-group">
          <div class="group-header">
            <input type="checkbox" class="select-all" value='overView' v-model="overViewAll" id="allView"><label class="group-name" for="allView">大盘总览</label>
          </div>
          <ul class="group-list">
            <li class="group-item"  v-for="(item, index) in overViewList" :key="index">
              <input type="checkbox" :id="'module' +  item.id" :value="item.id" v-model="overView" :disabled="item.isValid == 0">
              <label class="item-name" :for="'module' +  item.id">{{item.moduleName}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group">
          <div class="group-header">
            <input type="checkbox" class="select-all" value='usage' v-model="usageAll" id="allUsage"><label class="group-name" for="allUsage">访问偏好</label>
          </div>
          <ul class="group-list">
            <li class="group-item" v-for="(item, index) in usageList" :key="index">
              <input type="checkbox" :id="'module' +  item.id" :value="item.id" v-model="usage" :disabled="item.isValid == 0">
              <label class="item-name" :for="'module' +  item.id">{{item.moduleName}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group">
          <div class="group-header">
            <input type="checkbox" class="select-all" value='consumption' v-model="consumptionAll" id="allConsumption"><label class="group-name" for="allConsumption">消费偏好</label>
          </div>
          <ul class="group-list">
            <li class="group-item" v-for="(item, index) in consumptionList" :key="index">
              <input type="checkbox" :id="'module' +  item.id" :value="item.id" v-model="consumption" :disabled="item.isValid == 0">
              <label class="item-name" :for="'module' +  item.id">{{item.moduleName}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group">
          <div class="group-header">
            <input type="checkbox" class="select-all" value='preference' v-model="preferenceAll" id="allPreference"><label class="group-name" for="allPreference">播放偏好</label>
          </div>
          <ul class="group-list">
            <li class="group-item" v-for="(item, index) in preferenceList" :key="index">
              <input type="checkbox" :id="'module' +  item.id" :value="item.id" v-model="preference" :disabled="item.isValid == 0">
              <label class="item-name" :for="'module' +  item.id">{{item.moduleName}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group">
          <div class="group-header">
            <input type="checkbox" class="select-all" value='content' v-model="contentAll" id="allContent"><label class="group-name" for="allContent">内容偏好</label>
          </div>
          <ul class="group-list">
            <li class="group-item" v-for="(item, index) in contentList" :key="index">
              <input type="checkbox" :id="'module' +  item.id" :value="item.id" v-model="content" :disabled="item.isValid == 0">
              <label class="item-name" :for="'module' +  item.id">{{item.moduleName}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group form-bottom btn-wrapper">
          <button type="button" class="btn btn-primary btn-confirm" style="width: 80px;" @click="submit">提交</button>
          <button type="button" class="btn btn-default btn-back" style="width: 80px;" @click="back">返回</button>
          <button type="button" class="btn btn-default btn-reset" style="width: 80px;" @click="reset">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {getModuleList,saveModuleConfigure} from "../../assets/js/groupPortraitApi";

    export default {
        name: "configure",
        data(){
            return {
                searchKey: this.$route.query.searchKey || '',
                buttonId: this.$route.query.buttonId || '',
                curPage: this.$route.query.curPage || 1,
                pageSize: this.$route.query.pageSize || '10',
                _backPath: '',
                userId: window.user ? window.user.username : '测试',
                groupId: this.$route.query.groupId || '', // 群体id
                overViewList: [],  // 大盘总览模块列表
                usageList: [],   // 访问偏好模块列表
                consumptionList: [],  // 消费偏好模块列表
                preferenceList: [],   // 播放偏好模块列表
                contentList: [],     // 内容偏好模块列表
                selectedList: [],    // 已选模块列表
                overView: [],   // 大盘总览已选模块
                usage:[],   // 访问偏好已选模块
                consumption: [],  // 消费偏好已选模块
                preference: [],  // 播放偏好已选模块
                content: [], // 内容偏好已选模块
                originalOverView: [],
                originalUsage: [],
                originalConsumption: [],
                originalPreference: [],
                originalContent: [],
            }
        },
        beforeRouteEnter(to,from,next){
            console.log('router form',from)
            next(vm =>  {
                vm._backPath = from.path;
            })
        },
        created: function () {
            var that = this;
            // 获取已选模块id
            var idText = that.$route.query.moduleId;
            console.log(idText);
            if(idText){
                that.selectedList = idText.split(',');
                that.selectedList = that.selectedList.map(Number);
            }
            // 配置模块接口
            let params = {isvalid: '1'};
            getModuleList(params).then(res =>{
                let data = res.data;
                if(data.retCode == 0){
                    var list = data.resultData;
                    list.forEach(function(item){
                        if(item.typeId == 'CT001' || item.typeId == 'CT002' || item.typeId == 'CT003' || item.typeId == 'CT004'){ // 大盘总览
                            that.overViewList.push(item);
                            if(that.selectedList.indexOf(item.id) != -1){
                                that.overView.push(item.id);
                                that.originalOverView.push(item.id);
                            }
                        } else if(item.typeId == 'CT005' || item.typeId == 'CT006' || item.typeId == 'CT007'){ // 访问偏好
                            that.usageList.push(item);
                            if(that.selectedList.indexOf(item.id) != -1){
                                that.usage.push(item.id);
                                that.originalUsage.push(item.id);
                            }
                        } else if(item.typeId == 'CT008'){ // 消费偏好
                            that.consumptionList.push(item);
                            if(that.selectedList.indexOf(item.id) != -1){
                                that.consumption.push(item.id);
                                that.originalConsumption.push(item.id);
                            }
                        } else if(item.typeId == 'CT009' || item.typeId == 'CT010'){ // 播放偏好
                            that.preferenceList.push(item);
                            if(that.selectedList.indexOf(item.id) != -1){
                                that.preference.push(item.id);
                                that.originalPreference.push(item.id);
                            }
                        } else if(item.typeId == 'CT013'){ // 内容偏好
                            that.contentList.push(item);
                            if(that.selectedList.indexOf(item.id) != -1){
                                that.content.push(item.id);
                                that.originalContent.push(item.id);
                            }
                        }
                    })
                }
            })
        },
        computed: {
            overViewAll: {
                // getter
                get: function(){
                    var that = this;
                    if(that.overView.length == 9){
                        return true;
                    }else{
                        return false;
                    }
                },
                // setter
                set: function(newValue){
                    var that = this;
                    that.overView = [];
                    if(newValue){
                        that.overViewList.forEach(function(item){
                            that.overView.push(item.id);
                        })
                    }
                }

            },
            usageAll: {
                // getter
                get: function(){
                    var that = this;
                    if(that.usage.length == 6){
                        return true;
                    }else{
                        return false;
                    }
                },
                // setter
                set: function(newValue){
                    var that = this;
                    that.usage = [];
                    if(newValue){
                        that.usageList.forEach(function(item){
                            that.usage.push(item.id);
                        })
                    }
                }

            },
            consumptionAll: {
                // getter
                get: function(){
                    var that = this;
                    if(that.consumption.length == 5){
                        return true;
                    }else{
                        return false;
                    }
                },
                // setter
                set: function(newValue){
                    var that = this;
                    that.consumption = [];
                    if(newValue){
                        that.consumptionList.forEach(function(item){
                            that.consumption.push(item.id);
                        })
                    }
                }
            },
            preferenceAll: {
                // getter
                get: function(){
                    var that = this;
                    if (that.preference.length == 4) {
                        return true;
                    } else {
                        return false;
                    }
                },
                // setter
                set: function(newValue){
                    var that = this;
                    that.preference = [];
                    if(newValue){
                        that.preferenceList.forEach(function(item){
                            that.preference.push(item.id);
                        })
                    }
                }
            },
            contentAll: {
                // getter
                get: function(){
                    var that = this;
                    if (that.content.length == 4) {
                        return true;
                    } else {
                        return false;
                    }
                },
                // setter
                set: function(newValue){
                    var that = this;
                    that.content = [];
                    if(newValue){
                        that.contentList.forEach(function(item){
                            if(item.isValid != 0){
                                that.content.push(item.id);
                            }
                        })
                    }
                }
            },
        },
        mounted: function () {},
        methods: {
            submit:function(){
                var that = this;
                var moduleIds = that.getModuleId();
                console.log('模块配置的参数ids===', moduleIds)
                var params = {
                    user: that.userId,
                    moduleIds: moduleIds
                };
                that.$myModal({
                    show: true,
                    type: 'confirm',
                    title: '确认提交吗？',
                    onOk: function(){
                        saveModuleConfigure(that.groupId, params).then(res => {
                            let data = res.data;
                            that.back();
                        })
                    }
                })
            },
            reset:function(){
                var that = this;
                that.overView = that.originalOverView;
                that.usage = that.originalUsage;
                that.consumption = that.originalConsumption;
                that.preference = that.originalPreference;
                that.content = that.originalContent;
            },
            back: function(){
                var that = this;
                if(that._backPath){
                    that.$router.push({
                        path: that._backPath,
                        query: {
                            searchKey: that.searchKey,
                            curPage: that.curPage,
                            pageSize: that.pageSize,
                            buttonId: that.buttonId,

                        }
                    })
                }else{
                    that.$router.push({
                        path: '/',
                    })
                }
            },
            getModuleId: function(){
                var that = this;
                var moduleId = that.overView.concat(that.usage,that.consumption,that.preference,that.content);
                return moduleId.join();
            }
        }
    }
</script>

<style lang="less" scoped>
  .modules-form{
    padding-bottom: 160px;
  }
  .form-group{
    display: flex;
    width: 930px;
    margin-left: 16px;
    padding-top: 21px;
    padding-bottom: 23px;
  }

  .group-header{
    width: 200px;
  }

  .group-list{
    display: flex;
    width: 500px;
    flex-wrap: wrap;
  }

  .group-item{
    min-width: 165px;
    margin-bottom: 15px;
  }

  .form-group.form-bottom{
    border-bottom: none;
  }
  .form-group{
    border-bottom: 1px solid #cccccc;
  }
</style>
