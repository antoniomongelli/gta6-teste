-- ============================================================
-- QUERIES QUE O AGENTE N8N USA
-- Cole cada uma no nó Supabase/Postgres do n8n
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. VERIFICAR SE URL JÁ FOI COLETADA (antes de processar)
-- ──────────────────────────────────────────────────────────────
-- Use no início do fluxo para evitar duplicatas
-- Parâmetro: hash SHA256 da URL original
select item_ja_existe('{{ $json.hash }}') as ja_existe;


-- ──────────────────────────────────────────────────────────────
-- 2. INSERIR ITEM COLETADO (bruto, antes de classificar)
-- ──────────────────────────────────────────────────────────────
insert into agent_itens_coletados (
  fonte_id,
  titulo_original,
  conteudo_original,
  url_original,
  hash
)
select
  f.id,
  '{{ $json.titulo }}',
  '{{ $json.conteudo }}',
  '{{ $json.url }}',
  '{{ $json.hash }}'
from agent_fontes f
where f.nome = '{{ $json.fonte_nome }}'
on conflict (hash) do nothing
returning id;


-- ──────────────────────────────────────────────────────────────
-- 3. BUSCAR ITENS NÃO CLASSIFICADOS (para o Claude avaliar)
-- ──────────────────────────────────────────────────────────────
select
  i.id,
  i.titulo_original,
  i.conteudo_original,
  i.url_original,
  f.nome as fonte_nome
from agent_itens_coletados i
join agent_fontes f on f.id = i.fonte_id
where i.relevante is null
  and i.publicado = false
order by i.coletado_em asc
limit 10;


-- ──────────────────────────────────────────────────────────────
-- 4. MARCAR ITEM COMO NÃO RELEVANTE
-- ──────────────────────────────────────────────────────────────
update agent_itens_coletados
set
  relevante = false,
  motivo_rejeicao = '{{ $json.motivo }}'
where id = '{{ $json.item_id }}';


-- ──────────────────────────────────────────────────────────────
-- 5. PUBLICAR NOTÍCIA (item relevante → tabela noticias)
-- ──────────────────────────────────────────────────────────────
-- Execute após o Claude gerar resumo_ia e slug
with noticia_inserida as (
  insert into noticias (
    slug,
    titulo,
    resumo,
    resumo_ia,
    conteudo,
    categoria,
    fonte,
    fonte_url,
    imagem_url,
    agente_fonte,
    agente_url,
    agente_hash
  ) values (
    '{{ $json.slug }}',
    '{{ $json.titulo }}',
    '{{ $json.resumo }}',
    '{{ $json.resumo_ia }}',
    '{{ $json.conteudo }}',
    '{{ $json.categoria }}'::categoria_noticia,
    '{{ $json.fonte }}',
    '{{ $json.fonte_url }}',
    '{{ $json.imagem_url }}',
    '{{ $json.agente_fonte }}',
    '{{ $json.agente_url }}',
    '{{ $json.agente_hash }}'
  )
  on conflict (slug) do nothing
  returning id, slug
)
-- Atualiza o item coletado como publicado
update agent_itens_coletados
set
  relevante = true,
  publicado = true,
  noticia_id = (select id from noticia_inserida)
where id = '{{ $json.item_id }}'
returning (select id from noticia_inserida) as noticia_id;


-- ──────────────────────────────────────────────────────────────
-- 6. BUSCAR NOTÍCIAS PARA ENVIAR NO WHATSAPP
-- ──────────────────────────────────────────────────────────────
select
  n.id,
  n.slug,
  n.titulo,
  n.resumo_ia,
  n.categoria,
  n.criado_em
from noticias n
where n.publicado = true
  and n.whatsapp_enviado = false
order by n.criado_em desc
limit 5;


-- ──────────────────────────────────────────────────────────────
-- 7. REGISTRAR ENVIO WHATSAPP E MARCAR NOTÍCIA
-- ──────────────────────────────────────────────────────────────
insert into whatsapp_envios (
  noticia_id,
  canal,
  numero_grupo,
  mensagem,
  status,
  enviado_em
) values (
  '{{ $json.noticia_id }}'::uuid,
  'grupo_principal',
  '{{ $json.numero_grupo }}',
  '{{ $json.mensagem }}',
  'enviado',
  now()
);

-- Em seguida, marcar a notícia:
select marcar_whatsapp_enviado('{{ $json.noticia_id }}'::uuid);


-- ──────────────────────────────────────────────────────────────
-- 8. ATUALIZAR ÚLTIMA COLETA DA FONTE
-- ──────────────────────────────────────────────────────────────
update agent_fontes
set
  ultima_coleta = now(),
  ultimo_item_id = '{{ $json.ultimo_item_id }}'
where nome = '{{ $json.fonte_nome }}';


-- ──────────────────────────────────────────────────────────────
-- 9. REGISTRAR LOG DO AGENTE
-- ──────────────────────────────────────────────────────────────
select agent_log(
  '{{ $json.nivel }}',        -- 'info', 'warn', 'error'
  '{{ $json.mensagem }}',
  '{{ $json.dados }}'::jsonb  -- dados extras em JSON
);


-- ──────────────────────────────────────────────────────────────
-- 10. BUSCAR FONTES ATIVAS (para o n8n saber onde coletar)
-- ──────────────────────────────────────────────────────────────
select
  id,
  nome,
  tipo,
  url,
  palavras_chave,
  intervalo_min,
  ultima_coleta,
  ultimo_item_id
from agent_fontes
where ativo = true
  and (
    ultima_coleta is null
    or ultima_coleta < now() - (intervalo_min || ' minutes')::interval
  )
order by ultima_coleta asc nulls first;


-- ──────────────────────────────────────────────────────────────
-- 11. VERIFICAR CONFIGURAÇÕES DO AGENTE
-- ──────────────────────────────────────────────────────────────
select chave, valor
from configuracoes
where chave in (
  'agente_ativo',
  'agente_intervalo_min',
  'whatsapp_ativo',
  'data_lancamento'
);


-- ──────────────────────────────────────────────────────────────
-- 12. DASHBOARD DO AGENTE (use para monitorar via Supabase)
-- ──────────────────────────────────────────────────────────────
select * from v_agent_stats;


-- ──────────────────────────────────────────────────────────────
-- 13. ÚLTIMOS ERROS DO AGENTE
-- ──────────────────────────────────────────────────────────────
select
  mensagem,
  dados,
  criado_em
from agent_logs
where nivel = 'error'
order by criado_em desc
limit 20;


-- ──────────────────────────────────────────────────────────────
-- 14. GERAR SLUG A PARTIR DO TÍTULO (helper)
-- ──────────────────────────────────────────────────────────────
-- Use no n8n com uma expressão JavaScript no nó Code:
-- const slug = titulo
--   .toLowerCase()
--   .normalize('NFD').replace(/[̀-ͯ]/g, '')
--   .replace(/[^a-z0-9\s-]/g, '')
--   .trim()
--   .replace(/\s+/g, '-')
--   .slice(0, 80);


-- ──────────────────────────────────────────────────────────────
-- 15. TEMPLATE DA MENSAGEM WHATSAPP
-- ──────────────────────────────────────────────────────────────
-- Monte no nó Code do n8n:
-- const emoji = {
--   oficial: '✅', leak: '🕵️', rumor: '❓',
--   trailer: '🎬', analise: '🔍', online: '🎮', breaking: '🔴'
-- };
-- const msg = `${emoji[categoria] || '📰'} *${titulo}*\n\n`
--           + `🤖 ${resumo_ia}\n\n`
--           + `🔗 https://gta6.news/noticias/${slug}`;
