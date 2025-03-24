import { changeButtonValues } from "../main";
import "./design-style/selectCity.css";
import { whichButtonPressed } from "./format-data/cardContainer";
import image from "../assets/images/rainy-day.png";

export default function randomCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#random-city")!;
  cityElement.innerHTML = `
  <img class='weather-icon' src=${image} alt="rainy-logo" />
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
      whichButtonPressed("randomCity");
      changeButtonValues();
    });
  }
}
