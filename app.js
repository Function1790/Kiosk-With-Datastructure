const express = require('express')
const app = express()
const fs = require('fs')
const mysql = require('mysql')

const http = require('http');
const server = http.createServer(app);


//Express Setting
app.use(express.static('public'))
app.use('/views', express.static('views'))


//Mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1790',
    database: ''
})
connection.connect();

async function sqlQuery(query) {
    let promise = new Promise((resolve, reject) => {
        const rows = connection.query(query, (error, rows, fields) => {
            resolve(rows)
        })
    })
    let result = await promise
    return result
}

//body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

const session = require('express-session')
const Memorystore = require('memorystore')
const cookieParser = require("cookie-parser");
const { send } = require('process');
app.use(cookieParser('kiosk'))

app.use(session({
    secure: true,
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        Secure: true
    },
    name: 'data-session',
}))

const cookieConfig = {
    maxAge: 30000,
    path: '/',
    httpOnly: true,
    signed: true
}

//TP2
//<----------Function---------->
const print = (data) => console.log(data)

async function readFile(path) {
    return await new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(data)
        })
    })
}

function forcedMoveCode(url) {
    return `<script>window.location.href = "${url}"</script>`
}

function forcedMoveWithAlertCode(text, url) {
    return `<script>alert(\`${text}\`);window.location.href = "${url}"</script>`
}

function goBackWithAlertCode(text) {
    return `<script>alert("${text}");window.location.href = document.referrer</script>`
}

function goBackCode() {
    return `<script>window.location.href = document.referrer</script>`
}


async function renderFile(req, path, replaceItems = {}) {
    var content = await readFile(path)
    for (i in replaceItems) {
        content = content.replaceAll(`{{${i}}}`, replaceItems[i])
    }
    return content
}

/** res.send(renderFile(...)) */
async function sendRender(req, res, path, replaceItems = {}) {
    res.send(await renderFile(req, path, replaceItems))
}


function isCorrectSQLResult(result) {
    try {
        if (result.length == 0) {
            return false
        }
        return true
    } catch {
        return false
    }
}
//TP1
//<----------Class---------->
class Queue {
    constructor() {
        this.arr = []
    }
    push(item) { // enqueue
        this.arr.push(item)
    }
    pop() { // dequeue
        return this.arr.shift()
    }
}

class Stack {
    constructor() {
        this.arr = []
    }
    push(item) {
        this.arr.push(item)
    }
    pop() {
        return this.arr.pop()
    }
}

class Menu {
    constructor(title, content, price, count, time) {
        this.title = title
        this.content = content
        this.price = price
        this.count = count
        this.time = time
    }
    isSoldout() {
        return this.count == 0
    }
}
//<----------Setting---------->
const menuList = [
    new Menu('연어김밥', '맛있는 연어와 김밥의 만남', 7800, 10, 4),
    new Menu('참치김밥', '참치마요가 들어간 정석 김밥', 4500, 15, 7),
    new Menu('국수', '따뜻한 멸치국수', 6500, 10, 8),
    new Menu('돈까스', '맛있는거', 9200, 20, 9),
    new Menu('음료수', '콜라 | 사이다', 1800, 30, 1),
]

const orderList = new Queue()


//TP3
//<----------Server---------->
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async(req, res) => {
    await sendRender(req, res, './views/index.html', {
        index: req.session.index
    })
})

app.get('/select-seat', async(req, res) => {
    var seatHTML = ''
    for (var i = 0; i < 20; i++) {
        seatHTML += `
        <a href="/select-seat-check?index=${i}">
            <div class="seat">
                <div class="title">${i}</div>
            </div>
        </a>`
    }
    await sendRender(req, res, './views/select-seat.html', {
        seat: seatHTML
    })
})

app.get('/select-seat-check', (req, res) => {
    req.session.index = req.query.index
    res.send(forcedMoveCode('/'))
})


app.get('/order', async(req, res) => {
    var menuListHTML = ''
    for (var i in menuList) {
        menuListHTML += `
        <div class="menu">
            <div class="menu-title">${menuList[i].title}</div>
            <div class="menu-data-wrap">
                <div class="menu-content">${menuList[i].content}</div>
                <div class="menu-price">${menuList[i].price}원</div>
                <div class="menu-count">재고 : ${menuList[i].count}개</div>
                <input type="number" name="${i}" value="0">
            </div>
        </div>
        `
    }
    await sendRender(req, res, './views/order.html', {
        menuList: menuListHTML
    })
})


app.post('/order-check', async(req, res) => {
    const body = req.body
    var order = {}
    order.userIndex = req.session.index
    for (var i in menuList) {
        var _count = Number(body[`${i}`])
        if (_count) {
            order[`${i}`] = {
                count: _count,
                time: menuList[i].time * (1 + .4 * (_count - 1)),

            }
        }
        menuList[i].count -= _count
    }
    orderList.push(order)
    res.send(forcedMoveCode('/'))
})

app.get('/order/show', async(req, res) => {
    var orderHTML = ''
    for (var i in orderList.arr) {
        var _order = orderList.arr[i]
        var totalTime = 0
        innerHTML = `
        <div class="line">
            <div class="title">${_order.userIndex}번 테이블</div>
        </div>`
        for (var i in _order) {
            if (i == 'userIndex') continue
            innerHTML += `
            <div class="line">
                <div class="column">${menuList[i].title}</div>
                <div class="column">${_order[i].count}개</div>
                <div class="column">${_order[i].time}분</div>
            </div>
            `
            totalTime += _order[i].time
        }
        orderHTML += `
        <div class="order">
            ${innerHTML}
            <br>
            <div class="line">${totalTime}분</div>
        </div>`
    }
    await sendRender(req, res, './views/ordershow.html', {
        orderHTML: orderHTML
    })
})


app.get('/order/get', async(req, res) => {
    const now = orderList.arr[0]
    var orderHTML = ''

    var totalTime = 0
    innerHTML = `
        <h1>우선</h1>
        <div class="line">
            <div class="title">${now.userIndex}번 테이블</div>
        </div>`
    for (var i in now) {
        if (i == 'userIndex') continue
        innerHTML += `
            <div class="line">
                <div class="column">${menuList[i].title}</div>
                <div class="column">${now[i].count}개</div>
                <div class="column">${now[i].time}분</div>
            </div>
            `
        totalTime += now[i].time
    }
    orderHTML += `
        <div class="order">
            ${innerHTML}
            <br>
            <div class="line">${totalTime}분</div>
        </div>`

    await sendRender(req, res, './views/ordershow.html', {
        orderHTML: orderHTML
    })
})

server.listen(5500, () => console.log('Server run https://127.0.0.1:5500'))