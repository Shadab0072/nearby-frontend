import { ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">NearbyMosque</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Open access prayer timings & verification
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>Accurate Azan calculations via AlAdhan</span>
          <span>•</span>
          <span>Community Jamaat updates</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
