import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgwdsuhsgmmgabmczbcg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jdvxZmAP2jDcVSNKd8tfuA_-OnqjYZf';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);