export type Categoria = "oficial" | "leak" | "rumor" | "trailer" | "analise" | "online" | "breaking";

export interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  resumo_ia: string;
  conteudo: string;
  categoria: Categoria;
  fonte: string;
  fonte_url: string;
  imagem: string;
  criado_em: string;
  views: number;
  destaque?: boolean;
}

export interface Personagem {
  id: string;
  nome: string;
  tipo: "protagonista" | "antagonista" | "misterio" | "coadjuvante";
  status: "confirmado" | "leaked" | "rumor";
  descricao: string;
  historia: string;
  imagem: string;
  stats: { combate: number; direcao: number; furtividade: number; carisma: number; hacking: number };
  trailer?: string;
}

export interface LocalMapa {
  id: string;
  nome: string;
  status: "confirmado" | "leaked" | "rumor";
  descricao: string;
  x: number; // percentual no SVG
  y: number;
  tipo: "cidade" | "area_natural" | "cidade_pequena" | "ilha";
}

export interface LeakItem {
  id: string;
  titulo: string;
  status: "confirmado" | "provavel" | "rumor" | "falso";
  credibilidade: number;
  fonte: string;
  descricao: string;
  data: string;
}

// ─── NOTÍCIAS ───────────────────────────────────────────────────────────────

export const noticias: Noticia[] = [
  {
    id: "1",
    slug: "trailer-3-gta6-analise-completa-vilao-revelado",
    titulo: "Trailer 3 do GTA VI: Vilão revelado, GTA Online mostrado e tudo analisado frame a frame",
    resumo: "Rockstar lançou o Trailer 3 junto com a abertura de pré-vendas em 25 de junho. Três minutos de footage revelaram o antagonista e confirmaram o GTA Online.",
    resumo_ia: "Trailer 3 confirma Victor Crane como vilão, mostra GTA Online ao vivo, data 19 Nov 2026. 21M visualizações em 24h.",
    conteudo: `A Rockstar Games lançou o Trailer 3 de GTA VI simultaneamente com a abertura das pré-vendas no dia 25 de junho de 2026. Três minutos de footage completamente inéditos incendiaram a internet.

**O vilão foi revelado**
Victor Crane, bilionário e desenvolvedor imobiliário de Vice City, é o antagonista principal. Ele aparece em cenas impressionantes destruindo bairros inteiros para "limpar" Vice City, enquanto Lucia e Jason tentam sobreviver à sua perseguição.

**GTA Online confirmado**
Pela primeira vez, foram mostradas cenas do GTA Online com lobbies massivos. A Rockstar confirmou que o modo online chegará junto com o lançamento em 19 de novembro.

**Detalhes revelados**
- Vice City à noite com densidade urbana nunca vista em games
- Sistema de física de veículos completamente reformulado
- Cutscenes cinematográficas com qualidade de filme
- Lucia e Jason em confronto direto com as forças de Crane`,
    categoria: "trailer",
    fonte: "Rockstar Games",
    fonte_url: "https://rockstargames.com",
    imagem: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    criado_em: "2026-06-25T10:00:00Z",
    views: 21300000,
    destaque: true,
  },
  {
    id: "2",
    slug: "pre-venda-aberta-gta6-edicoes-precos",
    titulo: "Pré-venda do GTA VI aberta: Standard R$399, Deluxe R$499, Collector's R$899",
    resumo: "Rockstar abre pré-venda com três edições. Quem reservar recebe acesso antecipado de 3 dias e bônus exclusivos.",
    resumo_ia: "Pré-venda live na PS Store e Xbox Store. 3 edições. Acesso antecipado 16 Nov para quem reservar qualquer edição.",
    conteudo: `As pré-vendas de Grand Theft Auto VI estão oficialmente abertas na PlayStation Store e Microsoft Store.

**Edições disponíveis:**
- **Standard ($79.99):** Jogo base + $500k in-game para GTA Online
- **Deluxe ($99.99):** Jogo base + $1.5M in-game + pacote de veículos exclusivos + conteúdo de história adicional
- **Collector's ($179.99):** Tudo do Deluxe + steelbook físico + estatueta de 30cm de Lucia e Jason + mapa de tecido de Leonida

**Bônus universais para pré-venda:**
- Acesso antecipado de 72 horas (a partir de 16 de novembro)
- Tema exclusivo para PS5/Xbox
- Carro exclusivo "Leonida Runner" para GTA Online`,
    categoria: "oficial",
    fonte: "Rockstar Newswire",
    fonte_url: "https://rockstargames.com/newswire",
    imagem: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    criado_em: "2026-06-25T09:00:00Z",
    views: 6800000,
  },
  {
    id: "3",
    slug: "data-lancamento-19-novembro-2026-confirmada",
    titulo: "Data oficial: GTA VI lança em 19 de Novembro de 2026 — rumores de atraso desmentidos",
    resumo: "Rockstar e Take-Two confirmam que não há nenhum atraso. 19 de novembro de 2026 é a data final para PS5 e Xbox Series.",
    resumo_ia: "Data confirmada: 19/11/2026 PS5 e Xbox Series. Acesso antecipado 16/11. PC adiado para 2027. Rumores de atraso falsos.",
    conteudo: `Após semanas de boatos sobre um possível atraso, a Rockstar Games e a Take-Two Interactive encerraram de vez as especulações.

**Datas confirmadas:**
- Acesso antecipado (pré-venda): **16 de novembro de 2026**
- Lançamento global: **19 de novembro de 2026**
- PS5 e Xbox Series X|S

**PC:**
O CEO da Take-Two confirmou que a versão para PC está em desenvolvimento mas será lançada "quando estiver pronta", com estimativa interna para o segundo semestre de 2027.

**Declaração do CEO:**
*"Muita gente vai ligar doente no trabalho no dia 19 de novembro. E nós entendemos completamente."* — Strauss Zelnick, CEO da Take-Two

O jogo está em desenvolvimento há mais de 10 anos e representa o maior orçamento da história dos videogames, estimado em mais de $2 bilhões de dólares.`,
    categoria: "oficial",
    fonte: "Take-Two Interactive",
    fonte_url: "https://take2games.com",
    imagem: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    criado_em: "2026-04-14T12:00:00Z",
    views: 2900000,
  },
  {
    id: "4",
    slug: "mapa-leonida-confirmado-3x-maior-gta5",
    titulo: "Mapa de Leonida é 3x maior que GTA V, confirma Rockstar — todas as localizações reveladas",
    resumo: "Análise completa do mapa de Leonida: Vice City, Everglades, Leonida Keys, Port Gellhorn e muito mais.",
    resumo_ia: "Mapa oficial: 3x GTA V. Inclui Vice City (cidade principal), Everglades (área natural), Keys (ilhas) e Port Gellhorn (cidade portuária).",
    conteudo: `A Rockstar Games confirmou oficialmente que o mapa de Leonida em GTA VI é aproximadamente três vezes maior que o mapa de Los Santos em GTA V.

**Regiões confirmadas:**
- **Vice City:** A cidade principal, baseada em Miami. Centro financeiro, praias, art deco, Downtown e subúrbios
- **Everglades (Leonida Wetlands):** Área pantanosa ao norte, com fauna selvagem, missões de caça e esconderijos rurais
- **Leonida Keys:** Arquipélago ao sul, baseado nos Florida Keys, com resort, pesca e operações de tráfico marítimo
- **Port Gellhorn:** Cidade portuária industrial a oeste, com doca, fábrica e território de gangues

**Detalhes técnicos:**
- Mapa completamente explorável desde o início
- Transição seamless entre cidade e áreas rurais
- Clima dinâmico por região (chuva nos pântanos, seco na cidade)
- Fauna com mais de 100 espécies de animais`,
    categoria: "oficial",
    fonte: "Rockstar Games / Análise comunitária",
    fonte_url: "https://rockstargames.com",
    imagem: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    criado_em: "2026-02-20T14:00:00Z",
    views: 3100000,
  },
  {
    id: "5",
    slug: "lucia-jason-analise-protagonistas-habilidades",
    titulo: "Lucia e Jason: análise completa dos protagonistas, habilidades e mecânicas de dois personagens",
    resumo: "Tudo que sabemos sobre os dois protagonistas de GTA VI: backstory, habilidades únicas e como a mecânica de troca funciona.",
    resumo_ia: "Lucia: cubana-americana, ex-cartel, especialista em furtividade e carisma. Jason: nativo de Leonida, força bruta e direção. Troca dinâmica.",
    conteudo: `Grand Theft Auto VI marca a primeira vez na série principal com dois protagonistas jogáveis simultâneos. Aqui está tudo que sabemos.

**LUCIA**
Lucia Caminos é cubana-americana criada em Vice City. Envolvida com o cartel desde jovem, ela é a mente estratégica do duo. Suas habilidades se destacam em:
- Furtividade e infiltração
- Persuasão e manipulação (carisma alto)
- Hacking e sistemas eletrônicos
- Tiro com armas de precisão

**JASON**
Jason Duval é filho de Leonida — criado na pobreza nas regiões rurais do estado. O músculo da dupla. Habilidades:
- Combate corpo a corpo superior
- Direção em alta velocidade
- Resistência a danos
- Acesso a redes criminosas rurais

**Mecânica de dois protagonistas:**
O jogo permite trocar entre Lucia e Jason a qualquer momento em mundo aberto, similar a GTA V mas com muito mais integração narrativa. Algumas missões exigem que você controle um enquanto o outro age de forma autônoma.`,
    categoria: "analise",
    fonte: "GTA6 Teste / Compilação de trailers",
    fonte_url: "/",
    imagem: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
    criado_em: "2026-02-25T10:00:00Z",
    views: 1800000,
  },
  {
    id: "6",
    slug: "rockstar-hackeada-shinyhunters-vazamento",
    titulo: "Rockstar hackeada: ShinyHunters acessa dados internos via fornecedor terceiro",
    resumo: "Grupo hacker ShinyHunters conseguiu acesso a dados da Rockstar através de um fornecedor de TI terceirizado. Ransom recusado.",
    resumo_ia: "Hack via terceiro exposé código-fonte parcial e material de desenvolvimento. Rockstar recusou pagar resgate. Dados liberados online.",
    conteudo: `A Rockstar Games foi vítima de um ataque cibernético significativo perpetrado pelo grupo ShinyHunters, que obteve acesso a sistemas internos através de uma vulnerabilidade em um fornecedor terceirizado de TI.

**O que foi comprometido:**
- Código-fonte parcial de ferramentas internas de desenvolvimento
- Material de pré-produção de projetos não anunciados
- Dados de funcionários (nomes e emails corporativos)
- Documentação interna de design

**O que NÃO foi comprometido:**
- Dados financeiros de jogadores
- Senhas ou informações de contas do Rockstar Games
- Código-fonte do GTA VI (confirmado pela empresa)

**Posição da Rockstar:**
A empresa recusou pagar o resgate exigido pelos hackers. Em comunicado oficial, afirmaram que o incidente "não afetará o desenvolvimento ou lançamento de nossos títulos planejados".`,
    categoria: "breaking",
    fonte: "Rockstar Games / Relatórios de segurança",
    fonte_url: "https://rockstargames.com/newswire",
    imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    criado_em: "2026-04-15T08:00:00Z",
    views: 3800000,
  },
  {
    id: "7",
    slug: "gta-online-lobbies-100-jogadores-criminal-empire",
    titulo: "GTA Online: lobbies com 100 jogadores e sistema de \"Criminal Empire\" persistente revelados",
    resumo: "GTA VI Online terá o dobro de jogadores por lobby e um sistema onde facções constroem impérios criminosos que persistem entre sessões.",
    resumo_ia: "GTA Online: 100 players por lobby, Criminal Empire persiste entre sessões, territórios contestáveis, economia dinâmica.",
    conteudo: `O GTA VI Online promete ser a maior evolução do modo multiplayer desde o lançamento original de GTA Online em 2013.

**Criminal Empire System:**
O sistema mais aguardado permite que grupos de jogadores construam e defendam impérios criminosos em Leonida. Negócios, território e reputação persistem entre sessões — se você domina um porto hoje, ele ainda é seu amanhã (a menos que seja atacado).

**Lobbies de 100 jogadores:**
O dobro do limite atual de GTA Online. Vice City é grande o suficiente para acomodar todos sem que as sessões se tornem caóticas.

**Outras features confirmadas:**
- Heists cooperativos para até 8 jogadores
- Modo "Roleplay" com NPC mais inteligentes
- Economia dinâmica influenciada pelas ações dos jogadores
- Carros, barcos e aviões completamente personalizáveis`,
    categoria: "online",
    fonte: "Leak verificado / Rockstar",
    fonte_url: "/leaks",
    imagem: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
    criado_em: "2026-03-10T16:00:00Z",
    views: 4200000,
  },
  {
    id: "8",
    slug: "cover-art-oficial-lucia-jason-vice-city",
    titulo: "Arte da capa oficial revelada: Lucia, Jason e o skyline de Vice City ao entardecer",
    resumo: "Rockstar divulga a arte oficial da caixa de GTA VI mostrando os dois protagonistas com Vice City ao fundo em tons de laranja.",
    resumo_ia: "Capa oficial: Lucia à frente, Jason atrás, skyline de Vice City ao por do sol. Estética Miami Vice modernizada.",
    conteudo: `A Rockstar Games revelou a arte oficial da capa de Grand Theft Auto VI junto com a abertura das pré-vendas.

**O que a arte mostra:**
Lucia está em primeiro plano, olhando diretamente para o espectador com expressão determinada. Jason aparece logo atrás, com o skyline de Vice City ao pôr do sol criando um backdrop dourado e laranja que lembra muito a estética do clássico Miami Vice.

**Detalhes visuais:**
- Paleta de cores quentes: laranja, dourado e rosa
- Vestuário casual mas estilizado para ambos
- Helicópteros ao fundo sugerem uma perseguição
- O sol poente cria silhuetas de prédios icônicos

**Recepção:**
A arte foi extremamente bem recebida pela comunidade, com muitos comparando-a com a capa clássica de Vice City de 2002. Em menos de 24 horas, a imagem gerou mais de 50 milhões de impressões nas redes sociais.`,
    categoria: "oficial",
    fonte: "Rockstar Games",
    fonte_url: "https://rockstargames.com",
    imagem: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
    criado_em: "2026-06-25T08:30:00Z",
    views: 7400000,
  },
];

