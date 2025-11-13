import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

export const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Funciones de ayuda
export function handleSupabaseError(error: any): never {
  console.error('Error de Supabase:', error);
  throw new Error(error?.message || 'Error en la base de datos');
}

export function executeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  return new Promise((resolve, reject) => {
    operation()
      .then(({ data, error }) => {
        if (error) {
          reject(handleSupabaseError(error));
        } else if (!data) {
          reject(new Error('No se encontraron datos'));
        } else {
          resolve(data);
        }
      })
      .catch(reject);
  });
}