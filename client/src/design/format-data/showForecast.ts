import fetchingURL from "../../fetching/primaryFetch";
import image from "../../assets/images/weather-app.png";

let unit: string = `celsius`;
const celsiusSymbol = `°C`;
const fahrenheitSymbol = `°F`;

export default async function showForecast(fresh_URL: string) {
  correctUnit(fresh_URL);
  const containerElement = document.getElementById(
    "card-container"
  ) as HTMLDivElement;
  if (!containerElement) {
    console.error("reset-container not found");
    return;
  }

  const response: Response = await fetchingURL(fresh_URL);
  const data_API: any = await response.json();

  const finalForeStructure = prepareForecastObject(data_API.daily);

  let cardsHTML = ``;
  for (let i of finalForeStructure) {
    cardsHTML += `
    <div class="w-cards" id=${i.id}>
      <img class="card-image" src="${i.imageSrc}" alt="weather_pic"/>
      <div class="display-box">
        <div class="what-date"><span class="span-heading">Date:</span> <span class="answer">${
          i.date
        }</span></div>
        <div class="what-temperature"><span class="span-heading">Temperature:</span> <span class="answer">${convertTemperature(
          i.temperature,
          unit
        )}${unit === "celsius" ? celsiusSymbol : fahrenheitSymbol}</span></div>
      </div>
    </div>`;
    // cardsHTML += `<div>i am a disco dancer</div>`;
  }
  containerElement.innerHTML = cardsHTML;
}

function prepareForecastObject(sample: sampleType): forecastType[] {
  const forecastObject: forecastType[] = [
    { id: 1, imageSrc: image, date: "", temperature: 0 },
    { id: 2, imageSrc: image, date: "", temperature: 0 },
    { id: 3, imageSrc: image, date: "", temperature: 0 },
    { id: 4, imageSrc: image, date: "", temperature: 0 },
    { id: 5, imageSrc: image, date: "", temperature: 0 },
    { id: 6, imageSrc: image, date: "", temperature: 0 },
  ];
  for (let i = 0; i < sample.temperature_2m_max.length - 1; i++) {
    const index = i + 1;
    forecastObject[i].temperature = sample.temperature_2m_max[index];
    forecastObject[i].date = sample.time[index];
  }
  return forecastObject;
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
      showForecast(fresh_URL);
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

interface forecastType {
  id: number;
  imageSrc: string;
  date: string;
  temperature: number;
}

interface sampleType {
  temperature_2m_max: number[];
  time: string[];
}
