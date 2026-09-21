import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 30;

export default async function Home() {
  const supabase = createClient();
  const { data: publicNotes } = await supabase
    .from("notes")
    .select("id,title,body,created_at,user_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: log } = await supabase
    .from("feature_log")
    .select("id,title,body,shipped_at")
    .order("shipped_at", { ascending: false })
    .limit(3);

  return (
    <>
      <section className="hero">
        <div className="kicker">Open desk · closed drawer</div>
        <h1>Write it down.<br />Decide later who sees it.</h1>
        <p className="lede">
          Afterlight is a small room for notes. Everything you keep is private
          until you mark it public. Then it walks into the hall for anyone
          passing through.
        </p>
        <div className="row">
          <Link className="btn" href="/login">
            Take a desk
          </Link>
          <Link className="btn ghost" href="/hall">
            Walk the hall
          </Link>
        </div>
      </section>

      <p className="kicker" style={{ marginTop: 8 }}>
        From the hall
      </p>
      <div className="grid">
        {(publicNotes || []).length === 0 && (
          <article className="card">
            <div className="meta">empty shelf</div>
            <h3>Nothing public yet</h3>
            <p>The first note marked public will sit here.</p>
          </article>
        )}
        {(publicNotes || []).map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="meta">
              {new Date(n.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </div>
            <h3>{n.title || "Untitled"}</h3>
            <p>{(n.body || "").slice(0, 160)}</p>
          </article>
        ))}
      </div>

      <p className="kicker">What arrived this hour</p>
      <div className="grid">
        {(log || []).map((item, i) => (
          <article className="card" key={item.id} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="meta">
              {item.shipped_at
                ? new Date(item.shipped_at).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "numeric",
                    month: "short",
                  })
                : "shipped"}
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
