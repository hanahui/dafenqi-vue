<template>
  <div class="textarea-group">
    <div class="textarea-wrapper">
      <textarea ref="textarea" class="textarea"
                cols="30" :rows="rows"
                :class="{'error': isError, 'disabled': disabled}"
                :style="{width: width, 'background-color': background}"
                :placeholder="placeholder === '' ? '请输入': placeholder"
                v-bind:value="value"
                v-on:input="$emit('input',$event.target.value)"
                @keydown.enter="$event.target.blur()"
                @blur="$emit('check')"></textarea>
    </div>
    <div class="error-wrapper" v-show="isError">
      <p class="error-text">{{errorWord}}</p>
    </div>
  </div>

</template>

<script>
    export default {
        name: "myTextarea",
        props: {
            width: {
                type: String,
                default: '164px',
            },
            rows: {
                type: String,
                default: '2'
            },
            background: {
                type: String,
                default: '#2e2e2e',
            },
            placeholder: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
            isError: {
                type: Boolean,
                default: false
            },
            errorWord: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        mounted: function mounted() {
            let that = this;
            if (that.disabled) {
                that.$refs.textarea.setAttribute('disabled', true);
            }
        }
    }
</script>

<style lang="less" scoped>
  @error-text-color: #fb4b53;
  @disabled-text-color: #4d4d4d;
  #app{
    &.darkTheme{
      .textarea-group{
        position: relative;
        .textarea-wrapper{
          .textarea {
            padding: 0 8px;
            line-height: 28px;
            background: #2e2e2e;
            border: none;
            border: 2px solid transparent;
            transition: @transition-base;

            &:hover {
              border-color: rgb(230, 230, 230);
            }

            &:focus {
              border-color: rgb(230, 230, 230);
            }

            &.error{
              border-color: @error-text-color;
            }

            &.disabled {
              color: @disabled-text-color;
              cursor: not-allowed;

              &:hover {
                border-color: transparent;
              }

            }
          }
        }
        .error-wrapper{
          position: absolute;
          bottom: -17px;
          height: 17px;
          margin-top: 5px;
          line-height: 17px;
          color: @error-text-color;
          font-size: 12px;
        }
      }
    }
  }

</style>
