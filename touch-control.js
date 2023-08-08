(function() {

  var Button, controller, display;

  Button = function(x, y, width, height, color) {
    this.active = false;
    this.color = color;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
  }

  Button.prototype = {
    containsPoint:function(x, y) {
      if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {
        return false;
      }
      return true;
    }
  };

  // handles everything to do with user input:
  controller = {

    buttons:[
      new Button(260, 0, 60, 60, "#f09000"),
      new Button(0, 0, 60, 60, "#0090f0"),
      new Button(70, 0, 60, 60, "#0090f0")
    ],

    testButtons:function(target_touches) {

      var button, index0, index1, touch;

      // loop through all buttons:
      for (index0 = this.buttons.length - 1; index0 > -1; -- index0) {
        button = this.buttons[index0];
        button.active = false;

        // loop through all touch objects:
        for (index1 = target_touches.length - 1; index1 > -1; -- index1) {
          touch = target_touches[index1];
          // make sure the touch coordinates are adjusted for both the canvas offset 
          // and the scale ratio of the buffer and output canvases:
          if (button.containsPoint(
              (touch.clientX - display.bounding_rectangle.left) * display.buffer_output_ratio, 
              (touch.clientY - display.bounding_rectangle.top) * display.buffer_output_ratio)) {
            button.active = true;
            break;//once the button is active, there's no need to check if any other points are inside, so continue
          }
        }
      }

      // this is all just for displaying the messages when buttons are pressed. This isn't necessary code.

      if (this.buttons[0].active) {
//        touchArr = true;
          player.velocity.y -= 2;
      } else {
//        touchArr = false;
      } 
      if (this.buttons[1].active) {
          keys.left.pressed = true;
      } else {
          keys.left.pressed = false;
      }
      if (this.buttons[2].active) {
          keys.right.pressed = true;
      } else {
          keys.right.pressed = false;
      }
    },

    touchEnd:function(event) {
      event.preventDefault();
      controller.testButtons(event.targetTouches);
    },
    touchMove:function(event) {
      event.preventDefault();
      controller.testButtons(event.targetTouches);
    },
    touchStart:function(event) {
      event.preventDefault();
      controller.testButtons(event.targetTouches);
    }

  };

  // handles everything to do with displaying graphics on the screen:
  display = {

    // the buffer is used to scale the applications graphics to fit the screen:
      buffer:document.createElement("canvas").getContext("2d"),
    // the on screen canvas context that we will be drawing to:
    output:document.getElementById("touchC").getContext("2d"),
    // the p element for text output:

    // the ratio in size between the buffer and output canvases used to scale user input coordinates:
    buffer_output_ratio:1,
    //thebounding rectangle of the output canvas used to determine the location of user input on the output canvas:
    bounding_rectangle:undefined,

    // renders the buffer to the output canvas:
    render:function() {
      this.output.drawImage(
          this.buffer.canvas, 
          0, 
          0, 
          this.buffer.canvas.width, 
          this.buffer.canvas.height, 
          0, 
          0, 
          this.output.canvas.width, 
          this.output.canvas.height
      );
    },

    // renders the buttons:
    renderButtons:function(buttons) {
      var button, index;
      this.buffer.fillStyle = "#ffffff"; // color fondo de los botones
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

      for (index = buttons.length - 1; index > -1; -- index) {
        button = buttons[index];
        this.buffer.fillStyle = button.color;
        this.buffer.fillRect(button.x, button.y, button.width, button.height);
      }
    },

    // just keeps the output canvas element sized appropriately:
    resize:function(event) {
      display.output.canvas.width = Math.floor(document.documentElement.clientWidth - 32);
      if (display.output.canvas.width > document.documentElement.clientHeight) {
        display.output.canvas.width = Math.floor(document.documentElement.clientHeight);
      }

      display.output.canvas.height = Math.floor(display.output.canvas.width *
                    display.buffer.canvas.height/display.buffer.canvas.width);//GG
      // these next two lines are used for adjusting and scaling user touch input coordinates:
      display.bounding_rectangle = display.output.canvas.getBoundingClientRect();
      display.buffer_output_ratio = display.buffer.canvas.width / display.output.canvas.width;
    }
  };


  // size the buffer:
  display.buffer.canvas.height = 60;
  display.buffer.canvas.width = 320;

  window.addEventListener("resize", display.resize);
  // setting passive:false allows you to use preventDefault in event listeners:
  display.output.canvas.addEventListener("touchend", controller.touchEnd, {passive:false});
  display.output.canvas.addEventListener("touchmove", controller.touchMove, {passive:false});
  display.output.canvas.addEventListener("touchstart", controller.touchStart, {passive:false});

  // make sure the display canvas is the appropriate size on the screen:
  display.resize();

      display.renderButtons(controller.buttons);
      display.render();
})();
