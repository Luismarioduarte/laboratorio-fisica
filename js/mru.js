const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 0;
let velocidad = 50;
let tiempo = 0;

let animacion;

function iniciar(){

velocidad = document.getElementById("velocidad").value;
x = document.getElementById("posicion").value;

tiempo = 0;

animacion = requestAnimationFrame(actualizar);

}

function reiniciar(){

cancelAnimationFrame(animacion);

ctx.clearRect(0,0,canvas.width,canvas.height);

}

function actualizar(){

ctx.clearRect(0,0,canvas.width,canvas.height);

tiempo += 0.016;

x = Number(x) + velocidad*0.016;

ctx.beginPath();
ctx.arc(x,100,15,0,Math.PI*2);
ctx.fillStyle="red";
ctx.fill();

ctx.font="16px Arial";
ctx.fillStyle="black";
ctx.fillText("Tiempo: "+tiempo.toFixed(2)+" s",20,20);

animacion = requestAnimationFrame(actualizar);

}
