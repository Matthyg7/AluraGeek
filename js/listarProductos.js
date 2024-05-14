import { api } from "./api.js";

// Elementos del DOM
const contenedorProductos = document.querySelector("[data-card]");
const noProductsMessage = document.querySelector(".no-products-message");

// Función para crear una tarjeta de producto
function crearCard(imagen, nombre, precio, id) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card"; // Quitamos el punto inicial
  tarjeta.innerHTML = `
    <img src="${imagen}" alt="Producto" />
    <div class="card-container--info">
      <p>${nombre}</p>
      <div class="card-container--value">
        <p>$ ${precio}</p>
        <img src="/imagenes/papelera.png" alt="Eliminar Producto" class="eliminar-icon" />
        <p data-id="${id}">${id}</p>
      </div>
    </div>`;
  console.log(tarjeta);
  console.log(`el id es ${id}`);
  return tarjeta;
}

// Función asíncrona para listar los productos
async function listarProductos() {
  try {
    // Obtener la lista de productos desde el servidor
    const listaProd = await api.listarProductos();
    
    // Limpiar y reiniciar el localStorage si no hay productos en la lista
    if (listaProd.length === 0) {
      localStorage.clear();
    }

    // Iterar sobre la lista de productos para crear y mostrar las tarjetas
    listaProd.forEach((tarjeta) => {
      const card = crearCard(tarjeta.imagen, tarjeta.nombre, tarjeta.precio, tarjeta.id);
      contenedorProductos.appendChild(card);

      // Obtener el elemento de la papelera dentro de la tarjeta de producto
      const eliminarIcono = card.querySelector(".eliminar-icon");

      // Agregar evento de clic al icono de papelera para eliminar el producto
      eliminarIcono.addEventListener("click", async () => {
        try {
          await api.eliminarProducto(tarjeta.id); // Llamar a la función eliminarProducto del API
          card.remove(); // Eliminar la tarjeta de producto del DOM
          console.log("Producto eliminado exitosamente");
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          // Manejar el error, por ejemplo, mostrar un mensaje al usuario
        }
      });
    });

    // Llamamos a la función para actualizar el mensaje después de agregar productos
    actualizarMensajeProductos(listaProd);
  } catch (error) {
    console.error("Error al listar los productos:", error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
  }
}

// Función para actualizar el mensaje si no hay productos
function actualizarMensajeProductos(productos) {
  console.log("Número de productos:", productos.length);
  if (productos.length === 0) {
    noProductsMessage.style.display = "block"; // Mostrar el mensaje
  } else {
    noProductsMessage.style.display = "none"; // Ocultar el mensaje
  }
}

// Agregar event listener a los botones de eliminar
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("eliminar-ico")) {
    event.preventDefault(); // Evitar la recarga de la página
    const id = event.target.dataset.id;
    const eliminado = await eliminarProducto(id);
    if (eliminado) {
      // Eliminar el elemento del DOM
      event.target.closest(".card").remove();
      // Actualizar el mensaje de número de productos
      const numeroProductos = document.querySelectorAll('.card').length;
      console.log('Número de productos actualizado: ', numeroProductos);
    }
  }
});

// Llamamos a la función para listar los productos al cargar la página
listarProductos();