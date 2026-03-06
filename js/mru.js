const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let posicion = 0;
let velocidad = 60;
let tiempo = 0;

let animacion = null;
let ejecutando = false;

function iniciar(){

velocidad = Number(document.getElementById("velocidad").value);
posicion = Number(document.getElementById("posicion").value);

ejecutando = true;

animar();

}

function pausar(){

ejecutando = false;

}

function reiniciar(){

ejecutando = false;

posicion = Number(document.getElementById("posicion").value);
tiempo = 0;

dibujar();

}

function animar(){

if(!ejecutando) return;

actualizar();

requestAnimationFrame(animar);

}

function actualizar(){

let dt = 0.016;

tiempo += dt;

posicion += velocidad * dt;

dibujar();

}

function dibujar(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.beginPath();
ctx.moveTo(0,120);
ctx.lineTo(canvas.width,120);
ctx.stroke();

ctx.beginPath();
ctx.arc(posicion,120,15,0,Math.PI*2);
ctx.fillStyle="red";
ctx.fill();

ctx.font="16px Arial";
ctx.fillStyle="black";
ctx.fillText("Tiempo: "+tiempo.toFixed(2)+" s",20,30);
ctx.fillText("Velocidad: "+velocidad+" px/s",20,50);

}

dibujar();
