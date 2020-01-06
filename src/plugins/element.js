import Vue from "vue"
import {
  Button, Form, FormItem, Input, Message,
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
  TimePicker,
  DatePicker,
  Select,
  Option,
  Radio
} from "element-ui"
import router from "../router"
import Operation from "less/lib/less/tree/operation"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Radio)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Option)
Vue.prototype.$confirm = MessageBox.confirm
