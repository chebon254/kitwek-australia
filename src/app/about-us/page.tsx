import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import ProgramSlider from "@/Components/Slides/ProgramSlider";
import Image from "next/image";
import React from "react";
import { Check } from "lucide-react";

const objectives = [
  {
    id: 1,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
  {
    id: 2,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
  {
    id: 3,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
  {
    id: 4,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
  {
    id: 5,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
  {
    id: 6,
    content:
      "Uniting people through friendly competition and active living. From our popular athletics programs to family fun days, we create opportunities for fitness, friendship, and team building across all age groups.",
  },
];

export default function about() {
  return (
    <>
      <Navbar className="bg-white text-[#2C2C2C]" />
      <main className="relative z-10">
        {/* Banner */}
        <div className="h-[380px] w-full bg-[#ED6868]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[180px] lg:px-8">
            <h1 className="font-bold text-6xl text-white mb-5 text-center">
              About Us
            </h1>
            <p className="font-medium text-white text-base text-center font-[family-name:var(--font-lora-sans)]">
              A vibrant community fostering connections, celebrating culture and
              thriving together.
            </p>
          </div>
        </div>
        <div className="w-full relative z-10">
          <div className="w-full absolute z-10 top-0 bg-[#ED6868] h-2/4"></div>
          <div className="flex items-center justify-center flex-wrap relative z-20">
            <Image
              src={"/ui-assets/holding-potraits.png"}
              height={378}
              width={350}
              alt=""
              className="max-w-[350px] min-w-[280px] m-4 w-full rounded-3xl outline-none"
            />
            <Image
              src={"/ui-assets/awards.png"}
              height={222}
              width={280}
              alt=""
              className="max-w-[280px] min-w-[280px] m-4 w-full rounded-3xl outline-none"
            />
            <Image
              src={"/ui-assets/sport-group-photo.png"}
              height={378}
              width={306}
              alt=""
              className="max-w-[306px] min-w-[280px] m-4 w-full rounded-3xl outline-none"
            />
            <Image
              src={"/ui-assets/perfomance-group-photo.png"}
              height={226}
              width={281}
              alt=""
              className="max-w-[281px] min-w-[280px] m-4 w-full rounded-3xl outline-none"
            />
          </div>
        </div>

        {/* Missions */}
        <div className="w-full py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl bg-[#000099] bg-[url(/ui-assets/star.png)] bg-cover bg-no-repeat">
            <div className="h-full w-full bg-[#00009988] py-7 px-5">
              <h1 className="font-bold text-6xl leading-[80px] text-white">
                Our Misson and Vison
              </h1>
              <div className="flex items-start justify-between pt-16">
                <p className="font-bold text-base leading-5 text-white font-[family-name:var(--font-lora-sans)]">
                  Granting our members the privilege of belonging to a holistic
                  community that fosters growth through mentorship, networking
                  and empowerment
                </p>
                <p className="font-bold text-base leading-5 text-white font-[family-name:var(--font-lora-sans)]">
                  Granting our members the privilege of belonging to a holistic
                  community that fosters growth through mentorship, networking
                  and empowerment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="w-full">
          <ProgramSlider />
        </div>

        {/* Contact */}
        <div className="w-full">
          <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              Key Objectives
            </h2>

            {/* Objectives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {objectives.map((objective, index) => (
                <div
                  key={objective.id}
                  className={`p-6 rounded-lg bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md ${
                    index === 1 ? "bg-emerald-600 text-white" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-1 ${
                        index === 1 ? "text-white" : "text-emerald-600"
                      }`}
                    />
                    <p className="text-base leading-relaxed">
                      {objective.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="relative mt-20">
              <div className="bg-red-400 rounded-2xl overflow-hidden">
                <div className="relative z-10 px-6 py-12 text-center text-white">
                  <h3 className="text-3xl font-bold mb-4">
                    Join our growing network
                  </h3>
                  <p className="text-xl mb-8">of over 500+ people</p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                    Get in touch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
      </main>
      <Footer />
    </>
  );
}
