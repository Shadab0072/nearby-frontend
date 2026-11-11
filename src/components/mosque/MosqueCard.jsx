import { MapPin, CheckCircle2, ChevronRight, Navigation } from "lucide-react";
import { formatDistance } from "../../utils/formatTime";

export const MosqueCard = ({ mosque, isSelected, onSelect }) => {
  const isVerified = mosque.verificationStatus === "verified";

  return (
    <button
      type="button"
      onClick={() => onSelect(mosque)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border cursor-pointer relative group ${isSelected
          ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20"
          : "bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-emerald-300 shadow-2xs"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold text-sm truncate ${isSelected ? "text-emerald-950" : "text-slate-900 group-hover:text-emerald-800"
                }`}
            >
              {mosque.name}
            </h4>
            {isVerified && (
              <span
                title="Verified Mosque"
                className="inline-flex items-center text-emerald-600 shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
              </span>
            )}
          </div>

          {/* Address & City */}
          <p className="mt-1 text-xs text-slate-500 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">
              {[mosque.address, mosque.city].filter(Boolean).join(", ") || "Address not provided"}
            </span>
          </p>
        </div>

        {/* Distance Badge */}
        {mosque.distanceMeters !== undefined && (
          <div
            className={`shrink-0 flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${isSelected
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800"
              }`}
          >
            <Navigation className="w-2.5 h-2.5" />
            <span>{formatDistance(mosque.distanceMeters)}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100/80">
        <span className="capitalize text-slate-500">
          {mosque.source === "openstreetmap" ? "OpenStreetMap" : "Community Record"}
        </span>

        <span
          className={`font-medium flex items-center gap-0.5 ${isSelected ? "text-emerald-700" : "text-slate-400 group-hover:text-emerald-600"
            }`}
        >
          {isSelected ? "Active Mosque" : "Select Mosque"}
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
};

export default MosqueCard;