import { cityNames } from "../constants/constVariables";
import { sendCityName } from "../design/chooseCity";
import fetchingURL from "./primaryFetch";

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
export const fetchForCoordinates = async (): Promise<coordinatesType> => {
  try {
    const { lat, lon, display_name } = await getAPIdata();
    const coordinates: coordinatesType = {
      lon: +lon,
      lat: +lat,
      name: display_name,
    };
    return coordinates;
  } catch (error) {
    console.log("Error in coordinate Fetching:", error);
    throw error;
  }
};

export const getAPIdata = async () => {
  let userEnteredCityName = sendCityName();
  if (userEnteredCityName.length < 1) {
    userEnteredCityName =
      cityNames[Math.floor(Math.random() * cityNames.length)];
  }
  const cityName = OpenStreetMapAPI(userEnteredCityName);
  const response: Response | undefined = await fetchingURL(cityName);
  const result = await response.json();
  if (result.length === 0) throw new Error("Co-ordinates not found");
  return result[0];
};

interface coordinatesType {
  lat: number;
  lon: number;
  name: string;
}
