// src/pages/Home.jsx
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { listNews, listPosts, listSets, sendFeedback } from "../api/content";

const LOGO = "/ctlogo.png"; // placez ctlogo.png dans public/

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
  const [sets, setSets] = useState([]); // séries
  const [activePost, setActivePost] = useState(null);
  const [activeNews, setActiveNews] = useState(null);

  useEffect(() => {
    listPosts(3).then(setPosts).catch(console.error);
    listNews(4).then(setNews).catch(console.error);
    listSets(0).then(setSets).catch(console.error);
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

  // limites d’aperçu
  const limit = { series: 3, news: 4, blog: 4, social: 4 };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src={LOGO} alt="CardTrackr logo" className="h-32 opacity-90" />
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
          {(expanded.series ? sets : sets.slice(0, limit.series)).map((set) => (
            <Link
              key={set.code_raw}
              to={`/set/${set.code_raw}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 text-center hover:bg-blue-50 active:scale-[0.98]"
            >
              <img
                src={set.logo_url}
                alt={set.name || set.code_raw}
                className="w-20 h-auto mx-auto mb-3"
                loading="lazy"
              />
              <p className="text-base font-semibold text-gray-800">
                {set.name || set.code_raw}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Code : {set.code_raw}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Actus (mêmes fonctions que Blog) --- */}
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
                {n.cover_url && (
                  <img
                    src={n.cover_url}
                    alt={n.title}
                    className="w-full h-36 object-cover rounded-lg mb-2"
                    loading="lazy"
                  />
                )}
                <p className="text-base font-semibold text-gray-800">
                  {n.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fmtDate(n.published_at)}
                </p>
                {n.excerpt && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {n.excerpt}
                  </p>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => setActiveNews(n)}
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
      {activeNews && (
        <PostModal post={activeNews} onClose={() => setActiveNews(null)} />
      )}
    </div>
  );
}

/* ===== Composants utilitaires ===== */

const socialLinks = [
  {
    id: "ig",
    name: "Instagram",
    url: "#",
    icon: (
      <svg
        className="mx-auto h-12"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
      </svg>
    ),
  },
  {
    id: "x",
    name: "X / Twitter",
    url: "#",
    icon: (
      <svg
        className="mx-auto h-12"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
      </svg>
    ),
  },
  {
    id: "dsc",
    name: "Discord",
    url: "#",
    icon: (
      <svg
        className="mx-auto h-12"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path>
      </svg>
    ),
  },
  {
    id: "tt",
    name: "Tik Tok",
    url: "#",
    icon: (
      <svg
        className="mx-auto h-12"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.671576 6 44 7.3284241 44 9 L 44 41 C 44 42.671576 42.671576 44 41 44 L 9 44 C 7.3284241 44 6 42.671576 6 41 L 6 9 C 6 7.3284241 7.3284241 6 9 6 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z M 27.041016 12 L 29.322266 12 C 30.049047 15.2987 32.626734 17.814404 35.958984 18.445312 L 35.958984 21.310547 C 33.820114 21.201935 31.941489 20.134948 30.835938 18.453125 A 1.0001 1.0001 0 0 0 29 19.003906 L 29 30.539062 C 29 34.707538 25.641273 38.066406 21.472656 38.066406 C 17.304181 38.066406 13.945312 34.707538 13.945312 30.539062 C 13.945312 26.538539 17.066083 23.363182 21 23.107422 L 21 25.283203 C 18.286416 25.535721 16.121094 27.762246 16.121094 30.539062 C 16.121094 33.483274 18.528445 35.892578 21.472656 35.892578 C 24.401892 35.892578 27 33.586491 27 30.59375 C 27 30.64267 27.001859 29.335571 27.005859 27.494141 C 27.009759 25.65271 27.016224 23.20692 27.021484 20.763672 C 27.030884 16.376775 27.039186 12.849206 27.041016 12 z"></path>
      </svg>
    ),
  },
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
          className="px-4 py-2 rounded-lg bg-blue-600 text-black hover:bg-blue-700 active:scale-[0.98]"
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

/* ===== Modal article (blog/actus) ===== */
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

/* ===== Helpers ===== */
function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}
