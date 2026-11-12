/**
 * Contenido editable de la landing. Mantener el copy acá (y no dentro de los
 * componentes) permite ajustarlo sin tocar el diseño.
 *
 * Regla: solo se describen servicios y formas de trabajo; no se afirman
 * resultados, clientes, certificaciones ni experiencia que no esté verificada.
 */

export type CompanyService = {
  /** También es el ancla de la sección: /#reclutamiento, etc. */
  id: "reclutamiento" | "consultoria" | "capacitacion";
  title: string;
  /** Frase corta (tarjeta de la home, panel del Hero y bloque «También podemos ayudarte con»). */
  short: string;
  /** Pasos o ítems del servicio (se muestran en orden). */
  items?: string[];
  /** Variante agrupada (opcional): ítems organizados por grupos. */
  groups?: { label: string; items: string[] }[];
};

export const companyServices: CompanyService[] = [
  {
    id: "reclutamiento",
    title: "Reclutamiento y selección",
    items: [
      "Relevamiento y definición del perfil.",
      "Diseño de la estrategia de búsqueda.",
      "Publicación y búsqueda activa.",
      "Análisis curricular y entrevistas.",
      "Evaluación de candidatos.",
      "Presentación de finalistas.",
      "Acompañamiento durante el proceso de selección.",
    ],
    short: "Del perfil a los finalistas, con acompañamiento.",
  },
  {
    id: "consultoria",
    title: "Consultoría estratégica de Recursos Humanos",
    items: [
      "Diagnóstico organizacional y definición de prioridades.",
      "Diseño y mejora de procesos, políticas y herramientas de RR. HH.",
      "Acompañamiento a líderes y desarrollo de prácticas de gestión.",
      "Asesoramiento a dueños, directores y gerentes en decisiones sobre personas y organización.",
      "Seguimiento continuo de prioridades y proyectos.",
    ],
    short: "Ordenar y profesionalizar la gestión de personas: estructuras, procesos y prácticas.",
  },
  {
    id: "capacitacion",
    title: "Capacitación, talleres y desarrollo de equipos",
    short: "Formación y talleres para desarrollar competencias, fortalecer vínculos y mejorar el funcionamiento de los equipos.",
  },
];

export const processSteps = [
  {
    title: "Escuchamos y comprendemos la necesidad",
    description:
      "Una primera conversación para entender qué necesitás, qué ya intentaste y qué está en juego para el negocio.",
    outcome: "Una necesidad bien definida.",
  },
  {
    title: "Analizamos el contexto y definimos prioridades",
    description:
      "Miramos la situación, las personas y el momento de la organización para decidir por dónde conviene empezar.",
    outcome: "Prioridades acordadas.",
  },
  {
    title: "Diseñamos una solución personalizada",
    description:
      "Armamos una propuesta a medida, con alcance, pasos y criterios claros definidos de antemano.",
    outcome: "Un plan con alcance y pasos claros.",
  },
  {
    title: "Implementamos y acompañamos el proceso",
    description:
      "Trabajamos junto a vos, ajustamos sobre la marcha y priorizamos prácticas que se puedan sostener.",
    outcome: "La solución en marcha, con seguimiento.",
  },
] as const;

export const aboutPillars = [
  {
    title: "Criterio profesional",
    description:
      "Conocimiento técnico aplicado a los desafíos reales de la gestión de personas.",
  },
  {
    title: "Visión de negocio",
    description:
      "Soluciones de RR. HH. alineadas con los objetivos, la estructura y el momento de cada organización.",
  },
  {
    title: "Compromiso con los resultados",
    description:
      "Acompañamiento personalizado, prioridades claras y foco en soluciones aplicables.",
  },
] as const;
