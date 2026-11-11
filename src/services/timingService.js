import api from "./api";

/**
 * Fetch combined prayer timings for a specific mosque.
 * @param {string} mosqueId - 24-character hexadecimal ObjectId
 * @param {string} [date] - Optional date in YYYY-MM-DD
 * @returns {Promise<Object>} Timings response
 */
export const getMosqueTimings = async (mosqueId, date) => {
  const params = {};
  if (date) params.date = date;
  const response = await api.get(`/mosques/${mosqueId}/timings`, { params });
  return response.data;
};

/**
 * Update Azan and/or Jamaat timings for a mosque.
 * Automatically handles backend constraint (max 5 changes per batch) sequentially.
 *
 * @param {string} mosqueId
 * @param {Object} payload
 * @param {number} payload.expectedVersion
 * @param {Array<{prayer: string, type: 'azan'|'jamaat', time: string|null}>} payload.changes
 * @returns {Promise<Object>} Final update result
 */
export const updateMosqueTimings = async (mosqueId, { expectedVersion, changes }) => {
  if (!changes || changes.length === 0) {
    throw new Error("No changes provided to update.");
  }

  // If 5 or fewer changes, perform single request
  if (changes.length <= 5) {
    const response = await api.patch(`/mosques/${mosqueId}/timings`, {
      expectedVersion,
      changes,
    });
    return response.data;
  }

  // If more than 5 changes, chunk in batches of 5
  let currentExpectedVersion = expectedVersion;
  let lastResponse = null;

  for (let i = 0; i < changes.length; i += 5) {
    const chunk = changes.slice(i, i + 5);
    const response = await api.patch(`/mosques/${mosqueId}/timings`, {
      expectedVersion: currentExpectedVersion,
      changes: chunk,
    });
    lastResponse = response.data;
    currentExpectedVersion = response.data.version;
  }

  return lastResponse;
};

export default {
  getMosqueTimings,
  updateMosqueTimings,
};
