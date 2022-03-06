// 只考虑对象的双向绑定
// vue本身也没有实现数组的双向绑定，只不过重写了数组的方法
class Vue{
    constructor(option){
        this.$data = option.data
        // 给所有属性增加上getter和setter
        Observer(this.$data)
        // 属性代理
        Object.keys(this.$data).forEach(key=>{
            Object.defineProperty(this,key,{
                configurable: true, 
                enumerable: true,
                get(){
                    return this.$data[key]
                },
                set(newValue){
                    this.$data[key] = newValue
                }
            })
        })
        //调用模板编译
        Compile(option.el, this)
    }
}

function Observer(obj){
    if(!obj || typeof obj != 'object')return
    Object.keys(obj).forEach((key)=>{
        let value = obj[key];
        Observer(value)
        Object.defineProperty(obj,key,{
            configurable: true, 
            enumerable: true,
            get(){
                return value
            },
            set(newValue){
                value = newValue
                // 为新赋值的对象，也添加上getter和setter方法
                Observer(value)
            }
        })
    })
}

function Compile(el, vm){
    vm.$el = document.querySelector(el)
    // 使用文档碎片来提高操作的效率
    const fragment = document.createDocumentFragment()
    // firstChild是拿到第一个子节点（空格换行也是子节点）
    while((childNode = vm.$el.firstChild)){
        // 这里要注意appendChild的使用
        fragment.appendChild(childNode)
    }
    replace(fragment)
    vm.$el.appendChild(fragment)


    //负责对DOM模板进行编译
    function replace(node){
        //匹配插值表达式的正则
        const regMustache = /\{\{\s*(\S+)\s*\}\}/
        // 是文本节点，就需要进行正则匹配
        if(node.nodeType == 3){
            const text = node.textContent
            const result = regMustache.exec(text)
            console.log(result);
            if(result){
                node.textContent = result[1].split('.').reduce((obj, key)=>{
                    return obj[key]
                }, vm)   
            }
            return
        }

        // 不是文本节点，可能是一个dom元素，此时还有继续进行递归
        node.childNodes.forEach((item)=>replace(item))
    }
}