import { useState, useEffect, useCallback, useRef } from "react";
import { getNearbyMosques } from "../services/mosqueService";
import {
  getMosqueTimings,
  updateMosqueTimings,
} from "../services/timingService";

/**
 * Custom hook to manage:
 * - Nearby mosques fetching
 * - Active mosque selection (defaults to nearest)
 * - Selected mosque prayer timings
 * - Schedule version synchronization
 * - Timings update operations
 */
export const useMosques = (coordinates) => {
  const [radius, setRadius] = useState(5000);
  const [mosques, setMosques] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [selectedTimings, setSelectedTimings] = useState(null);
  const [scheduleVersion, setScheduleVersion] = useState(0);

  // Loading states
  const [loadingMosques, setLoadingMosques] = useState(false);
  const [loadingTimings, setLoadingTimings] = useState(false);
  const [isUpdatingTimings, setIsUpdatingTimings] = useState(false);

  // Error states
  const [mosqueError, setMosqueError] = useState(null);
  const [timingError, setTimingError] = useState(null);
  const [discoveryWarning, setDiscoveryWarning] = useState(null);

  // Keep ref of selected mosque ID to prevent race conditions
  const selectedMosqueIdRef = useRef(null);

  // 1. Fetch nearby mosques when coordinates or radius changes
  const fetchNearbyMosques = useCallback(
    async (customRadius) => {
      if (!coordinates?.lat || !coordinates?.lng) {
        return;
      }

      setLoadingMosques(true);
      setMosqueError(null);
      setDiscoveryWarning(null);

      const searchRadius = customRadius || radius;

      try {
        const data = await getNearbyMosques({
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius: searchRadius,
        });

        const list = Array.isArray(data.mosques) ? data.mosques : [];
        setMosques(list);

        if (data.discoveryWarning) {
          setDiscoveryWarning(data.discoveryWarning);
        }

        // Auto-select the nearest mosque if list is non-empty
        if (list.length > 0) {
          // Keep current selection if still present in list; otherwise select first (nearest)
          setSelectedMosque((prev) => {
            if (prev) {
              const stillExists = list.find((m) => m._id === prev._id);
              if (stillExists) return stillExists;
            }
            return list[0];
          });
        } else {
          setSelectedMosque(null);
          setSelectedTimings(null);
        }
      } catch (err) {
        setMosqueError(err.message || "Failed to find nearby mosques. Please check your connection.");
        setMosques([]);
        setSelectedMosque(null);
        setSelectedTimings(null);
      } finally {
        setLoadingMosques(false);
      }
    },
    [coordinates, radius]
  );

  // Trigger mosque fetch when coordinates change
  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      fetchNearbyMosques();
    }
  }, [coordinates, fetchNearbyMosques]);

  // 2. Fetch timings for selected mosque
  const fetchTimingsForMosque = useCallback(async (mosqueId) => {
    if (!mosqueId) return;

    selectedMosqueIdRef.current = mosqueId;
    setLoadingTimings(true);
    setTimingError(null);

    try {
      const data = await getMosqueTimings(mosqueId);
      // Guard against race condition if user switched mosques rapidly
      if (selectedMosqueIdRef.current === mosqueId) {
        setSelectedTimings(data);
        if (typeof data.version === "number") {
          setScheduleVersion(data.version);
        }
      }
    } catch (err) {
      if (selectedMosqueIdRef.current === mosqueId) {
        setTimingError(err.message || "Failed to load prayer timings for this mosque.");
        setSelectedTimings(null);
      }
    } finally {
      if (selectedMosqueIdRef.current === mosqueId) {
        setLoadingTimings(false);
      }
    }
  }, []);

  // When selected mosque changes, fetch its timings
  useEffect(() => {
    if (selectedMosque?._id) {
      fetchTimingsForMosque(selectedMosque._id);
    } else {
      setSelectedTimings(null);
    }
  }, [selectedMosque?._id, fetchTimingsForMosque]);

  // 3. Select mosque manually
  const selectMosque = useCallback((mosque) => {
    setSelectedMosque(mosque);
  }, []);

  // 4. Update timings
  const saveTimings = useCallback(
    async (changes) => {
      if (!selectedMosque?._id) {
        throw new Error("No mosque selected.");
      }

      setIsUpdatingTimings(true);
      try {
        const result = await updateMosqueTimings(selectedMosque._id, {
          expectedVersion: scheduleVersion,
          changes,
        });

        if (typeof result.version === "number") {
          setScheduleVersion(result.version);
        }

        // Refresh latest timings from server to ensure complete consistency
        await fetchTimingsForMosque(selectedMosque._id);
        return result;
      } catch (err) {
        // If conflict (409), refresh timings and synchronize schedule version
        if (err.isConflict || err.status === 409) {
          if (err.data?.currentVersion !== undefined) {
            setScheduleVersion(err.data.currentVersion);
          }
          await fetchTimingsForMosque(selectedMosque._id);
        }
        throw err;
      } finally {
        setIsUpdatingTimings(false);
      }
    },
    [selectedMosque, scheduleVersion, fetchTimingsForMosque]
  );

  return {
    mosques,
    selectedMosque,
    selectedTimings,
    scheduleVersion,
    radius,
    setRadius,
    loadingMosques,
    loadingTimings,
    isUpdatingTimings,
    mosqueError,
    timingError,
    discoveryWarning,
    selectMosque,
    refreshMosques: fetchNearbyMosques,
    refreshTimings: () => selectedMosque?._id && fetchTimingsForMosque(selectedMosque._id),
    saveTimings,
  };
};

export default useMosques;
