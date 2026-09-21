import { createClient } from "@/lib/supabase-server";
export const revalidate = 15;
export default async function Hall() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select("id,title,body,created_at").eq("is_public", true).order("created_at", { ascending: false }).limit(60);
  return (
    <>
      <section className="hero">
        <div className="kicker">The hall</div>
        <h1>Only what people chose to show.</h1>
        <p className="lede">Private notes never appear here. If a writer pulls a page back, it leaves this corridor.</p>
      </section>
      <div className="grid">
        {(notes || []).length === 0 && (<article className="card"><div className="meta">quiet</div><h3>The hall is empty</h3><p>Public notes will gather here as soon as someone marks one.</p></article>)}
        {(notes || []).map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="meta">{new Date(n.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
            <h3>{n.title || "Untitled"}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
