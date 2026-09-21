import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Afterlight",
  description: "A quiet desk. Notes stay yours unless you set them in the hall.",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,560&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="wrap">
          <nav className="nav">
            <Link className="mark" href="/">
              After<span>light</span>
            </Link>
            <div className="links">
              <Link href="/hall">Hall</Link>
              <Link href="/log">Hour log</Link>
              {user ? (
                <>
                  <Link href="/desk">Desk</Link>
                  <form action="/auth/signout" method="post">
                    <button className="btn ghost" type="submit" style={{ padding: "6px 12px" }}>
                      Leave
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login">Sign in</Link>
              )}
            </div>
          </nav>
          {children}
          <footer>
            <span>A living room. Public only when you say so.</span>
            <span>Hour {new Date().getUTCHours().toString().padStart(2, "0")} UTC</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
