import { placeholderURL } from "./urlList";

let finalResult: any = null;

try {
  const fetchingURL = async (): Promise<Response> => {
    const response = await fetch(placeholderURL);
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return await response.json();
  };

  finalResult = await fetchingURL();
} catch (error: unknown) {
  console.error("Error fetching URL", error);
}

export { finalResult };
