import { supabase } from './supabase'
import { categoriaConfig } from './mock-data'

export async function getNoticias(categoria?: string, limit = 20) {
  let query = supabase
    .from('noticias')
    .select('*')
    .eq('publicado', true)
    .order('criado_em', { ascending: false })
    .limit(limit)

  if (categoria && categoria !== 'todos') {
    query = query.eq('categoria', categoria)
  }

  const { data } = await query
  return data || []
}

export async function getNoticiaDestaque() {
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicado', true)
    .eq('destaque', true)
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  if (data) return data

  // fallback: notícia mais recente
  const { data: recente } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicado', true)
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  return recente
}

export async function getNoticiaPorSlug(slug: string) {
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  return data
}

export async function getNoticiasRelacionadas(id: string, limit = 3) {
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicado', true)
    .neq('id', id)
    .order('criado_em', { ascending: false })
    .limit(limit)

  return data || []
}

export async function incrementarViews(slug: string) {
  await supabase.rpc('incrementar_views', { p_slug: slug })
}
