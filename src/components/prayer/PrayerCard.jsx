import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  Users,
  HelpCircle,
  Edit3,
} from "lucide-react";
import {
  PRAYER_LABELS,
  parseTimeParts,
} from "../../utils/formatTime";

const PRAYER_ICONS = {
  fajr: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

export const PrayerCard = ({ prayerKey, salahTiming, onEditClick }) => {
  const meta = PRAYER_LABELS[prayerKey] || { name: prayerKey, subtitle: "" };
  const Icon = PRAYER_ICONS[prayerKey] || Clock;

  const azan = salahTiming?.azan || { time: null, source: "api_reference" };
  const jamaat = salahTiming?.jamaat || { time: null, source: "not_set" };

  const azanParts = parseTimeParts(azan.time);
  const jamaatParts = parseTimeParts(jamaat.time);

  // Compact source badges that never overflow or cause awkward text wrapping
  const renderSourceBadge = (source) => {
    switch (source) {
      case "community":
        return (
          <span
            title="Community Updated (manually edited)"
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/90 whitespace-nowrap"
          >
            <Users className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
            <span>Community</span>
          </span>
        );
      case "api_reference":
        return (
          <span
            title="API Reference (Calculated from AlAdhan)"
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/90 whitespace-nowrap"
          >
            <Sparkles className="w-2.5 h-2.5 text-slate-500 shrink-0" />
            <span>API</span>
          </span>
        );
      case "not_set":
      default:
        return (
          <span
            title="Jamaat timing not entered yet"
            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200/60 whitespace-nowrap"
          >
            <HelpCircle className="w-2.5 h-2.5 shrink-0" />
            <span>Not Set</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all duration-200 p-4 sm:p-4.5 flex flex-col justify-between group">
      <div>
        {/* Header: Icon, Name & Subtitle */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
                {meta.name}
              </h3>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                {meta.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Timings List */}
        <div className="mt-3.5 space-y-3">
          {/* Azan Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                Azan
              </span>
              {renderSourceBadge(azan.source)}
            </div>

            <div className="flex items-baseline justify-between gap-1 pt-0.5">
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                  {azanParts.time}
                </span>
                {azanParts.period && (
                  <span className="text-xs font-semibold text-slate-500 ml-1">
                    {azanParts.period}
                  </span>
                )}
              </div>
              {azanParts.time24 && (
                <span
                  title="24-hour time"
                  className="text-[11px] font-mono text-slate-400 shrink-0"
                >
                  {azanParts.time24}
                </span>
              )}
            </div>
          </div>

          {/* Clean subtle divider */}
          <div className="border-t border-slate-100" />

          {/* Jamaat Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1 text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1 text-emerald-900">
                <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                Jamaat
              </span>
              {renderSourceBadge(jamaat.source)}
            </div>

            {jamaatParts.time !== "—" ? (
              <div className="flex items-baseline justify-between gap-1 pt-0.5">
                <div className="flex items-baseline whitespace-nowrap">
                  <span className="text-xl font-bold tracking-tight text-emerald-700 font-mono">
                    {jamaatParts.time}
                  </span>
                  {jamaatParts.period && (
                    <span className="text-xs font-semibold text-emerald-700/80 ml-1">
                      {jamaatParts.period}
                    </span>
                  )}
                </div>
                {jamaatParts.time24 && (
                  <span
                    title="24-hour time"
                    className="text-[11px] font-mono text-emerald-700/60 shrink-0"
                  >
                    {jamaatParts.time24}
                  </span>
                )}
              </div>
            ) : (
              <div className="pt-0.5 flex items-center justify-between text-xs text-slate-400 italic">
                <span>Not announced</span>
                <span className="text-[11px] text-slate-300 font-mono">—:—</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Edit button */}
      {onEditClick && (
        <div className="mt-3.5 pt-2 border-t border-slate-100/90 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Custom time?</span>
          <button
            type="button"
            onClick={() => onEditClick(prayerKey)}
            className="font-medium text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PrayerCard;