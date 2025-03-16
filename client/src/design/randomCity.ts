import { OpenStreetMapAPI } from "../fetching/urlList";
import { cityNames } from "../constants/constVariables";
import { changeButtonValues } from "../main";
import "./design-style/selectCity.css";

export default function randomCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#random-city")!;
  cityElement.innerHTML = `
  <img class='weather-icon' src="../images/rainy-day.png" alt="rainy-logo" />
  <div class="city-container">
    <label class="secondary-heading top-gap">Check Random City</label>
    <button id="show-random-weather" class="search-button">Random Weather</button>
  </div>
  `;

  const showWeather = document.querySelector<HTMLButtonElement>(
    "#show-random-weather"
  )!;

  if (showWeather) {
    showWeather.addEventListener("click", () => {
      const randomCity =
        cityNames[Math.floor(Math.random() * cityNames.length)];
      const cityName = OpenStreetMapAPI(randomCity);
      console.log("City Name:", JSON.stringify(cityName));
      changeButtonValues();
    });
  }
}