// ─── PERSONAGENS ─────────────────────────────────────────────────────────────

export const personagens: Personagem[] = [
  {
    id: "lucia",
    nome: "Lucia Caminos",
    tipo: "protagonista",
    status: "confirmado",
    descricao: "Cubana-americana com laços profundos no cartel. A mente estratégica do duo central de GTA VI.",
    historia: `Lucia Caminos cresceu em Little Havana, em Vice City, filha de imigrantes cubanos envolvidos com o crime organizado desde os anos 80. Inteligente e determinada desde cedo, ela foi recrutada pelo cartel aos 19 anos após demonstrar habilidade excepcional em operações de logística e lavagem de dinheiro.

Após uma traição que a levou a uma passagem pela prisão, Lucia emergiu mais dura e mais focada. Seu relacionamento com Jason começou dentro do sistema criminal e evoluiu para algo mais profundo — uma parceria baseada em confiança mútua em um mundo onde ninguém mais pode ser confiado.

Seus objetivos em GTA VI giram em torno de construir algo próprio, fora da sombra do cartel e longe das garras de Victor Crane, que ameaça destruir tudo que ela construiu.`,
    imagem: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    stats: { combate: 88, direcao: 75, furtividade: 92, carisma: 95, hacking: 70 },
    trailer: "Trailer 1 (Dez/2023) e Trailer 3 (Jun/2026)",
  },
  {
    id: "jason",
    nome: "Jason Duval",
    tipo: "protagonista",
    status: "confirmado",
    descricao: "Nativo de Leonida, parceiro e namorado de Lucia. O músculo e instinto por trás da estratégia dela.",
    historia: `Jason Duval nasceu e cresceu nas regiões rurais de Leonida, longe do glamour de Vice City. Criado na pobreza por um pai ausente e uma mãe que fazia o que podia, Jason aprendeu desde cedo que sobrevivência exigia disposição para fazer coisas que outros não fariam.

Ele entrou para o crime aos 17 anos, inicialmente como mula de tráfico nas estradas rurais de Leonida. Com o tempo, sua reputação de ser confiável e eficaz — e de nunca deixar um parceiro para trás — cresceu nos círculos criminosos.

Seu relacionamento com Lucia representa para Jason algo que ele nunca teve: um par verdadeiro. Alguém tão capaz e perigoso quanto ele, mas que o complementa onde ele tem fraquezas.`,
    imagem: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    stats: { combate: 95, direcao: 90, furtividade: 60, carisma: 72, hacking: 45 },
    trailer: "Trailer 1 (Dez/2023) e Trailer 3 (Jun/2026)",
  },
  {
    id: "victor-crane",
    nome: "Victor Crane",
    tipo: "antagonista",
    status: "confirmado",
    descricao: "Bilionário e desenvolvedor imobiliário de Vice City. Antagonista principal confirmado no Trailer 3.",
    historia: `Victor Crane construiu um império imobiliário em Vice City ao longo de três décadas, usando uma combinação de visão empresarial genuína e corrupção sistêmica. Ele controla políticos, policiais e juízes, tornando-se virtualmente intocável dentro do sistema legal.

Sua obsessão com "limpar" Vice City — expulsando os pobres, criminosos e qualquer um que não se encaixe em sua visão de uma cidade de luxo — o coloca em rota de colisão direta com Lucia e Jason, cujas operações ameaçam seus planos de gentrificação.

Nos bastidores, Crane financia operações criminosas próprias enquanto usa sua influência para perseguir grupos rivais. Ele é simultaneamente o homem mais respeitado e mais odiado de Vice City.`,
    imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    stats: { combate: 45, direcao: 55, furtividade: 75, carisma: 95, hacking: 80 },
    trailer: "Confirmado no Trailer 3 (Jun/2026)",
  },
  {
    id: "desconhecido",
    nome: "Figura Misteriosa",
    tipo: "misterio",
    status: "rumor",
    descricao: "Silhueta vista brevemente no Trailer 2. Aparenta controlar poder político e criminal significativo em Leonida.",
    historia: `Uma figura encapuzada aparece em apenas três frames do Trailer 2 de GTA VI, mas a comunidade não parou de especular desde então.

Dataminers que analisaram o trailer identificaram que a silhueta usa um distintivo que parece ser das forças especiais estaduais de Leonida — sugerindo que pode ser alguém dentro do próprio sistema de segurança do estado.

Teorias populares incluem desde um ex-parceiro de Lucia que a traiu até um agente federal disfarçado que está usando Crane como fantoche. A identidade permanece um dos maiores mistérios do jogo.`,
    imagem: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80",
    stats: { combate: 70, direcao: 55, furtividade: 85, carisma: 88, hacking: 80 },
    trailer: "Visto brevemente no Trailer 2",
  },
  {
    id: "cal-henderson",
    nome: "Cal Henderson",
    tipo: "coadjuvante",
    status: "leaked",
    descricao: "Xerife corrupto do condado rural de Leonida. Suposto aliado de Crane que extorque moradores locais.",
    historia: `Cal Henderson é o xerife eleito do Condado de Armadillo, a região rural ao norte de Vice City. Na superfície, ele é o típico policial do interior — folksy, fala devagar, sempre com um café na mão.

Na realidade, Henderson mantém um esquema de extorsão que funciona há mais de 20 anos. Qualquer operação criminal nas estradas rurais de Leonida paga uma taxa ao Xerife. Em troca, Henderson fecha os olhos ou, quando necessário, faz problemas desaparecerem.

Seu nome apareceu em documentos vazados de comunicações internas da Rockstar. Seu papel exato na história principal ainda não foi confirmado oficialmente.`,
    imagem: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    stats: { combate: 65, direcao: 70, furtividade: 50, carisma: 80, hacking: 20 },
    trailer: "Mencionado em leak, não confirmado",
  },
];

