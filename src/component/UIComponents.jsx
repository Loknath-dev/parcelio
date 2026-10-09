import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
export default function BarcodeCard({ text = "" }) {
  const value = text.trim();
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            CODE128
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="
            flex h-8 items-center gap-1.5 rounded-lg
            border border-slate-200 bg-white px-2.5
            text-xs font-medium text-slate-500
            transition hover:bg-slate-50 hover:text-slate-800
            active:scale-95
          "
          title={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-600" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Barcode */}
      <div className="bg-slate-50 p-3 sm:p-4">
        <div className="flex min-h-32 w-full items-center justify-center overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
          <div className="flex min-w-max items-center justify-center">
            <Barcode
              value={value}
              format="CODE128"
              width={2}
              height={65}
              displayValue={true}
              fontSize={12}
              margin={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QRCodeCard({ text = "" }) {
  return (
    <div className="flex min-h-60 items-center justify-center  p-6">
      {text && <QRCode value={text} size={200} />}
    </div>
  );
}
