import { fetchForCoordinates } from "../randomCity";
import { getWeatherAPI } from "../../fetching/urlList";
import fetchingURL from "../../fetching/primaryFetch";

const containerElement = document.getElementById(
  "card-container"
)! as HTMLDivElement;

export default async function cardContainer() {
  const coObject = await fetchForCoordinates();
  //   console.log("Name:", coObject.name);
  const fresh_URL = getWeatherAPI(coObject.lon, coObject.lat, "current");
  const response = await fetchingURL(fresh_URL);
  const data = await response.json();
  console.log("what we get:", data);

  for (let i = 0; i < 6; i++) {
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("w-card");
    weatherCard.innerHTML = `Hi CHild`;
    containerElement.appendChild(weatherCard);
  }
}
