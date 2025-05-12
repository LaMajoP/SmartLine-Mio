"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
};

type CartItem = Producto & { cantidad: number };

type CartContextType = {
  items: CartItem[];
  addItem: (producto: Producto) => void;
  removeItem: (nombre: string) => void;
  deleteItem: (nombre: string) => void;
  clearCart: () => void;
  updateItemQuantity: (nombre: string, cantidad: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (producto: Producto) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.nombre === producto.nombre);
      if (existing) {
        return prevItems.map((item) =>
          item.nombre === producto.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  const removeItem = (nombre: string) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.nombre === nombre ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const deleteItem = (nombre: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.nombre !== nombre)
    );
  };

  const clearCart = () => setItems([]);

  const updateItemQuantity = (nombre: string, cantidad: number) => {
    setItems((prevItems) => {
      if (cantidad <= 0) {
        return prevItems.filter((item) => item.nombre !== nombre);
      }
      return prevItems.map((item) =>
        item.nombre === nombre ? { ...item, cantidad } : item
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};
