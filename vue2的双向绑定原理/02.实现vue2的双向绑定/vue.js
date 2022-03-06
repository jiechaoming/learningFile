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
    const dep = new Dep();
    Object.keys(obj).forEach((key)=>{
        let value = obj[key];
        Observer(value)
        Object.defineProperty(obj,key,{
            configurable: true, 
            enumerable: true,
            get(){
                Dep.target && dep.addSub(Dep.target);
                return value
            },
            set(newValue){
                value = newValue
                // 为新赋值的对象，也添加上getter和setter方法
                Observer(value)
                // 通知每一个订阅者更新值
                dep.notify()
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
            if(result){
                const value = result[1].split('.').reduce((obj, key)=>{return obj[key]}, vm)   
                node.textContent = text.replace(regMustache, value)
                // node节点已经知道如何更新自己，所用在这里创建Wacter类的实例
                new Watcher(vm, result[1], (newValue)=>{
                    node.textContent = text.replace(regMustache, newValue)
                })
            }
            return
        }

        // 是输入框
        if(node.nodeType == 1 && node.tagName.toUpperCase() === 'INPUT'){
            const attrs = Array.from(node.attributes)
            const findResult = attrs.find((item)=>item.name == 'v-model')
            if(findResult){
                // 获取到当前v-model的值
                const expStr = findResult.value
                    console.log(expStr);
                const value = expStr.split('.').reduce((obj, key)=>obj[key], vm)
                // 把值赋给文本框
                node.value = value
            }
        }

        // 不是文本节点，可能是一个dom元素，此时还有继续进行递归
        node.childNodes.forEach((item)=>replace(item))
    }
}


class Dep{
    constructor(){
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}

class Watcher{
    constructor(vm, key, cb){
        this.vm = vm
        this.key = key
        this.cb = cb
        /**
         * 以下三行代码的解释
         * 发布者即dep应该是只能有一个，所有的订阅者都在应该在同一个dep中订阅
         * 当创建watcher时，会执行constructor方法，此时我们将该watcher即this存入Dep类当中。
         * 然后我们进行一次取值操作，又因为我们给所用的属性都添加上了getter属性，所以会触发该属性的get方法
         * 在Observer方法中，我们创建了一个dep对象。当执行get方法中，我们将该watcher添加到dep的subs中。
         * 添加成功后，target就没有必要在指向watcher了，所以置空
         */
        Dep.target = this
        key.split('.').reduce((obj, key)=>{return obj[key]}, vm)   
        Dep.target = null
    }
    update(){
        const value = this.key.split('.').reduce((obj, key)=>{return obj[key]}, vm)   
        this.cb(value);
    }
}