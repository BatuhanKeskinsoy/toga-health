import Banner from "@/components/(front)/Home/Banner/Banner";
import { getHome } from "@/lib/services/pages/home";
import React from "react";

async function Home() {
  const homeData = await getHome();
  return (
    <>
      <Banner />
      
    </>
  );
}

export default Home;
