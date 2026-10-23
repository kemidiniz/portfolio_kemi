export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  badge?: string;
  summary: string;
  achievements: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  status: string;
  period: string;
  details: string;
}

export interface TechImmersionItem {
  id: string;
  program: string;
  organization: string;
  type: 'course' | 'summit' | 'community';
  year: string;
  description: string;
  focus: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'pesquisa' | 'estrategia' | 'comunicacao' | 'dados-ia';
  categoryLabel: string;
  year: string;
  tagline: string;
  image: string;
  role: string;
  clientOrContext: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  tools: string[];
  featured?: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  institution: string;
  year: string;
  skillsAcquired: string[];
}

export interface SkillCategory {
  category: string;
  description: string;
  items: { name: string; level: 'Avançado' | 'Intermediário' | 'Especialista' }[];
}

export interface PortfolioData {
  personal: {
    name: string;
    nickname: string;
    brandTitle: string;
    headline: string;
    subtitle: string;
    age: number;
    location: string;
    email: string;
    linkedin: string;
    linkedinDisplay: string;
    whatsapp: string;
    whatsappDisplay: string;
    avatarUrl: string;
    statusBadge: string;
    motto: string;
    bioParagraphs: string[];
    coreValues: { title: string; desc: string }[];
    metrics: { value: string; label: string; detail: string }[];
  };
  experiences: ExperienceItem[];
  education: EducationItem[];
  techImmersions: TechImmersionItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillCategory[];
}

