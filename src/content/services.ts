/**
 * Contenido editable de la landing. Mantener el copy acá (y no dentro de los
 * componentes) permite ajustarlo sin tocar el diseño.
 *
 * Regla: solo se describen servicios y formas de trabajo; no se afirman
 * resultados, clientes, certificaciones ni experiencia que no esté verificada.
 */

export type CompanyService = {
  /** También es el ancla de la sección: /#reclutamiento, etc. */
  id: "reclutamiento" | "consultoria" | "acompanamiento";
  title: string;
  lead: string;
  /** Pasos o ítems del servicio (se muestran en orden). */
  items?: string[];
  /** Variante agrupada (consultoría): ordenar, profesionalizar, desarrollar. */
  groups?: { label: string; items: string[] }[];
  cta: { label: string; service: string };
};

export const companyServices: CompanyService[] = [
  {
    id: "reclutamiento",
    title: "Reclutamiento y selección",
    lead: "Un proceso integral, de punta a punta: desde definir bien el perfil hasta presentarte a los finalistas y acompañarte durante toda la selección.",
    items: [
      "Relevamiento y definición del perfil.",
      "Diseño de la estrategia de búsqueda.",
      "Publicación y búsqueda activa.",
      "Análisis curricular y entrevistas.",
      "Evaluación de candidatos.",
      "Presentación de finalistas.",
      "Acompañamiento durante el proceso de selección.",
    ],
    cta: { label: "Necesito incorporar talento", service: "reclutamiento" },
  },
  {
    id: "consultoria",
    title: "Consultoría de Recursos Humanos",
    lead: "Para organizaciones que necesitan ordenar, profesionalizar y desarrollar su gestión de personas, con soluciones adaptadas a su realidad.",
    groups: [
      {
        label: "Ordenar",
        items: ["Diagnóstico de necesidades."],
      },
      {
        label: "Profesionalizar",
        items: [
          "Profesionalización de procesos de RR. HH.",
          "Diseño y mejora de prácticas de gestión de personas.",
        ],
      },
      {
        label: "Desarrollar",
        items: [
          "Acompañamiento a líderes y responsables de negocio.",
          "Desarrollo de soluciones adaptadas a la realidad de cada organización.",
        ],
      },
    ],
    cta: { label: "Quiero profesionalizar RR. HH.", service: "consultoria" },
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento estratégico en RR. HH.",
    lead: "Respaldo especializado para fortalecer tu gestión de personas sin necesidad de armar un equipo interno completo, según las prioridades de tu negocio.",
    items: [
      "Soporte especializado para empresas que necesitan fortalecer su gestión de personas.",
      "Organización y sistematización de procesos.",
      "Desarrollo de herramientas y prácticas de gestión.",
      "Acompañamiento según las prioridades y necesidades del negocio.",
    ],
    cta: {
      label: "Quiero fortalecer mi gestión de personas",
      service: "acompanamiento",
    },
  },
];

/** Situaciones en las que una empresa suele necesitar este tipo de apoyo. */
export const companyMoments = [
  "Necesitás incorporar a alguien y querés un proceso de selección con criterio, de principio a fin.",
  "Tu organización creció y la gestión de personas todavía se resuelve sobre la marcha.",
  "No contás con un equipo de RR. HH. completo y necesitás respaldo especializado.",
] as const;

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
    title: "Criterio técnico",
    description:
      "Selección, desarrollo y acompañamiento organizacional abordados con método, no con recetas genéricas.",
  },
  {
    title: "Visión de negocio",
    description:
      "Cada decisión sobre personas impacta en la marcha de la empresa. Partimos de lo que tu negocio necesita.",
  },
  {
    title: "Cercanía y soluciones a medida",
    description:
      "Trato directo y propuestas adaptadas a la realidad de cada organización, no paquetes cerrados.",
  },
] as const;