// ─── MAPA ────────────────────────────────────────────────────────────────────

export const locaisMapa: LocalMapa[] = [
  {
    id: "vice-city",
    nome: "Vice City",
    status: "confirmado",
    descricao: "A cidade principal do jogo. Baseada em Miami, com praias, art deco, Downtown, Little Havana e subúrbios. Centro da narrativa principal.",
    x: 52,
    y: 58,
    tipo: "cidade",
  },
  {
    id: "leonida-keys",
    nome: "Leonida Keys",
    status: "leaked",
    descricao: "Arquipélago ao sul baseado nos Florida Keys. Resort de luxo, operações de tráfico marítimo e acesso a ilhas menores.",
    x: 63,
    y: 78,
    tipo: "ilha",
  },
  {
    id: "port-gellhorn",
    nome: "Port Gellhorn",
    status: "leaked",
    descricao: "Cidade portuária industrial a sudoeste. Doca comercial, refinaria e território controlado por facções rivais.",
    x: 28,
    y: 68,
    tipo: "cidade_pequena",
  },
  {
    id: "everglades",
    nome: "Leonida Wetlands",
    status: "confirmado",
    descricao: "Vasta área pantanosa ao norte, baseada nos Everglades. Fauna selvagem, missões de caça, esconderijos rurais e cidades fantasma.",
    x: 38,
    y: 30,
    tipo: "area_natural",
  },
  {
    id: "armadillo-county",
    nome: "Condado de Armadillo",
    status: "leaked",
    descricao: "Região rural a noroeste. Fazendas, rodovias desertas e território do Xerife Henderson. Operações de tráfico terrestre.",
    x: 18,
    y: 35,
    tipo: "cidade_pequena",
  },
  {
    id: "unnamed-town",
    nome: "Cidade Desconhecida",
    status: "rumor",
    descricao: "Uma cidade não identificada vista brevemente em imagens vazadas. Parece ser ao norte de Vice City, com arquitetura industrial.",
    x: 55,
    y: 20,
    tipo: "cidade_pequena",
  },
  {
    id: "stilt-houses",
    nome: "Stilt Houses District",
    status: "rumor",
    descricao: "Bairro de casas suspensas sobre a água, similar ao Stiltwater de Vice City Stories. Visto em screenshot vazado.",
    x: 72,
    y: 45,
    tipo: "cidade_pequena",
  },
];

