import { createClient } from '@supabase/supabase-js'

const url = '*insert url here*'
const key = '*insertkey here*'

export const supabase = createClient(url, key)