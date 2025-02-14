import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Banner */}
        <div className="w-full h-screen bg-[url(/ui-assets/cover.png)] bg-center bg-cover bg-no-repeat">
          <div className="w-full h-screen bg-[#00000055]">
            <div className="w-full h-screen max-w-7xl mx-auto relative">
                <div className="py-40 absolute bottom-0 left-0 text-left">
                  <h1 className="font-bold text-8xl leading-[120px] text-[#F3F3F3] max-w-[560px] w-full">Welcome to Kitwek</h1>
                </div>
            </div>
          </div>
        </div>

        {/* Missions */}
        <div className="w-full bg-white pb-100 relative">
          <div className="absolute top-0 w-full h-3/5 bg-black bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
            <div className="h-full w-full bg-[#00000055]"></div>
          </div>
          <div className="w-full relative z-20 py-20 bg-transparent">
            <div className="w-full max-w-7xl mx-auto flex items-start justify-between flex-wrap">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-white">
                  Our Misson and Vison
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-white font-[family-name:var(--font-lora-sans)]">
                    Granting our members the privilege of belonging to a
                    holistic community that fosters growth through mentorship,
                    networking and empowerment
                  </p>
                  <p className="font-bold text-base leading-5 text-white font-[family-name:var(--font-lora-sans)]">
                    Granting our members the privilege of belonging to a
                    holistic community that fosters growth through mentorship,
                    networking and empowerment
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/joel-kimeto.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px]"
                  alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="w-full bg-white pb-100 relative">
          <div className="absolute bottom-0 w-full h-[90%] bg-[#FCBD73] bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
            <div className="h-full w-full bg-[#FCBD7355]"></div>
          </div>
          <div className="w-full relative z-20 py-20 bg-transparent">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between flex-wrap px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <Image
                  src={"/ui-assets/ladies.png"}
                  height={693}
                  width={624}
                  className="w-full min-w-[280px] max-w-[624px]"
                  alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                />
              </div>
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Events
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                    We host an assortment of Family Events, sporting tournaments
                    and activities for our members across all age groups. This
                    is a platform for our members to build relationships, unwind
                    and acquire relevant sporting skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full relative z-20 py-20 bg-transparent">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between flex-wrap px-4">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Sports
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                    We plan and organize a number  of sporting tournaments and
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
          </div>
          <div className="w-full relative z-20 py-20 bg-transparent">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between flex-wrap px-4">
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
                    Through  mentorship programs, we provide endless guidance to
                    our members  & new international students within our
                    community equipping them with knowledge, skills and advice
                    to harness their transition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="w-full bg-white py-20 relative">
          <div className="w-full max-w-7xl mx-auto flex items-start justify-between flex-wrap px-4">
            <div className="min-w-[280px] max-w-[760px] w-full rounded-[8px] overflow-hidden bg-[#ED6868] bg-[url(/ui-assets/star.png)] bg-cover bg-no-repeat">
              <div className="h-full w-full bg-[#ed68687e] p-5 md:p-10">
                <form className="h-full w-full">
                  <div className="p-0">
                    <h1 className="mb-5 text-4xl text-white font-bold">
                      Get in touch with us today and ask questions or comment on
                      ongoing events and activities
                    </h1>
                  </div>
                  <div className="py-5">
                    <input
                      type="text"
                      placeholder="Names"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </div>
                  <div className="py-5">
                    <input
                      type="text"
                      placeholder="Email Address"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </div>
                  <div className="py-5">
                    <input
                      type="text"
                      placeholder="Subject"
                      className="border-b-2 bg-transparent w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    />
                  </div>
                  <div className="py-5">
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Your Message (Optional)"
                      className="border-b-2 bg-transparent h-[200px] w-full placeholder:text-white text-xl font-bold outline-none py-[10px] text-white"
                    ></textarea>
                  </div>
                  <div className="py-5 pt-12">
                    <button className="bg-white rounded-lg h-14 w-60 outline-none text-xl text-black leading-6 font-bold">
                      Get in touch
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="min-w-[280px] max-w-[460px] w-full">
              <div className="relative w-full h-3/4 min-h-[600px] rounded-[8px] overflow-hidden bg-[url(/ui-assets/mic-lady.jpeg)] bg-cover bg-center bg-no-repeat">
                <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000055] to-transparent">
                  <p className="font-bold text-[#F3F3F3] leading-9">
                    “members strive to offer endless guidance to our members
                    within our community equipping them with knowledge, skills
                    and advice to harness their transition.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="w-full bg-white py-16">
          <div className="text-center mb-10">
            <h1 className="text-center font-bold text-3xl leading-9 text-black">
              Meet Our Team
            </h1>
          </div>
          <div className="w-full flex items-center justify-evenly">
            <div className="rounded-lg overflow-hidden h-[496px] w-[486px] relative">
              <Image
                src={"/ui-assets/hosea-kiprono.png"}
                height={496}
                width={496}
                className="w-[500px] h-full align-middle"
                alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
              />
              <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#00000088] to-[#00000000]">
                <h1 className="font-bold text-3xl leading-8 text-white">
                  Hosea Kiprono
                </h1>
                <h2 className="font-bold text-base leading-5 text-white">
                  Chairperson
                </h2>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden h-[496px] w-[486px] relative">
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
            </div>
            <div className="rounded-lg overflow-hidden h-[496px] w-[486px] relative">
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
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
