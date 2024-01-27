
//Verficamos si ha hecho sesión en el menú, sino se le envía de vuelta al menu
if(sessionStorage.getItem("conectado") == null)
{
    window.location.href = "menu.html";
}

//Le damos los nombres a los 3 jugadores (incluso si hay un jugador que no tiene nombre)
document.getElementById("nombreJugador1").textContent = sessionStorage.getItem("jugador1");
document.getElementById("nombreJugador2").textContent = sessionStorage.getItem("jugador2");
document.getElementById("nombreJugador3").textContent = sessionStorage.getItem("jugador3");

//Si hay un jugador al que no se le ha puesto nombre se le debe de eliminar de la partida
if(sessionStorage.getItem("jugadorEliminar") != undefined)
{
    jugadorEliminar = document.getElementById(sessionStorage.getItem("jugadorEliminar"));
    padreJugadores = jugadorEliminar.parentElement;
    padreJugadores.removeChild(jugadorEliminar);
}

const $panel = document.querySelector(".frase");
let turno = 0;
var tirarRuleta = false;
var consonante = false;
var vocal = false;
var resolver = false;
var recompensa = "";
var minutos = 5;
var segundos = 0;
var audioBien = document.getElementById("audioBien");
var audioMal = document.getElementById("audioMal");
var audioVictoria = document.getElementById("audioVictoria");
var mensaje = document.getElementById("mensaje");

document.getElementById("ruleta").onclick = girarRuleta;
document.getElementById("consonante").onclick = elegirConsonante;
document.getElementById("vocal").onclick = comprarVocal;
document.getElementById("resolver").onclick = resolverPanel;

//Introducimos el sonido por defecto o el que ha introducido el usuario en el menú
if(localStorage.getItem("volumenSonido") != null)
{
    audioBien.volume = localStorage.getItem("volumenSonido") / 10;
    audioMal.volume = localStorage.getItem("volumenSonido") / 10;
    audioVictoria.volume = localStorage.getItem("volumenSonido") / 10;
}

//Iniciamos las funciones de temporizador y el de que no se pueda seleccionar nada con el ratón
evitarSeleccion( document.body );
empezarTemporizador(minutos, segundos)

//Iniciamos el panel
totalJugadores = document.getElementsByClassName("jugadores")[0].children.length;
pistas = ["El profe de autoescuela", "Cancion del verano", "¿Que hay de primero?", "No hace mucho tiempo..."];
frases = ["Y se cala venga ponemos primera y nos vamos", "Quedate que la noche sin ti duele", "Espirales de calabacin con vinagreta de sesamo", "Nadie hacia fotos a los platos de comida"];
random = Math.floor(Math.random() * (4 - 0) + 0);
pistaElegida = pistas[random];
document.querySelector(".pista").textContent = pistaElegida;
fraseElegida = frases[random].toUpperCase();
fraseSeparada = fraseElegida.split(" ");

fraseSeparada.forEach((frase) => {
    let divFrase = document.createElement("div");
        divFrase.classList.add("palabras");

        for(let i = 0; i < frase.length; i++){
            let divLetra = document.createElement("div");
            divLetra.classList.add("letras");
            divLetra.textContent = frase[i].toUpperCase();
            divFrase.appendChild(divLetra);
        }

    $panel.appendChild(divFrase);
});

//Iniciamos con un mensaje del jugador que le toca para que gire la ruleta
mensaje.textContent = "Jugador " + document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[0].textContent + " tire de la ruleta";

//Funcion para crear el temporizador 
function empezarTemporizador(minutos, segundos)
{
    //temporizador es una variable global para poder usarla en otra funcion y hacer que pare
    temporizador = setInterval(() => {
        if(segundos == 0)
        {
            segundos = 59;
            minutos--;
        }
        else
        {
            segundos--;
        }

        if(segundos < 10)
        {
            segundos = "0" + segundos;
        }

        document.getElementById("tiempo").textContent = "0" + minutos + ":" + segundos;

        if(segundos == 0 && minutos == 0)
        {
            clearInterval(temporizador);
            ganarPartida();
        }

    }, 1000)
}

//Funcion para evitar que pueda pulsar con el raton en cualquier lado de la pagina menos en los botones y en la ruleta  
function evitarSeleccion( target ) 
{
    if ( typeof target.onselectstart != "undefined" ) {
        target.onselectstart = function( ) { return false; }
    }
    else if ( typeof target.style.MozUserSelect != "undefined" ) {
        target.style.MozUserSelect = "none"
    }
    else {
        target.onmousedown = function( ) { return false; }
    }
        
    target.style.cursor = "default"
}
      
