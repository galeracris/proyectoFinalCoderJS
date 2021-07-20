const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const detalle = document.getElementById('precioGralHijo')
const templateCard = document.getElementById('template-card').content //.content para acceder a los elementos.
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {} //variable vacia para luego ser modificada.

//Capturar datos del JSON y parsearlos.
document.addEventListener('DOMContentLoaded', () => {
    fetchData() //funcion capturar los datos
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e) //El (e) captura el elemento que se quiere modificar. 
})

items.addEventListener('click', e => {
    btnAccion(e)
})



// Leemos info del JSON
const fetchData = async () => {
    try {
        const res = await fetch(window.location.href  + 'api.json') //peticion de acceso a los datos
        const data = await res.json() //guardo los datos del json
        // console.log(data)
        pintarCards(data)
    } catch (error) { //si falla el fetch, el catch muestra el error que viene del backend.
        console.log(error)
    }
}

//Se utiliza Foreach por estar recorriendo un json para traer los datos.
const pintarCards = (data) => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id // se vincula el button con el id 

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() //evita que se hereden los eventos del contenedor padre 
}

const setCarrito = objeto => {
    const producto = { // creacion del producto
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) { // siel producto con ese id existe se aumente en 1
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    } //lo llevo a la variable carrito que esta vacia - ... =>igual o una copia de..... producto, en este caso.
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.suma').dataset.id = producto.id
        templateCarrito.querySelector('.resta').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito)) //lo guardo en localstorage

}


const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }

    const ncantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    
    const nprecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = ncantidad
    templateFooter.querySelector('span').textContent = nprecio


    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        borrarDetalle()
    })

    
    const verDetalle = detalle.innerText = "$" + nprecio;
    
    const borrarDetalle = () => {
        let inicioDetalle = detalle.innerText = "$0";
        localStorage.clear()
    }
}

            //ACCIONES DE LOS BOTONES

const btnAccion = e => {
    
    // Boton - Accion de aumentar
    if (e.target.classList.contains('suma')) {
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()

    }

    // Boton - Accion restar
    if (e.target.classList.contains('resta')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()

    }

    e.stopPropagation()
}

// jquery animacion //

$("#titulo").fadeIn(3000).slideDown("slow").fadeOut(3000).slideUp("slow").fadeIn(3000);


// selectores

$("#welcome").prepend(`<form id="form">
                       <input type="text", placeholder="Ingrese su nombre">
                       <input type="number", placeholder="Ingrese su edad">
                       <input type="submit" style="background-color: gray";>
                   </form>`);

$("#form").submit(function (e) {
    e.preventDefault();
    let ingresos = $(e.target).children();
    console.log(ingresos[0].value);
    console.log(ingresos[1].value);
});

// AJAX - GET

const URLGET = "./metodoGET.json"

$("#latas").prepend('<button id="btn1" onclick="myFunction()" style="margin: 5px; border-radius: 5px; background-color: #fff; box-shadow: 2px 0px 2px 0px;">Mira las características de nuestras Cervezas</button>');

$("#btn1").click(() => {
    $.get(URLGET, function (respuesta, estado) {
        if (estado === "success") {
            let misDatos = respuesta;
            for (const dato of misDatos) {
                $("#latas").prepend(`<div style="border: 1px solid #1E679A; border-radius: 5px">
                                   <h4 "font-weight: bold>${dato.title}</h4>
                                   <p style="color:#072e06"> ${dato.body}</p>
                                  </div>`);
            }
        }
    });
});

// $("#btn1").click(() => {
//     $("#latas").toggle("slow");
// });

    // function myFunction() {
    //     let x = document.getElementById("#latas");
    //     if (x.style.display === "none") {
    //       x.style.display = "block";
    //     } else {
    //       x.style.display = "none";
    //     }
    //   }

// Animacion CARDS
const element = document.querySelector('#cards');
element.classList.add('animate__animated', 'animate__pulse');
element.style.setProperty('--animate-duration', '2s');