const canvas = document.getElementById('game')
const c = canvas.getContext('2d')
//canvas.width = window.innerWidth
//canvas.height = window.innerHeight
canvas.width = 800
canvas.height = 600
var i_platform = new Image()
i_platform.src = 'assets/platform.png'
var i_bg = new Image()
i_bg.src = 'assets/background.png'
var i_hill = new Image()
i_hill.src = 'assets/hill.png'
var i_smallT = new Image()
i_smallT.src = 'assets/platformSmallTall.png'
const gravity = 0.5

class Player {
    constructor() {
        this.speed = 7
        this.position = {
            x: 110,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y += gravity
        /*
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        {this.velocity.y += gravity}
        else {this.velocity.y = 0}
        */
    }
}

class Platform {
    constructor({x, y}, img, width, height) {
        this.position = {x: x, y: y}
        this.img = img
        this.width = width
        this.height = height
    }
    draw() {
        c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }
}

class GenericObject extends Platform {
    constructor({x, y}, img, width, height) {
        super({x, y}, img, width, height)
    }
}

const keys = {
    right: {pressed: false},
    left: {pressed: false}
}

let player = new Player()
let platforms = []
let genericObj = []
let scrollOffset = 0

function init() {
    player = new Player()
    platforms = [
        new Platform({x: 100, y: 300}, i_platform, 580, 125), 
        new Platform({x: 400, y: 400}, i_platform, 580, 125),
        new Platform({x: 1610, y: 370}, i_smallT, 291, 227),
        new Platform({x: 1611, y: 535}, i_platform, 290, 62),
        new Platform({x: 1900, y: 535}, i_platform, 290, 62),
        new Platform({x: 1120, y: 300}, i_platform, 290, 62)
    ]
    genericObj = [
        new GenericObject({x: -1, y: -1}, i_bg, 11643, 732),
        new GenericObject({x: 0, y: 15}, i_hill, 550, 582),
        new GenericObject({x: 1000, y: 15}, i_hill, 550, 582)
    ]
    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width, canvas.height)

    genericObj.forEach( (obj) => {obj.draw()})
    platforms.forEach( (platform) => {platform.draw()} )
    player.update()

    if (keys.right.pressed && player.position.x < (700 - player.width)) {player.velocity.x = player.speed}
    else if (keys.left.pressed && player.position.x > 100) {player.velocity.x = -player.speed}
    else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach( (platform) => {platform.position.x -= player.speed} )
            genericObj.forEach( (obj) => {obj.position.x -= player.speed * 0.6} )
        } else if (keys.left.pressed) {
            scrollOffset -= player.speed
            platforms.forEach( (platform) => {platform.position.x += player.speed} )
            genericObj.forEach( (obj) => {obj.position.x += player.speed * 0.6} )
        }
    }

    //collision
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) 
        {player.velocity.y = 0}
    })

    if (scrollOffset > 1500) {
        c.font = '30px Arial'
        c.fillText('you win', 300, 300)
    }
    if (player.position.y > canvas.height) {
        /*
        c.font = '30px Arial'
        c.fillText('you lose', 300, 300)
        setTimeout(() => init(), 1000)
        */
        init()
    }
}

init()
animate()

window.addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 65 :
            //alert("left")
            keys.left.pressed = true
            break
        case 83 :
            //alert("down")
            break
        case 68 :
            //alert("right")
            keys.right.pressed = true
            break
        case 87 :
            //alert("up")
            player.velocity.y -= 20
            break
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 65 :
            keys.left.pressed = false
            break
        case 83 :
            break
        case 68 :
            keys.right.pressed = false
            break
        case 87 :
            //player.velocity.y -= 20
            break
    }
})
