"use client";

import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, FormEvent } from "react";

export default function Home() {
  const [bannerScale, setBannerScale] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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
  // const [teamRef, teamInView] = useInView({
  //   threshold: 0.2,
  //   triggerOnce: true,
  // });

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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully!",
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.log(error)
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="relative z-10">
        {/* Banner with zoom animation */}
        <div className="w-full h-screen relative overflow-hidden">
          <motion.div
            className="w-full z-10 absolute top-0 h-screen bg-[url(/ui-assets/shade.png)] bg-center bg-cover bg-no-repeat"
            animate={{ scale: bannerScale }}
            transition={{ duration: 10, ease: "easeInOut" }}
          ></motion.div>
          <div className="w-full relative z-40 h-screen bg-[#00000055]">
            <div className="w-full h-screen max-w-7xl mx-auto relative px-4">
              <div className="py-20 md:py-40 absolute bottom-10 left-0 text-left px-4">
                <h1 className="font-bold text-6xl md:text-8xl lg:text-8xl leading-tight md:leading-[120px] text-[#F3F3F3] max-w-[600px] w-full">
                  Welcome to Kitwek Victoria
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
          <div className="absolute top-0 w-full h-[75%] md:h-[85%] bg-black bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
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
                    <strong>Mission: </strong>To foster unity, cultural
                    preservation, and social empowerment among the Kalenjin
                    community in Victoria, Australia, by providing support
                    networks, promoting economic and educational opportunities,
                    raising mental health awareness, and celebrating our rich
                    heritage while integrating into the broader Australian
                    Society.
                  </p>
                  <p className="font-bold text-base leading-6 my-2 font-[family-name:var(--font-lora-sans)]  text-white">
                    <strong>Vision: </strong>To build a strong, united, and
                    thriving Kalenjin community in Victoria, Australia, by
                    fostering cultural preservation, social empowerment, and
                    economic advancement while promoting inclusivity and
                    integration within the broader Australian society.
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
                    Our annual events, including galas, camping trips, and
                    mental health programs, are designed to promote the
                    well-being of our community. Through these initiatives, we
                    create spaces for connection, cultural celebration, and
                    personal growth, fostering a strong support system that
                    enhances both physical and mental wellness.
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
                    Our sports program brings the community together through
                    soccer, basketball, volleyball, athletics etc, providing a
                    platform to showcase Kalenjin talent. By promoting teamwork,
                    fitness, and competitive excellence, we foster unity and
                    empowerment within the community.
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/sporting-team.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px] rounded-lg"
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
                  className="w-full min-w-[280px] max-w-[624px] rounded-lg"
                  alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                />
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Mentorship
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                    Through mentorship, we nurture leadership, career
                    development, and personal well-being, ensuring that every
                    member has the resources and encouragement needed to thrive
                    and contribute positively to the community.
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
                <form onSubmit={handleSubmit} className="h-full w-full">
                  <div className="p-0">
                    <h1 className="mb-5 text-2xl md:text-4xl text-white font-bold">
                      Get in touch with us today
                    </h1>
                  </div>
                  {submitStatus && (
                    <div
                      className={`mb-4 p-3 rounded ${
                        submitStatus.success
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Names"
                      required
                      className="border-b-2 border-0 border-b-white bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white focus:outline-none focus:border-0"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="border-b-2 border-0 border-b-white bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white focus:outline-none focus:border-0"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      required
                      className="border-b-2 border-0 border-b-white bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white focus:outline-none focus:border-transparent focus:border-0"
                    />
                  </motion.div>
                  <motion.div
                    className="py-5"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message (Optional)"
                      className="border-b-2 border-0 border-b-white bg-transparent h-[200px] w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white focus:outline-none focus:border-0"
                    ></textarea>
                  </motion.div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-white rounded-lg h-14 w-full md:w-60 outline-none text-xl text-black leading-6 font-bold mt-8 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Sending..." : "Get in touch"}
                  </motion.button>
                </form>
              </div>
            </div>
            <div className="min-w-[280px] max-w-[460px] w-full">
              <div className="relative w-full h-[400px] md:h-[600px] rounded-[8px] overflow-hidden bg-[url(/ui-assets/mic_lady.png)] bg-cover bg-center bg-no-repeat">
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
        {/* <div className="w-full bg-white py-16" ref={teamRef}>
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
          </div>
        </div> */}
      </main>
      <Footer />
    </>
  );
}
