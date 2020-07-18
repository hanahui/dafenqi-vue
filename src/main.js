// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/iconfont/iconfont.css'

// console.log(store.state, 'main.js store state')

import Echarts from 'echarts'
import china from 'echarts/map/json/china.json'
import MyModal from './components/modal/index'
import { Layout, Icon, Button, Menu, Tag, Form, Input, InputNumber, Radio, Select, Tree, TreeSelect, message, Modal, Table, Divider,Dropdown,Transfer, Row, Col, Spin, Upload, LocaleProvider,DatePicker,Checkbox,Switch} from "ant-design-vue";

Vue.use(Layout)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Tag)
Vue.use(Form)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Tree)
Vue.use(TreeSelect)
Vue.use(Modal)
Echarts.registerMap('china', china)

Vue.use(Table)
Vue.use(Divider)
Vue.use(Dropdown)
Vue.use(Transfer)
Vue.use(Row)
Vue.use(Col)
Vue.use(Spin)
Vue.use(Upload)
Vue.use(LocaleProvider)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Switch)

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$info = Modal.info;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$message = message;
message.config({
  duration: 5,
});
Vue.prototype.EventBus = new Vue();
Vue.prototype.echarts = Echarts;
Vue.prototype.$myModal = MyModal.install
Vue.use(Echarts)
// 添加点击空白处的指令
Vue.directive('click-outside', {
  update: function bind(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
});

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
