# People AG — sitio web

Web institucional de People AG, consultoría estratégica de Recursos Humanos para empresas (dueños, directores y gerentes). El sitio es exclusivamente B2B.
Next.js (App Router) + TypeScript + Tailwind CSS.

> **Resumen en una línea:** la web es informativa y no recolecta datos. El contacto es **exclusivamente por correo electrónico** (enlaces `mailto:`). No hay formulario, API de envío, cuentas, cookies ni herramientas de analítica.

---

## Variables de entorno

Variables que cargás en Vercel → *Settings → Environment Variables*. Son opcionales: el sitio funciona sin ninguna.

| Variable | ¿Obligatoria? | Qué poner |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No, pero recomendada para el dominio definitivo | `https://www.tu-dominio.com` (con `https://`, sin barra final ni ruta). Si falta, se usa `https://people-ag.com` en producción y `http://localhost:3000` en desarrollo, y `npm run check:env` muestra una advertencia |
| `NEXT_PUBLIC_LINKEDIN_URL` | No | URL completa de LinkedIn. Vacía = no se muestra el ícono |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | URL completa de Instagram. Vacía = no se muestra |

Qué hace `NEXT_PUBLIC_SITE_URL`: define la dirección oficial del sitio para Google, el mapa del sitio (`sitemap.xml`), `robots.txt` y la imagen que se ve al compartir el link. Si falta, el build **no falla**: el sitio usa `https://people-ag.com` como dominio canónico y `npm run check:env` avisa. Si el dominio definitivo es otro, configurala antes de publicar.

Variable automática (**no la configures a mano**):
- `VERCEL_ENV`: la define Vercel (`production`, `preview` o `development`). El sitio la usa para decidir si un deployment se indexa: solo `production` se indexa.
- `NODE_ENV`: la define Next.js/Node. Se usa como respaldo cuando `VERCEL_ENV` no existe (por ejemplo, en un build local).

**Cómo configurarla para el dominio definitivo**
1. Vercel → tu proyecto → *Settings → Domains* → agregá tu dominio y seguí las instrucciones de DNS que muestra Vercel.
2. *Settings → Environment Variables* → creá `NEXT_PUBLIC_SITE_URL` con el dominio final (`https://www.tu-dominio.com`), marcada para **Production**.
3. *Deployments* → los tres puntos del último deploy → **Redeploy** (las variables se aplican en el próximo despliegue).
4. Abrí `https://www.tu-dominio.com/sitemap.xml` y confirmá que las direcciones usan tu dominio.

Si no definís la variable, el sitio usa `https://people-ag.com` como dominio canónico (sitemap, canonical y Open Graph). La dirección `people-ag.vercel.app` sigue funcionando como alternativa, pero los buscadores reciben siempre `people-ag.com` como principal.

## Contacto

- Canal único: `contacto@people-ag.com` por enlace `mailto:` (se cambia en `contactEmail`, `src/config/site.ts`).
- Todos los botones de contacto (Hero, Empresas, Método de trabajo, páginas de servicio y sección Contacto) abren el correo. La función `contactHref()` en `src/lib/contact-link.ts` centraliza el destino.
- Si el sitio necesita recibir datos por otro medio en el futuro, eso es una decisión nueva que debe pasar por revisión legal antes de implementarse.

## SEO y páginas de servicio

- Páginas indexables: `/`, `/reclutamiento-y-seleccion-de-personal` y `/consultoria-estrategica-de-recursos-humanos`. El contenido está en `src/content/service-pages.ts` (se edita sin tocar el diseño).
- Cada página tiene su propio title, description, canonical y Open Graph. El sitemap (`/sitemap.xml`) y `robots.txt` se generan solos.
- Datos estructurados (Schema.org) en `src/lib/structured-data.ts`: Argentina y Uruguay como zonas de servicio. No incluyen reseñas, teléfono ni dirección.
- Pendientes manuales: verificar `people-ag.com` en Google Search Console, enviar el sitemap y, si querés, redirigir `vercel.app` hacia `people-ag.com` desde Vercel.

