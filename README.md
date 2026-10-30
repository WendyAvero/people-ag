# People AG — sitio web

Landing de People AG, consultoría estratégica de Recursos Humanos para empresas (dueños, directores y gerentes). El sitio es exclusivamente B2B.
Next.js (App Router) + TypeScript + Tailwind CSS.

> **Resumen en una línea:** la web informativa se puede publicar ya mismo, sin configurar nada más que el dominio.
> El **formulario de contacto se enciende solo** cuando cargás las 3 variables de correo (ver "Etapa 2"). Mientras no estén, la web **no muestra el formulario** ni pide datos personales.

---

## Dos etapas de lanzamiento

### Etapa 1 — Web informativa (lista para publicar)

Variables (todas se cargan en Vercel → *Settings → Environment Variables*):

| Variable | ¿Obligatoria? | Qué poner |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí, para el dominio definitivo | `https://www.tu-dominio.com` (con `https://`, sin barra final ni ruta) |
| `NEXT_PUBLIC_LINKEDIN_URL` | No | URL completa de LinkedIn. Vacía = no se muestra el ícono |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | URL completa de Instagram. Vacía = no se muestra |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Solo si activás analítica (ver más abajo). Vacía = no se carga nada |

Qué hace `NEXT_PUBLIC_SITE_URL`: define la dirección oficial del sitio para Google, el mapa del sitio (`sitemap.xml`), `robots.txt` y la imagen que se ve al compartir el link. Si falta en el build de **producción** de Vercel, el build falla a propósito para no publicar con direcciones de prueba.

**Cómo configurarla para el dominio definitivo**
1. Vercel → tu proyecto → *Settings → Domains* → agregá tu dominio y seguí las instrucciones de DNS que muestra Vercel.
2. *Settings → Environment Variables* → creá `NEXT_PUBLIC_SITE_URL` con el dominio final (`https://www.tu-dominio.com`), marcada para **Production**.
3. *Deployments* → los tres puntos del último deploy → **Redeploy** (las variables se aplican en el próximo despliegue).
4. Abrí `https://www.tu-dominio.com/sitemap.xml` y confirmá que las direcciones usan tu dominio.

Si no definís la variable, el sitio usa `https://people-ag.com` como dominio canónico (sitemap, canonical y Open Graph). La dirección `people-ag.vercel.app` sigue funcionando como alternativa, pero los buscadores reciben siempre `people-ag.com` como principal.

### SEO y páginas de servicio

- Páginas indexables: `/`, `/reclutamiento-y-seleccion-de-personal` y `/consultoria-estrategica-de-recursos-humanos`. El contenido está en `src/content/service-pages.ts` (se edita sin tocar el diseño).
- Cada página tiene su propio title, description, canonical y Open Graph. El sitemap (`/sitemap.xml`) y `robots.txt` se generan solos.
- Datos estructurados (Schema.org) en `src/lib/structured-data.ts`: Argentina y Uruguay como zonas de servicio. No incluyen reseñas, teléfono ni dirección.
- Contacto provisorio: `consultorapeopleag@gmail.com` por enlace `mailto:` (se cambia en `contactEmail`, `src/config/site.ts`). Con el formulario apagado, los botones de contacto abren el correo; cuando se habilite el formulario vuelven a llevar al formulario.
- Pendientes manuales: verificar `people-ag.com` en Google Search Console, enviar el sitemap y, si querés, redirigir `vercel.app` hacia `people-ag.com` desde Vercel.

### Etapa 2 — Habilitar el formulario (NO hacer hasta tener lo legal resuelto)

El formulario recibe **datos personales**. Antes de habilitarlo:

