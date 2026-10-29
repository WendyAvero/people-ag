import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { Contacto } from "@/components/sections/Contacto";
import { Empresas } from "@/components/sections/Empresas";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { siteConfig } from "@/config/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  areaServed: "AR",
  inLanguage: "es-AR",
  ...(siteConfig.social.linkedin || siteConfig.social.instagram
    ? {
        sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram].filter(
          Boolean,
        ),
      }
    : {}),
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Empresas />
        <ComoTrabajamos />
        <Sobre />
        <Contacto />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
