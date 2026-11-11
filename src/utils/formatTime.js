/**
 * Utility functions for formatting prayer timings, distances, and dates.
 */

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export const PRAYER_LABELS = {
  fajr: { name: "Fajr", subtitle: "Dawn prayer" },
  dhuhr: { name: "Dhuhr", subtitle: "Noon prayer" },
  asr: { name: "Asr", subtitle: "Afternoon prayer" },
  maghrib: { name: "Maghrib", subtitle: "Sunset prayer" },
  isha: { name: "Isha", subtitle: "Night prayer" },
};

/**
 * Parses 24-hour time "HH:mm" into separate components to prevent wrapping
 * @param {string|null} time24
 * @returns {{ time: string, period: string, time24: string }}
 */
  export const parseTimeParts = (time24) => {
    if (!time24 || typeof time24 !== "string") {
      return { time: "—", period: "", time24: "" };
    }
    const [hoursStr, minutesStr] = time24.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return { time: time24, period: "", time24 };
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return {
      time: `${displayHours}:${displayMinutes}`,
      period,
      time24,
    };
  };

  /**
   * Converts 24-hour time "HH:mm" to 12-hour format "hh:mm AM/PM"
   * @param {string|null} time24
   * @returns {string} formatted 12-hour time or "—"
   */
  export const formatTo12Hour = (time24) => {
    const parts = parseTimeParts(time24);
    if (parts.time === "—") return "—";
    return `${parts.time} ${parts.period}`;
  };

  /**
   * Formats distance in meters to a human-readable string (m or km)
   * @param {number|null|undefined} meters
   * @returns {string}
   */
  export const formatDistance = (meters) => {
    if (meters === undefined || meters === null || Number.isNaN(meters)) return "";
    if (meters < 1000) {
      return `${Math.round(meters)} m away`;
    }
    return `${(meters / 1000).toFixed(1)} km away`;
  };
