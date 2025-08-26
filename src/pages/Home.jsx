import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

// ---------------------------------
// Config
// ---------------------------------
const LOGO = "/ctlogo.png"; // placez ctlogo.png dans public/
const supa = createClient(
  import.meta.env.VITE_SB_URL,
  import.meta.env.VITE_SB_ANON
);

// Séries locales d'exemple (utilisées pour l'aperçu)
const recentSets = [
  {
    name: "Foudre Noire",
    code: "EV10.5BL",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/BLK.png",
  },
  {
    name: "Flamme Blanche",
    code: "EV10.5WH",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/WHT.png",
  },
  {
    name: "Rivalité des Destinées",
    code: "EV10",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/DRI.png",
  },
  {
    name: "Aventure Ensemble",
    code: "EV9",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/JTG.png",
  },
  {
    name: "Évolution Prismatique",
    code: "EV8.5",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/PRE.png",
  },
  {
    name: "Étincelles Déferlantes",
    code: "EV8",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/SSP.png",
  },
];

// ---------------------------------
// API Supabase
// ---------------------------------
async function listPosts(limit = 3) {
  let q = supa
    .from("posts")
    .select("id,title,slug,excerpt,content_md,cover_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

async function listNews(limit = 4) {
  let q = supa
    .from("news")
    .select("id,title,published_at,link")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

async function sendFeedback(payload) {
  const { error } = await supa.from("feedback").insert(payload);
  if (error) throw error;
}

// ---------------------------------
// Page
// ---------------------------------
export default function Home() {
  // Splash au premier chargement
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem("seenSplash");
    if (seen) {
      setIsLoading(false);
      return;
    }
    const t = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("seenSplash", "1");
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // Contenu dynamique
  const [posts, setPosts] = useState([]); // blog
  const [news, setNews] = useState([]); // actus
  const [activePost, setActivePost] = useState(null);
  useEffect(() => {
    listPosts(3).then(setPosts).catch(console.error);
    listNews(4).then(setNews).catch(console.error);
  }, []);

  // États "voir plus"
  const [expanded, setExpanded] = useState({
    series: false,
    news: false,
    blog: false,
    social: false,
    feedback: true,
  });
  const toggle = (k) => setExpanded((s) => ({ ...s, [k]: !s[k] }));

  // limites d'aperçu
  const limit = { series: 3, news: 4, blog: 4, social: 4 };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src={LOGO} alt="CardTrackr logo" className="h-16 opacity-90" />
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-gray-600 text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-28 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-center mb-3">
        <img src={LOGO} alt="CardTrackr logo" className="h-32" />
      </header>

      {/* Sommaire sticky mobile */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-y border-gray-100 mb-6">
        <ul className="flex gap-3 overflow-x-auto p-2 text-sm">
          <li>
            <a
              href="#series"
              className="px-3 py-1 rounded-full border border-gray-200"
            >
              Séries
            </a>
          </li>
          <li>
            <a
              href="#news"
              className="px-3 py-1 rounded-full border border-gray-200"
            >
              Actus
            </a>
          </li>
          <li>
            <a
              href="#blog"
              className="px-3 py-1 rounded-full border border-gray-200"
            >
              Blog
            </a>
          </li>
          <li>
            <a
              href="#social"
              className="px-3 py-1 rounded-full border border-gray-200"
            >
              Réseaux
            </a>
          </li>
          <li>
            <a
              href="#feedback"
              className="px-3 py-1 rounded-full border border-gray-200"
            >
              Avis
            </a>
          </li>
        </ul>
      </nav>

      {/* --- Séries --- */}
      <section id="series" className="mb-8">
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Nouvelles séries</h2>
          <button
            onClick={() => toggle("series")}
            className="text-sm text-blue-700 hover:underline"
            aria-expanded={expanded.series}
          >
            {expanded.series ? "Voir moins" : "Voir plus"}
          </button>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(expanded.series
            ? recentSets
            : recentSets.slice(0, limit.series)
          ).map((set) => (
            <Link
              key={set.code}
              to={`/set/${set.code}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 text-center hover:bg-blue-50 active:scale-[0.98]"
            >
              <img
                src={set.logo}
                alt={set.name}
                className="w-20 h-auto mx-auto mb-3"
                loading="lazy"
              />
              <p className="text-base font-semibold text-gray-800">
                {set.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">Code : {set.code}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Actus --- */}
      <section id="news" className="mb-8">
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Actualité</h2>
          <button
            onClick={() => toggle("news")}
            className="text-sm text-blue-700 hover:underline"
            aria-expanded={expanded.news}
          >
            {expanded.news ? "Voir moins" : "Voir plus"}
          </button>
        </header>
        {news.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Aucune actualité pour le moment.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(expanded.news ? news : news.slice(0, limit.news)).map((n) => (
              <li
                key={n.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm"
              >
                {isInternal(n.link) ? (
                  <Link to={n.link || "#"} className="block">
                    <p className="text-base font-semibold text-gray-800">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {fmtDate(n.published_at)}
                    </p>
                  </Link>
                ) : (
                  <a
                    href={n.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <p className="text-base font-semibold text-gray-800">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {fmtDate(n.published_at)}
                    </p>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- Blog --- */}
      <section id="blog" className="mb-8">
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Blog</h2>
          <button
            onClick={() => toggle("blog")}
            className="text-sm text-blue-700 hover:underline"
            aria-expanded={expanded.blog}
          >
            {expanded.blog ? "Voir moins" : "Voir plus"}
          </button>
        </header>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-sm">Aucun article publié.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(expanded.blog ? posts : posts.slice(0, limit.blog)).map((b) => (
              <li
                key={b.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm"
              >
                {b.cover_url && (
                  <img
                    src={b.cover_url}
                    alt={b.title}
                    className="w-full h-36 object-cover rounded-lg mb-2"
                    loading="lazy"
                  />
                )}
                <p className="text-base font-semibold text-gray-800">
                  {b.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fmtDate(b.published_at)}
                </p>
                {b.excerpt && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {b.excerpt}
                  </p>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => setActivePost(b)}
                    className="text-sm px-3 py-1 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 active:scale-[0.98]"
                  >
                    Lire
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- Réseaux --- */}
      <section id="social" className="mb-8">
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Réseaux sociaux</h2>
          <button
            onClick={() => toggle("social")}
            className="text-sm text-blue-700 hover:underline"
            aria-expanded={expanded.social}
          >
            {expanded.social ? "Voir moins" : "Voir plus"}
          </button>
        </header>
        <SocialGrid expanded={expanded.social} limit={limit.social} />
      </section>

      {/* --- Avis --- */}
      <section id="feedback" className="mb-8">
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Donnez votre avis</h2>
          <button
            onClick={() => toggle("feedback")}
            className="text-sm text-blue-700 hover:underline"
            aria-expanded={expanded.feedback}
          >
            {expanded.feedback ? "Réduire" : "Voir plus"}
          </button>
        </header>
        {expanded.feedback ? (
          <FeedbackForm />
        ) : (
          <p className="text-gray-600 text-sm">
            Votre retour nous aide à améliorer l'app.
          </p>
        )}
      </section>

      {activePost && (
        <PostModal post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

// ---------------------------------
// Composants utilitaires
// ---------------------------------
const socialLinks = [
  { id: "ig", name: "Instagram", url: "#", icon: "📸" },
  { id: "x", name: "X / Twitter", url: "#", icon: "✖️" },
  { id: "tt", name: "TikTok", url: "#", icon: "🎵" },
  { id: "yt", name: "YouTube", url: "#", icon: "▶️" },
  { id: "fb", name: "Facebook", url: "#", icon: "📘" },
  { id: "rd", name: "Reddit", url: "#", icon: "👽" },
];

function SocialGrid({ expanded, limit }) {
  const items = expanded ? socialLinks : socialLinks.slice(0, limit);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-sm hover:bg-blue-50"
        >
          <div className="text-2xl mb-2" aria-hidden>
            {s.icon}
          </div>
          <div className="text-sm font-medium text-gray-800">{s.name}</div>
        </a>
      ))}
    </div>
  );
}

function FeedbackForm() {
  const [fb, setFb] = useState({
    name: "",
    email: "",
    rating: "5",
    message: "",
    hp: "",
  });
  const [fbOk, setFbOk] = useState(false);
  const [fbErr, setFbErr] = useState("");

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    try {
      if (fb.hp) return; // honeypot
      await sendFeedback({
        name: fb.name || null,
        email: fb.email || null,
        rating: Number(fb.rating),
        message: fb.message,
        ua: navigator.userAgent,
      });
      setFb({ name: "", email: "", rating: "5", message: "", hp: "" });
      setFbErr("");
      setFbOk(true);
      setTimeout(() => setFbOk(false), 2500);
    } catch (err) {
      setFbErr(err?.message || "Erreur d'envoi");
    }
  }

  return (
    <form
      onSubmit={handleFeedbackSubmit}
      className="bg-white border border-gray-200 rounded-xl p-4 max-w-xl"
    >
      <input
        type="text"
        value={fb.hp}
        onChange={(e) => setFb({ ...fb, hp: e.target.value })}
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="text-gray-700">Nom</span>
          <input
            type="text"
            value={fb.name}
            onChange={(e) => setFb({ ...fb, name: e.target.value })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Votre nom"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={fb.email}
            onChange={(e) => setFb({ ...fb, email: e.target.value })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="vous@exemple.com"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-700">Note</span>
          <select
            value={fb.rating}
            onChange={(e) => setFb({ ...fb, rating: e.target.value })}
            className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            {["1", "2", "3", "4", "5"].map((r) => (
              <option key={r} value={r}>
                {r}/5
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <label className="text-sm block">
            <span className="text-gray-700">Message</span>
            <textarea
              value={fb.message}
              onChange={(e) => setFb({ ...fb, message: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Votre retour nous aide à améliorer l'app"
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
        >
          Envoyer
        </button>
        {fbOk && (
          <span className="text-sm text-green-600">Merci pour votre avis.</span>
        )}
        {fbErr && <span className="text-sm text-red-600">{fbErr}</span>}
      </div>
      <p className="text-[11px] text-gray-500 mt-3">
        Envoi via Supabase, aucune donnée n'est exposée publiquement.
      </p>
    </form>
  );
}

// ---------------------------------
// Modal article
// ---------------------------------
function PostModal({ post, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex">
      <div className="m-2 sm:m-6 bg-white rounded-2xl w-full max-w-3xl mx-auto overflow-hidden flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="text-lg font-bold leading-tight">{post.title}</h3>
            <p className="text-xs text-gray-500">
              {fmtDate(post.published_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border hover:bg-gray-50"
          >
            Fermer
          </button>
        </header>
        <div className="p-4 overflow-y-auto grow">
          {post.cover_url && (
            <img
              src={post.cover_url}
              alt="cover"
              className="w-full max-h-64 object-cover rounded-xl mb-4"
            />
          )}
          <article className="prose prose-sm sm:prose max-w-none">
            <ReactMarkdown>
              {post.content_md || post.excerpt || ""}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}

// helpers
function isInternal(link) {
  return typeof link === "string" && link.startsWith("/");
}
function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}
