import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartItems from "@/app/components/cart";

const CartDropdownMenu: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src="https://cdn-icons-png.flaticon.com/128/3514/3514491.png"
          alt="shopping-cart"
          className="w-7 h-7 object-contain cursor-pointer"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[90vw] md:w-[60vw] max-h-[80vh] overflow-y-auto p-4 mr-[1.5vw] mt-[1vh]">
        <DropdownMenuLabel className="text-base font-semibold text-black mb-2">
          Carrito de compras
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CartItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CartDropdownMenu };