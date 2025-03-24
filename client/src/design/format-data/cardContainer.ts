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

  weather.addEventListener("click", async () => {
    weather.classList.remove("selected-divButton");
    forecast.classList.add("selected-divButton");
    panelHeading.innerText = "Weather";
    tabMonitor.previousTab = tabMonitor.currentTab;
    tabMonitor.currentTab = "Weather";
    await renderCardChildren();
  });
  forecast.addEventListener("click", async () => {
    forecast.classList.remove("selected-divButton");
    weather.classList.add("selected-divButton");
    panelHeading.innerText = "Forecast";
    tabMonitor.previousTab = tabMonitor.currentTab;
    tabMonitor.currentTab = "Forecast";
    hideLoadingScreenForLoader3();
    await renderCardChildren();
  });
};

async function renderCardChildren() {
  if (tabMonitor.currentTab === tabMonitor.previousTab) {
    return;
  }
  if (tabMonitor.currentTab === "Weather") {
    const fresh_URL: string = getWeatherAPI(
      globalObject.lat,
      globalObject.lon,
      "current"
    );
    applyLoadingScreenForLoader3();
    await showCurrentWeather(fresh_URL);
    hideLoadingScreenForLoader3();
  } else {
    const fresh_URL: string = getWeatherAPI(
      globalObject.lat,
      globalObject.lon,
      "forecast"
    );
    applyLoadingScreenForLoader3();
    await showForecast(fresh_URL);
    hideLoadingScreenForLoader3();
  }
}

export default async function cardContainer() {
  handlePanelSwitching();
  await fetchingStructuredValueFrom_API();
  renderCityTitle();
  await renderCardChildren();
  hideLoadingScreenForLoader2();
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

function hideLoadingScreenForLoader2() {
  const loader2 = document.querySelector<HTMLDivElement>("#loader2");
  if (loader2) {
    loader2.style.display = "none";
  }
}
function hideLoadingScreenForLoader3() {
  const loader3 = document.querySelector<HTMLDivElement>("#loader3");
  if (loader3) {
    loader3.style.display = "none";
  }
}
function applyLoadingScreenForLoader3() {
  const loader3 = document.querySelector<HTMLDivElement>("#loader3");
  if (loader3) {
    loader3.style.display = "block";
  }
}
