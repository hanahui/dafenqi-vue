<template>
  <table class="datatable">
    <thead>
    <tr class="table-head">
      <th v-for="(col, colIndex) in cols" :key="colIndex" :style="{width: col.width || 'auto',textAlign: col.align ||  'left'}">
        {{col.title}}
        <span v-if="col.sort" class="sort">
                                   <i class="icon icon i-false" title="升序" :class="{active: sortKey === col.key && sortDirection === 'asc'}"
                                      @click="sort(col.key, 'asc')"></i>
                           <i class="icon icon i-true" title="降序" :class="{active: sortKey === col.key && sortDirection === 'desc'}" @click="sort(col.key, 'desc')"></i>
                           </span>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-show="tableData.length==0" class="no-data">
      <td :colspan="cols.length" width="100%" align="center" style="text-align: center;">暂无数据</td>
    </tr>
    <tr v-for="(row, rowIndex) in tableData" @click="$emit('selectRow',row)">
      <td v-for="(col, colIndex) in cols" :class="{ellps: col.tooltip}" :style="{textAlign: col.align ||  'left'}">
        <slot v-if="col.slot" :name="col.slot" :record="row"></slot>
        <span v-else :title="row[col.key]">{{row[col.key]}}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
    export default {
        name: "customTable",
        props: {
            tableData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            cols: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data: function () {
            return {
                sortKey: '',
                sortDirection: ''
            }
        },
        mounted: function () {
            console.log(this.cols)
        },
        watch: {
            tableData: {
                handler: function (newList, oldList) {
                    console.log(newList, oldList, '表格tabel data changed')
                    this.data = newList;
                },
                deep: true
            },
            cols: {
                handler: function (newList, oldList) {
                    console.log(newList, oldList, '表格tabel cols changed')
                    this.sortKey = ''
                    this.sortDirection = ''
                },
                deep: true
            }
        },
        methods: {
            sort: function (sortKey, direction) {
                console.log('sort 排序===', sortKey, direction)
                this.sortKey = sortKey;
                this.sortDirection = direction
                // 触发排序事件 参数（key, direction: asc: 正序， desc: 倒序）
                this.$emit('sort', sortKey, direction)
            }
        }
    }
</script>

<style lang="less" scoped>
  /* table 样式 */
  table {
    display: table;
    width: 100%;
    max-width: 100%;
    font-family: PingFangSC-Regular;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
  }
  table tr{
    border-left: 1px solid transparent;;
    border-right: 1px solid transparent;;
  }
  table tbody tr:hover td{
    border-top: 1px solid #0696ff;
    border-bottom: 1px solid #0696ff;
  }
  table tbody tr:hover td:first-child{
    border-left: 1px solid #0696ff;
  }
  table tbody tr:hover td:last-child{
    border-right: 1px solid #0696ff;
  }
  table th, table td {
    position: relative;
    height: 56px;
    line-height: 56px;
    padding: 0 1em;
    white-space: nowrap;
    text-align: left;
  }
  table th:last-child{
    /*text-align: center;*/
  }
  table td:last-child{
    text-align: left;
  }
  table td .td-icon{
    width: 16px;
    height: 16px;
  }
  .operation-btn{
    color: #0696ff;
    cursor: pointer;
  }
  .ellps{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
