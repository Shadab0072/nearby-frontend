import { useState, useEffect } from "react";
import {
  X,
  Clock,
  RotateCcw,
  Trash2,
  AlertCircle,
  Save,
  Users,
} from "lucide-react";
import { PRAYER_KEYS, PRAYER_LABELS } from "../../utils/formatTime";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const EditTimingModal = ({
  isOpen,
  onClose,
  mosque,
  currentTimings,
  _scheduleVersion,
  onSave,
  isSaving,
  conflictError,
  onClearConflict,
}) => {
  // Local form state for each prayer: { azan: string, jamaat: string, resetAzanToApi: boolean, clearJamaat: boolean }
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form whenever modal opens or currentTimings changes
  useEffect(() => {
    if (!isOpen || !currentTimings?.timings) return;

    const initial = {};
    for (const key of PRAYER_KEYS) {
      const entry = currentTimings.timings[key] || {};
      const azan = entry.azan || {};
      const jamaat = entry.jamaat || {};

      initial[key] = {
        // Current input string (or empty)
        azan: azan.time || "",
        // Track whether original azan was community custom or api reference
        initialAzanTime: azan.time || "",
        initialAzanSource: azan.source || "api_reference",
        resetAzan: false,

        jamaat: jamaat.time || "",
        initialJamaatTime: jamaat.time || "",
        initialJamaatSource: jamaat.source || "not_set",
        clearJamaat: false,
      };
    }

    setFormData(initial);
    setValidationErrors({});
    if (onClearConflict) onClearConflict();
  }, [isOpen, currentTimings, onClearConflict]);

  if (!isOpen) return null;

  const handleInputChange = (prayer, type, value) => {
    setFormData((prev) => {
      const updated = { ...prev[prayer] };
      updated[type] = value;
      if (type === "azan") updated.resetAzan = false;
      if (type === "jamaat") updated.clearJamaat = false;
      return {
        ...prev,
        [prayer]: updated,
      };
    });

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[`${prayer}_${type}`];
      return next;
    });
  };

  const handleResetAzan = (prayer) => {
    setFormData((prev) => {
      const updated = { ...prev[prayer] };
      updated.resetAzan = true;
      return {
        ...prev,
        [prayer]: updated,
      };
    });
  };

  const handleClearJamaat = (prayer) => {
    setFormData((prev) => {
      const updated = { ...prev[prayer] };
      updated.jamaat = "";
      updated.clearJamaat = true;
      return {
        ...prev,
        [prayer]: updated,
      };
    });
  };

  // Determine what has changed
  const computeChanges = () => {
    const changes = [];
    const errors = {};

    for (const key of PRAYER_KEYS) {
      const state = formData[key];
      if (!state) continue;

      // 1. Azan Check
      if (state.resetAzan) {
        if (state.initialAzanSource === "community") {
          changes.push({
            prayer: key,
            type: "azan",
            time: null, // resets override in backend
          });
        }
      } else if (state.azan.trim() !== state.initialAzanTime) {
        const val = state.azan.trim();
        if (val) {
          if (!TIME_REGEX.test(val)) {
            errors[`${key}_azan`] = "Format must be HH:mm (e.g. 05:30)";
          } else {
            changes.push({
              prayer: key,
              type: "azan",
              time: val,
            });
          }
        }
      }

      // 2. Jamaat Check
      if (state.clearJamaat) {
        if (state.initialJamaatTime) {
          changes.push({
            prayer: key,
            type: "jamaat",
            time: null, // clears jamaat timing
          });
        }
      } else if (state.jamaat.trim() !== state.initialJamaatTime) {
        const val = state.jamaat.trim();
        if (val === "") {
          if (state.initialJamaatTime) {
            changes.push({
              prayer: key,
              type: "jamaat",
              time: null,
            });
          }
        } else {
          if (!TIME_REGEX.test(val)) {
            errors[`${key}_jamaat`] = "Format must be HH:mm (e.g. 13:15)";
          } else {
            changes.push({
              prayer: key,
              type: "jamaat",
              time: val,
            });
          }
        }
      }
    }

    return { changes, errors };
  };

  const { changes, errors } = computeChanges();
  const hasChanges = changes.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (!hasChanges) {
      setValidationErrors({ general: "No modifications detected. Change a time or click cancel." });
      return;
    }

    try {
      await onSave(changes);
      onClose();
    } catch {
      // Error handled by parent or conflictError prop
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Edit Prayer Timings
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
              {mosque?.name} • Open community contribution (No login needed)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Notification Banner (409) */}
        {conflictError && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Version conflict:</span> Another visitor updated timings just now.
              We refreshed the form with the latest data. Please re-check your modifications and save again.
            </div>
          </div>
        )}

        {/* General validation error */}
        {validationErrors.general && (
          <div className="px-5 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationErrors.general}</span>
          </div>
        )}

        {/* Modal Body / Scrollable Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            Timings must be in <strong>24-hour HH:mm</strong> format (00:00 - 23:59).
            Unchanged values are preserved. Leave Jamaat empty if not yet known.
          </p>

          <div className="space-y-3">
            {PRAYER_KEYS.map((key) => {
              const meta = PRAYER_LABELS[key];
              const state = formData[key] || {};
              const azanError = validationErrors[`${key}_azan`];
              const jamaatError = validationErrors[`${key}_jamaat`];

              const isAzanCustom = state.initialAzanSource === "community";
              const isAzanReset = state.resetAzan;
              const isJamaatCleared = state.clearJamaat;

              return (
                <div
                  key={key}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-bold text-sm text-slate-900 capitalize">
                      {meta.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{meta.subtitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Azan Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`azan-${key}`}
                          className="text-xs font-semibold text-slate-700 flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          Azan (24-hour)
                        </label>

                        {/* Reset Azan button if currently custom or user edited */}
                        {isAzanCustom && !isAzanReset ? (
                          <button
                            type="button"
                            onClick={() => handleResetAzan(key)}
                            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Reset to API
                          </button>
                        ) : isAzanReset ? (
                          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Will reset to API calculation
                          </span>
                        ) : null}
                      </div>

                      <input
                        id={`azan-${key}`}
                        type="time"
                        value={isAzanReset ? "" : state.azan || ""}
                        disabled={isAzanReset}
                        onChange={(e) => handleInputChange(key, "azan", e.target.value)}
                        className={`w-full px-3 py-1.5 text-sm font-mono border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${azanError
                            ? "border-rose-400 bg-rose-50/50"
                            : isAzanReset
                              ? "border-emerald-200 bg-emerald-50/40 text-slate-400"
                              : "border-slate-300 bg-white"
                          }`}
                      />
                      {azanError && (
                        <p className="mt-1 text-[11px] text-rose-600">{azanError}</p>
                      )}
                    </div>

                    {/* Jamaat Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`jamaat-${key}`}
                          className="text-xs font-semibold text-slate-700 flex items-center gap-1"
                        >
                          <Users className="w-3 h-3 text-emerald-600" />
                          Jamaat (24-hour)
                        </label>

                        {state.jamaat && !isJamaatCleared ? (
                          <button
                            type="button"
                            onClick={() => handleClearJamaat(key)}
                            className="text-[11px] font-medium text-rose-600 hover:text-rose-800 flex items-center gap-0.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            Clear
                          </button>
                        ) : isJamaatCleared ? (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Will clear timing
                          </span>
                        ) : null}
                      </div>

                      <input
                        id={`jamaat-${key}`}
                        type="time"
                        value={isJamaatCleared ? "" : state.jamaat || ""}
                        placeholder="HH:mm"
                        onChange={(e) => handleInputChange(key, "jamaat", e.target.value)}
                        className={`w-full px-3 py-1.5 text-sm font-mono border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${jamaatError
                            ? "border-rose-400 bg-rose-50/50"
                            : isJamaatCleared
                              ? "border-slate-200 bg-slate-50 text-slate-400"
                              : "border-slate-300 bg-white"
                          }`}
                      />
                      {jamaatError && (
                        <p className="mt-1 text-[11px] text-rose-600">{jamaatError}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {hasChanges
                ? `${changes.length} change${changes.length > 1 ? "s" : ""} to apply`
                : "No modifications yet"}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!hasChanges || isSaving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimingModal;