"use client";
import Header from "../components/header";
import React, { useState } from "react";
import Link from "next/link";

const restaurantes = [
    {
        nombre: "Arcos",
        descripcion:
            "Disfruta de un ambiente familiar y un menú variado de comida rápida, ideal para compartir con amigos y familia en cualquier momento del día.",
        imagen:
            "https://www.gourmet.cl/wp-content/uploads/2021/08/Budha_Adaptada_Gourmet.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1038.0946900679555!2d-74.03377137592786!3d4.858860505056536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87e4a615848d%3A0x5114289dae222e72!2sArcos!5e0!3m2!1sen!2sco!4v1747417076240!5m2!1sen!2sco"
    },
    {
        nombre: "Embarcadero",
        descripcion: "Un espacio acogedor junto al lago, perfecto para relajarse y disfrutar de postres y bebidas en un entorno natural y tranquilo.",
        imagen:
            "https://upload.wikimedia.org/wikipedia/commons/6/68/Vista_del_area_de_%22Embarcadero%22_en_la_Universidad_de_La_Sabana.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d744.2142986389908!2d-74.03218464307498!3d4.860620900056581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87fe732e6119%3A0x685bb32fadedbf4c!2sEmbarcadero!5e0!3m2!1sen!2sco!4v1747417213320!5m2!1sen!2sco",
    },
    {
        nombre: "Escuela",
        descripcion: "Vive la experiencia de la cocina académica, donde los estudiantes aplican sus conocimientos preparando platos innovadores y deliciosos en un entorno real.",
        imagen:
            "https://thetasterbogota.wordpress.com/wp-content/uploads/2013/03/restaurante-escuela.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1077.9032650234858!2d-74.03422133568456!3d4.861826720749501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87fef1d5d3c1%3A0x6ddbbb9e88c8ed0!2sRestaurante%20Escuela%20-%20Universidad%20de%20la%20Sabana!5e0!3m2!1sen!2sco!4v1747418925744!5m2!1sen!2sco"
    },
    {
        nombre: "Terraza living",
        descripcion: "Un lugar moderno y al aire libre, ideal para disfrutar de una gran variedad de postres y repostería artesanal en un ambiente relajado.",
        imagen:
            "https://www.gourmet.cl/wp-content/uploads/2021/08/Budha_Adaptada_Gourmet.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d533.8609572662378!2d-74.03262132391059!3d4.862693258966694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f876f2022dca1%3A0x1bf17fe9de6b28d3!2sTerraza%20Living%20Lab!5e0!3m2!1sen!2sco!4v1747418970327!5m2!1sen!2sco",
    },
    {
        nombre: "Kioskos",
        descripcion: "Diversos puntos de venta con opciones rápidas y deliciosas para quienes buscan practicidad sin sacrificar el sabor.",
        imagen:
            "https://carneselgourmet.com/images/banner_bienvenida529x350.jpg?crc=472820715  ",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1841.9960491298177!2d-74.03597514788845!3d4.860242862654422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87feaf8aa971%3A0xc935f261c057fae8!2sKioskos!5e0!3m2!1sen!2sco!4v1747419029877!5m2!1sen!2sco"
    },
    {
        nombre: "Punto WOK",
        descripcion: "Sabores orientales y platos frescos preparados al instante, ideales para quienes buscan una opción diferente y saludable.",
        imagen:
            "https://www.risoli.com/wp-content/uploads/2023/02/edit-Pentolino-Granito-Gran-Gourmet-senza-coperchio-2-1.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1841.995940805801!2d-74.03376797908653!3d4.860282488464917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87fe81b4419b%3A0x186d43e4b0b930fc!2sPunto%20Wok!5e0!3m2!1sen!2sco!4v1747419075265!5m2!1sen!2sco"
    },
    {
        nombre: "Banderitas",
        descripcion: "Un rincón tradicional con opciones típicas y sabores caseros, perfecto para quienes buscan una experiencia auténtica.",
        imagen:
            "https://www.gastronomistas.com/wp-content/uploads/PimientaDulce_Pizza-Margherita.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d248.46758724967845!2d-74.0335103825307!3d4.858690121071899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sco!4v1747419195431!5m2!1sen!2sco"
    },
    {
        nombre: "Cipreses",
        descripcion: "Ambiente tranquilo y menú variado, ideal para quienes buscan una comida relajada y de calidad.",
        imagen:
            "https://hips.hearstapps.com/hmg-prod/images/perritos-calientes-restaurante-bubbledogs-elle-gourmet-2-659f914186c0d.jpg?crop=0.89xw:1xh;center,top&resize=1200:*",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d442.5216088484766!2d-74.03491886386645!3d4.860776914706489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f871ff1edf4e5%3A0x7bdb5a1a0c724bd0!2sPunto%20Pizza!5e0!3m2!1sen!2sco!4v1747419253254!5m2!1sen!2sco"
    },
    {
        nombre: "Punto Sándwich",
        descripcion: "Especialidad en sándwiches frescos y snacks rápidos, perfectos para una comida ligera y deliciosa.",
        imagen:
            "https://usil-blog.s3.amazonaws.com/PROD/blog/image/dia-sandwich.jpg",
        mapa:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d288.0605833117674!2d-74.03378145821941!3d4.860621973296108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f87fe82b5dd2b%3A0xb71e04f392677577!2sPunto%20Sandwich!5e0!3m2!1sen!2sco!4v1747419310168!5m2!1sen!2sco"
    },
];

function RestauranteCard({ restaurante }: { restaurante: any }) {
    const [mapLoaded, setMapLoaded] = useState(false);

    return (
        <div className="group bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
            {/* Imagen */}
            <div className="w-full md:w-1/2 h-56 md:h-auto overflow-hidden flex-shrink-0">
                <img
                    src={restaurante.imagen}
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            {/* Info y mapa */}
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1 sm:mb-2 text-center md:text-left">
                        {restaurante.nombre}
                    </h2>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-justify text-sm sm:text-base">
                        {restaurante.descripcion}
                    </p>
                </div>
                <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden shadow border border-blue-100">
                    {!mapLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
                            <span className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></span>
                            <div className="text-center text-base sm:text-lg text-gray-500">Cargando mapas...</div>
                        </div>
                    )}
                    <iframe
                        src={restaurante.mapa}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa de ${restaurante.nombre}`}
                        onLoad={() => setMapLoaded(true)}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default function RestaurantsPage() {
    return (
        <main className="min-h-screen pb-10 bg-gray-100">
            <Header />
            <section className="py-8 sm:py-12">
                <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 max-w-6xl mx-auto px-2 sm:px-4">
                    {restaurantes.map((restaurante) => (
                        <RestauranteCard key={restaurante.nombre} restaurante={restaurante} />
                    ))}
                    {/* Tarjeta para ir a productos */}
                    <Link
                        href="/products"
                        className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300 cursor-pointer focus:outline-none"
                    >
                        <div className="w-full md:w-1/2 h-56 md:h-auto overflow-hidden flex items-center justify-center bg-blue-200 flex-shrink-0">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                                alt="Productos"
                                className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-80"
                            />
                        </div>
                            <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1 text-center">
                                Ir a conocer los productos...
                            </h2>
                            <p className="text-gray-600 mb-2 text-center text-sm sm:text-base">
                                Descubre la variedad de productos que ofrecen todos los restaurantes.
                            </p>
                            <span
                                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm sm:text-base"
                            >
                                Ver productos
                            </span>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}