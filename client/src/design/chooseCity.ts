import { changeButtonValues } from "../main";
import "./design-style/selectCity.css";

export default function chooseCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#choose-city")!;
  cityElement.innerHTML = `
  <img class='weather-icon' src="../images/weather-app.png" alt="weather-logo" />
  <div class="city-container">
    <label class="secondary-heading" for="city-label">Enter City Name</label>
    <input type="text" id="city-label" placeholder="e.g., New York"/>
    <button id="get-weather" class="search-button">Get Weather</button>
  </div>
  `;

  const cityInput = document.querySelector<HTMLInputElement>("#city-label")!;
  const getWeather = document.querySelector<HTMLButtonElement>("#get-weather")!;

  if (getWeather && cityInput) {
    getWeather.addEventListener("click", () => {
      changeButtonValues();
    });
  }
}
