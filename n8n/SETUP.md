# GTA6.NEWS — Setup dos Workflows n8n

## Arquivos
- `workflow-1-coletor.json` — Coleta RSS + Reddit + Twitter a cada 30min
- `workflow-2-classificador-ia.json` — Classifica com Claude + publica no Supabase a cada 15min
- `workflow-3-whatsapp.json` — Envia no WhatsApp via UazAPI a cada 5min

---

## 1. Variáveis de Ambiente no n8n

No n8n, vá em **Settings → Variables** e crie:

| Variável | Valor | Onde pegar |
|---|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | `eyJ...` (service_role) | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |
| `UAZAPI_URL` | `http://seu-servidor:8080` | Seu servidor UazAPI |
| `UAZAPI_TOKEN` | `token-da-instancia` | Dashboard UazAPI |
| `WHATSAPP_GRUPO_NOME` | `GTA6` | Nome parcial do seu grupo |
| `WHATSAPP_GRUPO_ID` | `120363...@g.us` | ID do grupo (backup) |
| `SERPAPI_KEY` | `abc123...` | serpapi.com (opcional, para Twitter) |
| `SITE_URL` | `https://gta6.news` | Sua URL do site |

---

## 2. Importar no n8n

1. Abra o n8n
2. Menu → **Workflows → Import from file**
3. Importe na ordem: `workflow-1`, `workflow-2`, `workflow-3`
4. Configure as variáveis acima
5. Ative os workflows um a um

---

## 3. Fluxo completo

```
[30min] Workflow 1: Coletor
  ↓ Busca fontes ativas no Supabase
  ↓ Faz GET em cada fonte (RSS/Reddit/Twitter)
  ↓ Filtra por palavras-chave GTA 6
  ↓ Verifica duplicatas por hash
  ↓ Insere em agent_itens_coletados

[15min] Workflow 2: Classificador IA
  ↓ Busca itens não classificados
  ↓ Envia para Claude: "é relevante?"
  ↓ Se relevante: Claude gera artigo completo em PT-BR
  ↓ Insere em noticias (com slug, resumo_ia, conteudo)
  ↓ Cria job na fila para WhatsApp

[5min] Workflow 3: WhatsApp
  ↓ Busca jobs pendentes na fila
  ↓ Formata mensagem com emoji + resumo_ia + link
  ↓ Lista grupos ativos na UazAPI
  ↓ Envia para o grupo GTA6
  ↓ Marca notícia como enviada
```

---

## 4. Adicionar novas fontes

No Supabase, insira na tabela `agent_fontes`:

```sql
insert into agent_fontes (nome, tipo, url, palavras_chave, intervalo_min) values
('GTAForums News', 'rss', 'https://gtaforums.com/discover/2.xml', array['gta 6','gta vi'], 60),
('VGC News', 'rss', 'https://www.videogameschronicle.com/feed/', array['gta 6','rockstar'], 60),
('Eurogamer PT', 'rss', 'https://www.eurogamer.pt/feed', array['gta 6','gta vi'], 120);
```

---

## 5. Monitorar o agente

```sql
-- Ver estatísticas gerais
select * from v_agent_stats;

-- Últimos itens coletados
select titulo_original, fonte_id, coletado_em, relevante
from agent_itens_coletados
order by coletado_em desc limit 20;

-- Últimas notícias publicadas pelo agente
select titulo, categoria, criado_em, views
from noticias
where agente_fonte = 'n8n-auto'
order by criado_em desc limit 10;

-- Erros recentes
select mensagem, dados, criado_em
from agent_logs
where nivel = 'error'
order by criado_em desc limit 10;

-- WhatsApp enviados hoje
select n.titulo, w.enviado_em, w.numero_grupo
from whatsapp_envios w
join noticias n on n.id = w.noticia_id
where w.enviado_em > now() - interval '24 hours'
order by w.enviado_em desc;
```

---

## 6. Ajustar critérios do Claude

O prompt do Workflow 2 (nó "Claude: Classificar relevância") define o que é relevante.
Edite o campo `system` para ajustar:

- **Aumentar rigor**: eleve o threshold de score (ex: > 0.7)
- **Incluir mais tópicos**: adicione ao system prompt
- **Excluir rumores fracos**: adicione regra de rejeição no prompt
- **Mudar tom do artigo**: edite o segundo prompt (nó "Claude: Gerar conteúdo")

---

## 7. Variáveis opcionais para expansão

| Variável | Uso |
|---|---|
| `OPENAI_API_KEY` | Fallback se Claude estiver fora |
| `TELEGRAM_BOT_TOKEN` | Enviar também no Telegram |
| `DISCORD_WEBHOOK` | Enviar no Discord |
| `IMGBB_API_KEY` | Upload de imagens capturadas |
