import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "People AG — Consultoría estratégica de Recursos Humanos para empresas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo-people-ag.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F8F4EE",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 420,
            height: 380,
            background: "#CEB69A",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 140,
            bottom: 0,
            width: 340,
            height: 250,
            background: "#9E86A1",
            display: "flex",
          }}
        />

        {/* Proporción original del logo: 203 × 171 */}
        <img src={logoSrc} width={142} height={120} alt="" />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <span
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#231F24",
            }}
          >
            Contratá mejor.
          </span>
          <span
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#5A4660",
            }}
          >
            Gestioná personas con criterio.
          </span>
          <span style={{ marginTop: 28, fontSize: 30, color: "#5D5760" }}>
            Consultoría estratégica de Recursos Humanos para empresas
          </span>
        </div>
      </div>
    ),
    size,
  );
}
