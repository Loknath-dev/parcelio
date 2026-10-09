import {
  ChevronDown,
  LogOut,
  Menu,
  MessageSquareMore,
  QrCode,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MessageApi from "../backend/Api/MessageApi";
import useAuth from "../context/useAuth";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notify, setNotify] = useState(false);
  const [qr, setQr] = useState(false);
  const [connected, setConnected] = useState(MessageApi.isConnected);
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  const unread = notifications.filter((item) => !item.read).length;

  /* WebSocket */
  useEffect(() => {
    MessageApi.connect();

    const unsubscribeStatus = MessageApi.onStatus(setConnected);

    const unsubscribeMessages = MessageApi.onMessage((data) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: createId(),
          senderId: Number(data?.sender_id ?? data?.senderId ?? 0),
          receiverId: Number(data?.receiver_id ?? data?.receiverId ?? 0),
          message: data?.message ?? "",
          time: new Date(),
          read: false,
        },
      ]);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeMessages();
    };
  }, []);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      const { target } = event;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfile(false);
      }

      if (notifyRef.current && !notifyRef.current.contains(target)) {
        setNotify(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setNotify((value) => !value);
    setProfile(false);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  const logoutUser = () => {
    setMenu(false);
    setProfile(false);
    setNotify(false);
    setQr(false);

    logout();
  };

  const openQR = () => {
    setQr(true);
    setMenu(false);
    setProfile(false);
    setNotify(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-2xl">
          <div className="px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Brand */}

              <div
                onClick={() => {
                  navigate("/");
                }}
                className="group flex cursor-pointer items-center gap-3.5"
              >
                <div className="flex h-11 w-11  items-center justify-center rounded-2xl  text-white  transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <img
                    src="icons.svg"
                    alt="Parceilo Gen"
                    className="mt-2 h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-sm font-bold tracking-tight text-slate-900">
                    Parceilo<span className="text-indigo-600">.</span>Gen
                  </h1>

                  <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                    Next-gen tool workspace
                  </p>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden items-center gap-3 sm:flex">
                {/* Notifications */}
                <div className="relative" ref={notifyRef}>
                  <NotificationButton
                    unread={unread}
                    connected={connected}
                    onClick={toggleNotifications}
                  />

                  {notify && (
                    <NotificationMenu
                      notifications={notifications}
                      connected={connected}
                    />
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setProfile((value) => !value);
                      setNotify(false);
                    }}
                    className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-3 py-1 shadow-2xs transition hover:border-slate-300 hover:bg-slate-100/80 active:scale-[0.98]"
                  >
                    <Avatar />

                    <div className="hidden text-left md:block">
                      <p className="max-w-28 truncate text-xs font-bold text-slate-900">
                        {user?.name || "Guest User"}
                      </p>

                      <p className="text-[10px] font-semibold text-indigo-600">
                        {user?.phone || "Free Tier"}
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform ${
                        profile ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profile && (
                    <ProfileMenu
                      user={user}
                      onQR={openQR}
                      onLogout={logoutUser}
                    />
                  )}
                </div>
              </div>
              {/* Mobile */}
              <div className="flex items-center gap-2 sm:hidden">
                <div className="relative" ref={notifyRef}>
                  <NotificationButton
                    unread={unread}
                    connected={connected}
                    onClick={toggleNotifications}
                  />

                  {notify && (
                    <NotificationMenu
                      notifications={notifications}
                      connected={connected}
                    />
                  )}
                </div>

                <button
                  onClick={() => {
                    setMenu((value) => !value);
                    setNotify(false);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-700 transition hover:bg-slate-100 active:scale-95"
                  aria-label="Toggle menu"
                >
                  {menu ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {menu && (
              <div className="border-t border-slate-100 pb-4 pt-3 sm:hidden">
                <div className="flex items-center gap-3 rounded-2xl border border-indigo-100/50 bg-indigo-50/50 p-3.5">
                  <Avatar />

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {user?.name || "Guest User"}
                    </p>

                    <p className="truncate text-[11px] font-semibold text-indigo-600">
                      {user?.phone || "Free Tier"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <button
                    onClick={openQR}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <QrCode size={18} className="text-indigo-500" />
                    Connect Device
                  </button>

                  <button
                    onClick={logoutUser}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={18} />
                    Logout Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* QR Modal */}
      {qr && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setQr(false);
            }
          }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Connect Device
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Scan code via mobile app
                </p>
              </div>

              <button
                onClick={() => setQr(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-6 flex items-center justify-center">
              <div className="grid h-52 w-52 place-items-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-4 shadow-inner">
                <QrCode
                  size={150}
                  strokeWidth={1.5}
                  className="text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={() => setQr(false)}
              className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.99]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Avatar */
function Avatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
      <UserRound size={17} />
    </div>
  );
}

/* Notification Button */
function NotificationButton({ unread, connected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={connected ? "Messages Active" : "Offline"}
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
    >
      <MessageSquareMore size={20} />

      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}

      <span
        className={`absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-white ${
          connected ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
    </button>
  );
}

/* Notifications */
function NotificationMenu({ notifications, connected }) {
  return (
    <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900">Notifications</h3>

          <p className="text-[10px] font-medium text-slate-400">
            {connected ? "Live sync active" : "Disconnected"}
          </p>
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            connected ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </div>

      <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
        {!notifications.length ? (
          <div className="px-4 py-10 text-center">
            <MessageSquareMore size={32} className="mx-auto text-slate-300" />

            <p className="mt-2 text-xs font-semibold text-slate-600">
              No new alerts
            </p>

            <p className="text-[11px] text-slate-400">
              We'll let you know when messages arrive.
            </p>
          </div>
        ) : (
          [...notifications].reverse().map((item) => (
            <div
              key={item.id}
              className="px-5 py-3.5 transition hover:bg-slate-50/80"
            >
              <div className="flex items-start gap-3">
                <Avatar />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900">
                      New message
                    </p>

                    <span className="shrink-0 text-[10px] text-slate-400">
                      {item.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="mt-0.5 wrap-break-word text-xs text-slate-600">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Profile */
function ProfileMenu({ user, onQR, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5">
      <div className="border-b border-slate-100 bg-slate-50/80 p-4">
        <div className="flex items-center gap-3">
          <Avatar />

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-900">
              {user?.name || "Guest User"}
            </p>

            <p className="truncate text-[11px] font-semibold text-indigo-600">
              {user?.phone || "Free Tier"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 p-2">
        <button
          onClick={() => navigate("/message")}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <MessageSquareMore size={16} className="text-slate-400" />
          Messages
        </button>

        <button
          onClick={onQR}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <QrCode size={16} className="text-slate-400" />
          Connect Device
        </button>

        <div className="my-1 border-t border-slate-100" />

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