export const initialPortfolioData: PortfolioData = {
  personal: {
    name: "Kemily Diniz",
    nickname: "Kemi",
    brandTitle: "Portfólio Kemily Diniz",
    headline: "Estratégia e Comunicação com Dados & IA",
    subtitle: "Sempre com olhar curioso para novas tecnologias, comunicação e soluções estratégicas.",
    age: 23,
    location: "São Paulo, SP — Brasil",
    email: "kemilydiniz@gmail.com",
    linkedin: "https://br.linkedin.com/in/kemilydiniz",
    linkedinDisplay: "linkedin.com/in/kemilydiniz",
    whatsapp: "https://wa.me/5511950201858?text=Olá%20Kemi,%20vi%20seu%20portfólio%20e%20gostaria%20de%20conversar!",
    whatsappDisplay: "+55 (11) 95020-1858",
    avatarUrl: "/assets/aistudio/IMG_1992_c0be0322.jpeg",
    statusBadge: "Disponível para Projetos & Conexões Estratégicas",
    motto: "Buscando sempre repertório e conexões.",
    bioParagraphs: [
      "Aos 23 anos — mas pode me chamar carinhosamente de Kemi! —, construí minha trajetória profissional na convergência entre o entendimento genuíno de pessoas, a estruturação de dados analíticos e a comunicação clara como motor de transformação nos negócios.",
      "Iniciei minha jornada em Gestão de Pessoas e Experiência do Cliente, desenvolvendo sensibilidade empática para identificar pontos de atrito e dores reais de usuários. Essa base impulsionou minha atuação em Endomarketing e Comunicação Estratégica na Unidade de Finanças do Banco Bradesco, traduzindo métricas e diretrizes analíticas em narrativas visuais engajadoras e alinhadas aos objetivos corporativos.",
      "Hoje, como Analista de Estratégia no Banco Bradesco e autora com 2 artigos acadêmicos publicados (sobre Metodologias Ágeis e Consumo Digital por Jovens), integro ferramentas analíticas como Power BI, inteligência artificial generativa e visão de negócios para transformar complexidade em clareza."
    ],
    coreValues: [
      {
        title: "Estratégia Orientada a Dados",
        desc: "Capacidade de extrair insights acionáveis a partir de dados complexos para embasar tomadas de decisão executiva."
      },
      {
        title: "Comunicação Humana & Precisa",
        desc: "Tradução de conceitos analíticos e técnicos em mensagens transparentes, engajadoras e visualmente elegantes."
      },
      {
        title: "Curiosidade Tecnológica & IA",
        desc: "Aprendizado contínuo e aplicação prática de inteligência artificial generativa para automação e repertório estratégico."
      }
    ],
    metrics: [
      {
        value: "4+ Anos",
        label: "Trajetória Corporativa",
        detail: "Comunicação, CX e Estratégia"
      },
      {
        value: "Banco Bradesco",
        label: "Setor Bancário & Estratégia",
        detail: "Analista de Estratégia Corporativa"
      },
      {
        value: "2 Artigos",
        label: "Pesquisas Publicadas",
        detail: "Metodologias Ágeis & Consumo Digital"
      },
      {
        value: "Tech & IA",
        label: "Formação Continuada",
        detail: "{reprograma} & Summits de Inovação"
      }
    ]
  },

  experiences: [
    {
      id: "bradesco-estrategia",
      role: "Analista de Estratégia",
      company: "Banco Bradesco",
      period: "Mai/2026 – Atualidade",
      location: "São Paulo, SP",
      badge: "Posição Atual",
      summary: "Atuação direta no planejamento e estruturação de diretrizes estratégicas corporativas, mapeamento de tendências de mercado e acompanhamento de indicadores executivos.",
      achievements: [
        "Elaboração de estudos de inteligência de mercado e análises quantitativas para subsidiar tomadas de decisão estratégicas corporativas.",
        "Acompanhamento e consolidação de KPIs em dashboards analíticos, facilitando a visibilidade de metas organizacionais.",
        "Integração de ferramentas de IA generativa para síntese de relatórios regulatórios e benchmarking competitivo."
      ],
      skills: ["Planejamento Estratégico", "Inteligência de Mercado", "Power BI", "IA Generativa", "Governança Corporativa"]
    },
    {
      id: "bradesco-endomarketing",
      role: "Estágio em Endomarketing e Comunicação",
      company: "Banco Bradesco (BU de Finanças)",
      period: "Ago/2024 – Abr/2026",
      location: "São Paulo, SP",
      summary: "Gestão e execução de estratégias de comunicação interna para a Unidade de Negócios de Finanças, conectando equipes e disseminando a cultura analítica.",
      achievements: [
        "Criação e edição de newsletters executivas quinzenais de finanças com índice médio de abertura superior a 68%.",
        "Desenvolvimento de peças gráficas, infográficos e conteúdos audiovisuais de alta aderência para campanhas internas.",
        "Apoio na organização de fóruns, alinhamentos de liderança e eventos com foco em engajamento e transformação cultural."
      ],
      skills: ["Comunicação Interna", "Design Editorial", "Photoshop & Canva", "Capcut", "Storytelling", "Métricas de Engajamento"]
    },
    {
      id: "concentrix-advisor",
      role: "Advisor Sênior de Atendimento",
      company: "Concentrix",
      period: "Abr/2021 – Mar/2023",
      location: "São Paulo, SP",
      summary: "Atendimento especializado a clientes em cenários críticos de alta complexidade, resolução ágil de atritos e foco em excelência na jornada do usuário.",
      achievements: [
        "Reconhecimento contínuo por manter índices de CSAT e FCR (First Contact Resolution) no quartil superior da operação.",
        "Mapeamento de padrões de dores recorrentes dos clientes e envio de planos de melhoria para squads de produto.",
        "Mentoria e apoio no onboarding de novos colaboradores da equipe operacional."
      ],
      skills: ["Customer Experience (CX)", "Resolução de Conflitos", "Comunicação Empática", "NPS & CSAT", "Análise de Processos"]
    },
    {
      id: "moara-consultoria",
      role: "Líder de Consultoria Experimental",
      company: "Moara Consultoria",
      period: "Fev/2020 – Dez/2020",
      location: "São Paulo, SP",
      summary: "Liderança de projetos de consultoria para pequenas e médias empresas, aplicando frameworks de diagnóstico organizacional e experiência do cliente.",
      achievements: [
        "Coordenação do diagnóstico de jornada do consumidor para negócios locais, identificando gargalos de conversão e atendimento.",
        "Estruturação de planos de ação personalizados com metas de curto e médio prazo.",
        "Apresentação de relatórios finais e facilitação de workshops de alinhamento estratégico com gestores."
      ],
      skills: ["Consultoria Organizacional", "Design Thinking", "Jornada do Cliente", "Gestão de Projetos", "Facilitação"]
    }
  ],

  education: [
    {
      id: "fatec-marketing",
      institution: "Fatec Sebrae",
      degree: "Graduação Tecnológica",
      field: "Marketing",
      status: "Em andamento",
      period: "2024 – Atual",
      details: "Formação focada em estratégia de mercado, comportamento do consumidor, inovação de produtos, análise competitiva e empreendedorismo aplicado."
    },
    {
      id: "fatec-rh",
      institution: "Fatec Zona Leste",
      degree: "Graduação Tecnológica",
      field: "Gestão de Recursos Humanos",
      status: "Concluído",
      period: "2021 – 2023",
      details: "Formação sólida em desenvolvimento organizacional, cultura corporativa, dinâmicas de liderança, gestão por competências e educação corporativa."
    }
  ],

  techImmersions: [
    {
      id: "reprograma-ia",
      program: "Curso de Inteligência Artificial",
      organization: "{reprograma}",
      type: "course",
      year: "2024",
      description: "Capacitação intensiva e inclusiva em IA, abordando fundamentos de aprendizado de máquina, engenharia de prompts, análise de dados e diretrizes de ética algorítmica.",
      focus: ["Fundamentos de IA", "Ética em Dados", "Machine Learning Prático", "Engenharia de Prompt"]
    },
    {
      id: "programaria-summit",
      program: "PrograMaria Summit",
      organization: "PrograMaria",
      type: "summit",
      year: "2024",
      description: "Maior evento da América Latina voltado a mulheres na tecnologia, com foco em liderança técnica, inteligência artificial, dados e diversidade na indústria de software.",
      focus: ["Diversidade em Tech", "Inovação Corporativa", "Produtos Digitais"]
    },
    {
      id: "womakerscode-emct",
      program: "Encontro Mulheres na Ciência & Tecnologia (EMCT)",
      organization: "WoMakersCode",
      type: "community",
      year: "2024",
      description: "Imersão comunitária e técnica com líderes do ecossistema de dados, engenharia e inteligência artificial da comunidade WoMakersCode.",
      focus: ["Engenharia de Dados", "Carreira em Tecnologia", "Comunidade Tech"]
    },
    {
      id: "ia-week",
      program: "IA Week",
      organization: "Tech Academy Hub",
      type: "summit",
      year: "2024",
      description: "Série de conferências com demonstrações ao vivo sobre tendências globais de inteligência artificial generativa aplicada a negócios e automações.",
      focus: ["IA Generativa", "Automação com LLMs", "Futuro do Trabalho"]
    },
    {
      id: "summit-bradesco-edufin",
      program: "Summit Bradesco Educação Financeira",
      organization: "Banco Bradesco",
      type: "summit",
      year: "2025",
      description: "Encontro estratégico sobre o papel da educação financeira como alavanca de inclusão socioeconômica e bem-estar do cliente bancário.",
      focus: ["Educação Financeira", "Inclusão Bancária", "Comportamento Econômico"]
    }
  ],

  projects: [
    {
      id: "artigo-metodologias-ageis",
      title: "Metodologias Ágeis em Educação Corporativa",
      category: "pesquisa",
      categoryLabel: "Artigo Acadêmico Publicado",
      year: "2023",
      tagline: "Pesquisa científica sobre os impactos do Scrum e Kanban no desenvolvimento contínuo de colaboradores.",
      image: "/assets/projects/agile_research_cover_1792537283675.jpg",
      role: "Autora e Pesquisadora Principal",
      clientOrContext: "Publicação Científica Acadêmica",
      overview: "Investigação acadêmica aprofundada sobre a aplicação prática de metodologias ágeis (Scrum, Kanban, sprints de aprendizagem) como alavancas de eficiência e motivação no treinamento corporativo.",
      challenge: "Modelos tradicionais de capacitação empresarial apresentavam baixa taxa de retenção de conhecimento e descompasso com os prazos dinâmicos dos times operacionais.",
      solution: "Estruturação de um estudo com levantamento bibliográfico e pesquisa empírica, demonstrando como rituais ágeis e ciclos curtos de feedback aumentam a autonomia e a aplicabilidade prática.",
      results: [
        "Artigo acadêmico aprovado com louvor e disponibilizado no acervo institucional.",
        "Validação de metodologia que propõe redução de 35% no tempo de ramp-up em equipes de atendimento.",
        "Apresentação das conclusões em banca de especialistas com feedback de excelência metodológica."
      ],
      tools: ["Pesquisa Metodológica", "Análise Qualitativa & Quantitativa", "Normas ABNT", "Mendeley", "Google Scholar"],
      featured: true
    },
    {
      id: "artigo-consumo-digital-jovens",
      title: "Consumo Digital por Jovens: Hábitos & Plataformas",
      category: "pesquisa",
      categoryLabel: "Artigo Acadêmico Publicado",
      year: "2024",
      tagline: "Estudo analítico sobre novos padrões de comportamento do consumidor jovem e dinâmica em mídias digitais.",
      image: "/assets/projects/consumo_digital_jovens_1792541175385.jpg",
      role: "Autora e Pesquisadora",
      clientOrContext: "Publicação Acadêmica — Marketing & Comportamento",
      overview: "Estudo aprofundado sobre a dinâmica de consumo de conteúdo digital, redes sociais verticais (TikTok, Instagram Reels) e novos hábitos de compra da Geração Z e jovens adultos.",
      challenge: "Compreender como a hiperfragmentação de canais e algoritmos de recomendação impactam a jornada de decisão e a lealdade de marca entre o público jovem.",
      solution: "Levantamento empírico com segmentação demográfica, análise quantitativa de tempo de tela e hábitos de engajamento, mapeando oportunidades para marcas e comunicadores.",
      results: [
        "Publicação acadêmica destacando as transformações no funil de consideração e compra jovem.",
        "Identificação de 4 vetores críticos: autenticidade de criadores, social commerce, vídeos curtos e senso de comunidade.",
        "Aplicação das conclusões em estratégias práticas de comunicação institucional e engajamento."
      ],
      tools: ["Comportamento do Consumidor", "Análise de Mídias Digitais", "Pesquisa Quantitativa", "Google Trends", "Estatística Descritiva"],
      featured: true
    },
    {
      id: "consultoria-cx-moara",
      title: "Gestão e Diagnóstico de Experiência do Cliente",
      category: "estrategia",
      categoryLabel: "Consultoria Estratégica",
      year: "2020",
      tagline: "Mapeamento integral de pontos de contato e planos de ação para satisfação e retenção do usuário.",
      image: "/assets/projects/cx_consultancy_cover_1792537284268.jpg",
      role: "Líder de Consultoria Experimental",
      clientOrContext: "Moara Consultoria — Projetos PME",
      overview: "Condução de consultoria estruturada para mapear a jornada de compra e suporte de pequenas e médias empresas, eliminando gargalos operacionais e elevando o CSAT.",
      challenge: "Empresas com altos índices de cancelamento e insatisfação no pós-venda devido à falta de clareza nos canais de comunicação com o cliente.",
      solution: "Desenho da matriz de Service Blueprint e jornada do cliente, com definição de métricas de acompanhamento (NPS e CSAT) e roteiros de atendimento humanizado.",
      results: [
        "Aumento médio de 24 pontos no índice de satisfação percebida após 90 dias de implementação.",
        "Redução do tempo médio de espera no primeiro atendimento em 40%.",
        "Entrega de playbook de atendimento e cultura centrada no cliente (Customer Centricity)."
      ],
      tools: ["Service Blueprint", "Customer Journey Map", "Pesquisa NPS", "Miro", "Excel Analítico"],
      featured: true
    },
    {
      id: "comunicacao-bu-financas",
      title: "Comunicação e Endomarketing Estratégico",
      category: "comunicacao",
      categoryLabel: "Comunicação & Design",
      year: "2024 – 2026",
      tagline: "Estratégia transmídia, newsletters executivas e campanhas de cultura interna em Finanças.",
      image: "/assets/projects/comms_design_cover_1792537285242.jpg",
      role: "Estrategista de Conteúdo e Criação",
      clientOrContext: "Banco Bradesco — Unidade de Finanças",
      overview: "Planejamento e produção contínua de peças de comunicação interna, visando conectar os objetivos macro de finanças com o dia a dia dos colaboradores.",
      challenge: "Transformar relatórios financeiros densos e terminologias técnicas em peças atrativas, dinâmicas e de leitura agradável para públicos multidisciplinares.",
      solution: "Implementação de nova linha editorial visual, newsletter com seções dinâmicas de pessoas e resultados, além de videopílulas informativas com Capcut e Canva.",
      results: [
        "Taxa média de abertura de e-mails internos mantida acima de 68% ao longo de 18 meses.",
        "Aumento de 50% na participação voluntária em fóruns e eventos da área.",
        "Padronização visual e de tom de voz para apresentações executivas da diretoria."
      ],
      tools: ["Adobe Photoshop", "Canva Pro", "Capcut", "Storytelling Corporativo", "Mailchimp / Outlook News"],
      featured: true
    },
    {
      id: "dados-automacao-ia",
      title: "Dashboards e Soluções com Dados & IA Generativa",
      category: "dados-ia",
      categoryLabel: "Dados & Inteligência Artificial",
      year: "2024 – 2026",
      tagline: "Painéis de acompanhamento em Power BI e fluxos assistidos por IA para produtividade.",
      image: "/assets/projects/cx_consultancy_cover_1792537284268.jpg",
      role: "Criadora & Analista",
      clientOrContext: "Projetos de Inteligência e Produtividade",
      overview: "Estruturação de visualizações de dados para acompanhamento de métricas-chave de engajamento e aplicação de prompts avançados para consolidação de relatórios extensos.",
      challenge: "Necessidade de agilizar o tempo gasto na leitura de documentos de dezenas de páginas e consolidação manual de planilhas complexas.",
      solution: "Desenvolvimento de dashboards interativos no Power BI conectados a fontes de dados consolidadas, além de pipelines com prompts estruturados para resumos executivos.",
      results: [
        "Economia de cerca de 6 horas semanais na elaboração de briefings e relatórios corporativos.",
        "Visibilidade em tempo real para indicadores de comunicação e metas da equipe.",
        "Adoção de boas práticas de segurança e confidencialidade no uso de ferramentas de IA."
      ],
      tools: ["Power BI", "Microsoft Excel (Power Query)", "Engenharia de Prompts", "Trello Automations", "DAX"],
      featured: false
    }
  ],

  certifications: [
    {
      id: "midia-globo",
      title: "Mídia",
      institution: "Master Globo",
      year: "2024",
      skillsAcquired: ["Planejamento de Mídia", "Estratégia de Canais", "Audiência e Alcance", "Storytelling Publicitário"]
    },
    {
      id: "esg-box1824",
      title: "ESG – A Importância Além da Sigla",
      institution: "Box1824",
      year: "2023",
      skillsAcquired: ["Critérios ESG", "Governança Corporativa", "Sustentabilidade nos Negócios", "Tendências Socioculturais"]
    },
    {
      id: "observatorio-pucrs",
      title: "Observatório de Tendências",
      institution: "PUC-RS",
      year: "2023",
      skillsAcquired: ["Pesquisa de Tendências (Coolhunting)", "Leitura de Sinais Fracos", "Futurismo Aplicado", "Comportamento do Consumidor"]
    },
    {
      id: "digital-marketing-santander",
      title: "Digital Marketing",
      institution: "Santander Open Academy",
      year: "2023",
      skillsAcquired: ["Growth & Aquisição", "Funis de Marketing", "SEO & Copywriting", "Web Analytics"]
    }
  ],

  skills: [
    {
      category: "Estratégia & Análise de Negócios",
      description: "Planejamento corporativo, visão analítica e mensuração de impacto.",
      items: [
        { name: "Planejamento Estratégico", level: "Avançado" },
        { name: "Power BI & Dashboards", level: "Avançado" },
        { name: "Excel Avançado / Modelagem", level: "Avançado" },
        { name: "Análise de Indicadores (KPIs/OKRs)", level: "Avançado" },
        { name: "Customer Experience (CX)", level: "Especialista" },
        { name: "Metodologias Ágeis (Scrum/Kanban)", level: "Avançado" }
      ]
    },
    {
      category: "Comunicação & Criação Visual",
      description: "Storytelling executivo, redação estratégica e direção de arte.",
      items: [
        { name: "Endomarketing & Cultura", level: "Especialista" },
        { name: "Design Editorial & Peças Visuais", level: "Avançado" },
        { name: "Adobe Photoshop & Illustrator", level: "Intermediário" },
        { name: "Canva Pro", level: "Especialista" },
        { name: "Edição de Vídeo (Capcut)", level: "Avançado" },
        { name: "PowerPoint Executivo", level: "Especialista" }
      ]
    },
    {
      category: "Tecnologia, Ferramentas & IA",
      description: "Adoção contínua de inovação, ecossistema colaborativo e IA generativa.",
      items: [
        { name: "Engenharia de Prompts com IA", level: "Avançado" },
        { name: "Ecossistema Microsoft 365", level: "Especialista" },
        { name: "Trello & Gestão de Demandas", level: "Especialista" },
        { name: "Automação de Workflows", level: "Intermediário" },
        { name: "Fundamentos de Machine Learning", level: "Intermediário" },
        { name: "Miro & Facilitação de Ideação", level: "Avançado" }
      ]
    }
  ]
};
