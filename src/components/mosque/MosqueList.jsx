import { useState, useMemo } from "react";
import MosqueCard from "./MosqueCard";
import { MosqueSkeletonList } from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import {
  Compass,
  MapPin,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export const MosqueList = ({
  mosques = [],
  selectedMosque,
  onSelectMosque,
  loading,
  error,
  discoveryWarning,
  onRetry,
  onRefresh,
  radius,
  onRadiusChange,
  coordinates,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMosques = useMemo(() => {
    if (!searchQuery.trim()) return mosques;
    const query = searchQuery.toLowerCase().trim();
    return mosques.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.address?.toLowerCase().includes(query) ||
        m.city?.toLowerCase().includes(query)
    );
  }, [mosques, searchQuery]);

  return (
    <aside className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nearby Mosques</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            {loading ? "Searching..." : `${mosques.length} Mosques Found`}
          </h2>
        </div>

        {/* Radius selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="radius-select" className="text-xs text-slate-400 font-medium hidden sm:inline">
            Radius:
          </label>
          <select
            id="radius-select"
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value={2000}>2 km</option>
            <option value={5000}>5 km (Default)</option>
            <option value={10000}>10 km</option>
            <option value={15000}>15 km</option>
          </select>
        </div>
      </div>

      {/* Discovery warning if overpass was degraded or using cache */}
      {discoveryWarning && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{discoveryWarning}</p>
        </div>
      )}

      {/* Search Input when mosques exist */}
      {mosques.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter mosques in list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50/80 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Content list / Loading / Errors */}
      <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[160px] pr-0.5">
        {loading ? (
          <MosqueSkeletonList count={4} />
        ) : error ? (
          <ErrorMessage
            title="Could not find mosques"
            message={error}
            onRetry={onRetry}
            retryLabel="Try Again"
          />
        ) : filteredMosques.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title={searchQuery ? "No matching mosques" : "No mosques nearby"}
            description={
              searchQuery
                ? `No mosques matched "${searchQuery}". Try a different keyword.`
                : `No active mosques found within ${(radius / 1000).toFixed(0)} km of your detected location.`
            }
            action={
              !searchQuery && radius < 15000 ? (
                <button
                  onClick={() => onRadiusChange(Math.min(radius + 5000, 15000))}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  Expand search radius to {((radius + 5000) / 1000).toFixed(0)} km
                </button>
              ) : null
            }
          />
        ) : (
          filteredMosques.map((mosque) => (
            <MosqueCard
              key={mosque._id}
              mosque={mosque}
              isSelected={selectedMosque?._id === mosque._id}
              onSelect={onSelectMosque}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      {coordinates && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>
              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </span>
          </span>
          <button
            onClick={onRefresh}
            className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      )}
    </aside>
  );
};

export default MosqueList;
