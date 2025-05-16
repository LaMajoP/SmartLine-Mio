'use client';
import { useState } from "react";
import Header from "@/app/components/header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Función para manejar el envío del feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setSubmitMessage("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Enviando feedback:', {
        rating,
        comment: feedback,
        restaurant: "Arcos",
        userId: "abc123kfIduXZ80p"
      });

      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: feedback,
          restaurant: "Arcos",
          userId: "abc123kfIduXZ80p"
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      if (!response.ok) {
        throw new Error(data?.error || data?.details || 'Error al enviar el feedback');
      }

      console.log('Respuesta exitosa:', data);
      setSubmitMessage("¡Gracias por tu feedback!");
      setRating(0);
      setFeedback("");
      
    } catch (error: any) {
      console.error("Error detallado:", error);
      setSubmitMessage(
        error instanceof Error ? error.message : "Hubo un error al enviar tu feedback"
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  return (
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
                <div key={rank} className="text-center text-sm">
                  <img
                    src={img}
                    alt={title}
                    className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                  />
                  <p className="font-medium text-gray-700 hover:underline cursor-pointer">{title}</p>
                  <p className="text-gray-500">{price}</p>
                  <p className="text-2xl font-bold text-blue-600">{rank}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Califica Servicio */}
          <section className="p-6 rounded-xl shadow-2xl bg-white h-fit">
            <h2 className="font-semibold text-2xl mb-6 text-gray-800">
              ☆ Califica Nuestro Servicio
            </h2>
            <div className="pt-5">
              <div className="flex justify-center gap-2 text-3xl mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                className="w-full p-4 rounded-md border border-gray-300 mb-4 text-sm"
                placeholder="Agrega una sugerencia que tengas para nosotros"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              {submitMessage && (
                <p className={`text-center text-sm mb-4 ${
                  submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {submitMessage}
                </p>
              )}

              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md ${
                  isSubmitting 
                    ? 'bg-gray-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                ¿Qué tal estuvo tu última compra?
              </p>
            </div>
          </section>

          {/* Historial de Compras */}
          <section className="bg-white p-6 rounded-2xl shadow-xl col-span-2">
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
  );
}