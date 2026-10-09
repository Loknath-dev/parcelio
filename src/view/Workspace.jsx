import {
  Check,
  Clock3,
  Copy,
  Layers,
  Send,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Barcode from "react-barcode";
import MessageApi from "../backend/Api/MessageApi";
import TextField from "../component/TextField";

const USER_ID = 1;
const RECEIVER_ID = 2;

export default function Workspace() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    MessageApi.connect();

    const unsubscribe = MessageApi.onStatus(setConnected);

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, []);

  const parsedBarcodes = useMemo(
    () => [
      ...new Set(
        input
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ],
    [input],
  );

  const handleGenerate = () => {
    if (!connected || !parsedBarcodes.length) return;

    const createdAt = new Date().toISOString();
    const sent = [];

    parsedBarcodes.forEach((barcode, index) => {
      const message = {
        message_type: "code",
        senderId: USER_ID,
        receiverId: RECEIVER_ID,
        message: barcode,
        createdAt,
      };

      try {
        if (MessageApi.send(message) !== false) {
          sent.push({
            id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
            value: barcode,
            createdAt,
          });
        }
      } catch (error) {
        console.error("Send error:", error);
      }
    });

    if (!sent.length) return;

    setHistory((previous) => [...sent, ...previous]);
    setInput("");
  };

  const handleCopyItem = async (id, value) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50/50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main Layout */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <GeneratorCard
            input={input}
            setInput={setInput}
            count={parsedBarcodes.length}
            connected={connected}
            onClear={() => setInput("")}
            onGenerate={handleGenerate}
          />

          <MessageHistory
            history={history}
            onClear={() => setHistory([])}
            copiedId={copiedId}
            onCopy={handleCopyItem}
          />
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Connection Status                                                          */
/* -------------------------------------------------------------------------- */

function ConnectionStatus({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        connected
          ? "border-emerald-200/80 bg-emerald-50/80 text-emerald-700"
          : "border-rose-200/80 bg-rose-50/80 text-rose-600"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {connected && (
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative h-2 w-2 rounded-full ${
            connected ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
      </span>

      <span>{connected ? "Connected" : "Disconnected"}</span>
      {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Generator Card                                                             */
/* -------------------------------------------------------------------------- */

function GeneratorCard({
  input,
  setInput,
  count,
  connected,
  onClear,
  onGenerate,
}) {
  const hasInput = Boolean(input.trim());

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Barcode Input
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Enter one barcode value per line
            </p>
          </div>
        </div>

        <ConnectionStatus connected={connected} />
      </div>

      {/* Input Form Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 transition-all focus-within:border-amber-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/10">
          <TextField
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasInput}
            className="
              inline-flex h-10 w-full items-center justify-center gap-2
              rounded-xl border border-slate-200 bg-white px-4
              text-xs font-semibold text-slate-600
              transition-all hover:bg-slate-50 hover:text-slate-900
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-40
              sm:w-auto
            "
          >
            <Trash2 size={14} />
            Clear
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!count || !connected}
            className="
              inline-flex h-10 w-full items-center justify-center gap-2
              rounded-xl bg-amber-500 px-5
              text-xs font-semibold text-white
              shadow-sm shadow-amber-500/20
              transition-all hover:bg-amber-600
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:bg-slate-100
              disabled:text-slate-400 disabled:shadow-none
              sm:w-auto
            "
          >
            <Send size={14} />
            Dispatch {count > 0 ? `(${count})` : ""}
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Message History                                                            */
/* -------------------------------------------------------------------------- */

function MessageHistory({ history, onClear, copiedId, onCopy }) {
  return (
    <aside
      className="
        flex min-h-64 flex-col overflow-hidden
        rounded-2xl border border-slate-200/80
        bg-white shadow-sm
        lg:sticky lg:top-6 lg:max-h-[calc(100vh-80px)]
      "
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Clock3 size={16} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              Transmission Log
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {history.length}{" "}
              {history.length === 1 ? "dispatch" : "dispatches"}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            title="Clear history"
            aria-label="Clear history"
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg text-slate-400 transition-colors
              hover:bg-rose-50 hover:text-rose-600
            "
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* History Items List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!history.length ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                copied={copiedId === item.id}
                onCopy={() => onCopy(item.id, item.value)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* History Item                                                               */
/* -------------------------------------------------------------------------- */

function HistoryItem({ item, copied, onCopy }) {
  const time = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="
        group rounded-xl border border-slate-200/70
        bg-white p-3.5
        transition-all duration-200
        hover:border-amber-200 hover:bg-amber-50/10 hover:shadow-sm
      "
    >
      {/* Main Value & Copy */}
      <div className="flex items-center justify-between gap-2">
        <p
          title={item.value}
          className="min-w-0 flex-1 text-center truncate font-mono text-sm font-bold tracking-tight text-slate-800"
        >
          {item.value}
        </p>

        <button
          type="button"
          onClick={onCopy}
          title={copied ? "Copied" : "Copy value"}
          aria-label={copied ? "Copied" : "Copy value"}
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-lg border transition-all active:scale-95
            ${
              copied
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
            }
          `}
        >
          {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
        </button>
      </div>

      {/* Barcode preview container */}
      <div className="mt-3 flex h-10 w-full items-center justify-center overflow-hidden rounded-lg px-2 ">
        <div className="max-w-full overflow-hidden">
          <Barcode
            value={item.value}
            format="CODE128"
            width={1}
            height={18}
            displayValue={false}
            margin={0}
          />
        </div>
      </div>

      {/* Meta info */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock3 size={11} />
          {time}
        </span>

        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Dispatched
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty History                                                              */
/* -------------------------------------------------------------------------- */

function EmptyHistory() {
  return (
    <div className="flex h-full min-h-60 flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Clock3 size={20} />
      </div>
      <p className="text-xs font-semibold text-slate-700">
        No transmissions yet
      </p>
      <p className="mt-1 max-w-50 text-[11px] leading-relaxed text-slate-400">
        Dispatched barcode values will appear here automatically.
      </p>
    </div>
  );
}
