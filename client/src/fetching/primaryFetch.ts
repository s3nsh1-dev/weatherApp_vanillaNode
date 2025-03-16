import { placeholderURL as URL } from "./urlList";

let finalResult: any = null;

export default async function fetchingURL(): Promise<Response> {
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  }
  return await response.json();
}

try {
  finalResult = await fetchingURL();
} catch (error: unknown) {
  console.error("Error fetching URL", error);
}

export { finalResult };
