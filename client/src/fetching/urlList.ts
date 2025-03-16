export const openMetroWeatherAPI: string =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_180m&current=is_day";

export const placeholderURL: string =
  "https://jsonplaceholder.typicode.com/posts";

export const OpenStreetMapAPI = (term: string): string => {
  console.log("change triggered:", term);
  const updateTerm = term.replace(" ", "+");
  return `https://nominatim.openstreetmap.org/search?q=${updateTerm}&format=json`;
};
