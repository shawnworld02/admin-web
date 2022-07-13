/*
 * @Author: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @Date: 2022-07-13 14:02:58
 * @LastEditors: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @LastEditTime: 2022-07-13 20:59:33
 * @FilePath: /admin-web/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/styles/normalize.scss";
import "@/styles/main.scss";
import { Form, FormItem, Input, Button, Message } from "element-ui";
("element-ui");

import axios from "axios";
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/";
Vue.prototype.$http = axios;

Vue.prototype.$message = Message;
Vue.config.productionTip = false;

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
