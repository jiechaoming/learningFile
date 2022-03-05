class Dep{
    constructor(){
        this.sub = [];
    }   
    addSub(watcher){
        this.sub.push(watcher)
    }
    notify(){
        this.sub.forEach((item)=>{
           item.update();
        })
    }
}

class Watcher{
    constructor(cb){
        this.cb = cb;
    }
    update(){
        this.cb();
    }
}

const dep = new Dep()
const w1 = new Watcher(()=>{console.log('I am the first subscribe');})
const w2 = new Watcher(()=>{console.log('I am the second subscribe');})

dep.addSub(w1);
dep.addSub(w2);
dep.notify()

