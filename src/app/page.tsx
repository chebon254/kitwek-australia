"use client";

import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function Home() {
  const [bannerScale, setBannerScale] = useState(1);

  // Scroll reveal hooks
  const [missionRef, missionInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [eventsRef, eventsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [contactRef, contactInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [teamRef, teamInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Banner zoom animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerScale((prev) => (prev === 1 ? 1.1 : 1));
    }, 10000); // Change scale every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <main className="relative z-10">
        {/* Banner with zoom animation */}
        <div className="w-full h-screen relative overflow-hidden">
          <motion.div
            className="w-full z-10 absolute top-0 h-screen bg-[url(/ui-assets/shade.jpeg)] bg-center bg-cover bg-no-repeat"
            animate={{ scale: bannerScale }}
            transition={{ duration: 10, ease: "easeInOut" }}
          ></motion.div>
          <div className="w-full relative z-40 h-screen bg-[#00000055]">
            <div className="w-full h-screen max-w-7xl mx-auto relative px-4">
              <div className="py-20 md:py-40 absolute bottom-0 left-0 text-left">
                <h1 className="font-bold text-4xl md:text-6xl lg:text-8xl leading-tight md:leading-[120px] text-[#F3F3F3] max-w-[560px] w-full">
                  Welcome to Kitwek
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Missions */}
        <div
          className="w-full bg-white pb-20 md:pb-100 relative"
          ref={missionRef}
        >
          <div className="absolute top-0 w-full h-3/5 bg-black bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
            <div className="h-full w-full bg-[#00000055]"></div>
          </div>
          <motion.div
            className="w-full relative z-20 py-10 md:py-20 bg-transparent"
            variants={fadeInUp}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
          >
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-4xl md:text-6xl leading-tight md:leading-[80px] text-white">
                  Our Mission and Vision
                </h1>
                <div className="flex flex-col md:flex-row items-start justify-between pt-8 md:pt-16 gap-4">
                  <p className="font-bold text-base leading-6 my-2 font-[family-name:var(--font-lora-sans)]  text-white">
                   <strong>Mission: </strong>To foster unity, cultural preservation, and social
                    empowerment among the Kalenjin community in Victoria,
                    Australia, by providing support networks, promoting economic
                    and educational opportunities, raising mental health
                    awareness, and celebrating our rich heritage while
                    integrating into the broader Australian Society.
                  </p>
                  <p className="font-bold text-base leading-6 my-2 font-[family-name:var(--font-lora-sans)]  text-white">
                    <strong>Vision: </strong>To build a strong, united, and thriving Kalenjin community
                    in Victoria, Australia, by fostering cultural preservation,
                    social empowerment, and economic advancement while promoting
                    inclusivity and integration within the broader Australian
                    society.
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/joel-kimeto.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px] rounded-lg"
                  alt="Kitwek Victoria community"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Events Section */}
        <div
          className="w-full bg-white pb-20 md:pb-100 relative"
          ref={eventsRef}
        >
          <div className="absolute bottom-0 w-full h-[90%] bg-[#FCBD73] bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
            <div className="h-full w-full bg-[#FCBD7355]"></div>
          </div>
          <motion.div
            className="w-full relative z-20 py-10 md:py-20 bg-transparent"
            variants={fadeInUp}
            initial="hidden"
            animate={eventsInView ? "visible" : "hidden"}
          >
            {/* Events content - similar structure for other sections */}
            <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/ladies.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px] rounded-lg"
                  alt="Kitwek Victoria events"
                />
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-4xl md:text-6xl leading-tight md:leading-[80px] text-[#1E1E1E]">
                  Events
                </h1>
                <div className="pt-8 md:pt-16">
                  <p className="font-bold text-base leading-6 font-[family-name:var(--font-lora-sans)] text-[#1E1E1E]">
                    We host an assortment of Family Events, sporting tournaments
                    and activities for our members across all age groups. This
                    is a platform for our members to build relationships, unwind
                    and acquire relevant sporting skills.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full relative z-20 py-10 md:py-20 bg-transparent"
            variants={fadeInUp}
            initial="hidden"
            animate={eventsInView ? "visible" : "hidden"}
          >
            {/* Events content - similar structure for other sections */}
            <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Sports
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                    We plan and organize a number of sporting tournaments and
                    activities for our members across all age groups. This is a
                    platform for our members to build relationships, unwind and
                    acquire relevant sporting skills
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/sporting-team.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px]"
                  alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full relative z-20 py-10 md:py-20 bg-transparent"
            variants={fadeInUp}
            initial="hidden"
            animate={eventsInView ? "visible" : "hidden"}
          >
            {/* Events content - similar structure for other sections */}
            <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/mentorship.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px]"
                  alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                />
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Mentorship
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                    Through mentorship programs, we provide endless guidance to
                    our members & new international students within our
                    community equipping them with knowledge, skills and advice
                    to harness their transition.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <div
          className="w-full bg-white py-10 md:py-20 relative"
          ref={contactRef}
        >
          <motion.div
            className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 px-4"
            variants={fadeInUp}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            <div className="min-w-[280px] max-w-[760px] w-full rounded-[8px] overflow-hidden bg-[#ED6868] bg-[url(/ui-assets/star.png)] bg-cover bg-no-repeat">
              <div className="h-full w-full bg-[#ed68687e] p-5 md:p-10">
                <form className="h-full w-full">
                  <div className="p-0">
                    <h1 className="mb-5 text-2xl md:text-4xl text-white font-bold">
                      Get in touch with us today
                    </h1>
                  </div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="text"
                      placeholder="Names"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="text"
                      placeholder="Email Address"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="text"
                      placeholder="Subject"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Your Message (Optional)"
                      className="border-b-2 bg-transparent h-[200px] w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    ></textarea>
                  </motion.div>
                  {/* Similar motion.div wrapper for other form elements */}
                  <motion.button
                    className="bg-white rounded-lg h-14 w-full md:w-60 outline-none text-xl text-black leading-6 font-bold mt-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get in touch
                  </motion.button>
                </form>
              </div>
            </div>
            <div className="min-w-[280px] max-w-[460px] w-full">
              <div className="relative w-full h-[400px] md:h-[600px] rounded-[8px] overflow-hidden bg-[url(/ui-assets/mic-lady.jpeg)] bg-cover bg-center bg-no-repeat">
                <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000055] to-transparent">
                  <p className="font-bold text-[#F3F3F3] leading-relaxed">
                    &quot;Members strive to offer endless guidance to our
                    members within our community equipping them with knowledge,
                    skills and advice to harness their transition.&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="w-full bg-white py-16" ref={teamRef}>
          <motion.div
            className="text-center mb-10"
            variants={fadeInUp}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            <h1 className="text-center font-bold text-3xl leading-9 text-black">
              Meet Our Team
            </h1>
          </motion.div>
          <div className="w-full flex flex-col md:flex-row items-center justify-evenly gap-8 px-4">
            {/* Team member cards with hover animation */}
            <motion.div
              className="rounded-lg overflow-hidden h-[496px] w-full md:w-[486px] relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={"/ui-assets/hosea-kiprono.png"}
                height={496}
                width={496}
                className="w-full h-full object-cover"
                alt="Hosea Kiprono - Chairperson"
              />
              <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000088] to-[#00000000]">
                <h1 className="font-bold text-3xl leading-8 text-white">
                  Hosea Kiprono
                </h1>
                <h2 className="font-bold text-base leading-5 text-white">
                  Chairperson
                </h2>
              </div>
            </motion.div>
            <motion.div
              className="rounded-lg overflow-hidden h-[496px] w-full md:w-[486px] relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={"/ui-assets/tabitha-maiyo.png"}
                height={496}
                width={486}
                className="w-full h-full align-middle"
                alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
              />
              <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000088] to-[#00000000]">
                <h1 className="font-bold text-3xl leading-8 text-white">
                  Tabitha Maiyo
                </h1>
                <h2 className="font-bold text-base leading-5 text-white">
                  Vice Chairperson
                </h2>
              </div>
            </motion.div>
            <motion.div
              className="rounded-lg overflow-hidden h-[496px] w-full md:w-[486px] relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={"/ui-assets/bruno-tarus.png"}
                height={496}
                width={486}
                className="w-full h-full align-middle"
                alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
              />
              <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000088] to-[#00000000]">
                <h1 className="font-bold text-3xl leading-8 text-white">
                  Bruno Tarus
                </h1>
                <h2 className="font-bold text-base leading-5 text-white">
                  Sports Coordinator
                </h2>
              </div>
            </motion.div>
            {/* Repeat similar motion.div structure for other team members */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