//Funcion que viene de un onclick
//Cuando se pulse se verificará si hay una consonante
function elegirConsonante()
{

    //Verficamos para comprobar si ya ha girado la ruleta
    if(tirarRuleta == false)
    {
        //alert("Tiene que tirar la ruleta");
        mensaje.textContent = "Tiene que tirar la ruleta"
    }
    else
    {
        respuesta = document.getElementById("respuesta").value.toUpperCase().trim();

        //Verificamos si introduce una consonante
        if(respuesta == "A" || respuesta == "E" || respuesta == "I" || respuesta == "O" || respuesta == "U")
        {
            //alert("No se admiten vocales");
            mensaje.textContent = "No se admiten vocales";
        }
        else
        {
            //Creamos la variable letraElegir para decir que es una consonante y pasarlo como parametro en la funcion rellenarPanel
            frase = document.getElementsByClassName("frase")[0];
            var palabras = frase.children;
            letraElegir = "consonante";

            //Hacemos una pausa de 1 segundo como para dar tensión de si ha acertado o no
            setTimeout(() =>{
                //Pasamos por parametro la respuesta, todas las palabras del panel y si la letra a elegir era consonante o vocal (En este caso consonante)
                rellenarPanel(respuesta, palabras, letraElegir);
                
            }, 1000);

            document.getElementById("respuesta").value = "";
            tirarRuleta = false;
            consonante = true;
        }
    }

    
}

//Función para "pintar" el panel y sea elegiendo una vocal o consonante
function rellenarPanel(respuesta, palabras, letraElegir)
{
    //Iniciamos un contador para saber cuantas letras ha acertado
    var contLetras = 0;
    var encontrado = false;

    for (let i = 0; i < palabras.length && !encontrado; i++)
    {
        letras = palabras[i].children;
        for (let j = 0; j < letras.length && !encontrado; j++) 
        {
            //Si la letra que ha elegido está en el panel le cambiamos la clase por una que tenga una animación y cambie de color
            if(letras[j].innerHTML == respuesta)
            {
                if(letras[j].className == "letrasVolteadas")
                {
                    encontrado = true;
                }
                else
                {
                    letras[j].classList = "letrasVolteadas";
                }
                //Se suma el contador de aciertos
                contLetras++;
            }  
        }
    }

    //Si el contador es 0 es que no estaba la letra en el panel y directamente le lleva a la función de perderTurno
    //De parametro le ponemos "Pierde Turno" porque no queremos que se le quite los puntos, solo que pierda el turno
    if(contLetras == 0 || encontrado)
    {
        perderTurno("Pierde Turno");
    }
    else
    {
        //Si acierta cogemos la recompensa que le tocó en la ruleta y le multiplacamos por el numero de letras que había en el panel
        puntosJugador = Number(document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[1].textContent);
        recompensa = Number(recompensa) * contLetras;
        total = 0;

        //Si era consonante se le suma al total de los puntos, si era vocal solo se le resta 50 puntos que es lo que cuesta comprar una vocal
        if(letraElegir == "consonante")
        {
            total = puntosJugador + recompensa;
        }
        else if(letraElegir == "vocal")
        {
            total = puntosJugador - 50;
        }
        document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[1].textContent = total;

        //audio = new Audio("./sounds/good.wav");
        //Reproducimos el audio de que ha acertado
        audioBien.play();
    }

    //Verificamos si ya ha elegido consonante y ademas si ha acertado para poner este mensaje
    if(consonante == true && contLetras != 0 )
    {
        mensaje.textContent = "Elija una vocal, resuelve o tire de la ruleta";

    }
}

//Funcion que viene de un onclick para poder elegir una vocal gastando 50 puntos
function comprarVocal()
{
    //Verificamos si ha elegido consonante
    if(consonante == true)
    {
        //Verficamos si no ha elegido la vocal para que no pueda elegir dos veces una vocal en un mismo turno
        if(vocal == false)
        {
            puntosJugador = Number(document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[1].textContent);

            //Verificamos si tiene 50 puntos para poder elegir una vocal
            if(puntosJugador < 50)
            {
                //alert("No tienes 50 puntos para comprar una vocal")
                mensaje.textContent = "No tienes 50 puntos para comprar una vocal";
            }
            else
            {
                respuesta = document.getElementById("respuesta").value.toUpperCase().trim();

                //Verificamos si ha elegido una vocal
                if(respuesta != "A" && respuesta != "E" && respuesta != "I" && respuesta != "O" && respuesta != "U")
                {
                    //alert("No se admiten consonantes");
                    mensaje.textContent = "No se admiten consonantes";
                }
                else
                {
                    //Hacemos lo mismo que lo que sucedía con la consonante
                    frase = document.getElementsByClassName("frase")[0];
                    var palabras = frase.children;
                    letraElegir = "vocal";

                    setTimeout(() =>{
                        rellenarPanel(respuesta, palabras, letraElegir);
                        mensaje.textContent = "Resuelva o tire de la ruleta";
                    }, 1000);

                    document.getElementById("respuesta").value = "";
                    vocal = true;

                    
                }
            }
        }
        else
        {
            //alert("Ya has comprado una vocal");
            mensaje.textContent = "Ya has comprado una vocal. Resuelva o tire de la ruleta";
        }
        
    }
    else
    {
        //alert("Debes haber tirado la ruleta y heber elegido consonante");
        mensaje.textContent = "Debes haber tirado la ruleta y heber elegido consonante";
    }
}

