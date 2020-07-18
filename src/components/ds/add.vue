<template>
  <div id="main" class="pd">
    <div class="page-title">
      <div>数据集管理 - {{typeText}}</div>
    </div>
    <div class="form-block add-form form" v-if="htmlType === 'add'">
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">名称：</span>
            </span>
        </div>
        <div class="group-content">
          <my-input
            width="400px"
            v-model="datasetName"
            @check="checkName"
            :isError="nameError"
            :errorWord="nameErrorWord"></my-input>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="required-flag">*</span>
              <span class="label-text">导入文件：</span>
            </span>
        </div>
        <div class="group-content flex">
          <my-input
            width="400px"
            v-model="datasetFile"
            :isError="fileError"
            placeholder="请选择文件"
            :readonly="true"
            :errorWord="fileErrorWord"></my-input>
        </div>
        <div class="group-btn" style="margin-left: 8px">
          <input type="file" ref="file" hidden @change="checkFile">
          <button class="btn btn-default btn-sm" @click="$refs.file.click()">选择文件</button>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">描述：</span>
            </span>
        </div>
        <div class="group-content">
          <my-textarea v-model="datasetRemark"
                       width="488px">
          </my-textarea>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label"></span>
        </div>
        <div class="group-content">
          <button class="btn btn-sm btn-primary" @click="saveDataset">保存</button>
          <button class="btn btn-sm btn-default" @click="resetAddForm">重置</button>
          <button class="btn btn-sm btn-default" @click="back">返回</button>
        </div>
      </div>
    </div>
    <div class="form-block detail-form form" v-if="htmlType === 'see'">
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">编号：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.datasetId}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">名称：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.datasetName}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">创建人：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.userId}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">创建时间：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.createTimeStr}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">备注：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.remark}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
            <span class="label">
              <span class="label-text">临时表名：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{datasetInfo.tempTableName}}</span>
        </div>
      </div>
      <div class="form-group flex" v-for="(field,index) in datasetInfo.datasetFieldList" :key="index">
        <div class="group-label">
            <span class="label">
              <span class="label-text">临时字段名{{index + 1}}：</span>
            </span>
        </div>
        <div class="group-content">
          <span class="content-text">{{field.tempFieldName}}</span>
        </div>
      </div>
      <div class="form-group flex">
        <div class="group-label">
          <span class="label"></span>
        </div>
        <div class="group-content">
          <button class="btn btn-sm btn-default" @click="back">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import store from "../../store/index.js";
    import myInput from '../form/input'
    import myTextarea from '../form/textarea'
    import {getDatasetInfo, addDataset} from "../../assets/js/datasetApi";

    export default {
        name: "add",
        components: {
            'my-input': myInput,
            'my-textarea': myTextarea
        },
        data() {
            return {
                userId: window.user ? window.user.name : '10001',
                // userId: '10001', // 测试
                searchNumber: this.$route.query.searchNumber,
                searchName: this.$route.query.searchName,
                searchCreator: this.$route.query.searchCreator,
                curPage: this.$route.query.curPage,
                pageSize: this.$route.query.pageSize,
                htmlType: this.$route.query.htmlType || 'add',
                datasetId: this.$route.query.datasetId || '',
                datasetInfo: {},
                datasetName: '',
                datasetFile: '',
                nameError: false,
                nameErrorWord: '请输入名称!',
                fileError: false,
                fileErrorWord: '请选择文件!',
                datasetRemark: '',
            }
        },
        computed: {
            typeText(){
                return this.htmlType === 'see' ? '查看' : '新增'
            }
        },
        created() {
            let that = this;
            if (that.htmlType === 'see') {
                that.queryDatasetDetail()
            }
        },
        methods: {
            // 获取数据集详情
            queryDatasetDetail() {
                let that = this;
                let param = {datasetId: that.datasetId + '', id: that.userId};
                getDatasetInfo(param).then(res => {
                    console.log('获取数据集detail==', that.datasetId, res.data)
                    let data = res.data;
                    that.datasetInfo = data.resultData;
                })
            },
            // 验证数据集名称
            checkName() {
                let that = this;
                if(!that.datasetName){
                    that.nameError = true;
                }else{
                    that.nameError = false;
                    return false;
                }
            },

            // 验证数据集文件
            checkFile() {
                let that = this;
                that.fileError = false;
                that.datasetFile = '';
                console.log('files==',that.$refs.file.files)
                let file = that.$refs.file.files;
                if(file.length){
                    var fileArral=file[0].name.split(".");
                    if(fileArral[fileArral.length-1].toUpperCase()!='XLSX' && fileArral[fileArral.length-1].toUpperCase()!='XLS'){
                        that.fileError = true;
                        that.fileErrorWord  = '请导入excel格式的文件';
                        return false;
                    }
                    that.datasetFile = file[0].name;
                    console.log('upload file===',file)
                }else{
                  that.fileError = true;
                  that.fileErrorWord  = '请选择文件';
                }
            },

            // 保存新增数据集
            saveDataset(){
                let that = this;
                that.checkName();
                that.checkFile();
                if(that.nameError || that.fileError){
                    return;
                }
                store.dispatch("showLoading");
                let file = that.$refs.file.files;
                let formData = new FormData;
                formData.append('datasetName',that.datasetName);
                formData.append('file',file[0]);
                formData.append('remark',that.datasetRemark);
                formData.append('userId',that.userId);
                addDataset(formData).then(res => {
                    // console.log('新增数据集===', res.data);
                    store.dispatch("hideLoading");
                    let data = res.data;
                    if(data.retCode == '0'){
                        // 保存成功
                        that.$myModal({
                            show: true,
                            type: 'success',
                            title: '保存成功!',
                            onOk: function(){
                                // 返回数据集列表页面
                                that.$router.push({
                                    path: '/datas'
                                })
                            }
                        })
                    }else{
                        let warningText = data.retDesc;
                        that.$myModal({
                            show: true,
                            type: 'warning',
                            title: warningText
                        })
                    }
                }).catch(error =>{
                    store.dispatch("hideLoading");
                })

            },

            // 重置数据集表单
            resetAddForm(){
                let that = this;
                that.datasetName = '';
                that.datasetFile = '';
                that.datasetRemark = '';
                that.nameError = false;
                that.fileError = false;
                that.$refs.file.value = '';
            },

            // 返回
            back(){
                let that = this;
                that.$router.push({
                    path: '/datas',
                    query: {
                        searchNumber: that.searchNumber,
                        searchName: that.searchName,
                        searchCreator: that.searchCreator,
                        curPage: that.curPage,
                        pageSize: that.pageSize,
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/extractForm';
  #app{
    &.darkTheme{
      .detail-form{
        .form-group{
          .group-label{
            min-width: 92px;
          }
        }
      }
    }
  }

</style>
