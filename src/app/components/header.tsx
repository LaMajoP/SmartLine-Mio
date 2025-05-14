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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchQuery}`);
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
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border rounded-md overflow-hidden bg-gray-100 w-24 sm:w-40 md:w-64"
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
          <div className="flex items-center p-5 gap-4">
            <CartDropdownMenu />
            <UserDropdownMenu />
          </div>
      </nav>
    </header>
  );
}
