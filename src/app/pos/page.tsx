"use client";
import React, { useState, useEffect } from "react";
import Inventario from "@/app/pos/inventory";
import Ventas from "@/app/pos/sale";
import Feedback from "@/app/pos/feedback";
import Image from "next/image";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import { useRouter } from "next/navigation";

export default function POSPage() {
const [view, setView] = useState<"inventario" | "vender" | "feedback" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "vendedor") {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

const renderContent = () => {
  switch (view) {
    case "inventario":
      return <Inventario />;
    case "vender":
      return <Ventas />;
    case "feedback":
      return <Feedback />;
    default:
      return <p className="mt-6 text-gray-700 text-center">Selecciona una opción</p>;
  }
};

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra de navegación */}
      <nav className="flex items-center justify-between bg-white shadow-md px-10 py-4">
        <Image src={SmartLine_Logo} alt="SmartLine Logo" width={225} />
        <button
          onClick={handleLogout}
          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-2xl font-semibold transition"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Botones de selección */}
      <div className="flex justify-center gap-6 mt-10 mb-8">
        <button
          className={`p-3 px-6 text-lg font-medium rounded-md border transition duration-300 ${
            view === "inventario"
              ? "border-blue-500 text-blue-500 bg-blue-50"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setView("inventario")}
        >
          Inventario
        </button>
        <button
          className={`p-3 px-6 text-lg font-medium rounded-md border transition duration-300 ${
            view === "vender"
              ? "border-green-500 text-green-500 bg-green-50"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setView("vender")}
        >
          Vender
        </button>
<button
  className={`p-3 px-6 text-lg font-medium rounded-md border transition duration-300 ${
    view === "feedback"
      ? "border-purple-500 text-purple-500 bg-purple-50"
      : "border-gray-300 text-gray-700 hover:bg-gray-100"
  }`}
  onClick={() => setView("feedback")}
>
  Feedback
</button>

      </div>

      {/* Contenido dinámico */}
      <div className="flex-1 px-10 py-6 bg-white shadow-lg rounded-lg mx-10">
        {renderContent()}
      </div>
    </main>
  );
}
