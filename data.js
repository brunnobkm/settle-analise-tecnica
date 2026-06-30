/* ============================================================
   Dataset — Análise Técnica · multi-tipo (produto / serviço / software / solução)
   Estados de célula (matriz): ok | no | ne | na | sig   ·  c = alta|media|baixa
   Estados de checklist (atende-não): ok | no | parcial | ne
   ============================================================ */

const EDITAL = {
  numero: "R043/2026",
  pill: "Solução",
  orgao: "Prefeitura Municipal de Conselheiro Lafaiete",
  uf: "MG",
  objeto: "FORNECIMENTO DE EQUIPAMENTOS DE VIDEOMONITORAMENTO E PRESTAÇÃO CONTINUADA DE SERVIÇOS DE INSTALAÇÃO, COM CERCO VIRTUAL, LEITURA DE PLACAS (LPR) E RECONHECIMENTO FACIAL.",
  modalidade: "Pregão - Eletrônico",
  julgamento: "Menor preço por lote",
  valorGlobal: "R$ 4.775.427,20",
  docTexto: `TERMO DE REFERÊNCIA — AQUISIÇÃO E INSTALAÇÃO DE SISTEMA DE VIDEOMONITORAMENTO

1. OBJETO
Contratação de empresa especializada para fornecimento de equipamentos de videomonitoramento e prestação continuada de serviços de instalação, com cerco virtual, leitura de placas (LPR) e reconhecimento facial, conforme especificações constantes neste Termo de Referência.

2. ESPECIFICAÇÕES TÉCNICAS DAS CÂMERAS
2.1. As câmeras deverão possuir resolução mínima de 4 MP (2688 × 1520 pixels), com varredura progressiva.
2.2. Suporte a compressão de vídeo H.265+ / H.265 / H.264, com taxa de bits ajustável.
2.3. Lente fixa com distância focal de 2,8 mm, abertura de diafragma F2.0 ou inferior, e campo de visão horizontal de no mínimo 100°.
2.4. Sensibilidade luminosa em modo colorido de no máximo 0,005 Lux (F2.0, AGC ON) e iluminação infravermelha com alcance mínimo de 30 metros.
2.5. Deverá possuir análise inteligente embarcada (deep learning) para classificação de pessoas e veículos, com detecção por cruzamento de linha e captura facial.

3. PROTEÇÃO E AMBIENTE
3.1. Invólucro com grau de proteção mínimo IP67 e resistência a impacto IK10.
3.2. Faixa de operação de -30 °C a +60 °C, umidade ≤ 95%.

4. ARMAZENAMENTO E REDE
4.1. Armazenamento local em cartão microSD de até 256 GB para gravação na borda.
4.2. Alimentação via PoE (IEEE 802.3af) e/ou 12 Vdc.`,
};

/* catálogo de SKUs (produto) */
const SKUS = [
  { model: "DS-2CD2143G2-I",  brand: "Hikvision" },
  { model: "DS-2CD2043G2-IU", brand: "Hikvision" },
  { model: "VIP-3230-B-IA",   brand: "Intelbras" },
  { model: "IPC-HFW2431S-S2", brand: "Dahua" },
  { model: "DS-2CD2086G2-IU", brand: "Hikvision" },
  { model: "VIP-1230-B",      brand: "Intelbras" },
  { model: "IPC-HDW1431S",    brand: "Dahua" },
];

const c = (st, v, conf) => ({ st, v, c: conf });

