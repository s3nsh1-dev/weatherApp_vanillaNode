// import { placeholderURL as URL } from "./urlList";

export default async function fetchingURL(URL: string): Promise<Response> {
  const response: Response = await fetch(URL);
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  } else {
    return response;
  }
}
