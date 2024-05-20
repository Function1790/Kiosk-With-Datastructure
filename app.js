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
        this._arr = []
    }
    enqueue(item) {
        this._arr.push(item)
    }
    dequeue() {
        return this._arr.shift()
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
    constructor(title, content, price, count) {
        this.title = title
        this.content = content
        this.price = price
        this.count = count
    }
    isSoldout() {
        return this.count == 0
    }
}
//<----------Setting---------->
const menuList = [
    new Menu('연어김밥', '맛있는 연어와 김밥의 만남', 7800, 10),
    new Menu('참치김밥', '참치마요가 들어간 정석 김밥', 4500, 15),
    new Menu('국수', '따뜻한 멸치국수', 6500, 10),
    new Menu('돈가스', '맛있는거', 9200, 20),
    new Menu('음료수', '콜라 | 사이다', 1800, 30),
]


//TP3
//<----------Server---------->
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    await sendRender(req, res, './views/index.html', {
        index: req.session.index
    })
})

app.get('/select-seat', async (req, res) => {
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


app.get('/order', async (req, res) => {
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


app.post('/order-check', async (req, res) => {
    const body = req.body
    for (var i in menuList) {
        menuList[i].count -= Number(body[`${i}`])
    }
    res.send(forcedMoveCode('/'))
})


server.listen(5500, () => console.log('Server run https://127.0.0.1:5500'))