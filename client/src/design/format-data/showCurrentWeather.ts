import afternoon from "../../../public/images/afternoon.jpg";
import midnight from "../../../public/images/midnight.jpg";
import night from "../../../public/images/night.jpg";
import morning from "../../../public/images/morning.jpg";
import evening from "../../../public/images/evening.png";
import dawn from "../../../public/images/dawn.jpg";
import fetchingURL from "../../fetching/primaryFetch";

let unit = `°C`;

interface timeType {
  time: string;
  period: string;
  imageSrc: any;
  date: string;
  temperature: number;
}

function prepareTimeObject(data_API: any) {
  const currentDate = data_API.current.time.slice(0, 10);
  const timeArray: timeType[] = [
    {
      time: "1:00 - 4:00",
      period: "Midnight",
      imageSrc: midnight,
      date: currentDate,
      temperature: 0,
    },
    {
      time: "4:00 - 8:00",
      period: "Dawn",
      imageSrc: dawn,
      date: currentDate,
      temperature: 0,
    },
    {
      time: "8:00 - 12:00",
      period: "Morning",
      imageSrc: morning,
      date: currentDate,
      temperature: 0,
    },
    {
      time: "12:00 - 16:00",
      period: "Afternoon",
      imageSrc: afternoon,
      date: currentDate,
      temperature: 0,
    },
    {
      time: "16:00 - 20:00",
      period: "Evening",
      imageSrc: evening,
      date: currentDate,
      temperature: 0,
    },
    {
      time: "20:00 - 24:00",
      period: "Night",
      imageSrc: night,
      date: currentDate,
      temperature: 0,
    },
  ];

  const tempArray: number[] = [];
  for (let i = 0; i < data_API.hourly.temperature_2m.length / 2; i++) {
    if (i % 2 !== 0) {
      tempArray.push(data_API.hourly.temperature_2m[i * 2 - 1]);
    }
  }
  for (let j = 0; j < timeArray.length; j++) {
    timeArray[j].temperature = tempArray[j];
  }
  return timeArray;
}

export default async function showCurrentWeather(fresh_URL: string) {
  const containerElement = document.getElementById(
    "card-container"
  ) as HTMLDivElement;
  if (!containerElement) {
    console.error("reset-container not found");
    return;
  }
  containerElement.innerHTML = "";

  //   const response: Response = await fetchingURL(fresh_URL);
  //   const data_API: any = await response.json();
  //   const finalTimeObject: timeType[] = prepareTimeObject(data_API);
  //   console.log("Time Array : ", finalTimeObject);

  let cardsHTML = "";
  for (let i = 0; i < 6; i++) {
    // cardsHTML += `
    // <div class="w-cards">
    //   <img class="card-image" src="${finalTimeObject[i].imageSrc}" alt="weather_pic"/>
    //   <div class="display-box">
    //     <div><span class="what-period">${finalTimeObject[i].period}</span> <span class="sub-time">(${finalTimeObject[i].time})</span></div>
    //     <div class="what-date"><span class="span-heading">Date:</span> <span class="answer">${finalTimeObject[i].date}</span></div>
    //     <div class="what-temperature"><span class="span-heading">Temperature:</span> <span class="answer">${finalTimeObject[0].temperature}${unit}</span></div>
    //   </div>
    // </div>`;
    cardsHTML += `<div>i am showing current weather</div>`;
  }
  containerElement.innerHTML = cardsHTML;
}
