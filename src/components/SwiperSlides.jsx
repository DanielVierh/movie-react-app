// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';

export default function SwiperSlides({ headline, images }) {
  return (
    <>
      <h3 className="text-xl font-semibold mb-2">{headline}</h3>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper text-white"
      >
        {images.map((image) => {
          return (
            <SwiperSlide key={image.file_path}>
              <img
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                alt="Bild"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
