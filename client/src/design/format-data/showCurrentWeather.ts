import afternoon from "../../../public/images/afternoon.jpg";
import midnight from "../../../public/images/midnight.jpg";
import night from "../../../public/images/night.jpg";
import morning from "../../../public/images/morning.jpg";
import evening from "../../../public/images/evening.png";
import dawn from "../../../public/images/dawn.jpg";
import fetchingURL from "../../fetching/primaryFetch";

let unit: string = `celsius`;
const celsiusSymbol = `°C`;
const fahrenheitSymbol = `°F`;

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
  correctUnit(fresh_URL);
  const containerElement = document.getElementById(
    "card-container"
  ) as HTMLDivElement;
  if (!containerElement) {
    console.error("reset-container not found");
    return;
  }
  containerElement.innerHTML = "";

  const response: Response = await fetchingURL(fresh_URL);
  const data_API: any = await response.json();
  const finalTimeObject: timeType[] = prepareTimeObject(data_API);

  let cardsHTML = "";
  for (let i = 0; i < 6; i++) {
    cardsHTML += `
    <div class="w-cards">
      <img class="card-image" src="${
        finalTimeObject[i].imageSrc
      }" alt="weather_pic"/>
      <div class="display-box">
        <div><span class="what-period">${
          finalTimeObject[i].period
        }</span> <span class="sub-time">(${
      finalTimeObject[i].time
    })</span></div>
        <div class="what-date"><span class="span-heading">Date:</span> <span class="answer">${
          finalTimeObject[i].date
        }</span></div>
        <div class="what-temperature"><span class="span-heading">Temperature:</span> <span class="answer">${convertTemperature(
          finalTimeObject[0].temperature,
          unit
        )}${unit === "celsius" ? celsiusSymbol : fahrenheitSymbol}</span></div>
      </div>
    </div>`;
  }
  containerElement.innerHTML = cardsHTML;
}

function correctUnit(fresh_URL: string) {
  const radioButtons = document.querySelectorAll('input[name="tempUnit"]');

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      const activeRadio = document.querySelector(
        'input[name="tempUnit"]:checked'
      )!;
      unit = activeRadio.id;
      // Re-render the weather cards immediately
      showCurrentWeather(fresh_URL);
    });
  });
}

function convertTemperature(value: number, conversionType: string) {
  if (conversionType === "celsius") {
    // Convert Celsius to Fahrenheit
    return ((value * 9) / 5 + 32).toFixed(1);
  } else if (conversionType === "fahrenheit") {
    // Convert Fahrenheit to Celsius
    return (((value - 32) * 5) / 9).toFixed(1);
  } else {
    throw new Error(
      "Invalid conversion type. Use 'CtoF' for Celsius to Fahrenheit or 'FtoC' for Fahrenheit to Celsius."
    );
  }
}
