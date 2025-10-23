'use server';

import HeroSection from "@/components/hero-section";
import Features from "@/components/features-3";
import Pricing from "@/components/pricing";
import FAQs from "@/components/faqs";
import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
export default async function Home() {
  const { user } = await getCurrentSession()
  if (user) redirect('/dashboard')
  return (
    <>
      <Nav />
      <HeroSection />
      <Features />
      <Pricing />
      <FAQs />
      <FooterSection />
    </>
  )
}
