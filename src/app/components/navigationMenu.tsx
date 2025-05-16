import { FC } from "react";
import Link from "next/link";

const NavigationMenuComponent: FC = () => {
  return (
    <section>
      <Link href="/products">
        <button className="px-16 rounded-sm font-semibold text-[85%] cursor-pointer">
          Productos
        </button>
      </Link>
      <Link href="/restaurants">
        <button className="px-16 rounded-sm font-semibold text-[85%] cursor-pointer">
          Restaurantes
        </button>
      </Link>
    </section>
  );
};

export default NavigationMenuComponent;
