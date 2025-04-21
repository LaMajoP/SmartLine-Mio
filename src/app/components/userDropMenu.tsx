import { FC, useContext } from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDropdownMenu: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-transparent border-none p-0 cursor-pointer">
          <img
            className="w-6 h-6 object-contain"
            src="https://cdn-icons-png.flaticon.com/128/456/456212.png"
            alt="user-icon"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 mr-[1.5vw] mt-[1vh]">
        <DropdownMenuLabel className="flex flex-col text-black">
          <span className="text-lg font-semibold truncate">
            Samuel Guerrero Arcos
          </span>
          <span className="text-sm font-normal text-gray-600 truncate">
            Universidad de la Sabana
          </span>
          <span className="text-xs font-normal text-gray-600 truncate">
            Estudiante
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2 text-sm text-black font-medium cursor-pointer">
            <span>Configuración</span>
            <DropdownMenuShortcut>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png"
                alt="settings-icon"
                className="w-4 h-4"
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 text-sm text-black font-medium cursor-pointer">
            <span>Cerrar Sesión</span>
            <DropdownMenuShortcut>
              <LogOut size={16} className="text-black" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserDropdownMenu };
