# Auditoría pre-lanzamiento — People AG

Fecha: 26/10/2026. Alcance: código del proyecto, pruebas locales y contraste con fuentes oficiales. **No es asesoramiento jurídico.**

## 1. Bloqueantes (impiden publicar)

| # | Problema | Depende de |
|---|---|---|
| B1 | El formulario no envía correos reales hasta cargar `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` con dominio verificado. Hoy responde "no habilitado" (correcto, pero sin consultas posibles). | Vos + Resend |
| B2 | El aviso de privacidad sigue en **borrador** (se mantiene así a propósito). Faltan: identidad del responsable, CUIT, domicilio, correo de privacidad, fecha, plazo de conservación, proveedores, texto textual de la Res. AAIP 14/2018 (art. 3) y revisión de un abogado. Con `privacyIsDraft: false` y datos legales vacíos el build **falla** (guarda agregada). | Vos + abogado |
| B3 | Definir `NEXT_PUBLIC_SITE_URL` (dominio final). Sin eso el build de producción en Vercel falla a propósito (antes habría publicado sitemap/OG apuntando a localhost). | Vos |

## 2. Importantes (antes de recibir consultas reales)

1. **Prueba real de punta a punta** de ambos formularios (procedimiento abajo) y verificación SPF/DKIM del dominio de envío para evitar spam.
2. Cuestiones legales que dependen de cómo opere el servicio (ver sección 4): registro de bases ante la AAIP, contratos con Resend/Vercel, transferencia internacional.
3. Límite de envíos en memoria: en Vercel cada instancia tiene su propio contador, así que es "de mejor esfuerzo". Para algo firme: Vercel WAF/BotID o un captcha (ej. Cloudflare Turnstile).
4. Canal alternativo visible si el formulario falla (correo o LinkedIn reales, una vez que existan).
5. Completar la sección de la fundadora (hoy el panel está oculto para no mostrar texto de "próximamente"). Es el mayor aporte a la confianza.
6. Decidir si se activa analítica; si sí, actualizar la sección 9 del aviso.
7. Redes: cargar `NEXT_PUBLIC_LINKEDIN_URL` / `NEXT_PUBLIC_INSTAGRAM_URL` o dejarlas vacías (no se muestran).

## 3. Mejoras recomendadas (post-lanzamiento)

- Preguntas frecuentes breves (cómo es la primera conversación, qué información preparar) — reduce fricción.
- Eventos de analítica sin cookies (clic en CTA, envío exitoso) para medir qué sección convierte.
- Imagen Open Graph y retrato con fotografía real.
- CI con `npm run lint`, `typecheck`, `test` y `npm audit`.
- Actualizar menores/mayores: React 19.3.1, ESLint 10, TypeScript 7 (evaluar compatibilidad con Next antes).
- Pruebas con lector de pantalla real y en Safari/Firefox/dispositivos físicos.
- Monitoreo de errores del endpoint (cuidando no registrar datos personales).

## 4. Legal Argentina — por categoría

