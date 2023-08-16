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

var    buttons = [
      new Button(650, 0, 150, 150, "#f09000"),
      new Button(0, 0, 150, 150, "#0090f0"),
      new Button(180, 0, 150, 150, "#0090f0")
    ];

function testButtons(target_touches) {
      //   var button, index0, index1, touch;
      // loop through all buttons:
      for (var index0 = buttons.length - 1; index0 > -1; -- index0) {
        //button = buttons[index0];
        buttons[index0].active = false;

        // loop through all touch objects:
        for ( var index1 = target_touches.length - 1; index1 > -1; -- index1) {
          //touch = target_touches[index1];
          if (buttons[index0].containsPoint(
              target_touches[index1].clientX - cnv.getBoundingClientRect().left, 
              target_touches[index1].clientY - cnv.getBoundingClientRect().top
            )) {
            buttons[index0].active = true;
            break;//once the button is active, there's no need to check if any other points are inside, so continue
          }
        }
      }


      if (buttons[0].active) {
          player.velocity.y -= 2;
      } 
      else if (buttons[1].active) {
          orientacion = 'iz';
          keys.left.pressed = true;
   player.currentSprite = player.sprites.run.left;
      }
      else if (buttons[2].active) {
          orientacion = 'de';
          keys.right.pressed = true;
   player.currentSprite = player.sprites.run.right;
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
ctx.fillRect(0,0,cnv.width,cnv.height);
    for (index = buttons.length - 1; index > -1; -- index) {
        button = buttons[index];
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
      };

  cnv.addEventListener("touchend", touchEnd, {passive:false});
  cnv.addEventListener("touchmove", touchMove, {passive:false});
  cnv.addEventListener("touchstart", touchStart, {passive:false});

