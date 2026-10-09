import { toast } from "react-toastify";
import { url } from "./url";
export default async function connection(path, data = {}) {
  try {
    const endpoint = `${url.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type") || "";

    // Automatically parse response
    let result;

    if (contentType.includes("application/json")) {
      result = await response.json();
    } else if (
      contentType.includes("image/") ||
      contentType.includes("application/pdf") ||
      contentType.includes("application/octet-stream")
    ) {
      result = await response.blob();
    } else {
      result = await response.text();
    }

    // Handle errors
    if (!response.ok) {
      const message =
        result?.message ||
        (typeof result === "string" ? result : "Something went wrong");

      throw new Error(message);
    }
    // JSON API response
    if (contentType.includes("application/json")) {
      return result?.data ?? result ?? {};
    }

    // Blob / text response
    return result;
  } catch (error) {
    toast.error(error.message || "Something went wrong");
    return null;
  } finally {
    // finish loading
  }
}
