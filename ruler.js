class Ruler {
  constructor(spacing, height, startY, offsetX) {
    this.spacing = spacing;
    this.height = height;
    this.startY = startY;
    this.offsetX = offsetX; // Agrega una nueva propiedad para el desplazamiento en x
  }

  draw(context) {
    context.fillStyle = "black";
    context.font = "10px Arial";

    // Dibuja la línea de la pista
    context.fillRect(this.offsetX, this.startY, context.canvas.width - 100, 1);

    for (
      let x = 0;
      x <= context.canvas.width - 50 - this.offsetX;
      x += this.spacing
    ) {
      // Dibuja la marca de la regla
      context.fillRect(this.offsetX + x, this.startY, 1, this.height);

      // Dibuja la etiqueta de la regla
      context.fillText(
        x + " m",
        this.offsetX + x,
        this.startY + this.height * 2
      );
    }
  }
}
