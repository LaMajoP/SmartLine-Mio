"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Producto = {
  nombre: string;
  precio: number;
  descripcion: string;
};

const CartItems = () => {
  const { items, removeItem, clearCart, addItem, updateItemQuantity, deleteItem } = useCart();

  const [localQuantities, setLocalQuantities] = useState<{ [key: string]: string }>({});

  // Sincronizar localQuantities cada vez que items cambia
  useEffect(() => {
    setLocalQuantities(
      Object.fromEntries(items.map((item) => [item.nombre, item.cantidad.toString()]))
    );
  }, [items]);

  const handleChange = (nombre: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setLocalQuantities((prev) => ({ ...prev, [nombre]: value }));
    }
  };

  const handleBlur = (nombre: string) => {
    const cantidad = parseInt(localQuantities[nombre], 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      updateItemQuantity(nombre, 1);
    } else {
      updateItemQuantity(nombre, cantidad);
    }
  };

  const handleIncrease = (producto: Producto) => {
    addItem(producto);
  };

  const handleDecrease = (nombre: string) => {
    removeItem(nombre);
  };

  const handleDelete = (nombre: string) => {
    deleteItem(nombre);
  };

  const userId = "TU_USER_ID_AQUI"; // Reemplaza por el userId real del usuario autenticado

  const handlePay = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/historial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productos: items }), // items incluye nombre, cantidad, etc.
      });
      alert("¡Gracias por tu compra!");
      clearCart();
      // Opcional: recarga productos para actualizar stock en pantalla
      window.location.reload();
    } catch (err) {
      alert("Error al registrar la compra");
    }
  };

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  if (items.length === 0)
    return <p className="text-sm text-gray-500">El carrito está vacío.</p>;

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.nombre}
          className="flex justify-between items-center border-b pb-4 mb-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col">
            <p className="font-bold text-xl text-gray-800">{item.nombre}</p>
            <p className="text-sm text-gray-600">Precio: ${item.precio}</p>
            <p className="text-xs text-gray-500">Descripción: {item.descripcion}</p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDecrease(item.nombre)}
              className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 transform hover:scale-110"
            >
              <FaMinus />
            </button>

            <input
              type="number"
              min="1"
              className="w-16 text-center border rounded-md p-1 text-gray-800 font-medium"
              value={localQuantities[item.nombre] ?? item.cantidad.toString()}
              onChange={(e) => handleChange(item.nombre, e.target.value)}
              onBlur={() => handleBlur(item.nombre)}
            />

            <button
              onClick={() => handleIncrease(item)}
              className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-110"
            >
              <FaPlus />
            </button>
          </div>

          <button
            onClick={() => handleDelete(item.nombre)} // eliminar el producto completamente
            className="text-red-500 text-sm hover:underline font-medium ml-4 hover:text-red-700 transition duration-300"
          >
            Quitar
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 text-lg font-bold text-gray-800">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handlePay}
        className="w-full py-3 mt-4 text-white bg-black rounded-lg hover:bg-gray-900 transition duration-300 text-lg font-semibold"
      >
        Pagar
      </button>

      <button
        onClick={clearCart}
        className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 text-sm mt-2"
      >
        Vaciar carrito
      </button>
    </div>
  );
};

export default CartItems;

// Después de await productoRef.update({ stock: nuevoStock });
