import {
  Check,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import MessageApi from "../backend/Api/MessageApi";

const CURRENT_USER_ID = 1;
const RECEIVER_ID = 2;

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    MessageApi.connect();

    const unsubscribeStatus = MessageApi.onStatus(setConnected);

    const unsubscribe = MessageApi.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      unsubscribeStatus();
      unsubscribe?.();
      setConnected(false);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    const value = text.trim();

    if (!value) return;

    const message = {
      message_type: "message",
      senderId: CURRENT_USER_ID,
      receiverId: RECEIVER_ID,
      message: value,
      createdAt: new Date().toISOString(),
    };

    if (MessageApi.send(message)) {
      setText("");
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex  w-full bg-slate-100 p-0 sm:p-3 md:p-5">
      <section className="mx-auto flex  w-full max-w-5xl flex-col overflow-hidden bg-white shadow-none sm:h-[calc(80vh-24px)] sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-xl">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-sm font-bold text-white shadow-sm">
                JD
              </div>

              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  connected ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
            </div>

            {/* User */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-slate-800">
                Jane Doe
              </h1>

              <div className="flex items-center gap-1.5">
                {connected ? (
                  <Wifi className="h-3 w-3 text-emerald-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-slate-400" />
                )}

                <span
                  className={`text-xs font-medium ${
                    connected ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {connected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              title="More"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-3 py-4 sm:px-5 md:px-8">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {messages.map((msg, index) => {
                const isMe = msg.senderId === CURRENT_USER_ID;

                return (
                  <div
                    key={msg.id || `${msg.createdAt}-${index}`}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
                        isMe
                          ? "rounded-2xl rounded-br-md bg-amber-500 text-white"
                          : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-800"
                      } px-3.5 py-2.5 shadow-sm`}
                    >
                      <p className="wrap-break-word text-sm leading-6">
                        {msg.message}
                      </p>

                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                          isMe ? "text-amber-100" : "text-slate-400"
                        }`}
                      >
                        <span>{formatTime(msg.createdAt)}</span>

                        {isMe && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <footer className="shrink-0 border-t border-slate-200 bg-white p-2.5 sm:p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            {/* Attachment */}
            <button
              type="button"
              className="hidden shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:block"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Input */}
            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                className="hidden shrink-0 p-1.5 text-slate-400 transition hover:text-slate-600 sm:block"
                title="Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {/* Send */}
            <button
              type="button"
              onClick={sendMessage}
              disabled={!text.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm transition hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-55 items-center justify-center">
      <div className="max-w-xs text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <Send className="h-6 w-6" />
        </div>

        <h2 className="text-sm font-semibold text-slate-700">
          Start a conversation
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Send a message to Jane Doe and start chatting.
        </p>
      </div>
    </div>
  );
}
