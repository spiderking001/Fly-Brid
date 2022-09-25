//获取元素
var start = document.getElementById('start')
var header = document.getElementById('header')
var flyBird = document.getElementById('flyBird')
var box = document.getElementById('box')
var pipeBox = document.getElementById('pipeBox')

let scoreBoard = document.getElementById('scoreBoard')

var audios = document.getElementsByTagName('audio')
//定义speed速度
var speed = 0, maxSpeed = 8
var downTimer = null,
    upTimer = null,
    pipeTimer = null

var scoreNum = 0

function birdDown() {
    flyBird.src = 'img/down_bird0.png'
    /*if(speed>maxSpeen){//最麻烦写法
        speed=maxSpeed
    }else {
        speed+=.3
    }*/
    /* speed+=.3
     if(speed>maxSpeed){//比上面少了一个分支，可读性增强
         speed=maxSpeed
     }*/
    speed = speed > maxSpeed ? speed = maxSpeed : speed + .3//极简
    flyBird.style.top = flyBird.offsetTop + speed + 'px'
    //flyBird.style.top='110px'
    //console.log(flyBird.offsetTop)
    if (flyBird.offsetTop + flyBird.offsetHeight >= 422) {
        death()
    }
}

function death() {


    gameOver.style.display = 'block'
    gameOver.getElementsByClassName('span')[0].innerHTML = scoreNum
    gameOver.getElementsByClassName('img')[0].innerHTML = function () {

    }

    audios[0].pause()
    audios[1].play()

    //清除各种定时器
    clearInterval(upTimer)
    clearInterval(downTimer)
    clearInterval(pipeTimer)

    let lis = pipeBox.getElementsByClassName('li')
    for (item of lis) {
        clearInterval(item.moveTimer)
    }
    box.onclick = null
}

function birdUp() {
    speed = speed - .7
    if (speed <= 0) {
        clearInterval(upTimer)
        //重启下落定时器
        downTimer = setInterval(birdDown, 30)

    }
    flyBird.style.top = flyBird.offsetTop - speed + 'px'
    if (flyBird.offsetTop <= 0) {
        death()
    }
}

function isCrash(bird, pipe) {
    return !(
        bird.offsetLeft + bird.offsetWidth < pipe.parentNode.offsetLeft ||
        bird.offsetLeft > pipe.parentNode.offsetLeft + pipe.offsetWidth ||
        bird.offsetTop + bird.offsetHeight < pipe.offsetTop ||
        bird.offsetTop > pipe.offsetTop + pipe.offsetHeight
    )
}

function addScore() {
    scoreNum++
    console.log(scoreNum)
    scoreBoard.innerHTML = '<img src="img/">'
}

function createPipe() {
    var li = document.createElement('li')

    // console.log(li)

    var topHeight = Math.random() * (240 - 60) + 60
    var bottomHeight = 300 - topHeight
    // li.innerHTML= '<div class="topPipe" style="height: '+topHeight+'px"><img src="img/up_pipe.png" alt=""></div> <div class="bottomPipe" style="height: '+bottomHeight+'px"><img src="img/down_pipe.png" alt=""></div>'
    li.innerHTML = `
            <div class="topPipe" style="height: ${topHeight}px"><img src="img/up_pipe.png" alt=""></div>
            <div class="bottomPipe" style="height: ${bottomHeight}px"><img src="img/down_pipe.png" alt=""></div>
            `//es6模板字符串
    //console.log(li)
    li.mark = false//意味为加分
    li.moveTimer = setInterval(function () {
        // li.style.left=li.offsetLeft-3+'px'
        li.style.left = `${li.offsetLeft - 3}px`
        if (!li.mark && li.offsetLeft + li.offsetWidth < flyBird.offsetLeft) {
            li.mark = true
            //加分
            addScore()
        }
        //判断是否移出画面外，如果已经移出，则清除掉
        if (li.offsetLeft <= -70) {
            pipeBox.removeChild(li)//移出dom节点
        }
        /*console.log(li.firstElementChild)
        console.log(li.lastElementChild)*/
        //判断上下管道是否碰撞
        if (isCrash(flyBird, li.firstElementChild) || isCrash(flyBird, li.lastElementChild)) {
            death()
        }

    }, 30)
    //innerHTML添加进去会把前面的抹掉
    pipeBox.appendChild(li)//append,添加到已有元素的最后面
}

function gameStart() {//封装
    start.style.display = 'none'
    header.style.display = 'none'
    flyBird.style.display = 'block'
    //小鸟下落定时器
    downTimer = setInterval(birdDown, 30)
    box.onclick = function () {
        flyBird.src = 'img/up_bird1.png'
        // audios[2].play()
        clearInterval(downTimer)//清除定时器
        clearInterval(upTimer)//防止点击过快，上一次定时器还没完成，就开启下一次
        speed = maxSpeed
        upTimer = setInterval(birdUp, 30)
    }
    pipeTimer = setInterval(createPipe, 3000)
}

function init() {//从这个函数开始读，入口
    start.onclick = function (event) {
        // audios[0].play()
        var event = event || window.event//如果event存在，则把event赋值给event，否则把window.event赋值给event
        if (event.stopPropagation()) {//不同浏览器对于事件冒泡的处理不同，判断该浏览器支持哪种方法，用不同的方法去取消事件冒泡
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
        //调用游戏开始函数
        gameStart()
    }
}

init()