Fuentes oficiales consultadas (argentina.gob.ar): [Ley 25.326 (texto actualizado)](https://www.argentina.gob.ar/normativa/nacional/ley-25326-2000-64790/actualizacion), [Obligaciones de los responsables (AAIP)](https://www.argentina.gob.ar/node/53779), [Resolución AAIP 14/2018](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-14-2018-307621/texto), [Transferencias internacionales (AAIP)](https://www.argentina.gob.ar/transferencias-internacionales), [Disposición 60-E/2016](https://www.argentina.gob.ar/normativa/nacional/267922/texto). Sobre la reforma: [Allende & Brea](https://allende.com/privacidad-y-ciberseguridad/se-reintroduce-en-el-congreso-el-proyecto-de-reforma-integral-del-regimen-argentino-de-proteccion-de-datos-personales-08-12-2026/) (fuente de estudio jurídico, no oficial).

### Confirmado en fuentes oficiales
- Consentimiento libre, expreso e informado (art. 5) e información previa al recolectar: finalidad y destinatarios, existencia e identidad/domicilio del responsable, carácter obligatorio u opcional, consecuencias de dar o negar datos, y derechos de acceso, rectificación y supresión (art. 6). → Se agregó información de primera capa junto al formulario; la identidad y el domicilio quedan pendientes de tus datos reales.
- La Res. AAIP 14/2018 exige mostrar esa información de forma visible y un texto fijo que identifica a la AAIP como órgano de control (art. 3). **No pude obtener el texto textual**: el campo `legal.aaipLegend` espera que lo copies tal cual de la norma. Deroga la Disp. DNPDP 10/2008.
- Seguridad y confidencialidad (arts. 9 y 10).
- Plazos de derechos: acceso, 10 días corridos; rectificación/supresión, 5 días hábiles; acceso gratuito a intervalos no inferiores a seis meses (arts. 14 y 16).
- Quien trata datos por cuenta de otro no puede usarlos para otros fines ni cederlos y debe destruirlos al terminar el contrato (art. 25).
- Transferencia internacional a países sin protección adecuada: prohibida salvo excepciones (art. 12). La lista de países adecuados que publica la AAIP incluye UE/EEE, Reino Unido, Suiza, Uruguay, Nueva Zelanda, Canadá (solo sector privado) e Israel (solo tratamiento automatizado) y **no figura Estados Unidos**. Existen cláusulas modelo (Disp. 60/2016, Res. 198/2023); un contrato distinto del modelo se presenta ante la AAIP dentro de los 30 días.

### Depende de cómo opere el servicio
- **Registro Nacional de Bases de Datos**: la AAIP indica que se inscriben las bases públicas y las privadas destinadas a dar informes. Si la casilla de consultas o una futura base de candidatos (el servicio de selección implica CVs) requiere inscripción es una cuestión de encuadre.
- Si Resend (correo) y Vercel (alojamiento) procesan datos fuera de Argentina, qué mecanismo cubre esa transferencia y si sus contratos incluyen cláusulas equivalentes a las modelo, o si se apoya en consentimiento expreso.
- Plazo de conservación, quién accede a la casilla, retención de copias por cada proveedor, y alcance de los registros técnicos del hosting.
- Si se activa analítica o cualquier cookie.

### Requiere abogado
- Redacción final del aviso, base y texto del consentimiento, y el texto de la AAIP.
- Medidas de seguridad aplicables (la Disp. 11/2006 y las medidas recomendadas por la AAIP aparecieron en la búsqueda; **no las leí**).
- Estado de la reforma: según esa fuente, hay un proyecto presentado en Diputados el 16/07/2026 (expte. 3397-D-2026) en etapa temprana. Confirmar la normativa vigente al momento de publicar.

### ¿La política describe lo que hace el código?
Revisada y ajustada: describe campos reales, obligatoriedad, correo como único destino, ausencia de base de datos propia, uso temporal de IP para limitar envíos, ausencia de cookies y que el registro del consentimiento queda **solo en el correo recibido** (fecha/hora incluida), no en el sitio. Sigue en borrador.

## 5. Verificado (probado en este entorno)

- Lint, TypeScript y build de producción: sin errores. `npm audit`: 0 vulnerabilidades.
- 30 pruebas automáticas (Vitest): validación, variables de entorno, endpoint (503 sin configurar, 422, 200, 502 si falla el proveedor o la red, anti-spam, 429 al sexto envío, 403/413/415/400), sin datos personales ni claves en respuestas y logs, correo en texto plano con registro de consentimiento.
- Envío exitoso contra un **servidor Resend simulado** (formato de la solicitud y `reply_to`).
- Navegador (Chrome, escritorio y móvil): navegación y anclas, menú móvil, pestañas por clic y teclado, errores y foco del formulario, éxito solo tras confirmación del servidor, sin scroll horizontal, sin cookies ni almacenamiento, sin errores de consola (incluida la CSP).
- Accesibilidad: axe-core (WCAG 2.0/2.1/2.2 A y AA + buenas prácticas) sobre inicio, pestaña persona, formulario con errores y privacidad, en escritorio y móvil: sin violaciones tras corregir 2 (contraste de un título y nombre accesible del logo). Skip link funcional.
- Cabeceras de seguridad presentes; sin `X-Powered-By`; ningún secreto en el bundle del navegador (comprobado con claves falsas).

**No verificado / limitaciones**: envío real con Resend; despliegue real en Vercel; Safari/Firefox y dispositivos físicos; lector de pantalla; recepción en Gmail/Outlook; SPF/DKIM; comportamiento de `x-forwarded-for` en Vercel.

## Procedimiento de prueba de punta a punta (con credenciales reales)

1. En Resend: verificá el dominio (registros DNS SPF/DKIM) y creá la API key.
2. Cargá las 3 variables en `.env.local` y corré `npm run check:env` (debe dar OK).
3. `npm run build && npm start`, abrí `http://localhost:3000/#contacto`.
4. **Empresa**: completá todo con un correo tuyo distinto del destino, aceptá el aviso, enviá. Esperado: pantalla de gracias y correo en `CONTACT_TO_EMAIL` con asunto "Nueva consulta de empresa", datos correctos y línea de consentimiento con fecha/hora. Respondé al correo: debe ir a la dirección ingresada (reply-to).
5. **Persona**: repetí con "Soy una persona" (sin campo Empresa).
6. Negativas: enviá vacío (errores por campo), correo inválido, sin consentimiento; verificá que no llegue nada.
7. Falla del proveedor: con una API key inválida debe mostrarse el error y **no** la pantalla de gracias.
8. Revisá spam/promociones en Gmail y Outlook.
9. Repetí 1–5 en el entorno desplegado (Vercel) con el dominio final.
10. Sexto envío seguido desde la misma conexión: debe aparecer el aviso de límite (en Vercel puede variar por instancia).

## Checklist de publicación

**Vos**
- [ ] Definir dominio y cargar `NEXT_PUBLIC_SITE_URL`.
- [ ] Decidir redes (variables) y datos de la fundadora (`src/config/site.ts`).
- [ ] Decidir si se activa analítica.
- [ ] Completar `legal.*` en `site.ts` con datos reales (responsable, CUIT, domicilio, correo de privacidad, texto AAIP) y los `[COMPLETAR]` de `/privacidad`.
- [ ] Ejecutar `npm run check:env`, `npm test`, `npm run build`.

**Servicio externo**
- [ ] Resend: cuenta, dominio verificado (SPF/DKIM), API key.
- [ ] Vercel: importar repo, cargar variables, asociar dominio, deploy.
- [ ] (Recomendado) WAF/BotID o Turnstile.

**Revisión legal**
- [ ] Texto final del aviso, consentimiento, texto textual AAIP.
- [ ] Registro de bases ante la AAIP: ¿aplica?
- [ ] Contratos/transferencia internacional con Resend y Vercel.
- [ ] Plazos de conservación y medidas de seguridad.
- [ ] Solo entonces: `privacyIsDraft: false` (quita el aviso, el noindex y suma `/privacidad` al sitemap).

**Después de publicar**
- [ ] Prueba end-to-end en producción (pasos 4–7).
- [ ] Verificar `/sitemap.xml`, `/robots.txt`, vista previa al compartir el enlace.

---
## Actualización (preparación de lanzamiento)
- El formulario ahora se muestra **solo** si las 3 variables de correo son válidas (`src/lib/forms-status.ts`); sin ellas la sección Contacto muestra un aviso y `/api/contact` sigue respondiendo 503. Los bloqueantes de correo/legal de este documento aplican a la **Etapa 2** (habilitar formularios), no a publicar la web informativa. Ver README.

> Nota (27/10/2026): se eliminó el posicionamiento hacia profesionales individuales (empleabilidad). El formulario es solo para empresas; las referencias a la "pestaña persona" de esta auditoría son históricas.
