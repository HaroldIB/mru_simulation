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
let animationId;
let clock;
let ruler;
const motoHeight = 40;
const motoWidth = 40;
let lastTimestamp;
let accumulatedTime = 0;
const fixedDeltaTime = 1 / 60; // Tiempo fijo entre cada actualización de estado en segundos
let totalElapsedTime = 0; // Tiempo total transcurrido desde el inicio de la animación
let pixelsPerMeter; // Mueve la declaración de pixelsPerMeter aquí

// Asignación de eventos
startButton.addEventListener("click", init);

window.onload = loadImage;

// Instancia de DistanceDisplay
const distanceDisplay = new DistanceDisplay(10, 60);

// Función para cargar la imagen
function loadImage() {
  moto = new ImageMoto("moto.png", motoHeight, motoWidth);
  moto.x = 50 - moto.width;
  moto.y = 250;
  moto.img.onload = function () {
    moto.draw(context);
  };
  ruler = new Ruler(50, 10, moto.y + motoHeight, 50);
  ruler.draw(context);
}

// Función de inicialización
function init() {
  clock = new Clock();
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Calcula pixelsPerMeter en función de la distancia de simulación
  const simulationDistance = Number(simulationDistanceInput.value);
  pixelsPerMeter = 600 / simulationDistance;

  // Convierte la velocidad de metros por segundo a píxeles por cuadro antes de establecerla como vx de moto
  const framesPerSecond = 60; // Asume que la animación se ejecuta a 60 cuadros por segundo
  moto.vx =
    ((Number(speedInput.value) || 2) * pixelsPerMeter) / framesPerSecond;

  moto.x = 50;
  moto.y = 250;
  frameCount = 0; // Restablece el contador de cuadros
  // Calcula el número total de cuadros que durará la simulación
  totalFrames = framesPerSecond * Number(simulationTimeInput.value);

  ruler = new Ruler(50, 10, moto.y + motoHeight, moto.x);
  ruler.draw(context);
  distanceDisplay.reset();
  distanceDisplay.draw(context);

  lastTimestamp = performance.now();
  totalElapsedTime = 0; // Reinicia el tiempo total transcurrido
  animFrame(lastTimestamp);
}

// Función para el bucle de animación
function animFrame(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000; // Tiempo que ha pasado desde el último cuadro en segundos
  lastTimestamp = timestamp;
  accumulatedTime += deltaTime;
  totalElapsedTime += deltaTime; // Suma deltaTime al tiempo total transcurrido

  context.clearRect(0, 0, canvas.width, canvas.height);
  ruler.draw(context);
  clock.update();
  clock.draw(context);

  while (accumulatedTime >= fixedDeltaTime) {
    const distance = onEachStep(fixedDeltaTime); // Guarda la distancia que devuelve onEachStep
    distanceDisplay.update(distance, pixelsPerMeter); // Pasa pixelsPerMeter como un argumento
    accumulatedTime -= fixedDeltaTime;
  }

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
  console.log("Variación de Tiempo:" + deltaTime);
  console.log("distancia:" + distance);
  moto.x += distance * pixelsPerMeter; // Convierte la distancia a píxeles antes de añadirla a moto.x

  moto.draw(context);
  return distance; // Devuelve la distancia
}
