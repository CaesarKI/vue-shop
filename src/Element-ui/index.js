import {
    Form,
    Input,
    FormItem,
    Button,
    Icon,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Menu,
    Submenu,
    MenuItem,
    Dialog,
    MessageBox,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Row,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Tag,
    Tree, Select, Option
} from "element-ui"
export default {
    install(Vue){
        Vue.use(Form)
        Vue.use(Input)
        Vue.use(FormItem)
        Vue.use(Button)
        Vue.use(Icon)
        Vue.use(Message)
        Vue.prototype.$message=Message
        Vue.use(Container)
        Vue.use(Header)
        Vue.use(Aside)
        Vue.use(Main)
        Vue.use(Footer)
        Vue.use(Menu)
        Vue.use(Submenu)
        Vue.use(MenuItem)
        Vue.use(MenuItemGroup)
        Vue.use(Breadcrumb)
        Vue.use(BreadcrumbItem)
        Vue.use(Card)
        Vue.use(Col)
        Vue.use(Row)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Switch)
        Vue.use(Tooltip)
        Vue.use(Pagination)
        Vue.use(Dialog)
        Vue.prototype.$confirm=MessageBox.confirm
        Vue.use(Tag)
        Vue.use(Tree)
        Vue.use(Select)
        Vue.use(Option)
    }
}