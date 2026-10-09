import { ArrowRight, Phone, User } from "lucide-react";
import { useState } from "react";
import useAuth from "../context/useAuth";

export default function TemporaryAccess() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.mobile.trim();

    if (!name || !phone) return;

    await login(name, phone);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
            <User size={26} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Temporary Access
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Enter your details to continue
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-7"
        >
          {/* Name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="mb-6">
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Mobile Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                autoComplete="tel"
                required
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Temporary access is limited and may expire automatically.
        </p>
      </div>
    </main>
  );
}
