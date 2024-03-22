class Clock {
  constructor() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.isRunning = true;
    this.pauseTime = 0; // Agrega una variable para guardar el tiempo de pausa
  }

  update() {
    if (this.isRunning) {
      this.elapsedTime = Date.now() - this.startTime;
    }
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

  reset() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.pauseTime = 0; // Restablece el tiempo de pausa
  }

  stop() {
    this.isRunning = false;
    this.pauseTime = Date.now(); // Guarda el tiempo de pausa cuando se detiene la simulación
  }

  start() {
    this.isRunning = true;
    this.startTime += Date.now() - this.pauseTime; // Ajusta el tiempo de inicio para tener en cuenta el tiempo de pausa
  }
}