/* requisitos de produto (matriz base) */
const REQS = [
  { req: "Resolução", exig: "≥ 4 MP", modulo: "Vídeo",
    origem: { doc: "Termo de Referência", pag: 11, trecho: "As câmeras deverão possuir resolução mínima de <mark>4 MP (2688 × 1520 pixels)</mark>." },
    cells: [c("ok","4 MP","alta"),c("ok","4 MP","alta"),c("no","2 MP","alta"),c("ok","4 MP","alta"),c("ok","8 MP","media"),c("no","2 MP","alta"),c("ok","4 MP","alta")] },
  { req: "Compressão de vídeo", exig: "H.265+", modulo: "Vídeo",
    origem: { doc: "Termo de Referência", pag: 11, trecho: "Suporte a compressão <mark>H.265+</mark> / H.265 / H.264." },
    cells: [c("ok","H.265+","alta"),c("ok","H.265+","alta"),c("ok","H.265+","media"),c("ok","H.265+","alta"),c("ok","H.265+","alta"),c("ok","H.265+","alta"),c("ok","H.265+","media")] },
  { req: "Distância focal", exig: "2.8 mm", modulo: "Óptica",
    origem: { doc: "Termo de Referência", pag: 12, trecho: "Lente fixa de <mark>2,8 mm</mark>, F2.0 ou inferior." },
    cells: [c("ok","2.8 mm","alta"),c("ok","2.8 mm","alta"),c("no","3.6 mm","alta"),c("ok","2.8 mm","alta"),c("no","3.6 mm","alta"),c("no","3.6 mm","alta"),c("ok","2.8 mm","alta")] },
  { req: "Abertura horizontal (FOV)", exig: "≥ 100°", modulo: "Óptica",
    origem: { doc: "Termo de Referência", pag: 12, trecho: "Campo de visão horizontal de no mínimo <mark>100°</mark>." },
    cells: [c("ok","103°","alta"),c("ok","103°","alta"),c("no","87°","alta"),c("ok","105°","media"),c("ok","102°","alta"),c("no","85°","alta"),c("no","98°","media")] },
  { req: "Sensibilidade noturna (colorido)", exig: "≤ 0,005 Lux", modulo: "Óptica",
    origem: { doc: "Termo de Referência", pag: 12, trecho: "Sensibilidade em modo colorido de no máximo <mark>0,005 Lux</mark>." },
    cells: [c("ok","0,003 Lux","alta"),c("ok","0,005 Lux","media"),c("no","0,01 Lux","media"),c("ok","0,0005 Lux","baixa"),c("ok","0,003 Lux","alta"),c("no","0,02 Lux","media"),c("ne","—","baixa")] },
  { req: "Alcance do infravermelho (IR)", exig: "≥ 30 m", modulo: "Visão noturna",
    origem: { doc: "Termo de Referência", pag: 13, trecho: "Iluminação infravermelha com alcance mínimo de <mark>30 metros</mark>." },
    cells: [c("ok","30 m","alta"),c("ok","30 m","alta"),c("ok","30 m","alta"),c("ok","40 m","alta"),c("ok","30 m","alta"),c("ok","32 m","alta"),c("ok","30 m","media")] },
  { req: "Análise inteligente embarcada", exig: "Sim", modulo: "Inteligência",
    origem: { doc: "Termo de Referência", pag: 14, trecho: "Deverá possuir <mark>análise inteligente embarcada</mark> (deep learning)." },
    cells: [c("ok","Sim","alta"),c("ok","Sim","alta"),c("no","Não","alta"),c("ok","Sim","media"),c("ok","Sim","alta"),c("no","Não","alta"),c("ok","Sim","media")] },
  { req: "Detecção de cruzamento de linha", exig: "Sim", modulo: "Inteligência",
    origem: { doc: "Termo de Referência", pag: 14, trecho: "Detecção por <mark>cruzamento de linha</mark> e intrusão de área." },
    cells: [c("ok","Sim","alta"),c("ok","Sim","alta"),c("ne","—","baixa"),c("ok","Sim","alta"),c("ok","Sim","alta"),c("no","Não","alta"),c("ok","Sim","media")] },
  { req: "Detecção facial", exig: "Sim", modulo: "Inteligência",
    origem: { doc: "Termo de Referência", pag: 14, trecho: "Capacidade de <mark>detecção facial</mark> com captura de instantâneo." },
    cells: [c("no","Não","media"),c("no","Não","media"),c("no","Não","alta"),c("no","Não","media"),c("ok","Sim","media"),c("no","Não","alta"),c("no","Não","media")] },
  { req: "Grau de proteção", exig: "IP67", modulo: "Proteção",
    origem: { doc: "Termo de Referência", pag: 13, trecho: "Grau de proteção mínimo <mark>IP67</mark>." },
    cells: [c("ok","IP67","alta"),c("ok","IP67","alta"),c("no","IP66","alta"),c("ok","IP67","alta"),c("no","IP66","alta"),c("no","IP66","alta"),c("ok","IP67","alta")] },
  { req: "Proteção contra impacto", exig: "IK10", modulo: "Proteção",
    origem: { doc: "Termo de Referência", pag: 13, trecho: "Resistência a impacto de no mínimo <mark>IK10</mark>." },
    cells: [c("ok","IK10","alta"),c("no","IK08","alta"),c("ok","IK10","media"),c("no","IK08","alta"),c("ok","IK10","alta"),c("ne","—","baixa"),c("no","IK08","alta")] },
  { req: "Slot de cartão microSD (edge)", exig: "Sim (até 256 GB)", modulo: "Armazenamento",
    origem: { doc: "Termo de Referência", pag: 15, trecho: "Armazenamento local em <mark>microSD de até 256 GB</mark>." },
    cells: [c("ok","256 GB","alta"),c("ok","256 GB","alta"),c("no","128 GB","media"),c("ok","256 GB","alta"),c("ok","256 GB","alta"),c("no","Não possui","alta"),c("ok","256 GB","media")] },
  { req: "Alimentação PoE", exig: "PoE (802.3af)", modulo: "Rede / Energia",
    origem: { doc: "Termo de Referência", pag: 15, trecho: "Alimentação via <mark>PoE (IEEE 802.3af)</mark>." },
    cells: [c("ok","PoE 802.3af","alta"),c("ok","PoE 802.3af","alta"),c("ok","PoE 802.3af","media"),c("ok","PoE 802.3af","alta"),c("ok","PoE 802.3af","alta"),c("ok","PoE 802.3af","alta"),c("ok","PoE 802.3af","media")] },
  { req: "Áudio embarcado", exig: "—", exigNa: true, modulo: "Áudio",
    origem: { doc: "Termo de Referência", pag: 16, trecho: "O Termo de Referência não faz exigência quanto a áudio embarcado." },
    cells: [c("na","Sim"),c("na","Sim"),c("na","Não"),c("na","Sim"),c("na","Sim"),c("na","Não"),c("na","Sim")] },
  { req: "Temperatura de operação", exig: "-30°C a 60°C", modulo: "Ambiental",
    origem: { doc: "Termo de Referência", pag: 13, trecho: "Faixa de operação de <mark>-30 °C a +60 °C</mark>." },
    cells: [c("ok","-30~60°C","alta"),c("ok","-30~60°C","alta"),c("ok","-30~60°C","alta"),c("ok","-30~60°C","alta"),c("ok","-40~60°C","alta"),c("ok","-30~60°C","alta"),c("ok","-30~60°C","media")] },
];

