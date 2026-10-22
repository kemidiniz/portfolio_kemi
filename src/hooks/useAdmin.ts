import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    if (!supabase) return;
    let generation = 0;
    let alive = true;
    async function check(next: Session | null) {
      const current = ++generation;
      setSession(next);
      setIsAdmin(false);
      setChecking(true);
      setAuthError("");
      if (!next) {
        setChecking(false);
        return;
      }
      const { data, error } = await supabase!.rpc("is_portfolio_admin");
      if (!alive || current !== generation) return;
      setIsAdmin(!error && data === true);
      setAuthError(
        error
          ? "Não foi possível verificar sua permissão. Tente entrar novamente."
          : "",
      );
      setChecking(false);
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive && generation === 0) {
        if (error) {
          setAuthError("Não foi possível recuperar sua sessão.");
          setChecking(false);
        } else void check(data.session);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, next) => {
        // Leave the auth callback before making another Supabase request.
        queueMicrotask(() => {
          if (alive) void check(next);
        });
      },
    );
    return () => {
      alive = false;
      generation++;
      listener.subscription.unsubscribe();
    };
  }, []);
  return { session, isAdmin, checking, authError };
}
