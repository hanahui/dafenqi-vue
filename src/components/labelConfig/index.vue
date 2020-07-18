<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>标签配置</div>
    </div>
    <div class="edit-content">
      <div class="content-left">
        <div class="tree-header">标签分类</div>
        <div class="tree-wrapper">
          <label-tree
            :simple="true"
            :treeNode="labelTreeList">
          </label-tree>
        </div>
      </div>
      <div class="content-right">
        <div class="form">
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">名称：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">上级节点：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">是否标签：</span>
              </span>
            </div>
            <div class="group-content">
              <single-select width="100%" :list="isLabel"></single-select>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">数据源：</span>
              </span>
            </div>
            <div class="group-content">
              <single-select width="100%" :list="isLabel"></single-select>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">来源表：</span>
              </span>
            </div>
            <div class="group-content">
              <single-select width="100%" :list="isLabel"></single-select>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">来源字段：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">用户筛选值来源：</span>
              </span>
            </div>
            <div class="group-content">
              <single-select width="100%" :list="filterList"></single-select>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">固定值定义：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="label-text">对应维表：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="label-text">维表ID字段：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="label-text">维表名字字段：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">是否上线：</span>
              </span>
            </div>
            <div class="group-content">
              <single-select width="100%" :list="isOnline"></single-select>
            </div>
            <div class="group-label inline-group-label">
              <span class="label">
                <span class="label-text">排序：</span>
              </span>
            </div>
            <div class="group-content">
              <my-input width="100%"></my-input>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="required-flag">*</span>
                <span class="label-text">标签规则：</span>
              </span>
            </div>
            <div class="group-content" style="width: 84%; max-width: 840px">
              <my-textarea v-model="description"
                           width="100%">
              </my-textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="group-label">
              <span class="label">
                <span class="label-text">备注：</span>
              </span>
            </div>
            <div class="group-content" style="width: 84%; max-width: 840px">
              <my-textarea v-model="description"
                           width="100%">
              </my-textarea>
            </div>
          </div>
          <div class="form-group">
            <button
              class="btn btn-primary"
              html-type="submit"
              style="margin-left: 80px;"
            >保存</button>
            <button class="btn btn-default" @click="back">返回</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myInput from '../form/input'
import singleSelect from '../form/singleSelect'
import myTextarea from '../form/textarea'
import simpleLabelTree from "../simpleLabelTree";
import {
  getTreeList,
  getLabelDetail,
  getLabelEdit,
  deleteLabel
} from '../../assets/js/labelConfigApi'
export default {
  name: 'labelConfig',
  components: {
    'my-input': myInput,
    'single-select': singleSelect,
      'my-textarea': myTextarea,
      'label-tree': simpleLabelTree
  },
  data() {
    return {
      userId: window.user ? window.user.username : '测试', // 登录用户ID
      labelTreeList: [],
      labelForm: {},
      isLabel: [
        { text: '是', value: '' },
        { text: '否', value: '' }
      ],
        filterList: [
            { text: '文本', value: '1' },
            { text: '日期', value: '2' },
            { text: '值域', value: '3' },
        ],
        dataSourceList: [
            { text: 'hive', value: '1' },
        ],
      isOnline: [
        { text: '是', value: '' },
        { text: '否', value: '' }
      ],

        labelInfo: {
            labelType: 0, // 是否标签
            labelId: '',
            labelName: '', // 名称
            labelParentId: '', // 上级节点
            dsId: '', // 来源表
            fieldName: '',  //  来源字段
            fieldType: '',  //用户筛选值来源
            fixedValues: '', // 固定值
            fieldTblName: '',  // 对应维表
            tblFieldId: '',  // 维表ID
            tblFieldName: '',  //维表名称字段
            online: '', // 是否上线
            displayOrder: '', // 排序
            rule: '',  // 规则
            remark: '',  // 备注
        },
        description: ''
    }
  },
  created() {
    let that = this;
    that.EventBus.$on('selectedLabel', (label)=>{
        // console.log(label, '选中标签')
    })
    that.getLabelTree()
  },
  methods: {
    // 获取标签树
      getLabelTree() {
      getTreeList().then(res => {
          let data = res.data;
        console.log(data.resultData, 'get label tree data')
        this.labelTreeList = data.resultData
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          // let params = new URLSearchParams()
          // params.append('dsType', Number(values.dsType))
          // params.append('schemaName', values.schemaName)
          // params.append('tblName', values.tblName)
          // params.append('tblType', Number(values.tblType))
          // params.append('remark', values.remark)
          // if (that.htmlType === 'edit') {
          //   params.append('dsId', that.dsId)
          //   getLabelTabEdit(params).then(res => {
          //     console.log(res)
          //     if (res.data.retCode === '0') {
          //       that.$message.success('修改成功!')
          //       that.back()
          //     } else {
          //       let errorDesc = res.data.retDesc
          //       that.$warning({ title: errorDesc })
          //     }
          //   })
          // } else {
          //   getLabelTabEdit(params).then(res => {
          //     console.log(res)
          //     if (res.data.retCode === '0') {
          //       that.$message.success('新增成功!')
          //       that.back()
          //     } else {
          //       let errorDesc = res.data.retDesc
          //       that.$warning({ title: errorDesc })
          //     }
          //   })
          // }
        }
      })
    },
    handleSelectChange(value) {
      console.log(value)
    },
    back(){

    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/list';

@disabled-text-color: #4d4d4d;
@modal-background: #252525;
@border-color: #0d0d0d;

.edit-content {
  width: 100%;
  min-height: 100%;
  position: relative;
  display: flex;
  background-color: #252525;

  .content-left {
    position: relative;
    width: 20%;
    min-height: 100%;
    border-right: 1px solid #0d0d0d;

    .tree-header{
      height: 40px;
      line-height: 40px;
      padding-left: 16px;
      border-bottom: 1px solid rgb(64,64,64);
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      margin-left: -14px;
      overflow: auto;
    }
  }

  .content-right {
    width: 80%;
    padding: 0 10px;
    .form {
      padding-top: 40px;
      overflow: auto;
      .form-group {
        display: flex;
        margin-bottom: 25px;
        .group-label {
          width: 14%;
          max-width: 125px;
          line-height: 28px;
          text-align: right;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .label {
            .required-flag {
              color: #fb4b53;
            }
          }
          &.inline-group-label {
            width: 12%;
            max-width: 120px;
          }
        }
        .group-content {
          display: flex;
          width: 20%;
          max-width: 200px;
        }
        .group-btn {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
