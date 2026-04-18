import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 pb-2 sm:pb-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg flex justify-between items-center h-16 sm:h-20 px-3 sm:px-6 dark:bg-gray-700 dark:border-gray-600">
        {/* Accueil */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 py-2 group active:scale-[0.97] transition"
          aria-label="Accueil"
        >
          <svg
            className={`w-5 sm:w-6 h-5 sm:h-6 ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-blue-500"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
            Accueil
          </span>
        </Link>

        {/* Collection */}
        <Link
          to="/collection"
          className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 py-2 group active:scale-[0.97] transition"
          aria-label="Collection"
        >
          <svg
            className={`w-5 sm:w-6 h-5 sm:h-6 ${
              isActive("/collection")
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-blue-500"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v10h10V5H5Z" />
          </svg>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
            Collection
          </span>
        </Link>
      </div>
    </nav>
  );
}
