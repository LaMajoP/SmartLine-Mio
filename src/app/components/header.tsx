"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import NavigationMenuComponent from "@/app/components/navigationMenu";
import { useRouter } from "next/navigation";
import { CartDropdownMenu } from "./shoppingCart";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchQuery}`);
  };

  const handleLogout = () => {
    // Aquí puedes agregar tu lógica de logout
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white w-full px-2 py-2 md:px-8 md:py-4 shadow-sm sticky top-0 z-30">
      <nav className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Image
            src={SmartLine_Logo}
            alt="SmartLine Logo"
            width={130}
            height={40}
            className="cursor-pointer h-auto w-auto"
            onClick={() => router.push("/dashboard")}
            priority
          />
        </div>

        {/* Menú de navegación (solo escritorio) */}
        <div className="hidden md:block">
          <NavigationMenuComponent />
        </div>

        {/* Barra de búsqueda y menús de usuario/carrito */}
        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border-1 border-gray-300 rounded-full overflow-hidden bg-gray-100 w-44 sm:w-72 md:w-96 shadow focus-within:ring-2 focus-within:ring-blue-300 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="px-4 py-2 w-full bg-transparent outline-none text-base"
            />
            <button
              type="submit"
              className="p-3 text-black cursor-pointer"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div>
            <CartDropdownMenu />
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-2xl font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}
