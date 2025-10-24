import Nav from "@/components/shared/nav";
import FooterSection from "@/components/footer";
import { FeaturesDetailed } from "@/components/features-detailed";

export default async function FeaturesPage() {
  return (
    <>
      <Nav />
      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
        <FeaturesDetailed />
      </main>
      <FooterSection />
    </>
  );
}
