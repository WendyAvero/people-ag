/**
 * Contenido de las páginas de servicio indexables.
 *
 * Regla: se describe qué hace People AG y cómo trabaja. No se afirman clientes,
 * resultados, plazos, certificaciones ni cifras que no estén verificados.
 */

export type ServiceSlug =
  | "reclutamiento-y-seleccion-de-personal"
  | "consultoria-estrategica-de-recursos-humanos"
  | "capacitacion-y-desarrollo-para-empresas"
  | "integracion-y-desarrollo-de-equipos";

export type ServicePage = {
  slug: ServiceSlug;
  /** Debe coincidir con CompanyService.id (preselección del servicio). */
  serviceId: "reclutamiento" | "consultoria" | "capacitacion" | "integracion";
  /** Título corto para <title> (el template agrega " | People AG"). */
  metaTitle: string;
  metaDescription: string;
  /** Nombre del servicio para datos estructurados y migas de pan. */
  name: string;
  eyebrow: string;
  h1: string;
  lead: string;
  ctaLabel: string;
  mailSubject: string;
  whenTitle: string;
  when: string[];
  /** Temáticas del servicio (opcional): se muestra una sección solo si existen. */
  topicsTitle?: string;
  topics?: string[];
  stepsTitle: string;
  stepsIntro: string;
  steps: { title: string; text: string }[];
  approachTitle: string;
  approach: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const servicePages: Record<ServiceSlug, ServicePage> = {
  "reclutamiento-y-seleccion-de-personal": {
    slug: "reclutamiento-y-seleccion-de-personal",
    serviceId: "reclutamiento",
    metaTitle: "Reclutamiento y selección de personal",
    metaDescription:
      "Reclutamiento y selección de personal para empresas y PyMEs de Argentina y Uruguay: definición del perfil, búsqueda, evaluación y finalistas. Modalidad remota.",
    name: "Reclutamiento y selección de personal",
    eyebrow: "Selección de punta a punta",
    h1: "Reclutamiento y selección de personal para empresas",
    lead: "Un proceso de selección de punta a punta para dueños, directores y gerentes que necesitan incorporar a la persona indicada: desde definir bien el perfil hasta presentarte a los finalistas y acompañarte en la decisión. Trabajamos con PyMEs y empresas de Argentina y Uruguay, también de forma remota.",
    ctaLabel: "Necesito incorporar talento",
    mailSubject: "Consulta por reclutamiento y selección",
    whenTitle: "Cuándo conviene sumar un proceso de selección profesional",
    when: [
      "Tenés una posición abierta y no podés dedicarle el tiempo que una búsqueda bien hecha requiere.",
      "El perfil no está del todo claro y necesitás ordenarlo antes de salir a buscar.",
      "Ya buscaste sin llegar a la persona indicada y querés revisar el enfoque.",
      "Necesitás una mirada externa y objetiva sobre los candidatos, además de la de tu equipo.",
    ],
    stepsTitle: "Cómo es el proceso de selección, paso a paso",
    stepsIntro:
      "Cada búsqueda parte de entender el puesto y la organización. Estas son las etapas que recorremos, ajustadas a cada caso.",
    steps: [
      {
        title: "Relevamiento y definición del perfil",
        text: "Conversamos con quien decide para entender el puesto, el equipo, la cultura y lo que realmente se necesita. El perfil queda definido y acordado antes de empezar.",
      },
      {
        title: "Diseño de la estrategia de búsqueda",
        text: "Definimos dónde y cómo buscar según el tipo de posición: canales, criterios y la forma de evaluar a quienes se postulen.",
      },
      {
        title: "Publicación y búsqueda activa",
        text: "Difundimos la búsqueda y también buscamos de manera directa a personas que se ajusten al perfil.",
      },
      {
        title: "Análisis curricular y entrevistas",
        text: "Revisamos las postulaciones contra el perfil acordado y entrevistamos a quienes avanzan, para conocer trayectoria, motivación y encaje.",
      },
      {
        title: "Evaluación de candidatos",
        text: "Comparamos a los candidatos con criterios definidos de antemano, para que la decisión se apoye en información y no solo en impresiones.",
      },
      {
        title: "Presentación de finalistas",
        text: "Te presentamos a los finalistas con una síntesis clara de cada uno, para que decidas con elementos concretos.",
      },
      {
        title: "Acompañamiento durante el proceso de selección",
        text: "Estamos presentes en todo el recorrido: coordinamos, damos seguimiento y te asesoramos en cada decisión hasta el cierre de la búsqueda.",
      },
    ],
    approachTitle: "Cómo trabajamos la selección",
    approach: [
      {
        title: "Un proceso con estructura",
        text: "Seguimos etapas definidas, que ajustamos a cada posición y a la realidad de tu empresa.",
      },
      {
        title: "Criterio profesional y visión de negocio",
        text: "Seleccionamos pensando en el impacto del puesto en tu organización, no solo en que el currículum coincida.",
      },
      {
        title: "Alcance definido en conjunto",
        text: "No trabajamos con paquetes cerrados: armamos el proceso según la posición y la necesidad de tu empresa.",
      },
    ],
    faqs: [
      {
        q: "¿Trabajan con empresas de Uruguay?",
        a: "Sí. Atendemos empresas de Argentina y Uruguay, y podemos trabajar de forma remota.",
      },
      {
        q: "¿Para qué tipo de posiciones hacen selección?",
        a: "Lo definimos en la primera conversación, según la necesidad de tu empresa y el puesto a cubrir.",
      },
      {
        q: "¿Cuánto cuesta un proceso de selección?",
        a: "Depende del alcance de la búsqueda. Lo conversamos en la primera reunión y te proponemos un esquema acorde.",
      },
      {
        q: "¿Qué diferencia hay entre reclutamiento y selección de personal?",
        a: "El reclutamiento consiste en atraer y reunir candidatos para una posición; la selección, en evaluarlos, compararlos con el perfil definido y elegir a quién incorporar. Un proceso completo de búsqueda y selección de personal abarca ambas etapas.",
      },
      {
        q: "¿Sirve para una PyME que no tiene área de Recursos Humanos?",
        a: "Sí. Está pensado para empresas que no cuentan con un área de RR. HH. con tiempo para una búsqueda. Nos ocupamos del proceso y vos participás en las decisiones clave, como la definición del perfil y la elección final.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Escribinos contándonos qué posición necesitás cubrir. Te respondemos por correo para coordinar una primera conversación.",
      },
    ],
  },

  "consultoria-estrategica-de-recursos-humanos": {
    slug: "consultoria-estrategica-de-recursos-humanos",
    serviceId: "consultoria",
    metaTitle: "Consultoría estratégica de Recursos Humanos",
    metaDescription:
      "Consultoría de Recursos Humanos para empresas y PyMEs de Argentina y Uruguay: diagnóstico, procesos, acompañamiento a líderes y asesoramiento continuo.",
    name: "Consultoría estratégica de Recursos Humanos",
    eyebrow: "Gestión de personas con mirada de negocio",
    h1: "Consultoría estratégica de Recursos Humanos para empresas",
    lead: "Acompañamos a dueños, directores y gerentes a ordenar, profesionalizar y desarrollar la gestión de personas, combinando proyectos específicos con asesoramiento continuo según las necesidades del negocio. Trabajamos con PyMEs y empresas de Argentina y Uruguay, también de forma remota.",
    ctaLabel: "Quiero profesionalizar RR. HH.",
    mailSubject: "Consulta por consultoría de Recursos Humanos",
    whenTitle: "Cuándo conviene contar con una consultoría de RR. HH.",
    when: [
      "Tu organización creció y la gestión de personas todavía se resuelve sobre la marcha.",
      "No tenés un área de RR. HH. completa y necesitás respaldo especializado.",
      "Querés definir prioridades antes de invertir en procesos, políticas o herramientas.",
      "Tenés que tomar decisiones sobre personas y organización y querés contrastarlas con una mirada profesional.",
    ],
    stepsTitle: "Qué incluye la consultoría",
    stepsIntro:
      "Combinamos proyectos puntuales con acompañamiento continuo. Estos son los cinco ejes de trabajo, que se combinan según lo que tu empresa necesite.",
    steps: [
      {
        title: "Diagnóstico organizacional y definición de prioridades",
        text: "Analizamos cómo se gestionan hoy las personas en tu empresa y acordamos qué conviene resolver primero.",
      },
      {
        title: "Diseño y mejora de procesos, políticas y herramientas de RR. HH.",
        text: "Ordenamos y formalizamos lo que hace falta para que la gestión de personas sea clara, coherente y sostenible.",
      },
      {
        title: "Acompañamiento a líderes y desarrollo de prácticas de gestión",
        text: "Trabajamos con quienes conducen equipos para fortalecer la forma de gestionar, comunicar y decidir.",
      },
      {
        title: "Asesoramiento a dueños, directores y gerentes",
        text: "Te asesoramos en decisiones sobre personas y organización, con una mirada profesional y orientada al negocio.",
      },
      {
        title: "Seguimiento continuo de prioridades y proyectos",
        text: "Acompañamos la implementación para que lo definido se sostenga en el tiempo y se ajuste cuando cambian las necesidades.",
      },
    ],
    approachTitle: "Cómo trabajamos",
    approach: [
      {
        title: "Partimos de tu necesidad",
        text: "Escuchamos el contexto y la prioridad del negocio antes de proponer cualquier solución.",
      },
      {
        title: "Soluciones a medida",
        text: "Diseñamos propuestas ajustadas a tu organización, que puedan implementarse y sostenerse.",
      },
      {
        title: "Proyectos y asesoramiento continuo",
        text: "Podés contratar un proyecto específico o un acompañamiento permanente, según lo que necesites.",
      },
    ],
    faqs: [
      {
        q: "¿Qué es una consultoría de Recursos Humanos?",
        a: "Es un servicio externo que ayuda a una empresa a ordenar y mejorar cómo gestiona a las personas: desde un diagnóstico de la situación hasta el diseño de procesos y políticas, el acompañamiento a los líderes y el asesoramiento en decisiones. Cada propuesta se arma según el momento y las prioridades de la organización.",
      },
      {
        q: "¿Sirve para una PyME o para una empresa sin área de Recursos Humanos?",
        a: "Sí. Acompañamos tanto a organizaciones sin un área de RR. HH. completa como a las que quieren profesionalizar la que ya tienen. El alcance se define en conjunto, según el tamaño y las prioridades de tu empresa.",
      },
      {
        q: "¿Trabajan con empresas de Uruguay?",
        a: "Sí. Atendemos empresas de Argentina y Uruguay, y podemos trabajar de forma remota.",
      },
      {
        q: "¿Se contrata un proyecto o un servicio mensual?",
        a: "Ambas opciones son posibles. Definimos el alcance en conjunto según la necesidad de tu empresa.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Escribinos contándonos qué te preocupa o qué querés ordenar. Te respondemos por correo para coordinar una primera conversación.",
      },
    ],
  },

  "capacitacion-y-desarrollo-para-empresas": {
    slug: "capacitacion-y-desarrollo-para-empresas",
    serviceId: "capacitacion",
    metaTitle: "Capacitación y desarrollo para empresas",
    metaDescription:
      "Capacitación y desarrollo para empresas y PyMEs de Argentina y Uruguay: liderazgo, comunicación, atención al cliente y más. Presencial o remota.",
    name: "Capacitación y desarrollo para empresas",
    eyebrow: "Formación para líderes y equipos",
    h1: "Capacitación y desarrollo para empresas y PyMEs",
    lead: "Programas y talleres para que líderes y equipos desarrollen habilidades concretas de gestión, comunicación y servicio. Se diseñan a medida, en modalidad presencial o remota, en Argentina y Uruguay.",
    ctaLabel: "Quiero capacitar a mi equipo",
    mailSubject: "Consulta por capacitación y desarrollo",
    whenTitle: "Cuándo conviene capacitar a un equipo",
    when: [
      "Sumaste líderes nuevos o mandos medios que necesitan herramientas para gestionar equipos.",
      "La comunicación o la atención al cliente generan reclamos o fricciones.",
      "Hay conversaciones difíciles que se vienen postergando.",
      "Querés desarrollar habilidades concretas sin recurrir a un programa genérico.",
    ],
    topicsTitle: "Temáticas de capacitación",
    topics: [
      "Liderazgo y gestión de equipos.",
      "Comunicación efectiva.",
      "Atención al cliente y calidad de servicio.",
      "Feedback y conversaciones difíciles.",
      "Delegación y gestión de conflictos.",
      "Habilidades para mandos medios.",
      "Capacitación a medida.",
    ],
    stepsTitle: "Cómo trabajamos una capacitación",
    stepsIntro:
      "Cada propuesta parte de entender al equipo y su momento. El formato, la duración y la cantidad de participantes se definen con cada empresa según el objetivo.",
    steps: [
      {
        title: "Entender la necesidad y el contexto",
        text: "Conversamos con quien conduce el equipo para conocer qué se quiere lograr, qué situación se vive hoy y qué se intentó hasta ahora.",
      },
      {
        title: "Definir objetivos y contenidos",
        text: "Acordamos qué habilidades se van a trabajar y qué contenidos conviene priorizar.",
      },
      {
        title: "Diseñar el formato con la empresa",
        text: "Definimos la modalidad (presencial o remota), la duración y los participantes según el objetivo y la realidad del equipo.",
      },
      {
        title: "Dictar con dinámicas prácticas",
        text: "Trabajamos con casos y situaciones propias del equipo, para que lo visto pueda aplicarse en el día a día.",
      },
      {
        title: "Cerrar con conclusiones y recomendaciones",
        text: "Al finalizar, compartimos conclusiones y recomendaciones para dar continuidad a lo trabajado.",
      },
    ],
    approachTitle: "Cómo entendemos la capacitación",
    approach: [
      {
        title: "Práctica y cercana a tu realidad",
        text: "Partimos de situaciones reales de tu empresa, no de contenidos genéricos.",
      },
      {
        title: "Pensada para PyMEs",
        text: "En las PyMEs los líderes suelen cumplir varios roles; ajustamos los contenidos y el formato a esa realidad.",
      },
      {
        title: "Conectada con la gestión de personas",
        text: "Podemos articular la capacitación con la selección y la consultoría de Recursos Humanos, según lo que necesites.",
      },
    ],
    faqs: [
      {
        q: "¿Se dictan de forma presencial o remota?",
        a: "Ambas modalidades son posibles, en Argentina y Uruguay. La definimos con cada empresa según el objetivo y el equipo.",
      },
      {
        q: "¿Se pueden armar temas a medida?",
        a: "Sí. Además de las temáticas habituales, diseñamos capacitaciones a medida a partir de lo que tu equipo necesita.",
      },
      {
        q: "¿Sirve para PyMEs con equipos chicos?",
        a: "Sí. Está pensada para empresas y PyMEs; el formato y el alcance se ajustan al tamaño y a las prioridades del equipo.",
      },
      {
        q: "¿Se puede combinar con un taller de integración?",
        a: "Sí. Podemos combinar capacitación con talleres de integración y desarrollo de equipos, según lo que necesite tu empresa.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Escribinos contándonos qué querés trabajar con tu equipo. Te respondemos por correo para coordinar una primera conversación.",
      },
    ],
  },

  "integracion-y-desarrollo-de-equipos": {
    slug: "integracion-y-desarrollo-de-equipos",
    serviceId: "integracion",
    metaTitle: "Integración y desarrollo de equipos",
    metaDescription:
      "Talleres de integración y desarrollo de equipos para empresas y PyMEs de Argentina y Uruguay: comunicación, acuerdos y confianza, presencial o remota.",
    name: "Integración y desarrollo de equipos",
    eyebrow: "Talleres para equipos",
    h1: "Integración y desarrollo de equipos para empresas y PyMEs",
    lead: "Talleres y acompañamiento para que los equipos se alineen, se comuniquen mejor y trabajen con acuerdos claros. En modalidad presencial o remota, en Argentina y Uruguay.",
    ctaLabel: "Quiero un taller para mi equipo",
    mailSubject: "Consulta por integración y desarrollo de equipos",
    whenTitle: "Cuándo conviene un taller de integración",
    when: [
      "Se formó un equipo nuevo o se fusionaron áreas.",
      "Hay desalineación sobre los objetivos o las prioridades.",
      "La colaboración entre personas o áreas se volvió difícil.",
      "Querés conocer cómo funciona un equipo antes de intervenir.",
    ],
    topicsTitle: "Qué trabajamos con los equipos",
    topics: [
      "Talleres de integración de equipos.",
      "Alineación de objetivos y prioridades.",
      "Comunicación y colaboración.",
      "Acuerdos y códigos de trabajo del equipo.",
      "Dinámicas de confianza.",
      "Diagnóstico y mejora del funcionamiento del equipo.",
    ],
    stepsTitle: "Cómo trabajamos con tu equipo",
    stepsIntro:
      "Partimos de cómo trabaja hoy el equipo. El formato, la duración y la cantidad de participantes se definen con cada empresa según el objetivo.",
    steps: [
      {
        title: "Conversar con quien conduce el equipo",
        text: "Entendemos qué se busca, cuál es el momento del equipo y qué se espera de la intervención.",
      },
      {
        title: "Relevar cómo trabaja hoy el equipo",
        text: "Según el caso, con entrevistas o una encuesta breve, para partir de información y no de supuestos.",
      },
      {
        title: "Diseñar el taller a medida",
        text: "Armamos las actividades según el objetivo y la modalidad elegida, presencial o remota.",
      },
      {
        title: "Facilitar la jornada",
        text: "Conducimos el taller con dinámicas participativas, para que todas las personas puedan intervenir.",
      },
      {
        title: "Cerrar con acuerdos y recomendaciones",
        text: "El equipo termina con acuerdos de trabajo concretos, y le dejamos recomendaciones para sostenerlos.",
      },
    ],
    approachTitle: "Cómo entendemos el trabajo con equipos",
    approach: [
      {
        title: "Talleres participativos y prácticos",
        text: "El equipo trabaja y conversa; no son charlas para escuchar.",
      },
      {
        title: "Partimos del diagnóstico",
        text: "Diseñamos cada taller a partir de cómo funciona el equipo, no de una dinámica estándar.",
      },
      {
        title: "Acuerdos que se puedan sostener",
        text: "Buscamos acuerdos simples y concretos, que el equipo pueda llevar a su día a día.",
      },
    ],
    faqs: [
      {
        q: "¿Cuándo conviene hacer un taller de integración?",
        a: "Cuando se formó un equipo nuevo, cambió la conducción, se fusionaron áreas o la colaboración se volvió difícil. También sirve para conocer cómo funciona un equipo antes de intervenir.",
      },
      {
        q: "¿Se hace de forma presencial o remota?",
        a: "Ambas modalidades son posibles, en Argentina y Uruguay. La definimos con cada empresa según el objetivo y el equipo.",
      },
      {
        q: "¿Participan todas las personas del equipo o solo los líderes?",
        a: "Lo definimos con la empresa según el objetivo: puede involucrar a todo el equipo, a los líderes o a ambos. Sirve tanto para PyMEs como para equipos más grandes.",
      },
      {
        q: "¿Se puede combinar con capacitación?",
        a: "Sí. Podemos combinar talleres de integración con capacitaciones en liderazgo, comunicación u otras temáticas, según lo que necesite tu empresa.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Escribinos contándonos qué situación vive tu equipo. Te respondemos por correo para coordinar una primera conversación.",
      },
    ],
  },
};

export const servicePageList = Object.values(servicePages);

/** Ruta de la página de cada servicio (por id de CompanyService). */
export const servicePathById: Record<ServicePage["serviceId"], string> = {
  reclutamiento: "/reclutamiento-y-seleccion-de-personal",
  consultoria: "/consultoria-estrategica-de-recursos-humanos",
  capacitacion: "/capacitacion-y-desarrollo-para-empresas",
  integracion: "/integracion-y-desarrollo-de-equipos",
};

/** Las demás páginas de servicio, en el orden de la lista (bloque «También podemos ayudarte con»). */
export function otherServicePages(slug: ServiceSlug): ServicePage[] {
  return servicePageList.filter((p) => p.slug !== slug);
}
