// pages/Inventario.tsx
"use client";
import { useEffect, useState } from "react";

interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  restaurante: string;
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
  const [formProducto, setFormProducto] = useState({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "" });
  const [formCategoria, setFormCategoria] = useState({ nombre: "", restaurante: "" });
  const [editarCategoria, setEditarCategoria] = useState({ actual: "", nuevo: "", restaurante: "" });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/inventario-completo`);
    const data = await res.json();
    console.log("✅ Datos cargados:", data); // Debug log útil
    setDatos(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtrarProductos = (productos: Producto[]) =>
    productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const agregarProducto = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formProducto),
    });
    setFormProducto({ nombre: "", descripcion: "", precio: 0, categoria: "", restaurante: "" });
    fetchData();
  };

  const editarProducto = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto/${formProducto.nombre}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreRestaurante: formProducto.restaurante,
        nombreCategoria: formProducto.categoria,
        datosActualizados: {
          nombre: formProducto.nombre,
          descripcion: formProducto.descripcion,
          precio: formProducto.precio,
        },
      }),
    });
    fetchData();
  };

  const eliminarProducto = async (rest: string, cat: string, nombre: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/producto/${nombre}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreRestaurante: rest, nombreCategoria: cat }),
    });
    fetchData();
  };

  const agregarCategoria = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreRestaurante: formCategoria.restaurante, nuevaCategoria: { nombre: formCategoria.nombre } }),
    });
    fetchData();
  };

  const editarNombreCategoria = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria/${editarCategoria.actual}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreRestaurante: editarCategoria.restaurante }),
    });
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/categoria`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreRestaurante: editarCategoria.restaurante, nuevaCategoria: { nombre: editarCategoria.nuevo } }),
    });
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventario</h1>

      <input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-4">
        {datos.map((r) => (
          <div key={r.nombreRestaurante}>
            <h2 className="text-xl font-bold text-blue-700">{r.nombreRestaurante}</h2>
            {r.categorias.map((c) => (
              <div key={c.nombre} className="border p-4 rounded shadow mb-3">
                <h3 className="font-semibold text-lg mb-2">{c.nombre || '(Sin nombre)'}</h3>
                <ul className="space-y-1">
                  {filtrarProductos(c.productos).map((p) => (
                    <li key={p.nombre} className="flex justify-between">
                      <span>{p.nombre} - ${p.precio} - {p.descripcion}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => setFormProducto({ ...p, categoria: c.nombre, restaurante: r.nombreRestaurante })}
                          className="text-yellow-600 hover:underline"
                        >Editar</button>
                        <button
                          onClick={() => eliminarProducto(r.nombreRestaurante, c.nombre, p.nombre)}
                          className="text-red-600 hover:underline"
                        >Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold">Agregar/Editar Producto</h2>
        <select value={formProducto.restaurante} onChange={(e) => setFormProducto({ ...formProducto, restaurante: e.target.value.trim() })} className="block mb-2 w-full border p-1">
          <option value="">Selecciona restaurante</option>
          {datos.map((r) => (
            <option key={r.nombreRestaurante} value={r.nombreRestaurante}>{r.nombreRestaurante}</option>
          ))}
        </select>

        <select value={formProducto.categoria} onChange={(e) => setFormProducto({ ...formProducto, categoria: e.target.value })} className="block mb-2 w-full border p-1">
          <option value="">Selecciona categoría</option>
          {(datos.find((r) => r.nombreRestaurante === formProducto.restaurante)?.categorias || []).map((c) => (
            <option key={c.nombre} value={c.nombre}>{c.nombre || '(Sin nombre)'}</option>
          ))}
        </select>

        <input placeholder="Nombre" value={formProducto.nombre} onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })} className="block mb-2 w-full border p-1" />
        <input placeholder="Descripción" value={formProducto.descripcion} onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })} className="block mb-2 w-full border p-1" />
        <input type="number" placeholder="Precio" value={formProducto.precio} onChange={(e) => setFormProducto({ ...formProducto, precio: Number(e.target.value) })} className="block mb-2 w-full border p-1" />
        <button onClick={agregarProducto} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Añadir</button>
        <button onClick={editarProducto} className="bg-yellow-500 text-white px-4 py-2 rounded">Guardar Cambios</button>
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold">Agregar Categoría</h2>
        <select value={formCategoria.restaurante} onChange={(e) => setFormCategoria({ ...formCategoria, restaurante: e.target.value })} className="block mb-2 w-full border p-1">
          <option value="">Selecciona restaurante</option>
          {datos.map((r) => (
            <option key={r.nombreRestaurante} value={r.nombreRestaurante}>{r.nombreRestaurante}</option>
          ))}
        </select>
        <input placeholder="Nombre de Categoría" value={formCategoria.nombre} onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })} className="block mb-2 w-full border p-1" />
        <button onClick={agregarCategoria} className="bg-blue-600 text-white px-4 py-2 rounded">Crear Categoría</button>
      </div>

      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold">Editar nombre de Categoría</h2>
        <select value={editarCategoria.restaurante} onChange={(e) => setEditarCategoria({ ...editarCategoria, restaurante: e.target.value })} className="block mb-2 w-full border p-1">
          <option value="">Selecciona restaurante</option>
          {datos.map((r) => (
            <option key={r.nombreRestaurante} value={r.nombreRestaurante}>{r.nombreRestaurante}</option>
          ))}
        </select>
        <input placeholder="Nombre Actual" value={editarCategoria.actual} onChange={(e) => setEditarCategoria({ ...editarCategoria, actual: e.target.value })} className="block mb-2 w-full border p-1" />
        <input placeholder="Nuevo Nombre" value={editarCategoria.nuevo} onChange={(e) => setEditarCategoria({ ...editarCategoria, nuevo: e.target.value })} className="block mb-2 w-full border p-1" />
        <button onClick={editarNombreCategoria} className="bg-purple-600 text-white px-4 py-2 rounded">Renombrar Categoría</button>
      </div>
    </div>
  );
}
//
