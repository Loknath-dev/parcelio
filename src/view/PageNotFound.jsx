import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <SearchX className="h-10 w-10 text-amber-400" />
        </div>

        {/* Error Code */}
        <p className="text-7xl sm:text-8xl font-bold tracking-tight text-amber-400">
          404
        </p>

        {/* Title */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold">Page Not Found</h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base leading-6 text-slate-400">
          Sorry, the page you are looking for doesn't exist or may have been
          moved to another location.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <Home size={18} />
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
