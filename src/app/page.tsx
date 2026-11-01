import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { Contacto } from "@/components/sections/Contacto";
import { Empresas } from "@/components/sections/Empresas";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { homeJsonLd, jsonLdString } from "@/lib/structured-data";

// Title, description y Open Graph vienen del layout; acá solo el canonical
// ("/" se resuelve con metadataBase a https://people-ag.com, igual que antes).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
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
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd()) }}
      />
    </>
  );
}
