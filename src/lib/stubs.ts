/**
 * Supabase client stub — swap for real createClient when credentials exist.
 * No network calls; returns mock-friendly placeholders.
 */

export type SupabaseStub = {
  auth: {
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    signInWithOtp: (_args: {
      email?: string;
      phone?: string;
    }) => Promise<{ data: null; error: { message: string } }>;
  };
  from: (_table: string) => {
    select: () => { data: never[]; error: null };
  };
};

export function createSupabaseClient(): SupabaseStub {
  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async signInWithOtp() {
        return {
          data: null,
          error: {
            message:
              "Auth stubbed — configure NEXT_PUBLIC_SUPABASE_URL / ANON_KEY later.",
          },
        };
      },
    },
    from() {
      return {
        select: () => ({ data: [], error: null }),
      };
    },
  };
}

export const stripeStub = {
  connect: {
    async createAccountLink() {
      return {
        url: "#",
        message: "Stripe Connect stub — no live keys required locally.",
      };
    },
  },
};
