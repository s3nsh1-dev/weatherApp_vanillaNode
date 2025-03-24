import { changeButtonValues } from "../main";
import "./design-style/displayForecast.css";
import cardContainer from "./format-data/cardContainer";

export default function displayForecast() {
  letTheDomCreate();
  handleResetClick();
  cardContainer();
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
          <div class="reset-container">
            <button id="reset">Go Back</button>
            <h1 id="panel-heading">Weather</h1>
          </div>
          <div id="city-name"></div>
          <div id="card-container"></div>
        </article>`;
};
