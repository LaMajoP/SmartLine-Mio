import Image from "next/image";
import { GripVertical, Search } from "lucide-react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import NavigationMenuComponent from "@/app/components/navigationMenu";
import { UserDropdownMenu } from "@/app/components/userDropMenu";

export default function Home() {
  return (
    <main>
      <header className="border-b-1 border-solid border-black w-full px-5">
        <nav className="flex items-center gap-10">
          <Image src={SmartLine_Logo} alt="SmartLine Logo" width={225} />
          <NavigationMenuComponent></NavigationMenuComponent>
          <div className="flex items-center border border-gray-700 rounded-3xl px-4 py-2 w-[45vw] bg-white">
            <GripVertical className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Buscar por producto, tienda o categoría..."
              className="flex-grow bg-transparent focus:outline-none focus:ring-0 text-sm"
            />
            <Search className="text-gray-500 w-5 h-5 ml-2" />
          </div>

          <div className="w-fit flex justify-end gap-20 pl-10">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3514/3514491.png"
              alt="shopping-cart"
              className="w-6 h-6 object-contain"
            />
            <UserDropdownMenu></UserDropdownMenu>
          </div>
        </nav>
      </header>
    </main>
  );
}
