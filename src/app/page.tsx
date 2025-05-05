'use client';
import RegisterForm from "@/app/components/RegisterForm";
import Header from "@/app/components/header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  // Función que se pasa al formulario para actualizar el estado
  const handleRegisterSuccess = () => {
    setRegistered(true);
  };

  return (
    <>
      {!registered ? (
        <RegisterForm onSuccess={handleRegisterSuccess} />
      ) : (
        <main className="bg-gray-50 h-screen overflow-hidden">
          <Header />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-8 h-[calc(100vh-112px)]">
            {/* Columna izquierda con scroll interno, ahora ocupa 60% del espacio */}
            <div className="grid grid-cols-2 gap-8 md:col-span-3 space-y-8 overflow-y-auto">
              {/* Favoritos */}
              <section className="bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="font-semibold text-2xl mb-6 text-gray-800">
                  ♡ Favoritos (Top 3)
                </h2>
                <div className="pt-5 flex gap-8">
                  {[
                    {
                      img: "https://www.simplyrecipes.com/thmb/cgJTtVSTy-ftI1dBM4P2x2FJf14=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Bacon-Cheeseburger-LEAD-2b-6606850da0164612b5fb406a0e33f8df.jpg",
                      title: "Bacon Cheese Burger",
                      price: "$19.500",
                      rank: "1",
                    },
                    {
                      img: "https://www.paulinacocina.net/wp-content/uploads/2017/10/frenchfries-1200x900.jpg",
                      title: "Porción de Papas",
                      price: "$5.000",
                      rank: "2",
                    },
                    {
                      img: "https://m.media-amazon.com/images/I/81ceCCYnZmL._SL1500_.jpg",
                      title: "Pepsi Wild Cherry",
                      price: "$4.000",
                      rank: "3",
                    },
                  ].map(({ img, title, price, rank }) => (
                    <div key={rank} className="text-center text-sm ">
                      <img
                        src={img}
                        alt={title}
                        className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                      />
                      <p className="font-medium text-gray-700">{title}</p>
                      <p className="text-gray-500">{price}</p>
                      <p className="text-2xl font-bold text-blue-600">{rank}</p>
                    </div>
                  ))}
                </div>
              </section>
  
              {/* Categorías populares */}
              <section className="bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="font-semibold text-2xl mb-6 text-gray-800">
                  ☆ Categorías populares
                </h2>
                <div className="pt-10 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                  {[
                    "Comida Rápida",
                    "Cafeterías",
                    "Menú del día",
                    "Platos a la carta",
                  ].map((cat) => (
                    <button
                      key={cat}
                      className="bg-blue-50 text-blue-700 font-medium px-6 py-3 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all duration-300 text-center w-full cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
  
              {/* Historial de Compras */}
              <section className="bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="font-semibold text-2xl mb-6 text-gray-800">
                  ← Historial de Compras
                </h2>
                <div className="pt-5 grid grid-cols-2 gap-8">
                  {[
                    {
                      id: 1,
                      title: "Bacon Cheese Burger",
                      price: "$19.500",
                      img: "https://www.simplyrecipes.com/thmb/cgJTtVSTy-ftI1dBM4P2x2FJf14=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Bacon-Cheeseburger-LEAD-2b-6606850da0164612b5fb406a0e33f8df.jpg",
                    },
                    {
                      id: 2,
                      title: "Porción de Papas",
                      price: "$5.000",
                      img: "https://www.paulinacocina.net/wp-content/uploads/2017/10/frenchfries-1200x900.jpg",
                    },
                    {
                      id: 3,
                      title: "Pepsi Wild Cherry",
                      price: "$4.000",
                      img: "https://m.media-amazon.com/images/I/81ceCCYnZmL._SL1500_.jpg",
                    },
                    {
                      id: 4,
                      title: "Wrap de Pollo",
                      price: "$14.000",
                      img: "https://www.eatingwell.com/thmb/kvgCrxKhAtLwG9NTugifTXamdoc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EW-Veggie-Wrap-hero-1x1-15189_preview_maxWidth_4000_maxHeight_4000_ppi_300_quality_100-4e96432654934ca0a769a29756b122d4.jpg",
                    },
                  ].map(({ id, title, price, img }) => (
                    <div
                      key={id}
                      className="flex items-center gap-6 border-2 rounded-2xl p-2 border-gray-300"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-700">{title}</p>
                        <p className="text-gray-500 text-sm">{price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
  
              {/* Califica Servicio */}
              <section className=" p-6 rounded-xl shadow-2xl bg-white h-fit">
                <h2 className="font-semibold text-2xl mb-6 text-gray-800">
                  ☆ Califica Nuestro Servicio
                </h2>
                <div className="pt-5">
                  <div className="flex justify-center gap-2 text-yellow-400 text-3xl mb-3">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <textarea
                    className="w-full p-4 rounded-md border border-gray-300 mb-6 text-sm"
                    placeholder="Agrega una sugerencia que tengas para nosotros"
                  />
  
                  <p className="text-center text-sm text-gray-600">
                    ¿Qué tal estuvo tu última compra?
                  </p>
                </div>
              </section>
            </div>
  
            {/* Columna derecha con la imagen, ahora ocupa el 40% del espacio */}
            <div className="md:col-span-2 flex items-center justify-center overflow-hidden">
              <img
                src="https://solicitudesgh.unisabana.edu.co/assets/global/images/background/e0ca904fca686415370cbee0f135183a.jpg"
                alt="Campus"
                className="rounded-2xl shadow-xl w-[85%] max-w-[900px] object-cover h-full object-center"
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
}