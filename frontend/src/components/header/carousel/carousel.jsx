// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroCarousel() {
    return (
        <div className="absolute inset-0 z-10">
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="w-full h-full"
            >
                <SwiperSlide>
                    <img
                        src="/Images/carousel1.svg"
                        className="w-full h-full object-cover"
                        alt="Slide 1"
                    />
                </SwiperSlide>
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
