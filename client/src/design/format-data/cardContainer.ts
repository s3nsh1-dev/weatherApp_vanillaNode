import showCurrentWeather from "./showCurrentWeather";
import showForecast from "./showForecast";
import "../design-style/cardContainer.css";
import { fetchForCoordinates } from "../../fetching/urlList";
import { getWeatherAPI } from "../../fetching/urlList";
import "../design-style/cardContainer.css";
interface monitorType {
  currentTab: string;
  previousTab: string;
}

interface coordinatesType {
  lat: number;
  lon: number;
  name: string;
}

let tabMonitor: monitorType = {
  currentTab: "Weather",
  previousTab: "Weather",
};

export default async function cardContainer() {
  handlePanelSwitching();
  const coObject: coordinatesType = await fetchForCoordinates();
  const displayCityName = document.getElementById("city-name") as HTMLElement;
  displayCityName.innerHTML = `<h1>${coObject.name}</h1>`;

  if (tabMonitor.currentTab === "Weather") {
    const fresh_URL: string = getWeatherAPI(
      coObject.lat,
      coObject.lon,
      "current"
    );
    showCurrentWeather(fresh_URL);
  } else {
    const fresh_URL: string = getWeatherAPI(
      coObject.lat,
      coObject.lon,
      "forecast"
    );
    showForecast(fresh_URL);
  }
}

const handlePanelSwitching = () => {
  const weather = document.querySelector<HTMLDivElement>("#switch-to-weather")!;
  const forecast = document.querySelector<HTMLDivElement>(
    "#switch-to-forecast"
  )!;
  const panelHeading = document.getElementById(
    "panel-heading"
  )! as HTMLDivElement;

  weather.addEventListener("click", () => {
    weather.classList.remove("selected-divButton");
    forecast.classList.add("selected-divButton");
    panelHeading.innerText = "Weather";
    tabMonitor.previousTab = tabMonitor.currentTab;
    tabMonitor.currentTab = "Weather";
    cardContainer();
  });
  forecast.addEventListener("click", () => {
    forecast.classList.remove("selected-divButton");
    weather.classList.add("selected-divButton");
    panelHeading.innerText = "Forecast";
    tabMonitor.previousTab = tabMonitor.currentTab;
    tabMonitor.currentTab = "Forecast";
    cardContainer();
  });
};
// function whatIsTheCurrentTab() {
//   return "";
// }
