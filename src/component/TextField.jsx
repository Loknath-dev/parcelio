export default function TextField({ value = "", onChange }) {
  const lines = value.split("\n");
  const count = lines.filter((item) => item.trim()).length;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />

          <span className="text-[11px] font-semibold text-slate-600">
            Barcode data
          </span>
        </div>

        <span className="text-[10px] text-slate-400">One value per line</span>
      </div>

      {/* Input */}
      <textarea
        id="barcode-data"
        value={value}
        onChange={onChange}
        spellCheck={false}
        autoComplete="off"
        placeholder={`Enter barcode values...

8901234567890
8901234567891
8901234567892`}
        className="
          block min-h-64 w-full resize-none
          bg-white px-4 py-4
          font-mono text-xs leading-7
          text-slate-700
          outline-none
          placeholder:font-sans
          placeholder:text-slate-400
          selection:bg-amber-100
          sm:min-h-72
        "
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="text-[10px] text-slate-400">
          Blank lines are ignored
        </span>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-400">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>

          <span className="h-3 w-px bg-slate-200" />

          <span className="text-[10px] font-semibold text-amber-600">
            {count} {count === 1 ? "barcode" : "barcodes"}
          </span>
        </div>
      </div>
    </div>
  );
}
