"use client";

import Image from "next/image";
import { Search, Menu } from "lucide-react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import NavigationMenuComponent from "@/app/components/navigationMenu";
import { UserDropdownMenu } from "@/app/components/userDropMenu";
import { useRouter } from "next/navigation";
import { CartDropdownMenu } from "./shoppingCart";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchQuery}`);
    setIsMenuOpen(false);
  };

  // Cierra el menú al hacer click fuera (opcional)
  // Puedes agregar un useEffect para mejorar UX

  return (
    <header className="border-b border-gray-200 bg-white w-full px-2 py-2 md:px-8 md:py-4 shadow-sm sticky top-0 z-30">
      <nav className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        {/* Logo y menú móvil */}
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
          <button
            className="md:hidden text-gray-600 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
            type="button"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Menú de navegación (escritorio) */}
        <div className="hidden md:block">
          <NavigationMenuComponent />
        </div>

        {/* Barra de búsqueda y menús de usuario/carrito */}
        <div className="flex items-center gap-2 md:gap-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border rounded-md overflow-hidden bg-gray-100 w-28 sm:w-40 md:w-64"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="px-2 py-1 w-full bg-transparent outline-none text-sm"
            />
            <button
              type="submit"
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="hidden md:block">
            <UserDropdownMenu />
          </div>
          <div>
            <CartDropdownMenu />
          </div>
        </div>
      </nav>

      {/* Menú de navegación móvil */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-all duration-200 ${
          isMenuOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-4"
          onClick={e => e.stopPropagation()}
        >
          <NavigationMenuComponent />
          <div className="mt-4">
            <UserDropdownMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
