import { createClient } from "@/lib/supabase-server";
export const revalidate = 20;
export default async function Log() {
  const supabase = createClient();
  const { data: rows } = await supabase.from("feature_log").select("*").order("shipped_at", { ascending: false }).limit(40);
  return (
    <>
      <section className="hero">
        <div className="kicker">Hourly work</div>
        <h1>What changed in the room.</h1>
        <p className="lede">This house is meant to grow by the hour — a new shelf, a better hinge, a quieter lamp.</p>
      </section>
      <div className="grid">
        {(rows || []).map((r, i) => (
          <article className="card" key={r.id} style={{ animationDelay: `${i * 45}ms` }}>
            <div className="meta">{r.shipped_at ? new Date(r.shipped_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "logged"}</div>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