// ─── LEAK TRACKER ────────────────────────────────────────────────────────────

export const leaks: LeakItem[] = [
  {
    id: "1",
    titulo: "Mapa é 3x maior que GTA V",
    status: "confirmado",
    credibilidade: 100,
    fonte: "Rockstar Games Oficial",
    descricao: "Confirmado pela própria Rockstar em comunicado oficial junto com o Trailer 3.",
    data: "2026-06-25",
  },
  {
    id: "2",
    titulo: "Dois protagonistas: Lucia e Jason",
    status: "confirmado",
    credibilidade: 100,
    fonte: "Trailer 1 Oficial",
    descricao: "Confirmado desde o Trailer 1 em dezembro de 2023.",
    data: "2023-12-05",
  },
  {
    id: "3",
    titulo: "GTA Online com 100 jogadores por lobby",
    status: "provavel",
    credibilidade: 78,
    fonte: "GTAVIleaks (insider verificado)",
    descricao: "Múltiplos insiders confirmaram independentemente. Ainda sem confirmação oficial.",
    data: "2026-03-10",
  },
  {
    id: "4",
    titulo: "Versão PC atrasada para 2027",
    status: "provavel",
    credibilidade: 85,
    fonte: "Declarações de executivos / Dataminers",
    descricao: "CEO da Take-Two indicou que PC virá 'quando estiver pronto'. Consenso da comunidade aponta para final de 2027.",
    data: "2026-04-14",
  },
  {
    id: "5",
    titulo: "Economia com inflação real no mundo do jogo",
    status: "rumor",
    credibilidade: 45,
    fonte: "Especulação Reddit / Nenhuma fonte sólida",
    descricao: "Rumor baseado em uma patente da Take-Two de 2022 sobre sistemas econômicos dinâmicos. Altamente especulativo.",
    data: "2025-06-01",
  },
  {
    id: "6",
    titulo: "Trevor retorna em DLC",
    status: "falso",
    credibilidade: 5,
    fonte: "4chan / Desmentido por insiders",
    descricao: "Rumor circulou no 4chan e foi rapidamente desmentido por múltiplos insiders confiáveis.",
    data: "2025-08-15",
  },
  {
    id: "7",
    titulo: "Sistema de polícia reformulado com IA avançada",
    status: "provavel",
    credibilidade: 72,
    fonte: "Patente Take-Two / GTAForums insider",
    descricao: "Patente registrada pela Take-Two descreve sistema de perseguição com IA que aprende padrões do jogador.",
    data: "2026-01-20",
  },
  {
    id: "8",
    titulo: "Personagem antagonista Victor Crane",
    status: "confirmado",
    credibilidade: 100,
    fonte: "Trailer 3 Oficial",
    descricao: "Victor Crane foi revelado oficialmente como antagonista principal no Trailer 3 de junho de 2026.",
    data: "2026-06-25",
  },
  {
    id: "9",
    titulo: "Missões de assalto marítimo nas Leonida Keys",
    status: "provavel",
    credibilidade: 68,
    fonte: "GTAVIleaks / Screenshot vazado",
    descricao: "Screenshots de desenvolvimento mostram HUD de missão com localização nas Keys. Fonte verificada por 3 insiders.",
    data: "2026-02-14",
  },
  {
    id: "10",
    titulo: "Modo história com 80+ horas de conteúdo",
    status: "rumor",
    credibilidade: 55,
    fonte: "Insider anônimo",
    descricao: "Um suposto QA tester afirmou que o modo história principal tem mais de 80 horas. Não verificável.",
    data: "2026-05-01",
  },
];