/* checklist de SERVIÇO (mecânica atende / não atende) */
const cl = (req, exig, modulo, st, conf, just, pag, trecho) => ({ req, exig, modulo, st, c: conf, just, origem: { doc: "Termo de Referência", pag, trecho } });
const SERVICO_INSTALL = [
  cl("Instalação física e fixação das câmeras", "Conforme TR", "Instalação", "ok", "alta", "Empresa possui equipe e equipamentos para instalação em postes e fachadas.", 18, "Compreende a <mark>instalação física</mark> dos equipamentos em postes e fachadas."),
  cl("Lançamento de infraestrutura de rede", "Cabo óptico / UTP CAT6", "Rede", "ok", "alta", "Atende ao lançamento de fibra e UTP conforme projeto.", 19, "<mark>Lançamento de infraestrutura</mark> de rede óptica e metálica."),
  cl("Configuração e integração ao VMS", "Sim", "Configuração", "ok", "media", "Equipe certificada na integração ao software de gestão de vídeo.", 19, "Configuração e <mark>integração ao VMS</mark>."),
  cl("Operação assistida 24×7", "24×7 por 12 meses", "Operação", "no", "alta", "Empresa oferece operação assistida em horário comercial; não cobre 24×7.", 20, "<mark>Operação assistida 24 horas</mark>, 7 dias por semana, por 12 meses."),
  cl("Equipe técnica certificada", "Certificação do fabricante", "Equipe", "ok", "media", "Equipe possui certificação do fabricante das câmeras.", 21, "Equipe <mark>técnica certificada</mark> pelo fabricante."),
  cl("Garantia e manutenção corretiva", "36 meses", "Garantia", "parcial", "media", "Garantia padrão de 24 meses; 36 meses disponível com custo adicional.", 22, "<mark>Garantia e manutenção corretiva</mark> por 36 meses."),
];
/* checklist de SOFTWARE (software simples ≈ atende / não) */
const SOFTWARE_VMS = [
  cl("Gestão de vídeo (VMS) multiusuário", "Sim", "VMS", "ok", "alta", "Plataforma VMS com perfis e múltiplos usuários simultâneos.", 23, "<mark>Software de gestão de vídeo</mark> multiusuário."),
  cl("Leitura automática de placas (LPR)", "Sim", "Analítico", "ok", "alta", "Módulo LPR nativo integrado ao VMS.", 24, "<mark>Leitura automatizada de placas veiculares (LPR)</mark>."),
  cl("Reconhecimento facial em tempo real", "Sim", "Analítico", "no", "media", "Módulo facial disponível apenas na versão enterprise, não incluída na proposta.", 24, "<mark>Reconhecimento facial em tempo real</mark>."),
  cl("Aplicativo mobile gratuito", "Sim", "Mobile", "ok", "alta", "App iOS/Android gratuito incluído.", 25, "<mark>Aplicativo mobile gratuito</mark> para visualização."),
  cl("Integração com cerco virtual", "Sim", "Integração", "parcial", "baixa", "Integração via API; cerco virtual requer módulo adicional.", 25, "Integração com <mark>cerco virtual fixo e móvel</mark>."),
  cl("Armazenamento em nuvem", "Opcional", "Storage", "ok", "media", "Oferece gravação em nuvem como opção contratável.", 26, "<mark>Armazenamento em nuvem</mark> opcional."),
];

