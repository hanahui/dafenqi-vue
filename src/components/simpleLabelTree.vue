<template>
  <ul class="tree-list">
    <li class="parent-item" v-for="(item, index) in treeData">
      <div class="node-wrapper">
        <div class="switch" v-if="item.isParent" @click="openParentNode($event)"></div>
        <span class="node-parent-icon" v-if="item.isParent"></span>
        <span class="node-leaf-icon" v-if="!item.isParent"></span>
        <span class="node node-text"
              :data-id="item.id"
              :class="{selected: selectedId === item.id}"
              @click="clickNode(item)">{{item.name}}</span>
      </div>
      <simple-label-tree v-if="item.children && item.children.length > 0 " :treeNode="item.children"></simple-label-tree>
    </li>
  </ul>
</template>

<script>
    export default {
        name: "simpleLabelTree",
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
            }
        },
        data(){
            return {
                treeData: [],
                selectedId: ''
            }
        },
        watch: {
            treeNode: {
                handler: function (newList, oldList) {
                    console.log(newList, oldList, '标签树list changed');
                    if(this.simple){
                        this.treeData = this.FlatToNested(newList);
                        console.log('that treeData 转换后数据===', this.treeData)
                    }else{
                        this.treeData = newList;
                    }
                },
                deep: true
            }
        },
        created(){
            let that = this;
            if(that.simple){
                that.treeData = that.FlatToNested(that.treeNode);
            }else{
                that.treeData = that.treeNode;
            }
        },
        methods: {
            // 格式化数据(树数据源扁平结构转嵌套)
            FlatToNested(data, opt) {
                // console.log(data, '格式化数据')
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
                that.selectedId = label.id;
                that.EventBus.$emit('selectedLabel', label);
            }
        }
    }
</script>

<style lang="less" scoped>
  /* 一级标签 */
  .tree-list>li, .label-list>li{
    padding-left: 30px;
  }
  /* 节点图标 */
  .node-parent-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(../assets/img/parent-node-icons.svg);
    background-size: 16px;
    vertical-align: middle;
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
    line-height: 32px;
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
      .node-text{
        // display: inline-block;
        &:hover{
          text-decoration: underline;
        }
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
