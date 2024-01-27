
const $btn = document.querySelector(".btn");

$btn.addEventListener("click", jugar);

if(sessionStorage.getItem("conectado") == null)
{
    window.location.href = "menu.html";
}

function jugar()
{
    jugador1 = document.getElementsByTagName("input")[0].value;
    jugador2 = document.getElementsByTagName("input")[1].value;
    jugador3 = document.getElementsByTagName("input")[2].value;
    sessionStorage.removeItem("jugadorEliminar");
    contador = 0;

    if(jugador1 == "")
    {
        contador++;
        sessionStorage.setItem("jugadorEliminar", "jugador1");
    }

    if(jugador2 == "")
    {
        contador++;
        sessionStorage.setItem("jugadorEliminar", "jugador2");
    }

    if(jugador3 == "")
    {
        contador++;
        sessionStorage.setItem("jugadorEliminar", "jugador3");
    }

    if(contador > 1)
    {
        alert("Minimo 2 jugadores");
    }
    else
    {
        sessionStorage.setItem("jugador1", jugador1);
        sessionStorage.setItem("jugador2", jugador2);
        sessionStorage.setItem("jugador3", jugador3);

        window.location.href = "index.html";
    }
}