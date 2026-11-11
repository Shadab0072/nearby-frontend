import { AlertCircle, RefreshCw } from "lucide-react";

export const ErrorMessage = ({
  title = "Error",
  message = "Something went wrong.",
  onRetry,
  retryLabel = "Retry",
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-900 shadow-xs">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-semibold text-sm text-rose-950">{title}</h4>}
          <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{retryLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
