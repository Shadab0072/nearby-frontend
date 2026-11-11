import PrayerCard from "./PrayerCard";
import { PrayerSkeleton } from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import {
  Sparkles,
  Users,
  HelpCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { PRAYER_KEYS } from "../../utils/formatTime";

export const PrayerTimings = ({
  timingsData,
  loading,
  error,
  onRetry,
  onEditPrayer,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-800">
            Salah Timings (Today)
          </h2>
        </div>
        <PrayerSkeleton />
      </div >
    );
  }

if (error) {
  return (
    <div className="space-y-4">
      <ErrorMessage
        title="Could not load prayer timings"
        message={error}
        onRetry={onRetry}
        retryLabel="Retry Loading Timings"
      />
    </div>
  );
}

const timings = timingsData?.timings || {};

return (
  <section className="space-y-4">
      {/* Title & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Today's Five Daily Salah Timings
          </h2>
        </div>

        {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                <Sparkles className="w-2.5 h-2.5 text-slate-500" />
                API Calc
              </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  <Users className="w-2.5 h-2.5 text-emerald-600" />
                  Community
                </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-200/60">
                    <HelpCircle className="w-2.5 h-2.5 text-slate-400" />
                    Not Set
                  </span>
                </div>
            </div>

            {/* Backend Fallback warning if external API was degraded */}
            {timingsData?.warning && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{timingsData.warning}</span>
              </div>
            )}

              {/* 5 Salah Responsive Grid (1 col on mobile, 2 col on sm, 3 col on lg, 5 col on xl) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {PRAYER_KEYS.map((key) => (
                  <PrayerCard
                    key={key}
                    prayerKey={key}
                    salahTiming={timings[key]}
                    onEditClick={onEditPrayer}
                  />
                ))}
              </div>

              {/* Community footer note */}
              <p className="text-xs text-slate-500 italic pt-1">
                * Azan timings automatically adjust daily based on solar calculations. Jamaat timings are updated by local worshippers.
              </p>
            </section>
            );
};

            export default PrayerTimings;
