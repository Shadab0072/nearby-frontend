import { useState } from "react";
import { toast } from "react-toastify";
import useGeolocation from "../hooks/useGeolocation";
import useMosques from "../hooks/useMosques";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MosqueList from "../components/mosque/MosqueList";
import MosqueDetails from "../components/mosque/MosqueDetails";
import PrayerTimings from "../components/prayer/PrayerTimings";
import EditTimingModal from "../components/prayer/EditTimingModal";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import {
  MapPinOff,
  Navigation,
  RefreshCw,
  Compass,
  Clock,
} from "lucide-react";

export const Home = () => {
  // 1. Geolocation detection
  const {
    coordinates,
    loading: loadingLocation,
    error: locationError,
    permissionDenied,
    retryLocation,
  } = useGeolocation();

  // 2. Mosques & timings data
  const {
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
    refreshMosques,
    refreshTimings,
    saveTimings,
  } = useMosques(coordinates);

  // 3. UI states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [conflictError, setConflictError] = useState(false);
  // Mobile tab state ("timings" | "mosques")
  const [mobileTab, setMobileTab] = useState("timings");

  // Handle saving timings from EditTimingModal
  const handleSaveTimings = async (changes) => {
    setConflictError(false);
    try {
      const res = await saveTimings(changes);
      toast.success(res?.message || "Prayer timings updated successfully!");
      return res;
    } catch (err) {
      if (err.isConflict || err.status === 409) {
        setConflictError(true);
        toast.error("Version conflict: The schedule was just modified by someone else. Please review the updated timings.");
      } else {
        toast.error(err.message || "Failed to update timings. Please try again.");
      }
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Bar */}
      <Navbar
        onRefresh={coordinates ? () => refreshMosques() : null}
        isRefreshing={loadingMosques}
        locationName={
          coordinates
            ? `${coordinates.lat.toFixed(3)}°, ${coordinates.lng.toFixed(3)}°`
            : null
        }
      />

      {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7">
          {/* State A: Geolocation is loading */}
          {loadingLocation && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <Navigation className="w-8 h-8 animate-pulse text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Detecting Your Current Location...
              </h2>
              <p className="mt-1 text-sm text-slate-500 text-center max-w-md">
                Please allow browser location permissions to automatically discover mosques near you.
              </p>
              <div className="mt-5">
                <Loader size="small" message="" />
              </div>
            </div>
          )}

          {/* State B: Location Permission Denied or Location Error */}
          {!loadingLocation && (permissionDenied || (!coordinates && locationError)) && (
            <div className="max-w-xl mx-auto py-12">
              <div className="p-8 bg-white rounded-2xl border border-rose-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
                  <MapPinOff className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Location Access Required
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {locationError ||
                    "NearbyMosque requires your real location to query real mosques in your vicinity. We do not use hardcoded or fake locations."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={retryLocation}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Location Permission</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State C: Location acquired -> Two-column Dashboard */}
          {!loadingLocation && coordinates && (
                <div>
                  {/* Mobile View Toggle Switch (< lg) */}
                  <div className="flex lg:hidden items-center bg-slate-200/75 p-1 rounded-xl mb-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setMobileTab("timings")}
                      className={`flex-1 py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mobileTab === "timings"
                          ? "bg-white text-emerald-800 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">Prayer Timings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileTab("mosques")}
                      className={`flex-1 py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mobileTab === "mosques"
                          ? "bg-white text-emerald-800 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nearby Mosques ({mosques.length})</span>
                    </button>
                  </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                          {/* Left Column: Mosque List & Search Radius Sidebar */}
                          <div
                            className={`lg:col-span-4 xl:col-span-4 ${mobileTab === "mosques" ? "block" : "hidden lg:block"
                              }`}
                          >
                            <MosqueList
                              mosques={mosques}
                              selectedMosque={selectedMosque}
                              onSelectMosque={(mosque) => {
                                selectMosque(mosque);
                                setMobileTab("timings");
                              }}
                              loading={loadingMosques}
                              error={mosqueError}
                              discoveryWarning={discoveryWarning}
                              onRetry={() => refreshMosques()}
                              onRefresh={() => refreshMosques()}
                              radius={radius}
                              onRadiusChange={(newRadius) => {
                                setRadius(newRadius);
                                refreshMosques(newRadius);
                              }}
                              coordinates={coordinates}
                            />
                          </div>

                            {/* Right Column: Selected Mosque Dashboard & Timings */}
              <div
                            className={`lg:col-span-8 xl:col-span-8 flex flex-col ${mobileTab === "timings" ? "block" : "hidden lg:block"
                              }`}
                          >
                            {loadingMosques && !selectedMosque ? (
                              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 text-center">
                                <Loader message="Discovering nearby real mosques..." />
                              </div>
                            ) : selectedMosque ? (
                              <>
                                {/* Mosque Details Banner */}
                                <MosqueDetails
                                  mosque={selectedMosque}
                                  selectedTimings={selectedTimings}
                                  loadingTimings={loadingTimings}
                                  onOpenEditModal={() => setIsEditModalOpen(true)}
                                  onRefreshTimings={refreshTimings}
                                  onSwitchMosque={() => setMobileTab("mosques")}
                                  mosqueCount={mosques.length}
                                />

                                {/* Prayer Timings Component */}
                                <PrayerTimings
                                  timingsData={selectedTimings}
                                  loading={loadingTimings}
                                  error={timingError}
                                  onRetry={refreshTimings}
                                  onEditPrayer={() => setIsEditModalOpen(true)}
                                />
                              </>
                            ) : (
                              <EmptyState
                                icon={Compass}
                                title="No mosque selected"
                                description="Choose a mosque from the sidebar to inspect its five daily Salah timings."
                                action={
                                  <button
                                    onClick={() => setMobileTab("mosques")}
                                    className="lg:hidden px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs"
                                  >
                                    View Nearby Mosques
                                  </button>
                                }
                              />
                )}
                        </div>
                      </div>
                  </div>
        )}
                </main>

                {/* Edit Timings Modal */}
                <EditTimingModal
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  mosque={selectedMosque}
                  currentTimings={selectedTimings}
                  _scheduleVersion={scheduleVersion}
                  onSave={handleSaveTimings}
                  isSaving={isUpdatingTimings}
                  conflictError={conflictError}
                  onClearConflict={() => setConflictError(false)}
                />

                {/* Footer */}
                <Footer />
              </div>
              );
};

              export default Home;
