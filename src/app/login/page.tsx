// app/login/page.tsx
import Image from "next/image";
import React from "react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";

const LoginPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Imagen izquierda */}
      <div className="relative w-full md:w-1/2">
        <img
          src="https://medellingourmet.com/wp-content/uploads/2025/03/burdo-medellin-gourmet-1-min-768x1152.jpg"
          alt="Comida saludable"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-8 left-8">
          
        </div>
      </div>

      {/* Login derecho */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center">
          <Image src={SmartLine_Logo} alt="SmartLine Logo" width={225} />{" "}
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Usuario</label>
              <input
                type="text"
                placeholder="Ingrese Usuario"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Ingrese Contraseña"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none pr-10"
                />
                <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 hover:underline cursor-pointer">
            Olvidé mi Contraseña
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
