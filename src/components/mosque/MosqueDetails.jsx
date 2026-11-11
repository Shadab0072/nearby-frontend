import {
  MapPin,
  ShieldCheck,
  Edit3,
  Calendar,
  Globe,
  RefreshCw,
  Compass,
} from "lucide-react";
import { formatDistance } from "../../utils/formatTime";

export const MosqueDetails = ({
  mosque,
  selectedTimings,
  loadingTimings,
  onOpenEditModal,
  onRefreshTimings,
  onSwitchMosque,
  mosqueCount,
}) => {
  if (!mosque) {
    return null;
  }

  const isVerified = mosque.verificationStatus === "verified";
  const fullAddress = [
    mosque.address,
    mosque.city,
    mosque.state,
    mosque.country,
    mosque.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const formattedDate = selectedTimings?.date
    ? new Date(selectedTimings.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null;

            return (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 mb-5 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Mosque Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {mosque.name}
                    </h1>

                    {/* Verification badge */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Mosque
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Community Managed
                      </span>
                    )}

                  {mosque.distanceMeters !== undefined && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      {formatDistance(mosque.distanceMeters)}
                    </span>
                  )}
                </div>

                  {/* Address */}
                  <div className="mt-2 flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{fullAddress || "Address not provided"}</span>
                  </div>

                  {/* Meta Info (Timezone & Date) */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
                    {formattedDate && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </span>
                    )}

                    {mosque.timezone && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mosque.timezone}</span>
                      </span>
                    )}
                  </div>
                </div>

        {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    {/* On mobile: Quick button to see other nearby mosques */}
                    {onSwitchMosque && (
                      <button
                        type="button"
                        onClick={onSwitchMosque}
                        className="lg:hidden px-3 py-2 text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Other Mosques {mosqueCount ? `(${mosqueCount})` : ""}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onRefreshTimings}
                      disabled={loadingTimings}
                      title="Refresh prayer timings"
                      className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingTimings ? "animate-spin text-emerald-600" : ""}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenEditModal}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Timings</span>
                    </button>
                  </div>
                </div>
              </div>
            );
};

            export default MosqueDetails;