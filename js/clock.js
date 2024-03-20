class Clock {
  constructor() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
  }

  update() {
    this.elapsedTime = Date.now() - this.startTime;
  }

  draw(context) {
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(
      "Tiempo de simulación: " + (this.elapsedTime / 1000).toFixed(1) + " s",
      10,
      30
    );
  }
}
