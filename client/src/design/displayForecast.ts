import { changeButtonValues } from "../main";
import "./design-style/displayForecast.css";

export default function displayForecast() {
  const displayElem = document.querySelector<HTMLDivElement>("#choice-result")!;
  displayElem.innerHTML = `
        <nav id="switch-panel">
          <div class="divButtons" id="switch-to-weather">Weather</div>
          <div class="divButtons selected-divButton" id="switch-to-forecast">Forecast</div>
        </nav>
        <article id="weather-forecast">
        <div class="reset-container">
            <button id="reset">Go Back</button>
            <h1 id="panel-heading">Weather</h1>
        </div>
          <div id="card-container">
            <div class="api-cards"></div>
          </div>
        </article>`;
  handleResetClick();
  handlePanelSwitching();
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
