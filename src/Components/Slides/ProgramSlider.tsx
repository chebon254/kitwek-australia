"use client"
import React, { useState } from 'react';
import { Users, CircleDot, Users2, Target } from 'lucide-react';

const ProgramSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const programs = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Events",
      description: "Cultural Events: Join us for vibrant gatherings celebrating our rich traditions through music, dance, and authentic cuisine. Experience the warmth of community at our regular cultural nights, festivals, and special celebrations.",
      bgColor: "bg-gray-800"
    },
    {
      icon: <CircleDot className="w-8 h-8 text-white" />,
      title: "Sports",
      description: "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
      bgColor: "bg-emerald-600"
    },
    {
      icon: <Users2 className="w-8 h-8 text-white" />,
      title: "Conference",
      description: "Bridging cultures through meaningful engagement with the wider community. Our cultural exchange initiatives, collaborative events, and educational programs foster understanding and celebrate diversity.",
      bgColor: "bg-red-400"
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Mentorship",
      description: "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
      bgColor: "bg-blue-600"
    }
  ];

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  // };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Programs</h1>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {programs.map((program, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-4"
              >
                <div className={`${program.bgColor} rounded-lg p-8 h-[300px] flex flex-col`}>
                  <div className="mb-4">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {program.title}
                  </h3>
                  <p className="text-white/90">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {programs.map((_, index) => (
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