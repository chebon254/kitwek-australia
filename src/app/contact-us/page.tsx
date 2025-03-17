"use client";

import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, FormEvent } from "react";

export default function Home() {
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
  const [contactRef, contactInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
      console.log(error);
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
      <main className="relative z-10 pt-20">
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
      </main>
      <Footer />
    </>
  );
}
