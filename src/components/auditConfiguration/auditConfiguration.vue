<template>
  <div id="main" class="pd">
    <div class="page-title bgd">
      <div>邮件审核配置</div>
    </div>
    <!-- search、important -->
    <div class="xfxw fenlei-h clearFix">
      <div class="group fl">
        <button type="button" class="hot-button"
                :class="{'hot-button-blue': auditUserType === '1'}"
                @click="auditUserType = '1'">一审人员 +
        </button>
        <button type="button" class="hot-button"
                :class="{'hot-button-blue': auditUserType === '2'}"
                @click="auditUserType = '2'">二审人员 +
        </button>
      </div>
      <div class="group fr">
        <!-- search -->
        <div class="search">
          <input class="searchKey" type="text" placeholder="请输入关键字" v-model="searchKey" @keyup.enter="init">
          <img class="search_img" src="../../assets/img/icon-search.png" @click="init">
        </div>
      </div>
    </div>
    <div>
      <!-- 配置人员 -->
      <my-table :table-data="tableData" :cols="cols">
        <template slot="operation" slot-scope="{record}">
          <a-switch checkedChildren="开"
                    unCheckedChildren="关"
                    :loading="record.loading"
                    :checked="record.checked"
                    @click="updateCheck(record)"/>
        </template>
      </my-table>
      <my-paging :total-page.sync="totalPage"
                 :cur-page.sync="curPage"
                 :page-size.sync="pageSize"
                 @changed="customPaging"></my-paging>
    </div>
  </div>
</template>

<script>
    import CustomTable from '../customTable'
    import CustomPaging from '../customPaging'
    import {auditUserList,updateCheck} from '../../assets/js/taskApi'

    export default {
        name: "auditConfiguration",
        components: {
            'my-table': CustomTable,
            'my-paging': CustomPaging
        },
        data() {
            return {
                userId: window.user ? window.user.username : '测试', // 登录用户ID
                auditUserType: '1', // 审核人员类型(一审：1  二审：2)
                searchKey: '', // 搜索关键字
                curPage: 1,//当前页码
                totalPage: 1,//总页数
                pageSize: 10,//每页条数
                jumpPage: '',
                tableData: [], //列表数据
                allUserList: [], //  未分页用户列表
                cols: [
                    {title: '部门', key: 'deptName', tooltip: true, width: '15%'},
                    {title: '账号', key: 'loginName', tooltip: true, width: '15%'},
                    {title: '姓名', key: 'name', tooltip: true, sort: true, width: '15%'},
                    {title: '手机号码', key: 'mobile', tooltip: true, width: '20%'},
                    {title: '邮箱', key: 'email', tooltip: true, width: '20%'},
                    {title: '邮件审核发送', tooltip: true, width: '15%', slot: 'operation'},
                ],
            }
        },
        created: function () {
            let that = this;
            // 获取审核配置列表
            that.init();
        },
        watch: {
            auditUserType(newValue,oldValue){
                if(newValue !== oldValue){
                    this.init();
                }
            }
        },
        methods: {
            /*
            * 初始化数据
            */
            init: function () {
                var that = this;
                that.curPage = 1;
                that.pageSize = 10;
                var param = {
                    key: that.searchKey,
                    checkType: that.auditUserType,
                };
                console.log("methods--->init--->param:", param);
                auditUserList(param).then(res =>{
                    console.log('审核人员列表===',res.data);
                    that.allUserList = res.data.data;
                    for(let i = 0, len = that.allUserList.length; i < len; i ++){
                        that.$set(that.allUserList[i], 'loading', false)
                        if(that.auditUserType === '1'){
                            that.$set(that.allUserList[i], 'checked', that.allUserList[i].isSendFirst == '0')
                        }else if(that.auditUserType === '2'){
                            that.$set(that.allUserList[i], 'checked', that.allUserList[i].isSendSecond == '0')
                        }else{
                            that.$set(that.allUserList[i], 'checked', false)
                        }
                    }
                    that.customPaging();
                })

            },
            // 更新审核邮件状态
            updateCheck(record){
                let that = this;
                console.log('发送邮件flag==',record)
                if(record.loading){
                    return;
                }
                record.loading = true;
                let params = {
                    id: record.id,
                    checkType: that.auditUserType,
                    isSend: record.checked ?  '0' : '1'
                }

                console.log(params)

                updateCheck(params).then(res => {
                    console.log('更新邮件配置==',res.data);
                    record.loading = false;
                    record.checked = !record.checked;
                })

            },
            // 自定义分页
            customPaging(){
                let that = this;
                let startIndex = (that.curPage - 1) * that.pageSize;
                let endIndex = that.curPage * that.pageSize;
                that.totalPage  = Math.ceil(that.allUserList.length / that.pageSize);
                that.tableData = that.allUserList.slice(startIndex,endIndex);
            }

        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/list';
</style>
