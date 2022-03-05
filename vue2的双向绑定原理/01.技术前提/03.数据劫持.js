const obj = {
    name: 'gs',
    age: '18'
}

Object.defineProperty(obj,'name',{
    get(){
        return 19
    },
    set(newValue){
        console.log('触发了赋值操作', newValue);
    }
})
obj.name = 'gz'
console.log(obj.name);