let numIntentos = 6;
let numIntentosOriginales = numIntentos;
let palabraAdivinar = [];
let palabraMostrar = [];
let teclasBloqueadas = [];
let nodoPista = document.querySelector("#pista");
let nodoResultado = document.querySelector("#resultado").firstChild;
let nodoIntentos = document.querySelector("#intentos");
let nodoIntentosOriginales = document.querySelector("#intentosOriginales");
let nodoBotonReiniciar = document.querySelector("#BotonReiniciar");
let nodoAltavoz = document.querySelector("#altavoz");

var fallar = new Audio("media/perder.mp3");
var acertar = new Audio("media/acertar.mp3");
var fondo = new Audio("media/fondo.mp3");
fondo.loop = true; // Hacemos que si termina la música de fondo se repita
fondo.volume = 0.2; // Establecemos el volumen

function iniciarPartida() {
  var posicionAleatoria = Math.floor(Math.random() * listaPalabras.length);

  if (posicionAleatoria % 2 != 0) {
    posicionAleatoria -= 1;
  }

  var palabraAleatoria = listaPalabras[posicionAleatoria];

  var tamanioPalabraAleatoria = palabraAleatoria.length;

  for (var i = 0; i < tamanioPalabraAleatoria; i++) {
    if (!palabraAleatoria.charAt(i).match(/[a-zñA-ZÑ]/)) {
      palabraAdivinar.push(palabraAleatoria.charAt(i));
      palabraMostrar.push(palabraAleatoria.charAt(i));
    } else {
      palabraAdivinar.push(palabraAleatoria.charAt(i).toLowerCase());
      palabraMostrar.push("_");
    }
  }

  nodoPista.textContent = listaPalabras[posicionAleatoria + 1];

  nodoIntentosOriginales.textContent = numIntentosOriginales;

  actualizarDatosPantalla();
}

function actualizarDatosPantalla() {
  nodoResultado.textContent = palabraMostrar.join(" ").toUpperCase();

  nodoIntentos.textContent = numIntentos;
}

function cogerTecladoFisico(evObject) {
  var capturado = String.fromCharCode(evObject.which);
  if (!teclasBloqueadas.includes("tecla" + capturado)) {
    comprobarTecla(capturado);
  }
}

function comprobarTecla(letraUsuario) {
  for (var i = 0; i < palabraAdivinar.length; i++) {
    if (letraUsuario == palabraAdivinar[i]) {
      acertar.load();
      acertar.play();
      palabraMostrar[i] = letraUsuario;

      document.getElementById("tecla" + letraUsuario).disabled = true;
      document.getElementById("tecla" + letraUsuario).className =
        "teclaDeshabilitada";

      teclasBloqueadas.push("tecla" + letraUsuario);
    }
  }

  if (!palabraAdivinar.includes(letraUsuario)) {
    if (numIntentos > 0) {
      fallar.load();
      fallar.play();
      numIntentos -= 1;
    }

    if (numIntentos == 5) {
      document.getElementById("imagen").src = "img/svg/cabeza.svg";
    } else if (numIntentos == 4) {
      document.getElementById("imagen").src = "img/svg/cuerpo.svg";
    } else if (numIntentos == 3) {
      document.getElementById("imagen").src = "img/svg/brazoIzq.svg";
    } else if (numIntentos == 2) {
      document.getElementById("imagen").src = "img/svg/brazoDer.svg";
    } else if (numIntentos == 1) {
      document.getElementById("imagen").src = "img/svg/piernaIzq.svg";
    } else if (numIntentos == 0) {
      document.getElementById("imagen").src = "img/svg/piernaDer.svg";
    }

    document.getElementById("tecla" + letraUsuario).disabled = true;
    document.getElementById("tecla" + letraUsuario).className =
      "teclaDeshabilitada";

    teclasBloqueadas.push("tecla" + letraUsuario);
  }

  estadoPartida();
  actualizarDatosPantalla();
}

function estadoPartida() {
  if (!palabraMostrar.includes("_")) {
    bloquearTodasTeclas();

    document.getElementById("imagen").src = "img/svg/victoria.svg";
    nodoBotonReiniciar.textContent = "Siguiente";
  }

  if (numIntentos == 0) {
    bloquearTodasTeclas();

    palabraMostrar = palabraAdivinar;

    nodoBotonReiniciar.textContent = "Siguiente";
  }
}

function bloquearTodasTeclas() {
  var teclas = document.querySelectorAll("button.tecla");

  for (var i = 0; i < teclas.length; i++) {
    teclas[i].disabled = true;
    document.getElementById(teclas[i].id).className = "teclaDeshabilitada";
    teclasBloqueadas.push(teclas[i].id);
  }
}

function reiniciarPartida() {
  palabraAdivinar = [];
  palabraMostrar = [];
  numIntentos = numIntentosOriginales;

  if (nodoBotonReiniciar.textContent == "Reiniciar")
    nodoBotonReiniciar.textContent = "Reiniciar";
  document.getElementById("imagen").src = "img/svg/horca.svg";

  for (var i = 0; i < teclasBloqueadas.length; i++) {
    document.getElementById(teclasBloqueadas[i]).disabled = false;
    document.getElementById(teclasBloqueadas[i]).className = "tecla";
  }

  teclasBloqueadas = [];

  iniciarPartida();
}

function controlMusicaFondo() {
  if (!fondo.paused) {
    fondo.pause();

    nodoAltavoz.src = "img/altavozOff.png";
  } else {
    fondo.play();

    nodoAltavoz.src = "img/altavozOn.png";
  }
}

window.onload = function () {
  document.onkeypress = cogerTecladoFisico;
};

iniciarPartida();
