import BarcodeCard from "../component/UIComponents";

export default function BarcodeLibrary({ barcodes = [] }) {
  return (
    <div className="divide-y divide-slate-100">
      {barcodes.map((barcode, index) => (
        <div
          key={`${barcode}-${index}`}
          className="
        flex flex-col gap-3 p-4
        sm:flex-row sm:items-center
        sm:px-5
      "
        >
          {/* Number */}
          <span
            className="
          flex h-7 w-7 shrink-0 items-center
          justify-center rounded-lg
          bg-slate-100 text-xs font-semibold
          text-slate-500
        "
          >
            {index + 1}
          </span>

          {/* Barcode */}
          <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
            <BarcodeCard text={barcode} />
          </div>

          {/* Actions */}
        </div>
      ))}
    </div>
  );
}
