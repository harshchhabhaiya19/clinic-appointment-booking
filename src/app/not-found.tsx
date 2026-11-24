export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-xl">
        404
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The clinic page or record you are looking for does not exist or has been relocated.
      </p>
      <a
        href="/"
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
      >
        Return to Home
      </a>
    </div>
  );
}

