import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white border border-gray-200 rounded-full shadow-lg flex justify-between items-center h-16 px-4 dark:bg-gray-700 dark:border-gray-600">
        {/* Home */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-1 w-1/3 py-2 group active:scale-[0.97] transition"
        >
          <svg
            className={`w-6 h-6 ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-blue-500"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="sr-only">Accueil</span>
        </Link>
        {/* Collection */}
        <Link
          to="/collection"
          className="flex flex-col items-center justify-center gap-1 w-1/3 py-2 group active:scale-[0.97] transition"
        >
          <svg
            className={`w-6 h-6 ${
              isActive("/collection")
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-blue-500"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v10h10V5H5Z" />
          </svg>
          <span className="sr-only">Collection</span>
        </Link>
      </div>
    </nav>
  );
}
