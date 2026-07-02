import "server-only";

import { createClient } from "@supabase/supabase-js";

// Cliente com a service_role key: acesso privilegiado (bypassa RLS), usado
// só em server actions para operações administrativas (storage, criar admins).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