- [ ] Completar los datos reales de `/privacidad` (los marcados `[COMPLETAR: …]`).
- [ ] Que un/a abogado/a revise el aviso y el texto del consentimiento.
- [ ] Cambiar `privacyIsDraft` a `false` en `src/config/site.ts` (ver "Política de privacidad").
- [ ] Cuenta de [Resend](https://resend.com) con tu dominio verificado y una API key.

Variables **solo para el formulario** (secretas, solo servidor):

| Variable | Qué poner |
|---|---|
| `RESEND_API_KEY` | La clave de Resend (empieza con `re_`) |
| `CONTACT_TO_EMAIL` | La casilla que recibe las consultas (una sola dirección) |
| `CONTACT_FROM_EMAIL` | Remitente de un dominio verificado en Resend, ej. `People AG <contacto@tu-dominio.com>` |

Cómo se enciende: cuando las **tres** están cargadas y son válidas, y se hace **Redeploy**, aparece el formulario. Si falta alguna, la web muestra un aviso de "formulario no habilitado" y el servidor rechaza cualquier envío (error 503). **Nunca se simula un envío exitoso.**

Para probar sin riesgo: en Vercel podés cargar las 3 variables solo en **Preview** (no en Production), desplegar una rama y enviar una consulta de prueba de cada tipo (formulario de empresas). Verificá que el correo llegue. Recién ahí cargarlas en Production.

---

## Publicar en Vercel (paso a paso)

1. Subí el proyecto a un repositorio de GitHub (sin `node_modules`, `.next` ni `.env.local`).
2. En [vercel.com](https://vercel.com): *Add New → Project* → importá el repositorio (detecta Next.js solo, no cambies nada del build).
3. Cargá las variables de la Etapa 1 y **Deploy**.
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
- Los botones con `data-servicio` hacia `#contacto-empresa` preseleccionan el servicio en el formulario (el valor debe existir en `serviceOptions` de `src/lib/contact-schema.ts`; hay un test que lo controla).

## Analítica (apagada)

Si definís `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` se carga Plausible (sin cookies). Actualizá el punto 9 del aviso de privacidad antes de activarla.

## Verificar antes de publicar (comandos)

```bash
npm install
npm run lint          # estilo de código
npm run typecheck     # TypeScript
npm test              # pruebas automáticas
npm run build         # build de producción
npm run check:env                    # revisa variables de la web informativa
npm run check:env -- --formularios   # además exige las de correo
```
`check:env` lee `.env.local` si existe, no imprime secretos y **no** prueba que Resend acepte la clave.

Para correr en tu computadora: `cp .env.example .env.local`, completá lo que corresponda y `npm run dev` (http://localhost:3000).

## Seguridad (resumen)

- Cabeceras: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy y Permissions-Policy (`next.config.ts`). La CSP admite `'unsafe-inline'` en scripts/estilos porque Next inyecta scripts de hidratación en páginas estáticas; el resto de orígenes está restringido.
- Formulario: validación en cliente y servidor, consentimiento obligatorio, campo trampa anti-bots, límite de 5 envíos por IP cada 10 minutos (en memoria: de mejor esfuerzo en serverless; para algo más estricto, sumar captcha o rate limiting de la plataforma), control de origen, tope de tamaño, correo en texto plano, sin guardar datos en el sitio.
- `RESEND_API_URL` solo se acepta apuntando a localhost (pruebas); en producción debe estar vacía.
- Los logs nunca incluyen datos de la consulta ni claves. El sitio no usa cookies ni almacenamiento del navegador.

## Estructura

```
src/
  app/                 páginas, API del formulario, sitemap, robots, imagen OG, 404
  components/          layout, sections (una por sección), forms, ui
  config/site.ts       datos del sitio, redes, fundadora, datos legales
  content/services.ts  textos de servicios y método
  lib/                 validación, correo, rate limit, estado de formularios
tests/                 pruebas automáticas
docs/                  auditoría de prelanzamiento
```

## Qué está verificado y qué no

Verificado: lint, TypeScript, pruebas, build, navegador (Chrome headless, escritorio y móvil), accesibilidad automática (axe), en modo informativo y con formulario contra un servidor de correo **simulado**.
**No verificado:** envío real con Resend (faltan credenciales), Safari/Firefox, celulares reales, lector de pantalla. Procedimiento de prueba real: `docs/AUDITORIA-PRELANZAMIENTO.md`.
