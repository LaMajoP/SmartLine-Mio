"use client";
import { useState } from "react";
import Header from "@/app/components/header";

// Definición de tipos
interface Producto {
  nombre: string;
  precio: number;
  descripcion: string;
}

interface Categoria {
  nombre: string;
  productos: Producto[];
}

interface Restaurante {
  nombre: string;
  categorias: Categoria[];
}

interface EditingProduct {
  producto: Producto;
  categoriaNombre: string;
}

interface DeletingProduct {
  producto: Producto;
  categoriaNombre: string;
}

const initialData: Restaurante[] = [
  {
    nombre: "Escuela",
    categorias: [
      {
        nombre: "Desayunos",
        productos: [
          {
            nombre: "Huevos al gusto",
            precio: 6700,
            descripcion: "Fritos, revueltos, omelettes",
          },
          {
            nombre: "Huevos pochados con queso",
            precio: 9100,
            descripcion:
              "Huevos pochados sobre arepa de arroz llanera, cubiertos con salsa de quesos y tocineta ahumada",
          },
        ],
      },
    ],
  },
];

export default function POSPage() {
  const [restaurants, setRestaurants] = useState<Restaurante[]>(initialData);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] =
    useState<DeletingProduct | null>(null);
  const [form, setForm] = useState<Producto>({
    nombre: "",
    precio: 0,
    descripcion: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const openEditModal = (producto: Producto, categoriaNombre: string) => {
    setEditingProduct({ producto, categoriaNombre });
    setForm(producto);
  };

  const saveChanges = () => {
    const updated = [...restaurants];
    updated[0].categorias = updated[0].categorias.map((cat) => {
      if (cat.nombre === editingProduct?.categoriaNombre) {
        cat.productos = cat.productos.map((p) =>
          p.nombre === editingProduct?.producto.nombre ? form : p
        );
      }
      return cat;
    });
    setRestaurants(updated);
    setEditingProduct(null);
  };

  const confirmDelete = () => {
    const updated = [...restaurants];
    updated[0].categorias = updated[0].categorias.map((cat) => {
      if (cat.nombre === deletingProduct?.categoriaNombre) {
        cat.productos = cat.productos.filter(
          (p) => p.nombre !== deletingProduct?.producto.nombre
        );
      }
      return cat;
    });
    setRestaurants(updated);
    setDeletingProduct(null);
  };

  return (
    <>
      <Header />
      <main className="p-8">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {restaurants.map((restaurante) => (
          <div key={restaurante.nombre}>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {restaurante.nombre}
            </h1>

            {restaurante.categorias.map((categoria) => (
              <div key={categoria.nombre} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                  {categoria.nombre}
                </h2>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full bg-white text-sm text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-6 py-3 text-left">Producto</th>
                        <th className="px-6 py-3 text-left">Descripción</th>
                        <th className="px-6 py-3 text-right">Precio</th>
                        <th className="px-6 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoria.productos
                        .filter((producto) =>
                          producto.nombre
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((producto) => (
                          <tr
                            key={producto.nombre}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 font-medium">
                              {producto.nombre}
                            </td>
                            <td className="px-6 py-4">{producto.descripcion}</td>
                            <td className="px-6 py-4 text-right">
                              ${producto.precio.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                              <button
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600 transition cursor-pointer"
                                onClick={() =>
                                  openEditModal(producto, categoria.nombre)
                                }
                              >
                                Modificar
                              </button>
                              <button
                                className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-800 transition"
                                onClick={() =>
                                  setDeletingProduct({
                                    producto,
                                    categoriaNombre: categoria.nombre,
                                  })
                                }
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* Modal editar */}
      {editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar producto</h3>
            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre"
            />
            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Descripción"
            />
            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              value={form.precio}
              type="number"
              onChange={(e) =>
                setForm({ ...form, precio: Number(e.target.value) })
              }
              placeholder="Precio"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                onClick={saveChanges}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {deletingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              ¿Estás seguro de eliminar <br />"{deletingProduct.producto.nombre}
              "? 
            </h3>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                onClick={() => setDeletingProduct(null)}
              >
                Cancelar
              </button>
              <button
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
