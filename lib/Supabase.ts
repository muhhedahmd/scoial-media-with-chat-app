import { createClient } from "@supabase/supabase-js"

const supabaseUrl =     process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 const supabase = createClient(supabaseUrl, supabaseServiceKey)
 export default supabase 
