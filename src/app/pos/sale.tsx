"use client";
import { useState } from "react";
import { menuData } from "@/app/data/menu"; // Importa el array menuData

interface Producto {
  nombre?: string;
  precio?: number | string;
  descripcion?: string;
  cantidad?: number;
}

interface Venta {
  productos: Producto[];
  total: number;
}

const getInitialVenta = (): Venta => ({
  productos: [],
  total: 0,
});

export default function SalesPage() {
  const [venta, setVenta] = useState<Venta>(getInitialVenta());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResumenModal, setShowResumenModal] = useState<boolean>(false);

  const agregarProducto = (producto: Producto) => {
    if (!producto.nombre || !producto.precio) return;

    const updatedVenta: Venta = {
      productos: [...venta.productos],
      total: venta.total,
    };

    const productoExistente = updatedVenta.productos.find(
      (p) => p.nombre === producto.nombre
    );

    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad ?? 0) + 1;
    } else {
      updatedVenta.productos.push({ ...producto, cantidad: 1 });
    }

    updatedVenta.total += Number(producto.precio);
    setVenta(updatedVenta);
  };

  const eliminarProducto = (producto: Producto) => {
    if (!producto.nombre || !producto.precio) return;

    const updatedVenta: Venta = {
      productos: [...venta.productos],
      total: venta.total,
    };

    const productoExistente = updatedVenta.productos.find(
      (p) => p.nombre === producto.nombre
    );

    if (productoExistente) {
      if (productoExistente.cantidad! > 1) {
        productoExistente.cantidad! -= 1;
      } else {
        updatedVenta.productos = updatedVenta.productos.filter(
          (p) => p.nombre !== producto.nombre
        );
      }

      updatedVenta.total -= Number(producto.precio);
    }

    setVenta(updatedVenta);
  };

  const actualizarCantidadProducto = (nombre: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;

    const updatedVenta: Venta = {
      productos: venta.productos.map((producto) =>
        producto.nombre === nombre
          ? { ...producto, cantidad: nuevaCantidad }
          : producto
      ),
      total: 0,
    };

    updatedVenta.total = updatedVenta.productos.reduce(
      (acc, producto) =>
        acc + (producto.precio ? Number(producto.precio) : 0) * producto.cantidad!,
      0
    );

    setVenta(updatedVenta);
  };

  const actualizarNombreProducto = (nombreActual: string, nuevoNombre: string) => {
    setVenta((prevVenta) => ({
      ...prevVenta,
      productos: prevVenta.productos.map((producto) =>
        producto.nombre === nombreActual
          ? { ...producto, nombre: nuevoNombre }
          : producto
      ),
    }));
  };

  const confirmarCompra = () => {
    setShowResumenModal(true);
  };

  const cerrarModal = () => {
    setShowResumenModal(false);
  };

  const finalizarCompra = () => {
    alert("¡Compra confirmada!");
    setVenta(getInitialVenta());
    setSearchTerm(""); // Reinicia la búsqueda
    setShowResumenModal(false);
  };

  const buscarProductos = () => {
    const term = searchTerm.trim().toLowerCase(); // Limpia el término de búsqueda
    if (!term) return []; // Si no hay término de búsqueda, devuelve un array vacío

    return menuData.flatMap((restaurante) =>
      restaurante.categorias.flatMap((categoria) =>
        categoria.productos.filter(
          (producto) =>
            producto.nombre?.toLowerCase().includes(term) || // Busca en el nombre
            producto.descripcion?.toLowerCase().includes(term) // Busca en la descripción
        )
      )
    );
  };

  return (
    <>
      <main className="px-8">
        {/* Búsqueda de productos */}
        <div className="mb-6">
          <span className="font-semibold text-3xl">Ventas</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
            className="mt-5 w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Productos disponibles */}
        {searchTerm.trim() !== "" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600">
              Productos Disponibles
            </h2>
            {buscarProductos().length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3 text-left">Producto</th>
                      <th className="px-6 py-3 text-right">Precio</th>
                      <th className="px-6 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buscarProductos().map((producto, index) => (
                      <tr
                        key={`${producto.nombre}-${index}`} // Combina el nombre con el índice para garantizar unicidad
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{producto.nombre}</td>
                        <td className="px-6 py-4 text-right">
                          ${Number(producto.precio).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => agregarProducto(producto)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                          >
                            Agregar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No se encontraron productos.</p>
            )}
          </div>
        )}

        {/* Venta actual */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600">Venta Actual</h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Producto</th>
                  <th className="px-6 py-3 text-right">Precio</th>
                  <th className="px-6 py-3 text-center">Cantidad</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((producto) => (
                  <tr key={producto.nombre} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span>
                        {producto.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      ${Number(producto.precio).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min={1}
                        value={producto.cantidad}
                        onChange={(e) =>
                          actualizarCantidadProducto(
                            producto.nombre!,
                            Number(e.target.value)
                          )
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => eliminarProducto(producto)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total + Botón Confirmar */}
          <div className="mt-4 text-right space-y-4">
            <span className="text-xl font-semibold text-gray-800 block">
              Total: ${venta.total.toLocaleString()}
            </span>

            {venta.productos.length > 0 && (
              <button
                onClick={confirmarCompra}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Confirmar Compra
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Modal */}
      {showResumenModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Resumen de la Compra
            </h3>
            <ul className="mb-4 space-y-2">
              {venta.productos.map((producto) => (
                <li key={producto.nombre} className="flex justify-between">
                  <span>
                    {producto.nombre} × {producto.cantidad}
                  </span>
                  <span>
                    $
                    {(
                      Number(producto.precio) * producto.cantidad!
                    ).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="text-right font-semibold text-lg mb-4">
              Total: ${venta.total.toLocaleString()}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={finalizarCompra}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
