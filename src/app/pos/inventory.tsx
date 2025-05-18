"use client";
import { useEffect, useState } from "react";

interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  restaurante: string;
  stock: number;
}

interface Categoria {
  nombre: string;
  productos: Producto[];
}

interface Restaurante {
  nombreRestaurante: string;
  categorias: Categoria[];
}

export default function Inventario() {
  const [datos, setDatos] = useState<Restaurante[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "",
    restaurante: "",
    stock: 0
  });
  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    restaurante: ""
  });
  const [editarCategoria, setEditarCategoria] = useState<{ [key: string]: string }>({});
  const [editandoCategoria, setEditandoCategoria] = useState<string | null>(null);
  const [editandoProducto, setEditandoProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/inventario-completo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setDatos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtrarProductos = (productos: Producto[]) =>
    productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const handleProductoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormProducto(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormCategoria(prev => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    setIsLoading(true);
    try {
      if (!formProducto.restaurante || !formProducto.categoria || !formProducto.nombre || !formProducto.precio) {
        throw new Error('Todos los campos son requeridos');
      }
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formProducto),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear producto');
      }
      setFormProducto({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "", stock: 0 });
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error al agregar producto:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const guardarEdicionProducto = async () => {
    if (!editandoProducto) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto/${encodeURIComponent(editandoProducto.nombre)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombreRestaurante: editandoProducto.restaurante,
          nombreCategoria: editandoProducto.categoria,
          datosActualizados: {
            nombre: editandoProducto.nombre,
            descripcion: editandoProducto.descripcion,
            precio: editandoProducto.precio,
            stock: editandoProducto.stock
          },
        }),
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text);
      }
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar producto");
      }
      setEditandoProducto(null);
      await fetchData();
      setError(null);
    } catch (err) {
      console.error("Error al guardar edición:", err);
      setError(err instanceof Error ? err.message : "Error al guardar cambios");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarProducto = async (rest: string, cat: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar el producto ${nombre}?`)) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto/${encodeURIComponent(nombre)}?nombreRestaurante=${encodeURIComponent(rest)}&nombreCategoria=${encodeURIComponent(cat)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!res.ok) {
        throw new Error('Error al eliminar producto');
      }
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const agregarCategoria = async () => {
    setIsLoading(true);
    try {
      if (!formCategoria.restaurante || !formCategoria.nombre) {
        throw new Error('Todos los campos son requeridos');
      }
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombreRestaurante: formCategoria.restaurante,
          nuevaCategoria: { nombre: formCategoria.nombre }
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear categoría');
      }
      setFormCategoria({ nombre: "", restaurante: "" });
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error al agregar categoría:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCategoria = async (restaurante: string, categoria: string) => {
    if (!window.confirm(`¿Eliminar la categoría ${categoria}?`)) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria/${encodeURIComponent(categoria)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreRestaurante: restaurante }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar categoría');
      }
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const guardarNombreCategoria = async (restaurante: string, actual: string, nuevo: string) => {
    if (!nuevo.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria/${encodeURIComponent(actual)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreRestaurante: restaurante, nuevoNombre: nuevo }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar categoría');
      }
      setEditandoCategoria(null);
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error al actualizar categoría:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventario</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></span>
          <div className="text-center text-lg text-gray-500">Cargando productos...</div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <input
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        {datos.map((r) => (
          <div key={r.nombreRestaurante} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">{r.nombreRestaurante}</h2>
            {r.categorias.map((c) => (
              <div key={c.nombre} className="border p-4 rounded shadow mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{c.nombre}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => eliminarCategoria(r.nombreRestaurante, c.nombre)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar Categoría
                    </button>
                  </div>
                </div>
                <ul className="space-y-2">
                  {filtrarProductos(c.productos).map((p) => (
                    <li key={`${p.restaurante}-${p.categoria}-${p.nombre}`}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex-grow min-w-0">
                        <span className="font-medium">{p.nombre}</span> -
                        <span className="text-green-600 font-bold"> ${p.precio.toFixed(2)}</span>
                        {p.descripcion && <span className="text-gray-600"> - {p.descripcion}</span>}
                        <span className="text-blue-700 ml-2">Stock: {p.stock ?? 0}</span>
                      </div>
                      <div className="flex flex-row items-center gap-2 flex-shrink-0 ml-4">
                        <button
                          onClick={() => setEditandoProducto(p)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(p.restaurante, p.categoria, p.nombre)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
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

      {editandoProducto && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={editandoProducto.nombre}
                  onChange={(e) => setEditandoProducto({ ...editandoProducto, nombre: e.target.value })}
                  className="block w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  name="descripcion"
                  value={editandoProducto.descripcion}
                  onChange={(e) => setEditandoProducto({ ...editandoProducto, descripcion: e.target.value })}
                  className="block w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={editandoProducto.precio}
                  onChange={(e) => setEditandoProducto({ ...editandoProducto, precio: Number(e.target.value) })}
                  className="block w-full border p-2 rounded"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editandoProducto.stock}
                  onChange={(e) => setEditandoProducto({ ...editandoProducto, stock: Number(e.target.value) })}
                  className="block w-full border p-2 rounded"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setEditandoProducto(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicionProducto}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border p-4 rounded shadow">
        <h2 className="font-semibold mb-3 text-lg">Agregar Producto</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurante</label>
            <select
              name="restaurante"
              value={formProducto.restaurante}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
              required
            >
              <option value="">Selecciona restaurante</option>
              {datos.map((r) => (
                <option key={r.nombreRestaurante} value={r.nombreRestaurante}>
                  {r.nombreRestaurante}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoria"
              value={formProducto.categoria}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
              required
              disabled={!formProducto.restaurante}
            >
              <option value="">Selecciona categoría</option>
              {(datos.find((r) => r.nombreRestaurante === formProducto.restaurante)?.categorias || []).map((c) => (
                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              placeholder="Nombre del producto"
              value={formProducto.nombre}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              name="descripcion"
              placeholder="Descripción"
              value={formProducto.descripcion}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              placeholder="0.00"
              value={formProducto.precio || ''}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              value={formProducto.stock}
              onChange={handleProductoChange}
              className="block w-full border p-2 rounded"
              required
              min="0"
            />
          </div>

          {editandoProducto && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={editandoProducto.stock}
                onChange={(e) =>
                  setEditandoProducto({
                    ...editandoProducto,
                    stock: Number(e.target.value)
                  })
                }
                className="block w-full border p-2 rounded"
                min="0"
              />
            </div>
          )}

          <button
            onClick={agregarProducto}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-2"
            disabled={!formProducto.nombre || !formProducto.precio || !formProducto.categoria || !formProducto.restaurante || isLoading}
          >
            {isLoading ? 'Agregando...' : 'Añadir Producto'}
          </button>
        </div>
      </div>

      <div className="bg-white border p-4 rounded shadow">
        <h2 className="font-semibold mb-3 text-lg">Agregar Categoría</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurante</label>
            <select
              name="restaurante"
              value={formCategoria.restaurante}
              onChange={handleCategoriaChange}
              className="block w-full border p-2 rounded"
              required
            >
              <option value="">Selecciona restaurante</option>
              {datos.map((r) => (
                <option key={r.nombreRestaurante} value={r.nombreRestaurante}>
                  {r.nombreRestaurante}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Categoría</label>
            <input
              name="nombre"
              placeholder="Nombre de la categoría"
              value={formCategoria.nombre}
              onChange={handleCategoriaChange}
              className="block w-full border p-2 rounded"
              required
            />
          </div>

          <button
            onClick={agregarCategoria}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-2"
            disabled={!formCategoria.nombre || !formCategoria.restaurante || isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </div>
    </div>
  );
}
