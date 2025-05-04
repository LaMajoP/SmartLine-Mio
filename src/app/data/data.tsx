interface navigationMenu {
  label: string;
  link: string;
  description: string;
}

const navigationMenu: { [key: string]: navigationMenu[] } = {
  Productos: [
    { label: "Comida Rápida", link: "/productos/comida-rapida", description: "Disfruta de las mejores opciones de comida rápida." },
    { label: "Café", link: "/productos/cafe", description: "Descubre una selección de cafés premium." },
    { label: "Parrilla", link: "/productos/parrilla", description: "Comida hecha a la parrilla con una experiencia al aire libre." },
    { label: "Menú del Día", link: "/productos/menu-del-dia", description: "Elige entre opciones deliciosas y frescas para tu comida diaria." },
  ],  
  Tiendas: [
    { label: "Kioscos", link: "/tiendas/tienda1", description: "Encuentra snacks, bebidas y antojos al instante, justo cuando los necesitas." },
    { label: "Embarcadero", link: "/tiendas/tienda2", description: "Descubre productos únicos y atención cercana en un ambiente acogedor." },
    { label: "Arcos", link: "/tiendas/tienda3", description: "Todo lo que buscas en un solo lugar, con variedad y calidad garantizadas." },
    { label: "Punto WOK", link: "/tiendas/tienda3", description: "Sabores orientales frescos y rápidos, perfectos para tu día a día." },
    { label: "Punto Sandwich", link: "/tiendas/tienda3", description: "Deliciosos sándwiches hechos al momento, con ingredientes frescos y saludables." },
    { label: "Terraza Living", link: "/tiendas/tienda3", description: "Un espacio moderno donde el buen gusto y el descanso se encuentran." },
    { label: "Escuela", link: "/tiendas/tienda3", description: "Calidad gastronómica con el sello de la Escuela de Cocina, hecha por estudiantes." },
    { label: "Banderitas", link: "/tiendas/tienda3", description: "Sabores tradicionales y atención cercana en un ambiente amigable." },
    { label: "Cipreses", link: "/tiendas/tienda3", description: "Variedad de opciones con el mejor sabor, ideal para cualquier momento del día." }
    
  ],
  Domicilios: [
    { label: "Realizar Domicilio", link: "/domicilios/domicilio1", description: "Entrega rápida y segura hasta la puerta de tu casa." },
    { label: "Historial de domicilios", link: "/domicilios/domicilio2", description: "Servicio confiable en cualquier momento del día." },
  ],
};

export { navigationMenu };
