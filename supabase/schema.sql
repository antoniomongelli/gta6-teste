-- ============================================================
-- GTA6.NEWS — Schema completo para Supabase
-- Inclui: site, agente IA e integração WhatsApp
-- ============================================================

-- ── EXTENSÕES ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- busca por similaridade de texto


-- ── ENUMS ───────────────────────────────────────────────────
create type categoria_noticia as enum (
  'oficial', 'leak', 'rumor', 'trailer', 'analise', 'online', 'breaking'
);

create type status_personagem as enum ('confirmado', 'leaked', 'rumor');
create type tipo_personagem   as enum ('protagonista', 'antagonista', 'misterio', 'coadjuvante');
create type status_local      as enum ('confirmado', 'leaked', 'rumor');
create type tipo_local        as enum ('cidade', 'cidade_pequena', 'area_natural', 'ilha');
create type status_leak       as enum ('confirmado', 'provavel', 'rumor', 'falso');
create type status_job        as enum ('pendente', 'processando', 'concluido', 'erro');
create type canal_whatsapp    as enum ('grupo_principal', 'grupo_vip', 'broadcast');


-- ============================================================
-- TABELAS PRINCIPAIS DO SITE
-- ============================================================

-- ── NOTÍCIAS ────────────────────────────────────────────────
create table noticias (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  titulo        text not null,
  resumo        text not null,
  resumo_ia     text,                     -- gerado pelo Claude/GPT
  conteudo      text not null,
  categoria     categoria_noticia not null default 'rumor',
  fonte         text,                     -- nome legível da fonte
  fonte_url     text,                     -- URL da fonte original
  imagem_url    text,
  destaque      boolean not null default false,
  publicado     boolean not null default true,
  views         bigint not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  -- metadados do agente
  agente_fonte  text,                     -- 'reddit', 'twitter', 'rss', 'manual'
  agente_url    text,                     -- URL original de onde o agente coletou
  agente_hash   text unique,              -- hash do conteúdo para evitar duplicatas
  whatsapp_enviado boolean not null default false,
  whatsapp_enviado_em timestamptz
);

-- índices para performance
create index idx_noticias_categoria   on noticias(categoria);
create index idx_noticias_criado_em   on noticias(criado_em desc);
create index idx_noticias_destaque    on noticias(destaque) where destaque = true;
create index idx_noticias_publicado   on noticias(publicado) where publicado = true;
create index idx_noticias_whatsapp    on noticias(whatsapp_enviado) where whatsapp_enviado = false;
create index idx_noticias_titulo_trgm on noticias using gin(titulo gin_trgm_ops);

-- atualiza timestamp automaticamente
create or replace function atualizar_timestamp()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_noticias_timestamp
  before update on noticias
  for each row execute function atualizar_timestamp();


