<!--
自定义input
// props:
// defaultValue--默认值
// isError--是否未选或格式错误
// errorWord--错误提示文本
// disabled--禁止true/false(默认false) -->
<template>
  <div class='input-group' :style="{'width': width,'background-color': background}">
    <div class="group-content">
      <div class="input-wrapper"
           :title="value">
        <input type="text"
               ref="input"
               :readonly="readonly"
               class="form-input"
               :class="{'error': isError, 'disabled': disabled}"
               :style="{'background-color': background}"
               :placeholder="placeholder === '' ? '请输入': placeholder"
               v-bind:value="value"
               v-on:input="$emit('input',$event.target.value)"
               @keydown.enter="$event.target.blur()"
               @blur="$emit('check')">
      </div>
      <div class="error-wrapper" v-show="isError">
        <p class="error-text">{{errorWord}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "myInput",
        props: {
            width: {
                type: String,
                default: '164px',
            },
            background: {
                type: String,
                default: '#2e2e2e',
            },
            placeholder: {
                type: String,
                default: ''
            },
            value: {},
            isError: {
                type: Boolean,
                default: false
            },
            errorWord: {
                type: String,
                default: ''
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        mounted: function mounted() {
            let that = this;
            if (that.disabled) {
                // console.log(that.$refs.input.getAttribute('disabled'));
                // that.$refs.input
                that.$refs.input.setAttribute('disabled', true);
            }
        },
    }
</script>

<style lang="less" scoped>
  @error-text-color: #fb4b53;
  @disabled-text-color: #4d4d4d;
.input-group{
  .group-content{
    position: relative;
    .input-wrapper{
      .form-input{
        width: 100%;
        height: 28px;
        line-height: 28px;
        padding: 0 8px;
        color: #e6e6e6;
        border: none;
        border: 2px solid transparent;
        transition: @transition-base;
        &:hover{
          border-color: rgb(230,230,230);
        }
        &:focus{
          border-color: rgb(230,230,230)
        }
        &.disabled{
          border-color: transparent;
          color: @disabled-text-color;
          cursor: not-allowed;
          &:hover{
            border-color: transparent;
          }
          &:focus{
            border-color: transparent;
          }
        }
        &.error{
          border-color: @error-text-color;
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
      font-size: 12px;
    }
  }
}
</style>

