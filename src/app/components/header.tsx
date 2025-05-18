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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchQuery}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white w-full px-2 py-2 md:px-8 md:py-4 shadow-sm sticky top-0 z-30">
      <nav className="flex items-center justify-between w-full max-w-screen-2xl mx-auto relative">
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

        {/* Menú de navegación (desktop/tablet) */}
        <div className="hidden md:block">
          <NavigationMenuComponent />
        </div>

        {/* Menú hamburguesa (móvil) */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Menú lateral móvil */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex">
            <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col gap-6">
              <button
                className="self-end text-2xl mb-4"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                ×
              </button>
              <NavigationMenuComponent onNavigate={() => setMenuOpen(false)} />
            </div>
            <div className="flex-1" onClick={() => setMenuOpen(false)} />
          </div>
        )}

        {/* Barra de búsqueda y menús de usuario/carrito */}
        <div className="flex items-center gap-2 md:gap-6 flex-1 justify-end">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border-1 border-gray-300 rounded-full overflow-hidden bg-gray-100 w-32 sm:w-44 md:w-96 shadow focus-within:ring-2 focus-within:ring-blue-300 transition-all"
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
