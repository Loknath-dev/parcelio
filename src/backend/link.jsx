import { url } from "./url";

const generateCode = (length = 32) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

export const connectLink = (name = "", phone = "") => {
  name = String(name).trim();
  phone = String(phone).trim();

  if (!name || !phone) {
    throw new Error("Name and phone are required");
  }

  const code = generateCode();

  const data = JSON.stringify({
    code,
    name,
    phone,
    createdAt: Date.now(),
  });

  const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(data))));

  return `${url.replace(/\/+$/, "")}/connect/${encoded}`;
};
