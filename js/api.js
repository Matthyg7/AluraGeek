// Importar la función fetch para hacer solicitudes HTTP
async function listarProductos() {
  // Realizar una solicitud GET para obtener la lista de productos desde el servidor
  const productos = await fetch("http://localhost:3008/productos", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  // Convertir la respuesta a formato JSON
  const productoCreado = await productos.json();

  // Retornar la lista de productos
  return productoCreado;
}

// Función para agregar un nuevo producto al servidor
async function agregarProducto(imagen, nombre, precio, id) {
  // Verificar si el ID del producto ya tiene el prefijo "Producto-"
  const nuevoId = id.toString().startsWith("Producto-") ? id : `Producto-${id}`;

  // Realizar una solicitud POST para agregar el nuevo producto al servidor
  const productos = await fetch("http://localhost:3008/productos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    // Convertir los datos del producto a formato JSON y enviarlos en el cuerpo de la solicitud
    body: JSON.stringify({
      imagen: imagen,
      nombre: nombre,
      precio: precio,
      id: nuevoId,
    }),
  });

  // Convertir la respuesta a formato JSON
  const productoCreado = await productos.json();

  // Retornar el producto creado
  return productoCreado;
}

// Función para eliminar un producto del servidor
async function eliminarProducto(id) {

  // Construir la URL del producto a eliminar
  const url = `http://localhost:3008/productos/${id}`;

  // Realizar una solicitud DELETE para eliminar el producto del servidor
  const productos = await fetch(url, {
    method: "DELETE",
  });

  // Verificar si la eliminación fue exitosa
  if (productos.ok) {
    console.log(`Producto con ID ${id} eliminado exitosamente.`);
    return true; // Indicar que la eliminación fue exitosa
  } else {
    console.error(`Error al eliminar el producto con ID ${id}.`);
    return false; // Indicar que hubo un error en la eliminación
  }
}

// Exportar las funciones de la API
export const api = {
  listarProductos,
  agregarProducto,
  eliminarProducto
};
