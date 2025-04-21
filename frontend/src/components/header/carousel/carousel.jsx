// src/components/HeroCarousel.jsx
// Importamos los componentes necesarios de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
// Importamos los módulos de Swiper que necesitamos: Autoplay para la reproducción automática y EffectFade para la transición con desvanecimiento
import { Autoplay, EffectFade } from 'swiper/modules';
// Importamos los estilos base de Swiper y los estilos específicos para el efecto fade
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroCarousel() {
    return (
        // Contenedor principal del carrusel, posicionado absolutamente con z-index 10
        <div className="absolute inset-0 z-10">
            {/* Configuración del componente Swiper */}
            <Swiper
                // Habilitamos los módulos de autoplay y efecto fade
                modules={[Autoplay, EffectFade]}
                // Aplicamos el efecto de desvanecimiento entre slides
                effect="fade"
                // Habilitamos el bucle infinito
                loop={true}
                // Configuración del autoplay:
                // - delay: 5000ms (5 segundos) entre cada transición
                // - disableOnInteraction: false permite que el autoplay continúe incluso después de la interacción del usuario
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                // Clase para que el carrusel ocupe todo el ancho y alto disponible
                className="w-full h-full"
            >
                {/* Slides individuales del carrusel */}
                <SwiperSlide>
                    <img
                        src="/Images/carousel1.svg"
                        // object-cover asegura que la imagen cubra todo el espacio sin deformarse
                        className="w-full h-full object-cover"
                        alt="Slide 1"
                    />

                </SwiperSlide>
                {/* Repetimos la estructura para cada slide */}
                <SwiperSlide>
                    <img
                        src="/Images/carousel2.svg"
                        className="w-full h-full object-cover"
                        alt="Slide 2"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/Images/carousel3.svg"
                        className="w-full h-full object-cover"
                        alt="Slide 3"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/Images/carousel4.svg"
                        className="w-full h-full object-cover"
                        alt="Slide 4"
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
