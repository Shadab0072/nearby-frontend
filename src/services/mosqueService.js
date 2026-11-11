import api from "./api";

/**
 * Fetch nearby mosques from the backend using geospatial query.
 * @param {Object} params
 * @param {number} params.lat - Latitude (-90 to 90)
 * @param {number} params.lng - Longitude (-180 to 180)
 * @param {number} [params.radius=5000] - Search radius in meters
 * @returns {Promise<Object>} Backend response with mosques array
 */
export const getNearbyMosques = async ({ lat, lng, radius = 5000 }) => {
  const response = await api.get("/mosques/nearby", {
    params: {
      lat,
      lng,
      radius,
    },
  });
  return response.data;
};

export default {
  getNearbyMosques,
};

