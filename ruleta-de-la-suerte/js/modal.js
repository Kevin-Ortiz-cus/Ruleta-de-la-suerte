
const $btnClasificacion = document.querySelector("#btn-clasificacion");
const $btnAyuda = document.querySelector("#btn-ayuda");
const $btnOpciones = document.querySelector("#btn-opciones");
const $modalClasificacion = document.querySelector(".modal.clasificacion");
const $modalAyuda = document.querySelector(".modal.ayuda");
const $modalOpciones = document.querySelector(".modal.opciones");

document.getElementById("aplicarVolumen").onclick = aplicarVolumen;

if(sessionStorage.getItem("conectado") == null)
{
    sessionStorage.setItem("conectado", true);
}

if(localStorage.getItem("ranking") == null)
{
    document.getElementById("texto-clasificacion").style.visibility = "visible";
    localStorage.setItem("ranking", "");
}
else
{
    document.getElementById("contenedor-clasificacion").removeChild(document.getElementById("texto-clasificacion"));

    ul = document.getElementById("ranking");

    ranking = localStorage.getItem("ranking");
    arrayRanking = ranking.split("-");
    nombres = [];
    puntos = [];

    for (let i = 0; i < arrayRanking.length - 1; i++) 
    {
        if(i % 2 != 0)
        {
            puntos.push(Number(arrayRanking[i]));
        }
        else
        {
            nombres.push(arrayRanking[i]);
        }
        
    }

    auxPuntos = 0;
    auxJugadores = "";
	
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

    posiciones = 0;

    (nombres.length > 10) ? posiciones = 10 : posiciones = nombres.length;
   
    for (let i = 0; i < posiciones; i++) 
    {
        li = document.createElement("li");
        li.textContent = nombres[i] + ": " + puntos[i];

        ul.appendChild(li);
        
    }
}


document.addEventListener("click", (e) => {
    if(e.target === $btnClasificacion){
        $modalClasificacion.classList.add("modal--show");
    }

    if(e.target === $btnAyuda){
        $modalAyuda.classList.add("modal--show");
    }

    if(e.target === $btnOpciones){
        $modalOpciones.classList.add("modal--show");
    }

    if(e.target.matches(".modal__close")){
        e.target.parentElement.parentElement.parentElement.classList.remove("modal--show");
    }
});

function aplicarVolumen()
{
    volumenSonido = document.getElementById("volumenSonido").value;
    localStorage.setItem("volumenSonido", volumenSonido);


}



