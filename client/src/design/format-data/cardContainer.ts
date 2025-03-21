import { fetchForCoordinates } from "../randomCity";
import { getWeatherAPI } from "../../fetching/urlList";
import fetchingURL from "../../fetching/primaryFetch";
import afternoon from "../../../public/images/afternoon.jpg";
import midnight from "../../../public/images/midnight.jpg";
import night from "../../../public/images/night.jpg";
import morning from "../../../public/images/morning.jpg";
import evening from "../../../public/images/evening.png";
import dawn from "../../../public/images/dawn.jpg";

interface timeType {
  time: string;
  period: string;
  imageSrc: any;
  date: string;
  temperature: string;
}

export default async function cardContainer() {
  const containerElement = document.getElementById(
    "card-container"
  ) as HTMLDivElement;
  if (!containerElement) {
    console.error("card-container element not found");
    return;
  }

  const coObject = await fetchForCoordinates();
  const fresh_URL = getWeatherAPI(coObject.lon, coObject.lat, "current");
  const response: Response = await fetchingURL(fresh_URL);
  const data_API: any = await response.json();
  const finalTimeObject = prepareTimeObject(data_API);
  console.log("Time Array : ", finalTimeObject);
  // let cardsHTML = "";
  // for (let i = 0; i < 6; i++) {
  //   cardsHTML += `<div class="w-cards">
  //   <img src="${image}" alt="weather_pic"/>
  //   <div class="displayBox">
  //     <div class="WhatTime">${date}: ${time}</div>
  //     <div class="whatTemperature">${temperature}</div>
  //   </div>`;
  //   containerElement.innerHTML = cardsHTML;
  // }
}

function prepareTimeObject(data_API: any) {
  const timeArray: timeType[] = [
    {
      time: "",
      period: "Midnight",
      imageSrc: midnight,
      date: "",
      temperature: "",
    },
    { time: "", period: "Dawn", imageSrc: dawn, date: "", temperature: "" },
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
  console.log("Fetched API data", data_API);
  return timeArray;
}
