import Vue from 'vue'
import MyModal from './modal'

const modalBox = Vue.extend(MyModal);

MyModal.install = function(data){
  let instance = new modalBox({
    data
  }).$mount()

  document.getElementById('app').appendChild(instance.$el)
}

export default MyModal
