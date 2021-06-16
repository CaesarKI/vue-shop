import {
    Form, Input, FormItem, Button, Icon, Message
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
    }
}