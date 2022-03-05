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