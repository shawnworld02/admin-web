/*
 * @Author: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @Date: 2022-07-13 14:02:58
 * @LastEditors: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @LastEditTime: 2022-07-14 12:07:03
 * @FilePath: /admin-web/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import TreeTable from "vue-table-with-tree-grid";
import VueQuillEditor from "vue-quill-editor";
import "@/assets/fonts/iconfont.scss";
import "@/styles/normalize.scss";
import "@/styles/main.scss";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem,
} from "element-ui";

import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//axios请求拦截
axios.interceptors.request.use((config) => {
  //为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  //最后必须return config
  return config;
});
//挂载插件
Vue.prototype.$http = axios;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false;
//挂载element-ui组件
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(VueQuillEditor);
//全局注册TreeTable组件
Vue.component("tree-table", TreeTable);

//全局注册时间过滤器
Vue.filter("dateFormat", function (originVal) {
  const dt = new Date(originVal);
  const yr = dt.getFullYear();
  //不足两位，用0来补充
  const mth = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hr = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${yr}-${mth}-${d} ${hr}:${mm}:${ss}`;
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