//Función que viene de un onclick para resolver el panel
function resolverPanel()
{
    tirarRuleta = true
    document.getElementById("ruleta").removeEventListener("click", girarRuleta);

    respuesta = document.getElementById("respuesta").value.toUpperCase().trim();
    document.getElementById("respuesta").value = "";

    setTimeout(() => {
        
        //Verificamos si ha elegido consonante para que no pueda resolver directamente
        if(consonante == true)
        {
            //respuesta = document.getElementById("respuesta").value.toUpperCase().trim();
            
            //Verificamos si la respuesta que ha puesto en el input text es la misma frase del panel
            if(fraseElegida == respuesta)
            {
                //Si ha acertado se hace un for para directamente cambiar el class de cada letra y hacer la animacion
                frase = document.getElementsByClassName("frase")[0];
                var palabras = frase.children;
                for (let i = 0; i < palabras.length; i++)
                {
                    letras = palabras[i].children;
                    for (let j = 0; j < letras.length; j++) 
                    { 
                        letras[j].classList = "letrasVolteadas";
                        
                    }
                }
                
                //Iniciamos la funcion para que acabe la partida 
                ganarPartida();
            }
            else
            {
                //Si ha fallado directamente pierde el turno
                document.getElementById("ruleta").onclick = girarRuleta;
                perderTurno("Pierde Turno");
            }
        }
        else
        {
            //alert("Debes haber tirado la ruleta y heber elegido consonante");
            mensaje.textContent = "Debes haber tirado la ruleta y heber elegido consonante";
        }
    }, 1000)
}

//Funcion para acabar la partida
function ganarPartida()
{
    
    document.getElementById("consonante").removeEventListener("click", elegirConsonante);
    document.getElementById("vocal").removeEventListener("click", comprarVocal);
    document.getElementById("resolver").removeEventListener("click", resolverPanel);

    audioVictoria.play();

    //Paramos el temporizador
    clearInterval(temporizador);

    //Recogemos el ranking global con todos los nombres y puntos de los jugadores
    ranking = localStorage.getItem("ranking");
    nombreJugadores = document.getElementsByClassName("nombre-jugador");
    puntosJugadores = document.getElementsByClassName("puntos");

     //Inicialimos dos arrays de nombres y puntos en el que metremos solamente a los jugadores actuales de la partida para hacer un mini ranking
     nombres = [];
     puntos = [];

    //Recorremos el array que están los 3 jugadores y lo guardamos en el ranking global
    for (let i = 0; i < nombreJugadores.length; i++) 
    {
        ranking += nombreJugadores[i].textContent + "-";
        ranking += puntosJugadores[i].textContent + "-";
        puntos.push(Number(puntosJugadores[i].textContent));
        nombres.push(nombreJugadores[i].textContent);   
    }

    //Actualizamos el ranking
    localStorage.setItem("ranking", ranking);

    //Funcion para ordenar por puntos a los 2 o 3 jugadores que han jugado en la partida
    ordenarRanking(nombres, puntos);
    
}

function ordenarRanking(nombres, puntos)
{
    
	auxPuntos = 0;
    auxJugadores = "";
	
    //Ordenamos con el metodo de la burbuja
	for(var i = 0; i <  puntos.length - 1; i++)
	{
		for (var j = 0; j <  puntos.length - 1; j++)
		{
			if(puntos[j] < puntos[j + 1])
			{
				auxPuntos = puntos[j];
				puntos[j] = puntos[j + 1];
                puntos[j + 1] = auxPuntos;

                auxJugadores = nombres[j];
				nombres[j] = nombres[j + 1];
                nombres[j + 1] = auxJugadores;
			}
		}
	}

    //El array de nombres y puntos ordenados los metemos en la lista que hay en el modal
    ul = document.getElementById("ranking");

    for (let i = 0; i < nombres.length; i++) 
    {
        li = document.createElement("li");
        li.textContent = nombres[i] + ": " + puntos[i];

        ul.appendChild(li);
        
    }

    //Mostramos el modal
    setTimeout(() => {
        document.querySelector(".modal.clasificacion").classList.add("modal--show");
    }, 3500)
    

}

