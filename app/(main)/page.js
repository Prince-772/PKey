"use client";
import Footer from "@/components/Footer";
import Home from "@/components/Home/home";

const LandingPage = () => {
  return (
    <>
      <div className=" px-2 md:px-10 py-5">
        <Home />
      </div>
      <hr className="mt-5" />
      <Footer />
    </>
  );
};

export default LandingPage;
