import React, { useState } from "react";
import Header from "../header/Header";
import "./Home.css";
import Footer from "../footer/Footer";
import Hero from "./hero/Hero";
import Rooms from "./rooms/Rooms";
import CTA from "./cta/CTA"
import Reviews from "./reviews/Reviews";

const Home = () => {
  const [searchData, setSearchData] = useState(null);

  return (
    <>
      <Header />

      <Hero onSearch={setSearchData} />

      <Rooms searchData={searchData} />

      <Reviews />

      <Footer />
    </>
  );
};

export default Home;
