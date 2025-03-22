export default function showForecast(fresh_URL: string) {
  const containerElement = document.getElementById(
    "card-container"
  )! as HTMLDivElement;
  containerElement.innerHTML = `${fresh_URL}`;
}