// ─── CONFIG ──────────────────────────────────────────────────────────────────

export const categoriaConfig: Record<Categoria, { label: string; color: string; bg: string }> = {
  oficial:  { label: "OFICIAL",  color: "#64759D", bg: "#64759D22" },
  leak:     { label: "LEAK",     color: "#826092", bg: "#82609222" },
  rumor:    { label: "RUMOR",    color: "#E39986", bg: "#E3998622" },
  trailer:  { label: "TRAILER",  color: "#a78bfa", bg: "#a78bfa22" },
  analise:  { label: "ANÁLISE",  color: "#34d399", bg: "#34d39922" },
  online:   { label: "ONLINE",   color: "#38bdf8", bg: "#38bdf822" },
  breaking: { label: "BREAKING", color: "#f87171", bg: "#f8717122" },
};

export const leakStatusConfig = {
  confirmado: { label: "CONFIRMADO", color: "#34d399" },
  provavel:   { label: "PROVÁVEL",   color: "#E39986" },
  rumor:      { label: "RUMOR",      color: "#826092" },
  falso:      { label: "FALSO",      color: "#f87171" },
};

export const localStatusConfig = {
  confirmado: { label: "CONFIRMADO", color: "#34d399" },
  leaked:     { label: "LEAKED",     color: "#E39986" },
  rumor:      { label: "RUMOR",      color: "#f87171" },
};

export const DATA_LANCAMENTO = new Date("2026-11-19T00:00:00Z");
