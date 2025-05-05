"use client";

import Image from "next/image";
import { GripVertical, Search } from "lucide-react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import NavigationMenuComponent from "@/app/components/navigationMenu";
import { UserDropdownMenu } from "@/app/components/userDropMenu";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="border-b border-gray-300 bg-white w-full px-8 py-6 shadow-xl">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-12 pr-10">
          <Image
            src={SmartLine_Logo}
            alt="SmartLine Logo"
            width={225}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
          <NavigationMenuComponent />
          <button
            className="font-semibold cursor-pointer"
            onClick={() => router.push("/pos")}
          >
            POS
          </button>
        </div>

        <div className="flex items-center border border-gray-300 rounded-full px-6 py-3 w-[40vw] bg-white shadow-lg">
          <GripVertical className="text-gray-400 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Buscar por producto, tienda o categoría..."
            className="flex-grow bg-transparent focus:outline-none text-sm text-gray-700"
          />
          <Search className="text-gray-500 w-5 h-5 ml-3" />
        </div>

        <div className="flex items-center gap-8">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3514/3514491.png"
            alt="shopping-cart"
            className="w-7 h-7 object-contain"
          />
          <UserDropdownMenu />
        </div>
      </nav>
    </header>
  );
}
