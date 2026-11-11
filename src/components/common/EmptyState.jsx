import { Compass } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Compass,
  title = "No data available",
  description = "No items were found matching the current criteria.",
  action,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100/80">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
