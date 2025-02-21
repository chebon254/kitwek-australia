"use client"
import React, { useState, useEffect } from 'react';
import { Users, CircleDot, Users2, Target } from 'lucide-react';

interface Program {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const ProgramSlider = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  // Update slides per view based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) { // lg
        setSlidesPerView(4);
      } else if (window.innerWidth >= 768) { // md
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const programs: Program[] = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Events",
      description: "Cultural Events: Join us for vibrant gatherings celebrating our rich traditions through music, dance, and authentic cuisine. Experience the warmth of community at our regular cultural nights, festivals, and special celebrations.",
      bgColor: "bg-[#2C2C2C]"
    },
    {
      icon: <CircleDot className="w-8 h-8 text-white" />,
      title: "Sports",
      description: "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
      bgColor: "bg-[#018C51]"
    },
    {
      icon: <Users2 className="w-8 h-8 text-white" />,
      title: "Conference",
      description: "Bridging cultures through meaningful engagement with the wider community. Our cultural exchange initiatives, collaborative events, and educational programs foster understanding and celebrate diversity.",
      bgColor: "bg-[#ED6868]"
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Mentorship",
      description: "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
      bgColor: "bg-[#0511F3]"
    }
  ];

  const getTranslateX = () => {
    const slideWidth = 100 / slidesPerView;
    return currentSlide * slideWidth;
  };

  const goToSlide = (index: number) => {
    const maxSlide = Math.ceil(programs.length / slidesPerView) - 1;
    if (index <= maxSlide) {
      setCurrentSlide(index);
    }
  };

  const maxDots = Math.ceil(programs.length / slidesPerView);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Programs</h1>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${getTranslateX()}%)` }}
          >
            {programs.map((program, index) => (
              <div
                key={index}
                className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-4"
              >
                <div className={`${program.bgColor} rounded-lg p-8 min-h-[460px] h-fit flex flex-col`}>
                  <div className="mb-4">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {program.title}
                  </h3>
                  <p className="text-white font-bold text-base leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(maxDots)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-emerald-600 w-8' 
                  : 'bg-gray-300'
              }`}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramSlider;