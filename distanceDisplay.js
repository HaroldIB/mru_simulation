
class DistanceDisplay {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.distance = 0;
  }

  update(amount, pixelsPerMeter) {
    this.distance += amount * pixelsPerMeter; // Convierte amount a píxeles antes de sumarlo a this.distance
  }
  reset() {
    this.distance = 0;
  }

  draw(context) {
    // Convierte la distancia de píxeles a metros antes de dibujarla
    const distanceInMeters = this.distance / pixelsPerMeter;

    context.fillStyle = "black";
    context.font = "20px Arial";

    context.fillText(
      "Distancia: " + distanceInMeters.toFixed(2) + " m",
      this.x,
      this.y
    );
  }
}
