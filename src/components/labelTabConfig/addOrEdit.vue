<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>标签表配置 - {{pageTitle}}</div>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="数据源" v-bind="formItemLayout">
        <a-select
          v-decorator="[
          'dsType',
          { rules: [{ required: true, message: 'Please select your gender!' }] },
        ]"
          placeholder="请选择"
          @change="handleSelectChange"
        >
          <a-select-option value="1">HIVE</a-select-option>
          <!-- <a-select-option value="female">female</a-select-option> -->
        </a-select>
      </a-form-item>
      <a-form-item label="数据库" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          placeholder="请输入"
          v-decorator="['schemaName', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </a-form-item>
      <a-form-item label="表名称" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          placeholder="请输入"
          v-decorator="['tblName', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </a-form-item>
      <a-form-item label="表类型" v-bind="formItemLayout">
        <a-select
          v-decorator="[
          'tblType',
          { rules: [{ required: true, message: 'Please select your gender!' }] },
        ]"
          placeholder="请选择"
          @change="handleSelectChange"
        >
          <a-select-option value="1">主表</a-select-option>
          <a-select-option value="2">从表</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="表描述" v-bind="formItemLayout">
        <a-textarea
          placeholder="请输入"
          v-decorator="[
                'remark',
                {
                  rules: [
                    {required: false}
                  ]
                }
              ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 2 }">
        <!-- <a-button type="primary" html-type="submit">Submit</a-button> -->
        <button class="btn btn-primary" html-type="submit">保存</button>
        <button class="btn btn-default" @click="back">返回</button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  getLabelTabList,
  getLabelTabDetail,
  getLabelTabDelete,
  getLabelTabEdit
} from '../../assets/js/labelTabConfig'
    export default {
  name: 'labelTabConfig',
  data() {
    return {
      htmlType: this.$route.query.htmlType || 'add', // 默认新增
      dsId: Number(this.$route.query.dsId) || '', // 修改用户Id
      form: this.$form.createForm(this, { name: 'addOrEditForm' }),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol: {
          xs: { span: 10 },
          sm: { span: 12 }
        }
      }
    }
  },
  computed: {
    pageTitle: function() {
      return this.htmlType === 'add'
        ? '新增'
        : this.htmlType === 'edit'
        ? '修改'
        : ''
    }
  },
  mounted() {
    let that = this
    if (that.htmlType === 'edit') {
      // 获取用户信息 赋值form表单
      // let params = { dsId: that.dsId }
      let params = new URLSearchParams()
      params.append('dsId', that.dsId)
      getLabelTabDetail(params).then(res => {
        console.log('label detail -->', res)
        if (res.data.retCode === '0') {
          let labelInfo = res.data.resultData
          this.setFormField(labelInfo)
        } else {
          that.$message.warning('获取用户信息失败,请重新刷新!')
        }
      })
    }
  },
  methods: {
    // form表单赋值
    setFormField(data) {
      let that = this
      that.form.setFieldsValue({
        dsType: String(data.dsType),
        schemaName: data.schemaName,
        tblName: data.tblName,
        tblType: String(data.tblType),
        remark: data.remark
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (values.remark === undefined) {
            values.remark = ''
          }
          let params = new URLSearchParams()
          params.append('dsType', Number(values.dsType))
          params.append('schemaName', values.schemaName)
          params.append('tblName', values.tblName)
          params.append('tblType', Number(values.tblType))
          params.append('remark', values.remark)
          if (that.htmlType === 'edit') {
            params.append('dsId', that.dsId)
            getLabelTabEdit(params).then(res => {
              console.log(res)
              if (res.data.retCode === '0') {
                that.$message.success('修改成功!')
                that.back()
              } else {
                let errorDesc = res.data.retDesc
                that.$warning({ title: errorDesc })
              }
            })
          } else {
            getLabelTabEdit(params).then(res => {
              console.log(res)
              if (res.data.retCode === '0') {
                that.$message.success('新增成功!')
                that.back()
              } else {
                let errorDesc = res.data.retDesc
                that.$warning({ title: errorDesc })
              }
            })
          }
        }
      })
    },
    handleSelectChange(value) {
      console.log(value)
    },
    back() {
      this.form.resetFields()
      this.$router.push({ path: '/labelTab' })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 24px;
}

/deep/.ant-input {
  border-radius: 0px;
  background-color: #2e2e2e;
  color: #e6e6e6;
  padding: 4px 11px;
  border: 1px solid #2e2e2e;
}

/deep/.ant-select-selection {
  border-radius: 0px;
  background-color: #2e2e2e;
  border: 1px solid #2e2e2e;
  color: #e6e6e6;
}

/deep/.ant-select-arrow .ant-select-arrow-icon svg {
  color: #f2f2f2;
}

/deep/.ant-modal-confirm .ant-modal-body {
  background-color: #2e2e2e;
}

/deep/.ant-form-item-label label {
  color: #e6e6e6;
}
</style>
