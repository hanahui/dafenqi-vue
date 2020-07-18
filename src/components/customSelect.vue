<template>
   <div class="select-item">
                  <div class="item-content relative" v-click-outside="outsideClick">
                       <div class="input-container inline-block relative">
                             <input type="text" class="custom-input select"
                               readonly="readonly"
                               :class="{'open':selectDown}"
                               v-model="selectedText"
                               @click="toggleSelectDown">
                         </div>
                        <div class="list-container" v-show="selectDown">
                             <ul class="select-list">
                                   <li class="select-item pdl" v-for="(item, index) in selectList"
                                   :class="{'active': selectedValue === item.value, 'disabled': item.disabled}"
                                   :key="index"
                                   :data-value="item.value">
                                       <span class="item-text" @click="checkedClick(index,item.disabled)">{{item.text}}</span>
                                   </li>
                               </ul>
                         </div>
                    </div>
              </div>
</template>

<script>
    export default {
        name: "customSelect",
        props: {
            list: {
                type: Array,
                default: []
            },
            defaultValue: {
                type: String,
                default: ''
            }
        },
        data: function data() {
            return {
                selectList: this.list,
                selectedValue: this.defaultValue,
                selectDown: false
            };
        },
        watch: {
            list: function list(newList) {
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
            },
            defaultValue: function defaultValue(newValue) {
                var that = this;
                that.selectedValue = newValue;
                that.initSelect();
            }
        },
        created: function created() {
            var that = this;
            console.log(that.selectList);
            that.initSelect();
        },
        methods: {
            outsideClick: function outsideClick() {
                console.log('outside clicked');
                var that = this;
                if (that.selectDown) {
                    that.selectDown = false;
                }
            },
            initSelect: function initSelect() {
                var that = this;
                var text = '';
                that.selectList.forEach(function (item) {
                    item.checked = false;
                    if (item.value === that.selectedValue) {
                        item.checked = true;
                        text = item.text;
                    }
                });
                that.selectedText = text;
            },
            toggleSelectDown: function toggleSelectDown() {
                var that = this;
                that.selectDown = !that.selectDown;
            },
            checkedClick: function checkedClick(checkedIndex, disabled) {
                var that = this;
                // 单选
                if (disabled) {
                    return false;
                }
                console.log('单选value===>', checkedIndex);
                console.log(that.selectedValue, that.selectList[checkedIndex].value)
                if (that.selectedValue !== that.selectList[checkedIndex].value) {
                    that.selectDown = false;
                    that.selectedValue = that.selectList[checkedIndex].value;
                    that.selectedText = that.selectList[checkedIndex].text;
                    that.$emit('update:defaultValue', that.selectedValue);
                }
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
