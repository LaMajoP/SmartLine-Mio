"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { menuData } from "../data/menu";
import { useCart } from "@/context/CartContext";
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
};


const MenuPage: React.FC = () => {
  const { addItem } = useCart();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");

  // Filtrar restaurantes, categorías y productos basados en el searchQuery
  const filteredRestaurants = menuData
    .map((restaurante) => {
      const filteredCategorias = restaurante.categorias
        .map((categoria) => {
          // Filtrar productos válidos y luego por búsqueda
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
        restaurante.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        filteredCategorias.length > 0
      ) {
        return {
          ...restaurante,
          categorias: filteredCategorias,
        };
      }
      return null;
    })
    .filter((restaurante) => restaurante !== null); // Eliminar restaurantes nulos

  // Maneja la acción de añadir al carrito
  const handleAddItem = (producto: Producto) => {
    addItem(producto);
    setConfirmation(`Añadido al carrito: ${producto.nombre}`);
    setTimeout(() => setConfirmation(null), 2000);
  };

  useEffect(() => {
    // Limpiar el mensaje de confirmación después de un tiempo
    if (confirmation) {
      const timer = setTimeout(() => setConfirmation(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [confirmation]);

  return (
    <main>
      <Header />
      <div className="p-10">
        {/* Barra de búsqueda */}
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

        {filteredRestaurants.length === 0 && (
          <p className="text-lg text-gray-500">No se encontraron resultados.</p>
        )}

        {filteredRestaurants.map((restaurante) => (
          <div
            key={restaurante.nombre}
            className="mb-10 p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              {restaurante.nombre}
            </h2>

            {/* Mapeando las categorías y productos */}
            {restaurante.categorias.map((categoria, categoriaIndex) => (
              <div key={`${restaurante.nombre}-${categoria.nombre}-${categoriaIndex}`} className="mt-6">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  {categoria.nombre}
                </h3>
                <div className="space-y-6">
                  {categoria.productos.map((producto, productoIndex) => (
                    <div
                      key={`${categoria.nombre}-${producto.nombre}-${productoIndex}`}
                      className="flex justify-between items-center p-6 rounded-lg shadow-lg transform hover:scale-[101%] transition-transform duration-300"
                    >
                      <div className="max-w-[70%]">
                        <strong className="text-2xl font-semibold text-green-600">
                          {producto.nombre}
                        </strong>
                        <span className="block text-lg font-medium text-black mt-2">
                          ${producto.precio}
                        </span>
                        <p className="text-sm text-black mt-2">
                          {producto.descripcion}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddItem(producto)}
                        className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-[102%] cursor-pointer"
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

      {/* Mensaje de confirmación */}
      {confirmation && (
        <div className="fixed bottom-10 right-10 bg-blue-400 text-white py-2 px-4 rounded-lg shadow-md text-lg">
          {confirmation}
        </div>
      )}
    </main>
  );
};

export default MenuPage;
