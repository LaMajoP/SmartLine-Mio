"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  restaurante: string;
  fechaCompra?: string;
};

type Categoria = {
  nombre: string;
  productos: Producto[];
};

type Restaurante = {
  nombreRestaurante: string;
  categorias: Categoria[];
};

export default function HistorialCompras() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [datos, setDatos] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userLoaded, setUserLoaded] = useState(false);

  // Obtener userId desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserId(user.userId || "");
      } catch {
        setUserId("");
      }
      setUserLoaded(true);
    }
  }, []);

  const fetchHistorial = async (uid: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/historial?userId=${uid}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      console.log("Historial recibido:", data); // <-- Agrega esta línea
      setDatos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar historial");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistorial(userId);
    }
  }, [userId]);

  const filteredRestaurants = datos
    .map((restaurante) => {
      const filteredCategorias = restaurante.categorias
        .map((categoria) => {
          const filteredProductos = categoria.productos.filter(
            (producto) =>
              producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
              producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredProductos.length > 0) {
            return { ...categoria, productos: filteredProductos };
          }
          return null;
        })
        .filter((categoria) => categoria !== null) as Categoria[];

      if (
        restaurante.nombreRestaurante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        filteredCategorias.length > 0
      ) {
        return { ...restaurante, categorias: filteredCategorias };
      }
      return null;
    })
    .filter((restaurante) => restaurante !== null) as Restaurante[];

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl col-span-2">
      <h2 className="font-semibold text-2xl mb-6 text-gray-800">
        ← Historial de Compras
      </h2>
      <div className="mb-4 flex items-center relative">
        <FaSearch className="absolute left-4 text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Buscar en tu historial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-300"
        />
      </div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></span>
          <div className="text-center text-base text-gray-500">Cargando historial...</div>
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 py-2">{error}</div>
      )}
      {!isLoading && filteredRestaurants.length === 0 && (
        <p className="text-base text-gray-500">No se encontraron compras.</p>
      )}
      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredRestaurants.map((restaurante) =>
          restaurante.categorias.map((categoria) =>
            categoria.productos.map((producto, idx) => (
              <div
                key={`${restaurante.nombreRestaurante}-${categoria.nombre}-${producto.nombre}-${idx}`}
                className="flex items-center gap-6 border-2 rounded-2xl p-2 border-gray-300"
              >
                <div>
                  <p className="font-medium text-gray-700">{producto.nombre}</p>
                  <p className="text-gray-500 text-sm">{producto.precio ? `$${producto.precio}` : ""}</p>
                  <p className="text-gray-500 text-sm">{producto.descripcion}</p>
                  <p className="text-xs text-gray-400">{categoria.nombre} - {restaurante.nombreRestaurante}</p>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </section>
  );
}