/* Requisitos que a IA identificou no edital, mas não conseguiu extrair o VALOR EXIGIDO.
   O valor de cada SKU (catálogo do cliente) nós temos; o que falta é a exigência do edital
   para fazer o match. vals segue a ordem de SKUS. */
const NAO_ANALISADAS = [
  { req: "WDR (faixa dinâmica)",                vals: ["120 dB", "120 dB", "120 dB", "120 dB", "140 dB", "100 dB", "120 dB"] },
  { req: "Estabilização eletrônica de imagem",  vals: ["Sim", "Sim", "Não", "Sim", "Sim", "Não", "Sim"] },
  { req: "Filtro mecânico IR-Cut",              vals: ["Sim", "Sim", "Sim", "Sim", "Sim", "Sim", "Sim"] },
  { req: "Garantia mínima",                     vals: ["36 meses", "36 meses", "24 meses", "36 meses", "36 meses", "12 meses", "24 meses"] },
  { req: "Certificação Anatel",                 vals: ["Homologado", "Homologado", "Homologado", "Homologado", "Homologado", "Homologado", "Homologado"] },
];
const CATALOGO_NAO_EDITAL = ["Zoom digital 16×","Microfone embutido","Sirene integrada"];

/* ============================================================
   Dataset TI — Firewall (Fortinet) para o caso de COMPOSIÇÃO (caixa + licença + garantia)
   ============================================================ */
