const canvas = document.getElementById('game')
const c = canvas.getContext('2d')
//canvas.width = window.innerWidth
//canvas.height = window.innerHeight
canvas.width = 800
canvas.height = 600
var i_platform = new Image()
i_platform.src = 'assets/platform.png'
var i_hill = new Image()
i_hill.src = 'assets/hill.png'
var i_smallT = new Image()
i_smallT.src = 'assets/platformSmallTall.png'
var i_enemyL = new Image()
i_enemyL.src = 'assets/enemy_1_left.png'

var i_sRL = new Image()
var i_sRR = new Image()
var i_sSL = new Image()
var i_sSR = new Image()
i_sRL.src = 'assets/sRunL.png'
i_sRR.src = 'assets/sRunR.png'
i_sSL.src = 'assets/sSL.png'
i_sSR.src = 'assets/sSR.png'

var i_red_c = new Image()
    i_red_c.src = 'assets/red-colider.png'

const gravity = 0.5

var songs = {
    jump:  new Howl({src: ['sounds/cartoon-jump-6462.mp3']}),
    death: new Howl({src: ['sounds/negative_beeps-6008.mp3']}),
    music: new Howl({src: ['sounds/calm_music.mp3'], loop: true})
}

songs.music.play()
/*
const audioCtx = new AudioContext()
const sound_jump = new Audio('sounds/cartoon-jump-6462.mp3')
//const s_j = document.getElementById('audJ')
const track = audioCtx.createMediaElementSource(sound_jump)
track.connect(audioCtx.destination)
*/
class Platform {
    constructor({x, y}, img, width, height) {
        this.position = {x: x, y: y}
        this.sprite = img
        this.width = width
        this.height = height
    }
    draw() {
        c.drawImage(this.sprite, this.position.x, this.position.y, this.width, this.height)
    }
}

class GenericObject extends Platform {
    constructor({x, y}, img, width, height) {
        super({x, y}, img, width, height)
    }
}

class Enemy_collider extends Platform {
    constructor({x, y}, img, width, height) {
        super({x, y}, img, width, height)
    }
}

class Enemy extends Platform {
    constructor({x, y}, img, width, height) {
        super({x, y}, img, width, height)
    }
    draw() {
        c.drawImage(
            this.sprite, 
            160,
            0,
            160,
            119,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
    }
}

class Player {
    constructor() {
        this.speed = 7
        this.position = {
            x: 110,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 128
        this.height = 150
        this.sprites = {stand: {right: i_sSR, left: i_sSL}, run: {right: i_sRR, left: i_sRL}}
        this.currentSprite = this.sprites.stand.right
        this.frames = 0
        this.grounded = false
        this.mirar = 'de'
    }

    draw() {
        c.drawImage(
            this.currentSprite, 
            128 * this.frames,
            0,
            128,
            150,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
    }
    update() {
        this.frames ++
        if (this.frames == 30) {this.frames = 0}
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y += gravity
    }
}


const keys = {
    right: {pressed: false},
    left: {pressed: false},
    jump: {pressed: false}
}

let player = new Player()
let platforms = []
let genericObj = []
let enemies = []
let red_col = []
let scrollOffset = 0

function init() {
    player = new Player()
    platforms = [
        new Platform({x: 0, y: 475}, i_platform, 580, 125), 
        new Platform({x: 579, y: 475}, i_platform, 580, 125),
        new Platform({x: 1886, y: 375}, i_smallT, 291, 227),
        new Platform({x: 2277, y: 250}, i_smallT, 291, 227),
        new Platform({x: 1409, y: 475}, i_platform, 580, 125),
        new Platform({x: 1988, y: 475}, i_platform, 580, 125),
        new Platform({x: 2923, y: 475}, i_platform, 580, 125)
    ]
    genericObj = [
        new GenericObject({x: 0, y: 18}, i_hill, 550, 582),
        new GenericObject({x: 1000, y: 18}, i_hill, 550, 582),
        new GenericObject({x: 2000, y: 18}, i_hill, 550, 582)
    ]
    enemies = [
        new Enemy({x: 1968, y: 316}, i_enemyL, 80, 59),
        new Enemy({x: 2408, y: 416}, i_enemyL, 80, 59)
    ]
    red_col = [
        new Enemy_collider({x: 1826, y: 315}, i_red_c, 60, 60), 
        new Enemy_collider({x: 2177, y: 315}, i_red_c, 60, 60), 
        new Enemy_collider({x: 2217, y: 415}, i_red_c, 60, 60),
        new Enemy_collider({x: 2568, y: 415}, i_red_c, 60, 60) 
    ]
    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    c.fillStyle = '#124552'
    c.fillRect(0,0, canvas.width, canvas.height)

    genericObj.forEach( (obj) => {obj.draw()})
    platforms.forEach( (platform) => {platform.draw()} )
    enemies.forEach( (en) => {en.draw()} )
    red_col.forEach( (rc) => {rc.draw()} )
    player.update()

    //collision
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.grounded = true
            player.velocity.y = 0
        } 
    })

    gestiona_m ()
    gestiona_s()

    if (scrollOffset > 2900) {
        c.font = '35px Arial'
        c.fillStyle = 'red'
        c.fillText('you win', 380, 300)
    }
    if (player.position.y > canvas.height) {
        init()
        songs.death.play()
    }
}

init()
animate()

function keyDownUp(event) {
	event.preventDefault()
	var state = event.type == 'keydown'
	switch (event.keyCode) {
		case 65: keys.left.pressed = state 
        break
		case 68: keys.right.pressed = state 
        break
		case 32: keys.jump.pressed = state
	}
}
window.addEventListener('keydown', keyDownUp)
window.addEventListener('keyup', keyDownUp)

function gestiona_m () {
    if (keys.right.pressed && player.position.x < (500 - player.width)) {player.velocity.x = player.speed}
    else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0 )) {player.velocity.x = -player.speed}
    else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach( (platform) => {platform.position.x -= player.speed} )
            genericObj.forEach( (obj) => {obj.position.x -= player.speed * 0.6} )
            enemies.forEach( (en) => {en.position.x -= player.speed} )
            red_col.forEach( (rc) => {rc.position.x -= player.speed} )
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach( (platform) => {platform.position.x += player.speed} )
            genericObj.forEach( (obj) => {obj.position.x += player.speed * 0.6} )
            enemies.forEach( (en) => {en.position.x += player.speed} )
            red_col.forEach( (rc) => {rc.position.x += player.speed} )
        }
    }
    if (keys.jump.pressed) {
        if (player.grounded) {
            player.grounded = false
            player.velocity.y -= 13
            //sound_jump.play()//sound
            songs.jump.play()
        }
    }
}
function gestiona_s () {
    if (keys.left.pressed) {
        player.mirar = 'iz'
        player.currentSprite = player.sprites.run.left
    }
    else if (keys.right.pressed) {
        player.mirar = 'de'
        player.currentSprite = player.sprites.run.right
    }
    else if (!keys.left.pressed && !keys.right.pressed) {
        if (player.mirar == 'iz') {
            player.currentSprite = player.sprites.stand.left;
        } else if (player.mirar == 'de') {
            player.currentSprite = player.sprites.stand.right;
        }
    }
}

const out = document.getElementById('out')
const vol = document.getElementById('volume')
out.textContent = vol.value * 100
vol.addEventListener("input", (e) => {
    Howler.volume(e.target.value)
    out.textContent = e.target.value * 100
})
const power_vol = document.getElementById('power-vol')
power_vol.addEventListener("click", () => {
    if (songs.music.playing()) {
    songs.music.pause()
    } else {
    songs.music.play()
    }
})
