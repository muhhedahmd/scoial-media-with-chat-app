import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://vplqmxwydashqrywxxnp.supabase.co'
 const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY!)
 export default supabase 
