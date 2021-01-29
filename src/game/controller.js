export default class Controller {
  constructor() {
    this.movingX = [];
    this.movingZ = [];

    this._initDirectionnalMovement();
  }

  _initDirectionnalMovement() {
    this._keydown = document.addEventListener(
      "keydown",
      function (event) {
        const keyCode = event.which;
        if (keyCode == 38) {
          const index = this.movingZ.indexOf("up");
          if (index === -1) {
            this.movingZ.unshift("up");
          }
        } else if (keyCode == 40) {
          const index = this.movingZ.indexOf("down");
          if (index === -1) {
            this.movingZ.unshift("down");
          }
        } else if (keyCode == 37) {
          const index = this.movingX.indexOf("left");
          if (index === -1) {
            this.movingX.unshift("left");
          }
        } else if (keyCode == 39) {
          const index = this.movingX.indexOf("right");
          if (index === -1) {
            this.movingX.unshift("right");
          }
        }
      }.bind(this),
      false
    );

    this._keyup = document.addEventListener(
      "keyup",
      function (event) {
        const keyCode = event.which;
        if (keyCode == 38) {
          const index = this.movingZ.indexOf("up");
          if (this.movingZ.indexOf("up") !== -1) {
            this.movingZ.splice(index, 1);
          }
        } else if (keyCode == 40) {
          const index = this.movingZ.indexOf("down");
          if (this.movingZ.indexOf("down") !== -1) {
            this.movingZ.splice(index, 1);
          }
        } else if (keyCode == 37) {
          const index = this.movingX.indexOf("left");
          if (this.movingX.indexOf("left") !== -1) {
            this.movingX.splice(index, 1);
          }
        } else if (keyCode == 39) {
          const index = this.movingX.indexOf("right");
          if (this.movingX.indexOf("right") !== -1) {
            this.movingX.splice(index, 1);
          }
        }
      }.bind(this),
      false
    );
  }
}
