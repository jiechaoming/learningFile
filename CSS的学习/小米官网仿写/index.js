const WIDTH_VALUE = 1226
const TRANSITION_VALUE = 'all ease-in-out .5s'
const category = document.querySelector('.category-ul')
const categoryContent = document.querySelector('.content')
const btnRight = document.querySelector('.btn-right')
const btnLeft = document.querySelector('.btn-left')
const imgSlider = document.querySelector('.img-slider')
const slideImgList = document.querySelector('.slide-list')
const circleList = document.querySelector('.circle-list')
const allCircle = document.querySelectorAll('.circle')
let imgIndex = 0
// 克隆第一张图片，并将其添加到slideImgList的最后面
const firstImg = slideImgList.firstElementChild.cloneNode()
slideImgList.appendChild(firstImg)
setCircle()
let autoPlay =  autoCirculation()

category.addEventListener('mouseover', function(event){
    const target = event.target
    categoryContent.style.display = "block"
    categoryContent.innerHTML = target.text
})

category.addEventListener('mouseout', function(event){
    categoryContent.style.display = "none"
})

btnRight.addEventListener('click',throttle(handleRightClicked,800))
btnLeft.addEventListener('click',throttle(handleLeftClicked, 800))
// 这里时利用事件委托去监听小圆点的点击事件
circleList.addEventListener('click',clickCircle)
imgSlider.addEventListener('mouseenter',sliderMouseenter)
imgSlider.addEventListener('mouseleave',sliderMouseleave)

// 右按钮的实现
function handleRightClicked(){
    if(imgIndex === 0){
        slideImgList.style.transition = 'all ease-in-out .5s'
    }
    ++imgIndex
    slideImgList.style.left = `-${imgIndex * WIDTH_VALUE}px`
    setCircle()
    // 当imgIndex为4的时候，此时会显示第五张图片(我们克隆的第一张)
    // 因为过渡的动画时0.5s，然后我们的定时器也是0.5s
    // 所有，当刚刚过渡到第五张的时候，我们就将left变成0，此时将过渡动画取消
    // 最终的结果就是从第五张变成第一张，但因为两个显示的效果一样，且没有过渡动画，所有成功实现无缝滚动
    if( imgIndex=== 4){
        imgIndex = 0
        setCircle()
        setTimeout(()=>{
            slideImgList.style.transition = 'none'
            slideImgList.style.left = `0px`
        },500)
    }
}

// 左按钮的实现
function handleLeftClicked(){
    --imgIndex
    if(imgIndex === -1){
        slideImgList.style.transition = 'none'
        slideImgList.style.left = `-${4 * WIDTH_VALUE}px`
        imgIndex = 3
        setCircle()
        setTimeout(()=>{
            slideImgList.style.transition = 'all ease-in-out .5s'
            slideImgList.style.left = `-${imgIndex * WIDTH_VALUE}px`
        })
    }else{
        slideImgList.style.left = `-${imgIndex * WIDTH_VALUE}px`
        setCircle()
    }
}

// 实现小圆点的跟随效果
function setCircle(){
    allCircle.forEach((item, index) => {
        if(index === imgIndex){
            item.classList.add('active')
        }else{
            item.classList.remove('active')
        }
    });
}

// 实现小圆点的点击效果
function clickCircle(event){
    const target = event.target
    imgIndex = Number(target.getAttribute('data-index'))
    setCircle()
    slideImgList.style.left = `-${imgIndex * WIDTH_VALUE}px`
}

// 自动轮播的实现
function autoCirculation(){
    return setInterval(()=>{
        handleRightClicked()
    },2000)
}

// 鼠标移动到图片上，停止轮播
function sliderMouseenter(){
    clearInterval(autoPlay)
}

function sliderMouseleave(){
    autoPlay =  autoCirculation()
}

// 简易的节流函数
function throttle(fun, delay){
    let pre = 0
    return function(){
        let now = new Date()
        if(now - pre > delay){
            fun.apply(this)
            pre = now 
        }
    }
}