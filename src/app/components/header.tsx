"use client";

import Image from "next/image";
import { GripVertical, Search } from "lucide-react";
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

    // Navegar a la página de productos con los filtros de búsqueda
    router.push(`/products?search=${searchQuery}`);
  };

  return (
    <header className="border-b border-gray-300 bg-white w-full px-8 py-6 shadow-xl">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-12 pr-10">
          <Image
            src={SmartLine_Logo}
            alt="SmartLine Logo"
            width={225}
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
          <NavigationMenuComponent />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-300 rounded-full px-6 py-3 w-[40vw] bg-white shadow-lg">
          <GripVertical className="text-gray-400 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Buscar por producto, tienda o categoría..."
            className="flex-grow bg-transparent focus:outline-none text-sm text-gray-700"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="text-gray-500 w-5 h-5 ml-3" />
        </form>

        <div className="flex items-center gap-8">
          <CartDropdownMenu />
          <UserDropdownMenu />
        </div>
      </nav>
    </header>
  );
}
