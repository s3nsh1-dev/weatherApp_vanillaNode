import { changeButtonValues } from "../main";
import "./design-style/displayForecast.css";
import cardContainer from "./format-data/cardContainer";

export default async function displayForecast() {
  letTheDomCreate();
  handleResetClick();
  await cardContainer();
  // Hide loader once main is done
}

const handleResetClick = () => {
  const btnElement = document.querySelector<HTMLButtonElement>("#reset")!;
  btnElement.addEventListener("click", () => {
    changeButtonValues();
  });
};

const letTheDomCreate = () => {
  const resultContainer =
    document.querySelector<HTMLDivElement>("#choice-result")!;

  resultContainer.innerHTML = `
        <nav id="switch-panel">
          <div class="divButtons" id="switch-to-weather">Weather</div>
          <div class="divButtons selected-divButton" id="switch-to-forecast">
            Forecast
          </div>
        </nav>
        <article id="weather-forecast">
        <div id="loader2">Loading..</div>
        <div class="reset-container">
          <button id="reset">Go Back</button>
          <h1 id="panel-heading">Weather</h1>
        </div>
        <div id="loader3">Loading...</div>
        <div id="city-name"></div>
        <div id="card-container"></div>
        </article>`;
};
