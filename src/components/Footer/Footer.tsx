import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start justify-evenly flex-wrap py-20">
          <div className="m-1 my-4 min-w-[280px]">
            <Image
              src={"/ui-assets/logo.png"}
              height={150}
              width={150}
              className="w-[150px] h-[150px] align-middle"
              alt="Kitwek Victoria | Australia South | Kitwek Victoria fosters cultural preservation, social empowerment, and economic advancement for the Kalenjin community in Victoria, Australia. Join us in promoting heritage, education, and integration within Australian society"
            />
          </div>
          <div className="m-1 my-4 min-w-[280px]">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">
              Menu
            </h2>
            <div className="">
              <Link
                href={"/about-us"}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                About Us
              </Link>
              <br />
              <Link
                href={"/events"}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Events
              </Link>
              <br />
              <Link
                href={"/donations"}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Donations
              </Link>
              <br />
            </div>
          </div>
          <div className="m-1 my-4 min-w-[280px]">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">
              Programs
            </h2>
            <div className="">
              <Link
                href={""}
                className="w-full py-[5px] font-normal hover:text-[#2C2C2C] text-xl leading-6 text-black"
              >
                Sports
              </Link>
              <br />
              <Link
                href={"/events"}
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
          <div className="m-1 my-4 min-w-[280px]">
            <h2 className="font-bold text-xl leading-6 text-black mb-2">
              Membership
            </h2>
            <div className="bg-[#ED6868] rounded-lg p-10 w-[312px]">
              <h3 className="text-white font-bold text-xl leading-6 ">
                Thinking of being a member?
              </h3>
              <br />
              <br />
              <Link
                href={"/registration"}
                className="bg-white rounded-lg h-14 px-10 py-4 w-60 outline-none text-xl text-black leading-6 font-bold"
              >
                Join us today
              </Link>
            </div>
          </div>
        </div>
        <div className="text-left w-full py-8">
          <p className="w-full font-bold text-base text-left leading-5 font-[family-name:var(--font-lora-sans)]">
            Kitwek Victoria @2025 Production. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
