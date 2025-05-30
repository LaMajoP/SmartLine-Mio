"use client";

import React, { useState, useEffect, Suspense } from "react";
import Header from "../components/header";
import { useCart } from "@/context/CartContext";
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  restaurante: string;
  stock?: number; // <-- Agregado
};

type Categoria = {
  nombre: string;
  productos: Producto[];
};

type Restaurante = {
  nombreRestaurante: string;
  categorias: Categoria[];
};

// Componente que contiene la lógica principal
function ProductContent() {
  const { addItem } = useCart();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");
  const [datos, setDatos] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Obtener el token del localStorage

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
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRestaurants = datos
    .map((restaurante) => {
      const filteredCategorias = restaurante.categorias
        .map((categoria) => {
          const filteredProductos = categoria.productos
            .filter(
              (producto) =>
                typeof producto.nombre === "string" &&
                typeof producto.descripcion === "string"
            )
            .filter(
              (producto) =>
                producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
            );

          if (filteredProductos.length > 0) {
            return {
              ...categoria,
              productos: filteredProductos,
            };
          }
          return null;
        })
        .filter((categoria) => categoria !== null);

      if (
        restaurante.nombreRestaurante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        filteredCategorias.length > 0
      ) {
        return {
          ...restaurante,
          categorias: filteredCategorias,
        };
      }
      return null;
    })
    .filter((restaurante) => restaurante !== null);

  const handleAddItem = (producto: Producto) => {
    addItem(producto);
    setConfirmation(`Añadido al carrito: ${producto.nombre}`);
    setTimeout(() => setConfirmation(null), 2000);
  };

  useEffect(() => {
    if (confirmation) {
      const timer = setTimeout(() => setConfirmation(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [confirmation]);

  return (
    <main>
      <Header />
      <div className="p-10">
        <div className="mb-6 flex items-center relative">
          <FaSearch className="absolute left-4 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Filtrar por restaurante, producto o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-300"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></span>
            <div className="text-center text-lg text-gray-500">Cargando productos...</div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-4">{error}</div>
        )}

        {!isLoading && filteredRestaurants.length === 0 && (
          <p className="text-lg text-gray-500">No se encontraron resultados.</p>
        )}

        {filteredRestaurants.map((restaurante) => (
          <div
            key={restaurante.nombreRestaurante}
            className="mb-10 p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              {restaurante.nombreRestaurante}
            </h2>

            {restaurante.categorias.map((categoria, categoriaIndex) => (
              <div key={`${restaurante.nombreRestaurante}-${categoria.nombre}-${categoriaIndex}`} className="mt-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4">
                  {categoria.nombre}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoria.productos.map((producto, productoIndex) => (
                    <div
                      key={`${categoria.nombre}-${producto.nombre}-${productoIndex}`}
                      className="flex flex-col justify-between h-full p-4 sm:p-6 rounded-lg shadow-lg bg-white transform hover:scale-[101%] transition-transform duration-300"
                    >
                      <div>
                        <strong className="text-lg sm:text-2xl font-semibold text-green-600 block">
                          {producto.nombre}
                        </strong>
                        <span className="block text-base sm:text-lg font-medium text-black mt-2">
                          ${producto.precio}
                        </span>
                        <p className="text-xs sm:text-sm text-black mt-2">
                          {producto.descripcion}
                        </p>
                        <p className="text-xs sm:text-sm text-blue-700 mt-2">
                          Stock: {producto.stock ?? 0}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddItem(producto)}
                        className="mt-4 bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-[102%] cursor-pointer"
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {confirmation && (
        <div className="fixed bottom-10 right-10 bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md text-lg">
          {confirmation}
        </div>
      )}
    </main>
  );
}

// Componente principal modificado
const ProductsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductContent />
    </Suspense>
  );
};

export default ProductsPage;