"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("in");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account made. If the project asks for email confirm, check your inbox — otherwise you can sign in now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/desk");
        router.refresh();
      }
    } catch (e) {
      setErr(e.message || "Could not finish that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="hero">
      <div className="kicker">{mode === "in" ? "Return" : "New desk"}</div>
      <h1>{mode === "in" ? "Come back in." : "Claim a chair."}</h1>
      <p className="lede">
        Email and a password. Notes stay on your desk unless you mark them for the hall.
      </p>
      <form className="stack" onSubmit={submit} style={{ marginTop: 28 }}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
        </label>
        {err && <div className="err">{err}</div>}
        {msg && <div className="ok">{msg}</div>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? "Working…" : mode === "in" ? "Sign in" : "Create desk"}
          </button>
          <button type="button" className="btn ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "Need a desk?" : "Already have one?"}
          </button>
        </div>
      </form>
    </section>
  );
}