//En esta función es un onclick donde va a empezar a girar la ruleta 
function girarRuleta()
{
    //Comprobamos si ha tirado la ruleta anteriormente para que no tire de él dos veces en el mismo turno
    if(tirarRuleta == true)
    {
        //alert("Tienes que elegir una consonante");
        mensaje.textContent = "Tienes que elegir una consonante";
    }
    else
    {
        //Generamos un numero random que serán las vueltas que va a dar
        var numero = Math.random() * 7200;
        calcular(numero);
    }
}

function calcular(numero)
{
    //Con esta formula calculamos en que posicion de la ruleta se ha quedado para saber la recompensa
    valor = numero / 360;
    valor = (valor - parseInt(valor.toString().split(".")[0])) * 360;
    document.getElementById("ruleta").style.transform = "rotate(" + numero + "deg)";
        //Una circunferencia son 360 grados
        switch(true)
        {
            case valor > 0 && valor <= 30:
                recompensa = "Quiebra";
                break;
            case valor > 30 && valor <= 60:
                recompensa = "50";
                break;
            case valor > 60 && valor <= 90:
                recompensa = "0";
                break;
            case valor > 90 && valor <= 120:
                recompensa = "25";
                break;
            case valor > 120 && valor <= 150:
                recompensa = "Pierde Turno";
                break;
            case valor > 150 && valor <= 180:
                recompensa = "100";
                break;
            case valor > 180 && valor <= 210:
                recompensa = "Quiebra";
                break;
            case valor > 210 && valor <= 240:
                recompensa = "50";
                break;
             case valor > 240 && valor <= 270:
                recompensa = "0";
                break;
            case valor > 270 && valor <= 300:
                recompensa = "25";
                break;
            case valor > 300 && valor <= 330:
                recompensa = "Pierde Turno";
                break;
            case valor > 330 && valor <= 360:
                recompensa = "100";
                break;
            
        }

    mensaje.textContent = "Girando...";

    //Hacemos una pausa de 5 segundos para que la ruleta haga su animacion y así saber la recompensa
    setTimeout(() =>{
        saberRecompensa(recompensa)
        
    }, 5000);

    tirarRuleta = true;
    vocal = false;
    resolver = false;
}

//Esta función nos sirve para saber si ha perdido el turno o no
function saberRecompensa(recompensa)
{
    //Si no ha perdido el turno le ponemos un mensaje de que pulse el boton de consonante
    if(recompensa == "Quiebra" || recompensa == "Pierde Turno")
    {
        perderTurno(recompensa);
    }
    else
    {
        //alert("Elige una consonante por " + recompensa + " puntos");
        mensaje.textContent = "Elige una consonante por " + recompensa + " puntos";
    }
}

//Esa funcion sirve para saber si ha caido en quiebra o en pierde turno es decir para quitarle puntos o no y así pasar turno
function perderTurno(recompensa)
{
    if(recompensa == "Quiebra")
    {
        document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[1].textContent = 0;
    }

    if(turno == totalJugadores - 1)
    {
        document.getElementsByClassName("jugador")[0].style.background = "rgba(140, 0, 255)";
    }
    else
    {
        document.getElementsByClassName("jugador")[turno + 1].style.background = "rgba(140, 0, 255)";
    }
   
    document.getElementsByClassName("jugador")[turno].style.background = "rgba(38, 0, 88, 0.2)";

    //audio = new Audio("./sounds/wrong.wav");
    audioMal.play();

    //Le devolvemos el turno para poder usar la variable turno en otras funciones
    turno = pasarTurnoJugador(turno);
    tirarRuleta = false;
    consonante = false;
    vocal = false;
    resolver = false;

}

//Como tenemos un array de jugadores con los div de los jugadores tenemos que saber la posicion del jugador que está jugando
function pasarTurnoJugador(turno)
{
    if(turno == totalJugadores - 1)
    {
        turno = 0;
    }
    else
    {
        turno++;
    }

    
    mensaje.textContent = "Jugador " + document.getElementsByClassName("jugador")[turno].getElementsByTagName("div")[0].textContent + " tire de la ruleta";


    return turno;
    
}