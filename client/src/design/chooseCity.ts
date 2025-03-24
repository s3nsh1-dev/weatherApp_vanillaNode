import { changeButtonValues } from "../main";
import "./design-style/selectCity.css";
import { whichButtonPressed } from "./format-data/cardContainer";
import image from "../assets/images/weather-app.png";

export default function chooseCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#choose-city")!;
  cityElement.innerHTML = `
  <img class='weather-icon' src=${image} alt="weather-logo" />
  <div class="city-container">
    <label class="secondary-heading" for="city-label">Enter City Name</label>
    <input type="text" id="city-label" placeholder="e.g., New York"/>
    <button id="get-weather" class="search-button">Get Weather</button>
  </div>
  `;

  const getWeather = document.querySelector<HTMLButtonElement>("#get-weather")!;
  const cityInput = document.querySelector<HTMLInputElement>("#city-label")!;

  if (getWeather && cityInput) {
    getWeather.addEventListener("click", () => {
      whichButtonPressed("chooseCity");
      changeButtonValues();
    });
  }
}
