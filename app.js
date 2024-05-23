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
    const sess = req.session
    if (sess.pathRecord == undefined) {
        sess.pathRecord = []
        sess.lastPath = '/'
    }
    sess.pathRecord.push(sess.lastPath)
    sess.lastPath = req.route.path
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

function getMenuHTML(index, item) {
    return `
    <div class="menu">
        <div class="menu-title">${item.title}</div>
        <div class="menu-data-wrap">
            <div class="menu-content">${item.content}</div>
            <div class="menu-price">${item.price}원</div>
            <div class="menu-count">재고 : ${item.count}개</div>
            <input type="number" name="${index}" value="0">
        </div>
    </div>`
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
    peek() {
        if (this.arr.length == 0) {
            return null
        }
        return this.arr[0]
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

class Tree {
    constructor(value = null, children = []) {
        this.value = value
        this.children = children
    }
}


/** child.time 기준 정렬 | Attr{count, time, complete, rank}*/
class MinHeap {
    constructor() {
        this.arr = [null];
        this.lastRank = 1
    }

    swap(a, b) {
        [this.arr[a], this.arr[b]] = [this.arr[b], this.arr[a]];
    }

    size() {
        return this.arr.length - 1;
    }

    empty() {
        return this.size() === 0;
    }

    get length() { return this.arr.length }

    push(item) {
        this.arr.push(item);
        let cur = this.arr.length - 1;
        let par = Math.floor(cur / 2);
        if (item.rank == undefined) {
            item.rank = this.lastRank
            this.lastRank++
        }

        // 부호에 따라 (Max|Min) Heap 결정
        while (par > 0 && this.arr[par].rank > item.rank) {
            this.swap(cur, par);
            cur = par;
            par = Math.floor(cur / 2);
        }
    }

    pop() {
        if (this.empty()) {
            return 0;
        }
        if (this.size() === 1) {
            return this.arr.pop();
        }
        let returnValue = this.arr[1];
        this.arr[1] = this.arr.pop();

        let cur = 1;
        let left = 2;
        let right = 3;
        print(this.arr)

        var arrLeft = this.arr[left] ? this.arr[left].rank : null
        var arrRight = this.arr[right] ? this.arr[right].rank : null
        while (this.arr[cur].rank > arrLeft || this.arr[cur].rank > arrRight) {
            print(cur)
            if (this.arr[left].rank > this.arr[right].rank) {
                this.swap(cur, right);
                cur = right;
            } else {
                this.swap(cur, left);
                cur = left;
            }
            left = cur * 2;
            right = cur * 2 + 1;
        }

        return returnValue;
    }

    peek() {
        if (this.arr.length == 1) {
            return null
        }
        return this.arr[1]
    }
}
//<----------Setting---------->
//메뉴의 종류
const menuList = [
    // Menu 안에 들어가는 값은 순서대로
    // 음식이름, 설명, 가격, 갯수, 시간(분) 이다
    new Menu('연어김밥', '맛있는 연어와 김밥의 만남', 7800, 30, 4),
    new Menu('참치김밥', '참치마요가 들어간 정석 김밥', 4500, 35, 5),
    new Menu('국수', '따뜻한 멸치국수', 6500, 60, 7),
    new Menu('돈까스', '맛있는거', 9200, 40, 9),
    new Menu('우동', '맛있는거', 7500, 50, 5),
    new Menu('연어초밥', '맛있는거', 9900, 50, 4), // index:5
    new Menu('피자', '맛있는거', 17000, 50, 10),
    new Menu('파스타', '맛있는거', 12100, 50, 7),
    new Menu('비빔밥', '맛있는거', 9200, 50, 4),
    new Menu('불고기', '맛있는거', 10200, 50, 6),
    new Menu('물냉면', '시원하고 맛있는 육수', 8900, 25, 5), //index:10
    new Menu('음료수', '콜라 | 사이다', 1800, 100, 0.5),
    new Menu('비빔냉면', '시원하고 맛있는 육수', 8900, 25, 5),
]

//주문 저장 리스트(배열), 최소힙 사용
const orderList = new MinHeap();
// 카테고리, 트리 구조 사용
const category = new Tree(null, [
    new Tree('김밥류', [
        menuList[0], menuList[1], menuList[2]
    ]),
    new Tree('일식', [
        menuList[3], menuList[4], menuList[5]
    ]),
    new Tree('양식', [
        menuList[6], menuList[7]
    ]),
    new Tree('한식', [
        menuList[0], menuList[1], menuList[8], menuList[9], menuList[10]
    ]),
    new Tree('알레르기성', [
        menuList[3], menuList[7]
    ]),
    new Tree('기름진', [
        menuList[3], menuList[6], menuList[7]
    ]),
    new Tree('계절음식', [
        menuList[10], menuList[12]
    ])
])

//TP3
//<----------Server---------->
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async(req, res) => {
    await sendRender(req, res, './views/index.html', {
        header: `남은 주문 ${orderList.size()}개`,
        index: req.session.index
    })
})

app.get('/select-seat', async(req, res) => {
    var seatHTML = ''
    for (var i = 0; i < 20; i++) {
        var isSeat = ''
        for (var j = 1; j < orderList.length; j++) {
            if (orderList.arr[j].userIndex == `${i}`) {
                isSeat = 'wait'
                break
            }
        }
        seatHTML += `
        <a href="/select-seat-check?index=${i}">
            <div class="seat ${isSeat}">
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
            var filterIndex = req.query.filter
            var filterHTML = ''

            for (var i in category.children) {
                var filterName = category.children[i].value
                filterHTML += `
            <div class="category ${filterIndex ? filterIndex == `${i}` ? 'selected' : '' : ''}">
                <a href="/order?filter=${i}">${filterName}</a>
            </div>
        `
    }

    var menuListHTML = ''
    var targetList = filterIndex != undefined ? category.children[filterIndex].children : menuList

    for (var i in targetList) {
        menuListHTML += getMenuHTML(i, targetList[i])
    }

    await sendRender(req, res, './views/order.html', {
        filterHTML: filterHTML,
        menuList: menuListHTML
    })
})


app.post('/order-check', async (req, res) => {
    const body = req.body
    var order = { userIndex: req.session.index }
    var pre_order = {}
    var hasPreOrder = false

    for (var i in menuList) {
        if (!body[`${i}`]) continue
        var _count = Number(body[`${i}`])
        if (_count) {
            var orderData = {
                count: _count,
                time: Math.floor(menuList[i].time * (1 + .4 * (_count - 1))),
                complete: false
            }
            if (i == 11) {
                pre_order[`${i}`] = orderData
                hasPreOrder = true
            } else {
                order[`${i}`] = orderData
            }
        }
        menuList[i].count -= _count
    }
    orderList.push(order)
    if (hasPreOrder) {
        pre_order.userIndex = req.session.index
        pre_order.rank = 0
        orderList.push(pre_order)
    }
    res.send(forcedMoveCode('/'))
})

app.get('/order/show', async (req, res) => {
    var orderHTML = ''
    for (var i = 1; i < orderList.length; i++) {
        var _order = orderList.arr[i]
        var totalTime = 0
        innerHTML = `
        <div class="line">
            <div class="title">${_order.userIndex}번 테이블(rank:${_order.rank})</div>
        </div>`
        for (var j in _order) {
            if (j == 'userIndex' || j == 'rank') continue
            innerHTML += `
            <div class="line">
                <div class="column">${menuList[j].title}</div>
                <div class="column">${_order[j].count}개</div>
                <div class="column">${_order[j].time}분</div>
            </div>
            `
            totalTime += _order[j].time
        } i
        orderHTML += `
        <div class="order">
            ${innerHTML}
            <br>
            <div class="line">총 소요시간 : ${totalTime}분</div>
        </div>`
    }
    //정렬 알고리즘
    await sendRender(req, res, './views/ordershow.html', {
        orderHTML: orderHTML
    })
})


app.get('/order/get', async (req, res) => {
    var now = orderList.peek()
    if (!now) {
        await sendRender(req, res, './views/ordershow.html', {
            orderHTML: "끝"
        })
        return
    }
    var orderHTML = ''

    var totalTime = 0
    innerHTML = `
        <h1>남은 주문 ${orderList.size()}개</h1>
        <div class="line">
            <div class="title">${now.userIndex}번 테이블</div>
        </div>`
    for (var i in now) {
        if (i == 'userIndex' || i == 'rank') continue
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
            <div class="line">총 소요시간 : ${totalTime}분</div>
            <div class="line"><a href="/complete">완성</a></div>
        </div>`

    await sendRender(req, res, './views/ordershow.html', {
        orderHTML: orderHTML
    })
})

app.get('/complete', (req, res) => {
    orderList.pop()
    res.send(forcedMoveCode('/order/get'))
})

server.listen(5500, () => console.log('Server run https://127.0.0.1:5500'))