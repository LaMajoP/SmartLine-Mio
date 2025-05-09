"use client";
import React, { useState } from "react";
import Inventario from "@/app/pos/inventory"; // Ajusta la ruta según donde lo ubiques
import Ventas from "@/app/pos/sale"; // Ajusta la ruta según donde lo ubiques
import Image from "next/image";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import { UserDropdownMenu } from "@/app/components/userDropMenu";

export default function POSPage() {
  const [view, setView] = useState<"inventario" | "vender" | null>(null);

  const renderContent = () => {
    switch (view) {
      case "inventario":
        return <Inventario />;
      case "vender":
        return <Ventas />;
      default:
        return <p className="mt-6 text-gray-700 text-center">Selecciona una opción</p>;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra de navegación */}
      <nav className="flex items-center justify-between bg-white shadow-md px-10 py-4">
        <Image src={SmartLine_Logo} alt="SmartLine Logo" width={225} />
        <UserDropdownMenu />
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
      </div>

      {/* Contenido dinámico */}
      <div className="flex-1 px-10 py-6 bg-white shadow-lg rounded-lg mx-10">
        {renderContent()}
      </div>
    </main>
  );
}
