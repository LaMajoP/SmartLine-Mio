"use client";
import { useState, useEffect } from "react";

interface Producto {
  nombre?: string;
  precio?: number | string;
  descripcion?: string;
  cantidad?: number;
  stock?: number; // Agregado para manejar el stock
}

interface Venta {
  productos: Producto[];
  total: number;
}

interface Categoria {
  nombre: string;
  productos: Producto[];
}

interface Restaurante {
  nombreRestaurante: string;
  categorias: Categoria[];
}

const getInitialVenta = (): Venta => ({
  productos: [],
  total: 0,
});

export default function SalesPage() {
  const [venta, setVenta] = useState<Venta>(getInitialVenta());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResumenModal, setShowResumenModal] = useState<boolean>(false);
  const [datos, setDatos] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde el backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/inventario-completo`
      );
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setDatos(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar productos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Buscar productos en el inventario cargado
  const buscarProductos = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return datos.flatMap((restaurante) =>
      restaurante.categorias.flatMap((categoria) =>
        categoria.productos.filter(
          (producto) =>
            producto.nombre?.toLowerCase().includes(term) ||
            producto.descripcion?.toLowerCase().includes(term)
        )
      )
    );
  };

  // Agregar producto a la venta (y actualizar stock en backend)
  const agregarProducto = async (producto: Producto) => {
    if (!producto.nombre || !producto.precio || producto.stock === 0) return;

    // Verifica stock local antes de agregar
    const enVenta = venta.productos.find((p) => p.nombre === producto.nombre);
    if ((enVenta?.cantidad ?? 0) >= producto.stock!) {
      setError("No hay suficiente stock");
      return;
    }

    // Actualiza venta local
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

  // Al finalizar la compra, actualiza el stock en el backend
  const finalizarCompra = async () => {
    setIsLoading(true);
    try {
      // Actualiza stock de cada producto vendido
      for (const producto of venta.productos) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto/${encodeURIComponent(
            producto.nombre!
          )}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombreRestaurante: datos.find((r) =>
                r.categorias.some((c) =>
                  c.productos.some((p) => p.nombre === producto.nombre)
                )
              )?.nombreRestaurante,
              nombreCategoria: datos
                .flatMap((r) => r.categorias)
                .find((c) => c.productos.some((p) => p.nombre === producto.nombre))
                ?.nombre,
              datosActualizados: {
                stock: (
                  datos
                    .flatMap((r) => r.categorias)
                    .flatMap((c) => c.productos)
                    .find((p) => p.nombre === producto.nombre)?.stock ?? 0
                ) - (producto.cantidad ?? 1),
              },
            }),
          }
        );
      }
      setVenta(getInitialVenta());
      setShowResumenModal(false);
      setSearchTerm("");
      await fetchData();
      setError(null);
      alert("¡Compra confirmada!");
    } catch (err) {
      setError("Error al actualizar stock");
    } finally {
      setIsLoading(false);
    }
  };

  const cerrarModal = () => {
    setShowResumenModal(false);
  };

  const confirmarCompra = () => {
    setShowResumenModal(true);
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

  const eliminarProducto = (producto: Producto) => {
    setVenta((prevVenta) => ({
      ...prevVenta,
      productos: prevVenta.productos.filter((p) => p.nombre !== producto.nombre),
      total:
        prevVenta.total -
        (Number(producto.precio) * (producto.cantidad ?? 1)),
    }));
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
