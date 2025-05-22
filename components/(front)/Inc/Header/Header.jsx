import Image from "next/image";
import React from "react";

function Header() {
  return (
    <header className="bg-[#ffe0e0]">
      <div className="relative w-full h-20 flex items-center container mx-auto px-4">
        <Image src={"/assets/logo/logo.svg"} width={120} height={0} className="absolute top-4" />
        Links
      </div>
    </header>
  );
}

export default Header;
