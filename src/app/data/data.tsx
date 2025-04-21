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
    { label: "Tienda 1", link: "/tiendas/tienda1", description: "Tu tienda de confianza con productos de calidad." },
    { label: "Tienda 2", link: "/tiendas/tienda2", description: "Ofertas exclusivas y atención personalizada." },
    { label: "Tienda 3", link: "/tiendas/tienda3", description: "Amplio catálogo de productos disponibles para ti." },
    { label: "Tienda 4", link: "/tiendas/tienda3", description: "Amplio catálogo de productos disponibles para ti." },

  ],
  Domicilios: [
    { label: "Domicilio 1", link: "/domicilios/domicilio1", description: "Entrega rápida y segura hasta la puerta de tu casa." },
    { label: "Domicilio 2", link: "/domicilios/domicilio2", description: "Servicio confiable en cualquier momento del día." },
  ],
};

export { navigationMenu };