## Publicar en Vercel (paso a paso)

1. Subí el proyecto a un repositorio de GitHub (sin `node_modules`, `.next` ni `.env.local`).
2. En [vercel.com](https://vercel.com): *Add New → Project* → importá el repositorio (detecta Next.js solo, no cambies nada del build).
3. Cargá las variables opcionales de arriba (si las necesitás) y **Deploy**.
4. Abrí la URL que te da Vercel y revisá la web en el celular y en la computadora.
5. Asociá el dominio (*Settings → Domains*) y hacé el Redeploy del paso de `NEXT_PUBLIC_SITE_URL`.

También corre en cualquier hosting con Node 20.9+: `npm run build && npm start`.

## Política de privacidad (sigue en BORRADOR)

`/privacidad` es un **borrador**, no un texto aprobado. Mientras `privacyIsDraft` sea `true` en `src/config/site.ts`:
- se muestra el cartel "BORRADOR",
- la página no se indexa en buscadores (noindex) ni va al sitemap.

No lo cambies a `false` hasta completar los datos reales y tener la revisión legal. Al cambiarlo, el build exige que los datos legales (`legal` en el mismo archivo) estén completos.

## Contenido que podés editar sin tocar el diseño

- Textos de servicios, método y botones: `src/content/services.ts`.
- **Fundadora:** objeto `founder` en `src/config/site.ts` (`name`, `role`, `bio`, `credentials`, `photo` en `/public`, `photoAlt`). Sin `name`, esa parte **no aparece** (no hay texto de relleno). La foto solo se muestra si hay `photo` y `name`.
- **Logo:** `public/logo-people-ag.png` (PNG con fondo transparente). Para cambiarlo, reemplazá ese archivo conservando el nombre; el sitio ajusta solo el alto y respeta la proporción. El favicon es `src/app/icon.png` (símbolo del logo) y la imagen al compartir en redes (`src/app/opengraph-image.tsx`) también usa el logo.
- Orden de secciones: `src/app/page.tsx`. Orden del menú: `navItems` en `src/config/site.ts`.
- Año del pie: `copyrightYear` en `src/config/site.ts`.

## Verificar antes de publicar (comandos)

```bash
npm install
npm run lint          # estilo de código
npm run typecheck     # TypeScript
npm test              # pruebas automáticas
npm run build         # build de producción
npm run check:env     # revisa las variables públicas
```
`check:env` lee `.env.local` si existe y no imprime valores.

Para correr en tu computadora: `cp .env.example .env.local`, completá lo que corresponda y `npm run dev` (http://localhost:3000).

## Seguridad (resumen)

- Cabeceras: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy y Permissions-Policy (`next.config.ts`). La CSP admite `'unsafe-inline'` en scripts/estilos porque Next inyecta scripts de hidratación en páginas estáticas; el resto de orígenes está restringido.
- Preview y desarrollo no se indexan: `noindex` en meta y `X-Robots-Tag` fuera de producción.
- El sitio no usa cookies, almacenamiento del navegador ni scripts de terceros, y no tiene endpoints propios de recolección de datos.

## Estructura

```
src/
  app/                 páginas, sitemap, robots, imagen OG, 404
  components/          layout, sections (una por sección), ui
  config/site.ts       datos del sitio, redes, fundadora, datos legales
  content/             textos de servicios, método y páginas
  lib/                 datos estructurados, enlaces de contacto, indexación, validación de variables
tests/                 pruebas automáticas
docs/                  auditoría de prelanzamiento (histórica)
```

## Qué está verificado y qué no

Verificado en el código: lint, TypeScript, pruebas y build.
**No verificado desde este repositorio:** comportamiento en Vercel (Preview y producción), Lighthouse, Safari/Firefox, celulares reales, lector de pantalla. Procedimiento de prueba: `docs/AUDITORIA-PRELANZAMIENTO.md` (documento histórico, pendiente de actualizar).
