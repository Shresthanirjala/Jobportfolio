import React from "react";
import Slider from "react-slick"; // Import Slider component from react-slick

// Import Slick Carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopNiches = () => {
  const companies = [
    { id: 1, imgSrc: "/images/company.png", alt: "Company 1" },
    { id: 2, imgSrc: "/images/company.png", alt: "Company 2" },
    { id: 3, imgSrc: "/images/company.png", alt: "Company 3" },
    { id: 4, imgSrc: "/images/company.png", alt: "Company 4" },
    { id: 5, imgSrc: "/images/company.png", alt: "Company 5" },
    { id: 6, imgSrc: "/images/company.png", alt: "Company 6" },
  ];

  // React Slick settings
  const settings = {
    dots: false, // Show dots for navigation
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 4, // Number of slides visible at once
    slidesToScroll: 1, // Number of slides to scroll at a time
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // 2 slides on medium screens
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // 1 slide on small screens
        },
      },
    ],
  };

  return (
    <div className="mt-[100px]">
      <div className="bg-[#DBE7E7] w-full h-full">
        <div className="flex flex-col justify-center items-center">
          <div className="mt-5 text-center">
            <h2 className="text-[#718B68] text-xs">Full Time Job</h2>
            <h1 className="text-[20px] md:text-[20px] font-bold leading-tight text-[#013954]">
              Top Employers Hiring Now
            </h1>
          </div>

          {/* React Slick Slider */}
          <div className="mt-4 w-full px-4">
            <Slider {...settings}>
              {companies.map((company) => (
                <div key={company.id} className="bg-[#FFFFFF] rounded-2xl p-4">
                  <div className="flex justify-center h-[200px]">
                    <img
                      src={company.imgSrc}
                      alt={company.alt}
                      className="w-full h-auto max-w-xs"
                    />
                  </div>
                  <h1>Nverse technology</h1>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNiches;
