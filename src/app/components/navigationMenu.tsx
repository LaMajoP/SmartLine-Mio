import { FC } from "react";
import Link from "next/link";

interface NavigationMenuProps {
  onNavigate?: () => void;
}

const NavigationMenuComponent: FC<NavigationMenuProps> = ({ onNavigate }) => {
  return (
    <nav className="flex flex-col md:flex-row gap-4 md:gap-8">
      <Link href="/products" onClick={onNavigate}>
        <button className="px-6 py-2 rounded font-semibold text-[90%] cursor-pointer w-full md:w-auto text-left md:text-center">
          Productos
        </button>
      </Link>
      <Link href="/restaurants" onClick={onNavigate}>
        <button className="px-6 py-2 rounded font-semibold text-[90%] cursor-pointer w-full md:w-auto text-left md:text-center">
          Restaurantes
        </button>
      </Link>
    </nav>
  );
};

export default NavigationMenuComponent;
