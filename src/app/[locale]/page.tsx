'use server';

import HeroSection from "@/components/hero-section";
import Features from "@/components/features-3";
import FAQs from "@/components/faqs";
import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import HeroSection2 from "@/components/hero-section-2";
import HowItWorks from "@/components/how-it-works";
import WhyChoose from "@/components/why-choose";
import UseCasesSection from "@/components/use-cases-section";
import Comparison from "@/components/comparison";

export default async function Home() {
  const { user } = await getCurrentSession()
  if (user) redirect('/dashboard')
  return (
    <>
      <Nav />
      <HeroSection />
      <HeroSection2 />
      <HowItWorks />
      <WhyChoose />
      <Features />
      <UseCasesSection />
      <Comparison />
      <FAQs />
      <FooterSection />
    </>
  )
}
