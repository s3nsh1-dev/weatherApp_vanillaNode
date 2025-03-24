import showCurrentWeather from "./showCurrentWeather";
import showForecast from "./showForecast";
import "../design-style/cardContainer.css";
import { fetchForCoordinates } from "../../fetching/urlList";
import { getWeatherAPI } from "../../fetching/urlList";
import "../design-style/cardContainer.css";
import { cityNames } from "../../constants/constVariables";

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
  previousTab: "Forecast",
};

let globalObject: coordinatesType;
let gCity: string = "new york";

async function fetchingStructuredValueFrom_API() {
  globalObject = await fetchForCoordinates(gCity);
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
    renderCardChildren();
  });
  forecast.addEventListener("click", () => {
    forecast.classList.remove("selected-divButton");
    weather.classList.add("selected-divButton");
    panelHeading.innerText = "Forecast";
    tabMonitor.previousTab = tabMonitor.currentTab;
    tabMonitor.currentTab = "Forecast";
    renderCardChildren();
  });
};

function renderCardChildren() {
  if (tabMonitor.currentTab === tabMonitor.previousTab) {
    return;
  }
  if (tabMonitor.currentTab === "Weather") {
    const fresh_URL: string = getWeatherAPI(
      globalObject.lat,
      globalObject.lon,
      "current"
    );
    showCurrentWeather(fresh_URL);
  } else {
    const fresh_URL: string = getWeatherAPI(
      globalObject.lat,
      globalObject.lon,
      "forecast"
    );
    showForecast(fresh_URL);
  }
}

export default async function cardContainer() {
  handlePanelSwitching();
  await fetchingStructuredValueFrom_API();
  renderCityTitle();
  renderCardChildren();
}

function renderCityTitle() {
  const display = document.getElementById("city-name") as HTMLElement;
  display.innerHTML = `<h1>${globalObject.name}!</h1>`;
}

export function whichButtonPressed(ButtonId: string) {
  if (ButtonId === "chooseCity") {
    const cityInput = document.querySelector<HTMLInputElement>("#city-label")!;
    gCity = cityInput.value;
    if (gCity === "") {
      gCity = "new york";
    }
  } else {
    gCity = cityNames[Math.floor(Math.random() * cityNames.length)];
  }
}
