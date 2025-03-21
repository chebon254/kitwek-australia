"use client";

import Footer from "@/components/Footer/Footer";
import ProgramSlider from "@/components/Slides/ProgramSlider";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const objectives = [
  {
    id: 1,
    content_title: "Cultural Preservation & Identity",
    content:
      "Organize cultural events, festivals, and traditional ceremonies. Teach Kalenjin language, music, and history to younger generations. Promote traditional values such as respect, unity, and hard work.",
  },
  {
    id: 2,
    content_title: "Community Support & Welfare",
    content:
      "Establish support networks for new migrants and students. Provide assistance during life events (births, weddings, funerals). Offer mentorship and career guidance programs.",
  },
  {
    id: 3,
    content_title: "Education & Youth Empowerment",
    content:
      "Organize academic support programs and scholarships. Encourage participation in sports, leadership, and professional networking. Host motivational talks from successful Kalenjin professionals.",
  },
  {
    id: 4,
    content_title: "Economic Empowerment & Networking",
    content:
      "Support entrepreneurship and business development within the community. Connect members to job opportunities and skill development programs. Create savings and investment groups (e.g., Chamas).",
  },
  {
    id: 5,
    content_title: "Integration & Collaboration",
    content:
      "Partner with other African and Australian organizations. Participate in multicultural events to showcase Kalenjin heritage. Promote civic engagement and representation in local government affairs.",
  },
];

export default function About() {
  // Scroll reveal hooks
  const [bannerRef, bannerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [galleryRef, galleryInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [missionRef, missionInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <main className="relative z-10">
        {/* Banner */}
        {/* Banner */}
        <div className="h-[380px] w-full bg-[#ED6868]">
          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 pt-[120px] md:pt-[180px] lg:px-8"
            ref={bannerRef}
            initial="hidden"
            animate={bannerInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h1 className="font-bold text-4xl md:text-6xl text-white mb-5 text-center">
              About Us
            </h1>
            <p className="font-medium text-white text-base text-center font-[family-name:var(--font-lora-sans)] max-w-2xl mx-auto">
              A vibrant community fostering connections, celebrating culture and
              thriving together.
            </p>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <div className="w-full relative z-10" ref={galleryRef}>
          <div className="w-full absolute z-10 top-0 bg-[#ED6868] h-2/4"></div>
          <motion.div
            className="flex items-center justify-center flex-wrap relative z-20 gap-4 px-4"
            variants={staggerChildren}
            initial="hidden"
            animate={galleryInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Image
                src={"/ui-assets/holding-potraits.png"}
                height={378}
                width={350}
                alt="Community portraits"
                className="max-w-[350px] min-w-[280px] w-full rounded-3xl outline-none hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Image
                src={"/ui-assets/awards.png"}
                height={222}
                width={280}
                alt=""
                className="max-w-[280px] min-w-[280px] m-4 w-full rounded-3xl outline-none hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Image
                src={"/ui-assets/sport-group-photo.png"}
                height={378}
                width={306}
                alt=""
                className="max-w-[306px] min-w-[280px] m-4 w-full rounded-3xl outline-none hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Image
                src={"/ui-assets/perfomance-group-photo.png"}
                height={226}
                width={281}
                alt=""
                className="max-w-[281px] min-w-[280px] m-4 w-full rounded-3xl outline-none hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            {/* Repeat similar motion.div wrapper for other images */}
          </motion.div>
        </div>

        {/* Missions */}
        <div className="w-full py-8 md:py-16 px-4" ref={missionRef}>
          <motion.div
            className="max-w-7xl mx-auto overflow-hidden rounded-3xl bg-[#000099] bg-[url(/ui-assets/star.png)] bg-cover bg-no-repeat"
            variants={fadeInUp}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
          >
            <div className="h-full w-full bg-[#00009988] py-12 md:py-24 px-5">
              <h1 className="font-bold text-4xl md:text-6xl leading-tight md:leading-[80px] text-white">
                Our Mission and Vision
              </h1>
              <div className="flex flex-col md:flex-row items-start flex-wrap justify-between gap-8 pt-8 md:pt-16">
                <motion.p
                  className="font-bold text-base w-full min-w-[280px]  max-w-[500px] my-4 leading-6 font-[family-name:var(--font-lora-sans)]  text-white"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <strong>Mission: </strong>To foster unity, cultural
                  preservation, and social empowerment among the Kalenjin
                  community in Victoria, Australia, by providing support
                  networks, promoting economic and educational opportunities,
                  raising mental health awareness, and celebrating our rich
                  heritage while integrating into the broader Australian
                  Society.
                </motion.p>
                <motion.p
                  className="font-bold w-full max-w-[500px] min-w-[280px] text-base my-4 leading-6 font-[family-name:var(--font-lora-sans)] text-white"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <strong>Vision: </strong>To build a strong, united, and
                  thriving Kalenjin community in Victoria, Australia, by
                  fostering cultural preservation, social empowerment, and
                  economic advancement while promoting inclusivity and
                  integration within the broader Australian society.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Programs Slider */}
        <div className="w-full">
          <ProgramSlider />
        </div>

        {/* Contact */}
        <div className="w-full">
          <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              Key Pillars of the Kitwek Victoria
            </h2>

            {/* Objectives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {objectives.map((objective, index) => (
                <motion.div
                  key={objective.id}
                  className={`overflow-hidden rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                    index === 1
                      ? "bg-[url(/ui-assets/line-waves2.png)] bg-cover bg-no-repeat"
                      : "bg-[#FFFFFF]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div
                    className={`p-10 h-full w-full ${
                      index === 1 ? "bg-[#018c52e5] text-white" : "bg-[#F5F5F5]"
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-start">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={`${index === 1 ? "#ffffff" : "#CDCDCD"}`}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.2969 9.79688L11.2969 15.7969C10.8562 16.2375 10.1438 16.2375 9.70781 15.7969L6.70781 12.7969C6.26719 12.3562 6.26719 11.6438 6.70781 11.2078C7.14844 10.7719 7.86094 10.7672 8.29688 11.2078L10.5 13.4109L15.7031 8.20312C16.1437 7.7625 16.8562 7.7625 17.2922 8.20312C17.7281 8.64375 17.7328 9.35625 17.2922 9.79219L17.2969 9.79688Z" />
                        </svg>
                        <h2
                          className={`text-2xl ml-4 font-semibold ${
                            index === 1 ? " text-white" : "text-black"
                          }`}
                        >
                          {objective.content_title}
                        </h2>
                      </div>
                      <br />
                      <div className="py-2">
                        <p className="font-bold  leading-5 font-[family-name:var(--font-lora-sans)] text-lg ">
                          {objective.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              className="relative mt-20"
              ref={ctaRef}
              variants={fadeInUp}
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
            >
              <div className="bg-[url(/ui-assets/line-waves.png)] bg-cover bg-center bg-no-repeat">
                <div className="h-full w-full bg-[#ed6868e0] rounded-2xl py-10 overflow-hidden">
                  <div className="relative z-10 px-6 py-12 text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-bold w-full max-w-[480px] mx-auto mb-7">
                      Join our growing network of over 500+ people
                    </h3>
                    <Link
                      href={"/contact-us"}
                      className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                    >
                      Get in touch
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
