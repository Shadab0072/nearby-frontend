import { Link } from "react-router-dom";
import { RefreshCw, MapPin } from "lucide-react";

export const Navbar = ({ onRefresh, isRefreshing, locationName }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
            {/* Mosque silhouette SVG icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2c-1.2 1.3-2.5 3-2.5 5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-2-1.3-3.7-2.5-5z" />
              <path d="M4 22V10l8-4 8 4v12" />
              <path d="M9 22v-5a3 3 0 0 1 6 0v5" />
              <path d="M2 22h20" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Jamaat<span className="text-emerald-600">Time</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Community Timings
            </span>
          </div>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {locationName && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[200px]">{locationName}</span>
            </div>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh nearby mosques"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