-- ── PERSONAGENS ─────────────────────────────────────────────
create table personagens (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  nome        text not null,
  tipo        tipo_personagem not null,
  status      status_personagem not null default 'rumor',
  descricao   text not null,
  historia    text,
  imagem_url  text,
  trailer_ref text,               -- em qual trailer apareceu
  stats_combate    smallint check (stats_combate between 0 and 100),
  stats_direcao    smallint check (stats_direcao between 0 and 100),
  stats_furtividade smallint check (stats_furtividade between 0 and 100),
  stats_carisma    smallint check (stats_carisma between 0 and 100),
  stats_hacking    smallint check (stats_hacking between 0 and 100),
  ordem       smallint not null default 99,
  publicado   boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create trigger trg_personagens_timestamp
  before update on personagens
  for each row execute function atualizar_timestamp();


-- ── LOCAIS DO MAPA ──────────────────────────────────────────
create table locais_mapa (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  nome        text not null,
  status      status_local not null default 'rumor',
  tipo        tipo_local not null,
  descricao   text not null,
  pos_x       numeric(5,2) not null check (pos_x between 0 and 100), -- % no SVG
  pos_y       numeric(5,2) not null check (pos_y between 0 and 100),
  publicado   boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create trigger trg_locais_timestamp
  before update on locais_mapa
  for each row execute function atualizar_timestamp();


-- ── LEAK TRACKER ────────────────────────────────────────────
create table leaks (
  id            uuid primary key default uuid_generate_v4(),
  titulo        text not null,
  descricao     text not null,
  status        status_leak not null default 'rumor',
  credibilidade smallint not null default 50 check (credibilidade between 0 and 100),
  fonte         text not null,
  data_leak     date,
  -- histórico de mudanças de status (para mostrar evolução)
  historico     jsonb not null default '[]',
  publicado     boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create trigger trg_leaks_timestamp
  before update on leaks
  for each row execute function atualizar_timestamp();


-- ── CONFIGURAÇÕES DO SITE ───────────────────────────────────
create table configuracoes (
  chave       text primary key,
  valor       text,
  valor_json  jsonb,
  descricao   text,
  atualizado_em timestamptz not null default now()
);

-- valores padrão
insert into configuracoes (chave, valor, descricao) values
  ('data_lancamento',       '2026-11-19',         'Data oficial de lançamento do GTA VI'),
  ('data_acesso_antecipado','2026-11-16',         'Início do acesso antecipado'),
  ('site_nome',             'GTA6.NEWS',          'Nome do site'),
  ('site_descricao',        'Central de notícias do GTA VI em PT-BR', 'Descrição do site'),
  ('noticia_destaque_id',   '',                   'ID da notícia em destaque na home'),
  ('agente_ativo',          'true',               'Se o agente IA está coletando notícias'),
  ('agente_intervalo_min',  '60',                 'Intervalo em minutos entre execuções do agente'),
  ('whatsapp_ativo',        'true',               'Se o envio para WhatsApp está ativo'),
  ('whatsapp_min_views',    '0',                  'Views mínimas para enviar ao WhatsApp (0 = todas)');


-- ============================================================
-- TABELAS DO AGENTE IA (N8N)
-- ============================================================

-- ── FILA DE JOBS DO AGENTE ──────────────────────────────────
-- O n8n lê desta tabela para saber o que processar
create table agent_jobs (
  id            uuid primary key default uuid_generate_v4(),
  tipo          text not null,             -- 'buscar_noticias', 'resumir', 'publicar', 'whatsapp'
  payload       jsonb not null default '{}',
  status        status_job not null default 'pendente',
  tentativas    smallint not null default 0,
  max_tentativas smallint not null default 3,
  erro          text,
  resultado     jsonb,
  agendado_para timestamptz not null default now(),
  iniciado_em   timestamptz,
  concluido_em  timestamptz,
  criado_em     timestamptz not null default now()
);

create index idx_agent_jobs_status     on agent_jobs(status, agendado_para) where status = 'pendente';
create index idx_agent_jobs_tipo       on agent_jobs(tipo);


-- ── LOG DE EXECUÇÕES DO AGENTE ──────────────────────────────
create table agent_logs (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid references agent_jobs(id) on delete set null,
  nivel       text not null default 'info',  -- 'info', 'warn', 'error', 'debug'
  mensagem    text not null,
  dados       jsonb,
  criado_em   timestamptz not null default now()
);

create index idx_agent_logs_criado_em on agent_logs(criado_em desc);
create index idx_agent_logs_nivel     on agent_logs(nivel) where nivel = 'error';


-- ── FONTES DE COLETA ────────────────────────────────────────
-- O agente usa esta tabela para saber onde buscar
create table agent_fontes (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  tipo        text not null,    -- 'rss', 'reddit', 'twitter', 'site'
  url         text not null,
  ativo       boolean not null default true,
  -- controle de coleta
  ultima_coleta    timestamptz,
  ultimo_item_id   text,        -- ID ou URL do último item coletado (evita reprocessar)
  intervalo_min    smallint not null default 60,
  -- filtros
  palavras_chave   text[],      -- ['gta 6', 'gta vi', 'rockstar']
  criado_em   timestamptz not null default now()
);

-- fontes padrão
insert into agent_fontes (nome, tipo, url, palavras_chave, intervalo_min) values
  ('Reddit r/GTA6',       'reddit', 'https://www.reddit.com/r/GTA6/new.json',      array['gta 6','gta vi','rockstar','vice city'], 30),
  ('Reddit r/GrandTheftAutoVI', 'reddit', 'https://www.reddit.com/r/GrandTheftAutoVI/new.json', array['gta 6','gta vi'], 30),
  ('Rockstar Newswire RSS','rss',    'https://www.rockstargames.com/newswire/rss',  array['gta','grand theft auto'], 60),
  ('IGN GTA',             'rss',    'https://feeds.ign.com/ign/games',             array['gta 6','grand theft auto vi'], 60),
  ('Kotaku',              'rss',    'https://kotaku.com/rss',                      array['gta 6','gta vi','rockstar'], 60),
  ('Eurogamer',           'rss',    'https://www.eurogamer.net/?format=rss',       array['gta 6','gta vi'], 120),
  ('GTAForums',           'site',   'https://gtaforums.com/forum/392-gta-vi/',     array['gta vi','vice city'], 120);


-- ── ITENS COLETADOS (antes de virar notícia) ────────────────
-- Buffer de itens brutos coletados pelo agente
create table agent_itens_coletados (
  id            uuid primary key default uuid_generate_v4(),
  fonte_id      uuid references agent_fontes(id) on delete cascade,
  titulo_original text not null,
  conteudo_original text,
  url_original  text not null,
  hash          text unique not null,       -- SHA256 da URL para deduplicação
  -- classificação pelo agente
  relevante     boolean,                    -- null = não avaliado ainda
  score_relevancia numeric(3,2),            -- 0.00 a 1.00
  categoria_sugerida categoria_noticia,
  -- resultado
  noticia_id    uuid references noticias(id) on delete set null,
  publicado     boolean not null default false,
  motivo_rejeicao text,
  coletado_em   timestamptz not null default now()
);

create index idx_itens_relevante  on agent_itens_coletados(relevante) where relevante is null;
create index idx_itens_publicado  on agent_itens_coletados(publicado) where publicado = false;
create index idx_itens_hash       on agent_itens_coletados(hash);


-- ── ENVIOS WHATSAPP ─────────────────────────────────────────
create table whatsapp_envios (
  id            uuid primary key default uuid_generate_v4(),
  noticia_id    uuid references noticias(id) on delete cascade,
  canal         canal_whatsapp not null default 'grupo_principal',
  numero_grupo  text,                        -- ID do grupo na UazAPI
  mensagem      text not null,
  status        text not null default 'pendente',  -- 'pendente','enviado','erro'
  erro          text,
  tentativas    smallint not null default 0,
  enviado_em    timestamptz,
  criado_em     timestamptz not null default now()
);

create index idx_whatsapp_status    on whatsapp_envios(status) where status = 'pendente';
create index idx_whatsapp_noticia   on whatsapp_envios(noticia_id);


-- ── SUBSCRIBERS WHATSAPP ────────────────────────────────────
-- Para quem clicou em "Receber no WhatsApp"
create table whatsapp_subscribers (
  id            uuid primary key default uuid_generate_v4(),
  numero        text unique not null,        -- número no formato internacional
  nome          text,
  categorias    categoria_noticia[],          -- null = todas
  ativo         boolean not null default true,
  origem        text,                         -- 'site', 'grupo', 'manual'
  criado_em     timestamptz not null default now(),
  ultimo_envio  timestamptz
);


-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- Notícias prontas para o site (publicadas, ordenadas)
create view v_noticias_publicas as
select
  n.*,
  to_char(n.criado_em at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as criado_em_br
from noticias n
where n.publicado = true
order by n.criado_em desc;

-- Itens aguardando revisão do agente
create view v_itens_pendentes as
select
  i.*,
  f.nome as fonte_nome,
  f.tipo as fonte_tipo
from agent_itens_coletados i
join agent_fontes f on f.id = i.fonte_id
where i.relevante is null
  and i.publicado = false
order by i.coletado_em desc;

-- Jobs pendentes para o n8n executar
create view v_jobs_pendentes as
select *
from agent_jobs
where status = 'pendente'
  and agendado_para <= now()
  and tentativas < max_tentativas
order by agendado_para asc;

-- Notícias não enviadas para WhatsApp (para o agente enviar)
create view v_noticias_para_whatsapp as
select *
from noticias
where publicado = true
  and whatsapp_enviado = false
order by criado_em desc;

-- Estatísticas do agente
create view v_agent_stats as
select
  (select count(*) from agent_itens_coletados)                             as total_coletados,
  (select count(*) from agent_itens_coletados where relevante is null)     as aguardando_classificacao,
  (select count(*) from agent_itens_coletados where relevante = true)      as relevantes,
  (select count(*) from agent_itens_coletados where publicado = true)      as publicados,
  (select count(*) from agent_jobs where status = 'pendente')              as jobs_pendentes,
  (select count(*) from agent_jobs where status = 'erro')                  as jobs_erro,
  (select count(*) from noticias where whatsapp_enviado = false and publicado = true) as noticias_whatsapp_pendentes,
  (select max(criado_em) from agent_logs where nivel = 'error')            as ultimo_erro,
  (select max(iniciado_em) from agent_jobs where status = 'concluido')     as ultima_execucao;


-- ============================================================
-- FUNÇÕES AUXILIARES (usadas pelo n8n / agente)
-- ============================================================

-- Cria um job na fila
create or replace function criar_job(
  p_tipo    text,
  p_payload jsonb default '{}',
  p_delay_min int default 0
) returns uuid as $$
declare v_id uuid;
begin
  insert into agent_jobs (tipo, payload, agendado_para)
  values (p_tipo, p_payload, now() + (p_delay_min || ' minutes')::interval)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- Registra log do agente
create or replace function agent_log(
  p_nivel    text,
  p_mensagem text,
  p_dados    jsonb default null,
  p_job_id   uuid default null
) returns void as $$
begin
  insert into agent_logs (nivel, mensagem, dados, job_id)
  values (p_nivel, p_mensagem, p_dados, p_job_id);
end;
$$ language plpgsql;

-- Verifica se um item já foi coletado (por hash)
create or replace function item_ja_existe(p_hash text) returns boolean as $$
begin
  return exists (select 1 from agent_itens_coletados where hash = p_hash);
end;
$$ language plpgsql;

-- Marca notícia como enviada no WhatsApp
create or replace function marcar_whatsapp_enviado(p_noticia_id uuid) returns void as $$
begin
  update noticias
  set whatsapp_enviado = true,
      whatsapp_enviado_em = now()
  where id = p_noticia_id;
end;
$$ language plpgsql;

-- Incrementa views de uma notícia
create or replace function incrementar_views(p_slug text) returns void as $$
begin
  update noticias set views = views + 1 where slug = p_slug;
end;
$$ language plpgsql;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table noticias              enable row level security;
alter table personagens           enable row level security;
alter table locais_mapa           enable row level security;
alter table leaks                 enable row level security;
alter table agent_jobs            enable row level security;
alter table agent_logs            enable row level security;
alter table agent_fontes          enable row level security;
alter table agent_itens_coletados enable row level security;
alter table whatsapp_envios       enable row level security;
alter table whatsapp_subscribers  enable row level security;
alter table configuracoes         enable row level security;

-- Leitura pública para dados do site
create policy "publico pode ler noticias publicadas"
  on noticias for select using (publicado = true);

create policy "publico pode ler personagens publicados"
  on personagens for select using (publicado = true);

create policy "publico pode ler locais publicados"
  on locais_mapa for select using (publicado = true);

create policy "publico pode ler leaks publicados"
  on leaks for select using (publicado = true);

create policy "publico pode ler configuracoes"
  on configuracoes for select using (true);

-- Incremento de views (acesso anônimo via função)
create policy "publico pode incrementar views"
  on noticias for update
  using (true)
  with check (true);

-- Service role (n8n usa a service key) tem acesso total
-- Isso é garantido pelo Supabase automaticamente para a service_role


-- ============================================================
-- DADOS INICIAIS
-- ============================================================

-- Personagens
insert into personagens (slug, nome, tipo, status, descricao, historia, imagem_url, trailer_ref, stats_combate, stats_direcao, stats_furtividade, stats_carisma, stats_hacking, ordem) values
(
  'lucia-caminos', 'Lucia Caminos', 'protagonista', 'confirmado',
  'Cubana-americana com laços profundos no cartel. A mente estratégica do duo central de GTA VI.',
  'Lucia Caminos cresceu em Little Havana, em Vice City, filha de imigrantes cubanos envolvidos com o crime organizado desde os anos 80. Após uma traição que a levou à prisão, emergiu mais dura e determinada. Seu relacionamento com Jason começou dentro do sistema criminal.',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  'Trailer 1 (Dez/2023) e Trailer 3 (Jun/2026)',
  88, 75, 92, 95, 70, 1
),
(
  'jason-duval', 'Jason Duval', 'protagonista', 'confirmado',
  'Nativo de Leonida, parceiro e namorado de Lucia. O músculo e instinto por trás da estratégia dela.',
  'Jason Duval nasceu e cresceu nas regiões rurais de Leonida. Entrou para o crime aos 17 anos como mula de tráfico. Sua reputação de nunca deixar um parceiro para trás o tornou confiável nos círculos criminosos.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'Trailer 1 (Dez/2023) e Trailer 3 (Jun/2026)',
  95, 90, 60, 72, 45, 2
),
(
  'victor-crane', 'Victor Crane', 'antagonista', 'confirmado',
  'Bilionário e desenvolvedor imobiliário de Vice City. Antagonista principal confirmado no Trailer 3.',
  'Victor Crane construiu um império imobiliário em Vice City ao longo de três décadas usando corrupção sistêmica. Controla políticos e policiais. Sua obsessão em "limpar" Vice City o coloca em rota de colisão com Lucia e Jason.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'Confirmado no Trailer 3 (Jun/2026)',
  45, 55, 75, 95, 80, 3
),
(
  'figura-misteriosa', 'Figura Misteriosa', 'misterio', 'rumor',
  'Silhueta vista brevemente no Trailer 2. Aparenta controlar poder político e criminal em Leonida.',
  'Uma figura encapuzada em apenas três frames do Trailer 2. Dataminers identificaram um distintivo que parece ser das forças especiais de Leonida — pode ser alguém dentro do sistema de segurança.',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
  'Visto brevemente no Trailer 2',
  70, 55, 85, 88, 80, 4
),
(
  'cal-henderson', 'Cal Henderson', 'coadjuvante', 'leaked',
  'Xerife corrupto do condado rural de Leonida. Suposto aliado de Crane que extorque moradores locais.',
  'Xerife eleito do Condado de Armadillo. Mantém um esquema de extorsão há mais de 20 anos. Qualquer operação nas estradas rurais de Leonida paga uma taxa ao Xerife.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  'Mencionado em leak, não confirmado',
  65, 70, 50, 80, 20, 5
);

-- Locais do mapa
insert into locais_mapa (slug, nome, status, tipo, descricao, pos_x, pos_y) values
('vice-city',        'Vice City',           'confirmado', 'cidade',         'A cidade principal do jogo. Baseada em Miami, com praias, art deco, Downtown e Little Havana.',                       52, 58),
('leonida-keys',     'Leonida Keys',        'leaked',     'ilha',           'Arquipélago ao sul baseado nos Florida Keys. Resort de luxo e operações de tráfico marítimo.',                        63, 78),
('port-gellhorn',    'Port Gellhorn',       'leaked',     'cidade_pequena', 'Cidade portuária industrial. Doca comercial, refinaria e território de facções rivais.',                            28, 68),
('leonida-wetlands', 'Leonida Wetlands',    'confirmado', 'area_natural',   'Vasta área pantanosa ao norte. Fauna selvagem, missões de caça e esconderijos rurais.',                            38, 30),
('armadillo-county', 'Condado de Armadillo','leaked',     'cidade_pequena', 'Região rural a noroeste. Fazendas, rodovias desertas e território do Xerife Henderson.',                          18, 35),
('cidade-norte',     'Cidade Desconhecida', 'rumor',      'cidade_pequena', 'Cidade não identificada vista em imagens vazadas. Parece ser ao norte de Vice City.',                              55, 20),
('stilt-district',   'Stilt Houses District','rumor',     'cidade_pequena', 'Bairro de casas suspensas sobre a água. Visto em screenshot vazado.',                                               72, 45);

-- Leaks
insert into leaks (titulo, descricao, status, credibilidade, fonte, data_leak) values
('Mapa é 3x maior que GTA V',                   'Confirmado pela própria Rockstar em comunicado oficial junto com o Trailer 3.',                   'confirmado', 100, 'Rockstar Games Oficial',            '2026-06-25'),
('Dois protagonistas: Lucia e Jason',            'Confirmado desde o Trailer 1 em dezembro de 2023.',                                             'confirmado', 100, 'Trailer 1 Oficial',                 '2023-12-05'),
('Vilão: Victor Crane',                          'Victor Crane revelado oficialmente como antagonista principal no Trailer 3.',                    'confirmado', 100, 'Trailer 3 Oficial',                 '2026-06-25'),
('GTA Online com 100 jogadores por lobby',       'Múltiplos insiders confirmaram independentemente. Sem confirmação oficial ainda.',               'provavel',    78, 'GTAVIleaks (insider verificado)',   '2026-03-10'),
('Versão PC atrasada para 2027',                 'CEO da Take-Two indicou que PC virá quando estiver pronto. Consenso aponta 2027.',               'provavel',    85, 'Declarações de executivos',         '2026-04-14'),
('Sistema de polícia reformulado com IA',        'Patente da Take-Two descreve sistema de perseguição com IA que aprende padrões do jogador.',    'provavel',    72, 'Patente Take-Two / GTAForums',     '2026-01-20'),
('Missões de assalto nas Leonida Keys',          'Screenshots de desenvolvimento mostram HUD de missão com localização nas Keys.',                 'provavel',    68, 'GTAVIleaks / Screenshot vazado',    '2026-02-14'),
('Modo história com 80+ horas de conteúdo',     'Suposto QA tester afirmou mais de 80 horas. Não verificável.',                                   'rumor',       55, 'Insider anônimo',                   '2026-05-01'),
('Economia com inflação real no jogo',           'Baseado em patente da Take-Two de 2022. Altamente especulativo.',                               'rumor',       45, 'Especulação Reddit',                '2025-06-01'),
('Trevor retorna em DLC',                        'Rumor do 4chan rapidamente desmentido por múltiplos insiders confiáveis.',                       'falso',        5, '4chan / Desmentido por insiders',   '2025-08-15');

-- Notícias iniciais
insert into noticias (slug, titulo, resumo, resumo_ia, conteudo, categoria, fonte, fonte_url, imagem_url, destaque, views, agente_fonte) values
(
  'trailer-3-analise-vilao-revelado',
  'Trailer 3 do GTA VI: Vilão revelado, GTA Online mostrado e tudo analisado',
  'Rockstar lançou o Trailer 3 junto com a abertura de pré-vendas. Três minutos de footage revelaram o antagonista e confirmaram o GTA Online.',
  'Trailer 3 confirma Victor Crane como vilão, mostra GTA Online ao vivo, data 19 Nov 2026. 21M visualizações em 24h.',
  E'A Rockstar Games lançou o Trailer 3 de GTA VI em 25 de junho de 2026, simultaneamente com a abertura das pré-vendas.\n\nVictor Crane, bilionário e desenvolvedor imobiliário de Vice City, é revelado como o antagonista principal. Ele aparece destruindo bairros inteiros para "limpar" Vice City.\n\nPela primeira vez, foram mostradas cenas do GTA Online com lobbies massivos. A Rockstar confirmou que o modo online chega junto com o lançamento em 19 de novembro.',
  'trailer', 'Rockstar Games', 'https://rockstargames.com', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', true, 21300000, 'manual'
),
(
  'data-lancamento-19-novembro-2026',
  'Data oficial: GTA VI lança em 19 de Novembro de 2026 — rumores de atraso desmentidos',
  'Rockstar e Take-Two confirmam que 19 de novembro de 2026 é a data final para PS5 e Xbox Series.',
  'Data confirmada: 19/11/2026 PS5 e Xbox Series. Acesso antecipado 16/11. PC adiado para 2027.',
  E'A Rockstar Games e a Take-Two Interactive encerraram as especulações sobre atraso.\n\nDatas confirmadas:\n- Acesso antecipado: 16 de novembro de 2026\n- Lançamento global: 19 de novembro de 2026\n\nO CEO da Take-Two declarou: "Muita gente vai ligar doente no trabalho no dia 19 de novembro. E nós entendemos completamente."',
  'oficial', 'Take-Two Interactive', 'https://take2games.com', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', false, 2900000, 'manual'
),
(
  'mapa-leonida-3x-gta5-confirmado',
  'Mapa de Leonida é 3x maior que GTA V, confirma Rockstar — todas as localizações',
  'Análise completa do mapa: Vice City, Everglades, Leonida Keys, Port Gellhorn e muito mais.',
  'Mapa oficial: 3x GTA V. Inclui Vice City, Everglades, Keys e Port Gellhorn.',
  E'A Rockstar confirmou que o mapa de Leonida em GTA VI é aproximadamente três vezes maior que Los Santos em GTA V.\n\nRegiões confirmadas:\n- Vice City: cidade principal, baseada em Miami\n- Everglades: área pantanosa ao norte com fauna selvagem\n- Leonida Keys: arquipélago ao sul\n- Port Gellhorn: cidade portuária industrial',
  'oficial', 'Rockstar Games', 'https://rockstargames.com', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', false, 3100000, 'manual'
);
