import { fetchForCoordinates } from "../randomCity";
import { getWeatherAPI } from "../../fetching/urlList";
import fetchingURL from "../../fetching/primaryFetch";

export default async function cardContainer() {
  const containerElement = document.getElementById(
    "card-container"
  ) as HTMLDivElement;
  if (!containerElement) {
    console.error("card-container element not found");
    return;
  }
  const coObject = await fetchForCoordinates();
  //   console.log("Name:", coObject.name);
  const fresh_URL = getWeatherAPI(coObject.lon, coObject.lat, "current");
  const response = await fetchingURL(fresh_URL);
  const data = await response.json();
  console.log("what we get:", data);

  let cardsHTML = "";
  for (let i = 0; i < 6; i++) {
    cardsHTML += `<div class="w-cards">I am here</div>`;
  }
  containerElement.innerHTML = cardsHTML;
}
