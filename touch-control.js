class Button {
    constructor(x, y, width, height, color){ 
        this.active = false;
        this.color = color;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
    }
    containsPoint(x, y) {
        if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {
            return false;
        }
        return true;
    }
};

const buttons = [
    new Button(0, 0, 150, 150, "#0090f0"),
    new Button(180, 0, 150, 150, "#0090f0"),
    new Button(650, 0, 150, 150, "#f09000")
];

function testButtons(target_touches) {
    // loop through all buttons:
    for (var index0 = buttons.length - 1; index0 > -1; -- index0) {
        buttons[index0].active = false;

        // loop through all touch objects:
        for ( var index1 = target_touches.length - 1; index1 > -1; -- index1) {
            if (buttons[index0].containsPoint(
                target_touches[index1].clientX - cnv.getBoundingClientRect().left, 
                target_touches[index1].clientY - cnv.getBoundingClientRect().top)) {
                    buttons[index0].active = true;
                    break;//there's no need to check if any other points are inside, so continue
            }
        }
    }


    if (buttons[0].active) {
        orientacion = 'iz';
        keys.left.pressed = true;
   player.currentSprite = player.sprites.run.left;
    } 
    else if (buttons[1].active) {
        orientacion = 'de';
        keys.right.pressed = true;
   player.currentSprite = player.sprites.run.right;
    }
    else if (buttons[2].active) {
        player.velocity.y -= 2;
    } 
    else {
        keys.left.pressed = false;
        keys.right.pressed = false;
          if (orientacion == 'iz') {
   player.currentSprite = player.sprites.stand.left;
          } else {
   player.currentSprite = player.sprites.stand.right;
          }
    }
};

function touchEnd(event) {
    event.preventDefault();
    testButtons(event.targetTouches);
};
function touchMove(event) {
    event.preventDefault();
    testButtons(event.targetTouches);
};
function touchStart(event) {
    event.preventDefault();
    testButtons(event.targetTouches);
};


const cnv = document.getElementById("touchC");
const ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 150;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, cnv.width, cnv.height);

for (i = buttons.length - 1; i > -1; -- i) {
    ctx.fillStyle = buttons[i].color;
    ctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height);
};

cnv.addEventListener("touchend", touchEnd, {passive:false});
cnv.addEventListener("touchmove", touchMove, {passive:false});
cnv.addEventListener("touchstart", touchStart, {passive:false});

