import { OpenStreetMapAPI } from "../fetching/urlList";
import { cityNames } from "../constants/constVariables";
import { changeButtonValues } from "../main";
import fetchingURL from "../fetching/primaryFetch";
import "./design-style/selectCity.css";

interface coordinatesType {
  lat: number;
  lon: number;
}

export default function randomCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#random-city")!;
  cityElement.innerHTML = `
  <img class='weather-icon' src="../images/rainy-day.png" alt="rainy-logo" />
  <div class="city-container">
    <label class="secondary-heading top-gap">Check Random City</label>
    <button id="show-random-weather" class="search-button">Random Weather</button>
  </div>
  `;

  const showWeather = document.querySelector<HTMLButtonElement>(
    "#show-random-weather"
  )!;

  if (showWeather) {
    showWeather.addEventListener("click", async () => {
      // maintain harmony between GoBack and getWeather Buttons
      changeButtonValues();
    });
  }
}

export const fetchForCoordinates = async (): Promise<coordinatesType> => {
  try {
    const { lat, lon } = await getAPIdata();
    const coordinates: coordinatesType = {
      lat: +lat,
      lon: +lon,
    };
    return coordinates;
  } catch (error) {
    console.log("Error in coordinate Fetching:", error);
    throw error;
  }
};

const getAPIdata = async () => {
  const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)];
  const cityName = OpenStreetMapAPI(randomCity);
  const response: Response | undefined = await fetchingURL(cityName);
  const result = await response.json();
  if (result.length === 0) throw new Error("Co-ordinates not found");
  return result[0];
};
