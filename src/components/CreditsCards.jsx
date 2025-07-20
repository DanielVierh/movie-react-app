import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const CreditsCard = ({ data }) => {
  console.log("CreditCard Data", data);

  return (
    <Swiper
      navigation={true}
      slidesPerView={3}
      spaceBetween={20}
      modules={[Navigation]}
      className="mySwiper text-white"
    >
      {data.map((credit) => {
        return (
          <SwiperSlide key={credit.id}>
            <img
              className="w-100"
              src={
                credit.profile_path
                  ? `https://image.tmdb.org/t/p/w300${credit.profile_path}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      credit.name
                    )}&background=random`
              }
              alt={credit.name}
            />
            <p className="text-center">{credit.name}</p>
            <p className="text-blue-300 text-xs text-center">
              ({credit.character ? credit.character : "?"})
            </p>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default CreditsCard;
