
import Vue from 'vue'
import App from './App'
import iView from 'iview';
import router from './router'
import 'iview/dist/styles/iview.css';
import {validate} from "./validate/validate";
import ajax from './ajax/index'
import {api} from "./api/api";

Vue.config.productionTip = false;
Vue.use(iView);
Vue.prototype.$_validate = validate;
Vue.prototype.$_ajax = ajax;
Vue.prototype.$_api = api;

//判断登录状态
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('userInfo');
    }
    window.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
