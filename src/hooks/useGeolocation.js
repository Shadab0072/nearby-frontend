import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to detect the user's location via browser Geolocation API.
 * Never uses hardcoded coordinates or fake locations.
 */
export const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        setError(null);
        setPermissionDenied(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError("Location permission was denied. Please allow location access to discover nearby mosques.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Location information is currently unavailable. Please check your GPS or internet connection.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError(err.message || "Failed to retrieve your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    coordinates,
    loading,
    error,
    permissionDenied,
    retryLocation: getLocation,
  };
};

export default useGeolocation;

