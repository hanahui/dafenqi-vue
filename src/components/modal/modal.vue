<template>
  <transition name="fade">
    <div class="modal-wrap" v-if="show">
      <div class="modal">
        <div class="modal-content">
          <div class="modal-body">
            <div class="content-title">
              <span class="front-icon" :class="type"></span>
              {{title}}</div>
            <p class="content-text">{{content}}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default btn-cacel" v-if="type==='confirm'" @click="cancel">{{cancelText}}</button>
            <button class="btn btn-primary btn-ok" @click="confirm">{{okText}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  //  对话框类型 info warning error confirm(显示确认取消按钮)
    export default {
        name: "MyModal",
        data: function(){
            return  {
                show: this.show,
                title: '提示信息',
                type: 'info',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {}
            }
        },
        watch: {
            show(newValue, oldValue){
                console.log(newValue, oldValue, 'modal show changed');
                this.modalShow = newValue;
            }
        },
        methods: {
            confirm(){
               let that = this;
               that.onOk();
               that.show = false;
               //that.destroy();
            },
            cancel(){
                let that = this;
                that.show = false;
                //that.destroy();
            },
            destroy(){
                var modal = document.querySelector('.modal-wrap');
                document.getElementById('app').removeChild(modal);
            }
        }
    }
</script>

<style lang="less" scoped>
  #app{
    &.darkTheme{
      .modal-wrap{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.8);
        z-index: 999;
        .modal{
          position: relative;
          top: 100px;
          width: 560px;
          margin: 0 auto;
          .modal-content{
            padding: 48px 56px 32px;
            background: #2e2e2e;
            .modal-body{
              padding-bottom: 24px;
              .content-title{
                height: 28px;
                line-height: 28px;
                margin-bottom: 14px;
                font-size: 18px;
                font-weight: bold;
                color: #f2f2f2;
                .front-icon{
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                  line-height: 28px;
                  vertical-align: middle;
                  margin-right: 10px;
                  &.info{
                    background: url('../../assets/img/icon-info.png') center no-repeat;
                  }
                  &.warning{
                    background: url('../../assets/img/icon-warning.png') center no-repeat;
                  }
                  &.error{
                    background: url('../../assets/img/icon-error.png') center no-repeat;
                  }
                  &.success{
                    background: url('../../assets/img/icon-success.png') center no-repeat;
                  }
                  &.confirm{
                    background: url('../../assets/img/icon-confirm.png') center no-repeat;
                  }
                }
              }
              .content-text{
                height: 28px;
                line-height: 28px;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .modal-footer{
              height: 32px;
              line-height: 32px;
              padding-bottom: 32px;
              text-align: right;
            }
          }
        }
      }
    }
  }

</style>
