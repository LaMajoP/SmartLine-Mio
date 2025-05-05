"use client";
import { useState } from "react";
import Header from "@/app/components/header";

interface Producto {
  nombre: string;
  precio: number | string;
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

interface EditingCategory {
  nombreAnterior: string;
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
        ],
      },
      {
        nombre: "Entradas",
        productos: [],
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
  const [editingCategory, setEditingCategory] =
    useState<EditingCategory | null>(null);
  const [form, setForm] = useState<Producto>({
    nombre: "",
    precio: "",
    descripcion: "",
  });
  const [categoryForm, setCategoryForm] = useState<string>("");
  const [categoryEditForm, setCategoryEditForm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addingProduct, setAddingProduct] = useState<boolean>(false);
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const openEditModal = (producto: Producto, categoriaNombre: string) => {
    setEditingProduct({ producto, categoriaNombre });
    setForm(producto);
  };

  const openEditCategoryModal = (nombreAnterior: string) => {
    setEditingCategory({ nombreAnterior });
    setCategoryEditForm(nombreAnterior);
  };

  const deleteCategory = (nombreCategoria: string) => {
    const updated = [...restaurants];
    updated[0].categorias = updated[0].categorias.filter(
      (cat) => cat.nombre !== nombreCategoria
    );
    setRestaurants(updated);
  };

  const saveCategoryChanges = () => {
    const updated = [...restaurants];
    updated[0].categorias = updated[0].categorias.map((cat) =>
      cat.nombre === editingCategory?.nombreAnterior
        ? { ...cat, nombre: categoryEditForm }
        : cat
    );
    setRestaurants(updated);
    setEditingCategory(null);
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

  const openAddProductModal = () => {
    setAddingProduct(true);
    setForm({ nombre: "", precio: "", descripcion: "" });
    setSelectedCategory("");
  };

  const openAddCategoryModal = () => {
    setAddingCategory(true);
    setCategoryForm("");
  };

  const addProduct = () => {
    if (!selectedCategory) {
      alert("Por favor, selecciona una categoría.");
      return;
    }

    const updated = [...restaurants];
    updated[0].categorias = updated[0].categorias.map((cat) => {
      if (cat.nombre === selectedCategory) {
        cat.productos.push(form);
      }
      return cat;
    });

    setRestaurants(updated);
    setAddingProduct(false);
    setForm({ nombre: "", precio: "", descripcion: "" });
    setSelectedCategory("");
  };

  const addCategory = () => {
    if (!categoryForm.trim()) {
      alert("Por favor, ingresa un nombre para la categoría.");
      return;
    }

    const updated = [...restaurants];
    updated[0].categorias.push({ nombre: categoryForm, productos: [] });
    setRestaurants(updated);
    setAddingCategory(false);
    setCategoryForm("");
  };

  return (
    <>
      <Header />
      <main className="p-8">
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-6 flex gap-5">
          <button
            onClick={openAddProductModal}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Añadir Producto
          </button>
          <button
            onClick={openAddCategoryModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Añadir Categoría
          </button>
        </div>

        {restaurants.map((restaurante) => (
          <div key={restaurante.nombre}>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {restaurante.nombre}
            </h1>

            {restaurante.categorias.map((categoria) => (
              <div key={categoria.nombre} className="mb-12">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold text-blue-600">
                    {categoria.nombre}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                      onClick={() => openEditCategoryModal(categoria.nombre)}
                    >
                      Editar
                    </button>
                    {categoria.productos.length === 0 && (
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        onClick={() => deleteCategory(categoria.nombre)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

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
                        .filter((p) =>
                          p.nombre
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((producto) => (
                          <tr
                            key={producto.nombre}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">{producto.nombre}</td>
                            <td className="px-6 py-4">
                              {producto.descripcion}
                            </td>
                            <td className="px-6 py-4 text-right">
                              ${producto.precio.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() =>
                                    openEditModal(producto, categoria.nombre)
                                  }
                                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                                >
                                  Modificar
                                </button>
                                <button
                                  onClick={() =>
                                    setDeletingProduct({
                                      producto,
                                      categoriaNombre: categoria.nombre,
                                    })
                                  }
                                  className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-700"
                                >
                                  Eliminar
                                </button>
                              </div>
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

      {/* Modales (agregar, editar, eliminar producto/categoría) */}
      {addingCategory && (
        <Modal
          title="Añadir categoría"
          value={categoryForm}
          onChange={(v) => setCategoryForm(v)}
          onCancel={() => setAddingCategory(false)}
          onSave={addCategory}
        />
      )}

      {addingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Añadir producto</h3>

            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
            <input
              className="w-full mb-3 border px-3 py-2 rounded"
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) =>
                setForm({
                  ...form,
                  precio: e.target.value ? Number(e.target.value) : "",
                })
              }
            />
            <select
              className="w-full mb-3 border px-3 py-2 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {restaurants[0].categorias.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <ModalActions
              onCancel={() => setAddingProduct(false)}
              onSave={addProduct}
            />
          </div>
        </div>
      )}

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

      {editingCategory && (
        <Modal
          title="Editar nombre de categoría"
          value={categoryEditForm}
          onChange={(v) => setCategoryEditForm(v)}
          onCancel={() => setEditingCategory(null)}
          onSave={saveCategoryChanges}
        />
      )}

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

function Modal({
  title,
  value,
  onChange,
  onCancel,
  onSave,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <input
          className="w-full mb-3 border px-3 py-2 rounded"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <ModalActions onCancel={onCancel} onSave={onSave} />
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={onSave}
      >
        Guardar
      </button>
    </div>
  );
}
