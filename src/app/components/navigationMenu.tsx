import { FC } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigationMenu } from "@/app/data/data";
import Link from "next/link";

const NavigationMenuComponent: FC = () => {
  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList className="gap-[2.5vw] m-0 p-0">
        {Object.keys(navigationMenu).map((categoryKey, index) => {
          const category = navigationMenu[categoryKey];

          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger className="border-none bg-transparent font-semibold">
                {categoryKey}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white pt-2 px-2 max-h-[240px] overflow-y-auto">
                <ul
                  className={`flex flex-wrap list-none p-0 justify-between gap-2 ${
                    category.length > 1
                      ? "min-w-[520px]"
                      : "justify-center min-w-[260px]"
                  }`}
                >
                  {category.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.link ? (
                        <NavigationMenuLink
                          href={item.link}
                          className="hover:bg-gray-100 rounded-md text-black block w-[256px] px-4 py-3 transition-all"
                        >
                          <div className="flex flex-col text-left gap-1">
                            <span className="text-base font-semibold">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-sm text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </NavigationMenuLink>
                      ) : (
                        <div className="hover:bg-gray-100 rounded-md text-black block w-[240px] px-4 py-3 transition-all">
                          <div className="flex flex-col text-left gap-1">
                            <span className="text-base font-semibold">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-sm text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
      <Link href="/products">
        <button className="px-16 rounded-sm font-semibold text-[85%] cursor-pointer">
          Productos
        </button>
      </Link>
    </NavigationMenu>
  );
};

export default NavigationMenuComponent;
