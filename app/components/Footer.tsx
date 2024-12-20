import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="w-[60px] h-6  bg-no-repeat bg-cover bg-[url('/logo.svg')]" />

        <h1 className="text-lg font-bold">Dozn_Scraping_recruit_task_임재준</h1>
      </div>
      <div>leemjaejun@naver.com / 010-6313-6729</div>
    </footer>
  );
};

export default Footer;