const SKUS_FW = [
  { model: "FortiGate-200F", brand: "Fortinet" },
  { model: "FortiGate-120G", brand: "Fortinet" },
  { model: "FortiGate-100F", brand: "Fortinet" },
  { model: "FortiGate-80F",  brand: "Fortinet" },
];
const REQS_FW = [
  { req: "Throughput de Firewall", exig: "≥ 10 Gbps", modulo: "Desempenho",
    origem: { doc: "Termo de Referência", pag: 31, trecho: "Throughput de firewall de no mínimo <mark>10 Gbps</mark>." },
    cells: [c("ok","27 Gbps","alta"),c("ok","21 Gbps","alta"),c("ok","20 Gbps","alta"),c("no","10 Gbps","alta")] },
  { req: "Throughput de Threat Protection", exig: "≥ 1,5 Gbps", modulo: "Desempenho",
    origem: { doc: "Termo de Referência", pag: 31, trecho: "Throughput de threat protection (IPS+AV+App Ctrl) de no mínimo <mark>1,5 Gbps</mark>." },
    cells: [c("ok","3 Gbps","alta"),c("ok","2,2 Gbps","alta"),c("no","1 Gbps","alta"),c("no","900 Mbps","alta")] },
  { req: "Sessões concorrentes", exig: "≥ 1.000.000", modulo: "Capacidade",
    origem: { doc: "Termo de Referência", pag: 32, trecho: "Suporte a no mínimo <mark>1.000.000 de sessões concorrentes</mark>." },
    cells: [c("ok","1.500.000","alta"),c("ok","1.100.000","alta"),c("ok","1.000.000","media"),c("no","700.000","alta")] },
  { req: "Interfaces 1GbE (RJ45)", exig: "≥ 16 portas", modulo: "Interfaces",
    origem: { doc: "Termo de Referência", pag: 32, trecho: "No mínimo <mark>16 interfaces 1GbE RJ45</mark>." },
    cells: [c("ok","18 portas","alta"),c("ok","16 portas","alta"),c("no","14 portas","alta"),c("no","10 portas","alta")] },
  { req: "Túneis VPN IPsec", exig: "≥ 2.000", modulo: "VPN",
    origem: { doc: "Termo de Referência", pag: 33, trecho: "Suporte a no mínimo <mark>2.000 túneis VPN IPsec</mark> site-to-site." },
    cells: [c("ok","6.000","alta"),c("ok","2.500","alta"),c("ok","2.000","alta"),c("ne","—","baixa")] },
  { req: "Alta disponibilidade (HA)", exig: "Sim (ativo/passivo)", modulo: "Disponibilidade",
    origem: { doc: "Termo de Referência", pag: 33, trecho: "Operação em <mark>alta disponibilidade</mark> ativo/passivo e ativo/ativo." },
    cells: [c("ok","Sim","alta"),c("ok","Sim","alta"),c("ok","Sim","alta"),c("ok","Sim","media")] },
  { req: "Interfaces SFP+ 10GbE", exig: "≥ 4 portas", modulo: "Interfaces",
    origem: { doc: "Termo de Referência", pag: 32, trecho: "No mínimo <mark>4 interfaces SFP+ 10GbE</mark>." },
    cells: [c("ok","8 portas","alta"),c("ok","4 portas","alta"),c("no","2 portas","alta"),c("no","0 portas","alta")] },
];
/* licença e garantia entram como CHECKLIST (atende / não), são part numbers que somam à composição */
const LICENCA_FW = [
  cl("Bundle UTP (IPS, AV, Web/DNS, App Ctrl)", "Sim", "Licença", "ok", "alta", "Pacote FortiGuard UTP cobre IPS, antivírus, filtro web/DNS e controle de aplicação.", 34, "Subscrição de segurança com <mark>IPS, antivírus, filtro web e controle de aplicação</mark>."),
  cl("Subscrição mínima de 36 meses", "36 meses", "Licença", "ok", "alta", "Part number de subscrição de 36 meses disponível.", 34, "Subscrição das funcionalidades de segurança por <mark>36 (trinta e seis) meses</mark>."),
  cl("Sandbox / proteção avançada (ATP)", "Sim", "Licença", "no", "media", "ATP/Sandbox não incluso no bundle UTP; exige bundle ATP (custo adicional).", 35, "Proteção avançada contra ameaças (<mark>sandbox / ATP</mark>)."),
];
const GARANTIA_FW = [
  cl("Suporte do fabricante 24×7", "FortiCare 24×7", "Garantia", "ok", "alta", "FortiCare Premium 24×7 disponível como part number de serviço.", 36, "Suporte técnico do fabricante <mark>24 horas por dia, 7 dias por semana</mark>."),
  cl("Troca de hardware (RMA) com envio antecipado", "Sim", "Garantia", "ok", "media", "RMA com Advanced Hardware Replacement incluído no FortiCare.", 36, "Garantia com <mark>troca antecipada de hardware (RMA)</mark>."),
  cl("Prazo de garantia", "36 meses", "Garantia", "ok", "alta", "Serviço de garantia contratável por 36 meses, alinhado à licença.", 36, "Garantia de <mark>36 meses</mark> para o hardware e serviço."),
];
const CATALOGO_NAO_EDITAL_FW = ["Fonte redundante (RPS)", "Módulo Wi-Fi", "FortiToken (MFA)"];

/* ============================================================
   ITENS do edital — modelo de COMPOSIÇÃO.
   Um item NÃO tem mais "tipo": ele é uma lista de COMPONENTES. Cada componente tem a sua
   mecânica: "produto" (comparar/escolher SKU, matriz) ou "checklist" (atende/não atende).
   Um item da vida real é quase sempre uma composição (ex.: caixa + licença + garantia).
   titulo = "o que é o item" em linguagem clara; nome = descrição completa.
   ============================================================ */
