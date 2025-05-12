interface navigationMenu {
  label: string;
  link: string;
  description: string;
}

const navigationMenu: { [key: string]: navigationMenu[] } = {
  Tiendas: [
    { label: "Kioscos", link: "/tiendas/kioscos", description: "Encuentra snacks, bebidas y antojos al instante, justo cuando los necesitas." },
    { label: "Embarcadero", link: "/tiendas/embarcadero", description: "Descubre productos únicos y atención cercana en un ambiente acogedor." },
    { label: "Arcos", link: "/tiendas/arcos", description: "Todo lo que buscas en un solo lugar, con variedad y calidad garantizadas." },
    { label: "Punto WOK", link: "/tiendas/puntowok", description: "Sabores orientales frescos y rápidos, perfectos para tu día a día." },
    { label: "Punto Sandwich", link: "/tiendas/puntosandwich", description: "Deliciosos sándwiches hechos al momento, con ingredientes frescos y saludables." },
    { label: "Terraza Living", link: "/tiendas/terrazaliving", description: "Un espacio moderno donde el buen gusto y el descanso se encuentran." },
    { label: "Escuela", link: "/tiendas/escuela", description: "Calidad gastronómica con el sello de la Escuela de Cocina, hecha por estudiantes." },
    { label: "Banderitas", link: "/tiendas/banderitas", description: "Sabores tradicionales y atención cercana en un ambiente amigable." },
    { label: "Cipreses", link: "/tiendas/cipreses", description: "Variedad de opciones con el mejor sabor, ideal para cualquier momento del día." }
    
  ],
  Domicilios: [
    { label: "Realizar Domicilio", link: "/domicilios/domicilio1", description: "Entrega rápida y segura hasta la puerta de tu casa." },
    { label: "Historial de domicilios", link: "/domicilios/domicilio2", description: "Servicio confiable en cualquier momento del día." },
  ],
};

export { navigationMenu };
