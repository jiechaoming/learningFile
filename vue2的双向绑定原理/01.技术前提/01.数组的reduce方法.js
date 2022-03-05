const arr = [1, 2, 3, 4, 5, 6];
//1.reduce完成数组的累加
const sum = arr.reduce((pre, cur)=>{
    return pre + cur;
}, 0);
console.log(sum);





// 2.reduce链式获取对象的属性值
const obj = {
    name:'gs',
    info:{
        address:{
            location:'guangzhou'
        }
    }
}
const attrs  = ['info', 'address', 'location']
const result = attrs.reduce((pre, cur)=>{
    return pre[cur]
}, obj)

console.log(result)

//3.reduce链式获取对象的属性值升级版
const objPro = {
    name:'gs',
    info:{
        address:{
            location:'guangzhou'
        }
    }
}
const attrsStr  = 'info.address.location'
const resultPro = attrsStr.split('.').reduce((pre, cur)=>pre[cur], objPro);
console.log(resultPro);
