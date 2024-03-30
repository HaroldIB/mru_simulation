const velocityGraphCanvas = document.getElementById("velocityGraphCanvas");
const velocityGraphContext = velocityGraphCanvas.getContext("2d");

const graphCanvas = document.getElementById("graphCanvas");
const graphContext = graphCanvas.getContext("2d");
// Obtener elementos del DOM una sola vez
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const speedInput = document.getElementById("speedInput");
const simulationTimeInput = document.getElementById("simulationTime");
const simulationDistanceInput = document.getElementById("simulationDistance");
const endButton = document.getElementById("endButton");
// Cuando el usuario hace clic en el botón de confirmar, cierra la ventana modal
document.getElementById("modalButton").onclick = function () {
  document.getElementById("modal").style.visibility = "hidden"; // Cambia esto
};
// Declaración de variables
let totalFrames; // Número total de cuadros que durará la simulación
let frameCount = 0; // Contador de cuadros
let moto;
let clock;
let distanceDisplay;
let ruler;
let background;
let animationId;
let canvasWidthPixels = canvas.width - 100;
let pixelsPerMeter; // Mueve la declaración de pixelsPerMeter aquí
let simulationDistance;
let motoHeight = 40;
let motoWidth = 40;
let graph;
let velocityGraph;
const initialMotoPositionX = 50;
const initialMotoPositionY = 200;
const fixedDeltaTime = 1 / 60; // Tiempo fijo entre cada actualización de estado en segundos

background = new Background("img/background.jpg", canvas, context);

// Asignación de eventos
startButton.addEventListener("click", init);
endButton.addEventListener("click", endSimulation);
simulationDistanceInput.addEventListener("input", loadAndDrawImage);

// Llama a loadAndDrawImage cuando se carga la página
window.onload = loadAndDrawImage;

// Define la función que se ejecutará cuando se cargue la página y cuando se redimensione la ventana
function loadAndDrawImage() {
  loadImage();
  background.image.onload = function () {
    simulationDistance = Number(simulationDistanceInput.value);
    background.draw(simulationDistance);
    // motoHeight = -0.006 * simulationDistance + 43;
    motoWidth = -0.0034 * simulationDistance + 41.72;

    ruler = new Ruler(
      Number(simulationDistanceInput.value),
      10,
      initialMotoPositionY + motoHeight,
      initialMotoPositionX,
      canvasWidthPixels
    );
    ruler.draw(context);

    // Agrega estas líneas para dibujar la gráfica inicial
    const maxTime = Number(simulationTimeInput.value);
    const maxDistance = Number(simulationDistanceInput.value);
    const maxSpeed = Number(speedInput.value) * 2;
    graph = new Graph(graphCanvas, graphContext, maxTime, maxDistance);
    graph.draw();
    velocityGraph = new Graph(
      velocityGraphCanvas,
      velocityGraphContext,
      maxTime,
      maxSpeed
    );
    velocityGraph.draw();
  };
}

// Función para cargar la imagen
function loadImage() {
  background.image = new Image();
  background.image.src = "img/background.jpg";
  simulationDistance = Number(simulationDistanceInput.value);
  // motoHeight = -0.006 * simulationDistance + 43;
  motoWidth = -0.0034 * simulationDistance + 41.72;
  moto = new ImageMoto("img/moto.png", motoWidth, motoHeight);
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

  const maxTime = Number(simulationTimeInput.value);
  const maxDistance = Number(simulationDistanceInput.value);
  graph = new Graph(graphCanvas, graphContext, maxTime, maxDistance);

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

  // Deshabilita el botón de inicio
  startButton.disabled = true;
  // Deshabilita el botón de inicio y la barra de Distancia de Simulación
  startButton.disabled = true;
  simulationDistanceInput.disabled = true;
  // Deshabilita el botón de inicio, la barra de Distancia de Simulación y las entradas de texto
  startButton.disabled = true;
  simulationDistanceInput.disabled = true;
  speedInput.disabled = true;
  simulationTimeInput.disabled = true;
}
startButton.addEventListener("click", init);

// Función para terminar la simulación
function endSimulation() {
  // Cancela la animación
  cancelAnimationFrame(animationId);

  // Restablece el estado de la simulación
  moto.x = initialMotoPositionX;
  moto.y = initialMotoPositionY;
  frameCount = 0;

  // Habilita el botón de inicio
  startButton.disabled = false;

  // Restablece los valores de Tiempo de Simulación y Distancia
  clock.reset();
  distanceDisplay.reset();

  // Redibuja la escena
  loadAndDrawImage();
  // Habilita el botón de inicio y la barra de Distancia de Simulación
  startButton.disabled = false;
  simulationDistanceInput.disabled = false;
  // Habilita el botón de inicio, la barra de Distancia de Simulación y las entradas de texto
  startButton.disabled = false;
  simulationDistanceInput.disabled = false;
  speedInput.disabled = false;
  simulationTimeInput.disabled = false;
}

// Función para el bucle de animación
function animFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const simulationDistance = Number(simulationDistanceInput.value);
  background.draw(simulationDistance);

  ruler.draw(context);
  clock.update();
  clock.draw(context);

  const time = frameCount / 60;
  graph.addPoint(time, distanceDisplay.distance / pixelsPerMeter);
  graph.draw();

  const speed = moto.vx / pixelsPerMeter;
  velocityGraph.addPoint(time, speed);
  velocityGraph.draw();

  const distance = onEachStep(fixedDeltaTime); // Guarda la distancia que devuelve onEachStep

  distanceDisplay.update(distance, pixelsPerMeter); // Pasa pixelsPerMeter como un argumento
  distanceDisplay.draw(context); // Dibuja la distancia después del bucle while

  frameCount++; // Incrementa el contador de cuadros

  // Solicita el siguiente cuadro de animación solo si no se han mostrado 180 cuadros
  if (frameCount < totalFrames) {
    animationId = requestAnimationFrame(animFrame, canvas);
  } else {
    // Muestra un mensaje emergente con la distancia alcanzada por el motociclista
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modalText");
    const distanceInMeters = distanceDisplay.distance / pixelsPerMeter;
    modalText.textContent =
      "La distancia alcanzada por el motociclista es: " +
      distanceInMeters.toFixed(0) +
      " m";
    modal.style.visibility = "visible"; /* Cambia esto */

    // La simulación ha terminado
    startButton.disabled = false;
    simulationDistanceInput.disabled = false;
    // Habilita el botón de inicio, la barra de Distancia de Simulación y las entradas de texto
    startButton.disabled = false;
    simulationDistanceInput.disabled = false;
    speedInput.disabled = false;
    simulationTimeInput.disabled = false;
  }
}

// Función ejecutada en cada paso de la animación
function onEachStep(deltaTime) {
  const distance = moto.vx * deltaTime; // Distancia que la moto ha recorrido desde el último cuadro en metros
  moto.x += distance; // Convierte la distancia a píxeles antes de añadirla a moto.x
  moto.draw(context);
  return distance; // Devuelve la distancia
}
