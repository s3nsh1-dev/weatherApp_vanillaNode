export const currentWeatherTimeline: string = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current=temperature_2m&forecast_days=1`;

export const upcomingWeatherForecast = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max`;

export const placeholderURL: string =
  "https://jsonplaceholder.typicode.com/posts";

export const OpenStreetMapAPI = (term: string): string => {
  const updateTerm = term.split(" ").join("+");
  return `https://nominatim.openstreetmap.org/search?q=${updateTerm}&format=json`;
};

export const getWeatherAPI = (
  long: number,
  lat: number,
  apiType: "current" | "forecast"
): string => {
  const base_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&`;

  if (apiType === "current") {
    return (
      base_URL + "hourly=temperature_2m&current=temperature_2m&forecast_days=1"
    );
  } else if (apiType === "forecast") {
    return base_URL + "daily=temperature_2m_max";
  }

  throw new Error("Check API Parameters");
};
