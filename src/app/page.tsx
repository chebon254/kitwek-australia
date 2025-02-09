import Navbar from "@/Components/Navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Banner */}
        <div className="w-full h-screen bg-[url(/ui-assets/cover.png)] bg-center bg-cover bg-no-repeat"></div>

        {/* Missions */}
        <div className="w-full bg-white pb-100 relative">
          <div className="absolute top-0 w-full h-3/5 bg-black bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10">
            <div className="h-full w-full bg-[#00000055]"></div>
          </div>
          <div className="w-full relative z-20 py-20 bg-transparent">
            <div className="w-ful`l max-w-7xl mx-auto flex items-start justify-between flex-wrap">
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
            <div className="w-ful`l max-w-7xl mx-auto flex items-center justify-between flex-wrap">
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
            <div className="w-ful`l max-w-7xl mx-auto flex items-center justify-between flex-wrap">
              <div className="min-w-[280px] max-w-[580px] w-full">
                <h1 className="font-bold text-6xl leading-[80px] text-[#1E1E1E]">
                  Sports
                </h1>
                <div className="flex items-start justify-between pt-16">
                  <p className="font-bold text-base leading-5 text-[#1E1E1E] font-[family-name:var(--font-lora-sans)]">
                  We plan and organize a number  of  sporting tournaments and activities for our members across all age  groups. This is a platform for our members to build relationships,  unwind and acquire relevant sporting skills
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
            <div className="w-ful`l max-w-7xl mx-auto flex items-center justify-between flex-wrap">
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
                  Through  mentorship programs, we  provide endless guidance to our members  & new international  students within our community equipping them with knowledge, skills and  advice to harness their transition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
