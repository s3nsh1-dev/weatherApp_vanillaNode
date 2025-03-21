import { fetchForCoordinates } from "../randomCity";
import { getWeatherAPI } from "../../fetching/urlList";
import fetchingURL from "../../fetching/primaryFetch";
import afternoon from "../../../public/images/afternoon.jpg";
import midnight from "../../../public/images/midnight.jpg";
import night from "../../../public/images/night.jpg";
import morning from "../../../public/images/morning.jpg";
import evening from "../../../public/images/evening.png";
import dawn from "../../../public/images/dawn.jpg";

const timeArray = [
  {
    time: "",
    period: "Midnight",
    imageSrc: midnight,
    date: "",
    temperature: "",
  },
  { time: "", period: "Dawn", imageSrc: "image2", date: "", temperature: "" },
  {
    time: "",
    period: "Morning",
    imageSrc: morning,
    date: "",
    temperature: "",
  },
  {
    time: "",
    period: "Afternoon",
    imageSrc: afternoon,
    date: "",
    temperature: "",
  },
  {
    time: "",
    period: "Evening",
    imageSrc: evening,
    date: "",
    temperature: "",
  },
  { time: "", period: "Night", imageSrc: night, date: "", temperature: "" },
];

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
  console.log("NEXT:", data.current.temperature_2m);
  let cardsHTML = "";
  for (let i = 0; i < 6; i++) {
    cardsHTML += `<div class="w-cards">
    <img src="${image}" alt="weather_pic"/>
    <div class="displayBox">
      <div class="WhatTime">${date}: ${time}</div>
      <div class="whatTemperature">${temperature}</div>
    </div>`;
    containerElement.innerHTML = cardsHTML;
  }
}
