export const Loader = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    default: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div
        className={`${sizeClasses[size] || sizeClasses.default} border-emerald-600 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export const MosqueSkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs animate-pulse space-y-2.5"
        >
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-slate-100 rounded-md w-16" />
            <div className="h-3 bg-slate-100 rounded-md w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PrayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-md w-16" />
            <div className="h-4 w-4 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-6 bg-slate-100 rounded-md w-24" />
            <div className="h-3 bg-slate-100 rounded-md w-16" />
          </div>
          <div className="border-t border-slate-100 pt-2 space-y-2">
            <div className="h-6 bg-slate-100 rounded-md w-24" />
            <div className="h-3 bg-slate-100 rounded-md w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
