import { BackToHomeBtn } from "@/components/backToHomeBtn";
import Footer from "@/components/Footer";
import Section1 from "@/components/Password-Stregth/Section1";
import Section2 from "@/components/Password-Stregth/Section2";
import Section3 from "@/components/Password-Stregth/Section3";
import Section4 from "@/components/Password-Stregth/Section4";
import Section5 from "@/components/Password-Stregth/Section5";

export default function PasswordStregthPage() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <BackToHomeBtn extClassName="mb-16" />
      <Footer />
    </>
  );
}
