class Promise{
    constructor(executor){
        this.promiseState = 'pending'
        this.promiseValue = null
        this.callBacks = []
        const _this = this
        function resolve(value){
            if(_this.promiseState != 'pending')return
            _this.promiseState = 'fulfilled'
            _this.promiseValue = value
            if(_this.callBacks.length > 0){
                setTimeout(()=>{
                    _this.callBacks.forEach(item => {
                        item.onResolved(_this.promiseValue)
                    });
                })
            }
        }
        function reject(reason){
            if(_this.promiseState != 'pending')return
            _this.promiseState = 'rejected'
            _this.promiseValue = reason
            if(_this.callBacks.length > 0){
                setTimeout(()=>{
                    _this.callBacks.forEach(item => {
                        item.onRejected(_this.promiseValue)
                    });
                })
               
            }
        }
        try {
            executor(resolve,reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onResolved,onRejected){
        const _this = this
        if(typeof onRejected != 'function'){
            onRejected = function(reason){
                throw reason
            }
        }
        if(typeof onResolved != 'function'){
            onResolved = function(value){
                throw value
            }
        }
        return new Promise((resolve, reject)=>{
            function callBack(type){
                try {
                    const result = type(_this.promiseValue);
                    if(result instanceof Promise){
                        result.then(v=>{
                            resolve(v)
                        },r=>{
                            reject(r)
                        })
                    }else{
                        resolve(result)
                    }   
                } catch (error) {
                    reject(error)
                }
            }
            if(this.promiseState == 'fulfilled'){
                setTimeout(()=>{
                    callBack(onResolved)
                })
            }
            if(this.promiseState == 'rejected'){
                setTimeout(()=>{
                    callBack(onRejected)
                })
            }
            if(this.promiseState == 'pending'){
                _this.callBacks.push({
                    onResolved:function(){
                        callBack(onResolved)
                    },
                    onRejected:function(){
                        callBack(onRejected)
                    }
                })
            }
        })
    }

    catch(onRejected){
        return this.then(undefined, onRejected)
    }
    static resolve(){
        return new Promise((resolve, reject)=>{
            
        })
    }
    static reject(reason){
        return new Promise((resolve, reject)=>{
            reject(reason)
        })
    }
    //Promise.all()方法接受一个数组作为参数，数组中都是 Promise 实例
    static all(promises){
       return new Promise((resovle, reject)=>{
           let count = 0
           let arr = []
           for(let i = 0 ; i < promises.length++ ; i++){
               promises[i].the(v=>{
                count++
                arr[i] = v
                if(count == promises.length){
                    resovle(arr)
                }
               },r=>{
                reject(r)
               })
           }
       })
    }

    
    static race(promises){
        return new Promise((resolve,reject)=>{
            for(let i = 0 ; i < promises.length ; i++){
                promises[i].then(v=>{
                    resolve(v)
                },r=>{
                    reject(r)
                })
            }
        })
    }
}
