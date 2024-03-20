// Obtener elementos del DOM una sola vez
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const speedInput = document.getElementById("speedInput");
const simulationTimeInput = document.getElementById("simulationTime");
const simulationDistanceInput = document.getElementById("simulationDistance");

// Declaración de variables
let totalFrames; // Número total de cuadros que durará la simulación
let frameCount = 0; // Contador de cuadros
let moto;
let clock;
let distanceDisplay;
let ruler;
let animationId;
let canvasWidthPixels = canvas.width - 100;
let pixelsPerMeter; // Mueve la declaración de pixelsPerMeter aquí
const motoHeight = 40;
const motoWidth = 40;
const initialMotoPositionX = 50;
const initialMotoPositionY = 250;
const fixedDeltaTime = 1 / 60; // Tiempo fijo entre cada actualización de estado en segundos

let backgroundImage = new Image();
backgroundImage.src = "img/background.jpg"; // Reemplaza esto con la ruta a tu imagen

// Asignación de eventos
startButton.addEventListener("click", init);

window.onload = function () {
  loadImage();

  // Dibujar el fondo
  backgroundImage.onload = function () {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Crear una instancia de Ruler
    ruler = new Ruler(
      Number(simulationDistanceInput.value),
      10,
      initialMotoPositionY + motoHeight,
      initialMotoPositionX,
      canvasWidthPixels
    );

    // Dibujar la regla
    ruler.draw(context);
  };
};

// Función para cargar la imagen
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "img/background.jpg";
  moto = new ImageMoto("img/moto.png", motoHeight, motoWidth);
  moto.x = initialMotoPositionX - moto.width;
  moto.y = initialMotoPositionY;
  moto.img.onload = function () {
    moto.draw(context);
  };
}

// Función de inicialización
function init() {
  clock = new Clock();
  distanceDisplay = new DistanceDisplay(10, 60);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Calcula pixelsPerMeter en función de la distancia de simulación
  const simulationDistance = Number(simulationDistanceInput.value);
  pixelsPerMeter = canvasWidthPixels / simulationDistance;

  // Convierte la velocidad de metros por segundo a píxeles por cuadro antes de establecerla como vx de moto
  const framesPerSecond = 60; // Asume que la animación se ejecuta a 60 cuadros por segundo
  moto.vx = (Number(speedInput.value) || 2) * pixelsPerMeter;
  moto.x = initialMotoPositionX - moto.width;
  moto.y = initialMotoPositionY;
  frameCount = 0; // Restablece el contador de cuadros
  // Calcula el número total de cuadros que durará la simulación
  totalFrames = framesPerSecond * Number(simulationTimeInput.value);

  ruler = new Ruler(
    simulationDistance,
    10,
    moto.y + motoHeight,
    initialMotoPositionX,
    canvasWidthPixels
  );
  ruler.draw(context);
  distanceDisplay.reset();
  distanceDisplay.draw(context);

  animFrame();
}

// Función para el bucle de animación
function animFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ruler.draw(context);
  clock.update();
  clock.draw(context);

  const distance = onEachStep(fixedDeltaTime); // Guarda la distancia que devuelve onEachStep

  distanceDisplay.update(distance, pixelsPerMeter); // Pasa pixelsPerMeter como un argumento
  distanceDisplay.draw(context); // Dibuja la distancia después del bucle while

  frameCount++; // Incrementa el contador de cuadros
  // Solicita el siguiente cuadro de animación solo si no se han mostrado 180 cuadros
  if (frameCount < totalFrames) {
    animationId = requestAnimationFrame(animFrame, canvas);
  }
}

// Función ejecutada en cada paso de la animación
function onEachStep(deltaTime) {
  const distance = moto.vx * deltaTime; // Distancia que la moto ha recorrido desde el último cuadro en metros
  moto.x += distance; // Convierte la distancia a píxeles antes de añadirla a moto.x
  moto.draw(context);
  return distance; // Devuelve la distancia
}
