import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start justify-evenly flex-wrap py-20">
          <div className="m-1">
            <Image
              src={"/ui-assets/logo.png"}
              height={150}
              width={150}
              className="w-[150px] h-[150px] align-middle"
              alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
            />
          </div>
          <div className="m-1">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">Menu</h2>
            <div className="">
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                About Us
              </Link>
              <br />
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Events
              </Link>
              <br />
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Members
              </Link>
              <br />
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Radio
              </Link>
              <br />
            </div>
          </div>
          <div className="m-1">
            <div className="h-[312px] w-[320px] rounded-lg bg-[url(/ui-assets/radio-image.png)] bg-cover bg-no-repeat overflow-hidden">
              <div className="bg-[#ed6868cb] h-full w-full p-4 ">
                <h1 className="text-white font-bold text-xl leading-6 mb-4">Kalenjin Radio</h1>
                <p className="text-white font-bold text-xl leading-6 mb-4">Tune in every Sunday 10:30 PM to Midnight</p>
                <div className="w-full flex items-center justify-center h-48">
                  <Image
                    src={"/ui-assets/play-button.png"}
                    height={96}
                    width={96}
                    className="w-[96px] h-[96px] align-middle"
                    alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="m-1">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">Programs</h2>
            <div className="">
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Sports
              </Link>
              <br />
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Events
              </Link>
              <br />
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Education
              </Link>
              <br />
            </div>
          </div>
          <div className="m-1">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">Programs</h2>
            <div className="bg-[#ED6868] rounded-lg p-10 w-[312px]">
              <h3 className="text-white font-bold text-xl leading-6 mb-4">Thinking of being a member?</h3>
              <button className="bg-white rounded-lg h-14 w-60 outline-none text-xl text-black leading-6 font-bold">
                Join us today
              </button>
            </div>
          </div>
        </div>
        <div className="text-left w-full py-8">
          <p className="w-full font-bold text-base text-left leading-5 font-[family-name:var(--font-lora-sans)]">
            KitwekSA @2023 Production. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
