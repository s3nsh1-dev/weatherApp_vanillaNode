import { OpenStreetMapAPI } from "../fetching/urlList";

export default function chooseCity(): void {
  const cityElement = document.querySelector<HTMLDivElement>("#choose-city")!;
  cityElement.innerHTML = `<label class="secondary-heading" for="city-label">Enter City Name</label>
    <input type="text" id="city-label" />
    <button id="get-weather" class="search-button">Get Weather</button>`;

  const cityInput = document.querySelector<HTMLInputElement>("#city-label")!;
  const getWeather = document.querySelector<HTMLButtonElement>("#get-weather")!;

  if (getWeather && cityInput) {
    getWeather.addEventListener("click", () => {
      console.log("sending.....", cityInput.value);
      const cityName = OpenStreetMapAPI(
        (cityInput.value as string) || "new york"
      );
      console.log("City Name:", JSON.stringify(cityName));
      console.log("we clicked");
    });
  }
}
