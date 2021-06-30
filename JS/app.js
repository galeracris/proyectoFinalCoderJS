const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content //.content para acceder a los elementos.
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {} //variable vacia para luego ser modificada, segun la compra que se haga.

//Capturar datos del JSON y parsearlos.
document.addEventListener('DOMContentLoaded', () => {
    fetchData() //funcion capturar los datos
    if(localStorage.getItem('carrito')){
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
    try{
        const res = await fetch('/api.json') //peticion de acceso a los datos
        const data = await res.json() //guardo los datos del json
        // console.log(data)
        pintarCards(data)
    }catch (error){             //si falla el fetch, el catch muestra el error que viene del backend.
        console.log(error)
    }
}

//Se utiliza Foreach por estar recorriendo un json para traer los datos.
const pintarCards = (data) => {
    // console.log(data)
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
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() //evita que se hereden los eventos del contenedor padre 
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = { // creacion del producto
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)){ // siel producto con ese id existe se aumente en 1
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto} //lo llevo a la variable carrito que esta vacia - ...igual o una copia de producto, en este caso.
    pintarCarrito()
}

const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
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
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }

    const ncantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    // console.log(ncantidad)
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

    })

    $("#precioGral").append(templateFooter.querySelector('span').textContent = nprecio);
} 






//ACCIONES DE LOS BOTONES

const btnAccion = e => {
    // console.log(e.target)
    // Boton - Accion de aumentar
    if(e.target.classList.contains('btn-info')){
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()

    }

    // Boton - Accion restar
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()

    }

    e.stopPropagation()
}