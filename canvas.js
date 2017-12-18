/**
 * Created by thales augusto on 14/12/2017.
 */


function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;


canvas = document.getElementById('torreGame');
var movimentos = 0;
var cores = ['blue', 'red', 'green', 'orange', 'purple', 'yellow', 'brown', 'silver', 'gold', 'bronze', 'gray'];
var level = -1;
var redraw = false;
var arrastado = null;
var clicando = null;
clicandoIndex = -1;
var xpos, ypos, i = 0;
torre = [];

timeProm = null;
gamesecond = 0;
gameminute = 0;

initCounter = function(){
    timeProm = setTimeout(function() {
        gamesecond = (1 + gamesecond)%60;
        if(gamesecond == 0){
            gameminute = gameminute + 1;
        }
        document.getElementById("time").innerHTML = gameminute + ':' + gamesecond;
        initCounter();
    }, 1000);
}

function initGame(){
    console.log("oi");
    initCounter();
    document.getElementById("moves").innerHTML = movimentos;
    document.getElementById("time").innerHTML = gameminute + ':' + gamesecond;

    if(canvas.getContext){

        var chao = canvas.getContext('2d');
        chao.clearRect(0, 0, canvas.width, canvas.height);
        for(i = 0; i < 3; i++){
            torre[i] = { ctx: canvas.getContext('2d'), x: 100 + (i * 300), y: 100, discos: [] };
            torre[i].ctx.fillStyle = "black";
            torre[i].ctx.fillRect(torre[i].x, torre[i].y, 15, 200);
        }
        chao.fillRect(0, 300, 845, 15);
    }

    var discos = [];

    for(i = 0; i < level + 2; i++){
        discos[i] = { color: cores[i], ctx: canvas.getContext('2d'), width: 180 - (i * 20), x: torre[0].x - ((180 - (i * 20)) / 2) + 7.5, y:   285 - (i * 15)};

        discos[i].ctx.fillStyle = discos[i].color;
        discos[i].ctx.fillRect(discos[i].x, discos[i].y, discos[i].width, 15);
        torre[0].discos.push(discos[i]);
    }
}


function draw(){
    coords = canvas.relMouseCoords(event);
    x = coords.x;
    y = coords.y;
    
    if(clicando != null || redraw){
        redraw = false;
        var chao = canvas.getContext('2d');
        chao.clearRect(0, 0, canvas.width, canvas.height);

        var c = canvas.getContext('2d');
        c.fillStyle = "black";
        c.fillRect(0, 300, 845, 15);

        torre.forEach(function(elemento, i){
            c.fillStyle = "black";
            torre[i].ctx.fillRect(torre[i].x, torre[i].y, 15, 200);

            torre[i].discos.forEach(function(disco,j){
                disco.ctx.fillStyle = disco.color;
                disco.ctx.fillRect(disco.x, disco.y, disco.width, 15);
            });

        });
        if(clicando) {
            clicando.ctx.fillStyle = clicando.color;
            clicando.ctx.fillRect(x, y, clicando.width, 15);
        }

        document.getElementById("moves").innerHTML = movimentos;
        if(torre[2].discos.length == level+2){
            alert("PARABENS VOCÊ GANHOU! VAMOS PARA O PROXIMO LEVEL!");
            level = level+1;
            movimentos = 0;
            initGame();

        }
    }
}


function jogar(event){
    coords = canvas.relMouseCoords(event);
    x = coords.x;
    y = coords.y;

    if(clicando == null){
        torre.forEach(function(elemento, index){
            if(elemento.discos.length){
                topo = elemento.discos[elemento.discos.length - 1];
                if((x >= topo.x) && (x <= topo.x + topo.width)){
                    if((y >= topo.y) && (y <= topo.y + 15)){
                        clicando = elemento.discos.pop();
                        clicandoIndex = index;
                    }
                }
            }
        });
    }else{
        console.log(x + ' - ' + y);
        jogou = false;
        torre.forEach(function(elemento, index){
            if(clicando) {
                if ((x >= elemento.x - clicando.width) && (x <= (elemento.x + clicando.width + 15))) {
                    movimentos = movimentos +1;
                    if (elemento.discos.length > 0)
                        topo = elemento.discos[elemento.discos.length - 1];

                    if (elemento.discos.length == 0 || clicando.width < topo.width) {
                        clicando.x = torre[index].x - (clicando.width / 2) + 7.5;
                        clicando.y = 285 - (elemento.discos.length * 15);
                        elemento.discos.push(clicando);
                        clicandoIndex = -1;
                        clicando = null;
                        redraw = true;
                        jogou = true;
                    }
                }
            }

        });
        if(!jogou){
            torre[clicandoIndex].discos.push(clicando);
            clicandoIndex = -1;
            clicando = null;
            redraw = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', function (){
    initGame();
    canvas.addEventListener('mousedown', jogar, false);
    canvas.addEventListener('mouseup', jogar, false);
    canvas.addEventListener('mousemove', draw, false);
}, false);

