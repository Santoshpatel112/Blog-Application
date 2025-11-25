import Image from "next/image";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/home/header/Navbar";
import HeroSection from "@/components/home/hero-section";
export default function Home() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
    </>
  );
}
