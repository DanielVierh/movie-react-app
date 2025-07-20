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
      <h2>{headline}</h2>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper text-white"
      >
        {images.map((image) => {
          console.log('img', image.file_path);
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
