import { changeButtonValues } from "../main";
import "./design-style/displayForecast.css";
import cardContainer from "./format-data/cardContainer";

export default function displayForecast() {
  const displayElem = document.querySelector<HTMLDivElement>("#choice-result")!;
  const switchPanel = document.querySelector<HTMLDivElement>("#switch-panel")!;
  const resentContainer =
    document.querySelector<HTMLDivElement>(".reset-container")!;
  switchPanel.innerHTML = `
        <div class="divButtons" id="switch-to-weather">Weather</div>
        <div class="divButtons selected-divButton" id="switch-to-forecast">Forecast</div>`;
  resentContainer.innerHTML = `
        <button id="reset">Go Back</button>
        <h1 id="panel-heading">Weather</h1>`;
  handleResetClick();
  handlePanelSwitching();
  cardContainer();
}

const handleResetClick = () => {
  const btnElement = document.querySelector<HTMLButtonElement>("#reset")!;
  btnElement.addEventListener("click", () => {
    changeButtonValues();
  });
};

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
  });
  forecast.addEventListener("click", () => {
    forecast.classList.remove("selected-divButton");
    weather.classList.add("selected-divButton");
    panelHeading.innerText = "Forecast";
  });
};
