"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function Desk() {
  const supabase = createClient();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { data, error } = await supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) setErr(error.message);
    setNotes(data || []);
    setReady(true);
  }

  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    setErr("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: title.trim() || "Untitled",
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) { setErr(error.message); return; }
    setTitle(""); setBody(""); setIsPublic(false); load();
  }

  async function toggle(note) {
    await supabase.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load();
  }

  async function remove(id) {
    await supabase.from("notes").delete().eq("id", id);
    load();
  }

  if (!ready) return (<section className="hero"><div className="kicker">Desk</div><h1>Finding your papers…</h1></section>);

  return (
    <>
      <section className="hero">
        <div className="kicker">Your drawer</div>
        <h1>Write something that can stay hidden.</h1>
        <p className="lede">Tick “put in the hall” only if you want strangers to read it. Untick and it leaves the hall immediately.</p>
        <form className="stack" onSubmit={save} style={{ marginTop: 24 }}>
          <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A heading, if you want one" /></label>
          <label>Note<textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened, or what you keep meaning to say." /></label>
          <label className="check"><input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />Put this in the hall</label>
          {err && <div className="err">{err}</div>}
          <button className="btn" type="submit">Keep this</button>
        </form>
      </section>
      <p className="kicker">On this desk</p>
      <div className="grid">
        {notes.length === 0 && (<article className="card"><div className="meta">blank page</div><h3>Nothing filed yet</h3><p>The first note you keep will live here, private by default.</p></article>)}
        {notes.map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="meta">{n.is_public ? "in the hall" : "private drawer"}</div>
            <h3>{n.title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn ghost" type="button" onClick={() => toggle(n)}>{n.is_public ? "Pull back" : "Make public"}</button>
              <button className="btn ghost" type="button" onClick={() => remove(n.id)}>Burn</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
