
<template>
  <ul class="tree-list">
    <li class="parent-item" v-for="(item, index) in treeData">
      <div class="node-wrapper"
           v-if="item.isLeaf === 0 || item.isLeaf === 1"
           @click="openParentNode($event)">
        <div class="switch"></div>
        <span class="node-parent-icon"></span>
        <span class="node node-parent-text">{{item.topic}}</span>
      </div>
      <label-tree v-if="item.children && item.children.length > 0 " :treeNode="item.children" :selected-label="selectedLabel" @selected="clickNode"></label-tree>
      <ul class="label-list" v-if="item.labelInfoList && item.labelInfoList.length > 0">
        <li class="parent-item" v-for="(label,index) in item.labelInfoList">
          <div class="leaf-wrapper">
            <span class="node-leaf-icon"></span>
            <span class="node node-leaf" :data-id="label.labelId" :data-type="label.categoryId" @click="clickNode(label)"
                  :class="{selected: selectedLabel.indexOf(label.labelId) > -1}">{{label.labelName}}</span>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
    export default {
        name: "labelTree",
        props: {
            simple: { //  是否是简单json数据
                type: Boolean,
                default: false
            },
            treeNode: {
                type: Array,
                default: function () {
                    return []
                }
            },
            selectedLabel: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data(){
            return {
                treeData: []
            }
        },
        watch: {
            treeNode: {
                handler: function (newList, oldList) {
                    console.log(newList, oldList, '标签树list changed');
                    if(this.simple){
                        this.treeData = this.FlatToNested(newList);
                    }else{
                        this.treeData = newList;
                    }
                },
                deep: true
            },
            selectedLabel: {
                handler: function (newList, oldList) {
                    console.log(newList, oldList, '标签树已选中label changed')
                    this.selectedLabel = newList;
                },
                deep: true
            }
        },
        created(){
            let that = this;
            if(that.simple){
                that.treeData = that.FlatToNested(that.treeNode);
                console.log('that treeData 转换后数据===', that.treeData)
            }else{
                that.treeData = that.treeNode;
            }
        },
        methods: {
            // 格式化数据(树数据源扁平结构转嵌套)
            FlatToNested(data, opt) {
                console.log(data, '格式化数据')
                opt = opt || {};
                var idFiled = opt.idFiled || 'id';
                var parentField = opt.parentField || 'pId';
                var i, l, treeData = [], tmpMap = [];
                for (i = 0, l = data.length; i < l; i++) tmpMap[data[i][idFiled]] = data[i];
                for (i = 0, l = data.length; i < l; i++) {
                    if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField] && data[i][parentField] !== 0) {
                        if (!tmpMap[data[i][parentField]]['children'])
                            tmpMap[data[i][parentField]]['children'] = [];
                        tmpMap[data[i][parentField]]['children'].push(data[i]);
                    } else {
                        treeData.push(data[i]);
                    }
                }
                return treeData;
            },
            openParentNode: function (event) {
                console.log(event.target.parentNode.parentNode.className, '点击展开父节点')
                if (event.target.parentNode.parentNode.className.indexOf('open') > -1) {
                    event.target.parentNode.parentNode.classList.remove('open')
                }
                else {
                    event.target.parentNode.parentNode.classList.add('open')
                }
            },
            clickNode: function (label) {
                // 触发点击事件
                var that = this;
                that.$emit('selected', label)
            }
        }
    }
</script>

<style lang="less" scoped>
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
  }
  .node-leaf.selected{
    background: #0696ff;
  }
  /* 节点图标 */
  .node-parent-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(../assets/img/parent-node-icons.svg);
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
    background-image: url(../assets/img/leaf-node-icon.png);
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
        background: url('../assets/img/icon-arrow-right.png') center no-repeat;
        cursor: pointer;
      }
    }
    &.open {
      height: inherit;
      & > .node-wrapper {
        & > .switch {
          background: url('../assets/img/icon-arrow-down.png') center no-repeat;
        }
      }
    }
  }

</style>