const ITEMS = [
  // 1) SÓ PRODUTO — compara/escolhe SKU
  { titulo: "Câmeras LPR (leitura de placas)",
    nome: "Câmera de segurança: fornecimento de 80 câmeras, modelo LPR (leitura de placas), para o anel viário, conforme Termo de Referência.",
    quantidade: "80", precoUnit: 2980,
    resumoTR: "Aquisição de 80 câmeras IP com leitura de placas (LPR) para o anel viário. Indique, do seu catálogo, qual SKU atende às especificações e a que preço.",
    componentes: [
      { mecanica: "produto", rotulo: "Câmera (hardware)", skus: SKUS, reqs: REQS, naoAnalisadas: NAO_ANALISADAS, catalogoNaoEdital: CATALOGO_NAO_EDITAL, overrides: [] },
    ] },

  // 2) PRODUTO + SERVIÇO — câmera bullet + instalação
  { titulo: "Câmeras Bullet + instalação",
    nome: "Câmera de segurança bullet fixa (100 unidades) com serviço de instalação, lançamento de rede e integração ao VMS.",
    quantidade: "100", precoUnit: 2210,
    resumoTR: "Fornecimento de 100 câmeras bullet fixas mais o serviço de instalação. Item composto: você escolhe o SKU da câmera e confirma se atende às exigências do serviço.",
    componentes: [
      { mecanica: "produto", rotulo: "Câmera (hardware)", skus: SKUS, reqs: REQS, naoAnalisadas: NAO_ANALISADAS, catalogoNaoEdital: CATALOGO_NAO_EDITAL, overrides: [{ ri: 8, ci: 0, st: "ok", v: "Sim", c: "alta" }] },
      { mecanica: "checklist", rotulo: "Instalação e operação", lista: SERVICO_INSTALL },
    ] },

  // 3) COMPOSIÇÃO TI — caixa + licença + garantia (caso dos "99%" do Paulo)
  { titulo: "Firewall de perímetro (appliance + licença + garantia)",
    nome: "Solução de firewall de próxima geração (NGFW) para o perímetro: appliance, subscrição de segurança (licença) e serviço de garantia/suporte do fabricante, em part numbers compostos.",
    quantidade: "2", precoUnit: 86000,
    resumoTR: "Item de TI composto por três part numbers que somam: o hardware (appliance), a licença de segurança e o serviço de garantia. A análise precisa cobrir os três componentes juntos.",
    componentes: [
      { mecanica: "produto", rotulo: "Appliance (hardware)", skus: SKUS_FW, reqs: REQS_FW, catalogoNaoEdital: CATALOGO_NAO_EDITAL_FW, overrides: [] },
      { mecanica: "checklist", rotulo: "Licença de segurança (subscrição)", lista: LICENCA_FW },
      { mecanica: "checklist", rotulo: "Garantia e suporte do fabricante", lista: GARANTIA_FW },
    ] },

  // 4) SÓ SERVIÇO — instalação e operação
  { titulo: "Instalação e operação do sistema",
    nome: "Serviço de instalação, configuração e operação assistida do sistema de videomonitoramento.",
    quantidade: "1", precoUnit: 320000,
    resumoTR: "Contratação da empresa que instala as câmeras, lança a rede, integra ao software e opera o sistema. Não há escolha de SKU: você confirma se consegue cumprir cada exigência do serviço.",
    componentes: [
      { mecanica: "checklist", rotulo: "Serviço de instalação e operação", lista: SERVICO_INSTALL },
    ] },

  // 5) SÓ SOFTWARE / LICENÇA — VMS
  { titulo: "Software de gestão de vídeo (VMS)",
    nome: "Licença de software de gestão de vídeo (VMS) com leitura de placas (LPR) e cerco virtual.",
    quantidade: "1", precoUnit: 145000,
    resumoTR: "Licenciamento do software que centraliza as câmeras, faz leitura de placas e cerco virtual. Confirme se a sua solução atende a cada funcionalidade exigida.",
    componentes: [
      { mecanica: "checklist", rotulo: "Software de gestão de vídeo (VMS)", lista: SOFTWARE_VMS },
    ] },
];
