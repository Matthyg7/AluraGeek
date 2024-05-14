import { api } from "./api.js";

const formulario = document.querySelector("[data-formulario]");

// Función para validar el formato del precio
function validarPrecio(precio) {
  // Expresión regular para validar el formato del precio
  const precioRegex = /^\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?$/;
  return precioRegex.test(precio);
}

// Función para validar la URL de la imagen
function validarURL(url) {
  // Expresión regular para validar la URL de la imagen
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

// Función para realizar todas las validaciones del formulario
function validarFormulario(nombre, precio, imagen) {
  // Verificar que todos los campos estén completos
  if (!nombre || !precio || !imagen) {
    alert("Por favor, completa todos los campos.");
    return false;
  }

  // Validar el formato del precio
  if (!validarPrecio(precio)) {
    document.getElementById("mensaje-precio").innerText = "El precio ingresado no es válido, por favor utilice el punto para separar.";
    return false;
  }

  // Validar la URL de la imagen
  if (!validarURL(imagen)) {
    document.getElementById("mensaje-imagen").innerText = "La URL de la imagen no es válida.";
    return false;
  }

  return true;
}

// Función para obtener el siguiente ID único basado en el contador y el localStorage
function obtenerSiguienteId() {
  let contador = 1;
  while (localStorage.getItem(`Producto-${contador}`)) {
    contador++;
  }
  return contador;
}

// Función para crear un nuevo producto
async function crearProducto(evento) {
  evento.preventDefault();

  const nombre = document.querySelector("[data-nombre]").value;
  const precio = document.querySelector("[data-precio]").value;
  const imagen = document.querySelector("[data-imagen]").value;

  // Verificar que el nombre tenga al menos 3 caracteres
  if (nombre.length < 3) {
    document.getElementById("mensaje-nombre").innerText = "El nombre debe contener al menos 3 caracteres.";
    return;
  }

  // Validar el formulario antes de enviar los datos
  if (validarFormulario(nombre, precio, imagen)) {
    // Generar el ID único del producto
    const id = `Producto-${obtenerSiguienteId()}`;

    console.log("Nuevo producto ID:", id);

    // Agregar el producto al localStorage
    localStorage.setItem(
      id,
      JSON.stringify({
        nombre: nombre,
        precio: precio,
        imagen: imagen,
      })
    );

    // Enviar los datos del producto al servidor
    await api.agregarProducto(imagen, nombre, precio, id);
  }
}

// Escuchar el evento de envío del formulario y llamar a la función para crear un producto
formulario.addEventListener("submit", (evento) => crearProducto(evento));
