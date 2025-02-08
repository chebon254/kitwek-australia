import Navbar from "@/Components/Navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Banner */}
        <div className="w-full h-screen bg-[url(/ui-assets/cover.png)] bg-center bg-cover bg-no-repeat">

        </div>

        {/* Missions */}
        <div className="w-full bg-white pb-100 relative">
          <div className="absolute top-0 w-full h-2/4 bg-black bg-[url(/ui-assets/star.png)] bg-center bg-cover bg-no-repeat z-10"></div>
          <div className="w-full relative z-20 bg-transparent">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between flex-wrap">
              <div className="min-w-[280px] max-w-[500px] w-full bg-[url(/ui-assets/star.png)]">
                <h1 className="font-">Our Misson and Vison</h1>
                <div className="flex items-start justify-between">
                  <p>Granting our members the privilege of belonging to a holistic community that fosters growth through mentorship, networking and empowerment</p>
                  <p>Granting our members the privilege of belonging to a holistic community that fosters growth through mentorship, networking and empowerment</p>
                </div>
              </div>
              <div className="min-w-[280px] max-w-[500px] w-full">
                <Image src={"/ui-assets/joel-kimeto.png"} height={400} width={200} alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
