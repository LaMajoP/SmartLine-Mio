"use client";
import { useState } from "react";
import { menuData as initialMenuData } from "@/app/data/menu"; // Importa el arreglo menuData

export default function Inventario() {
  const [menuData, setMenuData] = useState(initialMenuData); // Maneja menuData como estado
  const [busqueda, setBusqueda] = useState("");
  const [formProducto, setFormProducto] = useState({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "" });
  const [formCategoria, setFormCategoria] = useState({ nombre: "", restaurante: "" });
  const [editando, setEditando] = useState(false);

  const filtrarMenu = () => {
    const term = busqueda.trim().toLowerCase(); // Limpia y convierte el término de búsqueda a minúsculas
    if (!term) return menuData; // Si no hay término de búsqueda, devuelve todo el menú

    return menuData
      .map((restaurante) => {
        const categoriasFiltradas = restaurante.categorias
          .map((categoria) => {
            const productosFiltrados = categoria.productos.filter(
              (producto) =>
                producto.nombre?.toLowerCase().includes(term) ||
                producto.descripcion?.toLowerCase().includes(term)
            );

            if (productosFiltrados.length > 0 || categoria.nombre.toLowerCase().includes(term)) {
              return { ...categoria, productos: productosFiltrados };
            }
            return null;
          })
          .filter((categoria) => categoria !== null);

        if (categoriasFiltradas.length > 0 || restaurante.nombre.toLowerCase().includes(term)) {
          return { ...restaurante, categorias: categoriasFiltradas };
        }
        return null;
      })
      .filter((restaurante) => restaurante !== null);
  };

  const manejarEditar = (producto: any, categoria: string, restaurante: string) => {
    setFormProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria,
      restaurante,
    });
    setEditando(true);
  };

  const manejarGuardarCambios = () => {
    const { nombre, descripcion, precio, categoria, restaurante } = formProducto;

    const nuevoMenuData = menuData.map((rest) => {
      if (rest.nombre === restaurante) {
        return {
          ...rest,
          categorias: rest.categorias.map((cat) => {
            if (cat.nombre === categoria) {
              return {
                ...cat,
                productos: cat.productos.map((prod) =>
                  prod.nombre === nombre ? { ...prod, descripcion, precio } : prod
                ),
              };
            }
            return cat;
          }),
        };
      }
      return rest;
    });

    setMenuData(nuevoMenuData);
    setEditando(false);
  };

  const manejarCancelarEdicion = () => {
    setFormProducto({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "" });
    setEditando(false);
  };

  const manejarAgregarCategoria = () => {
    const { nombre, restaurante } = formCategoria;

    const nuevoMenuData = menuData.map((rest) => {
      if (rest.nombre === restaurante) {
        return {
          ...rest,
          categorias: [...rest.categorias, { nombre, productos: [] }],
        };
      }
      return rest;
    });

    setMenuData(nuevoMenuData);
    setFormCategoria({ nombre: "", restaurante: "" });
  };

  const manejarAgregarProducto = () => {
    const { nombre, descripcion, precio, categoria, restaurante } = formProducto;

    const nuevoMenuData = menuData.map((rest) => {
      if (rest.nombre === restaurante) {
        return {
          ...rest,
          categorias: rest.categorias.map((cat) => {
            if (cat.nombre === categoria) {
              return {
                ...cat,
                productos: [...cat.productos, { nombre, descripcion, precio }],
              };
            }
            return cat;
          }),
        };
      }
      return rest;
    });

    setMenuData(nuevoMenuData);
    setFormProducto({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "" });
  };

  const manejarEliminarProducto = (nombreProducto?: string, categoria?: string, restaurante?: string) => {
    if (!nombreProducto || !categoria || !restaurante) {
      console.error("Datos incompletos para eliminar el producto");
      return;
    }
  
    const nuevoMenuData = menuData.map((rest) => {
      if (rest.nombre === restaurante) {
        return {
          ...rest,
          categorias: rest.categorias.map((cat) => {
            if (cat.nombre === categoria) {
              return {
                ...cat,
                productos: cat.productos.filter((prod) => prod.nombre !== nombreProducto), // Filtra el producto a eliminar
              };
            }
            return cat;
          }),
        };
      }
      return rest;
    });
  
    setMenuData(nuevoMenuData); // Actualiza el estado
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventario</h1>

      {/* Campo de búsqueda */}
      <input
        placeholder="Buscar producto, categoría o restaurante..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Formulario para agregar categorías */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Agregar Categoría</h2>
        <input
          placeholder="Nombre de la categoría"
          value={formCategoria.nombre}
          onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <input
          placeholder="Restaurante"
          value={formCategoria.restaurante}
          onChange={(e) => setFormCategoria({ ...formCategoria, restaurante: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <button
          onClick={manejarAgregarCategoria}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Categoría
        </button>
      </div>

      {/* Formulario para agregar productos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Agregar Producto</h2>
        <input
          placeholder="Nombre del producto"
          value={formProducto.nombre}
          onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <input
          placeholder="Descripción"
          value={formProducto.descripcion}
          onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={formProducto.precio}
          onChange={(e) => setFormProducto({ ...formProducto, precio: Number(e.target.value) })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <input
          placeholder="Categoría"
          value={formProducto.categoria}
          onChange={(e) => setFormProducto({ ...formProducto, categoria: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <input
          placeholder="Restaurante"
          value={formProducto.restaurante}
          onChange={(e) => setFormProducto({ ...formProducto, restaurante: e.target.value })}
          className="block mb-2 w-full border p-2 rounded"
        />
        <button
          onClick={manejarAgregarProducto}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Agregar Producto
        </button>
      </div>

      {/* Listado de restaurantes y categorías */}
      <div className="space-y-4">
        {filtrarMenu().map((restaurante) => (
          <div key={restaurante.nombre}>
            <h2 className="text-xl font-bold text-blue-700">{restaurante.nombre}</h2>
            {restaurante.categorias.map((categoria, index) => (
              <div key={`${categoria.nombre}-${index}`} className="border p-4 rounded shadow mb-3">
                <h3 className="font-semibold text-lg mb-2">{categoria.nombre || "(Sin nombre)"}</h3>
                <ul className="space-y-1">
                  {categoria.productos.map((producto, index) => (
                    <li
                      key={`${producto.nombre}-${index}`}
                      className="flex justify-between"
                    >
                      <span>
                        {producto.nombre} - ${producto.precio} - {producto.descripcion}
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => manejarEditar(producto, categoria.nombre, restaurante.nombre)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600 transition duration-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            producto.nombre &&
                            categoria.nombre &&
                            restaurante.nombre &&
                            manejarEliminarProducto(producto.nombre, categoria.nombre, restaurante.nombre)
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition duration-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal para agregar/editar productos */}
      {editando && (
        <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-semibold text-lg mb-4">Editar Producto</h2>
            <input
              placeholder="Nombre"
              value={formProducto.nombre}
              onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
              className="block mb-2 w-full border p-2 rounded"
              disabled
            />
            <input
              placeholder="Descripción"
              value={formProducto.descripcion}
              onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
              className="block mb-2 w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Precio"
              value={formProducto.precio}
              onChange={(e) => setFormProducto({ ...formProducto, precio: Number(e.target.value) })}
              className="block mb-2 w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={manejarCancelarEdicion}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={manejarGuardarCambios}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
