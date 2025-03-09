import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; 


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const TopNiches = () => {
const navigate = useNavigate();

  const companies = [
    {
      id: 1,
      imgSrc: "/images/company.png",
      alt: "Company 1",
      companyname: "N9 Solutions",
    },
    {
      id: 2,
      imgSrc: "/images/company.png",
      alt: "Company 2",
      companyname: "N9 Solutions",
    },
    {
      id: 3,
      imgSrc: "/images/company.png",
      alt: "Company 3",
      companyname: "N9 Solutions",
    },
    {
      id: 4,
      imgSrc: "/images/company.png",
      alt: "Company 4",
      companyname: "N9 Solutions",
    },
    {
      id: 5,
      imgSrc: "/images/company.png",
      alt: "Company 5",
      companyname: "N9 Solutions",
    },
    {
      id: 6,
      imgSrc: "/images/company.png",
      alt: "Company 6",
      companyname: "N9 Solutions",
    },
  ];

  // React Slick settings with improved responsiveness
  const settings = {
    dots: false, 
    infinite: true, 
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablet View
        settings: {
          slidesToShow: 3, 
        },
      },
      {
        breakpoint: 768, // Large Mobile Screens
        settings: {
          slidesToShow: 2, 
        },
      },
      {
        breakpoint: 640, // Small Mobile Screens
        settings: {
          slidesToShow: 1, 
        },
      },
    ],
  };

const handleRedirect = (id) => {
  navigate(`company/${id}`);
}

  return (
    <div className="relative z-10 lg:mt-[100px] mt-[600px]">
      <div className="bg-[#DBE7E7] w-full h-full py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center">
            <h2 className="text-[#718B68] text-xs">Full Time Job</h2>
            <h1 className="text-[20px] md:text-[20px] font-bold leading-tight text-[#013954]">
              Top Employers Hiring Now
            </h1>
          </div>

          {/* React Slick Slider */}
          <div className="mt-6 w-full overflow-hidden">
            <Slider {...settings}>
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={()=>handleRedirect(company.id)}
                  className="bg-[#FFFFFF] rounded-2xl p-4 min-h-[150px] shadow-lg"
                >
                  <div className="flex justify-center">
                    <img
                      src={company.imgSrc}
                      alt={company.alt}
                      className="w-[111px] h-[111px] max-w-xs"
                    />
                  </div>
                  <h1 className="text-center mt-[30px] text-[#013954] text-sm">
                    {company.companyname}
                  </h1>
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
