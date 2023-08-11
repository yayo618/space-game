const canvas = document.getElementById('game')
const c = canvas.getContext('2d')
//canvas.width = window.innerWidth
//canvas.height = window.innerHeight
canvas.width = 800
canvas.height = 600

const gravity = 0.5

class Player {
    constructor() {
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

        //this.velocity.y += gravity
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        {this.velocity.y += gravity}
        else {this.velocity.y = 0}
    }
}

class Platform {
    constructor({x, y}) {
        this.position = {x: x, y: y}
        this.width = 200
        this.height = 20
    }
    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
//const platform = new Platform()
const platforms = [
    new Platform({x: 200, y: 300}), 
    new Platform({x: 500, y: 400}),
    new Platform({x: 2000, y: 500}),
    new Platform({x: 1500, y: 450})]
const keys = {
    right: {pressed: false},
    left: {pressed: false}
}

let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    player.update()
//    platform.draw()
    platforms.forEach( (platform) => {platform.draw()} )

    if (keys.right.pressed && player.position.x < 700) {player.velocity.x = 5}
    else if (keys.left.pressed && player.position.x > 100) {player.velocity.x = -5}
    else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach( (platform) => {platform.position.x -= 5} )
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach( (platform) => {platform.position.x += 5} )
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
}
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
