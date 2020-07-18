<!--
自定义下拉(单选)
// props:
// list--下拉数据列表
// defaultValue--默认选中项
// isError--是否未选或格式错误
// errorWord--错误提示文本
// search--搜索功能true/false(默认false)
// disabled--禁止true/false(默认false)
// list 格式 : [{text: 'xxx', value: 'xxx'}] -->
<template>
  <div class='select-group' :style="{'width': width,'background-color': background}">
    <div class="group-content" v-click-outside="confirmChecked">
      <div class="input-wrapper"
           :class="{'open': selectDown, 'error': isError, 'disabled': disabled}"
           @click="toggleSelectDown">
        <input type="text" class="form-input select"
               :style="{'background-color': background}"
               readonly="readonly"
               placeholder="请选择"
               v-model="selectedText">
        <span class="icon iconfont icon-xiaosanjiao select-icon"></span>
      </div>
      <div class="error-wrapper" v-show="isError">
        <p class="error-text">{{errorWord}}</p>
      </div>
      <div class="list-wrapper" v-show="selectDown" :style="{'background-color': background}">
        <div class="search-container" v-if="search">
          <input type="text" class="search-input" v-model="selectSearchText" placeholder="请输入关键词">
        </div>
        <ul class="select-list">
          <li class="select-item no-data" v-show="selectList.length === 0">
            <span class="item-text">暂无数据</span>
          </li>
          <li class="select-item" v-for="(item, index) in selectList"
              :class="{'active': selectedValue === item.value, 'disabled': item.disabled}"
              v-show="item.text && item.text.indexOf(selectSearchText) != -1"
              :key="index"
              :data-value="item.value"
              @click="checkedClick(index,item.disabled)">
            <span class="item-text">{{item.text}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "singleSelect",
        props: {
            width: {
                type: String,
                default: '164px',
            },
            background: {
                type: String,
                default: '#2e2e2e',
            },
            list: {
                type: Array,
                default: () => []
            },
            defaultValue: {},
            isError: {
                type: Boolean,
                default: false
            },
            errorWord: {
                type: String,
                default: ''
            },
            search: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data: function data() {
            return {
                selectList: this.list,
                selectedValue: this.defaultValue,
                selectedText: '',
                selectSearchText: '',
                selectDown: false
            };
        },
        watch: {
            list(newList) {
                var that = this;
                console.log(newList, 'select list change');
                that.selectList = newList;
                var show = false;
                for (var i = 0; i < that.selectList.length; i++) {
                    if (that.selectList[i].value == that.selectedValue) {
                        show = true;
                        that.selectedText = that.selectList[i].text;
                        break;
                    }
                }
                if (!show) {
                    that.selectedValue = '';
                    that.selectedText = '';
                }
            },
            defaultValue(newValue,oldValue) {
                var that = this;
                console.log(newValue,oldValue,'select default value change',that.selectList);
                that.selectedValue = newValue;
                that.initSelect();
            }
        },
        created: function created() {
            var that = this;
            // console.log(that.selectList);
            that.initSelect();
        },
        methods: {
            initSelect: function initSelect() {
                var that = this;
                console.log(that.selectedValue, '单选');
                var text = '';
                that.selectList.forEach(function (item) {
                    item.checked = false;
                    if (item.value == that.selectedValue) {
                        item.checked = true;
                        text = item.text;
                    }
                });
                that.selectedText = text;
                //  console.log(that.isError);
            },
            toggleSelectDown: function toggleSelectDown() {
                var that = this;
                if (that.disabled) {
                    return;
                }
                that.selectDown = !that.selectDown;
                if (!that.selectDown) {
                    that.checkGroup();
                }
            },
            checkedClick: function checkedClick(checkedIndex, disabled) {
                //console.log('select checked index===>',checkedIndex);
                var that = this;
                // 单选
                if (disabled) {
                    return false;
                }
                console.log('单选value===>', checkedIndex);
                if (that.selectedValue !== that.selectList[checkedIndex].value) {
                    that.selectDown = false;
                    that.selectedValue = that.selectList[checkedIndex].value;
                    that.selectedText = that.selectList[checkedIndex].text;
                    that.$emit('update:defaultValue', that.selectedValue);
                }
                that.checkGroup();

            },
            // 空白点击事件
            confirmChecked: function confirmChecked() {
                var that = this;
                if (!that.selectDown) {
                    return;
                }
                that.selectDown = false;
                that.checkGroup();
            },
            // 验证form group
            checkGroup: function checkGroup() {
                var that = this;
                that.$emit('check', that.isError);
            }
        }
    }
</script>

<style lang="less" scoped>
  #app{
    &.darkTheme{
      @error-text-color: #fb4b53;
      @disabled-text-color: #4d4d4d;
      @input-hover-background: #595959;
      .select-group{
        .group-content{
          position: relative;
          width: 100%;
          .input-wrapper{
            position: relative;
            width: 100%;
            cursor: pointer;
            .form-input{
              width: 100%;
              height: 28px;
              line-height: 28px;
              padding: 0 8px;
              border: none;
              outline: 0;
              cursor: pointer;
              border: 2px solid transparent;
            }
            .select-icon{
              position: absolute;
              right: 0;
              height: 28px;
              line-height: 28px;
              margin-right: 8px !important;
            }
            &.disabled{
              color: @disabled-text-color;
              cursor: not-allowed;
              .form-input{
                cursor: not-allowed;
              }
            }
            &.open{
              .form-input{
                border-color: rgb(230,230,230)
              }
            }
            &.error{
              .form-input{
                border-color: @error-text-color;
              }
              &.open{
                .form-input{
                  border-color: rgb(230,230,230)
                }
              }
            }
          }
          .error-wrapper{
            position: absolute;
            top: 28px;
            height: 17px;
            margin-top: 5px;
            line-height: 17px;
            color: @error-text-color;
          }
          .list-wrapper{
            position: absolute;
            width: 100%;
            left: 0;
            top: 28px;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
            z-index: 10;
            .select-list{
              max-height: 260px;
              overflow: auto;
              .select-item{
                height: 28px;
                line-height: 28px;
                padding: 0 8px;
                color: #b3b3b3;
                &:hover{
                  color: #f2f2f2;
                  background: @input-hover-background;
                }
                &.disabled{
                  color: @disabled-text-color;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
    }
    &.lightTheme{

    }
  }

</style>
